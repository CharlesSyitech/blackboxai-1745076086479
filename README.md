# Simulateur fiscal — Côte d'Ivoire

Simulateur bilingue (français / anglais) des impôts, taxes, redevances et prélèvements du
dispositif fiscal ivoirien. Quatorze calculateurs couvrant les cinq titres du tableau
synoptique de la Direction générale des Impôts, édition 2025 (annexe fiscale 2025 incluse).

*Bilingual (French / English) simulator for the taxes, duties and levies of the Ivorian tax
system. Fourteen calculators covering the five titles of the Directorate General of Taxes'
synoptic table, 2025 edition.*

## Calculateurs

| Titre | Simulateur | Références CGI |
| --- | --- | --- |
| I — Impôts sur les revenus | Impôt sur les traitements et salaires (ITS) | Art. 115 à 120 |
| I — Impôts sur les revenus | Charges fiscales de l'employeur (CE, CN, FDFP) | Art. 134 à 146 |
| I — Impôts sur les revenus | Impôt général sur le revenu (IGR) | Art. 237 à 251 |
| I — Impôts sur les revenus | Bénéfices industriels et commerciaux (BIC/BA) et IMF | Art. 1 à 84, 71 bis |
| I — Impôts sur les revenus | Bénéfices non commerciaux (BNC) et IMF/BNC | Art. 85 à 102 |
| I — Impôts sur les revenus | Impôts fonciers (revenu, patrimoine, agricole) | Art. 149 à 166 |
| I — Autres impôts directs | Contribution des patentes (DCA + DVL) | Art. 264 à 278 |
| I — Autres impôts directs | Revenus de capitaux mobiliers (IRVM / IRC) | Art. 180 à 193 |
| II — Taxes indirectes | TVA et taxe sur les opérations bancaires | Art. 339 à 401 |
| II — Taxes indirectes | Droits d'accises et taxes spécifiques | Art. 403 à 418 |
| II — Taxes indirectes | Taxe sur les contrats d'assurance | Art. 422 à 425 |
| III — Enregistrement | Droits d'enregistrement et de mutation | Art. 539 à 765 |
| IV — Timbre | Droits de timbre | Art. 805 à 873 |
| V — Contributions diverses | Acomptes, prélèvements et taxes diverses | Art. 84 bis, 1084 à 1130 |

Le simulateur des BIC déduit automatiquement le régime d'imposition du chiffre d'affaires
annuel TTC (TCE, TEE, microentreprises, réel simplifié, réel normal) et n'affiche que les
champs pertinents pour ce régime.

## Lancer l'application

L'application est statique et sans dépendance, mais elle utilise les modules ES : elle doit
être servie en HTTP plutôt qu'ouverte depuis le système de fichiers.

```sh
npm start          # sert le dossier sur http://localhost:8080
# ou : python3 -m http.server 8080
```

Puis ouvrir <http://localhost:8080>.

## Tests

```sh
npm test           # node --test tests/*.test.js
```

La suite vérifie les fonctions de calcul (barèmes progressifs, planchers et plafonds,
conversions HT/TTC) et chaque simulateur : bonne structure, libellés bilingues complets,
absence de `NaN` sur des entrées vides et exactitude des montants sur des cas connus.

## Organisation

```
index.html              page unique
assets/css/styles.css   thème clair et sombre, impression, affichage mobile
assets/js/rates.js      barèmes, taux et tarifs — unique source de vérité
assets/js/engine.js     fonctions de calcul génériques (barème progressif, bornes…)
assets/js/calculators.js les 14 simulateurs, en définitions déclaratives
assets/js/i18n.js       chaînes d'interface et formatage FR/EN
assets/js/app.js        rendu et interactions
tests/                  suite node:test
```

Pour modifier un taux, éditer `assets/js/rates.js` : aucun taux n'est codé en dur ailleurs.
Pour ajouter un simulateur, ajouter une définition dans `assets/js/calculators.js` et
l'inscrire dans le tableau `CALCULATEURS` ; le formulaire et l'affichage des résultats sont
générés automatiquement.

## Source et limites

Les taux, tarifs et références proviennent de :

> *Impôts et taxes en Côte d'Ivoire : tableau synoptique des impôts, taxes, redevances et
> prélèvements divers du dispositif fiscal ivoirien*, Direction générale des Impôts,
> édition 2025 — <https://www.dgi.gouv.ci>

Ce document n'est pas redistribué ici : il est protégé par une interdiction de reproduction
sans autorisation préalable de la DGI. Seuls les taux et les références au Code général des
Impôts sont repris, à des fins de calcul.

Limites connues :

- Les assiettes sont celles saisies par l'utilisateur ; le simulateur ne détermine pas le
  revenu imposable au sens de l'article 118 du CGI ni le bénéfice fiscal.
- Les mutations à titre gratuit (successions) ne sont publiées dans la source que sous forme
  de fourchette (1 % à 12 % selon le lien de parenté) : le simulateur affiche les bornes.
- Le tableau publié indique une RICF annuelle de 380 000 F pour 3,5 parts, incohérente avec
  le montant mensuel de 27 500 F ; le simulateur retient 27 500 × 12 = 330 000 F et le
  signale à l'utilisateur.
- L'impôt minimum forfaitaire est retenu lorsqu'il excède l'impôt sur les bénéfices.
- Les cotisations sociales (CNPS) ne sont pas des impôts et sont hors du champ du document.

Cet outil est fourni à titre informatif et pédagogique. Il ne remplace ni le Code général des
Impôts, ni l'avis d'un conseil fiscal, ni une position officielle de l'administration.
