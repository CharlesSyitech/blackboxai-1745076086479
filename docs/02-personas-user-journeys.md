# 02 — Personas & User Journeys

> Phase 1 · Livrables 3 & 4

---

## 1. Le modèle de lecture à quatre niveaux

Le site est conçu comme un **document à profondeur variable**. Chaque niveau doit être
complet en lui-même : un visiteur qui s'arrête au niveau 1 doit déjà avoir compris le Groupe.

| Niveau | Durée | Support | Ce que le visiteur doit avoir compris | Conception |
|---|---|---|---|---|
| **N1 — Comprendre le Groupe** | 30 s | Hero + À propos + Chiffres + Expertises (4 premières sections de la home) | Qui, quoi, dans quels domaines | Zéro scroll obligatoire pour le message clé ; titres autoportants |
| **N2 — Comprendre expertises & solutions** | 3 min | Reste de la home + pages pilier | Ce que le Groupe sait faire et ce qu'il possède | Chaque section home = un résumé cliquable de sa page dédiée |
| **N3 — Explorer** | 10 min | Pages solution, technologie, réalisations, impact | Profondeur produit, preuve d'exécution | Contenu dense, mockups réels, case studies structurés |
| **N4 — Due diligence** | 30 min+ | Groupe, Gouvernance, Investisseurs, R&D/PI, Actualités, documents publics | Solidité institutionnelle | Données sourcées et datées, gouvernance nominative, PI qualifiée |

**Règle de conception dérivée :** aucun contenu de niveau 4 ne remonte en niveau 1.
Un investisseur descend ; il ne faut pas imposer sa lecture à un artiste.

---

## 2. Personas

### P1 — Aïcha · Directrice d'investissement, fonds panafricain (Nairobi / Paris)

- **Objectif :** évaluer en une session si Syitech mérite un premier rendez-vous.
- **Questions :** Quelle est la thèse ? Quelles verticales sont réelles vs. déclaratives ? Qui dirige ? Quelle traction ? Quelle PI ?
- **Frictions :** chiffres non sourcés, partenariats surinterprétés, absence de gouvernance nommée.
- **Parcours :** Home → Écosystème → Impact → Groupe/Gouvernance → Investisseurs → Contact.
- **Ce qui la convainc :** des KPI datés et sourcés, une gouvernance nominative, une distinction claire entre technologie propriétaire et service partenaire.
- **Ce qui la fait partir :** un chiffre rond sans période ni source.

### P2 — Kouadio · Directeur de cabinet, ministère (Abidjan)

- **Objectif :** identifier un opérateur technologique local crédible pour un programme national.
- **Questions :** Ont-ils déjà déployé ? Avec qui ? Où sont-ils implantés ? Sont-ils conformes ?
- **Parcours :** Home → Réalisations (filtre *Public Sector*) → Case study → Présence → Partenaires → Contact (profil *Institution*).
- **Ce qui le convainc :** une réalisation opérationnelle documentée (challenge → résultats), une présence physique, des mentions de conformité.

### P3 — Sandrine · DAF d'un groupe industriel régional (600 salariés)

- **Objectif :** remplacer un ERP vieillissant / une pile Excel.
- **Questions :** SYSCOHADA et IFRS ? Paie ? Analytique ? Mobile ? Déploiement ? Support ?
- **Parcours :** Recherche Google « ERP SYSCOHADA » → `/solutions/sytium` → module Finance → mockups → *Demander une démonstration*.
- **Ce qui la convainc :** de vrais écrans produit, le vocabulaire comptable exact, un chemin de démo en 2 clics.
- **Ce qui la fait partir :** des captures illustratives génériques, l'absence de mention SYSCOHADA.

### P4 — Marc · Directeur régional, major musicale

- **Objectif :** comprendre si Syitech est une infrastructure de distribution fiable ou une app de plus.
- **Questions :** Droits ? Reporting ? Monétisation créateurs ? Couverture ? Interopérabilité ?
- **Parcours :** Home → Sydica → Expertise Culture → Partenaires (catégorie *Culture & Music*) → Contact.
- **Point de vigilance :** la qualification exacte de la relation avec les acteurs de son secteur doit être irréprochable — c'est lui qui la connaît le mieux.

### P5 — Fatou · Artiste indépendante / manager de label

- **Objectif :** distribuer, être payée, comprendre son audience.
- **Parcours :** réseaux sociaux → `/solutions/sydica` → *Artistes & Labels* → inscription.
- **Besoin :** clarté, mobile-first, langage direct, pas de jargon corporate.

### P6 — Yann · Organisateur d'événements / producteur

- **Objectif :** billetterie fiable + contrôle d'accès + reporting financier ; et, éventuellement, un partenaire de production.
- **Parcours :** Home → KultiX → Case Study Gadji Celi → Expertise événementielle → *Organiser un événement*.
- **Insight :** ce persona est celui qui valide le mieux la dualité *technologie + terrain*. Le case study lui parle plus que la fiche produit.

### P7 — Dr. Bamba · Chercheur / responsable de laboratoire universitaire

- **Objectif :** identifier un partenaire industriel pour un programme de recherche.
- **Parcours :** Home → Technologie & R&D → publications / brevets → Partenaires (*Research & Education*) → Contact.

### P8 — Sarah · Ingénieure logicielle senior (diaspora)

- **Objectif :** évaluer l'intérêt technique et la solidité de l'employeur.
- **Parcours :** LinkedIn → `/carrieres` → offre → `/technologies` → `/groupe`.
- **Ce qui la convainc :** la stack réelle, l'ampleur des systèmes, la R&D.

### P9 — Journaliste tech / économique

- **Objectif :** faits, chiffres citables, porte-parole, visuels HD.
- **Parcours :** `/actualites` → communiqué → `/presse` (kit).
- **Besoin :** une source et une date sur chaque chiffre ; un contact presse nominatif.

---

## 3. User journeys détaillés

### J1 — Investisseur (P1) · Objectif : demander un rendez-vous

| Étape | Page | Contenu déclencheur | Émotion visée | Risque de sortie | Mitigation |
|---|---|---|---|---|---|
| 1 | Home / Hero | Headline Groupe + visualisation écosystème | « Ce n'est pas une startup mono-produit » | Hero décoratif sans substance | Sous-titre factuel + 2 CTA explicites |
| 2 | Home / Chiffres | 3–5 KPI datés et sourcés | Confiance | Chiffres non sourcés | Mention `source` + `lastUpdated` au survol/en note |
| 3 | Home / Écosystème | Graphe Groupe → solutions → socle techno | Compréhension structurelle | Graphe illisible | Version statique lisible en fallback + légende |
| 4 | `/impact` | Dashboard par catégorie | Matérialité | Impression de vitrine | Méthodologie explicitée en bas de page |
| 5 | `/groupe/gouvernance` | Organes, dirigeants | Sérieux institutionnel | Page vide | Ne publier que ce qui est validé, sinon masquer la section |
| 6 | `/investisseurs` | Thesis, marchés, modèle, traction | Projection | Données confidentielles absentes | Annoncer explicitement la data room sécurisée à venir |
| 7 | `/contact` (profil *Investisseur*) | Formulaire adapté | Facilité | Formulaire générique | Champs contextuels + contact IR nominatif |

**Événement de conversion :** `investor_contact`.

### J2 — Décideur institutionnel (P2) · Objectif : identifier un opérateur

Home → `/realisations?secteur=public` → Case study → `/groupe/presence` → `/partenaires` → `/contact` (*Institution*).
**Point critique :** le filtre *Public Sector* ne doit jamais renvoyer une grille vide. S'il n'existe
pas encore de réalisation publiable dans ce secteur, le filtre est **masqué** (piloté par les données).
**Conversion :** `partner_request`.

### J3 — DAF (P3) · Objectif : démonstration Sytium

Entrée SEO directe sur `/solutions/sytium` (60 % du trafic attendu de cette page).
La page doit donc être **autoportante** : rappel du Groupe en 2 lignes en haut, contexte
en bas ; ne jamais supposer un passage par la home.

```
Landing Sytium → onglet "Finance & Accounting" → mockup Comptabilité → preuve SYSCOHADA/IFRS
   → bandeau "Mobile" (pointage GPS) → "Demander une démonstration" → formulaire 5 champs
```
**Conversion :** `sytium_demo`. **Objectif UX :** ≤ 3 interactions entre l'arrivée et le formulaire.

### J4 — Artiste (P5) · Mobile, 4G instable

`/solutions/sydica` en mobile : le poids de la page est un enjeu de conversion.
Budget strict : LCP < 2,5 s en 4G simulée (Slow 4G). Images AVIF, pas de vidéo autoplay,
graphe écosystème en version statique sous 768 px.
**Conversion :** `sydica_visit` puis sortie vers l'application.

### J5 — Organisateur (P6) · Objectif : devis événement

Home → Section KultiX (animation CREATE → SELL → ACCESS → MANAGE → ANALYZE) →
`/solutions/kultix` → `/expertises/eventtech-evenementiel` → Case study Gadji Celi →
`/contact` (*Organisateur d'événement*).
**Conversion :** `kultix_request` ou `event_request`.

### J6 — Candidat (P8)

LinkedIn → `/carrieres/<slug>` → candidature (idéalement poussée dans le module Recrutement de Sytium).
**Conversion :** `career_apply`.

---

## 4. Matrice pages × personas (priorisation)

Priorité : ●●● critique · ●● important · ● secondaire

| Page | Investisseur | Institution | Entreprise | Culture | Événementiel | Recherche | Candidat | Média |
|---|---|---|---|---|---|---|---|---|
| Home | ●●● | ●●● | ●● | ●● | ●● | ● | ● | ●● |
| Groupe | ●●● | ●●● | ● | ● | ● | ●● | ●● | ●● |
| Gouvernance | ●●● | ●●● | ● | | | ● | ● | ●● |
| Expertises | ●● | ●●● | ●●● | ●● | ●● | ●● | ● | ● |
| Sytium | ● | ●● | ●●● | | | | ● | |
| Sydica | ●● | ● | | ●●● | ● | | ● | ●● |
| KultiX | ● | ● | ● | ●● | ●●● | | | |
| FinTech | ●●● | ●● | ● | ●● | | | | ●● |
| Secure USB / USB Connect | ●● | ●●● | ●● | ●● | | ● | | ● |
| IoT | ●● | ●●● | ●●● | | | ● | | |
| Technologies & R&D | ●●● | ●● | ●● | | | ●●● | ●●● | ● |
| Réalisations | ●●● | ●●● | ●●● | ●● | ●●● | ● | ●● | ●● |
| Impact | ●●● | ●●● | ● | ●● | ● | ●● | ● | ●●● |
| Partenaires | ●●● | ●●● | ●● | ●●● | ● | ●● | | ●● |
| Investisseurs | ●●● | ● | | | | | | ●● |
| Carrières | ● | | | | | ● | ●●● | |

**Lecture :** *Réalisations*, *Impact* et *Partenaires* sont les trois pages transversales
à tous les publics — elles justifient leur place dans la navigation principale, contrairement
à *Carrières* et *Investisseurs*.

---

## 5. Anti-parcours (à empêcher par le design)

| Anti-parcours | Conséquence | Contre-mesure |
|---|---|---|
| Un visiteur arrive et croit que Syitech = Sydica | Réduction du Groupe à une verticale | Sydica n'apparaît qu'en 7e section de la home, après Expertises et Écosystème |
| Un visiteur prend un logo partenaire pour une activité du Groupe | Risque juridique et de crédibilité | Section Partenaires unique, en fin de home, catégorisée, avec `relationshipType` affiché |
| Un investisseur cite un chiffre non validé | Risque majeur | Aucun chiffre en dur ; `isPublic` + `source` + `lastUpdated` obligatoires |
| Un prospect FinTech croit que Syitech est un établissement financier | **Risque réglementaire** | Mention permanente + wording contrôlé sur toutes les pages FinTech |
| Un mobile-only abandonne au 3e scroll | Perte de trafic majoritaire | Home mobile réduite à 12 sections (voir doc 05, §Mobile) |
