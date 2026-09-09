# 11 — Modèle de données CMS

> Phase 4 · Livrable 22

Toute information évolutive est administrable. **Aucun chiffre, aucun logo, aucune
qualification de relation n'est écrit dans le code.**

---

## 1. Vue d'ensemble des collections

| Collection | Volume estimé | Validation juridique requise |
|---|---|---|
| `solution` | 7 | — |
| `expertise` | 8 | — |
| `technology` | 6–10 | — |
| `partner` | 20–60 | **Oui** |
| `caseStudy` | 5–30 | **Oui** (autorisation client) |
| `news` | croissant | Oui pour les communiqués |
| `event` | variable | — |
| `person` | 8–20 | Oui (droit à l'image) |
| `award` | 0–15 | **Oui** (preuve) |
| `kpi` | 30–80 | **Oui** |
| `country` | 10–40 | **Oui** (type de présence) |
| `job` | variable | — |
| `publication` | variable | — |
| `patent` | variable | **Oui** |
| `office` | 1–8 | — |
| `page` | ~40 | — |
| `redirect` | variable | — |
| `siteSettings` | 1 (singleton) | — |

---

## 2. Champs communs

Tout document porte :

```ts
{
  _id, _type, _createdAt, _updatedAt,
  title:      I18nString,      // { fr, en }
  slug:       I18nSlug,        // { fr: {current}, en: {current} }
  isPublished: boolean,        // défaut false
  seo:        Seo,             // { title, description, ogImage, noindex }
  updatedBy:  reference→user,
}
```

`I18nString` : objet à deux clés localisées. Un champ non traduit n'est jamais rendu vide :
soit repli explicite et signalé, soit masquage du bloc.

---

## 3. Schémas détaillés

### 3.1 `kpi` — le document le plus contraint du système

```ts
{
  key:          string,          // identifiant stable, ex. "sydica.users"  [requis, unique]
  value:        number | null,   // null = donnée non validée
  unit:         'number'|'percent'|'currency'|'count'|'plus',
  displayFormat:'raw'|'compact'|'rounded',   // 1 240 000 → "1.2M"
  label:        I18nString,      // "Utilisateurs"                          [requis]
  category:     'culture'|'technology'|'enterprise'|'economic'|'social'|'corporate',
  period:       string,          // "2026-Q1", "2025", "cumul depuis 2019"  [requis]
  source:       I18nString,      // "Données internes, tableau de bord Sydica" [requis]
  methodology:  I18nText,        // optionnel mais recommandé
  lastUpdated:  date,            // [requis]
  isPublic:     boolean,         // défaut FALSE                            [requis]
  approvedBy:   reference→user,  // requis si isPublic === true
}
```

**Validations bloquantes en CMS**

| Règle | Message |
|---|---|
| `isPublic === true` ⇒ `value !== null` | « Impossible de publier un indicateur sans valeur. » |
| `isPublic === true` ⇒ `source` et `period` renseignés | « Un indicateur public doit être sourcé et daté. » |
| `isPublic === true` ⇒ `approvedBy` renseigné | « Validation requise avant publication. » |
| `lastUpdated` > 12 mois | Avertissement non bloquant : « Indicateur potentiellement obsolète. » |

**Contrat de rendu** (rappel doc 03 §5) : un KPI non public **n'est pas envoyé au client**.
Le composant ne reçoit rien, la grille se recompose, un bloc vide se masque.

### 3.2 `partner` — le document le plus sensible juridiquement

```ts
{
  partnerName:      string,                          [requis]
  partnerLogo:      image (SVG ou PNG transparent)   [requis]
  logoMonochrome:   image,                           // pour l'affichage en niveaux de gris
  category:         'culture_music'|'finance_payments'|'institutions_social'|
                    'technology_innovation'|'research_education'|'international_ecosystem',
  relationshipType: 'Strategic Partner'|'Institutional Partner'|'Technology Partner'|
                    'Content Partner'|'Financial Partner'|'Client'|'Supplier'|
                    'POC'|'Collaboration'|'Program'|'Research Partner',   [requis]
  description:      I18nText,        // description factuelle, sans qualificatif
  scopeOfWork:      I18nText,        // ce que couvre réellement la relation
  startDate:        date,            [requis]
  endDate:          date | null,     // null = en cours
  showAfterEnd:     boolean,         // afficher en "collaboration passée" après endDate
  website:          url,
  contractReference: string,         // référence interne, JAMAIS affichée
  logoUsageApproved: boolean,        // autorisation écrite d'usage du logo   [requis]
  legalValidatedBy:  reference→user,
  legalValidatedAt:  datetime,
  isPublic:         boolean,         // défaut FALSE
  featured:         boolean,         // remonte dans la sélection homepage
  order:            number,
}
```

**Validations bloquantes**

| Règle | Message |
|---|---|
| `isPublic === true` ⇒ `logoUsageApproved === true` | « Autorisation d'usage du logo non confirmée. » |
| `isPublic === true` ⇒ `legalValidatedBy` et `legalValidatedAt` renseignés | « Validation juridique requise. » |
| `relationshipType ∈ {Strategic, Institutional, Financial}` ⇒ `contractReference` requis | « Une qualification de partenariat exige une référence contractuelle. » |
| `featured === true` ⇒ `relationshipType ∉ {POC, Collaboration, Program, Client, Supplier}` | « Ce type de relation ne peut pas être mis en avant comme partenariat. » |
| `endDate` dépassée et `showAfterEnd === false` | Dépublication automatique (action planifiée) |

**Rendu frontend :** `relationshipType` est **toujours affiché**, dans son libellé exact
traduit. Il n'existe aucune variante de `PartnerCard` sans ce champ.

### 3.3 `solution`

```ts
{
  name, tagline: I18nString, positioning: I18nString,
  logo, logoInverse, accentColor: 'navy'|'amber'|'teal'|'neutral',
  vertical: reference→expertise,                    // expertise principale
  secondaryExpertises: [reference→expertise],
  technologies: [reference→technology],
  maturity: 'live'|'beta'|'roadmap',
  functionalUniverses: [{
     key, title: I18nString, description: I18nText,
     features: [I18nString],
     screenshot: image, screenshotCaption: I18nString,
     maturity: 'live'|'beta'|'roadmap'
  }],
  useCases: [{ sector: I18nString, description: I18nText }],
  kpis: [reference→kpi],
  faq: [{ question: I18nString, answer: I18nText }],
  regulatoryStatus: 'not_applicable'|'technology_only'|'partner_operated'|'licensed',
  licenseReference: string,        // requis si regulatoryStatus === 'licensed'
  ctaPrimary, ctaSecondary: { label: I18nString, href },
  relatedCaseStudies: [reference→caseStudy],
  order: number
}
```

**Validation :** `regulatoryStatus === 'licensed'` ⇒ `licenseReference` requis.
Une solution FinTech sans `regulatoryStatus` ne peut pas être publiée.

### 3.4 `expertise`

```ts
{ name, tagline, challenge: I18nText, capabilities: [{ label, description, icon }],
  technologies: [ref→technology], solutions: [ref→solution],
  caseStudies: [ref→caseStudy], kpis: [ref→kpi], heroVisual, order }
```

### 3.5 `technology`

```ts
{ name, category: 'ai'|'blockchain'|'data'|'iot'|'cloud'|'security',
  description: I18nText,
  concreteApplications: [{ context: 'business'|'culture'|'operations',
                           title: I18nString, description: I18nText }],
  usedBySolutions: [ref→solution],       // alimente le Technology Engine
  maturity: 'production'|'pilot'|'research', icon, order }
```

### 3.6 `caseStudy`

```ts
{ title, client: I18nString, clientLogo, clientApprovalRef,
  sector: 'culture'|'enterprise'|'events'|'public'|'technology'|'iot',
  date: date, location: I18nString,
  heroImage, gallery: [image + I18nString caption],
  challenge, solution, implementation, impact: I18nText,   // structure imposée
  technologies: [ref→technology], solutions: [ref→solution],
  expertise: ref→expertise,
  partners: [{ partner: ref→partner, roleInProject: I18nString }],   // rôle explicite
  results: [ref→kpi],
  testimonial: { quote: I18nText, author, role, approved: boolean },
  disclosureLevel: 'public'|'client_approved'|'internal',
  featured: boolean, order
}
```

**Validation :** `disclosureLevel === 'public'` ⇒ `clientApprovalRef` requis.
Seul `public` est interrogé par le frontend. Un `testimonial` non `approved` n'est pas rendu.

### 3.7 `country` (présence internationale)

```ts
{ name: I18nString, isoCode: string,
  presenceType: 'headquarters'|'operations'|'market'|'distribution'|'development',
  since: date, description: I18nText,
  entityName: string,        // requis si presenceType ∈ {headquarters, operations}
  isPublic: boolean }
```

**Validation :** `presenceType ∈ {headquarters, operations}` ⇒ `entityName` requis.
C'est la garantie technique de la distinction exigée entre « pays d'implantation » et
« pays de distribution ».

### 3.8 `patent`

```ts
{ title: I18nString, status: 'filed'|'pending'|'granted',
  office: string, filingDate: date, applicationNumber: string,
  grantDate: date, patentNumber: string,
  domain: [ref→technology], isPublic: boolean }
```

**Validations :** `granted` ⇒ `patentNumber` + `grantDate` requis · `pending` ⇒
`applicationNumber` requis. Le compteur « brevets délivrés » n'agrège que `granted`.

### 3.9 `person`, `award`, `job`, `news`, `publication`, `office`, `event`

| Collection | Champs distinctifs |
|---|---|
| `person` | `name`, `role: I18nString`, `governanceLevel: 'executive'|'leadership'|'business'`, `bio: I18nText`, `photo`, `linkedin`, `imageRightsApproved: boolean` (requis pour publier), `order` |
| `award` | `name`, `organization`, `year`, `category`, `proofUrl` (requis si `isPublic`), `logo` |
| `job` | `title`, `department`, `location`, `contractType`, `experienceLevel`, `description`, `requirements`, `validThrough`, `sytiumJobId`, `isOpen` |
| `news` | `category: corporate|innovation|partnerships|events|research|products|press|insights`, `author: ref→person`, `publishedAt`, `updatedAt`, `heroImage`, `body: PortableText`, `relatedArticles`, `isPressRelease` |
| `publication` | `title`, `authors`, `venue`, `year`, `doi`, `pdfUrl`, `technologies` |
| `office` | `city`, `country: ref→country`, `address`, `type`, `phone`, `email`, `coordinates` |
| `event` | `name`, `date`, `location`, `role: organizer|technology_provider|partner`, `linkedCaseStudy` |

### 3.10 `page` (pages composées) et `siteSettings`

```ts
page:        { title, slug, blocks: [ …tous les blocs du doc 03 §2 ], seo }
siteSettings:{ siteName, defaultSeo, socialLinks, contacts[], legalMentions,
               regulatoryDisclaimer: I18nText,   // affiché en footer, non modifiable en page
               navigationPrimary[], navigationFooter[], announcementBanner }
```

---

## 4. Structure du back-office (desk)

```
📊 Tableau de bord         → indicateurs à valider, contenus expirés, traductions manquantes
🏢 Le Groupe               → À propos · Histoire · Gouvernance · Leadership · Distinctions · Implantations
🎯 Expertises              → 8 documents
💡 Solutions               → 7 documents
⚙️  Technologies            → socle transverse
📁 Réalisations            → case studies (groupés par secteur)
📈 Indicateurs (KPI)       → par catégorie · vue "à valider" · vue "obsolètes (> 12 mois)"
🤝 Partenaires             → par catégorie · vue "en attente de validation juridique"
📰 Actualités              → par catégorie
💼 Carrières
🔬 R&D                     → publications · brevets
🌍 Pays & Présence
⚖️  Juridique              → mentions, disclaimers, redirections
⚙️  Paramètres du site
```

**Vues de contrôle indispensables** (elles font vivre la gouvernance au quotidien) :
« Indicateurs à valider », « Partenaires en attente de validation juridique »,
« Contenus non traduits », « Indicateurs de plus de 12 mois »,
« Case studies sans autorisation client ».

---

## 5. Rôles et permissions

| Rôle | Droits |
|---|---|
| `viewer` | Lecture, prévisualisation |
| `editor` | Créer/modifier tout contenu ; **publier** : `news`, `job`, `page` |
| `legal` | Seul habilité à passer `isPublic: true` sur `partner`, `kpi`, `patent`, `award`, `caseStudy`, `person` |
| `admin` | Tout, y compris schémas et paramètres |

L'élévation de `isPublic` sur les documents sensibles est implémentée en **action
personnalisée** vérifiant le rôle : la règle éditoriale devient une contrainte technique,
pas une consigne.

---

## 6. Migration et amorçage

1. **Amorçage des référentiels** : `technology`, `expertise`, `country` (script d'import).
2. **Solutions** : saisie manuelle avec captures produit réelles.
3. **KPI** : tous créés avec `value: null`, `isPublic: false` — ils apparaissent au fil des validations.
4. **Partenaires** : tous créés avec `isPublic: false`, en attente de la fiche de qualification juridique.
5. **Case studies** : Gadji Celi en premier (photographies professionnelles à fournir).
6. **Actualités** : reprise de l'historique si existant, sinon démarrage à la mise en ligne.

**Conséquence assumée :** au jour du lancement, certaines sections seront masquées faute de
données validées. C'est le comportement souhaité — un site institutionnel crédible affiche
moins, mais n'affiche rien de faux.
