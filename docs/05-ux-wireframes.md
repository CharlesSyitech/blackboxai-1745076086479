# 05 — UX & Wireframes

> Phase 2 · Livrables 7 à 13

Wireframes en basse fidélité, orientés structure, hiérarchie et intention.
Les proportions indiquées valent pour un viewport de référence de **1440 px**
(conteneur de contenu 1200 px, gouttières 24 px).

Légende : `▮` image/visuel · `▭` bloc de texte · `▬` bouton · `[…]` composant nommé.

---

## 1. Homepage — desktop (18 sections)

### S1 · HERO — Vision Syitech · `100vh` (max 900 px)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Top-bar utilitaire]  Investisseurs · Carrières · Presse · Contact           │
│ [SYITECH GROUP]  Le Groupe▾ Expertises▾ Solutions▾ Technologie Réalisations  │
│                  Impact Partenaires Actualités      FR|EN ⌕ ▬Devenir partenaire│
├──────────────────────────────────────────────────────────────────────────────┤
│                                          │                                    │
│  SYITECH GROUP                    (eyebrow)│      [EcosystemCanvas]           │
│                                          │                                    │
│  Nous construisons les technologies      │    ·  ·   ○ SYTIUM  ·              │
│  qui transforment les économies          │      ○ SYDICA   ◉      ○ KULTIX    │
│  africaines.                    (Display)│         ·   SYITECH   ·            │
│                                          │      ○ FINTECH   ·  ○ HARDWARE     │
│  Syitech Group conçoit des plateformes,  │        ·   ○ IoT   ·               │
│  infrastructures et technologies qui     │                                    │
│  connectent entreprises, culture,        │  arrière-plan : AI · DATA ·        │
│  finance et innovation.        (Body L)  │  BLOCKCHAIN · IoT · R&D            │
│                                          │                                    │
│  ▬ Découvrir Syitech Group   ▬ Explorer notre écosystème                     │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────       │
│  Enterprise · CultTech · FinTech · EventTech · Hardware & IoT · AI · R&D     │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Décisions**
- Split 52 / 48. Le texte porte le message ; le visuel porte la structure du Groupe.
- Le bandeau de verticales en bas du hero est la **preuve immédiate du multi-verticales** :
  c'est lui qui casse en 3 secondes la perception « mono-produit ». Non cliquable au survol
  seul — chaque item est un lien vers la page expertise.
- Aucun carrousel, aucun logo produit en grand, aucun logo partenaire.
- `[EcosystemCanvas]` : canvas WebGL léger (ou SVG animé) — nœuds en orbite lente,
  liaisons pulsantes. **Dégradations** : `prefers-reduced-motion` → version statique ;
  < 768 px → SVG statique simplifié ; échec WebGL → image AVIF.

### S2 · À PROPOS — Le Groupe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SYITECH GROUP                                              (eyebrow)        │
│  Un groupe technologique africain.                                           │
│  Une vision globale.                                             (H1 section)│
│                                                                              │
│  ┌────────────────────────────────┐   ┌──────────────────────────────────┐  │
│  │ ▭ Origine · mission · expertise │   │ ▮ Photographie réelle            │  │
│  │   ambition · présence           │   │   (siège / équipe / terrain)     │  │
│  │   4 paragraphes courts          │   │   ratio 4:3                      │  │
│  │                                 │   │                                  │  │
│  │ ▬ Découvrir notre histoire →    │   │                                  │  │
│  └────────────────────────────────┘   └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### S3 · CHIFFRES CLÉS

```
┌──────────────────────────────────────────────────────────────────────────────┐
│   {{value}}          {{value}}          {{value}}          {{value}}         │
│   Utilisateurs       Pays              Organisations       Années            │
│   Sydica             de distribution   sur Sytium          d'activité        │
│   ⓘ source · 2026    ⓘ source · 2026   ⓘ source · 2026    ⓘ                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Compteurs animés (une seule fois, à l'entrée dans le viewport, 900 ms, `ease-out`).
- `ⓘ` = tooltip accessible : `source` + `period` + `lastUpdated`. **C'est ce détail qui
  distingue un site institutionnel d'un site marketing.**
- Grille auto-adaptative : 3, 4 ou 5 KPI selon les données publiables. Zéro KPI → section masquée.

### S4 · NOS EXPERTISES

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  EXPERTISES                                                                  │
│  Des expertises complémentaires pour construire                              │
│  des écosystèmes numériques intégrés.                                        │
│                                                                              │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                      │
│  │ ◇ CULTTECH &  │ │ ◇ ENTERPRISE  │ │ ◇ FINTECH &   │                      │
│  │   ENTERTAINMENT│ │   TECHNOLOGY  │ │   INCLUSION   │                      │
│  │ Streaming ·   │ │ ERP · Finance │ │ Payments ·    │                      │
│  │ Creator Econ. │ │ HR · CRM · BI │ │ Wallet · Cards│                      │
│  │           →   │ │           →   │ │           →   │                      │
│  └───────────────┘ └───────────────┘ └───────────────┘                      │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────────┐│
│  │ ◇ EVENTTECH   │ │ ◇ HARDWARE    │ │ ◇ AI, DATA &  │ │ ◇ RESEARCH &     ││
│  │               │ │   & IoT       │ │   BLOCKCHAIN  │ │   DEVELOPMENT    ││
│  └───────────────┘ └───────────────┘ └───────────────┘ └──────────────────┘│
└──────────────────────────────────────────────────────────────────────────────┘
```

- Grille 3 + 4. Cartes **hautes de 260 px**, bordure fine, fond surface.
- Survol : élévation +2, bordure accent, révélation des sous-capacités (hauteur animée).
- Chaque carte est un `<a>` complet (zone de clic entière), pas un `div` avec un lien intérieur.

### S5 · ÉCOSYSTÈME TECHNOLOGIQUE

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Une technologie. Plusieurs usages. Un écosystème connecté.                  │
│                                                                              │
│         ┌──────────────── [EcosystemGraph — interactif] ───────────────┐     │
│         │      ╭─ SYDICA ─╮        ╭─ SYTIUM ─╮       ╭─ KULTIX ─╮      │     │
│         │           ╲          │          ╱                             │     │
│         │            ╲         │         ╱                              │     │
│         │        ┌───────  SYITECH GROUP  ───────┐                      │     │
│         │            ╱         │         ╲                              │     │
│         │           ╱          │          ╲                             │     │
│         │  ╭ FINTECH ╮   ╭ SECURE USB ╮  ╭ USB CONNECT ╮  ╭ IoT ╮       │     │
│         │                                                              │     │
│         │  ░░ couche socle : AI · DATA · BLOCKCHAIN · IoT · R&D ░░      │     │
│         └──────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  Panneau latéral au clic sur un nœud : nom, positionnement, technologies,    │
│  lien vers la page solution.                                    ▬ Explorer   │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Message visuel :** le socle technologique est en arrière-plan, physiquement *sous* les
  solutions. C'est la traduction graphique de « une technologie, plusieurs usages ».
- Interaction : survol = mise en évidence des liens ; clic = panneau détail ; clavier =
  navigation `Tab` entre nœuds, `Enter` pour ouvrir. Fallback : liste de liens sémantiques
  toujours présente dans le DOM (lisible par lecteur d'écran).

### S6 · FOCUS SYTIUM

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [logo Sytium]  ENTERPRISE TECHNOLOGY                                        │
│  One intelligent platform to manage your entire organization.                │
│                                                                              │
│  ┌ Finance ┬ RH ┬ CRM ┬ Projets ┬ Achats ┬ BI ┬ Mobile ┐  (onglets)         │
│  ├──────────────────────────────────────────────────────┤                    │
│  │  ▭ Description du module      │  ▮ MOCKUP RÉEL       │                    │
│  │  · Comptabilité SYSCOHADA     │  (capture produit    │                    │
│  │  · Analytique · IFRS          │   annotée, ombre     │                    │
│  │  · Trésorerie · Reporting     │   portée douce)      │                    │
│  └──────────────────────────────────────────────────────┘                    │
│  ▬ Découvrir Sytium      ▬ Demander une démonstration                        │
└──────────────────────────────────────────────────────────────────────────────┘
```
Fond **sombre** (section « produit ») pour créer un contraste de rythme avec S4/S5.

### S7 · FOCUS SYDICA

Miroir de S6, fond clair, orientation culturelle : logo, positionnement
*Technology empowering African creators*, 4 piliers (Streaming · Monétisation ·
Artist & Label Management · Analytics), 3 KPI Sydica, visuel produit mobile.
CTA : *Découvrir Sydica* / *Artistes & Labels*.

### S8 · FINTECH & INCLUSION FINANCIÈRE

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  From creative income to financial opportunity.                              │
│                                                                              │
│  Revenus → Wallet → Paiement → Carte → Épargne → Protection → Investissement │
│   ●────────●─────────●──────────●───────○─────────○────────────○             │
│   disponible                            │  selon disponibilité réglementaire │
│                                                                              │
│  ⚠ Syitech Group fournit des technologies. Les services financiers régulés   │
│    sont opérés par des établissements agréés partenaires.        (disclaimer)│
└──────────────────────────────────────────────────────────────────────────────┘
```
Les pastilles pleines (`●`) = disponible ; creuses (`○`) = soumis à disponibilité réglementaire.
Le statut vient du champ CMS `regulatoryStatus`, **jamais du design**.

### S9 · KULTIX / EVENTTECH

```
│  Smarter ticketing. Better events.                                           │
│   ① CREATE ──▶ ② SELL ──▶ ③ ACCESS ──▶ ④ MANAGE ──▶ ⑤ ANALYZE               │
│   [animation séquentielle au scroll, 5 × 400 ms, arrêt si reduced-motion]    │
│   ▮ visuel : dashboard organisateur + app de scan (mobile)                   │
│  ▬ Découvrir KultiX   ▬ Organiser un événement                               │
```

### S10 · CASE STUDY GADJI CELI

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ▮▮▮ PHOTOGRAPHIE PLEINE LARGEUR (réelle, concert) — hauteur 620 px ▮▮▮       │
│                                                                              │
│   RÉALISATION · ÉVÉNEMENTIEL                                                 │
│   GADJI CELI — LE KING EN FÊTE                                               │
│   4 avril 2026 · Esplanade du Palais de la Culture, Abidjan                  │
│                                                                              │
│   Production · Organisation · Billetterie · Contrôle d'accès · Technologie   │
│   {{eventAttendees}} participants                                            │
│                                                       ▬ Découvrir le projet  │
└──────────────────────────────────────────────────────────────────────────────┘
```
**Cadrage éditorial :** c'est une **preuve de capacité d'exécution**, pas une promotion de
concert. Le titre de section en amont est « Nos technologies en conditions réelles ».

### S11 · HARDWARE / SECURE USB

Deux colonnes : macro-photographie produit (carte USB, texture, finition premium) /
texte « Quand distribution physique et technologie se rencontrent » + 4 avantages
+ 2 KPI (`{{usbCardsDistributed}}`, `{{usbCountries}}`) + CTA *Découvrir la technologie* / *Demander un devis*.

### S12 · TECHNOLOGY ENGINE

```
│  The technology behind our ecosystem.                                        │
│                    AI ─────┐   ┌───── BLOCKCHAIN                             │
│              DATA ─────┐   │   │   ┌───── IoT                                │
│                     ┌──▼───▼───▼───▼──┐                                      │
│                     │ SYITECH TECHNOLOGY │                                   │
│                     └──▲───▲───▲───▲──┘                                      │
│           SECURITY ────┘   │   │   └──── CLOUD                               │
│                            ▼   ▼                                             │
│        Sydica · Sytium · KultiX · FinTech · Hardware                         │
```
Section **plein écran, fond ink**, animation de lignes de connexion (SVG `stroke-dashoffset`).
C'est le moment « spectaculaire » du parcours — un seul par page suffit.

### S13 · RÉALISATIONS

`Nos technologies en action.` — barre de filtres (Culture · Enterprise · Events ·
Public Sector · Technology · IoT) + grille 3 colonnes de 6 case studies + *Voir toutes les réalisations*.
Un filtre sans résultat publiable est **masqué**, jamais affiché vide.

### S14 · IMPACT

Cinq colonnes catégorielles (Culture · Technology · Enterprise · Economic · Social),
chacune 2–3 KPI. Lien *Voir le rapport d'impact*. Mention de méthodologie en pied de section.

### S15 · PARTENAIRES & ÉCOSYSTÈME

```
│  Un écosystème de partenaires pour accélérer l'impact.                       │
│  ┌ Culture & Music ┬ Finance & Payments ┬ Institutions ┬ Technology ┬ …┐     │
│  │  [logo] [logo] [logo] [logo]  — niveaux de gris, couleur au survol  │     │
│  │  au survol : nom + type de relation exact + période                 │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│  Note : la nature de chaque relation est indiquée. Un logo n'implique pas    │
│  un partenariat stratégique.                                     ▬ Voir tous │
```
**Aucun partenaire n'a de bloc autonome.** Ordre des catégories fixe, indépendant de la
notoriété des marques.

### S16 · ACTUALITÉS — 3 derniers articles (catégorie, date, titre, image).

### S17 · CTA CORPORATE

```
│              Construisons le prochain écosystème technologique.              │
│      ▬ Devenir partenaire        ▬ Parler à notre équipe                     │
```

### S18 · FOOTER — 5 colonnes + bande légale + mention réglementaire (voir doc 01 §4.4).

---

## 2. Homepage — mobile (≤ 768 px) : 12 sections

Le brief impose de simplifier. **Arbitrage retenu :**

| # | Section desktop | Traitement mobile |
|---|---|---|
| 1 | Hero | Conservé — visuel remplacé par un SVG statique ; 1 seul CTA principal + lien texte secondaire |
| 2 | À propos | Conservé, texte réduit à 2 paragraphes (`shortIntro` en CMS) |
| 3 | Chiffres | Conservé — 3 KPI max, grille 2 colonnes |
| 4 | Expertises | Conservé — **carrousel horizontal à défilement natif** (`scroll-snap`), pas d'accordéon |
| 5 | Écosystème | **Remplacé** par une liste de solutions + un schéma statique compact |
| 6 | Sytium | Fusionné dans un bloc « Nos solutions phares » (onglets → accordéon, 1 mockup) |
| 7 | Sydica | idem |
| 8 | FinTech | Conservé — flux vertical au lieu d'horizontal |
| 9 | KultiX | Fusionné dans « Nos solutions phares » |
| 10 | Case study | **Conservé, prioritaire** — c'est la preuve la plus forte |
| 11 | Hardware | Conservé, format compact |
| 12 | Technology Engine | **Simplifié** : 6 pastilles technologiques, pas d'animation de liens |
| 13 | Réalisations | Conservé — 3 items, filtres en `<select>` natif |
| 14 | Impact | **Réduit** à 4 KPI transverses + lien |
| 15 | Partenaires | Conservé — logos en grille 3 colonnes, catégories en accordéon |
| 16 | Actualités | Conservé — 2 articles |
| 17 | CTA | Conservé |
| 18 | Footer | Accordéons par colonne |

**Résultat : 12 sections effectives, ~7 500 px de hauteur** (contre ~14 000 px en desktop).
CTA principal *Devenir partenaire* en barre collante en bas d'écran à partir du 2e écran de scroll,
masquable, respectant les zones sûres iOS (`env(safe-area-inset-bottom)`).

---

## 3. Page Groupe (T8)

```
Hero corporate (image siège + titre)
→ Chiffres clés corporate
→ Notre histoire (extrait) ─────▶ [Timeline verticale, jalons datés]
→ Vision & Mission (2 colonnes)
→ Nos valeurs (4 items)
→ Notre modèle (schéma : Groupe → verticales → socle)
→ Nos implantations (carte interactive, extrait)
→ Gouvernance (organes, sobre, sans organigramme RH)
→ Leadership (grille 4 colonnes : photo, nom, fonction, bio courte, LinkedIn)
→ Distinctions (liste datée : organisme, année, lien)
→ Propriété intellectuelle (compteurs par statut : Filed / Pending / Granted)
→ CTA corporate
```

**Timeline** — colonne d'années à gauche, contenu à droite, ligne de progression animée au scroll ;
sur mobile, empilement vertical simple avec puces d'année.

---

## 4. Page Expertise (T3) — gabarit unique

```
┌─ Hero expertise : eyebrow "EXPERTISE" · H1 · sous-titre · visuel abstrait ───┐
├─ L'enjeu (texte 60–90 mots, sur fond surface)                                │
├─ Nos capacités — grille 2×4, icône + libellé + 1 ligne                       │
├─ Technologies mobilisées — pastilles cliquables → /technologies/*            │
├─ Nos solutions — 1 à 3 cartes solution (données liées)                       │
├─ Réalisations — 1 à 2 case studies filtrés sur cette expertise               │
├─ Chiffres de l'expertise (si publiables)                                     │
└─ CTA contextuel                                                              │
```

---

## 5. Page Solution (T4) — gabarit unique, exemple Sytium

```
┌─ Hero produit ───────────────────────────────────────────────────────────────┐
│  [logo Sytium]  ENTERPRISE TECHNOLOGY · une solution Syitech Group           │
│  One intelligent platform to manage your entire organization.                │
│  ▬ Demander une démonstration   ▬ Voir les modules                           │
│  ▮ Mockup principal (dashboard), perspective légère                          │
├─ Le problème (3 constats) / La réponse (3 réponses)                          │
├─ UNIVERS FONCTIONNELS — navigation par onglets ancrés (URL `#finance`)       │
│   Finance & Accounting · Human Resources · Commercial & CRM · Projects        │
│   Procurement & Logistics · Business Plan · Business Intelligence             │
│   AI Assistant · Mobile · Collaboration                                       │
│   → pour chaque : liste fonctionnelle exacte + mockup réel + badge maturité  │
├─ MOBILE — bloc dédié : pointage géolocalisé, présence temps réel, RH,        │
│   permissions, statistiques (visuel téléphone)                               │
├─ Socle technologique — liens vers /technologies                              │
├─ Chiffres (si publiables)                                                    │
├─ Cas d'usage par secteur                                                     │
├─ FAQ (schema FAQPage)                                                        │
├─ CTA double                                                                  │
└─ Bloc « Une solution Syitech Group » → rappel Groupe + lien /groupe          │
```

**Badge `maturity`** : `live` (aucun badge) · `beta` · `roadmap`. Un module en `roadmap`
est affiché grisé avec la mention explicite — jamais présenté comme disponible.

---

## 6. Case Study (T5)

```
Hero : photo pleine largeur · titre · date · lieu · tags (expertise, solutions)
→ En bref : 3 à 4 KPI publiables
→ Challenge      (le problème posé, contexte, contraintes)
→ Solution       (ce que Syitech a conçu)
→ Technology     (pastilles technologies + solutions mobilisées)
→ Implementation (déroulé, équipes, calendrier, terrain)
→ Results        (KPI publiables uniquement)
→ Impact         (effets durables)
→ Galerie photo professionnelle (grille masonry, lightbox accessible)
→ Verbatim (facultatif, attribué et autorisé)
→ Réalisations liées
→ CTA
```

---

## 7. Page Partenaires (T7)

```
Hero : "Un écosystème de partenaires pour accélérer l'impact."
→ Note de méthode (encadré) : ce que signifie chaque type de relation
→ Filtres par catégorie : Culture & Music · Finance & Payments · Institutions &
  Social Impact · Technology & Innovation · Research & Education · International
→ Pour chaque catégorie : grille de cartes partenaire
   ┌──────────────────────┐
   │  [logo]              │
   │  Nom du partenaire   │
   │  ⬩ Technology Partner │  ← relationshipType affiché en clair, obligatoire
   │  Depuis 2024          │
   │  Description courte   │
   │  site ↗               │
   └──────────────────────┘
→ Collaborations passées (si `endDate` dépassée et `showAfterEnd: true`)
→ CTA "Devenir partenaire"
```

**Interdit par construction :** un composant « partenaire vedette » plein écran.
Il n'existe pas dans la bibliothèque.

---

## 8. Principes UX transverses

| Principe | Application |
|---|---|
| **Une intention par écran** | Un seul CTA primaire visible à la fois ; les CTA secondaires sont des liens texte |
| **Rythme de sections** | Alternance fond clair / surface / ink — jamais deux sections ink consécutives sauf S12 |
| **Densité progressive** | Home aérée → pages solution denses → case studies narratifs |
| **Pas de scroll hijacking** | Le scroll natif n'est jamais détourné ni verrouillé |
| **Pas de pop-up d'entrée** | Seule exception : bandeau de consentement cookies, non modal |
| **États vides** | Toute grille pilotée par les données gère : chargement (skeleton), vide (section masquée), erreur (message sobre + lien) |
| **Profondeur de clic** | Toute page atteignable en ≤ 3 clics depuis la home |
| **Retour contextuel** | Fil d'Ariane sur tous les niveaux ≥ 2 |
| **Ancres partageables** | Onglets et sections majeures adressables par `#hash` |
