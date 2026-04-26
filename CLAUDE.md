# CLAUDE.md — ajaccio-estimation.fr

> Fichier de contexte projet pour Claude Code.
> À placer à la racine du repository.
> Mis à jour : avril 2026 — PRD v2.0

---

## 1. Vue d'ensemble du projet

**ajaccio-estimation.fr** est une plateforme web d'estimation immobilière en ligne, dédiée exclusivement à la commune d'Ajaccio.

### Ce que fait le site
- Moteur d'estimation hybride (calcul automatique DVF + expertise humaine)
- Observatoire du marché immobilier alimenté par les données DVF
- Génération de leads vendeurs (formulaire multi-étapes)
- Contenu éditorial SEO/AEO sur le marché ajaccien

### Ce que le site ne fait PAS
- Pas d'estimation pour Porticcio, Bastelicaccia, Alata ou toute autre commune
- Pas de gestion de biens (pas de listing)
- Pas d'espace utilisateur / authentification frontend

---

## 2. Stack technique

```
Framework     : Next.js 15 (App Router, TypeScript)
Styles        : Tailwind CSS
BDD           : Supabase (PostgreSQL) — projet "ESTIM CORSICA"
Hébergement   : Vercel (déploiement continu depuis GitHub)
Domaine       : IONOS → DNS vers Vercel
Automatisation: n8n
CRM           : Notion
Analytics     : Google Analytics 4 (consent mode v2)
Cartographie  : Leaflet + OpenStreetMap (MVP)
Graphiques    : Recharts
Tests E2E     : Playwright
Tests unitaires: Jest
```

---

## 3. Structure du projet

```
/
├── app/
│   ├── page.tsx                    # Accueil (/)
│   ├── estimer/
│   │   └── page.tsx                # Estimateur (/estimer)
│   ├── marche/
│   │   ├── page.tsx                # Marché global (/marche/)
│   │   ├── 20000/
│   │   │   └── page.tsx            # Marché 20000
│   │   ├── 20090/
│   │   │   └── page.tsx            # Marché 20090
│   │   └── 20167/
│   │       └── page.tsx            # Marché 20167 — Mezzavia UNIQUEMENT
│   ├── ajaccio/
│   │   └── page.tsx                # Fiche commune
│   ├── simulateur-fiscal/
│   │   └── page.tsx                # Simulateur fiscal (V2)
│   ├── expert/
│   │   └── page.tsx                # Page expert
│   ├── faq/
│   │   └── page.tsx                # FAQ (AEO)
│   ├── mentions-legales/
│   │   └── page.tsx
│   └── politique-confidentialite/
│       └── page.tsx
├── api/
│   ├── estimate/
│   │   └── route.ts                # POST — moteur d'estimation
│   ├── leads/
│   │   └── route.ts                # POST — insertion lead
│   └── contact/
│       └── route.ts                # POST — formulaire de rappel
├── components/
│   ├── estimation/
│   │   ├── EstimationWizard.tsx    # Wizard 5 étapes
│   │   ├── EstimationResult.tsx    # Affichage résultat + précision
│   │   └── PrecisionIndicator.tsx  # Points verts (0-3)
│   ├── market/
│   │   ├── PriceChart.tsx          # Graphique tendances
│   │   ├── TransactionsTable.tsx   # Dernières ventes DVF
│   │   └── DataFreshnessBadge.tsx  # Date MAJ DVF avec <time>
│   ├── forms/
│   │   └── ContactForm.tsx         # Formulaire de rappel
│   └── ui/                         # Composants UI génériques
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Client Supabase (anon — lecture publique limitée)
│   │   └── server.ts               # Client Supabase serveur (SERVICE_ROLE_KEY)
│   ├── estimation/
│   │   ├── engine.ts               # Moteur de calcul
│   │   ├── coefficients.ts         # Coefficients appartements + villas
│   │   └── fallback.ts             # Logique de requêtes niveaux 1-2-3
│   └── constants.ts                # Constantes globales (CPs, dates MAJ DVF, etc.)
├── types/
│   └── index.ts                    # Types TypeScript partagés
└── __tests__/
    ├── unit/
    │   └── estimation/             # Tests Jest moteur d'estimation
    └── e2e/
        └── wizard.spec.ts          # Tests Playwright parcours critiques
```

---

## 4. Variables d'environnement

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Clé publique — lecture limitée uniquement
SUPABASE_SERVICE_ROLE_KEY=          # JAMAIS exposée côté client

# Google Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID=

# n8n
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
```

**Règle absolue** : `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais apparaître dans le bundle client. Elle est utilisée uniquement dans les API Routes (`/api/*`).

---

## 5. Périmètre géographique — RÈGLES CRITIQUES

### Codes postaux couverts

| CP | Zone | Filtre Supabase |
|---|---|---|
| 20000 | Ajaccio | `code_postal = '20000'` |
| 20090 | Ajaccio | `code_postal = '20090'` |
| 20167 | Ajaccio — Mezzavia UNIQUEMENT | `code_postal = '20167' AND commune = 'Ajaccio' AND code_insee = '2A004'` |

### ⚠️ CP 20167 — Point critique

Le code postal 20167 couvre **deux communes distinctes** :
- **Mezzavia** → commune d'Ajaccio (INSEE 2A004) → **inclus dans le site**
- **Alata** → commune indépendante (INSEE distinct) → **exclu du site**

**Toute requête Supabase impliquant le CP 20167 doit obligatoirement filtrer sur `commune = 'Ajaccio'` ET `code_insee = '2A004'`.** Un filtre sur le code postal seul est insuffisant et produirait des données incorrectes.

Les CPs 20000 et 20090 n'ont pas cette ambiguïté — filtre CP seul suffisant.

---

## 6. Moteur d'estimation

### Fichiers concernés
- `lib/estimation/engine.ts` — logique principale
- `lib/estimation/coefficients.ts` — tables de coefficients
- `lib/estimation/fallback.ts` — gestion des requêtes et fallbacks
- `app/api/estimate/route.ts` — endpoint API

### Algorithme

```
1. Requête Supabase (niveau 1) :
   CP + commune + type de bien + catégorie de surface + 24 mois
   
2. Nettoyage outliers :
   Supprimer les 25% les plus bas ET les 25% les plus hauts
   
3. Prix de référence :
   Médiane des 50% centraux restants
   
4. Application des coefficients :
   (voir lib/estimation/coefficients.ts)
   Plafond cumulatif : ±40%
   
5. Fourchette :
   prix_bas = prix_référence × (1 - 0.10)
   prix_haut = prix_référence × (1 + 0.10)
   
6. Fallback si < 5 comparables :
   Niveau 2 : CP + commune + type + 36 mois (sans catégorie)
   Niveau 3 : CP + commune + type + 48 mois + CP voisins
   
7. Niveau de précision :
   ≥ 10 transactions → 3 points verts
   5 à 9            → 2 points verts  (9 = 2 points, STRICT)
   2 à 4            → 1 point vert
   0 à 1            → insuffisant (pas de fourchette, formulaire rappel direct)
```

### Segmentation des appartements

| Catégorie | Pièces | Surface |
|---|---|---|
| Studio & T2 | ≤ 2 pièces | ≤ 50 m² |
| T3 | 3 pièces | 51-75 m² |
| T4 | 4 pièces | 76-100 m² |
| T5+ | ≥ 5 pièces | > 100 m² |

### Sections cadastrales (Niveau 4 — V2)

**20000**
- Centre historique / Cours Napoléon
- Quartier des Étrangers
- Trottel
- Parc Berthault
- Terre Sacrée
- Route des Sanguinaires (Scudo, Barbicaggia)

**20090**
- Aspretto / Campo dell'Oro
- Bodiccione
- Octroi
- Les Cannes - Les Salines
- Binda
- Saint-Joseph
- Candia
- Saint-Jean
- La Pietrina / Jardins de l'Empereur

**20167 — Mezzavia** : sections à définir après audit DVF

---

## 7. Base de données Supabase

### Tables principales

```sql
-- Transactions DVF (existante — vérifier présence des champs commune et code_insee)
dvf_transactions (
  id, date_mutation, type_local, surface_reelle_bati,
  valeur_fonciere, code_postal, commune, code_insee,
  latitude, longitude, ...
)

-- Leads capturés
leads (
  id UUID PK, created_at TIMESTAMPTZ,
  full_name TEXT, email TEXT, phone TEXT,
  property_type ENUM, postal_code TEXT,
  commune TEXT,              -- obligatoire pour le 20167
  commune_code_insee TEXT,   -- obligatoire pour le 20167
  surface INTEGER, rooms INTEGER, bedrooms INTEGER,
  floor INTEGER, total_floors INTEGER, land_surface INTEGER,
  year_built INTEGER, condition ENUM, features JSONB,
  estimated_price_low INTEGER, estimated_price_high INTEGER,
  estimated_price_sqm INTEGER, comparable_count INTEGER,
  query_level INTEGER,       -- 1, 2 ou 3 (niveau de fallback utilisé)
  precision_level INTEGER,   -- 0, 1, 2 ou 3 (points verts affichés)
  source TEXT, utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
  status ENUM, notes TEXT,
  gdpr_consent BOOLEAN, gdpr_consent_date TIMESTAMPTZ
)

-- Estimations (historique pour calibration de l'algorithme)
estimations (
  id UUID PK, created_at TIMESTAMPTZ,
  postal_code TEXT, commune TEXT, property_type TEXT,
  surface INTEGER, query_level INTEGER, precision_level INTEGER,
  comparable_count INTEGER, price_sqm INTEGER,
  price_low INTEGER, price_high INTEGER
)

-- Demandes de rappel
contact_requests (
  id UUID PK, created_at TIMESTAMPTZ,
  full_name TEXT, phone TEXT,
  preferred_slot TEXT,       -- 'matin' | 'apres-midi' | 'indifferent'
  preferred_days TEXT[],     -- ['lundi', 'mardi', ...]
  message TEXT,
  source_page TEXT,
  status ENUM ('new', 'contacted', 'done')
)

-- Stats de marché pré-calculées (vue matérialisée)
market_stats (
  postal_code TEXT, commune TEXT, property_type TEXT,
  surface_category TEXT,
  price_sqm_median INTEGER, transaction_count INTEGER,
  price_evolution_12m DECIMAL, updated_at TIMESTAMPTZ
)
```

### Sécurité — Règles impératives

```typescript
// ✅ CORRECT — API Route côté serveur
import { createClient } from '@/lib/supabase/server'
const supabase = createClient() // utilise SERVICE_ROLE_KEY

// ❌ INTERDIT — jamais de requête DVF directe depuis le client
import { createClient } from '@/lib/supabase/client'
const { data } = await supabase.from('dvf_transactions').select('*') // FORBIDDEN
```

- RLS activée sur `dvf_transactions` — accès anon bloqué
- Rate limiting middleware sur `/api/estimate` et `/api/leads` : 10 req/min/IP
- `SUPABASE_SERVICE_ROLE_KEY` uniquement dans les API Routes

---

## 8. Patterns de rendu (ISR)

```typescript
// Pages marché CP — 30 jours
export const revalidate = 2592000

// Accueil — 24h (stats de marché en surface)
export const revalidate = 86400

// Simulateur fiscal — 90 jours
export const revalidate = 7776000

// /estimer — pas d'ISR (formulaire interactif)
// Pas de export revalidate
```

**MAJ DVF** (début mai + début novembre) : déclencher une revalidation manuelle sur toutes les pages marché via un endpoint admin protégé.

```typescript
// app/api/admin/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  // Vérifier le secret admin
  const paths = ['/marche', '/marche/20000', '/marche/20090', '/marche/20167']
  paths.forEach(p => revalidatePath(p))
  return Response.json({ revalidated: true })
}
```

---

## 9. AEO — Composants et patterns

### DataFreshnessBadge

```tsx
// components/market/DataFreshnessBadge.tsx
// À afficher sous le H1 de chaque page marché et en pied de chaque bloc DVF
<p className="text-sm text-muted">
  Données DVF actualisées au{' '}
  <time dateTime="2026-05-01">1er mai 2026</time>
  {' '}— prochaine mise à jour : novembre 2026
</p>
```

La date est centralisée dans `lib/constants.ts` :

```typescript
export const DVF_LAST_UPDATE = '2026-05-01'
export const DVF_LAST_UPDATE_LABEL = '1er mai 2026'
export const DVF_NEXT_UPDATE_LABEL = 'novembre 2026'
```

### Phrases de synthèse AEO (premier élément textuel de chaque section DVF)

```
20000 : "À Ajaccio (20000), secteur comprenant le centre-ville, le cours Napoléon,
         le quartier des Étrangers, Trottel, le Parc Berthault, la Terre Sacrée
         et la route des Sanguinaires, le prix médian au m² est de X € pour un
         appartement et Y € pour une villa, selon les données DVF actualisées au [date]."

20090 : "À Ajaccio (20090), secteur englobant Aspretto et Campo dell'Oro, Bodiccione,
         l'Octroi, Les Cannes - Les Salines, Binda, Saint-Joseph, Candia, Saint-Jean et La Pietrina
         / les Jardins de l'Empereur, le prix médian au m² est de X € pour un
         appartement et Y € pour une villa, selon les données DVF actualisées au [date]."

20167 : "À Mezzavia, quartier d'Ajaccio (20167), le prix médian au m² est de X €
         pour un appartement et Y € pour une villa, selon les données DVF
         actualisées au [date]."
```

### Schémas Schema.org à implémenter

| Schéma | Pages | Notes |
|---|---|---|
| `RealEstateAgent` | /expert/ | Nom, description, zone de couverture |
| `FAQPage` | /, pages CP, /faq/ | Sur toutes les pages avec FAQ |
| `Dataset` | /marche/, pages CP | Données DVF agrégées |
| `RealEstateListing` | Pages CP | 5 dernières transactions — adresse tronquée |
| `BreadcrumbList` | Toutes pages intérieures | Navigation hiérarchique |

### Liens sortants obligatoires (signal d'autorité AEO)

```tsx
// Bas de chaque bloc DVF
<a href="https://app.dvf.etalab.gouv.fr/" target="_blank" rel="noopener noreferrer"
   title="Accéder aux données DVF officielles">données DVF officielles</a>

// Bas du module démographie
<a href="https://www.insee.fr/" target="_blank" rel="noopener noreferrer">données INSEE</a>
```

**Ne jamais mettre `rel="nofollow"` sur ces liens** — ce sont des sources primaires officielles.

---

## 10. Conventions de code

### Nommage des fichiers

```
PascalCase   : composants React (EstimationWizard.tsx)
camelCase    : utilitaires et hooks (useEstimation.ts)
kebab-case   : routes et dossiers Next.js (marche/20000/page.tsx)
```

### Sécurité des API Routes

```typescript
// Pattern obligatoire pour toutes les API Routes
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/middleware/rateLimit'

export async function POST(req: Request) {
  // 1. Rate limiting
  const limited = await rateLimit(req, { max: 10, window: 60 })
  if (limited) return Response.json({ error: 'Too many requests' }, { status: 429 })

  // 2. Validation des inputs (zod)
  // 3. Requête Supabase avec SERVICE_ROLE_KEY
  // 4. Réponse — jamais de données DVF brutes
}
```

### Gestion du CP 20167

```typescript
// Pattern obligatoire partout où le CP 20167 est impliqué
function buildDVFQuery(postalCode: string) {
  let query = supabase.from('dvf_transactions').select('*')
    .eq('code_postal', postalCode)

  // Filtre obligatoire pour le 20167
  if (postalCode === '20167') {
    query = query.eq('commune', 'Ajaccio').eq('code_insee', '2A004')
  }

  return query
}
```

---

## 11. Tests

### Tests unitaires — Jest

```bash
# Lancer les tests unitaires
npm run test:unit

# Fichiers cibles
__tests__/unit/estimation/engine.test.ts
__tests__/unit/estimation/coefficients.test.ts
__tests__/unit/estimation/fallback.test.ts
```

Cas obligatoirement testés :
- Calcul de la médiane avec suppression des quartiles
- Application des coefficients appartements (tous les facteurs)
- Application des coefficients villas (tous les facteurs)
- Seuil de précision : 9 transactions → 2 points, 10 → 3 points (strict)
- Fallback niveau 2 et 3 quand < 5 comparables
- Filtrage CP 20167 : Mezzavia inclus, Alata exclu

### Tests E2E — Playwright

```bash
# Lancer les tests E2E
npm run test:e2e

# Fichiers cibles
__tests__/e2e/wizard.spec.ts       # Parcours complet estimateur
__tests__/e2e/recall-form.spec.ts  # Formulaire de rappel
__tests__/e2e/cp20167.spec.ts      # Cas limite Mezzavia/Alata
```

### Lighthouse CI (GitHub Actions)

```yaml
# Seuil bloquant sur PR vers staging
performance: 85
accessibility: 85
best-practices: 85
seo: 90
```

---

## 12. Design System

**Document autoritaire** : `direction-visuelle-ajaccio-estimation.md`

En cas de conflit entre ce fichier et toute autre spécification visuelle, la direction visuelle prime.

### Tokens principaux

```css
--color-primary:   #1B4F72;  /* Bleu Profond — titres, logo */
--color-accent:    #2E86AB;  /* Bleu Mer — CTAs, liens */
--color-prestige:  #C9A96E;  /* Sable Chaud — CTA prestige */
--color-secondary: #6B7F55;  /* Vert Olive — badges nature */
--color-surface:   #FAF5EC;  /* Sable Lin — fond global */
--color-text:      #5C5C5C;  /* Gris Chaud — corps de texte */
--color-text-muted:#9B9B9B;  /* Gris Clair — captions */
```

### Typographie

```css
/* Display */
font-family: 'Poppins', sans-serif;   /* H1, H2, H3, KPIs */

/* Body */
font-family: 'Open Sans', sans-serif; /* Corps de texte, labels */
```

Chargement via `next/font/google` — self-hosting automatique, `font-display: swap`.

---

## 13. Workflow de déploiement

```
git push origin dev
    ↓ (PR vers staging)
GitHub Actions : tests unitaires Jest + Lighthouse CI
    ↓ (si OK)
Vercel preview deployment — staging.ajaccio-estimation.fr
    ↓ (validation manuelle)
PR vers main
    ↓
Vercel production deployment — ajaccio-estimation.fr
```

---

## 14. Commandes utiles

```bash
# Développement
npm run dev              # Démarrer en local (localhost:3000)

# Tests
npm run test:unit        # Jest — tests unitaires
npm run test:e2e         # Playwright — tests E2E
npm run test:lighthouse  # Lighthouse CI

# Build
npm run build            # Build de production
npm run start            # Démarrer le build de production

# Supabase
npx supabase db push     # Appliquer les migrations
npx supabase gen types   # Régénérer les types TypeScript depuis le schéma
```

---

## 15. Points d'attention — Ne pas oublier

1. **CP 20167** : toujours filtrer sur `commune = 'Ajaccio'` en plus du code postal
2. **SERVICE_ROLE_KEY** : uniquement dans les API Routes, jamais dans le bundle client
3. **Coefficients** : plafond cumulatif ±40% à implémenter dans `engine.ts`
4. **Seuil de précision** : 9 = 2 points, 10 = 3 points — règle stricte, sans exception
5. **DataFreshnessBadge** : balise `<time dateTime="...">` obligatoire sur toutes les pages marché
6. **Liens sortants DVF/INSEE** : jamais en `nofollow`
7. **Contenu éditorial** : finalisé avant le développement des pages SEO
8. **Revalidation manuelle** : déclencher après chaque MAJ DVF (mai + novembre)
9. **Périmètre** : Porticcio, Bastelicaccia, Alata — hors périmètre, ne pas créer de page ni d'estimation
