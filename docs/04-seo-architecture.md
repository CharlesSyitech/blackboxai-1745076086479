# 04 — Architecture SEO internationale

> Phase 1 · Livrable 6

---

## 1. Stratégie

Trois intentions de recherche, trois traitements distincts :

| Intention | Exemple de requête | Page cible | Levier |
|---|---|---|---|
| **Marque** | « syitech », « sydica », « kultix », « sytium » | Home, pages solution | Schema.org `Organization`, sitelinks, cohérence NAP |
| **Solution / produit** | « ERP SYSCOHADA », « logiciel paie Côte d'Ivoire », « billetterie en ligne Abidjan » | Pages solution | Contenu fonctionnel profond, `SoftwareApplication`, FAQ |
| **Expertise / thématique** | « transformation numérique entreprise Afrique », « inclusion financière créateurs » | Pages expertise + Insights | Contenu éditorial, maillage, `Article` |

La homepage n'est pas optimisée pour une requête transactionnelle : elle porte
la marque et distribue l'autorité vers les pages solution et expertise.

---

## 2. Internationalisation

### 2.1 Structure d'URL

Sous-répertoires par locale, slugs localisés :

```
https://www.syitechgroup.com/fr/solutions/sytium
https://www.syitechgroup.com/en/solutions/sytium
https://www.syitechgroup.com/fr/solutions/cartes-usb-securisees
https://www.syitechgroup.com/en/solutions/secure-usb-cards
```

- Pas de sous-domaines par langue (dilution de l'autorité).
- Pas de détection automatique **sans** URL dédiée : la redirection depuis `/` est une commodité, chaque locale reste directement adressable et indexable.
- `/` renvoie un 307 (temporaire) — jamais 301 — pour ne pas figer une locale dans les index.

### 2.2 hreflang

Généré depuis la table de routage (`lib/i18n/routes.ts`), sur **chaque** page :

```html
<link rel="alternate" hreflang="fr" href="https://www.syitechgroup.com/fr/solutions/sytium" />
<link rel="alternate" hreflang="en" href="https://www.syitechgroup.com/en/solutions/sytium" />
<link rel="alternate" hreflang="x-default" href="https://www.syitechgroup.com/en/solutions/sytium" />
<link rel="canonical" href="https://www.syitechgroup.com/fr/solutions/sytium" />
```

**Règles :**
- Réciprocité obligatoire (A→B et B→A), vérifiée par un test automatisé au build.
- `x-default` = version **EN** (audience internationale la plus large pour l'entrée non ciblée).
- Une page sans traduction publiée **n'émet pas** de `hreflang` vers une URL 404 ou vide.
- `canonical` toujours absolu, auto-référent, sans paramètres de suivi.

### 2.3 Paramètres et filtres

Les pages index filtrables (`/realisations`, `/actualites`, `/carrieres`, `/partenaires`)
utilisent des query params (`?secteur=`, `?categorie=`).

- Les URL filtrées portent un `canonical` vers l'URL **non filtrée**.
- Elles ne sont pas incluses dans le sitemap.
- Exception : les catégories d'actualités ont une **URL propre** indexable
  (`/fr/actualites/categorie/innovation`) car elles portent un potentiel sémantique réel.

---

## 3. Metadata (Next.js Metadata API)

Un helper unique `buildMetadata()` produit toutes les balises depuis les données CMS ;
aucune page ne compose ses balises à la main.

| Balise | Règle | Longueur |
|---|---|---|
| `title` | `{{pageTitle}} | Syitech Group` — la home : `Syitech Group — Technology. Ecosystems. Impact.` | 50–60 car. |
| `description` | Rédigée par l'éditeur, jamais auto-générée par troncature | 140–160 car. |
| `openGraph` | `type`, `title`, `description`, `url`, `siteName`, `locale`, `images[1200×630]` | — |
| `twitter` | `summary_large_image` | — |
| `robots` | `index,follow` par défaut ; `noindex` sur `/recherche`, pages de remerciement, previews | — |
| `alternates` | `canonical` + `languages` (hreflang) | — |

**Images OG :** générées dynamiquement (`opengraph-image.tsx`, runtime edge) à partir du
titre, de l'eyebrow et du logo, avec un gabarit par type de page (corporate / solution /
case study / article). Une image OG statique de secours est définie au niveau du layout racine.

**Fallback :** si `seo.description` est absente en CMS, le build **échoue en préproduction**
plutôt que de générer une description tronquée.

---

## 4. Données structurées (Schema.org, JSON-LD)

| Type | Où | Contenu |
|---|---|---|
| `Organization` | Layout racine (toutes pages) | name, legalName, url, logo, sameAs[], address[], contactPoint[], foundingDate |
| `WebSite` + `SearchAction` | Home | URL de recherche interne |
| `SoftwareApplication` | `/solutions/sytium`, `/sydica`, `/kultix` | name, applicationCategory, operatingSystem, description, offers (uniquement si tarif public) |
| `Product` | `/solutions/secure-usb`, `/usb-connect` | name, description, brand |
| `Article` / `NewsArticle` | `/actualites/<slug>` | headline, datePublished, dateModified, author, image, publisher |
| `Event` | Case studies événementiels | name, startDate, location, organizer, image |
| `BreadcrumbList` | Toutes pages de niveau ≥ 2 | Fil d'Ariane complet |
| `JobPosting` | `/carrieres/<slug>` | title, datePosted, validThrough, employmentType, hiringOrganization, jobLocation |
| `FAQPage` | Pages solution avec bloc FAQ | questions/réponses réelles de la page |

**Interdits :** `AggregateRating`, `Review`, `Offer` fictifs ; toute donnée structurée
non visible à l'écran ; tout `Organization.award` non validé.

---

## 5. Sitemap & robots

### `sitemap.xml`

Généré dynamiquement (`app/sitemap.ts`) depuis le CMS :

- Index de sitemaps segmenté : `sitemap-pages.xml`, `sitemap-solutions.xml`,
  `sitemap-news.xml`, `sitemap-work.xml`, `sitemap-jobs.xml`.
- Chaque entrée : `loc`, `lastmod` (issu de `_updatedAt`), `changefreq`, `priority`,
  et les balises `xhtml:link` d'alternance de langue.
- Exclus : pages de preview, `/recherche`, URL paramétrées, contenus `isPublic: false`.

### `robots.txt`

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /recherche
Disallow: /*?*preview=
Disallow: /studio

Sitemap: https://www.syitechgroup.com/sitemap.xml
```

En préproduction : `Disallow: /` intégral + en-tête `X-Robots-Tag: noindex` (garde-fou
contre l'indexation accidentelle d'un environnement de recette).

---

## 6. Architecture sémantique par page (extrait)

| Page | H1 | Requêtes cibles (FR) | Requêtes cibles (EN) |
|---|---|---|---|
| Home | Nous construisons les technologies qui transforment les économies africaines | syitech, syitech group, groupe technologique africain | syitech, african technology group |
| `/groupe` | Un groupe technologique africain. Une vision globale. | syitech group à propos, entreprise tech Abidjan | about syitech group |
| `/solutions/sytium` | Sytium — une plateforme intelligente pour piloter toute votre organisation | erp syscohada, logiciel gestion entreprise Afrique, logiciel paie, comptabilité analytique | erp software africa, syscohada erp |
| `/solutions/sydica` | Sydica — la technologie au service des créateurs africains | streaming africain, distribution musicale Afrique, monétisation artistes | african music streaming platform, creator monetization |
| `/solutions/kultix` | KultiX — billetterie intelligente pour de meilleurs événements | billetterie en ligne Abidjan, contrôle d'accès événement, logiciel billetterie | event ticketing platform africa |
| `/solutions/secure-usb` | Quand distribution physique et technologie se rencontrent | carte usb personnalisée, distribution contenu hors ligne | secure usb cards, offline content distribution |
| `/expertises/fintech-inclusion-financiere` | De l'économie créative à l'opportunité financière | inclusion financière créateurs, technologies paiement Afrique | financial inclusion technology africa |
| `/technologies` | La technologie derrière notre écosystème | intelligence artificielle Afrique entreprise, blockchain traçabilité | ai blockchain iot africa |
| `/realisations` | Nos technologies en action | réalisations technologiques Afrique, projets numériques | technology case studies africa |

**Règle :** un seul `H1` par page, égal ou très proche du titre éditorial affiché.
La hiérarchie `H2`/`H3` suit strictement l'ordre visuel — aucun titre décoratif en `H2`.

---

## 7. Performance SEO technique

| Point | Exigence |
|---|---|
| Rendu | SSG/ISR par défaut ; aucune page indexable en client-side rendering pur |
| Core Web Vitals | LCP < 2,0 s · INP < 200 ms · CLS < 0,05 (voir doc 12) |
| Images | `next/image`, AVIF+WebP, `alt` obligatoire et rédigé (jamais le nom de fichier) |
| Liens | `<Link>` réels, jamais de `onClick` sur `div` pour naviguer |
| Pagination | `rel="next"/"prev"` logiques + URLs propres pour les index paginés |
| 404 | Page 404 utile (recherche + liens principaux), statut 404 réel |
| Redirections | Table `redirects` en CMS → `next.config.js` (301 permanentes) ; aucune chaîne > 1 saut |
| Contenu dupliqué | Un contenu = une URL ; les blocs partagés (ex. teaser Sytium) ne dupliquent pas le contenu long |

---

## 8. Mesure

- **Google Search Console** : deux propriétés de suivi (fr, en) via filtres ; surveillance
  des erreurs `hreflang` et de la couverture.
- **Bing Webmaster Tools** : soumission du sitemap.
- **Suivi de positions** : 40 requêtes prioritaires (20 FR / 20 EN), revue mensuelle.
- **Alerte automatisée** : baisse > 20 % d'impressions sur une page pilier → notification.
- **Contrôles au build** (bloquants) : title/description manquants, `hreflang` non réciproque,
  `alt` manquant, `H1` absent ou multiple, lien interne cassé, placeholder `{{...}}` résiduel.
