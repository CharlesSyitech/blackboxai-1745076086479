# 14 — Direction artistique multi-marques & storyboard

> Phase de direction artistique demandée au §40 du master prompt premium.
> **Le développement ne reprend qu'après validation de ce document.**
>
> Tokens machine-lisibles : `design-system/brands.json`

---

## 0. Ce qui manque pour finaliser cette phase

| # | Élément | Conséquence tant qu'il manque |
|---|---|---|
| **L1** | **Logos — 4 reçus sur 7** | Syitech Group, Sydica, Sytium et KultiX sont exploités et leurs palettes relevées. Manquent **SyitEx** et **Syitech R&D**. Un cinquième fichier est arrivé en blanc sur blanc, illisible : la marque concernée reste à identifier. |
| **L2** | **Valeurs hexadécimales exactes** | Les couleurs sont **relevées à l'œil sur des logos rasterisés**, pas échantillonnées sur des sources vectorielles. Une charte ou des SVG permettraient de les figer. Les sites produits restent inaccessibles depuis l'environnement de build. |
| **L3** | **Photographies** — artistes, concerts, studios, équipes, dirigeant, hardware, événements | Le brief demande des images fortes en pleine largeur. Aucune ne sera inventée ni tirée d'une banque générique. |
| **L4** | **Vidéo corporate** | La section vidéo (§9) est structurée et administrable, mais vide. |
| **L5** | **Captures produit réelles** — Sytium, Sydica, KultiX | Les animations d'interface (§20) supposent de vrais écrans. |
| **L6** | **Portrait et texte du Directeur Général** | La citation, le nom et la fonction sont fournis ; la photographie et le texte long ne le sont pas. |

**Comment le projet avance malgré cela.** Les palettes sont déclarées dans un fichier unique
(`design-system/brands.json`). Remplacer une marque = remplacer trois valeurs. Aucun composant
n'est touché. C'est le même mécanisme qui a permis de construire le site sans la charte du Groupe.

---

## 1. Architecture de marque révisée

Le master prompt fait évoluer le portefeuille. Écart par rapport à ce qui est en production :

| Avant | Après | Nature du changement |
|---|---|---|
| Cartes USB sécurisées · USB Connect · IoT (3 solutions) | **SyitEx** (1 marque) | Consolidation en une verticale hardware nommée |
| R&D = une expertise | **Syitech R&D** = une marque | Promotion : univers propre, page la plus artistique du site |
| FinTech / SydiCard = une solution | **SydiCard** = une marque, statut *en développement* | Statut explicite, aucun CTA d'ouverture de compte |
| Sydica, Sytium, KultiX = pages internes | Marques avec **site externe** | Le site Groupe présente, les sites produits convertissent |

```
                          SYITECH GROUP
                       (au-dessus des produits)
  ┌──────────┬──────────┬───────────┬──────────┬──────────┬──────────┐
SYDICA     SYTIUM    SYDICARD    KULTIX     SYITEX    SYITECH R&D
CultTech  Enterprise  FinTech   EventTech  Hardware   DeepTech
sydica.art sytium.tech  (soon)  kultix.art   & IoT     & Research
```

**Règle non négociable, reprise du dossier initial :** un partenaire n'entre jamais dans ce schéma.
Universal Music Africa apparaît dans la section Partenaires et sur les pages produits auxquelles la
relation est officiellement rattachée — **jamais** sur une page dédiée (§16).

---

## 2. Moodboards — les sept univers

Chaque univers est décrit par quatre entrées : registre, matière, lumière, mouvement.
La palette est **provisoire** dans tous les cas.

### 2.1 SYITECH GROUP — *l'autorité* · **palette officielle**
- **Registre** : institutionnel, technologique, international. Se tient au-dessus, ne rivalise pas avec ses marques.
- **Matière** : grain fin sur l'encre, motif de circuit repris de l'icône du logo.
- **Lumière** : une source unique, froide, basse. Jamais de dégradé de marque.
- **Mouvement** : lent et ample. Rien ne se précipite.
- Palette : ink `#060B14` · surface `#0A1A3C` · primaire `#10265C` · **accent cyan `#2FD2F0`** · accent sur fond clair `#0A6C82`
- **Correction appliquée au site :** l'ambre `#E39A2B` était un substitut inventé faute de charte. Il est retiré : l'identité est navy + cyan.

### 2.2 SYDICA — *l'émotion* · **palette officielle**
- **Registre** : musique, culture, créateurs, Afrique contemporaine. Le seul univers autorisé à être chaud et saturé.
- **Matière** : formes d'onde, pochettes flottantes, grain de scène, halo de projecteur.
- **Lumière** : colorée, mobile, venant du côté — l'éclairage d'un concert.
- **Mouvement** : pulsé. Waveform réactive, transitions d'album, player flottant persistant.
- Palette : ink `#1B1435` · primaire `#8A5AD4` · wordmark `#3D2E6E` · **accent turquoise `#56D8DC`**
- **Correction :** l'accent n'est pas chaud. Le point du logo est turquoise, pas corail.

### 2.3 SYTIUM — *la maîtrise* · **palette officielle**
- **Registre** : SaaS international haut de gamme. **Strictement monochrome.**
- **Matière** : interfaces réelles, grilles de données, courbes de graphes.
- **Lumière** : neutre, frontale, sans effet — on lit des chiffres.
- **Mouvement** : les modules se composent, les courbes se tracent, la donnée circule.
- Palette : ink `#0A0A0A` · primaire `#EDEDEA` · accent `#FFFFFF`
- **Correction :** aucun bleu SaaS. Le logo est noir et blanc cassé. C'est une direction plus distinctive que ce que j'avais supposé : **sur les pages Sytium, la couleur ne vient que des données affichées.**

### 2.4 SYDICARD — *la confiance* · **palette officielle**
- **Registre** : finance premium. Retenue absolue.
- **Matière** : noir absolu, wordmark blanc, motif de tramé formant la carte. Volume, reflets, profondeur.
- **Lumière** : rasante sur la tranche de la carte.
- **Mouvement** : rotation lente, pulsations de transaction, flux wallet.
- Palette : ink `#000000` · primaire `#FFFFFF` · **accent turquoise `#5BDFE8`**
- **Observation** : le turquoise est quasi identique à celui de Sydica. Les deux marques se répondent — ce qui est
  juste, puisque SydiCard est décrite comme *intégrée à l'écosystème Sydica*. C'est l'extension financière d'un
  univers culturel, pas une marque financière isolée.
- **Contrainte réglementaire renforcée.** Le document produit décrit une **carte Visa prépayée**, le paiement de
  royalties en monnaie locale et des transferts vers Wave, Orange Money et MTN. Émettre une carte Visa suppose un
  établissement agréé et un sponsor BIN. Le site ne doit **jamais** laisser entendre que le Groupe émet la carte,
  détient les fonds ou opère un service de paiement. Aucun CTA d'ouverture de compte.
- **Visa, Wave, Orange Money, MTN ne sont pas publiables** tant que la relation n'est pas qualifiée et l'usage de
  marque autorisé par écrit. Nommer Visa sur un site public sans accord est un risque de marque, pas un détail.

### 2.5 KULTIX — *le live* · **palette officielle**
- **Registre** : événementiel premium. Immersif sans devenir agressif — pas de codes festival.
- **Matière** : foule en contre-jour, billets, QR, structures de scène.
- **Lumière** : forte, ponctuelle, froide.
- **Mouvement** : génération de billet, scan, plan de salle, flux d'entrée.
- Palette : ink `#0A0A0A` · navy `#0B1A38` · **primaire violet `#8A3FFB`**
- **Correction :** aucune couleur chaude. Le logo est violet vif sur noir — l'élégance demandée est déjà dans la marque.

### 2.6 SYITEX — *la décision* · **univers entièrement redéfini**

> **Correction majeure.** Le brief écrit décrivait SyitEx comme la verticale hardware — Secure USB, IoT,
> technologie physique. C'est faux. SyitEx est une **plateforme d'intelligence décisionnelle** appliquée à
> l'économie culturelle. Conséquence directe : **la verticale hardware se retrouve sans marque.** Voir §11.

- **Ce que c'est** : évaluation, valorisation et prévision du potentiel économique des artistes et des actifs
  culturels. Les données de streaming, réseaux sociaux, ventes, billetterie et médias deviennent des indicateurs
  comparables. Au cœur, l'**Artist Value Index** agrège popularité numérique, performance commerciale, crédibilité
  artistique, impact médiatique, rentabilité et potentiel futur en un score ajustable au contexte d'investissement.
- **À qui** : labels, producteurs, promoteurs, marques, investisseurs, organismes de gestion collective,
  institutions financières, Creator Economy.
- **Surfaces** : dashboard analytique web et mobile, moteur de prévision 6–12 mois, scoring sectoriel, API.
- **Registre** : analytique, sobre, dense. Le registre est celui d'un terminal financier appliqué à la culture —
  ni le SaaS généraliste, ni l'esthétique culturelle de Sydica.
- **Matière** : classements, comparaisons d'artistes, courbes de tendance, forecast.
- **Mouvement** : les scores se composent, les courbes de prévision se tracent, les comparaisons basculent.
- **Accroche retenue** (proposée par Syitech) : *Évaluer. Anticiper. Décider. — L'intelligence prédictive au
  service de l'économie culturelle.* Version anglaise : *Turn cultural data into investment intelligence.*
- Palette **provisoire** : ink `#0A0F14` · primaire `#4A6B82` · accent `#00C2FF` — aucun logo reçu.
- **Propriété intellectuelle** : un document de brevet est mentionné. Statut à qualifier — déposé, en cours
  d'examen ou délivré. Les trois ne se disent pas de la même façon (doc 03 §8).

### 2.7 SYITECH R&D — *la recherche*
- **Registre** : DeepTech expérimental. La page la plus libre du site.
- **Matière** : maillage numérique, nœuds, diagrammes techniques, traces lumineuses.
- **Lumière** : émise par les données elles-mêmes.
- **Mouvement** : systèmes de particules, nœuds réactifs au pointeur, visualisation vivante.
- Palette provisoire : ink `#05070A` · primaire `#35F0B0` · accent `#8B7CFF`
- Signature : *Where Syitech builds tomorrow.*

---

## 3. Concept d'animation

**Principe directeur inchangé :** une animation décrit une structure, signale un état ou guide
l'attention. Le master prompt demande du cinématique — il ne demande pas de la décoration.

| Moment | Effet | Ce qu'il raconte |
|---|---|---|
| Ouverture slide 1 | Zoom lent, profondeur en couches, particules discrètes | L'échelle du Groupe |
| Passage entre slides | Fondu croisé + dérive de la couleur de fond vers l'univers suivant | On change de marque, pas de page |
| Carte écosystème | Les liaisons se tracent du centre vers chaque marque | Un noyau, plusieurs marques |
| Sydica | Waveform réactive, pochettes qui flottent | Le produit est sonore |
| Sytium | Modules qui se composent, courbes qui se tracent | Le produit est structuré |
| SydiCard | Rotation lente de la carte, pulsations de transaction | Le produit est en mouvement, pas encore ouvert |
| KultiX | Billet généré, QR scanné, flux d'entrée | Le produit se joue sur le terrain |
| SyitEx | Rotation produit, vue éclatée | Le produit est un objet |
| R&D | Nœuds réactifs au pointeur, maillage vivant | Le sujet est exploratoire |
| Timeline | Ligne lumineuse traversant les années, fond qui évolue | Une trajectoire, pas une liste |

**Budget technique.** `transform`, `opacity`, `clip-path`, `stroke-dashoffset` uniquement.
Trois animations simultanées maximum dans le champ. `prefers-reduced-motion` neutralise
fonctionnellement, pas seulement en durée. Three.js uniquement si un objet 3D réel l'exige,
jamais pour un décor.

---

## 4. Storyboard de la homepage

### 4.1 Le landing cinématique — 7 slides, 100vh chacune

```
┌─ SLIDE 1 · SYITECH GROUP ───────────────────────────── fond : ink + média ─┐
│  [logo]  Building Africa's Digital Ecosystems.                             │
│          Nous concevons des technologies qui connectent entreprises,       │
│          culture, finance et innovation.                                   │
│          ▬ Découvrir le Groupe                                             │
│  effet : zoom cinématique lent · couches de profondeur · particules        │
└────────────────────────────────────────────────────────────────────────────┘
        ↓ la couleur de fond dérive vers l'univers Sydica
┌─ SLIDE 2 · SYDICA ──────────────────────── fond : artiste / studio / scène ┐
│  Culture. Creators. Technology.        ▬ Découvrir Sydica → sydica.art      │
│  micro-animation : player Sydica, waveform réactive                        │
└────────────────────────────────────────────────────────────────────────────┘
        ↓
┌─ SLIDE 3 · SYTIUM ───────────────────────── fond : interface ERP premium ──┐
│  Run your entire organization from one intelligent platform.               │
│  ▬ Découvrir Sytium → sytium.tech                                          │
│  animation : dashboard vivant, graphiques animés, modules qui apparaissent  │
└────────────────────────────────────────────────────────────────────────────┘
        ↓
┌─ SLIDE 4 · SYDICARD ─────────────────────── fond : carte 3D + smartphone ──┐
│  From revenue to financial opportunity.          ⬩ EN DÉVELOPPEMENT         │
│  Paiements, wallet et services financiers conçus pour l'économie           │
│  numérique africaine.                                                      │
│  animation : carte flottante, transactions lumineuses                      │
└────────────────────────────────────────────────────────────────────────────┘
        ↓
┌─ SLIDE 5 · KULTIX ───────────────────────────── fond : événement premium ──┐
│  Technology behind unforgettable events.  ▬ Découvrir KultiX → kultix.art   │
│  animation : billet · QR · scan · transition foule                         │
└────────────────────────────────────────────────────────────────────────────┘
        ↓
┌─ SLIDE 6 · SYITEX ──────────────────────────────── fond : hardware / IoT ──┐
│  Physical technology. Digital intelligence.                                │
│  animation : produit 3D, flux de données, lumière de circuit               │
└────────────────────────────────────────────────────────────────────────────┘
        ↓
┌─ SLIDE 7 · SYITECH R&D ──────────────────── fond : réseau futuriste abstrait┐
│  Researching tomorrow. Building today.                                     │
│  AI. Blockchain. IoT. Data. Applied Research.                              │
│  ▬ Explorer Syitech R&D                                                    │
└────────────────────────────────────────────────────────────────────────────┘
```

**Mécanique de scroll.** Défilement vertical natif avec `scroll-snap` doux — jamais de scroll
détourné. Chaque slide reste atteignable au clavier et adressable par ancre. Un indicateur
latéral discret (7 points) montre la position et permet la navigation directe.

**Point de vigilance UX.** Sept écrans avant le premier contenu institutionnel, c'est long pour
un investisseur pressé. **Contre-mesure retenue :** un lien *Passer l'introduction* visible dès
la première slide, et une navigation complète accessible dans l'en-tête dès le premier écran.

### 4.2 Après le landing — l'enchaînement institutionnel

| # | Section | Fond |
|---|---|---|
| 8 | **One Group. Multiple Technologies. One Vision.** — carte d'écosystème interactive | ink |
| 9 | À propos du Groupe — mise en page éditoriale, grandes images | clair |
| 10 | Expertises — 8 domaines, illustrés | clair |
| 11 | Vidéo corporate — *Discover Syitech Group*, lecteur cinématique 16:9 | ink |
| 12 | Solutions à la une | clair |
| 13 | Technology Engine | ink |
| 14 | Impact | clair |
| 15 | Aperçu de la timeline | ink, dérive de couleur |
| 16 | **Mot du Directeur Général** — 50 % portrait / 50 % texte | clair |
| 17 | Aperçu de l'équipe | clair |
| 18 | Partenaires | clair |
| 19 | Actualités | clair |
| 20 | CTA corporate | ink |
| 21 | Footer | ink |

---

## 5. Wireframes

### 5.1 Desktop — mot du Directeur Général (§12)

```
┌──────────────────────────────┬─────────────────────────────────────────────┐
│                              │  MOT DU DIRECTEUR GÉNÉRAL                   │
│   ▮ Portrait pleine hauteur  │                                             │
│     (photographie            │  « L'innovation n'a de valeur que lorsqu'elle│
│      professionnelle,        │  transforme concrètement la vie des         │
│      cadrage environnemental)│  personnes, les organisations et les        │
│                              │  économies. »                               │
│                              │                                             │
│                              │  ▭ Vision fondatrice · parcours · ambition  │
│                              │    africaine · construction du Groupe       │
│                              │                                             │
│                              │  Charles N'GUESSAN                          │
│                              │  Founder & CEO — Syitech Group              │
│                              │  ▬ Découvrir notre vision                   │
└──────────────────────────────┴─────────────────────────────────────────────┘
```

### 5.2 Desktop — timeline 2018 → 2026 (§11, §37)

```
      2018    2019    2020    2021    2022    2023    2024    2025    2026
   ────●───────●───────●───────●───────●───────●───────●───────●───────●────
        ╲                                                                   
         ╲  ┌──────────────────────────────────────────────────────┐
          ╲ │ 2018 — Création de Syitech                           │
            │ Premières solutions de distribution culturelle.      │
            │ ▮ photo · ⬩ produit · ⚑ distinction   (selon années) │
            └──────────────────────────────────────────────────────┘
   Le fond dérive d'année en année. La ligne lumineuse progresse au scroll.
```

### 5.3 Desktop — équipe (§13)

Pas une grille de portraits. Une bande immersive : au survol, le portrait se révèle en couleur,
la fonction s'anime, la biographie apparaît. Au clic, une fiche modale premium.
Catégories : *Executive Leadership* · *Product & Technology* · *Business & Operations* ·
*Creative & Innovation*.

### 5.4 Mobile — arbitrages (§33)

| Élément | Traitement mobile |
|---|---|
| Landing 7 slides | Conservé, `scroll-snap` tactile, animations simplifiées, médias allégés |
| Carte écosystème | Liste de marques + schéma statique |
| Timeline | Défilement horizontal à snap, une année par écran |
| Équipe | Carrousel horizontal premium |
| Interfaces produit | Recadrées sur une zone lisible, jamais réduites entières |
| Vidéo | Affiche + lecture à la demande, jamais d'autoplay lourd |

Le mobile est conçu comme une expérience propre, pas comme une réduction du desktop.

---

## 6. Design system multi-marques

```
tokens globaux (structure, typographie, espacement, rayons, ombres, motion)
        │
        ├── product.group.*      ← palette Groupe
        ├── product.sydica.*     ← palette Sydica
        ├── product.sytium.*     ← palette Sytium
        ├── product.sydicard.*   ← palette SydiCard
        ├── product.kultix.*     ← palette KultiX
        ├── product.syitex.*     ← palette SyitEx
        └── product.rd.*         ← palette R&D
```

**Mécanique.** Un attribut de portée sur le conteneur — `data-brand="sydica"` — redéfinit les
tokens sémantiques. Les composants ne connaissent que les tokens : **le même bouton, la même
carte, le même graphe fonctionnent dans les sept univers sans variante**. C'est exactement le
mécanisme déjà en place pour le thème sombre par portée.

**Contrat opposable.** Chaque palette de marque doit passer le même contrôle de contraste que le
Groupe (`scripts/check-contrast.mjs`). Une couleur de marque qui rendrait un texte illisible est
arrêtée au build, pas par un visiteur.

---

## 7. Bibliothèque de composants — ajouts

| Composant | Rôle |
|---|---|
| `CinematicSlide` | Slide 100vh : média de fond, titre, CTA, dérive de couleur en sortie |
| `SlideRail` | Indicateur latéral de position + navigation directe |
| `BrandProvider` | Applique `data-brand` et les tokens de la marque à son sous-arbre |
| `EcosystemMap` | Carte interactive Groupe → 6 marques, liaisons animées |
| `VideoFeature` | Lecteur cinématique 16:9, affiche, lecture à la demande, source administrable |
| `Timeline` | Ligne lumineuse, année active, médias par année, dérive de fond |
| `CeoMessage` | 50/50 portrait / texte, citation mise en exergue, signature |
| `TeamGrid` + `PersonModal` | Révélation au survol, fiche modale, catégories |
| `PartnerWall` (étendu) | Filtrable par marque via le champ `associatedProducts` |
| `MediaCenter` | Photos, vidéos, kit presse, logos, documents téléchargeables |
| `ComingSoonBadge` | Statut produit, non masquable (SydiCard) |
| `BrandMegaMenu` | Mega-menu visuel : logo, couleur, description courte par marque |

---

## 8. Modèle CMS — extensions

Collections ajoutées : `Products` · `Team` · `Timeline` · `Videos` · `Media`.

Champs par produit (§29) :
`name` · `logo` · `favicon` · `primaryColor` · `secondaryColor` · `backgroundColor` ·
`gradient` · `heroImage` · `heroVideo` · `description` · `website` · `status` ·
`partners` · `screenshots` · `features` · `animations`

**Champ décisif ajouté aux partenaires : `associatedProducts`** — un partenaire est rattaché à
`Syitech Group`, `Sydica`, `Sytium`, `SydiCard`, `KultiX`, `SyitEx` ou `R&D`. La page produit
n'affiche que ses partenaires ; la page globale les affiche tous, par catégorie. La règle de
qualification exacte de la relation reste inchangée et prioritaire.

---

## 9. Corrections apportées à l'existant

| Point | Décision |
|---|---|
| **Gadji Celi** (§17) | **Retiré** des activités, expertises et solutions, et retiré de la homepage. Conservé uniquement comme *Case Study* dans Réalisations. Un seul événement ne fait pas de Syitech une société événementielle. |
| Cartes USB · USB Connect · IoT | Fusionnés sous la marque **SyitEx** |
| R&D | Promu de expertise à **marque** |
| Header | Transparent puis navigation en verre au scroll ; mega-menu visuel par marque |
| Footer | Liens externes directs vers `sydica.art`, `sytium.tech`, `kultix.art` ; SydiCard marqué *Coming Soon* |

---

## 11. Questions bloquantes ouvertes

| # | Question | Ce qu'elle bloque |
|---|---|---|
| **Q-HARDWARE** | SyitEx n'étant pas la verticale hardware, **sous quelle marque vivent les Cartes USB sécurisées, USB Connect et l'IoT ?** Trois options : capacités du Groupe sans marque propre · une marque à nommer · retrait du site. | Architecture de marque, navigation, sitemap, page d'accueil |
| **Q-PAY-NAME** | La timeline nomme la solution de paiement **Syitech Pay**, lancée en 2025 ; le logo et le brief disent **SydiCard**. Nom et statut sont contradictoires. | Nommage, statut affiché, mentions réglementaires |
| **Q-VISA** | **Visa, Wave, Orange Money et MTN** sont cités dans le document SydiCard. Relations contractualisées ? Usage de marque autorisé par écrit ? | Page SydiCard, page Partenaires, risque de marque |
| **Q-BURIDA** | La timeline 2019 mentionne un « contrat stratégique avec le BURIDA ». Qualification confirmée ? | Fiche partenaire BURIDA |

**Recommandation sur Q-HARDWARE.** Rattacher Cartes USB, USB Connect et IoT au Groupe comme **capacités**, sans
marque dédiée, jusqu'à décision. C'est cohérent avec l'histoire — 2018 « lancement des cartes USB » est l'acte
fondateur du Groupe, pas d'une filiale — et cela évite de créer une marque de plus sans identité.

---

## 12. Endossement de marque — tranché

Le logo SydiCard porte **« By Syitech Group »**. C'est la formule officielle : elle est adoptée pour toutes les
marques du portefeuille, à la place de « a Syitech Group company » (question Q2 du doc 00, désormais close).

---

## 10. Séquencement proposé

```
ÉTAPE 0 — Validation de ce document
ÉTAPE 1 — Logos : 4 reçus, palettes relevées et appliquées au Groupe  ← nous sommes ici
          Restent SyitEx, Syitech R&D, et le 5e fichier à identifier
ÉTAPE 2 — Design system multi-marques + BrandProvider + mega-menu
ÉTAPE 3 — Landing cinématique (7 slides) + carte d'écosystème
ÉTAPE 4 — Pages produit par marque
ÉTAPE 5 — Timeline, Mot du DG, Équipe                (dépend de L3, L6)
ÉTAPE 6 — Vidéo, médiathèque, partenaires par marque (dépend de L4)
ÉTAPE 7 — Performance, accessibilité, recette bilingue
```

Les étapes 2, 3 et 4 peuvent démarrer sur palettes provisoires : le remplacement des couleurs
officielles ne coûtera qu'un fichier. Les étapes 5 et 6 sont réellement bloquées par les médias.
