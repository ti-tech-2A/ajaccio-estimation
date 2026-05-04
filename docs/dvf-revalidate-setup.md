# Auto-revalidation DVF

## Objectif
Quand les données DVF sont mises à jour dans la table `dvf_sales` du projet Supabase ESTIM CORSICA, le site Next.js doit rafraîchir automatiquement ses pages cachées (homepage, /ajaccio, /marche, /marche/{cp}).

## Architecture

```
[Import DVF dans Supabase]
        ↓ (INSERT / UPDATE / DELETE sur dvf_sales)
[Trigger Postgres statement-level]
        ↓ (1 appel HTTP par statement, pas par ligne)
[pg_net.http_post → /api/admin/revalidate]
        ↓
[Next.js revalidatePath sur 6 pages]
        ↓
[Visiteur suivant voit les nouvelles données]
```

## Setup (à faire une seule fois)

### 1. Récupérer la valeur de `ADMIN_SECRET`
- Aller sur Vercel → projet `ajaccio-estimation` → Settings → Environment Variables
- Copier la valeur de `ADMIN_SECRET`

### 2. Lancer le script SQL dans Supabase
- Aller sur Supabase → projet ESTIM CORSICA → SQL Editor → New query
- Coller le contenu de `supabase/dvf-revalidate-trigger.sql`
- Remplacer `REPLACE_ME_ADMIN_SECRET` par la valeur copiée à l'étape 1
- Run

### 3. Vérifier que le trigger est actif
Dans le SQL Editor:

```sql
select * from pg_trigger where tgname = 'dvf_sales_after_change';
```

Doit retourner 1 ligne.

## Test

Après setup, faire un INSERT/UPDATE de test dans `dvf_sales`:

```sql
-- Test (insère puis supprime une ligne factice)
insert into public.dvf_sales (id, code_commune, date_mutation, valeur_fonciere)
values (gen_random_uuid(), '2A004', '2026-01-01', 100000);

delete from public.dvf_sales where valeur_fonciere = 100000 and date_mutation = '2026-01-01';
```

Vérifier les appels HTTP:

```sql
select id, status_code, content_type, error_msg, created
from net._http_response
order by id desc
limit 5;
```

Doit montrer des `status_code = 200` (réponse OK du endpoint Next.js).

## Comportement

- **1 statement = 1 appel HTTP**. Donc un import bulk de 10 000 lignes = 1 seul appel.
- Plusieurs statements consécutifs = plusieurs appels. Idempotent et cheap (revalidate vide juste le cache).
- Async via pg_net. Ne ralentit pas l'import.

## Dépannage

**Le site ne se rafraîchit pas après import**
- Vérifier les logs `net._http_response` (étape Test ci-dessus)
- Si `error_msg` non null → vérifier le secret dans la fonction
- Si `status_code = 401` → secret incorrect, refaire étape 1+2
- Si `status_code = 404` → URL du endpoint à vérifier

**Désactiver temporairement le trigger**
```sql
alter table public.dvf_sales disable trigger dvf_sales_after_change;
-- Re-activer:
alter table public.dvf_sales enable trigger dvf_sales_after_change;
```

## Fallback

Si le trigger ne fire pas (rare), les pages se rafraîchissent automatiquement après **180 jours** (cadence DVF officielle = mai + novembre). Configuration dans `app/marche/**/page.tsx` (`export const revalidate = 15552000`).
