# 06 — Direction artistique & Moodboard

> Phase 3 · Livrable 14

---

## 1. Intention

Le site doit se situer à l'intersection de trois registres visuels :

```
   CORPORATE INSTITUTIONNEL          SAAS PREMIUM                DEEPTECH
   (banque d'investissement,   ×    (plateforme produit,   ×   (industrie, recherche,
    groupe industriel)              interface soignée)          infrastructure)
   ── sobriété, grille,             ── clarté produit,         ── précision technique,
      typographie, blanc               mockups, micro-UI          schémas, données
```

Le point d'équilibre : **une agence institutionnelle qui montre du vrai produit.**
Ni plaquette d'entreprise figée, ni landing page SaaS générique.

---

## 2. Références de registre (pour calibrage, non pour copie)

| Registre | À retenir | À ne pas reprendre |
|---|---|---|
| Groupes industriels européens (Siemens, Schneider) | Autorité de la grille, hiérarchie typographique, photographie terrain | Froideur, densité excessive |
| Plateformes B2B premium (Stripe, Linear) | Qualité des mockups produit, micro-interactions, cohérence du système | Le langage visuel « startup », les gradients signature |
| Cabinets de conseil / institutions financières | Traitement des données, tableaux, notes de méthode | L'absence de produit visible |
| Laboratoires et acteurs DeepTech | Schémas techniques, diagrammes, sobriété chromatique | L'ésotérisme, l'absence de bénéfice utilisateur |

---

## 3. Les six intentions visuelles du brief

| Intention | Traduction visuelle concrète |
|---|---|
| **Innovation** | Diagrammes vivants (écosystème, technology engine), interfaces produit réelles, typographie contemporaine |
| **Scale** | Grands aplats, sections plein écran, respiration verticale généreuse, photographie large |
| **Trust** | Grille stricte, alignements visibles, données sourcées et datées, contrastes élevés |
| **Technology** | Éléments de schéma (nœuds, liaisons, coordonnées), monospace pour les libellés techniques, précision des tracés |
| **Africa** | **Par la photographie et le sujet, jamais par l'ornement.** Terrain réel, visages réels, lieux identifiables. Aucun motif décoratif « africain » plaqué. |
| **Global Ambition** | Cartographie, bilinguisme visible, sobriété chromatique internationale |

**Le point le plus important de cette direction artistique :** l'ancrage africain passe
exclusivement par le **contenu photographique et documentaire**. Toute tentative de le
traduire par un motif, une palette « chaude » ou une texture décorative produirait
exactement le cliché que le brief interdit.

---

## 4. Territoire chromatique

```
  INK (fond profond)     SURFACE (fond clair)     NAVY (primaire)    AMBER (accent)
  ████████ #060B14       ░░░░░░░░ #F7F8FA         ████████ #12305D   ████ #E39A2B
  sections produit,      corps de page,           liens, titres,     accent unique,
  technology engine      cartes, respiration      barres, focus      CTA, données clés
```

- **Un seul accent.** L'ambre n'apparaît que sur : le CTA principal, l'élément actif d'un
  onglet, la donnée mise en avant, la ligne de progression. Jamais en aplat de fond large.
- **Pas de dégradé de marque.** Un seul dégradé toléré : le voile sombre translucide sur
  les photographies plein écran, pour garantir la lisibilité du texte (jamais décoratif).
- **Le teal (#0FA3A3)** est réservé à la **data visualisation** et aux schémas techniques ;
  il n'entre pas dans le langage marketing.

## 5. Photographie

| Type | Usage | Traitement |
|---|---|---|
| **Terrain / événementiel** | Case studies, expertise événementielle, home S10 | Photographie professionnelle réelle, léger contraste renforcé, pas de filtre de teinte |
| **Produit / hardware** | Secure USB, USB Connect, IoT | Macro sur fond ink, éclairage rasant, focus sur la matière |
| **Équipe / lieux** | Groupe, Leadership, Carrières | Lumière naturelle, cadrage environnemental (au travail, pas en pose studio) |
| **Interfaces** | Solutions | Captures réelles, recadrées, ombre portée douce, jamais en perspective extrême |

**Interdits photographiques :** banques d'images génériques, poignées de main, ampoules,
mains sur écran holographique, robots humanoïdes, planisphères en réseau de points lumineux,
salles de marché.

**Spécifications de production :** 3 000 px de large minimum, AVIF + WebP, points focaux
définis en CMS (recadrage responsive), `alt` rédigé par l'éditeur.

---

## 6. Traitement graphique des schémas

Les schémas (écosystème, technology engine, flux FinTech, processus KultiX) forment
**le langage visuel propriétaire du site**. Règles communes :

- Traits de 1 px à 1,5 px, jamais d'épaisseur variable décorative.
- Nœuds : cercles ou rectangles à rayon 8 px, remplissage surface, bordure 1 px.
- Liaisons : lignes droites ou courbes de Bézier à faible courbure — jamais d'arabesques.
- Étiquettes en monospace, `letter-spacing: 0.04em`, majuscules pour les technologies.
- Animation : révélation par `stroke-dashoffset`, jamais de rotation continue ni de particules.
- **Chaque schéma existe en trois états : interactif, statique (mobile), texte (accessibilité).**

---

## 7. Ce qui est explicitement banni

| Banni | Pourquoi |
|---|---|
| Gradients violet/bleu en fond de hero | Signature « template startup 2021 » |
| Néons, glow, esthétique cyberpunk | Contredit le registre institutionnel |
| Illustrations 3D isométriques génériques | Signal « bibliothèque gratuite » |
| Blobs, formes organiques flottantes | Bruit visuel sans fonction |
| Cartes à ombre portée forte partout | Uniformise et aplatit la hiérarchie |
| Icônes multicolores | Rompt le système chromatique |
| Emoji dans l'interface | Registre inadapté |
| Vidéo d'arrière-plan en autoplay | Coût de performance, distraction |
| Compteurs animés en boucle | Attire l'œil en permanence, dévalue la donnée |
| Curseur personnalisé | Gadget, nuit à l'accessibilité |
| Défilement horizontal forcé de sections | Rupture d'affordance |

---

## 8. Grille de composition

- Conteneur maximal de contenu : **1200 px** ; conteneur large : **1440 px** ; sections
  plein écran (`full-bleed`) pour les visuels et les sections ink.
- **12 colonnes**, gouttière 24 px (desktop), 16 px (tablette), 16 px (mobile, 4 colonnes).
- Marges latérales : 24 px (mobile) · 40 px (tablette) · 80 px (desktop) · fluide au-delà de 1440 px.
- **Alignement optique du texte long à 8 colonnes maximum** (mesure de 65–75 caractères).
- Les sections respirent verticalement : 96 px (mobile) · 128 px (tablette) · 160 px (desktop)
  de padding vertical pour les sections majeures.

---

## 9. Déclinaisons par verticale

Chaque solution reçoit une **teinte d'accent secondaire** utilisée uniquement en
signalétique (badge, filet, pastille de graphe) — jamais en fond de section :

| Solution | Teinte signalétique | Registre visuel de la page |
|---|---|---|
| Sytium | Navy 600 | Dense, tableaux, interfaces, sobre |
| Sydica | Amber 500 | Éditorial, photographique, culturel |
| KultiX | Teal 500 | Dynamique, séquentiel, terrain |
| FinTech / SydiCard | Navy 800 | Institutionnel, schématique, prudent |
| Secure USB / USB Connect | Neutre 800 | Matière, macro, industriel |
| IoT | Teal 700 | Technique, données, cartographie |

Cette signalétique est **la seule variation autorisée** : la typographie, la grille,
les composants et les interactions restent strictement identiques d'une page à l'autre.
