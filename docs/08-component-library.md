# 08 — Bibliothèque de composants

> Phase 3 · Livrable 19

Chaque composant est spécifié par : **rôle · variantes · états · règles d'accessibilité ·
comportement responsive**. Aucun composant n'existe sans usage identifié dans les wireframes.

---

## 1. Primitives

### `Button`

| Variante | Usage | Style |
|---|---|---|
| `accent` | CTA principal unique de la page | Fond `amber-500`, texte `ink-900` |
| `primary` | Action forte secondaire | Fond `navy-700`, texte blanc |
| `secondary` | Action tertiaire | Transparent, bordure `border.default` |
| `ghost` | Actions de navigation en ligne | Texte seul + chevron animé |
| `link` | Lien texte contextuel | Souligné à l'offset 4 px, souligné épaissi au survol |

Tailles : `sm` (36 px) · `md` (44 px, défaut) · `lg` (52 px).
**Règle :** hauteur de cible tactile ≥ 44 px sur mobile, quelle que soit la taille visuelle.
Un `Button` qui navigue est rendu en `<a>` ; un `Button` qui agit est rendu en `<button>`.
État de chargement : libellé conservé + spinner, largeur figée (pas de saut), `aria-busy`.

### `Link`, `Icon`, `Badge`, `Tag`, `Divider`, `Avatar`, `Tooltip`, `VisuallyHidden`, `SkipLink`

- `Badge` : variantes `neutral` · `accent` · `success` · `warning` · `roadmap` · `beta`.
- `Tooltip` : accessible au clavier (`focus`), fermeture sur `Escape`, jamais l'unique
  porteur d'une information essentielle.
- `SkipLink` : premier élément focusable du document, « Aller au contenu principal ».

---

## 2. Composants de contenu

### `SectionHeader`
`eyebrow` (Overline) + `title` (H2) + `intro` (Body Large) + `action` optionnelle.
Alignement gauche par défaut ; centré uniquement pour les sections CTA pleine largeur.

### `Card` — 6 spécialisations, un seul socle

| Composant | Contenu | Comportement |
|---|---|---|
| `ExpertiseCard` | Icône, titre, 3–5 capacités, flèche | Zone cliquable entière ; révélation des capacités au survol |
| `SolutionCard` | Logo, nom, positionnement, verticale | Teinte signalétique de la solution en filet supérieur |
| `CaseStudyCard` | Image, tags, titre, date, lieu | Ratio d'image 16:9 fixé, `object-fit: cover`, point focal CMS |
| `NewsCard` | Image, catégorie, date, titre | Deux formats : `featured` (2 colonnes) et `compact` |
| `PartnerCard` | Logo, nom, **`relationshipType`**, période, description | Le type de relation est **non masquable** (règle éditoriale) |
| `PersonCard` | Photo, nom, fonction, bio courte, LinkedIn | Photo en ratio 3:4, cadrage sur le point focal |

**Socle commun :** bordure au repos, ombre au survol, translation −2 px, transition 220 ms.

### `StatCard` / `StatsRow`

```
┌────────────────────────┐
│  {{value}}{{unit}}     │  ← style Metric, chiffres tabulaires
│  Libellé du KPI        │  ← Body
│  ⓘ Source · Période    │  ← Caption, tooltip accessible
└────────────────────────┘
```

- Compteur animé une seule fois à l'entrée dans le viewport ; désactivé si `prefers-reduced-motion`.
- **Rendu conditionnel obligatoire** : si `isPublic === false` ou `value == null`, le
  composant retourne `null` et `StatsRow` recompose sa grille. Un `StatsRow` vide se masque.

### `Timeline`, `Quote`, `Disclaimer`, `MethodologyNote`, `RichText`, `Gallery`, `FigureImage`

- `Disclaimer` : variantes `info` et `regulatory`. La variante `regulatory` n'est **jamais**
  masquable ni repliable, et n'est pas rendue en `<aside>` (elle fait partie du contenu principal).
- `RichText` : rendu de Portable Text, mapping strict des blocs autorisés (H2, H3, paragraphe,
  liste, citation, lien, image légendée, tableau). Aucun HTML brut.
- `Gallery` : lightbox accessible (focus trap, `Escape`, navigation fléchée, libellés).

---

## 3. Composants de navigation

| Composant | Points d'accessibilité clés |
|---|---|
| `Header` | Landmark `banner` ; changement d'état au scroll sans reflow (transform + background) |
| `MegaMenu` | `aria-expanded`, ouverture clavier, `Escape` ferme et rend le focus au déclencheur, fermeture au blur hors du panneau |
| `MobileNav` | `role="dialog"`, focus trap, scroll du body verrouillé, fermeture par `Escape` et par le bouton |
| `Breadcrumb` | `<nav aria-label="Fil d'Ariane">` + `<ol>` + `aria-current="page"` |
| `Footer` | Landmark `contentinfo` ; colonnes en accordéons `<details>` natifs sous 768 px |
| `LocaleSwitcher` | Libellés en langue cible (« English », « Français »), `lang` et `hreflang` corrects, annonce du changement |
| `TabsAnchored` | `role="tablist"`, flèches gauche/droite, `aria-selected`, ancre reflétée dans l'URL sans saut de scroll |
| `AnchorNav` | Sommaire collant des pages longues, `aria-current` sur la section active (IntersectionObserver) |
| `Pagination` | Liens réels avec URL, pas de bouton JS |
| `StickyCta` | Mobile uniquement, apparaît au 2e écran, refermable, respecte `safe-area-inset-bottom` |

---

## 4. Composants de données et d'interaction

### `EcosystemGraph`

Composant signature du site. **Trois rendus obligatoires :**

| Rendu | Condition | Contenu |
|---|---|---|
| Interactif | ≥ 1024 px, pas de `reduced-motion`, JS actif | Graphe SVG animé, survol, clic, panneau détail |
| Statique | < 1024 px, ou `reduced-motion` | SVG figé, lisible, sans animation |
| Textuel | Toujours présent dans le DOM | Liste sémantique `<ul>` des solutions et technologies, visible pour les lecteurs d'écran |

Navigation clavier : `Tab` entre les nœuds (chacun est un `<a>` ou `<button>` réel),
`Enter` ouvre le détail, `Escape` le referme. Le graphe n'est **jamais** un `<canvas>`
sans équivalent DOM.

### `TechnologyEngine`
Même contrat en trois rendus. Animation d'apparition des liaisons par `stroke-dashoffset`,
déclenchée une fois, à 30 % de visibilité.

### `ProcessFlow`
Séquence horizontale (desktop) / verticale (mobile). Étapes numérotées, révélation
séquentielle au scroll (`stagger` 120 ms). Utilisé par KultiX (CREATE→ANALYZE),
FinTech (Revenus→Investissement) et Secure USB.

### `ProductShowcase`
Onglets + mockup. Préchargement de l'image de l'onglet adjacent, hauteur du conteneur
réservée pour éviter tout CLS, transition en fondu 220 ms.

### `FilterableGrid`
Filtres reflétés dans l'URL (`?secteur=culture`), navigation retour fonctionnelle,
`aria-live="polite"` annonçant le nombre de résultats.
**Un filtre sans résultat publiable n'est pas rendu.**

### `WorldMap`
Carte SVG (pas de bibliothèque de cartographie lourde). Chaque pays porte un
`presenceType` distinct — `headquarters` · `operations` · `market` · `distribution` ·
`development` — avec **une légende explicite** : la distinction entre « implantation » et
« pays où un produit a été distribué » est une exigence éditoriale, pas un détail graphique.
Équivalent textuel : liste des pays groupée par type.

### `ImpactDashboard`
Cinq groupes catégoriels de `StatCard`, note de méthodologie en pied, filtrage par catégorie.

---

## 5. Formulaires

`Input` · `Textarea` · `Select` · `Combobox` · `Checkbox` · `Radio` · `FileUpload` ·
`FormField` · `FormError` · `FormSuccess`

**Règles communes**
- `<label>` visible et associé — jamais de `placeholder` en guise de libellé.
- Erreur affichée sous le champ, liée par `aria-describedby`, `aria-invalid` positionné.
- Validation au `blur` puis à la soumission ; jamais à chaque frappe.
- Résumé d'erreurs en tête de formulaire, focus déplacé dessus à la soumission échouée.
- Champs obligatoires marqués textuellement, pas seulement par un astérisque coloré.

### `SmartContactForm`

Formulaire adaptatif du `/contact`. Première question : **« Comment pouvons-nous vous aider ? »**

| Profil | Champs additionnels | Destinataire | Événement |
|---|---|---|---|
| Entreprise | Société, secteur, taille, besoin (Sytium / autre) | Sales | `contact_submit` + `sytium_demo` si Sytium |
| Institution | Organisme, pays, type de projet | Institutionnel | `partner_request` |
| Investisseur | Structure, type d'investisseur, horizon | Investor Relations | `investor_contact` |
| Artiste / Label | Nom d'artiste, catalogue, distribution actuelle | Sydica | `sydica_visit` |
| Organisateur d'événement | Type d'événement, date, jauge estimée | KultiX | `kultix_request` / `event_request` |
| Partenaire technologique | Société, technologie, nature de la collaboration | Partenariats | `partner_request` |
| Média | Média, sujet, échéance | Communication | `contact_submit` |
| Candidat | Poste visé, CV | RH (→ module Recrutement Sytium) | `career_apply` |
| Autre | Message libre | Général | `contact_submit` |

Le formulaire ne montre jamais plus de **6 champs simultanément**. Le changement de profil
conserve les valeurs communes déjà saisies.

---

## 6. États système

`Skeleton` · `EmptyState` · `ErrorState` · `NotFound` · `Toast` · `CookieBanner`

- `EmptyState` : n'apparaît que là où un vide est légitime (résultat de recherche).
  Sur les sections pilotées par les données, la règle reste **le masquage de la section**.
- `CookieBanner` : non modal, ne bloque pas le contenu, refus aussi accessible que
  l'acceptation, choix persistant, aucun script de mesure avant consentement.

---

## 7. Conventions d'implémentation

```
components/
├── ui/          primitives sans logique métier (Button, Card, Badge…)
├── layout/      Header, Footer, Container, Section, Grid
├── blocks/      blocs CMS ↔ composants (1 bloc = 1 fichier)
├── graphics/    EcosystemGraph, TechnologyEngine, WorldMap, ProcessFlow
└── forms/       champs et formulaires
```

| Règle | Détail |
|---|---|
| Server Components par défaut | `"use client"` uniquement pour l'interactivité réelle (graphes, onglets, filtres, formulaires, navigation) |
| Aucune valeur codée en dur | Ni chiffre, ni texte marketing, ni couleur hexadécimale dans un composant |
| Props typées strictement | Types dérivés du schéma CMS (génération de types), pas de `any` |
| Variantes via `cva` | Une seule source de vérité par composant, pas de `className` conditionnel dispersé |
| Un composant = un fichier + une story | Storybook comme documentation vivante et support de recette visuelle |
| Tests | Rendu + accessibilité (`axe`) sur chaque composant interactif |
