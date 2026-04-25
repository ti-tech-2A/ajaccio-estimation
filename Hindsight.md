# Hindsight — Décisions techniques & leçons apprises

> Mis à jour automatiquement à chaque changement de comportement clé.

---

## [Avril 2026] Migration moteur statique → DVF live

### Décision : Remplacement complet (Option A)
L'ancien `lib/estimation-engine.ts` utilisait des données de marché hard-codées. Remplacé par un moteur live interrogeant Supabase via PostgREST. Les données DVF étaient déjà en base et utilisées par d'autres applications.

### Dual-count : rawCount vs count
- **Problème :** utiliser le compte trimmé pour décider de l'escalade faisait monter inutilement au niveau suivant quand les données étaient suffisantes.
- **Solution :** `rawCount` (pré-trimming) pour le seuil d'escalade ; `count` (post-trimming) pour l'indicateur de précision affiché.

### Bug — getApartmentCategory (surface only)
Version initiale : `rooms <= 2 || surface <= 50` (OR logic). La condition rooms écrasait la surface. Corrigé en classification surface uniquement, conforme à la segmentation CLAUDE.md.

### Bug — filtre nombre_pieces dans Level 1
Retiré. Le Level 1 filtre uniquement par catégorie de surface, pas par nombre de pièces.

### Bug — queryLevel3 villa sans filtre surface
Sans filtre, L3 mélangeait des villas de toutes tailles. Corrigé : filtre ±50% surface pour les villas.

### Bug — isolation des mocks Jest
Les compteurs d'appels mock s'accumulaient entre describe blocks. Corrigé : `beforeEach(jest.clearAllMocks)` global + reset de tous les mocks vers `{priceSqm:0, count:0, rawCount:0}`.

### Bug — test "4 comparables → 1 point"
Scénario initial : L1 rawCount=4 → escalade L2+L3 → zeros → precisionLevel=0 au lieu de 1. Corrigé : L3 retourne `{priceSqm:3100, count:4, rawCount:4}`.

### Coefficients négatifs appartement
Les features appartement n'avaient que des valeurs positives → cap -40% non testable. Ajout de `'DPE F/G': -0.06`, `'Vis-à-vis direct': -0.03`, `'Nuisances sonores': -0.04`.

### Supabase — pas de connection pooling nécessaire
`@supabase/supabase-js` utilise PostgREST (HTTP), pas de connexions PostgreSQL directes. Le conseil "Transaction mode" Supabase était incorrect pour ce cas d'usage.

### TypeScript — narrowing `never` dans test E2E
`requestPayload` déclaré `Record<string, unknown> | null`, après `expect(...).not.toBeNull()`, TypeScript ne narrowait pas. Corrigé : `as unknown as Record<string, unknown>`.
