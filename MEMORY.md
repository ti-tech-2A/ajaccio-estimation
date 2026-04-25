# MEMORY — ajaccio-estimation.fr

Index des ressources et décisions clés. Mis à jour à chaque changement de comportement.

## Fichiers de contexte
- [CLAUDE.md](CLAUDE.md) — Contexte projet complet, règles et conventions (référence autorité)
- [primer.md](primer.md) — Quick-start pour nouvelles sessions Claude
- [Hindsight.md](Hindsight.md) — Décisions techniques et leçons apprises

## Moteur d'estimation
- [lib/estimation/engine.ts](lib/estimation/engine.ts) — Orchestrateur `computeEstimation()`
- [lib/estimation/coefficients.ts](lib/estimation/coefficients.ts) — Tables de coefficients, `computeCoefficients()`
- [lib/estimation/fallback.ts](lib/estimation/fallback.ts) — Requêtes DVF L1/L2/L3, `withPostalFilter()`

## API Routes
- [app/api/estimate/route.ts](app/api/estimate/route.ts) — Wizard
- [app/api/leads/route.ts](app/api/leads/route.ts) — Lead avec persistance
- [app/api/health/route.ts](app/api/health/route.ts) — Keep-alive

## Tests & validation
- [__tests__/unit/estimation/](/__tests__/unit/estimation/) — Jest 12/12 ✅
- [__tests__/e2e/](/__tests__/e2e/) — Playwright
- TypeScript zéro erreur ✅

## CI/CD
- [.github/workflows/keepalive.yml](.github/workflows/keepalive.yml) — Ping `/api/health` chaque lundi 8h UTC
- GitHub : https://github.com/ti-tech-2A/ajaccio-estimation

## État
Dernière mise à jour : avril 2026
