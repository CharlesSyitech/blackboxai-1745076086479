# SYITECH GROUP — Refonte du site corporate

Dossier de conception du nouveau site institutionnel de **Syitech Group** :
un groupe technologique africain multi-verticales (Enterprise, CultTech, FinTech,
EventTech, Hardware & IoT, AI/Data/Blockchain, R&D).

**Signature recommandée : _Technology. Ecosystems. Impact._**

---

## État d'avancement

| Phase | Livrables | Statut |
|---|---|---|
| **1 — Stratégie** | Plateforme de marque · Sitemap · Architecture de l'information · Personas · User journeys · Architecture de contenu · Architecture SEO | ✅ Livrée |
| **2 — UX** | Wireframes home (desktop + mobile), Groupe, Expertise, Solution, Case study, Partenaires · Arbitrage mobile | ✅ Livrée |
| **3 — UI** | Direction artistique · Design system · Tokens · Bibliothèque de composants · Motion guidelines | ✅ Livrée |
| **4 — Technique** | Architecture Next.js · Modèle de données CMS · API · SEO · Analytics · Sécurité · Performance | ✅ Livrée |
| **5 — Développement** | Implémentation | ⏸ **En attente de validation des phases 1 à 4** |

> Le développement n'a volontairement pas été démarré : le brief impose la validation
> des phases précédentes (§50). Les points à trancher sont réunis dans le document 13.

---

## Documents

| # | Document | Contenu |
|---|---|---|
| 00 | [Plateforme de marque & stratégie](docs/00-brand-strategy.md) | Positionnement, signature, architecture de marque, ton, matrice de messages |
| 01 | [Sitemap & architecture de l'information](docs/01-sitemap-information-architecture.md) | Sitemap, routage bilingue, navigation, templates, maillage |
| 02 | [Personas & user journeys](docs/02-personas-user-journeys.md) | 9 personas, 6 parcours détaillés, lecture à 4 niveaux, anti-parcours |
| 03 | [Architecture de contenu](docs/03-content-architecture.md) | Modèle de contenu, blocs, charte éditoriale, **gouvernance des chiffres, des partenaires, du réglementaire et de la PI** |
| 04 | [Architecture SEO internationale](docs/04-seo-architecture.md) | i18n, hreflang, metadata, Schema.org, sitemap, sémantique par page |
| 05 | [UX & wireframes](docs/05-ux-wireframes.md) | Home 18 sections desktop / 12 mobile, gabarits Groupe, Expertise, Solution, Case study, Partenaires |
| 06 | [Direction artistique & moodboard](docs/06-art-direction-moodboard.md) | Registres visuels, territoire chromatique, photographie, schémas, interdits |
| 07 | [Design system](docs/07-design-system.md) | Tokens, couleurs et contrastes vérifiés, typographie, grille, formes, thématisation |
| 08 | [Bibliothèque de composants](docs/08-component-library.md) | Primitives, contenu, navigation, graphes, formulaires, conventions |
| 09 | [Motion guidelines](docs/09-motion-guidelines.md) | Doctrine, vocabulaire de mouvement, catalogue, `reduced-motion`, budget de performance |
| 10 | [Architecture technique](docs/10-technical-architecture.md) | Stack, arborescence, rendu, données, i18n, API, environnements, CI |
| 11 | [Modèle de données CMS](docs/11-cms-data-model.md) | 18 collections, validations bloquantes, back-office, rôles, migration |
| 12 | [Performance · Accessibilité · Analytics · Sécurité](docs/12-performance-accessibilite-analytics-securite.md) | Budgets, WCAG 2.2 AA, taxonomie d'événements, CSP, RGPD |
| 13 | [Gouvernance des données & questions ouvertes](docs/13-gouvernance-donnees-questions-ouvertes.md) | **Bloquants, fiches de validation KPI et partenaires, questions ouvertes, plan de Phase 5** |

**Tokens machine-lisibles :** [`design-system/tokens.json`](design-system/tokens.json)

---

## Les trois règles qui structurent tout le projet

1. **Hiérarchie narrative** — `GROUPE → EXPERTISES → TECHNOLOGIES → SOLUTIONS → RÉALISATIONS → IMPACT → PARTENAIRES`.
   Jamais inversée. Sydica, Sytium et KultiX appartiennent au Groupe ; les partenaires ne sont jamais des activités du Groupe.

2. **Aucune donnée inventée** — aucun chiffre n'est écrit dans le code. Chaque indicateur
   est une entité CMS portant `value`, `unit`, `label`, `period`, `source`, `lastUpdated`,
   `isPublic`. Un indicateur non validé n'est pas affiché : la section se recompose ou se masque.

3. **Aucune relation présumée** — un logo ne qualifie pas un partenariat. Chaque partenaire
   porte un `relationshipType` explicite, une temporalité et une validation juridique.
   Sans autorisation écrite, il n'apparaît pas.

---

## Prochaine étape

Lecture et validation des phases 1 à 4, puis arbitrage des points listés dans le
[document 13](docs/13-gouvernance-donnees-questions-ouvertes.md) — en particulier la charte
graphique officielle, la qualification juridique des partenaires et la validation des indicateurs.
Le développement (Phase 5) démarre ensuite selon le séquencement proposé.
