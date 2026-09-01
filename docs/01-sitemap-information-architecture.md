# 01 — Sitemap final & Architecture de l'information

> Phase 1 · Livrables 1 & 2

---

## 1. Principes d'architecture

1. **Profondeur maximale : 3 niveaux.** Aucune information stratégique au-delà de `/section/page/detail`.
2. **Une intention par page.** Une page = une question du visiteur = un CTA principal.
3. **Séparation stricte Réalisations / Partenaires.** Deux rubriques distinctes, deux modèles de données distincts, jamais de mélange visuel.
4. **Les solutions sont des enfants du Groupe.** Jamais de sous-domaine ni de navigation autonome dans le site corporate.
5. **Lecture à quatre niveaux** (30 s / 3 min / 10 min / due diligence) — voir `docs/02-personas-user-journeys.md`.

---

## 2. Sitemap

```
/
├── LE GROUPE
│   ├── À propos                         /groupe
│   ├── Notre histoire                   /groupe/histoire
│   ├── Vision & Mission                 /groupe/vision-mission
│   ├── Gouvernance                      /groupe/gouvernance
│   ├── Leadership                       /groupe/leadership
│   ├── Présence internationale          /groupe/presence
│   └── Distinctions                     /groupe/distinctions
│
├── EXPERTISES                           /expertises
│   ├── Transformation numérique         /expertises/transformation-numerique
│   ├── Culture & Entertainment          /expertises/culture-entertainment
│   ├── Enterprise Technology            /expertises/enterprise-technology
│   ├── FinTech & Inclusion financière   /expertises/fintech-inclusion-financiere
│   ├── EventTech & Événementiel         /expertises/eventtech-evenementiel
│   ├── Hardware & IoT                   /expertises/hardware-iot
│   ├── AI, Blockchain & Data            /expertises/ai-blockchain-data
│   └── Recherche & Développement        /expertises/recherche-developpement
│
├── SOLUTIONS                            /solutions
│   ├── Sytium                           /solutions/sytium
│   ├── Sydica                           /solutions/sydica
│   ├── KultiX                           /solutions/kultix
│   ├── FinTech / SydiCard               /solutions/fintech
│   ├── Cartes USB sécurisées            /solutions/secure-usb
│   ├── USB Connect                      /solutions/usb-connect
│   └── IoT & Connected Solutions        /solutions/iot
│
├── TECHNOLOGIE & R&D                    /technologies
│   ├── Intelligence Artificielle        /technologies/intelligence-artificielle
│   ├── Blockchain                       /technologies/blockchain
│   ├── Data                             /technologies/data
│   ├── IoT                              /technologies/iot
│   ├── Cloud & Sécurité                 /technologies/cloud-securite
│   └── R&D et Propriété intellectuelle  /technologies/recherche-developpement
│
├── RÉALISATIONS                         /realisations
│   └── Case study                       /realisations/<slug>
│                                        ex. /realisations/gadji-celi-le-king-en-fete
│
├── IMPACT                               /impact
│
├── PARTENAIRES                          /partenaires
│
├── ACTUALITÉS                           /actualites
│   ├── Article                          /actualites/<slug>
│   └── Catégorie                        /actualites/categorie/<slug>
│
├── CARRIÈRES                            /carrieres
│   └── Offre                            /carrieres/<slug>
│
├── INVESTISSEURS                        /investisseurs
│
├── CONTACT                              /contact
│
└── UTILITAIRES
    ├── Mentions légales                 /mentions-legales
    ├── Politique de confidentialité     /confidentialite
    ├── Politique cookies                /cookies
    ├── Kit presse                       /presse
    ├── Accessibilité (déclaration)      /accessibilite
    ├── Plan du site                     /plan-du-site
    └── Recherche                        /recherche
```

**Note sur `/expertises/transformation-numerique`.** Cette page est transversale : elle
n'est pas une huitième verticale mais la **porte d'entrée B2B/B2G** qui recompose les six
autres expertises sous l'angle « votre problème », et non « notre organisation ».

---

## 3. Table de routage bilingue

Le routage est un `[locale]` segment ; les **slugs sont localisés** (exigence SEO :
un slug anglais dans une page anglaise). Le mapping est maintenu dans une table unique
(`lib/i18n/routes.ts`) qui alimente à la fois le routeur, le sélecteur de langue et les `hreflang`.

| Page | FR | EN |
|---|---|---|
| Accueil | `/fr` | `/en` |
| Le Groupe | `/fr/groupe` | `/en/group` |
| Histoire | `/fr/groupe/histoire` | `/en/group/history` |
| Vision & Mission | `/fr/groupe/vision-mission` | `/en/group/vision-mission` |
| Gouvernance | `/fr/groupe/gouvernance` | `/en/group/governance` |
| Leadership | `/fr/groupe/leadership` | `/en/group/leadership` |
| Présence | `/fr/groupe/presence` | `/en/group/global-presence` |
| Distinctions | `/fr/groupe/distinctions` | `/en/group/awards` |
| Expertises | `/fr/expertises` | `/en/expertise` |
| Transformation numérique | `/fr/expertises/transformation-numerique` | `/en/expertise/digital-transformation` |
| Culture & Entertainment | `/fr/expertises/culture-entertainment` | `/en/expertise/culture-entertainment` |
| Enterprise Technology | `/fr/expertises/enterprise-technology` | `/en/expertise/enterprise-technology` |
| FinTech & Inclusion | `/fr/expertises/fintech-inclusion-financiere` | `/en/expertise/fintech-financial-inclusion` |
| EventTech | `/fr/expertises/eventtech-evenementiel` | `/en/expertise/eventtech-live-experiences` |
| Hardware & IoT | `/fr/expertises/hardware-iot` | `/en/expertise/hardware-iot` |
| AI, Blockchain & Data | `/fr/expertises/ai-blockchain-data` | `/en/expertise/ai-blockchain-data` |
| R&D | `/fr/expertises/recherche-developpement` | `/en/expertise/research-development` |
| Solutions | `/fr/solutions` | `/en/solutions` |
| Sytium | `/fr/solutions/sytium` | `/en/solutions/sytium` |
| Sydica | `/fr/solutions/sydica` | `/en/solutions/sydica` |
| KultiX | `/fr/solutions/kultix` | `/en/solutions/kultix` |
| FinTech / SydiCard | `/fr/solutions/fintech` | `/en/solutions/fintech` |
| Cartes USB sécurisées | `/fr/solutions/cartes-usb-securisees` | `/en/solutions/secure-usb-cards` |
| USB Connect | `/fr/solutions/usb-connect` | `/en/solutions/usb-connect` |
| IoT & Connected | `/fr/solutions/iot` | `/en/solutions/iot` |
| Technologies | `/fr/technologies` | `/en/technology` |
| Réalisations | `/fr/realisations` | `/en/work` |
| Impact | `/fr/impact` | `/en/impact` |
| Partenaires | `/fr/partenaires` | `/en/partners` |
| Actualités | `/fr/actualites` | `/en/news` |
| Carrières | `/fr/carrieres` | `/en/careers` |
| Investisseurs | `/fr/investisseurs` | `/en/investors` |
| Contact | `/fr/contact` | `/en/contact` |

**Règles de routage**

- `/` redirige (307) vers `/fr` ou `/en` selon `Accept-Language`, avec cookie de préférence `NEXT_LOCALE` prioritaire.
- Le sélecteur de langue **conserve la page courante** ; s'il n'existe pas de traduction publiée, il pointe vers l'équivalent de niveau supérieur et l'annonce (`aria-live`).
- Aucun slug traduit n'est modifié après mise en ligne sans redirection 301 permanente (table `redirects` en CMS).

---

## 4. Navigation

### 4.1 Header desktop

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [SYITECH GROUP]   Le Groupe ▾  Expertises ▾  Solutions ▾  Technologie  Réalisations │
│                    Impact  Partenaires  Actualités        FR|EN  ⌕  [Devenir partenaire]│
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- Barre transparente sur le hero, puis **solide + ombre subtile** après 80 px de scroll (transition 200 ms).
- **Mega-menu** sur *Le Groupe*, *Expertises*, *Solutions* uniquement. Ouverture au survol **et** au clic/`Enter` ; fermeture sur `Escape` ; focus trap ; `aria-expanded`.
- Le mega-menu *Solutions* affiche pour chaque solution : logo, nom, une ligne de positionnement, verticale. Il ne contient **jamais** de logo partenaire.
- *Carrières*, *Investisseurs*, *Contact* ne sont pas dans la barre principale (surcharge) : ils vivent dans la **top-bar utilitaire** discrète et dans le footer.

### 4.2 Top-bar utilitaire (32 px, fond ink)

`Investisseurs · Carrières · Presse · Contact` — masquée sous 1024 px, rapatriée dans le menu mobile.

### 4.3 Header mobile

- Logo + bouton menu (44×44 px minimum).
- Panneau plein écran, **accordéons** par rubrique, CTA « Devenir partenaire » collé en bas, sélecteur FR/EN en pied de panneau.
- Aucun mega-menu sur mobile : listes verticales, une profondeur à la fois.

### 4.4 Footer

Cinq colonnes + bande légale :

| Groupe | Expertises | Solutions | Ressources | Contact |
|---|---|---|---|---|
| À propos · Histoire · Vision · Gouvernance · Leadership · Présence · Distinctions | Les 7 expertises | Les 7 solutions | Réalisations · Impact · Actualités · Presse · Investisseurs · Carrières | Adresses · Email · Téléphone · LinkedIn · Newsletter |

Bande légale : `© {{year}} Syitech Group. Tous droits réservés.` · Mentions légales · Confidentialité · Cookies · Accessibilité · Plan du site · Sélecteur FR/EN.

**Mention réglementaire permanente** (footer, toutes pages FinTech et page d'accueil) :

> Syitech Group est un fournisseur de technologies. Les services financiers régulés sont
> fournis par des établissements agréés partenaires. Syitech Group n'est ni une banque,
> ni un établissement de crédit, ni un établissement de paiement, ni une société de gestion.

---

## 5. Modèle de page (templates)

| Template | Pages concernées | Rendu | Blocs constitutifs |
|---|---|---|---|
| `T1 — Home` | `/` | ISR 60 s | 18 sections (voir doc 05) |
| `T2 — Pilier` | `/groupe`, `/expertises`, `/solutions`, `/technologies` | SSG + ISR | Hero pilier, intro, grille enfants, preuve, CTA |
| `T3 — Expertise` | 8 pages expertise | SSG + ISR | Hero, enjeu, capacités, technologies liées, solutions liées, réalisations liées, CTA |
| `T4 — Solution` | 7 pages solution | SSG + ISR | Hero produit, positionnement, univers fonctionnels, mockups, technologies, KPI, cas d'usage, CTA double |
| `T5 — Case study` | `/realisations/<slug>` | SSG + ISR | Hero, contexte, Challenge, Solution, Technology, Implementation, Results, Impact, galerie, projets liés |
| `T6 — Article` | `/actualites/<slug>` | SSG + ISR | Hero, corps riche, auteur, partage, articles liés |
| `T7 — Index filtrable` | `/realisations`, `/actualites`, `/carrieres`, `/partenaires` | SSG + filtres client (URL state) | Barre de filtres, grille, pagination |
| `T8 — Corporate` | `/groupe/*`, `/investisseurs`, `/impact` | SSG | Blocs éditoriaux longs, timeline, cartes, dashboards |
| `T9 — Formulaire` | `/contact`, `/carrieres/<slug>` | Server Action | Formulaire adaptatif, garde anti-spam |
| `T10 — Légal` | `/mentions-legales`, etc. | SSG | Contenu riche, sommaire ancré |

---

## 6. Maillage interne (règles)

Chaque page doit exposer au moins un lien vers **le niveau supérieur** et **le niveau adjacent** :

- Une **solution** renvoie vers son expertise, ses technologies socles et au moins une réalisation.
- Une **expertise** renvoie vers ses solutions, ses technologies et ses réalisations filtrées.
- Une **réalisation** renvoie vers les solutions et technologies mobilisées, et vers l'expertise concernée.
- Une **technologie** renvoie vers les solutions qui l'embarquent.
- Un **partenaire** renvoie, au maximum, vers son site externe et vers les réalisations publiques associées — **jamais** vers une page produit comme si c'était son produit.

Ce maillage est **piloté par les données** (références CMS), pas écrit à la main : voir `docs/11-cms-data-model.md`.

---

## 7. Ce qui n'existe pas (décisions d'exclusion)

| Écarté | Raison |
|---|---|
| Sous-domaines produits (`sytium.syitech…`) dans le périmètre corporate | Dilue l'autorité SEO et la lecture Groupe. Les apps produit restent sur leurs domaines applicatifs. |
| Page « Nos clients » | Non qualifiable sans autorisation contractuelle écrite ; remplacée par *Réalisations*. |
| Blog générique | Remplacé par *Actualités & Insights* structuré par catégories. |
| Chat commercial intrusif | Contraire au registre institutionnel ; remplacé par un formulaire de contact qualifiant. |
| Carrousel de produits en hero | Le hero vend la vision du Groupe (règle du brief, §7). |
| Section partenaire autonome en homepage | Aucun partenaire ne dispose d'un bloc majeur propre (règle du brief, §26). |
