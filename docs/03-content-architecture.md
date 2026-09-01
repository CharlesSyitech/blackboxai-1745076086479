# 03 — Architecture de contenu & Charte éditoriale

> Phase 1 · Livrable 5

---

## 1. Modèle de contenu (vue logique)

```
                 ┌──────────────┐
                 │  EXPERTISE   │◄──────────────┐
                 └──────┬───────┘               │
        ┌───────────────┼───────────────┐       │
        ▼               ▼               ▼       │
  ┌──────────┐   ┌────────────┐   ┌──────────┐  │
  │ SOLUTION │──▶│ TECHNOLOGY │◀──│ SOLUTION │  │
  └────┬─────┘   └────────────┘   └──────────┘  │
       │                                         │
       ▼                                         │
  ┌────────────┐      ┌──────────┐               │
  │ CASE STUDY │─────▶│  PARTNER │ (rôle explicite dans le projet)
  └────┬───────┘      └──────────┘               │
       │                                         │
       ├────────────▶ KPI ────────▶ IMPACT       │
       └────────────▶ NEWS ────────────────────-─┘
```

**Invariants du modèle**

1. Une `Solution` appartient à **une** `Expertise` principale (et peut en référencer d'autres en secondaire).
2. Une `Solution` référence *n* `Technology` (socle transverse) — c'est ce lien qui alimente le *Technology Engine*.
3. Une `CaseStudy` référence des `Solution`, des `Technology`, une `Expertise`, et **optionnellement** des `Partner` avec un **rôle explicite dans ce projet** (`roleInProject`).
4. Un `Partner` n'est **jamais** rattaché à une `Solution` comme s'il en était l'auteur ou le propriétaire.
5. Un `KPI` est une entité autonome, référencée par identifiant, jamais recopiée.

---

## 2. Blocs de contenu réutilisables (content blocks)

Toutes les pages sont composées à partir d'une bibliothèque de blocs administrables.
Un bloc = un composant React + un schéma CMS.

| Bloc | Usage | Champs principaux |
|---|---|---|
| `hero.corporate` | Home, pages pilier | eyebrow, title, subtitle, ctaPrimary, ctaSecondary, visual |
| `hero.product` | Pages solution | logo, positioning, title, subtitle, productVisual, ctas |
| `hero.caseStudy` | Case studies | client/contexte, titre, date, lieu, image, tags |
| `richText` | Partout | contenu structuré (portable text) |
| `statsRow` | Home, Impact, solutions | `kpiRefs[]`, layout (3/4/5), affichage source |
| `cardGrid` | Expertises, solutions, technologies | items[], colonnes, style de carte |
| `ecosystemGraph` | Home, `/technologies` | centre, nœuds, couches, liens |
| `productShowcase` | Sytium, Sydica, KultiX | onglets, mockups, légendes fonctionnelles |
| `processFlow` | KultiX, FinTech, Secure USB | étapes[] (label, icône, description) |
| `logoWall` | Partenaires | `partnerRefs[]` groupés par catégorie |
| `caseStudyTeaser` | Home, expertises, solutions | `caseStudyRef`, format (large/compact) |
| `timeline` | `/groupe/histoire` | jalons[] (année, titre, description, image) |
| `peopleGrid` | Leadership | `personRefs[]`, groupement |
| `mapPresence` | `/groupe/presence` | `countryRefs[]` avec `presenceType` |
| `newsTeaser` | Home, pages | source (dernières / catégorie), nombre |
| `ctaBand` | Toutes | titre, texte, cta(s), variante visuelle |
| `faq` | Solutions, Contact | questions[] |
| `disclaimer` | FinTech, Impact, R&D | texte réglementaire, niveau (info/warning) |

**Règle :** aucun bloc n'accepte de HTML libre. Un besoin non couvert = un nouveau bloc typé,
pas un champ « code ».

---

## 3. Grammaire éditoriale par type de page

### 3.1 Page Expertise (T3)

| Section | Question à laquelle elle répond | Longueur cible |
|---|---|---|
| Hero | De quoi parle-t-on ? | Titre 6–9 mots · sous-titre 25–35 mots |
| L'enjeu | Pourquoi c'est difficile ? | 60–90 mots |
| Nos capacités | Que savons-nous faire ? | 6–8 items, 8–14 mots chacun |
| Nos technologies | Avec quoi ? | Liens vers `/technologies/*` |
| Nos solutions | Qu'avons-nous construit ? | 1–3 cartes solution |
| Réalisations | Où l'avons-nous prouvé ? | 1–2 case studies filtrés |
| CTA | Et ensuite ? | 1 CTA principal contextuel |

### 3.2 Page Solution (T4)

Hero produit → positionnement (1 phrase) → problème résolu → **univers fonctionnels** (onglets)
→ mockups réels → socle technologique → indicateurs (si publiables) → cas d'usage → intégrations
→ CTA double (*Découvrir* / *Demander une démonstration*) → rappel Groupe.

**Règle mockups :** uniquement des captures réelles du produit, recadrées et annotées.
Aucune interface fictive. Si un module n'est pas encore livré, il n'est pas montré —
ou il est explicitement marqué **`Roadmap`** via le champ `maturity`.

### 3.3 Case Study (T5) — structure imposée

`Contexte` → `Challenge` → `Solution` → `Technology` → `Implementation` → `Results` → `Impact`.

- `Results` n'affiche que des `KPI` avec `isPublic: true`. Sinon la section est masquée, jamais remplie d'approximations.
- Une galerie photo professionnelle est **obligatoire** pour les réalisations terrain.
- Champ `disclosureLevel` : `public` · `client_approved` · `internal`. Seul `public` est rendu.

### 3.4 Article (T6)

Titre ≤ 65 caractères · chapô 30–40 mots · corps structuré H2/H3 · une citation attribuée maximum
par article · date de publication **et** de mise à jour · auteur identifié.

---

## 4. Charte de nommage et de vocabulaire

| Concept | FR | EN | Ne jamais écrire |
|---|---|---|---|
| Le Groupe | Syitech Group | Syitech Group | Syitech tout court en première occurrence d'une page |
| Verticales | expertises | expertise areas | « business units » (implique une structure juridique) |
| Produits | solutions | solutions | « produits » (réduit la portée) |
| Socle | technologies | technology stack / engine | « stack maison » |
| Réalisations | réalisations | work / case studies | « clients », « références clients » |
| Partenaires | partenaires | partners | « partenaires stratégiques » sans qualification |
| Chiffres | indicateurs | key figures | « performances », « résultats » (sens financier) |

**Casse des noms de solutions :** `Sytium`, `Sydica`, `KultiX`, `SydiCard`, `USB Connect`,
`C-GESCAR`, `Fleet366`. La casse est fixée dans un lexique partagé et vérifiée en revue.

---

## 5. Gouvernance des chiffres (règle absolue)

Aucune valeur numérique n'est écrite dans un composant, un texte riche ou une traduction.
Tout chiffre est une **entité `KPI`** référencée par identifiant.

**Placeholders de rédaction** (utilisés dans les maquettes et les contenus tant que la donnée
n'est pas validée — ils ne doivent jamais atteindre la production) :

```
{{sydicaUsers}}          {{artists}}            {{labels}}
{{countries}}            {{streams}}            {{catalogTitles}}
{{usbCardsDistributed}}  {{usbCountries}}       {{sytiumOrganizations}}
{{sytiumUsers}}          {{events}}             {{eventAttendees}}
{{employees}}            {{partners}}           {{patentsFiled}}
{{patentsGranted}}       {{offices}}            {{transactions}}
```

**Comportement de rendu d'un KPI non validé** (`isPublic: false` ou `value` absente) :

1. **Par défaut : masquer** le KPI et recomposer la grille (3 KPI → 2 KPI, sans trou).
2. Si tous les KPI d'un bloc sont indisponibles → **le bloc entier est masqué**.
3. En environnement de *preview* uniquement, afficher le placeholder en surbrillance pour signaler la donnée manquante à l'éditeur.
4. **Jamais** de valeur de repli inventée, jamais de « — », jamais de « bientôt ».

Un test automatisé bloque le build si une chaîne `{{...}}` est détectée dans un contenu publié.

---

## 6. Gouvernance des partenaires (règle absolue)

Un logo **ne qualifie pas** une relation. Chaque `Partner` porte un `relationshipType`
issu d'une liste fermée, une temporalité, et un drapeau de publication.

```
relationshipType ∈ {
  Strategic Partner, Institutional Partner, Technology Partner, Content Partner,
  Financial Partner, Client, Supplier, POC, Collaboration, Program, Research Partner
}
```

**Règles de rendu :**

| Condition | Rendu |
|---|---|
| `isPublic: false` | Le partenaire n'existe pas côté site (filtré côté serveur, pas côté client). |
| `endDate` dépassée | Bascule automatique en section « Collaborations passées » ou masquage, selon `showAfterEnd`. |
| `relationshipType ∈ {POC, Collaboration, Program}` | Jamais dans un bloc intitulé « Partenaires stratégiques » ; libellé affiché exact. |
| `relationshipType = Client` | N'apparaît que si `logoUsageApproved: true` **et** avec l'intitulé « Ils nous font confiance », jamais « Partenaires ». |
| Absence de `contractReference` | Bloque la publication d'un `Strategic Partner` ou `Institutional Partner` (validation CMS). |

**Cas nommés dans le brief** (Universal Music Africa, CNPS, BRVM, Visa, Onafriq, GTP,
BURIDA, BBDA) : **aucune qualification n'est présumée**. Chaque entrée reste en
`isPublic: false` tant que la direction juridique n'a pas renseigné `relationshipType`,
`contractReference` et `logoUsageApproved`. Voir la fiche de validation
`docs/13-gouvernance-donnees-questions-ouvertes.md`.

---

## 7. Gouvernance réglementaire FinTech

| Autorisé | Interdit sans agrément |
|---|---|
| « Technologies pour les services financiers » | « Banque », « compte bancaire », « établissement de paiement » |
| « Infrastructure de paiement » | « Nous émettons des cartes » |
| « En partenariat avec des établissements agréés » | « Notre licence », « nos services financiers » |
| « Parcours vers l'épargne et l'investissement » | « Rendement », « placement garanti », « produit d'investissement » |
| « Inclusion financière » | « Crédit », « prêt », « microfinance » (sauf agrément) |

Chaque page FinTech porte un bloc `disclaimer` non masquable et le champ CMS
`regulatoryStatus` par service : `technology_only` · `partner_operated` · `licensed`.
Seul `licensed` autorise un vocabulaire de service financier, et uniquement si
`licenseReference` est renseigné.

---

## 8. Gouvernance de la propriété intellectuelle

Trois statuts strictement distincts, jamais fusionnés en « brevets » :

| Statut | Affichage autorisé | Champs requis |
|---|---|---|
| `filed` | « Demande déposée » + année | `filingDate`, `office` |
| `pending` | « En cours d'examen » | `filingDate`, `office`, `applicationNumber` |
| `granted` | « Brevet délivré » + numéro | `grantDate`, `office`, `patentNumber` |

Le compteur « brevets » de la page Impact n'agrège **que** les `granted`.
Les autres sont affichés séparément, avec leur libellé exact.

---

## 9. Workflow éditorial

```
Draft → Review éditoriale → Review juridique (si Partner / KPI / FinTech / PI) → Traduction → Publication
```

- **Deux locales, un cycle de vie par locale.** Un contenu FR publié n'entraîne pas la publication de l'EN ; la page EN affiche le contenu FR uniquement si `fallbackToDefault: true` sur le champ, avec mention « Contenu disponible en français ».
- **Verrou juridique :** les documents `partner`, `kpi`, `patent`, `caseStudy` et toute page `fintech` exigent un second validateur (rôle `legal`) avant publication.
- **Traçabilité :** `lastUpdated`, `updatedBy`, `source` sont obligatoires sur tout document porteur de données factuelles.
