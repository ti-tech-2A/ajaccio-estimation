# PRD — ajaccio-estimation.fr

**Projet** : ajaccio-estimation.fr — Plateforme d'estimation immobilière en ligne pour la commune d'Ajaccio  
**Version** : 2.0  
**Date** : 8 avril 2026  
**Auteur** : Product Team  
**Statut** : Draft — en attente de validation  

**Changelog** :
- v1.0 — Version initiale
- v1.1 — Précision sur le traitement du CP 20167 (distinction Ajaccio-Mezzavia / commune d'Alata)
- v2.0 — Refonte complète : périmètre géographique clarifié (3 CP uniquement), moteur d'estimation spécifié avec coefficients différenciés appartements/villas, niveaux de précision formalisés, outil RDV fixé (formulaire maison), email transactionnel fixé (formulaire simple), design system consolidé (direction visuelle autoritaire), AEO enrichi (Dataset, RealEstateListing, FAQ, phrases de synthèse), sections cadastrales 20000 et 20090 validées, segmentation du moteur par type de bien et catégorie de surface, stratégie de tests définie, dashboard Google Sheets.

---

## Table des matières

- [1. Résumé exécutif](#1-résumé-exécutif)
- [2. Contexte et problématique](#2-contexte-et-problématique)
- [3. Objectifs du produit](#3-objectifs-du-produit)
- [4. Audience cible](#4-audience-cible)
- [5. Modèles de référence et benchmarks](#5-modèles-de-référence-et-benchmarks)
- [6. Stack technique](#6-stack-technique)
- [7. Architecture des pages](#7-architecture-des-pages)
- [8. Fonctionnalités clés](#8-fonctionnalités-clés)
- [9. Design System](#9-design-system)
- [10. SEO et AEO](#10-seo-et-aeo)
- [11. Base de données et modèle de données](#11-base-de-données-et-modèle-de-données)
- [12. Intégrations](#12-intégrations)
- [13. Contraintes techniques et réglementaires](#13-contraintes-techniques-et-réglementaires)
- [14. Roadmap — MVP (V1) vs V2 vs V3](#14-roadmap--mvp-v1-vs-v2-vs-v3)
- [15. Métriques de succès (KPIs)](#15-métriques-de-succès-kpis)
- [16. Risques et mitigations](#16-risques-et-mitigations)
- [17. Stratégie de tests](#17-stratégie-de-tests)
- [18. Annexes](#18-annexes)

---

## 1. Résumé exécutif

**ajaccio-estimation.fr** est une plateforme web dédiée à l'estimation immobilière en ligne sur la commune d'Ajaccio, couvrant exclusivement ses trois codes postaux : **20000, 20090 et 20167** (Mezzavia uniquement — filtre commune obligatoire pour ce CP).

Le site combine un moteur d'estimation hybride (calcul automatique + expertise humaine), un observatoire du marché immobilier alimenté par les données DVF, et un dispositif de génération de leads vendeurs.

Le positionnement repose sur trois piliers :

1. **Expertise locale** : 25 ans d'expérience sur le terrain ajaccien, connaissance des micro-zones et des dynamiques de prix.
2. **Données transparentes** : exploitation des transactions DVF réelles, prix au m² par code postal et par type de bien, tendances sur 12 à 24 mois, mises à jour deux fois par an (mai et novembre).
3. **Parcours de conversion optimisé** : estimation gratuite en quelques clics, résultat conditionné à la saisie des coordonnées, proposition systématique de rendez-vous expert.

Le site est indépendant de tout réseau d'agence. Il est conçu pour devenir la référence locale en matière d'information et d'estimation immobilière sur le secteur d'Ajaccio.

---

## 2. Contexte et problématique

### Contexte du marché

Le marché immobilier ajaccien présente des caractéristiques spécifiques :

- **Forte demande régulière et saisonnière** : afflux d'acheteurs locaux et continentaux au printemps et en été.
- **Disparités de prix marquées** : entre le centre-ville (20000), les quartiers Sud (20090) et Mezzavia (20167).
- **Manque de transparence** : peu de données publiques exploitées de manière accessible pour les propriétaires.
- **Concurrence en ligne** : les estimateurs nationaux (MeilleursAgents, SeLoger, Efficity) manquent de granularité locale.

### Problématique

Les propriétaires ajacciens qui souhaitent estimer leur bien se retrouvent face à deux options insatisfaisantes :

1. **Estimateurs nationaux** : résultats génériques, pas de connaissance des micro-zones corses, fourchettes très larges.
2. **Contact direct avec une agence** : perçu comme engageant, les propriétaires hésitent à franchir le pas avant d'avoir une première idée de la valeur.

**ajaccio-estimation.fr** comble ce vide en offrant une estimation de proximité, fondée sur des données locales réelles, avec une transition douce vers l'expertise humaine.

### Positionnement concurrentiel

| Critère | Estimateurs nationaux | Agences locales | ajaccio-estimation.fr |
| :---- | :---- | :---- | :---- |
| Granularité locale | Faible | Élevée (mais non digitalisée) | Élevée + digitalisée |
| Accès instantané | Oui | Non (RDV requis) | Oui |
| Données DVF exploitées | Partiellement | Non | Oui, par code postal et type |
| Expertise humaine | Non | Oui | Oui (phase 2 du parcours) |
| Contenu éditorial local | Non | Rarement | Oui (pages CP, commune, fiscalité) |
| Indépendance | Oui | Variable (réseaux) | Oui |

---

## 3. Objectifs du produit

### Objectifs principaux

| # | Objectif | Description |
| :---- | :---- | :---- |
| O1 | **Outil d'estimation en ligne** | Moteur hybride : résultat instantané basé sur les données DVF et coefficients locaux, complété par une proposition de suivi humain. |
| O2 | **Génération de leads vendeurs** | Capturer les coordonnées de propriétaires souhaitant estimer puis potentiellement vendre leur bien sur Ajaccio. |
| O3 | **Source d'information marché** | Devenir la référence en ligne pour les données immobilières du secteur ajaccien : prix au m², transactions DVF, tendances, fiscalité locale. |

### Objectifs secondaires

| # | Objectif | Description |
| :---- | :---- | :---- |
| O4 | **Référencement local** | Positionner le site sur les requêtes clés : "estimation immobilière Ajaccio", "prix m² Ajaccio", "vendre appartement Ajaccio". |
| O5 | **Crédibilité expert** | Asseoir la notoriété digitale de l'expert local, en complément de son activité terrain. |
| O6 | **Autonomie technique** | Disposer d'un site indépendant, maîtrisé techniquement, sans dépendance à un réseau d'agence ni à un CMS tiers. |

---

## 4. Audience cible

### Persona primaire — Le propriétaire vendeur

| Attribut | Détail |
| :---- | :---- |
| **Nom** | Marie-Pierre, 55 ans |
| **Profil** | Propriétaire d'un appartement T3 à Ajaccio (20000). Héritage familial. Envisage de vendre pour financer un achat sur le continent. |
| **Comportement** | Recherche "estimation appartement Ajaccio" sur Google. Veut une première idée de prix avant de contacter un professionnel. |
| **Attente** | Un résultat rapide, crédible, basé sur des données réelles. Pas de pression commerciale immédiate. |
| **Frein** | Méfiance envers les estimateurs génériques. Besoin de sentir une expertise locale. |
| **Localisation** | Ajaccio — codes postaux 20000, 20090, 20167 |

### Persona secondaire — L'investisseur

| Attribut | Détail |
| :---- | :---- |
| **Nom** | Julien, 42 ans |
| **Profil** | Cadre parisien, propriétaire d'un studio locatif à Ajaccio. Surveille l'évolution des prix pour arbitrer son patrimoine. |
| **Comportement** | Consulte régulièrement les données de marché. Compare les prix entre quartiers et communes. |
| **Attente** | Des données fiables, à jour, avec historique. Graphiques, tendances, volumes de transactions. |
| **Frein** | Manque de données granulaires en ligne sur le marché corse. |

### Segmentation géographique — Périmètre exclusif

| Zone | Code postal | Commune INSEE | Filtre requis | Priorité |
| :---- | :---- | :---- | :---- | :---- |
| Ajaccio (Centre, Trottel, Sanguinaires) | 20000 | Ajaccio (2A004) | CP seul ✓ | MVP |
| Ajaccio (Aspretto, Binda, Bodiccione…) | 20090 | Ajaccio (2A004) | CP seul ✓ | MVP |
| Ajaccio — Mezzavia | 20167 | Ajaccio (2A004) | CP + commune ⚠️ | MVP |

**Périmètre exclu du site** : Porticcio/Grosseto-Prugna (20166), Bastelicaccia (20129), Alata (20167 — commune distincte d'Ajaccio). Ces zones peuvent être mentionnées dans le contenu éditorial comme contexte géographique, mais ne génèrent aucune estimation et n'ont pas de pages dédiées.

### Profil démographique

- **Tranche d'âge** : 40-65 ans (cœur de cible), 30-75 ans (cible élargie)
- **CSP** : Propriétaires résidents ou non-résidents (résidence secondaire en Corse)
- **Digital** : Connectés, utilisent Google et les comparateurs en ligne, mais ne sont pas des "digital natives"
- **Langue** : Français (avec sensibilité à la culture corse)

---

## 5. Modèles de référence et benchmarks

### 5.1 Référence de conversion — porticcio-estimate.fr

Ce site fixe le standard pour le parcours de conversion vendeur et la communication à froid :

| Élément à reprendre | Description |
| :---- | :---- |
| Crédibilité chiffrée | Indicateurs de preuve sociale : nombre de dossiers réalisés, communes couvertes |
| Structure 8-12 blocs | Communication à froid : Hero → Preuve sociale → Problème → Solution → Différenciateurs → Expert → Témoignages → FAQ → CTA |
| Argumentation différenciante | Expertise locale, indépendance, données DVF |
| Témoignages clients | Verbatims détaillés avec contexte (type de bien, commune, issue) |
| CTAs multiples | Estimation + prise de RDV à chaque point de friction |
| Parcours de conversion fluide | Formulaire multi-étapes avec résultat conditionné aux coordonnées |

### 5.2 Référence éditoriale — pietrosella-villas.fr / porticcio-villas.fr

Ces sites fixent le standard pour les pages marché, commune et données :

| Élément à reprendre | Description |
| :---- | :---- |
| Structure par commune/CP | Une page dédiée par zone avec données localisées |
| 6 modules par page | DVF, analyse par segment, INSEE, urbanisme, fiscalité, CTA |
| Densité informative | ≥ 900 mots de contenu utile et unique par page |
| Maillage interne | Liens contextuels entre pages CP, pages thématiques et accueil |
| Ton expert et rassurant | Rédaction professionnelle, vulgarisation des données techniques |
| Données factuelles | Chiffres sourcés (DVF, INSEE), graphiques, tableaux comparatifs |

### 5.3 Synthèse du positionnement

ajaccio-estimation.fr combine :
- La **profondeur éditoriale** et la **richesse de données** de pietrosella-villas.fr (SEO, autorité thématique, contenu par zone)
- Le **parcours de conversion optimisé** et la **crédibilité expert** de porticcio-estimate.fr (leads, preuve sociale, CTAs)

Le tout appliqué au territoire d'Ajaccio, avec une identité visuelle propre (Méditerranéen · Luxe discret).

---

## 6. Stack technique

### Architecture globale

```
GitHub (repo privé) → Vercel (build + deploy) → IONOS (nom de domaine)
                            ↕
                       Supabase (BDD)
                            ↕
                       n8n (automatisation)
                            ↕
                       Notion (CRM)
```

### Détail de la stack

| Couche | Technologie | Justification |
| :---- | :---- | :---- |
| **Framework** | Next.js 15 (App Router) | SSR + SSG pour le SEO, React Server Components, API Routes pour le moteur d'estimation |
| **Langage** | TypeScript | Typage fort, maintenabilité, écosystème Next.js natif |
| **Base de données** | Supabase (PostgreSQL) | Base existante "ESTIM CORSICA", API REST, authentification intégrée, RLS |
| **Hébergement** | Vercel | Déploiement continu depuis GitHub, Edge Functions, optimisation automatique des images |
| **Domaine** | IONOS | Nom de domaine ajaccio-estimation.fr, configuration DNS vers Vercel |
| **Automatisation** | n8n (self-hosted ou cloud) | Workflows : séquences email follow-up, synchronisation Notion |
| **Email transactionnel** | Formulaire simple (MVP) — Resend envisageable ultérieurement | Notifications expert + confirmations lead via formulaire natif dans un premier temps |
| **CRM** | Notion | Suivi des leads vendeurs, pipeline de conversion, notes d'interaction |
| **Analytics** | Google Analytics 4 | Tracking comportemental, événements personnalisés, attribution |
| **Styles** | Tailwind CSS | Cohérence avec le Design System, responsive mobile-first, performances |
| **Cartographie** | Leaflet + OpenStreetMap (MVP) / Mapbox GL JS (V2) | Cartes interactives pour les pages CP et marché |
| **Graphiques** | Recharts | Visualisation des tendances de prix, volumes de transactions |
| **Dashboard KPIs** | Google Sheets | Suivi hebdomadaire des KPIs principaux (GA4 + Supabase + Search Console) |

### Environnements

| Environnement | URL | Branche Git | Usage |
| :---- | :---- | :---- | :---- |
| Production | ajaccio-estimation.fr | `main` | Site public |
| Staging | staging.ajaccio-estimation.fr | `staging` | Validation pré-production |
| Développement | localhost:3000 | `dev` | Développement local |

### Configuration DNS (IONOS → Vercel)

- Enregistrement CNAME : `www` → `cname.vercel-dns.com`
- Enregistrement A : `@` → IP Vercel (76.76.21.21)
- Vérification TXT selon les instructions Vercel

---

## 7. Architecture des pages

### Vue d'ensemble de l'arborescence

```
/                               → Page d'accueil
/estimer                        → Estimateur (formulaire multi-étapes)
/marche/                        → Marché global Ajaccio
/marche/20000/                  → Marché 20000 (Centre, Trottel, Sanguinaires…)
/marche/20090/                  → Marché 20090 (Aspretto, Binda, Bodiccione…)
/marche/20167/                  → Marché 20167 — Mezzavia (Ajaccio uniquement)
/ajaccio/                       → Fiche commune Ajaccio
/simulateur-fiscal/             → Simulateur fiscal
/expert/                        → Page expert / à propos
/faq/                           → Questions fréquentes (AEO)
/mentions-legales               → Mentions légales
/politique-confidentialite      → Politique de confidentialité
/sitemap.xml                    → Sitemap XML dynamique
```

**Note CP 20167** : L'URL `/marche/20167/` affiche exclusivement les données de la section Mezzavia de la commune d'Ajaccio. Le filtre Supabase obligatoire est `code_postal = '20167' AND commune = 'Ajaccio' AND code_insee = '2A004'`. Les biens de la commune d'Alata (même CP 20167) sont exclus du site.

---

### 7.1 Page d'accueil (/)

**Objectif** : Première impression — crédibilité, promesse de valeur, conversion immédiate ou exploration du marché.

#### Structure — 12 blocs (communication à froid)

| # | Bloc | Contenu | Longueur |
| :---- | :---- | :---- | :---- |
| 1 | **Hero** | H1 fort + sous-titre rassurant + CTA "Estimer mon bien" (primaire) + CTA "Voir le marché" (secondaire). Image de fond : vue panoramique d'Ajaccio ou des Sanguinaires (WebP/AVIF). | 30-50 mots |
| 2 | **Preuve sociale chiffrée** | KPIs animés : dossiers réalisés, années d'expérience, communes couvertes, transactions analysées. | 3-4 chiffres |
| 3 | **Problème / Contexte** | Pourquoi les estimateurs nationaux ne suffisent pas pour Ajaccio. | 80-120 mots |
| 4 | **La solution en 3 étapes** | Décrire → Estimer → Affiner avec un expert (visuel process). CTA "Commencer mon estimation". | Visuel |
| 5 | **Différenciateurs** | 3 blocs iconographiques : Données réelles (DVF), Expert local (25 ans), Indépendance. | 40-60 mots/bloc |
| 6 | **Qui sommes-nous** | Portrait de l'expert, ancrage local, légitimité. | 100-150 mots |
| 7 | **Témoignages clients** | 3 verbatims minimum avec contexte (type de bien, quartier, issue). | Authentiques |
| 8 | **CTA intermédiaire** | Répétition du CTA estimation. | — |
| 9 | **Aperçu du marché** | Prix médian au m² par CP (appartements + villas), teaser vers pages marché. | 60-80 mots + tableau |
| 10 | **FAQ** | 5-8 questions clés. Balisage FAQPage Schema.org. | 40-60 mots/réponse |
| 11 | **Réassurance RGPD** | Données protégées, pas de démarchage sans accord. | 30-40 mots |
| 12 | **CTA final** | "Votre estimation gratuite — 3 minutes". | — |

**Ton** : Jamais de pression commerciale explicite dans les 4 premiers blocs. Rassurant, direct, sans jargon.

#### Spécifications techniques

- **Rendu** : SSG avec ISR (`revalidate = 86400` — 24h)
- **Performance** : Images Hero en WebP/AVIF avec `priority` et dimensions déclarées
- **SEO** : Title = "Estimation immobilière Ajaccio — Gratuite et instantanée | ajaccio-estimation.fr"

---

### 7.2 Page Estimateur (/estimer)

**Objectif** : Parcours de conversion principal — capturer les coordonnées du propriétaire en échange d'une estimation instantanée.

#### Formulaire multi-étapes (Wizard — 5 étapes)

| Étape | Champs | Validation |
| :---- | :---- | :---- |
| **1 — Type de bien** | Sélection visuelle (cards) : Appartement / Villa / Maison | Requis |
| **2 — Localisation** | Adresse (autocomplétion API Adresse data.gouv.fr). Code postal (dropdown filtré : 20000, 20090, 20167). Commune (auto-renseignée, vérification Mezzavia vs Alata pour 20167). | Adresse ou CP requis |
| **3 — Caractéristiques** | Surface habitable (m²). Nombre de pièces. Nombre de chambres. Étage + nombre d'étages total (appartements uniquement). Surface terrain (villas/maisons). Année de construction (optionnel). | Surface et pièces requis |
| **4 — Prestations et état** | État général : Neuf / Très bon / Bon / À rafraîchir / À rénover. Prestations (checkboxes) conditionnelles selon le type de bien (voir section 8.1). | État requis |
| **5 — Coordonnées** | Nom complet. Email. Téléphone. Checkbox RGPD (non pré-cochée) : "J'accepte que mes données soient utilisées pour recevoir mon estimation et être recontacté par un expert. [Politique de confidentialité]". | Tous requis + consentement |

**Le résultat n'est affiché qu'après validation de l'étape 5.**

#### Affichage du résultat

| Élément | Contenu |
| :---- | :---- |
| **Fourchette de prix** | Prix bas — Prix haut avec barre visuelle et indicateur médian |
| **Prix au m²** | Prix médian du secteur pour le type de bien estimé |
| **Niveau de précision** | Indicateur 1, 2 ou 3 points verts (voir section 8.1) |
| **Contexte marché** | Nombre de comparables, tendance sur 12 mois |
| **Disclaimer** | "Estimation indicative basée sur les données DVF. Seule une expertise terrain permet de déterminer le prix de vente optimal." |
| **CTA principal** | "Affiner avec un expert — Prendre rendez-vous" (formulaire de rappel) |
| **CTA secondaire** | "Voir les données du marché dans votre secteur" (lien page CP) |

#### Spécifications techniques

- **Composant** : Wizard React (react-hook-form + zod)
- **Progression** : Barre de progression visuelle étape X/5
- **Persistance** : `sessionStorage` — données conservées en cas de navigation accidentelle
- **API** : Endpoint `/api/estimate` (POST) — serveur uniquement, SERVICE_ROLE_KEY Supabase
- **Sécurité** : Rate limiting 10 requêtes/IP/heure sur `/api/estimate` et `/api/leads`
- **Lead** : Insertion dans `leads` Supabase avant affichage du résultat
- **Rendu** : Statique (formulaire interactif, pas d'ISR)

---

### 7.3 Pages par Code Postal (/marche/[cp]/)

**Objectif** : Pages piliers SEO — contenu riche et localisé, génération de trafic organique, maillage interne.

#### Pages MVP

| URL | Zone | Filtre Supabase |
| :---- | :---- | :---- |
| `/marche/20000/` | Ajaccio — Centre, Trottel, Sanguinaires | `code_postal = '20000'` |
| `/marche/20090/` | Ajaccio — Aspretto, Binda, Bodiccione… | `code_postal = '20090'` |
| `/marche/20167/` | Mezzavia (Ajaccio uniquement) | `code_postal = '20167' AND commune = 'Ajaccio' AND code_insee = '2A004'` |

#### Structure — 6 modules par page (≥ 900 mots)

| Module | Contenu | Source |
| :---- | :---- | :---- |
| **1 — Données DVF** | Phrase de synthèse AEO en ouverture. Prix médian au m² (appartements + villas). Volume de transactions sur 12 mois. Évolution sur 24 mois (graphique). Tableau des 5 dernières ventes (date, type, surface, prix — adresse tronquée). | DVF Supabase |
| **2 — Analyse par segment** | Tableau croisé type × catégorie de surface avec prix médian/m². Appartements : Studio&T2 / T3 / T4 / T5+. Villas séparées. | DVF Supabase |
| **3 — Données INSEE / Démographie** | Population, évolution, répartition propriétaires/locataires, résidences principales vs secondaires. | INSEE |
| **4 — Urbanisme** | PLU en vigueur, zones constructibles, PPRI si applicable, lien mairie. | PLU Ajaccio |
| **5 — Fiscalité locale** | Taxe foncière (taux communal), contexte Corse, lien simulateur fiscal. | Légifrance |
| **6 — CTA** | "Vous possédez un bien à [zone] ? Estimez-le gratuitement." | /estimer |

#### Phrases d'ouverture AEO (Module 1)

| Page | Phrase de synthèse |
| :---- | :---- |
| `/marche/20000/` | "À Ajaccio (20000), secteur comprenant le centre-ville, le cours Napoléon, le quartier des Étrangers, Trottel, le Parc Berthault, la Terre Sacrée et la route des Sanguinaires, le prix médian au m² est de **X €** pour un appartement et **Y €** pour une villa, selon les données DVF actualisées au [date]." |
| `/marche/20090/` | "À Ajaccio (20090), secteur englobant Aspretto et Campo dell'Oro, Pietralba, Bodiccione, l'Octroi, Les Cannes - Les Salines, Binda, Saint-Joseph, Candia, Saint-Jean et La Pietrina / les Jardins de l'Empereur, le prix médian au m² est de **X €** pour un appartement et **Y €** pour une villa, selon les données DVF actualisées au [date]." |
| `/marche/20167/` | "À Mezzavia, quartier d'Ajaccio (20167), le prix médian au m² est de **X €** pour un appartement et **Y €** pour une villa, selon les données DVF actualisées au [date]." |
| `/marche/` | "Sur la commune d'Ajaccio, tous secteurs confondus (20000, 20090, 20167), le prix médian au m² est de **X €** pour un appartement et **Y €** pour une villa, selon les données DVF actualisées au [date]." |

#### Spécifications techniques

- **Rendu** : ISR (`revalidate = 2592000` — 30 jours). Revalidation manuelle déclenchée lors des MAJ DVF (mai + novembre)
- **Données structurées** : RealEstateListing (transactions), Dataset (agrégats DVF), FAQPage, BreadcrumbList
- **Date de MAJ** : Composant `<DataFreshnessBadge>` avec balise `<time dateTime="YYYY-MM-DD">` sous le H1 et en pied de chaque bloc de données

---

### 7.4 Page Marché Global (/marche/)

**Objectif** : Vue consolidée du marché ajaccien — tous secteurs confondus.

**Rendu** : ISR (`revalidate = 2592000` — 30 jours)

**Structure** : Identique aux pages CP (6 modules) avec agrégation des 3 CP. Graphiques de comparaison entre secteurs. Liens vers les 3 pages CP.

---

### 7.5 Page Commune (/ajaccio/)

**Objectif** : Fiche de référence sur la commune d'Ajaccio — démographie, urbanisme, marché.

**Structure** (≥ 1 500 mots) :

| Section | Contenu | Source |
| :---- | :---- | :---- |
| Introduction | Présentation générale d'Ajaccio (géographie, économie, attractivité) | Rédaction |
| Démographie INSEE | Population, évolution, tranches d'âge, revenus médians, taux de propriétaires | INSEE |
| Urbanisme | PLU, zones constructibles, PPRI, projets urbains | PLU Ajaccio |
| Profil acheteurs/vendeurs | Qui achète à Ajaccio, qui vend, délais moyens | Rédaction experte |
| Infrastructures | Transports, écoles, commerces, santé, culture, sport | Rédaction |
| Liens vers pages CP | Navigation vers /marche/20000/, /marche/20090/, /marche/20167/ | Liens internes |
| CTA | "Estimer mon bien à Ajaccio" | /estimer |

**Rendu** : SSG (`revalidate = 2592000`)

---

### 7.6 Page Simulateur Fiscal (/simulateur-fiscal/)

**Objectif** : Outil pratique de simulation fiscale. **Priorité : V2**

**Simulateurs** :
- Taxe foncière (valeur locative cadastrale × taux communal Ajaccio)
- Taxe d'habitation résidences secondaires
- Plus-value immobilière (avec tableau d'abattement par durée de détention)

**Rendu** : SSG (`revalidate = 7776000` — 90 jours). Calculs côté client, barèmes codés en dur mis à jour annuellement.

---

### 7.7 Page Expert (/expert/)

**Objectif** : Crédibilité, preuve sociale, humanisation du service, conversion RDV.

**Structure** :

| Section | Contenu |
| :---- | :---- |
| Présentation | Photo professionnelle, nom, titre, parcours (25 ans Ajaccio) |
| Chiffres clés | Dossiers réalisés, communes couvertes, délai de réponse, années d'expérience |
| Approche | Différenciation : expertise locale, indépendance, données DVF, accompagnement |
| Témoignages | 5-8 verbatims complets avec contexte et issue |
| CTA estimation | "Estimez votre bien gratuitement" → /estimer |
| Formulaire de rappel | Nom + Prénom · Téléphone · Créneau préféré (matin/après-midi/indifférent) · Jours préférés (lundi-samedi, multi-choix) · Message libre (optionnel) |

**Données structurées** : `RealEstateAgent` Schema.org

---

### 7.8 Page FAQ (/faq/)

**Objectif** : Page AEO pure — réponses aux questions fréquentes pour les Featured Snippets et les moteurs de réponse IA.

**Structure** (minimum 12 questions) :

| Catégorie | Questions |
| :---- | :---- |
| **Prix** | Quel est le prix moyen au m² à Ajaccio en 2026 ? · Quelle différence entre 20000 et 20090 ? · Les prix sont-ils en hausse ou en baisse ? |
| **Estimation** | Comment fonctionne l'estimation en ligne ? · L'estimation est-elle gratuite et sans engagement ? · Quelle est la précision de l'estimation automatique ? |
| **Données** | Qu'est-ce que le DVF ? · À quelle fréquence les données sont-elles mises à jour ? |
| **Géographie** | Quelle différence entre Mezzavia (Ajaccio) et Alata sur le CP 20167 ? · Le site couvre-t-il Porticcio ou Bastelicaccia ? |
| **Fiscalité** | Quelle est la taxe foncière à Ajaccio ? |
| **Processus** | Comment se déroule un rendez-vous d'expertise terrain ? |

**Format AEO** : Réponse directe en 40-60 mots en ouverture, développement en 80-120 mots, lien contextuel vers la page correspondante. Schema.org `FAQPage` sur toute la page.

**Rendu** : SSG

---

## 8. Fonctionnalités clés

### 8.1 Moteur d'estimation hybride

#### Vue d'ensemble

Le moteur fonctionne en trois phases :
1. **Calcul automatique** : sélection des comparables DVF, calcul de la médiane, application des coefficients
2. **Gate de contact** : résultat conditionné à la saisie des coordonnées (lead capturé)
3. **Proposition expert** : CTA formulaire de rappel affiché systématiquement après le résultat

#### Traitement des données comparables

- **Sélection** : transactions filtrées par CP + commune (obligatoire pour 20167) + type de bien + catégorie de surface + 24 mois
- **Nettoyage** : suppression des 25% les plus bas et des 25% les plus hauts (outliers)
- **Prix de référence** : médiane des 50% centraux des transactions restantes
- **Fourchette** : prix de référence ± 10%

#### Niveaux de précision

| Niveau | Seuil | Indicateur UI | Message | Comportement |
| :---- | :---- | :---- | :---- | :---- |
| 🟢🟢🟢 **Haute** | ≥ 10 transactions | 3 points verts | "Estimation fiable — basée sur X transactions récentes dans votre secteur" | Fourchette affichée, CTA expertise optionnel |
| 🟢🟢⚪ **Moyenne** | 5 à 9 transactions | 2 points verts | "Estimation indicative — références disponibles mais limitées pour votre secteur" | Fourchette affichée, CTA expertise mis en avant |
| 🟢⚪⚪ **Faible** | 2 à 4 transactions | 1 point vert | "Estimation approximative — peu de transactions récentes. Une expertise terrain est fortement recommandée." | Fourchette large (+/- 15%), CTA expertise en position primaire |
| ⚪⚪⚪ **Insuffisante** | 0 à 1 transaction | Message dédié | "Données insuffisantes pour produire une estimation fiable. Notre expert vous contacte sous 24h." | Pas de fourchette. Lead capturé. Formulaire de rappel affiché directement. |

**Règle stricte** : 9 transactions = 2 points verts. 10 transactions = 3 points verts. Sans exception.

#### Logique de fallback (requêtes Supabase)

```
Requête 1 — La plus précise (niveau 1)
CP + Commune + Type de bien + Catégorie de surface + 24 mois
→ Si résultat ≥ 5 transactions : utiliser

Requête 2 — Fallback catégorie (niveau 2)
CP + Commune + Type de bien + 36 mois (sans filtre catégorie)
→ Si résultat ≥ 5 transactions : utiliser + signal 1 point vert max

Requête 3 — Fallback large (niveau 3)
CP + Commune + Type de bien + 48 mois + CP voisins
→ Si résultat ≥ 2 transactions : afficher avec avertissement
→ Si résultat < 2 : niveau insuffisant → lead + formulaire rappel
```

Le niveau de requête utilisé est tracé dans le champ `query_level` de la table `estimations`.

#### Coefficients — APPARTEMENTS

| Facteur | Modalité | Coefficient |
| :---- | :---- | :---- |
| **État général** | Neuf / VEFA | +12% |
| | Très bon état (rénové récemment) | +6% |
| | Bon état (entretenu) | 0% (référence) |
| | À rafraîchir (peintures, sols) | -8% |
| | À rénover (travaux importants) | -18% |
| **Étage** | Dernier étage | +8% |
| | Étages intermédiaires (2 à N-1) | 0% |
| | 1er étage | -4% |
| | Rez-de-chaussée sans extérieur | -10% |
| | Rez-de-chaussée avec jardin privatif | +2% |
| **Ascenseur** | Présent | +4% |
| | Absent (immeuble > 3 étages) | -6% |
| | Absent (immeuble ≤ 3 étages) | 0% |
| **Vue** | Vue mer dégagée | +15% |
| | Vue mer partielle | +7% |
| | Vue dégagée (montagne, campagne) | +3% |
| | Vue sur cour / vis-à-vis | -5% |
| | Vue sur rue passante | -3% |
| **Exposition** | Plein sud / sud-ouest | +5% |
| | Est / ouest | 0% |
| | Nord / nord-est | -5% |
| **Extérieur** | Grande terrasse (> 15 m²) | +7% |
| | Terrasse ou balcon standard | +4% |
| | Loggia / petit balcon (< 6 m²) | +2% |
| | Aucun extérieur | 0% |
| **Stationnement** | Box fermé ou garage | +6% |
| | Place parking sous-sol | +4% |
| | Place extérieure sécurisée | +2% |
| | Aucun stationnement | -4% |
| **Cave / débarras** | Présente | +2% |
| | Absente | 0% |
| **Gardiennage** | Gardien ou digicode + interphone | +3% |
| | Interphone seul | +1% |
| | Aucun | 0% |
| **DPE** | A / B | +5% |
| | C / D | 0% |
| | E | -5% |
| | F / G (passoire énergétique) | -12% |
| **Effet de taille** | Studio / T1 (< 30 m²) | +10% (prix/m² majoré) |
| | T2 (30-50 m²) | +5% |
| | T3 (51-75 m²) | 0% (référence) |
| | T4 (76-100 m²) | -3% |
| | T5+ (> 100 m²) | -6% |
| **Résidence** | Récente (< 10 ans) avec piscine/gardien | +8% |
| | Standard bien entretenue | 0% |
| | Copropriété vieillissante | -5% |

#### Coefficients — VILLAS / MAISONS

| Facteur | Modalité | Coefficient |
| :---- | :---- | :---- |
| **État général** | Neuve / VEFA | +15% |
| | Très bon état (prestations haut de gamme) | +8% |
| | Bon état général | 0% (référence) |
| | À rafraîchir | -10% |
| | À rénover entièrement | -22% |
| **Vue** | Vue mer panoramique | +20% |
| | Vue mer dégagée | +12% |
| | Vue mer partielle | +6% |
| | Vue dégagée (maquis, montagne) | +4% |
| | Sans vue particulière | 0% |
| **Terrain** | Grand terrain (> 2 000 m²) arborisé | +10% |
| | Terrain généreux (800-2 000 m²) | +6% |
| | Terrain standard (300-800 m²) | 0% |
| | Petit terrain (< 300 m²) | -4% |
| **Piscine** | Piscine chauffée / débordement | +12% |
| | Piscine standard | +8% |
| | Aucune piscine | 0% |
| **Exposition** | Sud / plein sud | +7% |
| | Est / ouest | 0% |
| | Nord / contre-pente | -8% |
| **Stationnement** | Garage double ou plus | +6% |
| | Garage simple | +4% |
| | Carport ou parking couvert | +2% |
| | Stationnement extérieur seul | 0% |
| | Aucun stationnement | -5% |
| **Configuration** | Plain-pied | +5% |
| | R+1 classique | 0% |
| | R+2 et plus | -3% |
| **Accès** | Voie carrossable, accès facile | 0% |
| | Chemin privé ou accès difficile | -5% |
| **Mitoyenneté** | Individuelle | +5% |
| | Semi-mitoyenne | -2% |
| **DPE** | A / B | +6% |
| | C / D | 0% |
| | E | -6% |
| | F / G (passoire énergétique) | -15% |
| **Prestations haut de gamme** | Domotique, cuisine équipée, matériaux nobles | +8% |
| | Prestations standard | 0% |

**Note** : Les coefficients sont appliqués de manière cumulative au prix de référence issu de la médiane DVF. La somme des coefficients positifs et négatifs est plafonnée à ±40% pour éviter les résultats aberrants. Les valeurs exactes seront calibrées avec l'expert immobilier lors de la phase de recette.

#### Segmentation du moteur — Architecture de requête

```
Niveau 1 (MVP) — Code postal + Commune (filtre obligatoire)
├── 20000 — Ajaccio
├── 20090 — Ajaccio
└── 20167 — Mezzavia (commune = 'Ajaccio', code_insee = '2A004')

Niveau 2 (MVP) — Type de bien
├── Appartement
└── Villa / Maison

Niveau 3 (MVP) — Catégorie de surface (Appartements uniquement)
├── Studio & T2 (≤ 2 pièces, ≤ 50 m²)
├── T3 (3 pièces, 51-75 m²)
├── T4 (4 pièces, 76-100 m²)
└── T5+ (5 pièces et plus, > 100 m²)

Niveau 4 (V2) — Sections cadastrales par CP

  20000 — Ajaccio
  ├── Centre historique / Cours Napoléon    (zone commerçante, vie de ville)
  ├── Quartier des Étrangers                (villas, standing élevé)
  ├── Trottel
  ├── Parc Berthault
  ├── Terre Sacrée
  ├── Route des Sanguinaires (Scudo, Barbicaggia)
  └── Autres à préciser (audit cadastral)

  20090 — Ajaccio
  ├── Aspretto / Campo dell'Oro             (appartements récents, marché dynamique)
  ├── Pietralba
  ├── Bodiccione
  ├── Octroi
  ├── Les Cannes - Les Salines
  ├── Binda
  ├── Saint-Joseph
  ├── Candia
  ├── Saint-Jean
  ├── La Pietrina / Jardins de l'Empereur
  └── Autres à préciser

  20167 — Mezzavia
  └── Sections à définir lors de l'audit DVF
```

**Objectif de progression** : affiner la granularité de l'estimation progressivement. Le V2 descend au niveau section cadastrale pour les zones avec une volumétrie DVF suffisante. Le V3 élargit aux sous-sections.

---

### 8.2 Gestion des leads

#### Flux de capture

```
Formulaire /estimer (étape 5 — coordonnées)
     ↓
Insertion dans Supabase (table "leads")
     ↓
Webhook Supabase → n8n
     ↓
n8n déclenche en parallèle :
  1. Email de notification à l'expert (formulaire simple MVP)
  2. Email de confirmation au lead (formulaire simple MVP)
  3. Création fiche dans Notion (CRM)
  4. Démarrage séquence de follow-up
```

#### Table `leads` (Supabase)

| Colonne | Type | Description |
| :---- | :---- | :---- |
| `id` | UUID (PK) | Identifiant unique |
| `created_at` | TIMESTAMPTZ | Date de création |
| `full_name` | TEXT | Nom complet |
| `email` | TEXT | Adresse email |
| `phone` | TEXT | Numéro de téléphone |
| `property_type` | ENUM ('appartement', 'villa', 'maison') | Type de bien |
| `postal_code` | TEXT | Code postal |
| `commune` | TEXT | Commune INSEE — indispensable pour le CP 20167 |
| `commune_code_insee` | TEXT | Code INSEE (ex. 2A004 pour Ajaccio) |
| `address` | TEXT | Adresse si renseignée |
| `surface` | INTEGER | Surface en m² |
| `rooms` | INTEGER | Nombre de pièces |
| `bedrooms` | INTEGER | Nombre de chambres |
| `floor` | INTEGER | Étage (appartements) |
| `total_floors` | INTEGER | Nombre d'étages total |
| `land_surface` | INTEGER | Surface terrain (villas/maisons) |
| `year_built` | INTEGER | Année de construction |
| `condition` | ENUM ('neuf', 'tres_bon', 'bon', 'a_rafraichir', 'a_renover') | État général |
| `features` | JSONB | Prestations cochées |
| `estimated_price_low` | INTEGER | Estimation basse |
| `estimated_price_high` | INTEGER | Estimation haute |
| `estimated_price_sqm` | INTEGER | Prix moyen m² utilisé |
| `comparable_count` | INTEGER | Nombre de transactions comparables |
| `query_level` | INTEGER (1, 2 ou 3) | Niveau de requête fallback utilisé |
| `precision_level` | INTEGER (0, 1, 2 ou 3) | Niveau de précision affiché |
| `source` | TEXT | Source du lead (organic, direct…) |
| `utm_source` | TEXT | UTM source |
| `utm_medium` | TEXT | UTM medium |
| `utm_campaign` | TEXT | UTM campaign |
| `status` | ENUM ('new', 'contacted', 'rdv_planned', 'rdv_done', 'converted', 'lost') | Statut |
| `notes` | TEXT | Notes internes |
| `gdpr_consent` | BOOLEAN | Consentement RGPD |
| `gdpr_consent_date` | TIMESTAMPTZ | Date du consentement |

#### Séquence de follow-up (n8n)

| Timing | Action | Contenu |
| :---- | :---- | :---- |
| Immédiat | Email confirmation au lead | "Votre estimation pour [adresse] : [fourchette]. Pour affiner, prenez RDV." |
| Immédiat | Email notification à l'expert | Récapitulatif complet + estimation + lien Notion |
| J+2 | Relance (si pas de RDV) | "Avez-vous des questions sur votre estimation ? Nos experts sont disponibles." |
| J+7 | Email information marché | "Découvrez les dernières tendances du marché à [zone]." + lien page CP |
| J+14 | Dernière relance | "Votre projet de vente est-il toujours d'actualité ?" |

---

### 8.3 Formulaire de rappel (prise de RDV)

**Décision** : formulaire natif intégré directement dans le site. Pas de Calendly ni de Cal.com au MVP.

#### Champs du formulaire

| Champ | Type | Requis |
| :---- | :---- | :---- |
| Prénom + Nom | Texte | Oui |
| Téléphone | Téléphone | Oui |
| Créneau préféré | Radio : Matin / Après-midi / Indifférent | Oui |
| Jours préférés | Multi-choix : Lundi → Samedi | Oui (≥ 1) |
| Message | Texte libre | Non |

#### Points d'intégration

- `/estimer` : affiché après le résultat de l'estimation (niveau ≥ 1 point vert) ou directement (niveau insuffisant)
- `/expert/` : en fin de page

#### Flux technique

```
Soumission formulaire
     ↓
API Route Next.js /api/contact
     ↓
Insertion Supabase (table "contact_requests")
     ↓
Webhook → n8n → Email notification à l'expert
```

---

### 8.4 Analytics et tracking

#### Événements GA4

| Événement | Déclencheur | Paramètres |
| :---- | :---- | :---- |
| `estimation_start` | Clic sur "Estimer mon bien" | `source_page` |
| `estimation_step` | Passage à chaque étape | `step_number`, `property_type` |
| `estimation_submit` | Soumission étape 5 | `property_type`, `postal_code`, `surface` |
| `estimation_result` | Affichage du résultat | `price_low`, `price_high`, `precision_level`, `query_level` |
| `lead_captured` | Lead enregistré avec succès | `postal_code`, `property_type` |
| `contact_form_submit` | Soumission formulaire de rappel | `source_page` |
| `market_page_view` | Consultation page marché/CP | `postal_code`, `property_type_filter` |
| `faq_expand` | Ouverture d'une question FAQ | `question_text`, `page` |

#### Consentement

GA4 ne se charge qu'après consentement explicite (opt-in). Consent mode v2 activé. Solution de gestion : Tarteaucitron.js ou CookieConsent.

---

## 9. Design System

**Document autoritaire** : `direction-visuelle-ajaccio-estimation.md` (v1.0, avril 2026). En cas de conflit entre ce PRD et le fichier direction visuelle, le fichier direction visuelle prime pour toutes les décisions visuelles.

### 9.1 Direction artistique

**Concept** : Méditerranéen · Luxe discret

Mots-clés : Confiance, Expertise, Élégance naturelle, Proximité, Transparence.

Principes visuels :
- Espaces blancs généreux (fond Sable Lin `#FAF5EC`)
- Photographies de qualité : paysages ajacciens, architecture locale, détails méditerranéens
- Iconographie sobre et linéaire
- Pas de surcharge visuelle
- Micro-animations subtiles

### 9.2 Typographie

| Rôle | Police | Graisses | Usage |
| :---- | :---- | :---- | :---- |
| **Display** | Poppins | 600 (SemiBold), 700 (Bold) | Titres H1, H2, Hero, KPIs |
| **Body** | Open Sans | 400 (Regular), 600 (SemiBold) | Corps de texte, labels |

**Chargement** : Via `next/font/google` (self-hosting, `font-display: swap`).

### 9.3 Palette de couleurs

Les tokens complets sont définis dans la direction visuelle. Couleurs sémantiques principales :

| Rôle | Nom | Hex |
| :---- | :---- | :---- |
| **Primaire** | Bleu Profond | `#1B4F72` |
| **Accent** | Bleu Mer | `#2E86AB` |
| **CTA Prestige** | Sable Chaud | `#C9A96E` |
| **Secondaire** | Vert Olive | `#6B7F55` |
| **Surface / Fond** | Sable Lin | `#FAF5EC` |
| **Texte body** | Gris Chaud | `#5C5C5C` |
| **Texte muted** | Gris Clair | `#9B9B9B` |
| **Erreur** | Rouge | `#C0392B` |
| **Succès** | Vert | `#27AE60` |

**Couleur body text** : `#5C5C5C` (Gris Chaud, token `--color-text`) — valeur autoritaire issue de la direction visuelle. Ratio de contraste sur Sable Lin : ~5.8:1, conforme WCAG AA.

### 9.4 Accessibilité

| Exigence | Implémentation |
| :---- | :---- |
| **WCAG AA** | Toutes les combinaisons texte/fond respectent un ratio ≥ 4.5:1 |
| **Navigation clavier** | Tous les éléments interactifs accessibles via Tab, focus visible |
| **Lecteurs d'écran** | `aria-label`, `aria-describedby`, `role` sur les composants interactifs |
| **Formulaires** | Labels associés (`htmlFor`), messages d'erreur via `aria-describedby` |
| **Responsive** | Taille de texte minimum 16px mobile, target size ≥ 44×44px |
| **Mouvement** | Respect de `prefers-reduced-motion` |
| **Sémantique** | HTML sémantique, hiérarchie Hn respectée |

---

## 10. SEO et AEO

### 10.1 Architecture SEO

#### URLs et métadonnées

| Page | URL | Title | Meta description |
| :---- | :---- | :---- | :---- |
| Accueil | `/` | Estimation immobilière Ajaccio — Gratuite et instantanée | Estimez gratuitement votre bien à Ajaccio. Données DVF, prix au m² par quartier, expert local 25 ans d'expérience. Résultat en 3 minutes. |
| Estimateur | `/estimer` | Estimer mon bien à Ajaccio — Estimation gratuite en ligne | Obtenez une estimation gratuite pour votre appartement ou maison à Ajaccio. Basée sur les transactions DVF réelles. |
| Marché global | `/marche/` | Marché immobilier Ajaccio 2026 — Prix, tendances, transactions | Prix au m², volumes et tendances du marché immobilier à Ajaccio. Données DVF actualisées mai 2026. |
| Marché 20000 | `/marche/20000/` | Prix immobilier Ajaccio 20000 — Prix m², transactions DVF 2026 | Prix moyen au m² à Ajaccio (20000) : X €. X transactions sur 12 mois. Évolution, dernières ventes DVF. |
| Marché 20090 | `/marche/20090/` | Prix immobilier Ajaccio 20090 — Prix m², transactions DVF 2026 | Prix moyen au m² à Ajaccio (20090) : X €. X transactions sur 12 mois. Évolution, dernières ventes DVF. |
| Marché 20167 | `/marche/20167/` | Prix immobilier Mezzavia Ajaccio (20167) — Prix m², DVF 2026 | Prix au m² à Mezzavia, quartier d'Ajaccio (20167). Données DVF, tendances et analyse du marché. |
| Commune | `/ajaccio/` | Ajaccio — Démographie, urbanisme et marché immobilier | Découvrez Ajaccio : population, urbanisme (PLU), profil acheteurs/vendeurs, données du marché immobilier. |
| Simulateur | `/simulateur-fiscal/` | Simulateur fiscal immobilier Ajaccio — Taxe foncière, plus-value | Simulez taxe foncière et plus-value immobilière à Ajaccio. Calcul instantané, barèmes officiels. |
| Expert | `/expert/` | Votre expert immobilier à Ajaccio — 25 ans d'expérience | Expert immobilier indépendant à Ajaccio. 25 ans d'expérience, estimation gratuite, connaissance des micro-zones. |
| FAQ | `/faq/` | FAQ Estimation immobilière Ajaccio — Questions fréquentes | Toutes les réponses sur l'estimation immobilière à Ajaccio : prix au m², DVF, fiscalité, zones couvertes. |

#### Maillage interne

```
Accueil (/)
├── /estimer ←→ /expert/
├── /marche/
│   ├── /marche/20000/ ←→ /marche/20090/ ←→ /marche/20167/
├── /ajaccio/ → toutes les pages CP
├── /simulateur-fiscal/
├── /expert/
└── /faq/
```

Règles : chaque page contient au moins un CTA vers `/estimer`. Le footer contient tous les liens principaux. Breadcrumb sur toutes les pages intérieures.

### 10.2 Données structurées Schema.org

#### RealEstateAgent (page /expert/)
Nom, description, adresse, téléphone, zone de couverture géographique.

#### FAQPage (accueil + pages CP + /faq/)
Sur toutes les pages contenant des questions/réponses structurées.

#### RealEstateListing (pages marché — transactions DVF)

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "Appartement T3 — Ajaccio 20000",
  "datePosted": "2026-03-01",
  "price": "245000",
  "priceCurrency": "EUR",
  "floorSize": { "@type": "QuantitativeValue", "value": 68, "unitCode": "MTK" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ajaccio",
    "postalCode": "20000",
    "addressCountry": "FR"
  }
}
```

Généré dynamiquement pour les 5 dernières transactions de chaque page. Adresse tronquée (conformité DVF).

#### Dataset (pages marché — données agrégées)

```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Transactions immobilières DVF — Ajaccio 2024-2026",
  "description": "Prix de vente des biens immobiliers à Ajaccio (20000, 20090, 20167) issus des DVF, actualisés deux fois par an.",
  "dateModified": "2026-05-01",
  "license": "https://www.etalab.gouv.fr/licence-ouverte-open-licence",
  "spatialCoverage": { "@type": "Place", "name": "Ajaccio" },
  "temporalCoverage": "2024-01-01/2026-05-01"
}
```

#### BreadcrumbList (toutes les pages intérieures)
Navigation hiérarchique structurée sur toutes les pages sauf l'accueil.

### 10.3 AEO — Answer Engine Optimization

L'AEO vise à positionner le contenu dans les réponses des moteurs IA (Google SGE, Perplexity, ChatGPT).

#### Éléments implémentés

| Élément | Spécification |
| :---- | :---- |
| **Phrases de synthèse** | Première phrase de chaque section de données : chiffre clé + zone + type de bien + source DVF + date. Template défini par page (voir section 7.3). |
| **Réponses directes** | Chaque FAQ ouvre par une réponse en 40-60 mots avant le développement |
| **Date de MAJ visible** | Composant `<DataFreshnessBadge>` avec `<time dateTime="YYYY-MM-DD">` sous le H1 et en pied de chaque bloc de données |
| **Schema FAQPage** | Sur accueil, pages CP, /faq/ |
| **Schema Dataset** | Sur /marche/ et chaque page CP |
| **Schema RealEstateListing** | Sur chaque page CP (5 dernières transactions) |
| **Liens sortants sources** | DVF Étalab, INSEE, Légifrance, Mairie d'Ajaccio — en `noopener noreferrer`, jamais en `nofollow` |

#### Liens sortants obligatoires

| Source | Ancre | URL | Placement |
| :---- | :---- | :---- | :---- |
| DVF Étalab | "données DVF officielles" | `https://app.dvf.etalab.gouv.fr/` | Bas de chaque bloc DVF |
| INSEE | "données INSEE" | `https://www.insee.fr/` | Bas du module démographie |
| Légifrance | "barèmes officiels" | `https://www.legifrance.gouv.fr/` | Page simulateur fiscal |
| Mairie d'Ajaccio | "PLU d'Ajaccio" | URL mairie officielle | Pages CP + commune |

### 10.4 Core Web Vitals

| Métrique | Objectif | Stratégie |
| :---- | :---- | :---- |
| **LCP** | < 2.5s | Images Hero WebP/AVIF avec `next/image priority`. Polices via `next/font`. Pre-connect Supabase. |
| **CLS** | 0 | Dimensions déclarées sur toutes les images. `font-display: swap` avec fallback dimensionnel. |
| **INP** | < 200ms | RSC pour le rendu initial. Client Components isolés. Debounce sur les filtres. |

**Objectif Lighthouse** :

| Catégorie | MVP | V2 |
| :---- | :---- | :---- |
| Performance | ≥ 90 | ≥ 95 |
| Accessibilité | ≥ 90 | ≥ 95 |
| Best Practices | ≥ 90 | ≥ 95 |
| SEO | ≥ 95 | ≥ 98 |

### 10.5 ISR — Fréquences de revalidation

| Page | `revalidate` | Justification |
| :---- | :---- | :---- |
| Pages marché CP | 2 592 000 (30 jours) | Données DVF stables entre MAJ |
| Page marché global | 2 592 000 (30 jours) | Idem |
| Page commune | 2 592 000 (30 jours) | Données INSEE très stables |
| Simulateur fiscal | 7 776 000 (90 jours) | Barèmes fiscaux annuels |
| Accueil | 86 400 (24h) | Stats de marché en surface |
| /estimer | Pas d'ISR | Formulaire interactif |

**MAJ DVF** (début mai + début novembre) : revalidation manuelle via `res.revalidate()` sur toutes les pages marché, depuis un endpoint admin protégé.

---

## 11. Base de données et modèle de données

### Base existante — ESTIM CORSICA (Supabase)

#### Tables

| Table | Description | Statut |
| :---- | :---- | :---- |
| `dvf_transactions` | Transactions DVF — date, type, surface, prix, CP, **commune**, **code_insee**, GPS | Existante (vérifier présence des champs `commune` et `code_insee`) |
| `leads` | Leads vendeurs capturés via le formulaire | À créer |
| `estimations` | Historique des estimations (dont `query_level` et `precision_level`) | À créer |
| `contact_requests` | Demandes de rappel via formulaire de contact | À créer |
| `market_stats` | Statistiques pré-calculées par CP et type de bien (vue matérialisée) | À créer |

### Sécurité des données

**Principe** : aucune donnée DVF brute n'est exposée directement depuis le frontend via la clé `anon` Supabase.

| Aspect | Règle |
| :---- | :---- |
| **Architecture** | Toutes les requêtes DVF passent par des API Routes Next.js côté serveur (`/api/`) avec la `SERVICE_ROLE_KEY`. Le front reçoit uniquement des données agrégées. |
| **RLS Supabase** | Activée sur `dvf_transactions` — politique bloquant tout accès depuis la clé anon. |
| **Rate limiting** | Middleware Next.js sur `/api/estimate` et `/api/leads` — 10 requêtes/minute/IP. |
| **Clés** | `SUPABASE_SERVICE_ROLE_KEY` jamais exposée dans le bundle client. |
| **Anonymisation DVF** | Pas d'adresse exacte affichée publiquement — CP + commune + rue tronquée uniquement. |
| **Rétention leads** | 3 ans maximum après le dernier contact, puis suppression ou anonymisation (RGPD). |
| **Sauvegardes** | Sauvegardes automatiques Supabase (plan Pro) ou export régulier via n8n. |

---

## 12. Intégrations

| Outil | Usage | Priorité | Notes |
| :---- | :---- | :---- | :---- |
| **Supabase** | BDD PostgreSQL — DVF, leads, estimations, stats marché | MVP | Projet existant "ESTIM CORSICA". Variables : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. |
| **n8n** | Automatisation — notifications, séquences follow-up, sync Notion | MVP | Instance n8n. Webhooks Supabase. Utilise le système d'email configuré pour les envois. |
| **Notion** | CRM suivi des leads | MVP | Base "Leads Vendeurs". Intégration via API Notion depuis n8n. |
| **Google Analytics 4** | Tracking comportemental | MVP | Consent mode v2. Chargement après consentement. |
| **API Adresse data.gouv.fr** | Autocomplétion adresse dans le formulaire | MVP | API publique, gratuite. Filtrage par CP couverts. |
| **Tarteaucitron.js** | Gestion du consentement cookies (RGPD) | MVP | Bloque GA4 avant consentement. |
| **Leaflet + OpenStreetMap** | Cartes interactives pages CP | MVP | Gratuit, open source. |
| **Mapbox GL JS** | Cartes avec style custom | V2 | Migration depuis Leaflet si nécessaire. |
| **Formulaire de rappel natif** | Prise de RDV | MVP | Intégré directement dans le site. Pas de Calendly ni Cal.com. |
| **Email transactionnel** | Notifications expert + confirmations lead | MVP | Formulaire simple pour commencer. Resend (plan Pro, $20/mois, 2e domaine) envisageable ultérieurement. |
| **Google Sheets** | Dashboard KPIs hebdomadaire | MVP | Alimenté depuis GA4, Supabase, Search Console. |

---

## 13. Contraintes techniques et réglementaires

### Contraintes RGPD

| Élément | Spécification |
| :---- | :---- |
| Collecte des données | Consentement explicite et éclairé sur le formulaire d'estimation (checkbox non pré-cochée) |
| Finalité | Clairement indiquée : estimation immobilière + recontact éventuel par un expert |
| Droit d'accès et suppression | Adresse email dédiée mentionnée dans la politique de confidentialité |
| Rétention | 3 ans maximum sur les leads, puis anonymisation |
| Sous-traitants | Supabase (hébergement EU), n8n, Notion — DPA à vérifier |
| Cookies | Bandeau cookies RGPD avant tout dépôt de cookie analytique |

### Contraintes techniques

| Contrainte | Spécification |
| :---- | :---- |
| Performance | Lighthouse ≥ 90 sur les 4 catégories en production |
| Responsive | Mobile-first, testé sur iOS Safari et Chrome Android |
| Accessibilité | WCAG 2.1 niveau AA |
| HTTPS | Certificat Let's Encrypt via Vercel (automatique) |
| Redirections | www → non-www configurées via Vercel |

---

## 14. Roadmap — MVP vs V2 vs V3

### MVP (V1) — Fonctionnalités de lancement

| Fonctionnalité | Détail |
| :---- | :---- |
| Page d'accueil | Structure 12 blocs complète |
| Estimateur /estimer | Wizard 5 étapes, moteur niveaux 1-2-3, indicateur de précision |
| Pages marché | /marche/, /marche/20000/, /marche/20090/, /marche/20167/ |
| Page commune | /ajaccio/ |
| Page expert | /expert/ avec formulaire de rappel |
| Page FAQ | /faq/ |
| SEO technique | Sitemap, Schema.org, Open Graph, Core Web Vitals ≥ 90 |
| AEO | Phrases de synthèse, Dataset, RealEstateListing, date MAJ |
| Gestion des leads | Table Supabase + n8n + Notion |
| Analytics | GA4 + consent mode |
| Mentions légales | /mentions-legales + /politique-confidentialite |

### V2 — Approfondissement

| Fonctionnalité | Détail |
| :---- | :---- |
| Sections cadastrales | Moteur niveau 4 (filtrage par section : Quartier des Étrangers, Aspretto/Campo dell'Oro…) |
| Pages marché par segment | /marche/20000/appartements/t3/, /marche/20090/villas/… |
| Simulateur fiscal | /simulateur-fiscal/ |
| Carte interactive | Mapbox GL JS avec style personnalisé |
| Email Resend | Migration vers Resend Pro si volume justifie |

### V3 — Granularité maximale

| Fonctionnalité | Détail |
| :---- | :---- |
| Sections cadastrales 20167 | Audit DVF préalable nécessaire |
| Pages par section | /marche/20000/quartier-des-etrangers/, /marche/20090/aspretto-campo-doro/… |
| Blog / Actualités | Contenu éditorial récurrent sur le marché ajaccien |

---

## 15. Métriques de succès (KPIs)

### KPIs principaux

| KPI | Définition | Objectif 3 mois | Objectif 6 mois | Outil |
| :---- | :---- | :---- | :---- | :---- |
| **Taux de conversion estimateur → lead** | Leads / visiteurs ayant démarré le formulaire | ≥ 15% | ≥ 25% | GA4 (funnel) |
| **Leads vendeurs / mois** | Leads insérés dans Supabase | ≥ 10 | ≥ 30 | Supabase + Notion |
| **Trafic organique / mois** | Sessions issues de la recherche Google | ≥ 500 | ≥ 2 000 | GA4 |
| **Score Lighthouse Performance** | Score page d'accueil | ≥ 90 | ≥ 95 | Lighthouse CI |
| **Durée moyenne de session** | Temps moyen par session | ≥ 2 min | ≥ 3 min | GA4 |
| **Taux de rebond** | Sessions avec une seule page vue | ≤ 60% | ≤ 50% | GA4 |

### KPIs secondaires

| KPI | Objectif 6 mois | Outil |
| :---- | :---- | :---- |
| Taux de complétion du formulaire (étape 5 / étape 1) | ≥ 40% | GA4 |
| Taux de prise de RDV (RDV / leads) | ≥ 20% | Notion |
| Mots-clés en top 10 Google | ≥ 20 | Search Console |
| CTR Search Console | ≥ 5% | Search Console |
| Taux de conversion lead → RDV | ≥ 15% | Notion |
| Taux de conversion RDV → mandat | ≥ 30% | Notion |

### Dashboard de suivi

Google Sheets — mise à jour hebdomadaire (chaque lundi). Un onglet par source : GA4, Supabase/Leads, Search Console. Un onglet tableau de bord synthétique. Alimentation via exports manuels + Google Sheets Add-on Search Console.

---

## 16. Risques et mitigations

| # | Risque | Probabilité | Impact | Mitigation |
| :---- | :---- | :---- | :---- | :---- |
| R1 | **Données DVF insuffisantes** dans certains secteurs | Moyenne | Élevé | Fallback 3 niveaux (36 mois, 48 mois, CP voisins). Avertissement UI + RDV expert proposé directement. |
| R2 | **Précision de l'estimation perçue comme faible** | Moyenne | Élevé | Calibration des coefficients avec l'expert. Communication claire sur le caractère indicatif. Indicateur de précision visible. |
| R3 | **Trafic organique insuffisant** | Élevée | Moyen | Densité de contenu élevée dès le MVP. Maillage interne solide. Google Business Profile. Stratégie de backlinks locale. |
| R4 | **Faible taux de conversion formulaire** | Moyenne | Élevé | UX optimisée (barre de progression, sessionStorage). Réduction des champs obligatoires. |
| R5 | **Problèmes de performance** | Faible | Moyen | Lazy loading. RSC. Code splitting. Lighthouse CI en continu. |
| R6 | **Non-conformité RGPD** | Faible | Élevé | Checklist RGPD avant mise en prod. Bandeau cookies testé. |
| R7 | **Dépendance Supabase** | Faible | Élevé | Sauvegardes régulières. Cache des données marché en fichiers statiques (fallback). |
| R8 | **Confusion Mezzavia / Alata (CP 20167)** | Faible | Élevé | Filtres Supabase systématiques (commune + code_insee). Tests E2E dédiés à ce cas. |

---

## 17. Stratégie de tests

### Tests unitaires — Jest

**Priorité : haute.** Cibler exclusivement l'algorithme d'estimation :
- Fonction de calcul de la médiane (suppression des quartiles extrêmes)
- Application des coefficients appartements et villas
- Logique des niveaux de précision (seuils 2/5/10 transactions)
- Filtrage Ajaccio vs Alata sur le CP 20167
- Logique de fallback entre les 3 niveaux de requête

### Tests E2E — Playwright

**Priorité : haute.** Trois parcours critiques automatisés :
1. Complétion du wizard de bout en bout → vérification de l'insertion lead en base
2. Affichage du résultat avec les 3 niveaux de précision (mock de comparables)
3. Soumission du formulaire de rappel → vérification de la notification

Cas limite à tester obligatoirement : CP 20167 avec Mezzavia vs Alata.

### Tests de composants — React Testing Library

**Priorité : moyenne.**
- Navigation avant/arrière dans le wizard
- Persistance sessionStorage entre étapes
- Messages d'erreur et validation des champs

### Tests de performance — Lighthouse CI

**Priorité : haute.** Intégré dans la GitHub Action sur chaque PR vers `staging`. Seuil bloquant : score Performance < 85 fait échouer le build.

### Tests manuels cross-browser

**Priorité : haute — uniquement avant mise en production.**
- Chrome desktop
- Safari iOS (critique pour le public cible 40-65 ans)
- Chrome Android
- Firefox desktop

Focalisés sur le wizard et le formulaire de rappel.

### Tests RGPD

**Priorité : haute — une session manuelle avant chaque mise en production.**
- Bandeau cookies visible au premier accès
- GA4 non chargé avant consentement
- Lien politique de confidentialité fonctionnel
- Suppression des cookies sur refus

### Ce qui n'est pas prioritaire pour le MVP

Tests de charge (trafic attendu faible au démarrage), snapshot testing, tests d'accessibilité automatisés axe-core (utiles mais non bloquants).

---

## 18. Annexes

### Annexe A — Glossaire

| Terme | Définition |
| :---- | :---- |
| **DVF** | Demandes de Valeurs Foncières — base de données publique des transactions immobilières enregistrées par les notaires |
| **INSEE** | Institut National de la Statistique et des Études Économiques |
| **PLU** | Plan Local d'Urbanisme |
| **PPRI** | Plan de Prévention des Risques d'Inondation |
| **ISR** | Incremental Static Regeneration — régénération de pages statiques à intervalles réguliers (Next.js) |
| **SSG** | Static Site Generation — génération de pages HTML au build |
| **RSC** | React Server Components — composants exécutés côté serveur uniquement |
| **AEO** | Answer Engine Optimization — optimisation pour les moteurs de réponse IA |
| **CTA** | Call to Action |
| **RGPD** | Règlement Général sur la Protection des Données |
| **WCAG** | Web Content Accessibility Guidelines |
| **RLS** | Row Level Security — sécurité au niveau des lignes (Supabase/PostgreSQL) |
| **LCP** | Largest Contentful Paint — Core Web Vital |
| **CLS** | Cumulative Layout Shift — Core Web Vital |
| **INP** | Interaction to Next Paint — Core Web Vital |
| **DPE** | Diagnostic de Performance Énergétique |

### Annexe B — Codes postaux et sections cadastrales

| Code postal | Commune | Code INSEE | Filtre requis | URL | Priorité |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 20000 | Ajaccio | 2A004 | CP seul ✓ | `/marche/20000/` | MVP |
| 20090 | Ajaccio | 2A004 | CP seul ✓ | `/marche/20090/` | MVP |
| 20167 | Ajaccio — Mezzavia | 2A004 | CP + commune ⚠️ | `/marche/20167/` | MVP |
| 20167 | Alata (commune distincte) | Distinct | — | Hors périmètre | Exclu |

**⚠️ Point d'attention CP 20167** : Ce code postal couvre deux communes distinctes. Mezzavia est un quartier de la commune d'Ajaccio (INSEE 2A004) — ses biens sont inclus dans les statistiques Ajaccio. Alata est une commune indépendante — ses biens sont exclus du site. Le filtrage par `code_postal` seul est insuffisant pour le 20167. Le champ `commune` (ou `code_insee`) est obligatoire dans toutes les requêtes Supabase impliquant ce CP.

#### Sections cadastrales par CP (Niveau 4 — V2)

**20000 — Ajaccio**
- Centre historique / Cours Napoléon (zone commerçante, vie de ville)
- Quartier des Étrangers (villas, standing élevé)
- Trottel
- Parc Berthault
- Terre Sacrée
- Route des Sanguinaires (Scudo, Barbicaggia)
- Autres à préciser (audit cadastral)

**20090 — Ajaccio**
- Aspretto / Campo dell'Oro (appartements récents, marché dynamique)
- Bodiccione
- Octroi
- Les Cannes - Les Salines
- Binda
- Saint-Joseph
- Candia
- Saint-Jean
- La Pietrina / Jardins de l'Empereur
- Autres à préciser

**20167 — Mezzavia**
- Sections à définir lors de l'audit DVF

### Annexe C — Checklist de mise en production

- [ ] Toutes les pages MVP développées, testées et responsive
- [ ] Formulaire d'estimation fonctionnel de bout en bout (wizard → calcul → résultat → lead)
- [ ] Filtrage CP 20167 vérifié (Mezzavia uniquement — Alata exclue)
- [ ] Insertion leads Supabase vérifiée
- [ ] Formulaire de rappel fonctionnel (soumission → notification expert)
- [ ] Workflow n8n opérationnel (notification + confirmation + sync Notion)
- [ ] GA4 configuré avec consent mode v2 et événements personnalisés
- [ ] Bandeau cookies fonctionnel (opt-in/opt-out)
- [ ] Pages mentions légales et politique de confidentialité publiées
- [ ] Schema.org implémenté et validé (RealEstateAgent, FAQPage, Dataset, RealEstateListing, BreadcrumbList)
- [ ] Phrases de synthèse AEO en place sur toutes les pages marché
- [ ] Composant DataFreshnessBadge avec `<time>` visible sur toutes les pages marché
- [ ] Liens sortants vers DVF, INSEE, Légifrance, Mairie vérifiés
- [ ] Sitemap XML généré et soumis à Google Search Console
- [ ] Score Lighthouse ≥ 90 sur les 4 catégories
- [ ] Tests unitaires Jest passants (moteur d'estimation)
- [ ] Tests E2E Playwright passants (3 parcours critiques)
- [ ] Tests cross-browser validés (Chrome, Safari iOS, Chrome Android, Firefox)
- [ ] Tests RGPD validés
- [ ] DNS IONOS → Vercel configuré et propagé
- [ ] HTTPS actif
- [ ] Redirections www → non-www configurées
- [ ] Variables d'environnement de production configurées sur Vercel
- [ ] Sauvegardes Supabase vérifiées
- [ ] Google Sheets dashboard configuré

### Annexe D — Stratégie éditoriale

#### Pages estimation (/, /estimer, /expert/) — Communication à froid

Inspiré de `porticcio-estimate.fr`. Structure 8-12 blocs. Ton rassurant, direct, sans pression commerciale dans les 4 premiers blocs.

Blocs obligatoires : Hero · Preuve sociale · Problème/Contexte · Solution 3 étapes · Différenciateurs · Présentation expert · Témoignages · CTA intermédiaire · Aperçu marché · FAQ · Réassurance RGPD · CTA final.

#### Pages marché, commune, simulateur — Référence éditoriale

Inspiré de `pietrosella-villas.fr` et `porticcio-villas.fr`. Structure 6 modules. Minimum 900 mots de contenu utile et unique. Données chiffrées sourcées avec date de mise à jour visible.

#### Workflow de production

Le contenu éditorial est finalisé **avant** le développement des pages SEO. Les pages CP sans contenu complet ne sont pas mises en ligne — une page squelettique nuit au SEO.

### Annexe E — Références et ressources

| Ressource | URL | Usage |
| :---- | :---- | :---- |
| API DVF | https://app.dvf.etalab.gouv.fr/ | Données de transactions |
| API Adresse | https://api-adresse.data.gouv.fr/ | Autocomplétion d'adresses |
| INSEE | https://www.insee.fr/ | Données démographiques |
| Next.js | https://nextjs.org/docs | Framework frontend |
| Supabase | https://supabase.com/docs | Base de données |
| n8n | https://docs.n8n.io/ | Automatisation |
| Schema.org | https://schema.org/ | Données structurées |
| Google Rich Results Test | https://search.google.com/test/rich-results | Validation Schema.org |
| Lighthouse | https://developer.chrome.com/docs/lighthouse/ | Audit performance |
| WCAG 2.1 | https://www.w3.org/TR/WCAG21/ | Normes accessibilité |
| Playwright | https://playwright.dev/ | Tests E2E |
| Jest | https://jestjs.io/ | Tests unitaires |

---

*Document rédigé en avril 2026. Ce PRD est un document vivant mis à jour au fur et à mesure des décisions prises. Version de référence : 2.0.*
