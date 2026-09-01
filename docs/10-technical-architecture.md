# 10 — Architecture technique (Next.js)

> Phase 4 · Livrables 21 & 23

---

## 1. Stack

| Couche | Choix | Justification |
|---|---|---|
| Framework | **Next.js (App Router), dernière version stable** | Server Components, ISR, Metadata API, i18n par segment, optimisation d'images native |
| Langage | **TypeScript strict** | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` |
| UI | **React** (Server Components par défaut) | Bundle client minimal |
| Styles | **Tailwind CSS** adossé aux tokens | Le thème Tailwind est **généré** depuis `design-system/tokens.json` — source unique |
| Animation | **Framer Motion** (`LazyMotion` + `m`) | Chargement différé, API déclarative, `useReducedMotion` |
| CMS | **Sanity** (recommandé) | Voir §2 |
| Formulaires | **Server Actions** + `zod` + `react-hook-form` | Validation partagée client/serveur |
| Tests | Vitest · Testing Library · Playwright · axe-core | Unitaire, intégration, E2E, accessibilité |
| Qualité | ESLint · Prettier · `tsc --noEmit` · Lighthouse CI | Bloquants en CI |
| Hébergement | Vercel (ou équivalent supportant ISR + edge) | ISR à la demande, CDN global, images |

### Choix du CMS — Sanity vs Strapi

| Critère | Sanity | Strapi |
|---|---|---|
| Internationalisation champ par champ | Native (`internationalizedArray`, document-level i18n) | Plugin, plus rigide |
| Contenu structuré riche | Portable Text (typé, sans HTML libre) | Rich text HTML/Markdown |
| Prévisualisation en direct | Native (draft mode + live preview) | À construire |
| Validation métier (nos règles `isPublic`, `relationshipType`) | Règles de validation et actions personnalisées en TypeScript | Hooks de cycle de vie |
| Hébergement / exploitation | SaaS managé, pas de serveur à opérer | Auto-hébergé, base de données à opérer |
| Rôles et workflow de validation | Rôles et permissions granulaires | Selon édition |
| Coût | Par usage (API/documents) | Infrastructure + exploitation |

**Recommandation : Sanity.** Le facteur décisif est la **capacité à imposer les règles
éditoriales par la validation** (un `Strategic Partner` sans `contractReference` doit être
impossible à publier) et l'i18n champ par champ, tous deux natifs. Si une contrainte de
souveraineté des données impose un hébergement local, **Strapi auto-hébergé** est le
repli : le modèle de données du document 11 est portable, seule la couche d'accès change.

---

## 2. Arborescence

```
/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                  # Header, Footer, providers, JSON-LD Organization
│   │   ├── page.tsx                    # Home
│   │   ├── groupe/                     # segments localisés via rewrites
│   │   ├── expertises/[slug]/
│   │   ├── solutions/[slug]/
│   │   ├── technologies/[slug]/
│   │   ├── realisations/[[...slug]]/
│   │   ├── impact/ partenaires/ actualites/ carrieres/ investisseurs/ contact/
│   │   ├── opengraph-image.tsx
│   │   └── not-found.tsx
│   ├── api/
│   │   ├── revalidate/route.ts         # webhook CMS (signature vérifiée)
│   │   ├── contact/route.ts            # repli non-JS
│   │   └── preview/route.ts            # draft mode
│   ├── sitemap.ts  robots.ts  manifest.ts
│   └── globals.css
├── components/         # ui · layout · blocks · graphics · forms   (voir doc 08)
├── features/           # logique par domaine : home, solutions, work, partners, careers…
├── lib/
│   ├── sanity/         # client, requêtes GROQ, types générés, image builder
│   ├── i18n/           # routes.ts (table de routage), dictionnaires, helpers
│   ├── seo/            # buildMetadata, JSON-LD, hreflang
│   ├── analytics/      # taxonomie d'événements typée
│   └── utils/
├── hooks/              # useReducedMotion, useInView, useMediaQuery, useLockScroll
├── services/           # contact, jobs (Sytium), newsletter, rate-limit
├── types/              # types du domaine, types CMS générés
├── content/            # contenus statiques (légal), dictionnaires d'interface
├── sanity/             # schémas, structure du desk, actions personnalisées
├── design-system/      # tokens.json + générateur de thème Tailwind
├── scripts/            # check-contrast, check-placeholders, check-hreflang, check-links
├── public/
└── docs/
```

**Frontière `features` / `components` :** `components` ne contient aucun accès aux données.
`features` compose des requêtes et des composants ; c'est le seul endroit où l'on écrit du GROQ.

---

## 3. Stratégie de rendu

| Page | Stratégie | Revalidation |
|---|---|---|
| Home | **ISR** | 60 s + revalidation à la demande par webhook (tag `home`) |
| Pages pilier, expertises, solutions, technologies | **SSG + ISR** | À la demande (tags par document) |
| Réalisations, case studies | SSG + ISR | À la demande |
| Actualités (index + articles) | SSG + ISR | À la demande + 300 s |
| Impact | ISR | 300 s (les KPI évoluent) |
| Partenaires | SSG + ISR | À la demande |
| Carrières | ISR | 300 s (offres volatiles) |
| Contact | Statique + Server Action | — |
| Recherche | Dynamique, `noindex` | — |

**Revalidation à la demande.** Le webhook Sanity appelle `/api/revalidate` avec une
signature HMAC vérifiée, puis `revalidateTag()` sur les étiquettes concernées :

```
document.type = 'solution'  → tags: ['solution:<slug>', 'solutions', 'home']
document.type = 'kpi'       → tags: ['kpi:<id>', 'home', 'impact', …pages référentes]
document.type = 'partner'   → tags: ['partners', 'home']
```

Un KPI modifié rafraîchit **toutes** les pages qui l'affichent : c'est la contrepartie
technique de la règle « aucun chiffre en dur ».

---

## 4. Couche d'accès aux données

```ts
// lib/sanity/queries/solutions.ts   (illustratif)
export const solutionBySlug = defineQuery(`
  *[_type == "solution" && slug[$locale].current == $slug && isPublished == true][0]{
    ...,
    "expertise": expertise->{title, "slug": slug[$locale].current},
    "technologies": technologies[]->{title, icon, "slug": slug[$locale].current},
    "kpis": kpis[]->{ _id, key, value, unit, label, period, source, lastUpdated, isPublic },
    "caseStudies": *[_type == "caseStudy" && references(^._id) && disclosureLevel == "public"][0..2]
  }
`)
```

**Règles non négociables**

1. **Le filtrage de publication se fait dans la requête, côté serveur.** Un document
   `isPublic: false` ne quitte jamais le serveur — jamais de filtrage côté client, qui
   exposerait la donnée dans le payload.
2. Types générés depuis les schémas (`sanity typegen`) ; aucun type écrit à la main.
3. Une requête par bloc, colocalisée avec la feature.
4. `next: { tags: [...] }` sur chaque `fetch` pour la revalidation ciblée.
5. Aucun jeton CMS exposé côté client ; le client de lecture publique n'utilise que le CDN.

---

## 5. Internationalisation

```ts
// lib/i18n/routes.ts — source unique de vérité
export const routes = {
  group:        { fr: 'groupe',      en: 'group' },
  solutions:    { fr: 'solutions',   en: 'solutions' },
  work:         { fr: 'realisations',en: 'work' },
  partners:     { fr: 'partenaires', en: 'partners' },
  // …
} as const
```

Cette table alimente **quatre** consommateurs : le middleware de réécriture, le
`LocaleSwitcher`, la génération des `hreflang` et le sitemap. Un ajout de page se fait
en un seul endroit.

- **Middleware** : détection de la locale (cookie > `Accept-Language` > défaut `fr`),
  réécriture des segments localisés vers les segments canoniques du routeur.
- **Textes d'interface** : dictionnaires typés (`content/dictionaries/{fr,en}.json`),
  chargés côté serveur. Une clé manquante **échoue le build** en préproduction.
- **Contenu** : i18n au niveau du champ dans le CMS ; règle de repli explicite et affichée.
- **Formats** : `Intl.DateTimeFormat` et `Intl.NumberFormat` par locale — aucun format de
  date écrit à la main.

---

## 6. API et intégrations

| Route / Action | Type | Fonction | Protections |
|---|---|---|---|
| `contactAction` | Server Action | Formulaire de contact adaptatif | `zod`, rate limit, honeypot, captcha, routage par profil |
| `applyAction` | Server Action | Candidature → module Recrutement de Sytium | Validation de fichier (type, taille, antivirus), rate limit |
| `newsletterAction` | Server Action | Inscription newsletter | Double opt-in |
| `/api/revalidate` | Route Handler | Webhook CMS | Signature HMAC, allowlist de types |
| `/api/preview` | Route Handler | Draft mode | Jeton signé, session courte, `noindex` |
| `/api/og/*` | Route Handler (edge) | Images OG dynamiques | Cache immuable |

**Intégration Sytium (recrutement).** Contrat côté site : `POST /api/v1/recruitment/applications`
avec authentification par clé de service **côté serveur uniquement**. Le site n'attend jamais
la réponse pour confirmer à l'utilisateur : la candidature est mise en file, un accusé est
affiché immédiatement, et un échec est rejoué (retry exponentiel) puis alerté.
**Repli obligatoire :** si l'API Sytium est indisponible, la candidature est enregistrée et
envoyée par courriel au service RH — aucune candidature n'est perdue.

---

## 7. Gestion des images et médias

- `next/image` partout, AVIF puis WebP, `sizes` explicite sur chaque image responsive.
- Points focaux (hotspot/crop) définis en CMS et respectés au recadrage.
- `priority` uniquement sur l'image LCP de chaque page (une seule).
- `placeholder="blur"` avec LQIP généré par le CMS.
- Aucune vidéo en autoplay ; les vidéos éventuelles sont sous interaction, avec affiche.
- Poids cible : ≤ 200 Ko pour un visuel de hero, ≤ 80 Ko pour une image de carte.

---

## 8. Environnements et livraison

| Environnement | Usage | Particularités |
|---|---|---|
| `local` | Développement | Dataset CMS de développement |
| `preview` | Une URL par branche/PR | `noindex` + `Disallow: /`, jeu de données de recette |
| `staging` | Recette client et validation éditoriale | Dataset de production en lecture, protégé par mot de passe |
| `production` | — | Dataset de production |

**Pipeline CI (bloquant) :** `typecheck` → `lint` → `test` → `build` → `check:contrast` →
`check:placeholders` (aucun `{{…}}` publié) → `check:hreflang` → `check:links` →
`a11y` (axe sur 12 pages clés) → `lighthouse-ci` (seuils du doc 12) → déploiement.

Aucun déploiement en production sans que ces étapes passent au vert.
