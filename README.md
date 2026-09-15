# Guide fiscal — Côte d'Ivoire

Base de connaissances interrogeable du dispositif fiscal ivoirien, doublée de simulateurs
de calcul. Un contribuable pose sa question en langage courant — « comment calculer l'ITS ? » —
et obtient la fiche complète : qui paie, sur quelle assiette, à quel taux, avec quelles
exonérations, selon quelle formule, et sur quel fondement du Code général des Impôts.

Tout fonctionne **hors ligne et sans clé d'API** : le corpus et son index de recherche sont
embarqués dans la page. Les réponses sont assemblées depuis le corpus, jamais générées :
pour une même question, le même résultat, toujours traçable jusqu'à l'article du CGI.

*Searchable knowledge base of the Ivorian tax system, paired with calculators. Ask in plain
French or English and get the full entry: who pays, on what base, at what rate, with which
exemptions, by what formula, under which Tax Code article. Runs fully offline, no API key.*

## Les deux vues

**Guide fiscal** — 77 fiches couvrant les cinq titres du tableau synoptique de la DGI :
impôts directs, taxes indirectes, droits d'enregistrement, droits de timbre et contributions
diverses. Recherche en langage naturel, navigation par titre, et lien direct vers le
simulateur quand un calcul existe.

Chaque fiche décrit aussi **les situations concrètes qui y mènent** — « je loue mon
appartement », « j'embauche un salarié », « je suis coiffeuse dans mon quartier » — et
renvoie vers les impôts voisins, car un même événement en déclenche souvent plusieurs :
embaucher un salarié met en jeu l'ITS, la contribution employeur, la contribution nationale
et les deux taxes du FDFP.

**Simulateurs** — 14 calculateurs exécutant réellement le calcul :

| Titre | Simulateur | Références CGI |
| --- | --- | --- |
| I — Revenus | Impôt sur les traitements et salaires (ITS) | Art. 115 à 120 |
| I — Revenus | Charges fiscales de l'employeur (CE, CN, FDFP) | Art. 134 à 146 |
| I — Revenus | Impôt général sur le revenu (IGR) | Art. 237 à 251 |
| I — Revenus | Bénéfices industriels et commerciaux (BIC/BA) et IMF | Art. 1 à 84, 71 bis |
| I — Revenus | Bénéfices non commerciaux (BNC) et IMF/BNC | Art. 85 à 102 |
| I — Revenus | Impôts fonciers (revenu, patrimoine, agricole) | Art. 149 à 166 |
| I — Autres directs | Contribution des patentes (DCA + DVL) | Art. 264 à 278 |
| I — Autres directs | Revenus de capitaux mobiliers (IRVM / IRC) | Art. 180 à 193 |
| II — Indirectes | TVA et taxe sur les opérations bancaires | Art. 339 à 401 |
| II — Indirectes | Droits d'accises et taxes spécifiques | Art. 403 à 418 |
| II — Indirectes | Taxe sur les contrats d'assurance | Art. 422 à 425 |
| III — Enregistrement | Droits d'enregistrement et de mutation | Art. 539 à 765 |
| IV — Timbre | Droits de timbre | Art. 805 à 873 |
| V — Contributions diverses | Acomptes, prélèvements et taxes diverses | Art. 84 bis, 1084 à 1130 |

Le simulateur des BIC déduit le régime d'imposition du chiffre d'affaires annuel TTC
(TCE, TEE, microentreprises, réel simplifié, réel normal) et n'affiche que les champs
pertinents pour ce régime.

Chaque fiche adossée à un simulateur affiche un **exemple chiffré** calculé par ce
simulateur : le montant montré est exactement celui que l'on retrouve en l'ouvrant.

## Comment fonctionne la recherche

Pas de service externe, pas d'embeddings à télécharger. Au chargement, `search.js` construit
un index inversé sur l'ensemble du corpus, pondéré par champ — un sigle pèse six fois un
libellé de taux — puis classe les fiches par score BM25.

Les deux langues sont indexées ensemble : une question posée en anglais retrouve une fiche
rédigée en français. Les accents et apostrophes sont neutralisés, les pluriels ramenés au
singulier, les mots vides écartés, et « article 146 » rejoint les fiches dont la référence
s'écrit « Art. 146 ». Les sigles courts qui se confondent avec des mots courants — `IS` et
« is », `CE` et « ce » — ne sont retenus comme sigles que s'ils sont écrits en majuscules.

Les fiches sont indexées sur leur vocabulaire technique **et** sur les situations de la vie
courante. Cela change beaucoup pour un contribuable qui n'emploie pas le vocabulaire fiscal :
sur un jeu de vingt questions posées en langage ordinaire, la bonne fiche arrive en tête dans
16 cas sur 20 et figure dans les trois premiers résultats dans 18 cas sur 20, sans aucune
question laissée sans réponse — contre 9 sur 20 et quatre questions sans résultat avant
l'ajout des situations.

Le classement est vérifié par les tests : 24 questions en vocabulaire fiscal et 22 questions
en langage courant doivent renvoyer la bonne fiche en tête, chaque fiche doit être retrouvable
par son titre comme par ses sigles, et chaque situation décrite doit ramener sa propre fiche.

## Lancer l'application

Application statique sans dépendance, mais elle utilise les modules ES : elle doit être
servie en HTTP plutôt qu'ouverte depuis le système de fichiers.

```sh
npm start          # http://localhost:8080
# ou : python3 -m http.server 8080
```

Liens directs : `#fiche/its` ouvre une fiche, `#calc/tva` ouvre un simulateur.

## Tests

```sh
npm test           # node --test tests/*.test.js
```

47 tests couvrant :

- les fonctions de calcul — barèmes progressifs, planchers et plafonds, conversions HT/TTC ;
- les 14 simulateurs — structure, libellés bilingues complets, absence de `NaN` sur entrées
  vides, exactitude des montants sur des cas connus ;
- le corpus — identifiants uniques, complétude bilingue de chaque champ, cohérence des
  renvois vers les simulateurs et entre fiches, présence d'au moins un taux par fiche, et
  description des situations pour tout impôt doté d'un calculateur ;
- la recherche — tokenisation, résolution des sigles, pertinence sur 24 questions en
  vocabulaire fiscal et 22 en langage courant, indexation effective de chaque situation.

## Exporter le corpus vers un autre pipeline RAG

```sh
npm run export     # écrit dans dist/
```

- `dist/corpus.json` — le corpus structuré complet, titres et métadonnées compris ;
- `dist/corpus.jsonl` — 154 documents (77 fiches × 2 langues), un par ligne, chacun avec un
  champ `text` continu prêt à vectoriser — situations comprises — et ses métadonnées
  (`fiche`, `langue`, `refs`, `sigles`, `motsCles`, `liens`, `calculateur`, `source`).

## Organisation

```
index.html               page unique, deux vues
assets/css/styles.css    thème clair et sombre, impression, affichage mobile
assets/js/rates.js       barèmes, taux et tarifs — unique source de vérité
assets/js/engine.js      calculs génériques (barème progressif, bornes, HT/TTC)
assets/js/calculators.js les 14 simulateurs, en définitions déclaratives
assets/js/corpus.js      les 77 fiches de la base de connaissances
assets/js/search.js      index inversé et classement BM25
assets/js/i18n.js        chaînes d'interface et formatage FR/EN
assets/js/app.js         rendu et interactions
scripts/export-corpus.mjs export du corpus pour un RAG externe
tests/                   suite node:test
```

Pour modifier un taux, éditer `assets/js/rates.js` : aucun taux n'est codé en dur ailleurs,
ni dans les simulateurs, ni dans les fiches. Pour ajouter un impôt, ajouter une fiche dans
`assets/js/corpus.js` ; elle est indexée, affichée et exportée automatiquement.

## Source et limites

Les taux, tarifs et références proviennent de :

> *Impôts et taxes en Côte d'Ivoire : tableau synoptique des impôts, taxes, redevances et
> prélèvements divers du dispositif fiscal ivoirien*, Direction générale des Impôts,
> édition 2025 — <https://www.dgi.gouv.ci>

Ce document n'est pas redistribué ici : il interdit toute reproduction sans autorisation
préalable de la DGI. Les fiches sont des reformulations, non des extraits ; seuls les taux
et les références au Code général des Impôts sont repris, à des fins de calcul.

Limites connues :

- Les assiettes sont celles saisies par l'utilisateur ; le simulateur ne détermine pas le
  revenu imposable au sens de l'article 118 du CGI ni le bénéfice fiscal.
- Le classement de la recherche est lexical, non sémantique : une question qui n'emploie
  aucun mot du corpus peut ne rien renvoyer. Les situations de la vie courante réduisent
  fortement ce risque sans l'éliminer ; l'interface propose alors de reformuler, et la
  navigation par titre reste accessible.
- Quand plusieurs impôts répondent également à une même situation — les quatre charges
  patronales pour « j'embauche un salarié » —, leur ordre entre eux n'est pas significatif.
  Ils apparaissent tous dans la liste des résultats et se renvoient l'un à l'autre.
- Le document source ne publie pas les délais de déclaration ni le service compétent pour
  chaque impôt ; ces rubriques sont donc absentes des fiches.
- Les mutations à titre gratuit (successions) n'y figurent que sous forme de fourchette
  (1 % à 12 % selon le lien de parenté) : les fiches et le simulateur affichent les bornes.
- Le tableau publié indique une RICF annuelle de 380 000 F pour 3,5 parts, incohérente avec
  le montant mensuel de 27 500 F ; le simulateur retient 27 500 × 12 = 330 000 F et le
  signale à l'utilisateur.
- L'impôt minimum forfaitaire est retenu lorsqu'il excède l'impôt sur les bénéfices.
- Les cotisations sociales (CNPS) ne sont pas des impôts et sont hors du champ du document.

Cet outil est fourni à titre informatif et pédagogique. Il ne remplace ni le Code général des
Impôts, ni l'avis d'un conseil fiscal, ni une position officielle de l'administration.
