# 13 — Gouvernance des données, questions ouvertes & plan de validation

> Document de pilotage. **À traiter avant le lancement de la Phase 5 (développement).**

Le brief impose une règle absolue : **ne rien inventer**. Ce document liste donc tout ce que
la conception a délibérément laissé en attente, et ce qu'il faut fournir pour le lever.

---

## 1. Bloquants de Phase 5 (le développement peut démarrer, la mise en ligne non)

| # | Élément | Impact si non fourni | Responsable |
|---|---|---|---|
| B1 | **Charte graphique officielle** (couleurs, logo vectoriel, polices sous licence) | Le design system est livré avec des primitifs de substitution cohérents. Le remplacement est localisé (`design-system/tokens.json`), mais il doit intervenir avant la validation UI. | Direction communication |
| B2 | **Qualification juridique des relations partenaires** | Aucun logo partenaire ne peut être publié. La section Partenaires reste masquée. | Direction juridique |
| B3 | **Validation des KPI** | Toutes les sections de chiffres restent masquées. | Direction générale / Finance |
| B4 | **Statut réglementaire des services FinTech** | La page FinTech se limite au discours « technologie » ; aucune mention de service financier. | Direction juridique / Conformité |
| B5 | **Photographies professionnelles** (Gadji Celi, produits, équipe, terrain) | Le case study phare et les sections produit ne peuvent pas être livrés au niveau premium attendu. | Direction communication |
| B6 | **Captures produit réelles** (Sytium, Sydica, KultiX) | Les pages solution perdent leur principal argument de crédibilité. Aucune interface fictive ne sera produite. | Direction produit |
| B7 | **Gouvernance et leadership** (noms, fonctions, photos, autorisations) | Les pages Gouvernance et Leadership restent masquées — ce qui pénalise directement le parcours investisseur. | Direction générale |
| B8 | **Périmètre juridique du Groupe** (entités, implantations réelles) | La carte de présence ne peut pas distinguer implantation et distribution. | Direction juridique |

---

## 2. Fiche de qualification des partenaires (à compléter)

**Aucune qualification n'a été présumée.** Chaque ligne doit être renseignée par la direction
juridique avant toute publication. Tant qu'une ligne est incomplète, `isPublic` reste `false`
et le partenaire n'existe pas côté site.

| Organisation | Catégorie proposée | `relationshipType` | Contrat / réf. | Autorisation logo écrite | Début | Fin | Publiable |
|---|---|---|---|---|---|---|---|
| Universal Music Africa | Culture & Music | ❓ à qualifier | ❓ | ❓ | ❓ | ❓ | ⛔ |
| BURIDA | Culture & Music | ❓ | ❓ | ❓ | ❓ | ❓ | ⛔ |
| BBDA | Culture & Music | ❓ | ❓ | ❓ | ❓ | ❓ | ⛔ |
| Visa | Finance & Payments | ❓ | ❓ | ❓ | ❓ | ❓ | ⛔ |
| Onafriq | Finance & Payments | ❓ | ❓ | ❓ | ❓ | ❓ | ⛔ |
| GTP | Finance & Payments | ❓ | ❓ | ❓ | ❓ | ❓ | ⛔ |
| CNPS | Institutions & Social Impact | ❓ | ❓ | ❓ | ❓ | ❓ | ⛔ |
| BRVM | Institutions & Social Impact | ❓ | ❓ | ❓ | ❓ | ❓ | ⛔ |
| *(autres)* | | | | | | | |

**Questions à trancher pour chaque ligne :**

1. Quelle est la nature **exacte** de la relation aujourd'hui : contrat cadre, prestation
   ponctuelle, POC, discussion, programme, adhésion sectorielle ?
2. Cette relation est-elle **active** à la date de mise en ligne ?
3. Existe-t-il une **autorisation écrite** d'usage du logo et de mention publique ?
4. Le libellé public souhaité correspond-il exactement à la réalité contractuelle ?

Rappel : le brief interdit de présenter une discussion comme un partenariat, un POC comme un
contrat permanent, un prestataire comme un partenaire institutionnel, un programme
d'accélération comme un investisseur, ou une relation passée comme active.

---

## 3. Fiche de validation des indicateurs (KPI)

Chaque indicateur exige : **valeur · unité · libellé · période · source · date de mise à jour ·
validateur**. Tant qu'une case manque, l'indicateur n'est pas publié et le bloc se recompose.

| Variable | Libellé | Valeur | Période | Source | Validé par | Public |
|---|---|---|---|---|---|---|
| `{{sydicaUsers}}` | Utilisateurs Sydica | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{artists}}` | Artistes | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{labels}}` | Labels | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{streams}}` | Écoutes cumulées | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{catalogTitles}}` | Titres au catalogue | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{countries}}` | Pays | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{usbCardsDistributed}}` | Cartes USB distribuées | ❓ (le brief mentionne « 1.2M+ » **sous réserve de validation officielle**) | ❓ | ❓ | ❓ | ⛔ |
| `{{usbCountries}}` | Pays de distribution USB | ❓ (« 20+ » **sous réserve**) | ❓ | ❓ | ❓ | ⛔ |
| `{{sytiumOrganizations}}` | Organisations sur Sytium | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{sytiumUsers}}` | Utilisateurs Sytium | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{events}}` | Événements accompagnés | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{eventAttendees}}` | Participants — Gadji Celi | ❓ (« 5 000+ » **sous réserve**) | 04/2026 | ❓ | ❓ | ⛔ |
| `{{employees}}` | Collaborateurs | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{partners}}` | Partenaires | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{patentsFiled}}` | Demandes de brevet déposées | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{patentsGranted}}` | Brevets délivrés | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{offices}}` | Implantations | ❓ | ❓ | ❓ | ❓ | ⛔ |
| `{{transactions}}` | Transactions traitées | ❓ | ❓ | ❓ | ❓ | ⛔ |

> **Note sur les trois chiffres cités dans le brief** (1.2M+ cartes, 20+ pays, 5 000+
> participants) : ils sont explicitement conditionnés par le brief lui-même à une validation
> officielle. Ils sont donc traités comme non validés jusqu'à confirmation écrite, et
> n'apparaissent nulle part dans les livrables.

---

## 4. Questions ouvertes par domaine

### 4.1 Marque et identité

| # | Question | Recommandation par défaut |
|---|---|---|
| Q1 | Signature retenue ? | **Technology. Ecosystems. Impact.** + baseline descriptive (doc 00 §3) |
| Q2 | Mention d'endossement des solutions : « a Syitech Group company » ou « by Syitech Group » ? | « by Syitech Group » — plus court, fonctionne en FR et EN |
| Q3 | Nom de domaine cible et gestion des redirections depuis l'existant ? | À confirmer ; prévoir une table de redirections 301 exhaustive |
| Q4 | Les polices officielles sont-elles sous licence web ? | À défaut, Manrope + Inter + IBM Plex Mono (open source, licence SIL/OFL) |

### 4.2 Périmètre et contenu

| # | Question | Impact |
|---|---|---|
| Q5 | **C-GESCAR et Fleet366 sont-elles encore actives ou stratégiquement pertinentes ?** Le brief demande de ne présenter que les solutions actives. | Conditionne le contenu de `/solutions/iot` |
| Q6 | **SydiCard** est-elle une marque distincte ou une fonctionnalité de la verticale FinTech ? | Conditionne le nommage de `/solutions/fintech` |
| Q7 | **USB Connect** est-elle une solution autonome ou l'évolution de Secure USB ? Le brief demande deux pages distinctes — confirmer que la distinction produit existe réellement. | Deux pages ou une page à deux sections |
| Q8 | Le module **Collaboration** de Sytium (appels, transcription, synthèses IA) est-il **effectivement actif** ? Le brief conditionne son affichage. | Affichage ou marquage `roadmap` |
| Q9 | Quels modules Sytium sont `live`, `beta`, `roadmap` ? | Badges de maturité sur chaque univers fonctionnel |
| Q10 | Existe-t-il d'autres réalisations documentées que le concert Gadji Celi ? | Une page Réalisations à un seul élément affaiblit l'argument de capacité d'exécution |
| Q11 | La date du 4 avril 2026 étant passée, dispose-t-on du bilan de l'événement (chiffres, photos, verbatims autorisés) ? | Conditionne la qualité du case study phare |
| Q12 | Y a-t-il des collaborations académiques réelles à documenter en R&D ? | Conditionne la crédibilité de la page R&D |
| Q13 | Des distinctions officielles à publier (avec preuve) ? | Section Distinctions affichée ou masquée |

### 4.3 Technique et exploitation

| # | Question | Recommandation par défaut |
|---|---|---|
| Q14 | Contrainte de souveraineté des données imposant un hébergement local ? | Si oui → Strapi auto-hébergé ; sinon → Sanity |
| Q15 | L'API de recrutement Sytium est-elle disponible et documentée ? | Sinon, repli par courriel avec bascule ultérieure |
| Q16 | Qui administrera le site au quotidien, et avec quels rôles ? | Détermine la granularité des permissions CMS |
| Q17 | Data room investisseurs : dans le périmètre ou phase ultérieure ? | Phase ultérieure ; la page Investisseurs annonce l'accès sécurisé à venir |
| Q18 | Une troisième langue est-elle envisagée à moyen terme (portugais, arabe) ? | L'architecture i18n la supporte ; à confirmer pour dimensionner la traduction |
| Q19 | Budget de traduction professionnelle EN ? | Une traduction automatique dégraderait la crédibilité internationale visée |

---

## 5. Plan de validation par phase

```
PHASE 1 — STRATÉGIE        [livrée]     → validation : positionnement, signature, sitemap, IA, SEO
PHASE 2 — UX               [livrée]     → validation : wireframes home, groupe, expertise, produit,
                                          case study, partenaires, arbitrage mobile
PHASE 3 — UI               [livrée]     → validation : direction artistique, design system,
                                          bibliothèque de composants, motion — SOUS RÉSERVE de B1
PHASE 4 — TECHNIQUE        [livrée]     → validation : stack, modèle CMS, API, SEO, analytics,
                                          sécurité, performance
──────────────────────────────────────────────────────────────────────────────
PHASE 5 — DÉVELOPPEMENT    [à lancer après validation des phases 1 à 4]
```

### Séquencement recommandé de la Phase 5

| Étape | Contenu | Prérequis |
|---|---|---|
| 5.1 | Socle : projet Next.js, tokens → thème Tailwind, layout, i18n, CI | Validation Phase 4 |
| 5.2 | Bibliothèque de composants + Storybook | Validation Phase 3 (B1 levé) |
| 5.3 | Schémas CMS + back-office + règles de validation | Validation du modèle de données |
| 5.4 | Pages institutionnelles (Groupe, Expertises, Technologies) | Contenus rédigés |
| 5.5 | Pages solution (Sytium en premier) | B6 levé (captures produit) |
| 5.6 | Réalisations, Impact, Partenaires | B2, B3, B5 levés |
| 5.7 | Actualités, Carrières, Contact, Investisseurs | Q15, Q17 tranchés |
| 5.8 | Graphes interactifs (écosystème, technology engine) et animations | Composants stabilisés |
| 5.9 | SEO, analytics, sécurité, recette performance et accessibilité | Contenu en place |
| 5.10 | Recette bilingue, traduction professionnelle, mise en ligne | Q19 tranché |

**Dépendance critique :** les étapes 5.4 à 5.7 sont limitées par la **disponibilité des
contenus validés**, pas par le développement. Il est recommandé de lancer la production
éditoriale, photographique et juridique **en parallèle** de l'étape 5.1.

---

## 6. Comportement du site en l'absence de données validées

C'est la garantie que le site reste crédible même partiellement alimenté :

| Situation | Comportement |
|---|---|
| Aucun KPI validé | Sections de chiffres masquées ; la home passe de 18 à 16 sections, sans trou |
| Aucun partenaire publiable | Section Partenaires masquée ; le CTA « Devenir partenaire » reste actif |
| Une seule réalisation | La grille passe en mise en page « mise en avant unique », pas en grille à trous |
| Gouvernance non validée | Page Leadership masquée ; le lien disparaît du menu |
| FinTech sans statut réglementaire | Discours limité à la technologie ; disclaimer maintenu |
| Traduction EN incomplète | Repli FR signalé explicitement, ou page absente du menu EN et du sitemap EN |

**Aucune section ne se remplit de contenu générique, de faux chiffres ou de mentions
« bientôt disponible ».** Un site institutionnel gagne en crédibilité à montrer moins,
et perd tout à montrer du faux.
