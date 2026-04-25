# Primer — ajaccio-estimation.fr

Plateforme d'estimation immobilière dédiée à Ajaccio. Génère des leads vendeurs via un moteur DVF hybride.

## Stack
Next.js 15 App Router · TypeScript · Tailwind · Supabase (PostgREST) · Vercel · n8n · Notion CRM

## Règles critiques (ne pas oublier)
- **CP 20167** : toujours filtrer `commune = 'Ajaccio' AND code_insee = '2A004'` — exclut Alata
- **SERVICE_ROLE_KEY** : uniquement dans `/api/*`, jamais dans le bundle client
- **Coefficients** : plafond cumulatif ±40%
- **Précision** : 9 transactions trimmed = 2 pts, 10 = 3 pts — règle stricte sans exception
- **Terrain** : non supporté (422 si demandé)

## Moteur d'estimation (lib/estimation/)
```
engine.ts        ← orchestrateur async (computeEstimation)
coefficients.ts  ← computeCoefficients(), plafond ±40%
fallback.ts      ← queryLevel1/2/3, getApartmentCategory, withPostalFilter
```
Fallback : L1 (CP+catégorie+24mo) → rawCount<5 → L2 (CP+36mo) → rawCount<5 → L3 (CPs voisins+48mo)

## Dual-count
- `rawCount` : pré-trimming quartiles → seuil d'escalade (< 5 = niveau suivant)
- `count` : post-trimming → indicateur de précision affiché

## API Routes
| Route | Usage |
|---|---|
| `POST /api/estimate` | Wizard — estimation sans lead obligatoire |
| `POST /api/leads` | Formulaire final — persistance + webhook n8n |
| `GET /api/health` | Keep-alive Supabase (ping hebdo GitHub Actions) |

## Tests
```bash
npm run test:unit   # Jest 12/12 ✅
npm run test:e2e    # Playwright
npx tsc --noEmit    # TypeScript ✅
```

## État (avril 2026)
- Moteur DVF live en production (remplace l'ancien moteur statique)
- `lib/estimation-engine.ts` supprimé (remplacé par `lib/estimation/engine.ts`)
- GitHub : https://github.com/ti-tech-2A/ajaccio-estimation
