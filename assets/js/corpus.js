/**
 * Base de connaissances interrogeable du dispositif fiscal ivoirien.
 *
 * Une fiche par impôt, taxe, redevance ou prélèvement, couvrant les cinq titres
 * du tableau synoptique de la DGI. Chaque fiche répond aux questions de base
 * d'un contribuable : qui paie, sur quelle assiette, à quel taux, avec quelles
 * exonérations, selon quelle formule, et sur quel fondement du CGI.
 *
 * Les taux proviennent de rates.js : aucune valeur n'est ressaisie ici.
 * Les textes sont des reformulations, non des extraits du document source.
 */

import {
  ACCISES,
  ARMES,
  ASSURANCE,
  BAREME_IGR,
  BAREME_ITS_MENSUEL,
  BNC,
  CHARGES_EMPLOYEUR,
  DOMAINE_PUBLIC,
  DROITS_ACTES,
  ENVIRONNEMENT,
  ETABLISSEMENTS_CLASSES,
  FONCIER,
  FORESTIERES,
  IMF,
  IRC,
  IRVM,
  LICENCES,
  MUTATION,
  PATENTE,
  PRELEVEMENTS,
  RETENUES_BIC,
  RICF_MENSUEL,
  RME,
  SECTORIELLES,
  SEUILS_REGIMES,
  TARIFS_AGRICOLES,
  TAUX_BIC,
  TAUX_DOCKERS,
  TAXE_HABITATION,
  TCE,
  TEE,
  TERRAINS_INDUSTRIELS,
  TIMBRE,
  TIMBRE_QUITTANCE,
  TOB,
  TVA,
  VIGNETTES,
} from './rates.js';

/** Libellé bilingue. */
const t = (fr, en) => ({ fr, en });

/** Ligne de taux exprimée en pourcentage (0,18 → « 18 % »). */
const pct = (libelle, taux) => ({ libelle, taux });

/** Ligne de taux exprimée en montant, avec une unité facultative. */
const mnt = (libelle, montant, unite) => ({ libelle, montant, unite });

/** Ligne de taux exprimée en texte libre (fourchettes, renvois à un arrêté). */
const txt = (libelle, valeur) => ({ libelle, valeur });

/** Les cinq titres du dispositif, dans l'ordre du tableau synoptique. */
export const TITRES = [
  { id: 'i-revenus', libelle: t('Titre I — Impôts sur les revenus', 'Title I — Income taxes') },
  { id: 'i-autres', libelle: t('Titre I — Autres impôts directs', 'Title I — Other direct taxes') },
  { id: 'ii-ca', libelle: t('Titre II — Taxes sur le chiffre d’affaires', 'Title II — Turnover taxes') },
  { id: 'ii-autres', libelle: t('Titre II — Autres taxes indirectes', 'Title II — Other indirect taxes') },
  { id: 'iii-actes', libelle: t('Titre III — Droits sur les actes', 'Title III — Duties on deeds') },
  { id: 'iii-mutations', libelle: t('Titre III — Droits de mutation', 'Title III — Transfer duties') },
  { id: 'iv-timbre', libelle: t('Titre IV — Droits de timbre', 'Title IV — Stamp duties') },
  { id: 'v-taxes', libelle: t('Titre V — Taxes diverses', 'Title V — Miscellaneous taxes') },
  { id: 'v-acomptes', libelle: t('Titre V — Acomptes d’impôt', 'Title V — Tax prepayments') },
  { id: 'v-forfaitaires', libelle: t('Titre V — Impôts forfaitaires', 'Title V — Flat-rate taxes') },
];

/** Barème ITS mensuel présenté en lignes de taux. */
const baremeIts = BAREME_ITS_MENSUEL.map((tranche, index, tableau) => {
  const plancher = index === 0 ? 0 : tableau[index - 1].plafond;
  const borneFr =
    tranche.plafond === Infinity
      ? `Au-dessus de ${plancher.toLocaleString('fr-FR')} F`
      : `De ${plancher.toLocaleString('fr-FR')} à ${tranche.plafond.toLocaleString('fr-FR')} F`;
  const borneEn =
    tranche.plafond === Infinity
      ? `Above XOF ${plancher.toLocaleString('en-US')}`
      : `XOF ${plancher.toLocaleString('en-US')} to ${tranche.plafond.toLocaleString('en-US')}`;
  return pct(t(borneFr, borneEn), tranche.taux);
});

/** Barème IGR annuel présenté en lignes de taux. */
const baremeIgr = BAREME_IGR.map((tranche, index, tableau) => {
  const plancher = index === 0 ? 0 : tableau[index - 1].plafond;
  const borneFr =
    tranche.plafond === Infinity
      ? `Au-delà de ${plancher.toLocaleString('fr-FR')} F`
      : `De ${plancher.toLocaleString('fr-FR')} à ${tranche.plafond.toLocaleString('fr-FR')} F`;
  const borneEn =
    tranche.plafond === Infinity
      ? `Above XOF ${plancher.toLocaleString('en-US')}`
      : `XOF ${plancher.toLocaleString('en-US')} to ${tranche.plafond.toLocaleString('en-US')}`;
  return pct(t(borneFr, borneEn), tranche.taux);
});

/* ================================================================== *
 * Titre I — Impôts sur les revenus
 * ================================================================== */

const titreI = [
  {
    id: 'regimes-imposition',
    groupe: 'i-revenus',
    titre: t('Régimes d’imposition selon le chiffre d’affaires', 'Tax regimes by turnover'),
    sigles: ['RNI', 'RSI', 'RME', 'TEE', 'TCE'],
    refs: 'Art. 34, 45, 71 bis et 72 du CGI',
    redevable: t(
      'Toute personne physique ou morale exerçant une activité commerciale, industrielle, artisanale, agricole ou de prestation de services.',
      'Any individual or company carrying on a commercial, industrial, craft, farming or service activity.',
    ),
    definition: t(
      "Le régime d'imposition détermine l'impôt applicable, les obligations comptables et le rythme de paiement. Il se déduit du chiffre d'affaires annuel toutes taxes comprises.",
      'The tax regime determines which tax applies, what accounting obligations arise and how often payment is due. It follows from annual turnover including tax.',
    ),
    assiette: t(
      "Chiffre d'affaires annuel toutes taxes comprises réalisé ou, pour une activité nouvelle, chiffre d'affaires prévisionnel déclaré.",
      'Annual turnover including tax, or, for a new business, the declared forecast turnover.',
    ),
    taux: [
      txt(
        t('Taxe communale de l’entreprenant (TCE)', 'Municipal entrepreneur tax (TCE)'),
        t(`CA TTC ≤ ${SEUILS_REGIMES.tce.toLocaleString('fr-FR')} F`, `Turnover up to XOF ${SEUILS_REGIMES.tce.toLocaleString('en-US')}`),
      ),
      txt(
        t('Taxe d’Etat de l’entreprenant (TEE)', 'State entrepreneur tax (TEE)'),
        t(
          `De ${(SEUILS_REGIMES.tce + 1).toLocaleString('fr-FR')} à ${SEUILS_REGIMES.tee.toLocaleString('fr-FR')} F`,
          `XOF ${(SEUILS_REGIMES.tce + 1).toLocaleString('en-US')} to ${SEUILS_REGIMES.tee.toLocaleString('en-US')}`,
        ),
      ),
      txt(
        t('Régime des microentreprises (RME)', 'Micro-enterprise regime (RME)'),
        t(
          `De ${(SEUILS_REGIMES.tee + 1).toLocaleString('fr-FR')} à ${SEUILS_REGIMES.rme.toLocaleString('fr-FR')} F`,
          `XOF ${(SEUILS_REGIMES.tee + 1).toLocaleString('en-US')} to ${SEUILS_REGIMES.rme.toLocaleString('en-US')}`,
        ),
      ),
      txt(
        t('Réel simplifié d’imposition (RSI)', 'Simplified actual-profit regime (RSI)'),
        t(
          `De ${(SEUILS_REGIMES.rme + 1).toLocaleString('fr-FR')} à ${SEUILS_REGIMES.rsi.toLocaleString('fr-FR')} F`,
          `XOF ${(SEUILS_REGIMES.rme + 1).toLocaleString('en-US')} to ${SEUILS_REGIMES.rsi.toLocaleString('en-US')}`,
        ),
      ),
      txt(
        t('Réel normal d’imposition (RNI)', 'Normal actual-profit regime (RNI)'),
        t(`Au-delà de ${SEUILS_REGIMES.rsi.toLocaleString('fr-FR')} F`, `Above XOF ${SEUILS_REGIMES.rsi.toLocaleString('en-US')}`),
      ),
    ],
    formule: t(
      'Comparer le chiffre d’affaires annuel TTC aux quatre seuils pour identifier le régime, puis appliquer l’impôt propre à ce régime.',
      'Compare annual turnover including tax with the four thresholds to identify the regime, then apply the tax specific to that regime.',
    ),
    motsCles: ['régime', 'seuil', 'million', 'millions', 'plafond', 'chiffre d’affaires', 'entreprenant', 'microentreprise', 'regime', 'threshold', 'million', 'turnover'],
    calculateur: 'bic',
  },
  {
    id: 'bic',
    groupe: 'i-revenus',
    titre: t('Impôt sur les bénéfices industriels et commerciaux (BIC) et agricoles (BA)', 'Tax on industrial, commercial and agricultural profits (BIC / BA)'),
    sigles: ['BIC', 'BA'],
    refs: 'Art. 1 à 84 du CGI ; taux : Art. 51',
    redevable: t(
      'Personnes physiques et morales relevant du réel normal ou du réel simplifié et réalisant des bénéfices commerciaux, industriels, artisanaux, agricoles ou de prestation de services en Côte d’Ivoire.',
      'Individuals and companies under the normal or simplified actual-profit regime earning commercial, industrial, craft, farming or service profits in Côte d’Ivoire.',
    ),
    definition: t(
      'Impôt cédulaire annuel perçu sur le bénéfice net de l’exercice. Il se cumule avec l’impôt minimum forfaitaire, qui en constitue le plancher.',
      'Annual schedular tax on the net profit for the financial year. It operates alongside the minimum flat tax, which acts as its floor.',
    ),
    assiette: t(
      'Bénéfice net de l’exercice, soit les produits diminués des charges déductibles.',
      'Net profit for the year: income less deductible expenses.',
    ),
    taux: [
      pct(t('Personnes physiques et morales', 'Individuals and companies'), TAUX_BIC.commun),
      pct(t('Télécommunications et technologies de l’information', 'Telecommunications and information technology'), TAUX_BIC.telecomsTic),
      pct(t('Entreprises du secteur des jeux de hasard', 'Gaming sector businesses'), TAUX_BIC.jeuxHasard),
    ],
    formule: t(
      'Impôt BIC = bénéfice net × taux. L’entreprise acquitte le plus élevé de l’impôt BIC et de l’impôt minimum forfaitaire.',
      'BIC tax = net profit × rate. The business pays the higher of the BIC tax and the minimum flat tax.',
    ),
    exonerations: [
      t('Les entreprises nouvelles, au titre de leur premier exercice comptable.', 'New businesses, for their first financial year.'),
      t('Les structures de microfinance, quelle que soit leur forme.', 'Microfinance institutions, whatever their legal form.'),
      t(
        'Les produits, plus-values et transactions portant sur les titres émis par les États membres de l’UMOA.',
        'Income, gains and transactions on securities issued by WAMU member States.',
      ),
      t(
        'Les intérêts des bons de caisse ayant effectivement supporté la retenue de 25 %.',
        'Interest on cash bonds that has actually borne the 25% withholding.',
      ),
    ],
    motsCles: ['bénéfice', 'société', 'entreprise', 'impôt sur les sociétés', 'profit', 'company tax', 'corporate'],
    calculateur: 'bic',
  },
  {
    id: 'imf',
    groupe: 'i-revenus',
    titre: t('Impôt minimum forfaitaire (IMF)', 'Minimum flat tax (IMF)'),
    sigles: ['IMF'],
    refs: 'Art. 39 (RNI) et 53 (RSI) du CGI',
    redevable: t(
      'Entreprises relevant du réel normal ou du réel simplifié d’imposition.',
      'Businesses under the normal or simplified actual-profit regime.',
    ),
    definition: t(
      'Plancher d’imposition assis sur le chiffre d’affaires : il est dû lorsqu’il excède l’impôt sur les bénéfices, y compris en cas de perte.',
      'Floor tax based on turnover: it is due whenever it exceeds the profits tax, including where the business is loss-making.',
    ),
    assiette: t('Chiffre d’affaires annuel toutes taxes comprises.', 'Annual turnover including tax.'),
    taux: [
      pct(t('Taux de droit commun', 'General rate'), IMF.tauxCommun),
      pct(
        t('Produits pétroliers, eau, électricité, gaz butane', 'Petroleum products, water, electricity, butane gas'),
        IMF.tauxPetrolierEauElectriciteGaz,
      ),
      pct(t('Banques, établissements financiers, assurance et réassurance', 'Banks, financial institutions, insurance and reinsurance'), IMF.tauxBanqueAssurance),
      mnt(t('Minimum de perception', 'Collection floor'), IMF.minimum),
      mnt(t('Minimum pour les stations-service et distributeurs de gaz butane', 'Floor for service stations and butane distributors'), IMF.minimumStationService),
      mnt(t('Maximum de perception (réel normal)', 'Collection cap (normal regime)'), IMF.maximumRni),
    ],
    formule: t(
      'IMF = chiffre d’affaires TTC × taux, ramené au minimum de perception s’il lui est inférieur et plafonné à 35 millions au réel normal.',
      'Minimum flat tax = turnover including tax × rate, raised to the collection floor if lower and capped at XOF 35 million under the normal regime.',
    ),
    motsCles: ['minimum', 'perte', 'déficit', 'plancher', 'chiffre d’affaires', 'loss', 'floor'],
    calculateur: 'bic',
  },
  {
    id: 'retenues-bic',
    groupe: 'i-revenus',
    titre: t('Retenues à la source sur les BIC', 'Withholding taxes on business profits'),
    sigles: [],
    refs: 'Art. 56 et suivants du CGI',
    redevable: t(
      'Personnes qui versent les sommes concernées, pour le compte du bénéficiaire.',
      'The parties paying the amounts concerned, on behalf of the recipient.',
    ),
    definition: t(
      'Prélèvements opérés à la source sur certaines sommes payées, imputables sur l’impôt sur les bénéfices du bénéficiaire.',
      'Amounts withheld at source on certain payments, creditable against the recipient’s profits tax.',
    ),
    assiette: t('Sommes payées ou quantités livrées.', 'Amounts paid or quantities delivered.'),
    taux: [
      txt(
        t('Sommes payées', 'Amounts paid'),
        t(
          RETENUES_BIC.map((taux) => `${(taux * 100).toLocaleString('fr-FR')} %`).join(', '),
          RETENUES_BIC.map((taux) => `${(taux * 100).toLocaleString('en-US')}%`).join(', '),
        ),
      ),
      mnt(t('Café livré par les traitants', 'Coffee delivered by intermediaries'), 2, t('par kilogramme', 'per kilogram')),
      mnt(t('Cacao livré par les traitants', 'Cocoa delivered by intermediaries'), 2.5, t('par kilogramme', 'per kilogram')),
      mnt(t('Noix de cajou brute exportée', 'Raw cashew nuts exported'), 5, t('par kilogramme', 'per kilogram')),
    ],
    motsCles: ['retenue', 'source', 'café', 'cacao', 'cajou', 'withholding', 'coffee', 'cocoa', 'cashew'],
  },
  {
    id: 'bnc',
    groupe: 'i-revenus',
    titre: t('Impôt sur les bénéfices non commerciaux (BNC)', 'Tax on non-commercial profits (BNC)'),
    sigles: ['BNC'],
    refs: 'Art. 85 à 102 du CGI',
    redevable: t(
      'Professions libérales, charges et offices, et toute activité non commerciale lucrative.',
      'Liberal professions, public offices, and any profit-making non-commercial activity.',
    ),
    definition: t(
      'Impôt cédulaire annuel perçu sur les bénéfices tirés de l’exercice d’une profession libérale ou d’une activité non commerciale.',
      'Annual schedular tax on profits from a liberal profession or a non-commercial activity.',
    ),
    assiette: t(
      'Bénéfice net de l’activité ; recettes brutes TTC pour l’impôt minimum forfaitaire.',
      'Net profit from the activity; gross receipts including tax for the minimum flat tax.',
    ),
    taux: [
      pct(t('Personnes physiques et morales', 'Individuals and companies'), BNC.taux),
      pct(t('Entreprises sans installation professionnelle en Côte d’Ivoire, sous réserve des conventions', 'Businesses without an establishment in Côte d’Ivoire, subject to treaties'), BNC.tauxSansInstallation),
      pct(t('Réassurance non domiciliée (taux effectif après déduction de 50 %)', 'Non-resident reinsurance (effective rate after a 50% deduction)'), BNC.tauxReassuranceNonDomiciliee),
      pct(t('Greffiers-notaires, sur les honoraires perçus', 'Notary-registrars, on fees received'), BNC.tauxGreffiersNotaires),
      pct(t('IMF/BNC sur les recettes brutes TTC', 'BNC minimum flat tax on gross receipts'), BNC.imfTaux),
      mnt(t('Minimum de perception de l’IMF/BNC', 'Floor of the BNC minimum flat tax'), BNC.imfMinimum),
      pct(t('Retenue à la source sur les sommes brutes', 'Withholding on gross amounts'), BNC.retenueSource),
    ],
    formule: t(
      'Impôt BNC = bénéfice net × 25 %. Le contribuable acquitte le plus élevé de cet impôt et de l’IMF/BNC (5 % des recettes brutes TTC, minimum 400 000 F).',
      'BNC tax = net profit × 25%. The taxpayer pays the higher of that tax and the BNC minimum flat tax (5% of gross receipts including tax, floor XOF 400,000).',
    ),
    motsCles: ['profession libérale', 'honoraires', 'avocat', 'médecin', 'consultant', 'liberal profession', 'fees', 'freelance'],
    calculateur: 'bnc',
  },
  {
    id: 'its',
    groupe: 'i-revenus',
    titre: t('Impôt sur les traitements et salaires (ITS)', 'Tax on wages and salaries (ITS)'),
    sigles: ['ITS', 'IS'],
    refs: 'Art. 115 à 120 du CGI ; RICF : Art. 119 bis',
    redevable: t(
      'Le salarié, le pensionné ou le crédirentier ; l’impôt est retenu à la source par l’employeur ou l’organisme payeur.',
      'The employee, pensioner or annuitant; the tax is withheld at source by the employer or paying institution.',
    ),
    definition: t(
      'Impôt retenu à la source sur les traitements, salaires, pensions et rentes viagères, calculé selon un barème progressif mensuel puis diminué de la réduction pour charges de famille.',
      'Tax withheld at source on wages, salaries, pensions and life annuities, computed on a monthly progressive scale then reduced by the family-allowance credit.',
    ),
    assiette: t(
      'Rémunération mensuelle imposable au sens de l’article 118 du CGI, avantages en nature compris.',
      'Monthly taxable remuneration as defined by article 118, including benefits in kind.',
    ),
    taux: [
      ...baremeIts,
      txt(
        t('Réduction pour charges de famille (mensuelle, de 1 à 5 parts)', 'Family-allowance credit (monthly, 1 to 5 shares)'),
        t(
          `${RICF_MENSUEL[1].toLocaleString('fr-FR')} à ${RICF_MENSUEL[5].toLocaleString('fr-FR')} F`,
          `XOF ${RICF_MENSUEL[1].toLocaleString('en-US')} to ${RICF_MENSUEL[5].toLocaleString('en-US')}`,
        ),
      ),
      pct(t('Dockers et dockers transit, sur le total des rémunérations', 'Dockers and transit dockers, on total remuneration'), TAUX_DOCKERS),
      txt(
        t('Retraités de plus de 70 ans', 'Pensioners over 70'),
        t('Abattement de 75 % de l’impôt après RICF', '75% relief on the tax after the family credit'),
      ),
    ],
    formule: t(
      'Impôt = impôt brut (barème progressif appliqué tranche par tranche au revenu mensuel imposable) − réduction pour charges de famille, sans pouvoir devenir négatif. Pour un retraité de plus de 70 ans, le résultat est ensuite réduit de 75 %.',
      'Tax = gross tax (progressive scale applied bracket by bracket to monthly taxable income) − family-allowance credit, floored at zero. For a pensioner over 70, the result is then reduced by 75%.',
    ),
    exonerations: [
      t('Les allocations familiales et certaines pensions.', 'Family allowances and certain pensions.'),
      t(
        'Les cotisations aux caisses de retraite complémentaire, dans la limite du dixième de la rémunération brute imposable et de 320 000 F.',
        'Contributions to supplementary pension funds, capped at one tenth of gross taxable pay and at XOF 320,000.',
      ),
      t(
        'Les rentes viagères et indemnités temporaires versées aux victimes d’accidents du travail.',
        'Life annuities and temporary allowances paid to victims of workplace accidents.',
      ),
      t(
        'Les salaires versés par les entreprises agro-industrielles aux travailleurs des catégories fixées par l’article 148 du CGI.',
        'Wages paid by agro-industrial businesses to workers in the categories set by article 148.',
      ),
    ],
    motsCles: ['salaire', 'paie', 'bulletin', 'employé', 'pension', 'retraite', 'salary', 'payroll', 'payslip', 'wage'],
    calculateur: 'its',
  },
  {
    id: 'contribution-employeur',
    groupe: 'i-revenus',
    titre: t('Contribution à la charge de l’employeur (CE)', 'Employer contribution (CE)'),
    sigles: ['CE'],
    refs: 'Art. 134 et suivants du CGI ; taux : Art. 146',
    redevable: t(
      'L’employeur, installé ou non en Côte d’Ivoire, à raison des salaires versés.',
      'The employer, whether or not established in Côte d’Ivoire, on the wages it pays.',
    ),
    definition: t(
      'Impôt cédulaire acquitté par l’employeur du fait des salaires versés à ses employés.',
      'Schedular tax borne by the employer on the wages paid to its staff.',
    ),
    assiette: t('Masse salariale versée au personnel expatrié.', 'Payroll paid to expatriate staff.'),
    taux: [pct(t('Salaires du personnel expatrié', 'Expatriate payroll'), CHARGES_EMPLOYEUR.contributionEmployeur.expatrie)],
    formule: t('Contribution = masse salariale expatriée × 9,2 %.', 'Contribution = expatriate payroll × 9.2%.'),
    exonerations: [
      t('Le personnel local exonéré.', 'Exempt local staff.'),
      t(
        'Les sommes payées pendant la phase d’exploration par les titulaires de permis de recherche minière.',
        'Amounts paid during the exploration phase by holders of mining exploration permits.',
      ),
      t('Les indemnités de maternité versées par la CNPS.', 'Maternity benefits paid by the CNPS.'),
    ],
    motsCles: ['employeur', 'expatrié', 'masse salariale', 'charges patronales', 'employer', 'expatriate'],
    calculateur: 'charges-employeur',
  },
  {
    id: 'contribution-nationale',
    groupe: 'i-revenus',
    titre: t('Contribution nationale pour le développement économique, culturel et social (CN)', 'National contribution for economic, cultural and social development (CN)'),
    sigles: ['CN'],
    refs: 'Art. 136 et 146 du CGI',
    redevable: t('L’employeur, du fait des salaires versés à ses employés.', 'The employer, on the wages paid to its staff.'),
    definition: t(
      'Impôt acquitté par l’employeur sur l’ensemble de la masse salariale, personnel local comme expatrié.',
      'Tax borne by the employer on total payroll, both local and expatriate staff.',
    ),
    assiette: t('Masse salariale totale.', 'Total payroll.'),
    taux: [
      pct(t('Personnel local', 'Local staff'), CHARGES_EMPLOYEUR.contributionNationale.local),
      pct(t('Personnel expatrié', 'Expatriate staff'), CHARGES_EMPLOYEUR.contributionNationale.expatrie),
    ],
    exonerations: [
      t('Les rémunérations versées au titre du premier emploi, pendant deux ans.', 'Pay for a first job, for two years.'),
      t(
        'Les indemnités de stage d’embauche, dans la limite de 150 000 F par mois et par stagiaire, sur douze mois.',
        'Pre-hiring internship allowances, capped at XOF 150,000 per month per intern, over twelve months.',
      ),
    ],
    motsCles: ['contribution nationale', 'masse salariale', 'employeur', 'national contribution', 'payroll'],
    calculateur: 'charges-employeur',
  },
  {
    id: 'taxe-apprentissage',
    groupe: 'i-revenus',
    titre: t('Taxe d’apprentissage', 'Apprenticeship tax'),
    sigles: ['FDFP'],
    refs: 'Art. 143 et 146 du CGI',
    redevable: t('L’employeur. La taxe est collectée par le FDFP.', 'The employer. The tax is collected by the FDFP.'),
    definition: t(
      'Taxe additionnelle à la contribution à la charge des employeurs, affectée au financement de la formation professionnelle.',
      'Additional levy on top of the employer contribution, earmarked for vocational training.',
    ),
    assiette: t('Masse salariale totale.', 'Total payroll.'),
    taux: [
      pct(t('Personnel local', 'Local staff'), CHARGES_EMPLOYEUR.taxeApprentissage.local),
      pct(t('Personnel expatrié', 'Expatriate staff'), CHARGES_EMPLOYEUR.taxeApprentissage.expatrie),
    ],
    motsCles: ['apprentissage', 'formation', 'FDFP', 'apprenticeship', 'training'],
    calculateur: 'charges-employeur',
  },
  {
    id: 'formation-continue',
    groupe: 'i-revenus',
    titre: t('Taxe additionnelle pour la formation professionnelle continue', 'Additional continuing vocational training levy'),
    sigles: ['FPC', 'FDFP'],
    refs: 'Loi n° 77-924 du 17 novembre 1977 ; taux : Art. 146 du CGI',
    redevable: t('L’employeur. La taxe est collectée par le FDFP.', 'The employer. The tax is collected by the FDFP.'),
    definition: t(
      'Seconde taxe additionnelle à la contribution employeur, destinée à la formation continue des salariés.',
      'Second additional levy on the employer contribution, funding continuing training for employees.',
    ),
    assiette: t('Masse salariale totale.', 'Total payroll.'),
    taux: [
      pct(t('Personnel local', 'Local staff'), CHARGES_EMPLOYEUR.formationContinue.local),
      pct(t('Personnel expatrié', 'Expatriate staff'), CHARGES_EMPLOYEUR.formationContinue.expatrie),
    ],
    motsCles: ['formation continue', 'FDFP', 'employeur', 'continuing training'],
    calculateur: 'charges-employeur',
  },
  {
    id: 'revenu-foncier',
    groupe: 'i-revenus',
    titre: t('Impôt sur le revenu foncier', 'Rental income tax'),
    sigles: [],
    refs: 'Art. 149 à 156 du CGI',
    redevable: t('Le propriétaire d’un immeuble donné en location.', 'The owner of a property let out.'),
    definition: t(
      'Impôt cédulaire perçu à raison du revenu tiré de la mise en location d’un immeuble bâti ou non bâti.',
      'Schedular tax on income from letting a built or unbuilt property.',
    ),
    assiette: t('Valeur locative annuelle de l’immeuble productif de revenus.', 'Annual rental value of the income-producing property.'),
    taux: [
      pct(t('Personnes physiques', 'Individuals'), FONCIER.revenuFoncier.personnePhysique),
      pct(t('Entreprises et personnes morales', 'Businesses and legal entities'), FONCIER.revenuFoncier.personneMorale),
    ],
    formule: t(
      'Impôt = valeur locative annuelle × 3 % (4 % pour une personne morale). Il se cumule avec l’impôt sur le patrimoine foncier.',
      'Tax = annual rental value × 3% (4% for a legal entity). It applies on top of the property wealth tax.',
    ),
    exonerations: [
      t('Les édifices servant à l’exercice public des cultes.', 'Buildings used for public worship.'),
      t('Les immeubles à usage scolaire non productifs de revenus fonciers.', 'School buildings not producing rental income.'),
      t('Les immeubles affectés aux œuvres d’assistance médicale ou sociale.', 'Buildings used for medical or social welfare work.'),
      t(
        'Les immeubles des associations et fondations caritatives reconnues d’utilité publique, sauf s’ils sont donnés en location.',
        'Buildings of recognised charitable associations and foundations, unless let out.',
      ),
    ],
    motsCles: ['location', 'loyer', 'bailleur', 'immeuble', 'rent', 'landlord', 'letting'],
    calculateur: 'foncier',
  },
  {
    id: 'patrimoine-foncier-bati',
    groupe: 'i-revenus',
    titre: t('Impôt sur le patrimoine foncier des propriétés bâties', 'Tax on built property'),
    sigles: [],
    refs: 'Art. 157 à 158 ter du CGI',
    redevable: t('Le propriétaire de l’immeuble bâti.', 'The owner of the built property.'),
    definition: t(
      'Impôt annuel dû à raison de la propriété d’un immeuble bâti, qu’il produise ou non des revenus fonciers.',
      'Annual tax on the ownership of a built property, whether or not it produces rental income.',
    ),
    assiette: t(
      'Valeur locative pour les immeubles productifs de revenus ; valeur marchande pour les immeubles non productifs.',
      'Rental value for income-producing properties; market value for non-producing ones.',
    ),
    taux: [
      pct(t('Valeur locative — personnes physiques', 'Rental value — individuals'), FONCIER.patrimoineBati.personnePhysique),
      pct(t('Valeur locative — entreprises et personnes morales', 'Rental value — businesses and legal entities'), FONCIER.patrimoineBati.personneMorale),
      pct(t('Valeur marchande — immeubles non productifs de revenus', 'Market value — non-income-producing property'), FONCIER.patrimoineBatiNonProductif.taux),
    ],
    formule: t(
      'Immeuble loué : valeur locative × 9 % (11 % pour une personne morale). Immeuble non productif de revenus, y compris l’habitation principale : valeur marchande × 0,5 %.',
      'Let property: rental value × 9% (11% for a legal entity). Non-income-producing property, including a main home: market value × 0.5%.',
    ),
    exonerations: [
      t('Les édifices servant à l’exercice public des cultes.', 'Buildings used for public worship.'),
      t('Les immeubles à usage scolaire.', 'School buildings.'),
      t('Les immeubles affectés aux œuvres d’assistance sociale ou médicale.', 'Buildings used for social or medical welfare work.'),
    ],
    motsCles: ['foncier', 'propriété', 'maison', 'habitation principale', 'villa', 'property tax', 'home'],
    calculateur: 'foncier',
  },
  {
    id: 'patrimoine-foncier-non-bati',
    groupe: 'i-revenus',
    titre: t('Impôt sur le patrimoine foncier des propriétés non bâties', 'Tax on unbuilt property'),
    sigles: [],
    refs: 'Art. 159 à 165 du CGI',
    redevable: t('Le propriétaire du terrain ou l’exploitant agricole.', 'The landowner or the farm operator.'),
    definition: t(
      'Impôt annuel perçu sur les immeubles urbains non bâtis improductifs de revenus et sur les exploitations agricoles.',
      'Annual tax on unbuilt urban land producing no income, and on farms.',
    ),
    assiette: t(
      'Valeur marchande du terrain ; superficie plantée pour les exploitations agricoles.',
      'Market value of the land; planted area for farms.',
    ),
    taux: [
      pct(t('Terrains urbains non bâtis', 'Unbuilt urban land'), FONCIER.patrimoineNonBati.taux),
      pct(t('Immeubles non bâtis du Port autonome de San Pedro', 'Unbuilt property of the San Pedro Port Authority'), FONCIER.patrimoineNonBati.tauxPortSanPedro),
      mnt(t('Hévéa', 'Rubber'), TARIFS_AGRICOLES.hevea, t('par hectare planté', 'per planted hectare')),
      mnt(
        t('Cacao, café, banane, ananas, coco, palmier à huile, fleurs', 'Cocoa, coffee, banana, pineapple, coconut, oil palm, flowers'),
        TARIFS_AGRICOLES.cacao,
        t('par hectare planté', 'per planted hectare'),
      ),
      mnt(
        t('Canne à sucre, mangue, anacarde, citron, papaye', 'Sugar cane, mango, cashew, lemon, papaya'),
        TARIFS_AGRICOLES.canneASucre,
        t('par hectare planté', 'per planted hectare'),
      ),
    ],
    formule: t(
      'Terrain urbain : valeur marchande × 1 %. Exploitation agricole : superficie plantée × tarif de la culture.',
      'Urban land: market value × 1%. Farm: planted area × the crop rate.',
    ),
    exonerations: [
      t(
        'Les terrains à usage scolaire, cultuel ou utilisés par des établissements d’assistance médicale ou sociale.',
        'Land used for schooling, worship, or by medical or social welfare institutions.',
      ),
      t(
        'Les terrains bornés concédés ou attribués, durant l’année d’acquisition et les deux années suivantes.',
        'Surveyed land granted or allocated, during the year of acquisition and the two following years.',
      ),
    ],
    motsCles: ['terrain', 'parcelle', 'plantation', 'hectare', 'agricole', 'land', 'plot', 'farm'],
    calculateur: 'foncier',
  },
  {
    id: 'taxe-voirie',
    groupe: 'i-revenus',
    titre: t('Taxe de voirie, d’hygiène et d’assainissement', 'Road, hygiene and sanitation levy'),
    sigles: [],
    refs: 'Art. 166 du CGI',
    redevable: t(
      'Les propriétaires d’immeubles exonérés de l’impôt foncier, les représentations diplomatiques et les entreprises bénéficiaires du Code des Investissements.',
      'Owners of property exempt from land tax, diplomatic missions, and businesses benefiting from the Investment Code.',
    ),
    definition: t(
      'Taxe due par ceux que l’impôt foncier épargne, en contrepartie des services de voirie et d’assainissement.',
      'Levy borne by those exempt from land tax, in return for road and sanitation services.',
    ),
    assiette: t('Valeur locative de l’immeuble.', 'Rental value of the property.'),
    taux: [pct(t('Taux unique', 'Single rate'), FONCIER.taxeVoirie.taux)],
    motsCles: ['voirie', 'hygiène', 'assainissement', 'ambassade', 'sanitation', 'embassy'],
  },
  {
    id: 'irvm',
    groupe: 'i-revenus',
    titre: t('Impôt sur le revenu des valeurs mobilières (IRVM)', 'Tax on income from securities (IRVM)'),
    sigles: ['IRVM'],
    refs: 'Art. 180 à 183 du CGI',
    redevable: t(
      'Le bénéficiaire du revenu ; l’impôt est retenu à la source par la société distributrice.',
      'The recipient of the income; the tax is withheld at source by the distributing company.',
    ),
    definition: t(
      'Impôt cédulaire retenu à la source sur les revenus d’actions, de parts sociales, d’obligations et les revenus réputés distribués.',
      'Schedular tax withheld at source on income from shares, partnership interests, bonds and deemed distributions.',
    ),
    assiette: t('Montant brut distribué.', 'Gross amount distributed.'),
    taux: [
      pct(t('Droit commun — personnes morales', 'General rate — legal entities'), IRVM.commun.morale),
      pct(t('Droit commun — personnes physiques', 'General rate — individuals'), IRVM.commun.physique),
      pct(t('Dividendes de sociétés cotées à la BRVM — personnes morales', 'Dividends from BRVM-listed companies — legal entities'), IRVM.brvm.morale),
      pct(t('Dividendes de sociétés cotées à la BRVM — personnes physiques', 'Dividends from BRVM-listed companies — individuals'), IRVM.brvm.physique),
      pct(t('Obligations remboursables en 5 ans au moins — personnes morales', 'Bonds redeemable in 5 years or more — legal entities'), IRVM.obligations5Ans.morale),
      pct(t('Obligations remboursables en 5 ans au moins — personnes physiques', 'Bonds redeemable in 5 years or more — individuals'), IRVM.obligations5Ans.physique),
    ],
    exonerations: [
      t(
        'Les produits, lots et primes de remboursement d’obligations versés à des personnes morales non établies dans l’UEMOA.',
        'Bond income, prizes and redemption premiums paid to legal entities not established in WAEMU.',
      ),
      t(
        'Les augmentations de capital par incorporation de réserves, sous les conditions de l’article 226 du CGI.',
        'Capital increases by capitalisation of reserves, under the conditions of article 226.',
      ),
    ],
    motsCles: ['dividende', 'action', 'obligation', 'BRVM', 'bourse', 'dividend', 'share', 'bond', 'stock exchange'],
    calculateur: 'capitaux',
  },
  {
    id: 'irc',
    groupe: 'i-revenus',
    titre: t('Impôt sur le revenu des créances (IRC)', 'Tax on income from debt claims (IRC)'),
    sigles: ['IRC'],
    refs: 'Art. 192 et 193 du CGI',
    redevable: t('Le bénéficiaire des intérêts ; l’impôt est retenu à la source.', 'The recipient of the interest; the tax is withheld at source.'),
    definition: t(
      'Impôt cédulaire retenu à la source sur les intérêts, arrérages et autres produits des prêts, dépôts, cautionnements et comptes courants.',
      'Schedular tax withheld at source on interest, arrears and other income from loans, deposits, cash guarantees and current accounts.',
    ),
    assiette: t('Montant brut des intérêts versés.', 'Gross interest paid.'),
    taux: [
      pct(t('Droit commun', 'General rate'), IRC.commun),
      pct(t('Comptes courants — particuliers', 'Current accounts — individuals'), IRC.compteCourantParticulier),
      pct(t('Comptes courants — entreprises', 'Current accounts — companies'), IRC.compteCourantEntreprise),
      txt(
        t('Comptes de dépôts — particuliers, selon la durée', 'Deposit accounts — individuals, by term'),
        t(
          `${(IRC.depotParticulierMin * 100).toLocaleString('fr-FR')} % à ${(IRC.depotParticulierMax * 100).toLocaleString('fr-FR')} %`,
          `${(IRC.depotParticulierMin * 100).toLocaleString('en-US')}% to ${(IRC.depotParticulierMax * 100).toLocaleString('en-US')}%`,
        ),
      ),
      txt(
        t('Comptes de dépôts — entreprises, selon la durée', 'Deposit accounts — companies, by term'),
        t(
          `${(IRC.depotEntrepriseMin * 100).toLocaleString('fr-FR')} % à ${(IRC.depotEntrepriseMax * 100).toLocaleString('fr-FR')} %`,
          `${(IRC.depotEntrepriseMin * 100).toLocaleString('en-US')}% to ${(IRC.depotEntrepriseMax * 100).toLocaleString('en-US')}%`,
        ),
      ),
    ],
    exonerations: [
      t('Les créances commerciales.', 'Trade receivables.'),
      t('Les intérêts des comptes d’épargne populaire.', 'Interest on popular savings accounts.'),
      t(
        'Les entreprises créées ou rouvertes en zones Centre, Nord et Ouest, pendant huit ans.',
        'Businesses created or reopened in the Centre, North and West zones, for eight years.',
      ),
    ],
    motsCles: ['intérêt', 'prêt', 'dépôt', 'compte courant', 'épargne', 'interest', 'loan', 'deposit', 'savings'],
    calculateur: 'capitaux',
  },
  {
    id: 'igr',
    groupe: 'i-revenus',
    titre: t('Impôt général sur le revenu (IGR)', 'General income tax (IGR)'),
    sigles: ['IGR'],
    refs: 'Art. 237 à 251 du CGI',
    redevable: t('La personne physique détentrice des revenus.', 'The individual receiving the income.'),
    definition: t(
      'Impôt global progressif frappant l’ensemble des revenus nets catégoriels d’une personne physique. Chaque impôt cédulaire déjà payé s’y impute comme un acompte.',
      'Progressive global tax on the aggregate net income of an individual. Each schedular tax already paid is credited against it as a prepayment.',
    ),
    assiette: t('Revenu net annuel imposable, tous revenus catégoriels confondus.', 'Annual net taxable income, across all income categories.'),
    taux: baremeIgr,
    formule: t(
      'IGR = barème progressif appliqué tranche par tranche au revenu net annuel, diminué des impôts cédulaires déjà acquittés.',
      'IGR = progressive scale applied bracket by bracket to annual net income, less the schedular taxes already paid.',
    ),
    exonerations: [
      t('Les intérêts des bons et obligations émis par le Trésor public.', 'Interest on Treasury bills and bonds.'),
      t('Les dividendes mis en paiement par la BRVM.', 'Dividends paid through the BRVM.'),
      t('Les produits des obligations émises dans l’UEMOA.', 'Income from bonds issued within WAEMU.'),
      t(
        'Les bénéfices des personnes relevant du régime des microentreprises ou de l’entreprenant.',
        'Profits of taxpayers under the micro-enterprise or entrepreneur regimes.',
      ),
    ],
    motsCles: ['revenu global', 'personne physique', 'déclaration', 'global income', 'individual', 'return'],
    calculateur: 'igr',
  },
];

/* ================================================================== *
 * Titre I — Autres impôts directs · Titre II — Taxes indirectes
 * ================================================================== */

const titreIAutres = [
  {
    id: 'patente',
    groupe: 'i-autres',
    titre: t('Contribution des patentes', 'Business licence tax'),
    sigles: ['DCA', 'DVL'],
    refs: 'Art. 264 à 302 du CGI ; taux : Art. 267, 268 et 278',
    redevable: t(
      'Toute personne physique ou morale exerçant une activité commerciale, industrielle ou une profession libérale sans exemption expresse.',
      'Any individual or company carrying on a commercial, industrial or professional activity without an express exemption.',
    ),
    definition: t(
      'Contribution annuelle en deux composantes : un droit assis sur le chiffre d’affaires et un droit assis sur la valeur locative des locaux professionnels.',
      'Annual tax in two parts: a duty on turnover and a duty on the rental value of business premises.',
    ),
    assiette: t(
      'Chiffre d’affaires hors taxes pour le premier droit ; valeur locative des locaux pour le second.',
      'Turnover excluding tax for the first duty; rental value of premises for the second.',
    ),
    taux: [
      pct(t('Droit sur le chiffre d’affaires — droit commun', 'Turnover duty — general rate'), PATENTE.dcaTaux),
      pct(t('Droit sur le chiffre d’affaires — activités exonérées du droit sur la valeur locative', 'Turnover duty — activities exempt from the rental-value duty'), PATENTE.dcaTauxExonereValeurLocative),
      mnt(t('Minimum du droit sur le chiffre d’affaires', 'Turnover duty floor'), PATENTE.dcaMinimum),
      mnt(t('Maximum — chiffre d’affaires inférieur à 200 millions', 'Cap — turnover below XOF 200 million'), PATENTE.dcaPlafonds[0].maximum),
      mnt(t('Maximum — de 200 à 500 millions', 'Cap — XOF 200 to 500 million'), PATENTE.dcaPlafonds[1].maximum),
      mnt(t('Maximum — de 500 millions à 1 milliard', 'Cap — XOF 500 million to 1 billion'), PATENTE.dcaPlafonds[2].maximum),
      mnt(t('Maximum — au-delà de 1 milliard', 'Cap — above XOF 1 billion'), PATENTE.dcaPlafonds[3].maximum),
      pct(t('Droit sur la valeur locative — droit commun', 'Rental-value duty — general rate'), PATENTE.dvlTaux),
      pct(t('Droit sur la valeur locative — hors périmètre communal', 'Rental-value duty — outside a municipal boundary'), PATENTE.dvlTauxHorsCommune),
    ],
    formule: t(
      'Patente = droit sur le chiffre d’affaires (CA HT × 0,5 %, borné par le minimum de 300 000 F et le plafond de la tranche de CA) + droit sur la valeur locative (valeur locative × 18,5 %), ce dernier ne pouvant être inférieur au tiers du premier.',
      'Business licence tax = turnover duty (turnover × 0.5%, bounded by the XOF 300,000 floor and the cap for the turnover band) + rental-value duty (rental value × 18.5%), the latter never below one third of the former.',
    ),
    exonerations: [
      t('Les établissements d’enseignement scolaire et universitaire.', 'School and university establishments.'),
      t('Les institutions financières à caractère mutualiste.', 'Mutual financial institutions.'),
      t('Les organismes de bienfaisance et associations sans but lucratif.', 'Charities and non-profit associations.'),
      t('Les exonérations temporaires prévues par le Code des Investissements.', 'Temporary exemptions under the Investment Code.'),
    ],
    motsCles: ['patente', 'licence commerciale', 'local professionnel', 'transport', 'business licence', 'premises'],
    calculateur: 'patente',
  },
  {
    id: 'licences',
    groupe: 'i-autres',
    titre: t('Contribution des licences', 'Liquor licence tax'),
    sigles: [],
    refs: 'Art. 300 à 302 du CGI',
    redevable: t(
      'Tout établissement vendant des boissons alcoolisées, en gros ou au détail, à consommer sur place ou à emporter. Elle est due par établissement.',
      'Any establishment selling alcoholic drinks wholesale or retail, for consumption on or off the premises. Due per establishment.',
    ),
    definition: t(
      'Contribution annuelle sur le commerce des boissons alcoolisées, dont le tarif dépend de la classe de l’établissement et de sa zone.',
      'Annual tax on the alcoholic drinks trade, at a rate set by the class of establishment and its zone.',
    ),
    assiette: t('Tarif forfaitaire par établissement.', 'Flat rate per establishment.'),
    taux: [
      mnt(t('1re classe (établissements de nuit) — première zone', 'Class 1 (night venues) — first zone'), LICENCES.classe1.zone1),
      mnt(t('1re classe — deuxième zone', 'Class 1 — second zone'), LICENCES.classe1.zone2),
      mnt(t('2e classe (autres établissements sur place) — première zone', 'Class 2 (other on-premises venues) — first zone'), LICENCES.classe2.zone1),
      mnt(t('2e classe — deuxième zone', 'Class 2 — second zone'), LICENCES.classe2.zone2),
      mnt(t('3e classe (fabrication, vente à emporter) — première zone', 'Class 3 (production, off-premises sales) — first zone'), LICENCES.classe3.zone1),
      mnt(t('3e classe — deuxième zone', 'Class 3 — second zone'), LICENCES.classe3.zone2),
      txt(
        t('Vente exclusive de vin et de bière', 'Wine and beer only'),
        t('Droits réduits des deux tiers', 'Duties reduced by two thirds'),
      ),
    ],
    exonerations: [
      t(
        'La vente à emporter d’alcool de menthe pharmaceutique et des produits médicamenteux alcoolisés.',
        'Off-premises sales of pharmaceutical mint alcohol and alcohol-based medicinal products.',
      ),
      t('Les points de vente exonérés de la contribution des patentes.', 'Outlets exempt from the business licence tax.'),
    ],
    motsCles: ['licence', 'boisson', 'alcool', 'bar', 'maquis', 'night club', 'liquor', 'drinks'],
  },
];

const titreII = [
  {
    id: 'tva',
    groupe: 'ii-ca',
    titre: t('Taxe sur la valeur ajoutée (TVA)', 'Value added tax (VAT)'),
    sigles: ['TVA', 'VAT'],
    refs: 'Art. 339 et suivants du CGI ; taux : Art. 359',
    redevable: t(
      'L’entreprise assujettie, qui la collecte auprès du client et la reverse après déduction de la TVA supportée.',
      'The taxable business, which collects it from the customer and remits it after deducting input VAT.',
    ),
    definition: t(
      'Impôt sur la consommation assis sur le chiffre d’affaires et perçu à tous les stades du circuit commercial.',
      'Consumption tax levied on turnover at every stage of the commercial chain.',
    ),
    assiette: t('Prix de vente hors taxes des biens livrés et des services rendus.', 'Price excluding tax of goods delivered and services supplied.'),
    taux: [
      pct(t('Taux de droit commun', 'General rate'), TVA.commun),
      pct(t('Taux réduit (lait, pâtes de blé dur, produits pétroliers)', 'Reduced rate (milk, durum-wheat pasta, petroleum products)'), TVA.reduit),
    ],
    formule: t(
      'TVA collectée = montant hors taxes × 18 %. À partir d’un prix TTC : montant HT = TTC ÷ 1,18, puis TVA = TTC − HT. TVA à reverser = TVA collectée − TVA déductible.',
      'Output VAT = amount excluding tax × 18%. From a tax-inclusive price: net = gross ÷ 1.18, then VAT = gross − net. VAT payable = output VAT − input VAT.',
    ),
    exonerations: [
      t('Le gaz butane, les engrais, les semences et les grains.', 'Butane gas, fertilisers, seeds and grain.'),
      t('Les médicaments et l’activité d’enseignement.', 'Medicines and teaching activities.'),
      t('Les exportations, les livres, journaux et périodiques.', 'Exports, books, newspapers and periodicals.'),
      t(
        'La viande et les abats non transformés, les fruits alimentaires naturels produits localement.',
        'Unprocessed meat and offal, and naturally grown local edible fruit.',
      ),
    ],
    motsCles: ['TVA', 'facture', 'HT', 'TTC', 'consommation', 'VAT', 'invoice', 'net', 'gross'],
    calculateur: 'tva',
  },
  {
    id: 'tob',
    groupe: 'ii-ca',
    titre: t('Taxe sur les opérations bancaires (TOB)', 'Banking transactions tax (TOB)'),
    sigles: ['TOB'],
    refs: 'Art. 395 à 401 du CGI',
    redevable: t('Les banques, établissements financiers et opérateurs du commerce des valeurs et de l’argent.', 'Banks, financial institutions and operators trading in money and securities.'),
    definition: t(
      'Taxe indirecte applicable aux activités bancaires et financières, en lieu et place de la TVA.',
      'Indirect tax on banking and financial activities, applying in place of VAT.',
    ),
    assiette: t('Agios, commissions et produits bancaires hors taxes.', 'Bank charges, commissions and income excluding tax.'),
    taux: [
      pct(t('Taux de droit commun', 'General rate'), TOB.commun),
      pct(
        t('Agios des crédits d’équipement et de logiciels des PME, et microassurance', 'Charges on SME equipment and software loans, and microinsurance'),
        TOB.reduitPme,
      ),
    ],
    exonerations: [
      t('Les prêts consentis par les institutions financières mutualistes ou coopératives.', 'Loans by mutual or cooperative financial institutions.'),
      t('Les prêts pour l’acquisition de logements économiques et sociaux.', 'Loans to buy low-cost and social housing.'),
    ],
    motsCles: ['banque', 'agios', 'crédit', 'commission', 'bank', 'loan charges'],
    calculateur: 'tva',
  },
  {
    id: 'tsu-produits-petroliers',
    groupe: 'ii-autres',
    titre: t('Taxe spécifique unique sur les produits pétroliers', 'Single specific tax on petroleum products'),
    sigles: ['TSU'],
    refs: 'Art. 403 à 408 du CGI',
    redevable: t('L’importateur ou le cédant de produits pétroliers.', 'The importer or seller of petroleum products.'),
    definition: t(
      'Taxe de consommation due sur toutes les importations et cessions de produits pétroliers, au litre ou au kilogramme.',
      'Consumption tax on all imports and sales of petroleum products, per litre or per kilogram.',
    ),
    assiette: t('Volume en litres à 15 °C ou poids en kilogrammes.', 'Volume in litres at 15°C or weight in kilograms.'),
    taux: [
      mnt(t('Super carburant et essences spéciales', 'Premium fuel and special petrols'), ACCISES.produitsPetroliers.superCarburant, t('par litre', 'per litre')),
      mnt(t('Essence auto', 'Motor petrol'), ACCISES.produitsPetroliers.essenceAuto, t('par litre', 'per litre')),
      mnt(t('Gasoil et huiles minérales', 'Diesel and mineral oils'), ACCISES.produitsPetroliers.gasoil, t('par litre', 'per litre')),
      mnt(t('Distillate Diesel-Oil (DDO)', 'Distillate Diesel-Oil (DDO)'), ACCISES.produitsPetroliers.ddo, t('par kilogramme', 'per kilogram')),
      mnt(t('Fuel-oil domestique, léger et lourd', 'Domestic, light and heavy fuel oil'), ACCISES.produitsPetroliers.fuelOilDomestique, t('par kilogramme', 'per kilogram')),
      mnt(t('Graisses consistantes', 'Greases'), ACCISES.produitsPetroliers.graissesConsistantes, t('par kilogramme', 'per kilogram')),
    ],
    exonerations: [
      t('Les produits ayant déjà supporté la taxe en Côte d’Ivoire.', 'Products that have already borne the tax in Côte d’Ivoire.'),
      t('Les carburants livrés aux ambassades étrangères, le carburéacteur et le pétrole lampant.', 'Fuel supplied to foreign embassies, jet fuel and kerosene.'),
    ],
    motsCles: ['carburant', 'essence', 'gasoil', 'pétrole', 'station', 'fuel', 'petrol', 'diesel'],
    calculateur: 'accises',
  },
  {
    id: 'taxe-eau',
    groupe: 'ii-autres',
    titre: t('Taxe spéciale sur la consommation d’eau', 'Special water consumption tax'),
    sigles: [],
    refs: 'Art. 412 du CGI',
    redevable: t('Le consommateur, via le distributeur d’eau.', 'The consumer, through the water utility.'),
    definition: t('Taxe spéciale assise sur le volume d’eau consommé, différenciée par tranche d’usage.', 'Special tax on the volume of water consumed, differentiated by usage band.'),
    assiette: t('Volume d’eau consommé.', 'Volume of water consumed.'),
    taux: [
      mnt(t('Tranche sociale', 'Social band'), ACCISES.eau.sociale, t('par m³', 'per m³')),
      mnt(t('Tranche domestique', 'Domestic band'), ACCISES.eau.domestique, t('par m³', 'per m³')),
      mnt(t('Tranche normale', 'Standard band'), ACCISES.eau.normale, t('par m³', 'per m³')),
      mnt(t('Tranche industrielle', 'Industrial band'), ACCISES.eau.industrielle, t('par m³', 'per m³')),
      mnt(t('Tranche administrative', 'Administrative band'), ACCISES.eau.administrative, t('par m³', 'per m³')),
    ],
    exonerations: [t('La tranche sociale.', 'The social band.')],
    motsCles: ['eau', 'consommation', 'facture', 'water', 'utility'],
    calculateur: 'accises',
  },
  {
    id: 'taxe-boissons',
    groupe: 'ii-autres',
    titre: t('Taxe spéciale sur les boissons', 'Special tax on drinks'),
    sigles: [],
    refs: 'Art. 418 du CGI',
    redevable: t('L’importateur ou le fabricant local.', 'The importer or the local producer.'),
    definition: t(
      'Droit d’accise assis, à l’importation, sur la valeur en douane augmentée des droits et taxes hors TVA, ou, en production locale, sur le prix sortie usine hors TVA.',
      'Excise duty based, on import, on the customs value plus duties and taxes excluding VAT, or, for local production, on the ex-works price excluding VAT.',
    ),
    assiette: t('Valeur en douane ou prix sortie usine, hors TVA.', 'Customs value or ex-works price, excluding VAT.'),
    taux: [
      pct(t('Champagnes, vins AC et assimilés, vins mousseux', 'Champagne, appellation and sparkling wines'), ACCISES.boissons.champagne),
      pct(t('Vins ordinaires', 'Ordinary wines'), ACCISES.boissons.vinsOrdinaires),
      pct(t('Bières et cidres', 'Beers and ciders'), ACCISES.boissons.bieresCidres),
      pct(t('Autres boissons alcoolisées titrant moins de 35°', 'Other alcoholic drinks below 35°'), ACCISES.boissons.alcoolMoins35),
      pct(t('Autres boissons alcoolisées titrant 35° et plus', 'Other alcoholic drinks at 35° and above'), ACCISES.boissons.alcool35EtPlus),
      pct(t('Boissons énergétiques', 'Energy drinks'), ACCISES.boissons.energisantes),
      pct(t('Autres boissons non alcoolisées', 'Other soft drinks'), ACCISES.boissons.nonAlcoolisees),
    ],
    exonerations: [t('Les produits médicamenteux alcoolisés et l’eau.', 'Alcohol-based medicinal products and water.')],
    motsCles: ['boisson', 'bière', 'vin', 'alcool', 'sucrerie', 'beer', 'wine', 'soft drink'],
    calculateur: 'accises',
  },
  {
    id: 'taxe-tabacs',
    groupe: 'ii-autres',
    titre: t('Taxe spéciale sur les tabacs', 'Special tobacco tax'),
    sigles: [],
    refs: 'Art. 418 du CGI',
    redevable: t('Le fabricant ou l’importateur.', 'The producer or importer.'),
    definition: t(
      'Droit d’accise sur les cigares, cigarettes, tabacs à fumer et succédanés, y compris la cigarette électronique et la chicha.',
      'Excise duty on cigars, cigarettes, smoking tobacco and substitutes, including e-cigarettes and shisha.',
    ),
    assiette: t(
      'Prix de vente hors taxes ; à l’importation, valeur en douane augmentée des droits et taxes hors TVA. Le prix de vente ne peut être inférieur à 20 000 F les 1 000 cigarettes.',
      'Price excluding tax; on import, customs value plus duties and taxes excluding VAT. The selling price cannot be below XOF 20,000 per 1,000 cigarettes.',
    ),
    taux: [
      pct(t('Taxe spéciale sur les tabacs', 'Special tobacco tax'), ACCISES.tabacs),
      pct(t('Taxe pour le développement du sport (Art. 1085)', 'Sport development tax (art. 1085)'), ACCISES.tabacSport),
      pct(t('Taxe de solidarité, SIDA et tabagisme (Art. 1133)', 'Solidarity, AIDS and tobacco tax (art. 1133)'), ACCISES.tabacSolidariteSida),
    ],
    formule: t(
      'Les trois taxes se cumulent sur la même base : 57 % + 7 % + 2 %, soit 66 % du prix de vente hors taxes.',
      'The three taxes are cumulative on the same base: 57% + 7% + 2%, i.e. 66% of the price excluding tax.',
    ),
    motsCles: ['tabac', 'cigarette', 'cigare', 'chicha', 'vapotage', 'tobacco', 'cigarette', 'shisha'],
    calculateur: 'accises',
  },
  {
    id: 'taxe-cartouches',
    groupe: 'ii-autres',
    titre: t('Taxe spéciale sur les cartouches', 'Special tax on cartridges'),
    sigles: [],
    refs: 'Art. 418 du CGI',
    redevable: t('L’importateur ou le fabricant.', 'The importer or producer.'),
    definition: t('Taxe spécifique assise sur le prix à l’importation ou le prix de revient sortie usine des cartouches.', 'Specific tax on the import price or ex-works cost of cartridges.'),
    assiette: t('Nombre de cartouches, douilles amorcées ou amorces.', 'Number of cartridges, primed cases or primers.'),
    taux: [mnt(t('Cartouche chargée, douille amorcée ou amorce', 'Loaded cartridge, primed case or primer'), ACCISES.cartouche, t('par unité', 'per unit'))],
    exonerations: [t('Les cartouches destinées aux forces militaires et de police.', 'Cartridges for the military and police forces.')],
    motsCles: ['cartouche', 'munition', 'chasse', 'cartridge', 'ammunition'],
    calculateur: 'accises',
  },
  {
    id: 'taxe-marbres-cosmetiques',
    groupe: 'ii-autres',
    titre: t('Taxe spéciale sur les marbres, véhicules de forte puissance, parfums et cosmétiques', 'Special tax on marble, high-powered vehicles, perfumes and cosmetics'),
    sigles: [],
    refs: 'Art. 418 du CGI',
    redevable: t('L’importateur.', 'The importer.'),
    definition: t(
      'Taxe spécifique sur les marbres, les véhicules de tourisme de 13 chevaux et plus, et les produits de parfumerie et cosmétiques.',
      'Specific tax on marble, passenger vehicles of 13 horsepower and above, and perfumery and cosmetic products.',
    ),
    assiette: t('Valeur en douane augmentée de tous les droits et taxes hormis la TVA.', 'Customs value plus all duties and taxes except VAT.'),
    taux: [
      pct(t('Taux de droit commun', 'General rate'), ACCISES.marbreVehiculesCosmetiques),
      pct(t('Produits de beauté et cosmétiques contenant de l’hydroquinone', 'Beauty and cosmetic products containing hydroquinone'), ACCISES.cosmetiquesHydroquinone),
    ],
    motsCles: ['marbre', 'cosmétique', 'parfum', 'véhicule', 'hydroquinone', 'cosmetics', 'perfume', 'vehicle'],
    calculateur: 'accises',
  },
  {
    id: 'taxe-publicite',
    groupe: 'ii-autres',
    titre: t('Taxe sur la publicité', 'Advertising tax'),
    sigles: [],
    refs: 'Art. 421 du CGI',
    redevable: t(
      'Les régisseurs de messages publicitaires ou, à défaut, les personnes qui en assurent la diffusion.',
      'Advertising sales houses or, failing that, those who broadcast the messages.',
    ),
    definition: t('Taxe indirecte sur les sommes versées pour la diffusion de messages publicitaires.', 'Indirect tax on amounts paid to broadcast advertising messages.'),
    assiette: t('Chiffre d’affaires hors taxes de la diffusion publicitaire.', 'Turnover excluding tax from advertising broadcasts.'),
    taux: [pct(t('Taux unique', 'Single rate'), PRELEVEMENTS.taxePublicite.taux)],
    exonerations: [
      t(
        'Les messages diffusés par les associations sportives reconnues par le ministère en charge des Sports.',
        'Messages broadcast by sports associations recognised by the ministry responsible for sport.',
      ),
    ],
    motsCles: ['publicité', 'affichage', 'média', 'advertising', 'media'],
    calculateur: 'prelevements',
  },
  {
    id: 'taxe-communication-audiovisuelle',
    groupe: 'ii-autres',
    titre: t('Taxe sur la communication audiovisuelle', 'Audiovisual communication tax'),
    sigles: [],
    refs: 'Art. 421 bis du CGI',
    redevable: t(
      'Les entreprises qui diffusent en Côte d’Ivoire la publicité de chaînes non-résidentes du même groupe.',
      'Businesses broadcasting in Côte d’Ivoire advertising from non-resident channels of the same group.',
    ),
    definition: t(
      'Taxe forfaitaire à l’heure de publicité diffusée par le canal de chaînes de télévision ou de radio d’entreprises non-résidentes.',
      'Flat tax per hour of advertising broadcast through television or radio channels of non-resident businesses.',
    ),
    assiette: t('Heure ou fraction d’heure de publicité diffusée.', 'Hour or part-hour of advertising broadcast.'),
    taux: [
      mnt(
        t('Publicité diffusée', 'Advertising broadcast'),
        PRELEVEMENTS.taxeCommunicationAudiovisuelle.montantParHeure,
        t('par heure ou fraction d’heure', 'per hour or part-hour'),
      ),
    ],
    motsCles: ['audiovisuel', 'télévision', 'radio', 'publicité', 'television', 'broadcast'],
  },
  {
    id: 'taxe-assurance',
    groupe: 'ii-autres',
    titre: t('Taxe sur les contrats d’assurance et de microassurance', 'Tax on insurance and microinsurance contracts'),
    sigles: [],
    refs: 'Art. 422 à 425 du CGI ; taux : Art. 423',
    redevable: t(
      'L’assuré, la taxe étant perçue par l’assureur sur la prime.',
      'The policyholder, the tax being collected by the insurer on the premium.',
    ),
    definition: t(
      'Taxe sur les primes stipulées dans les conventions d’assurance ou de rentes viagères conclues avec tout assureur, ivoirien ou étranger. Les contrats de microassurance relèvent de tarifs réduits.',
      'Tax on premiums under insurance or annuity contracts with any insurer, Ivorian or foreign. Microinsurance contracts attract reduced rates.',
    ),
    assiette: t('Montant de la prime d’assurance.', 'Amount of the insurance premium.'),
    taux: [
      pct(t('Incendie — assurance classique', 'Fire — conventional insurance'), ASSURANCE.classique.incendie),
      pct(t('Incendie — microassurance', 'Fire — microinsurance'), ASSURANCE.micro.incendie),
      pct(t('Risque automobile — les deux régimes', 'Motor risk — both regimes'), ASSURANCE.classique.automobile),
      pct(t('Maritime, fluviale et aérienne — classique', 'Marine, river and air — conventional'), ASSURANCE.classique.maritimeFluvialeAerienne),
      pct(t('Maladie individuelle — classique', 'Individual health — conventional'), ASSURANCE.classique.maladie),
      pct(t('Maladie de groupe — classique', 'Group health — conventional'), ASSURANCE.classique.maladieGroupe),
      pct(t('Contrat de rentes viagères — classique', 'Life annuity contract — conventional'), ASSURANCE.classique.rentesViageres),
      pct(t('Crédits à l’exportation — classique', 'Export credit — conventional'), ASSURANCE.classique.creditsExport),
      pct(t('Autres risques — classique', 'Other risks — conventional'), ASSURANCE.classique.autresRisques),
      pct(t('Autres risques — microassurance', 'Other risks — microinsurance'), ASSURANCE.micro.autresRisques),
    ],
    formule: t('Taxe = prime × taux du risque concerné.', 'Tax = premium × the rate for the risk concerned.'),
    exonerations: [
      t('Les conventions de réassurance.', 'Reinsurance agreements.'),
      t('L’assurance-vie et les actes contre les accidents du travail.', 'Life insurance and workplace-accident cover.'),
      t('Les contrats garantissant les risques agricoles.', 'Contracts covering agricultural risks.'),
    ],
    motsCles: ['assurance', 'prime', 'police', 'automobile', 'incendie', 'insurance', 'premium', 'motor'],
    calculateur: 'assurance',
  },
];

/* ================================================================== *
 * Titres III et IV — Enregistrement et timbre
 * ================================================================== */

const titreIII = [
  {
    id: 'actes-judiciaires',
    groupe: 'iii-actes',
    titre: t('Droit sur les actes des autorités judiciaires', 'Duty on deeds of the judicial authorities'),
    sigles: [],
    refs: 'Art. 546, 703 et 705 du CGI',
    redevable: t('La partie tenue de faire enregistrer l’acte.', 'The party required to register the deed.'),
    definition: t(
      'Droit perçu sur les actes des magistrats et juridictions, à enregistrer dans les six mois de leur date.',
      'Duty on deeds of judges and courts, to be registered within six months of their date.',
    ),
    assiette: t('Droit fixe par acte, sauf droit proportionnel ou progressif applicable.', 'Fixed duty per deed, unless a proportional or progressive duty applies.'),
    taux: [
      mnt(t('Jugements sur incidents, arrêts sur appel d’ordonnance, ordonnances de référé, jugements de 1re instance', 'Interlocutory judgments, appeal rulings on orders, interim orders, first-instance judgments'), DROITS_ACTES.jugementsDroitFixe),
      mnt(t('Jugements des tribunaux criminels et arrêts des cours d’appel à dispositions définitives', 'Criminal court judgments and appeal rulings with final provisions'), DROITS_ACTES.arretsCriminelsDroitFixe),
    ],
    exonerations: [
      t('Les actes relatifs à l’assistance judiciaire.', 'Deeds relating to legal aid.'),
      t('Les jugements en matière de simple police ou de police correctionnelle.', 'Judgments in petty or correctional police matters.'),
      t('Les actes de procédure devant le tribunal du travail.', 'Procedural documents before the labour court.'),
    ],
    motsCles: ['jugement', 'tribunal', 'justice', 'arrêt', 'judgment', 'court'],
  },
  {
    id: 'actes-notaires',
    groupe: 'iii-actes',
    titre: t('Droit sur les actes des notaires', 'Duty on notarial deeds'),
    sigles: [],
    refs: 'Art. 547, 548, 703 et 754 du CGI',
    redevable: t('Le client du notaire.', 'The notary’s client.'),
    definition: t(
      'Droit sur les actes publics rédigés par les notaires, à enregistrer dans le mois. Les testaments sont enregistrés dans les trois mois du décès.',
      'Duty on public deeds drawn up by notaries, to be registered within one month. Wills are registered within three months of the death.',
    ),
    assiette: t('Nature de l’acte pour le droit fixe ; valeur de l’opération pour le droit proportionnel.', 'Nature of the deed for the fixed duty; value of the transaction for the proportional duty.'),
    taux: [
      txt(
        t('Droit fixe', 'Fixed duty'),
        t(
          `De ${DROITS_ACTES.notairesFixeMin.toLocaleString('fr-FR')} à ${DROITS_ACTES.notairesFixeMax.toLocaleString('fr-FR')} F`,
          `XOF ${DROITS_ACTES.notairesFixeMin.toLocaleString('en-US')} to ${DROITS_ACTES.notairesFixeMax.toLocaleString('en-US')}`,
        ),
      ),
      txt(
        t('Droit proportionnel', 'Proportional duty'),
        t(
          `${(DROITS_ACTES.notairesProportionnelMin * 100).toLocaleString('fr-FR')} % à ${(DROITS_ACTES.notairesProportionnelMax * 100).toLocaleString('fr-FR')} %`,
          `${(DROITS_ACTES.notairesProportionnelMin * 100).toLocaleString('en-US')}% to ${(DROITS_ACTES.notairesProportionnelMax * 100).toLocaleString('en-US')}%`,
        ),
      ),
      pct(t('Formation de société — capital jusqu’à 5 milliards', 'Company incorporation — capital up to XOF 5 billion'), MUTATION.formationSocieteJusqua5Md),
      pct(t('Formation de société — capital supérieur à 5 milliards', 'Company incorporation — capital above XOF 5 billion'), MUTATION.formationSocieteAudela5Md),
    ],
    motsCles: ['notaire', 'acte', 'statuts', 'société', 'testament', 'notary', 'incorporation', 'will'],
    calculateur: 'enregistrement',
  },
  {
    id: 'actes-commissaires-justice',
    groupe: 'iii-actes',
    titre: t('Droit sur les actes des commissaires de justice', 'Duty on deeds of judicial officers'),
    sigles: [],
    refs: 'Art. 549 du CGI',
    redevable: t('La partie requérante.', 'The requesting party.'),
    definition: t(
      'Droit perçu sur les actes des commissaires de justice, à présenter dans les quinze jours de leur établissement.',
      'Duty on deeds of judicial officers, to be presented within fifteen days of being drawn up.',
    ),
    assiette: t('Nature de l’opération.', 'Nature of the transaction.'),
    taux: [mnt(t('Exploits d’huissier', 'Bailiff writs'), DROITS_ACTES.exploitsCommissaireJustice)],
    motsCles: ['huissier', 'exploit', 'commissaire de justice', 'signification', 'bailiff', 'writ'],
  },
  {
    id: 'actes-sous-seing-prive',
    groupe: 'iii-actes',
    titre: t('Droit sur les actes sous seing privé', 'Duty on private deeds'),
    sigles: ['SSP'],
    refs: 'Art. 550 et 703-20° du CGI',
    redevable: t('Les parties à l’acte.', 'The parties to the deed.'),
    definition: t(
      'Droit sur les actes établis par des particuliers sans officier public, à enregistrer dans le mois de leur signature.',
      'Duty on deeds made by private parties without a public officer, to be registered within one month of signature.',
    ),
    assiette: t('Nature de l’opération.', 'Nature of the transaction.'),
    taux: [mnt(t('Exemple de droit fixe', 'Example of a fixed duty'), DROITS_ACTES.actesSousSeingPrive)],
    exonerations: [
      t(
        'Le contrat de travail entre les chefs d’établissements industriels, commerciaux, agricoles ou forestiers et leurs ouvriers.',
        'Employment contracts between heads of industrial, commercial, farming or forestry establishments and their workers.',
      ),
    ],
    motsCles: ['sous seing privé', 'contrat', 'convention', 'private deed', 'contract'],
  },
  {
    id: 'vente-immeubles',
    groupe: 'iii-mutations',
    titre: t('Droit sur les ventes d’immeubles', 'Duty on property sales'),
    sigles: [],
    refs: 'Art. 760, 762, 763 et 764 du CGI',
    redevable: t('L’acquéreur de l’immeuble.', 'The purchaser of the property.'),
    definition: t(
      'Droit de mutation à titre onéreux dû sur le transfert de propriété d’un immeuble, également applicable à la dation en paiement, à la déclaration de command et aux promesses synallagmatiques de vente.',
      'Transfer duty on the sale of a property, also applying to payment in kind, declarations of the true purchaser and reciprocal sale undertakings.',
    ),
    assiette: t('Prix de vente ou valeur vénale de l’immeuble.', 'Sale price or market value of the property.'),
    taux: [
      pct(t('Tarif de droit commun', 'General rate'), MUTATION.venteImmeuble),
      pct(t('Immeubles situés à l’étranger', 'Property located abroad'), MUTATION.venteImmeubleEtranger),
      pct(t('Immeubles acquis par une association caritative d’utilité publique', 'Property acquired by a recognised charity'), MUTATION.venteImmeubleAssociationCaritative),
      pct(t('Immeubles acquis par un crédit-bailleur', 'Property acquired by a finance lessor'), MUTATION.venteImmeubleCreditBailleur),
      pct(t('Levée d’option par le preneur d’un crédit-bail', 'Exercise of the option by a finance lessee'), MUTATION.venteImmeubleLeveeOption),
      pct(t('Plus-values de cession réalisées par des personnes non passibles de l’impôt sur les bénéfices', 'Disposal gains realised by persons not liable to profits tax'), MUTATION.plusValueCessionImmeuble),
    ],
    formule: t('Droit = prix ou valeur vénale × 4 %.', 'Duty = price or market value × 4%.'),
    exonerations: [
      t(
        'L’acquisition d’immeuble par un établissement bancaire au terme d’une adjudication infructueuse qu’il a engagée, sous condition de revente dans le délai réglementaire.',
        'Acquisition of property by a bank following an unsuccessful auction it initiated, provided it is resold within the regulatory period.',
      ),
    ],
    motsCles: ['vente', 'immeuble', 'achat', 'terrain', 'maison', 'mutation', 'sale', 'property', 'purchase'],
    calculateur: 'enregistrement',
  },
  {
    id: 'vente-meubles',
    groupe: 'iii-mutations',
    titre: t('Droit sur les ventes de meubles et de fonds de commerce', 'Duty on sales of movables and businesses'),
    sigles: [],
    refs: 'Art. 721 et 765 du CGI',
    redevable: t('L’acquéreur.', 'The purchaser.'),
    definition: t(
      'Droit applicable aux meubles par nature et aux biens incorporels, dont les fonds de commerce et les droits sociaux.',
      'Duty on movables by nature and on intangible assets, including businesses and corporate rights.',
    ),
    assiette: t('Prix de vente ou valeur des biens cédés.', 'Sale price or value of the assets transferred.'),
    taux: [
      mnt(t('Tarif général sur les ventes de meubles', 'General rate on sales of movables'), MUTATION.venteMeublesTarifGeneral),
      pct(t('Vente de fonds de commerce', 'Sale of a business'), MUTATION.venteFondsDeCommerce),
      pct(t('Vente de droits sociaux', 'Sale of corporate rights'), MUTATION.venteDroitsSociaux),
    ],
    motsCles: ['fonds de commerce', 'parts sociales', 'cession', 'meuble', 'business', 'shares', 'movables'],
    calculateur: 'enregistrement',
  },
  {
    id: 'echange',
    groupe: 'iii-mutations',
    titre: t('Droit d’échange d’immeuble', 'Property exchange duty'),
    sigles: [],
    refs: 'Art. 669 et 720 du CGI',
    redevable: t('Les coéchangistes.', 'The parties to the exchange.'),
    definition: t(
      'Droit perçu lorsque deux ou plusieurs personnes se transfèrent respectivement un bien contre un autre.',
      'Duty levied where two or more parties transfer one asset for another.',
    ),
    assiette: t('Valeur des biens échangés.', 'Value of the assets exchanged.'),
    taux: [
      pct(t('Échange sans retour', 'Exchange without a balancing payment'), MUTATION.echangeSansRetour),
      pct(t('Échange avec retour', 'Exchange with a balancing payment'), MUTATION.echangeAvecRetour),
    ],
    exonerations: [
      t(
        'Les acquisitions et échanges faits par les collectivités publiques, enregistrés gratis.',
        'Acquisitions and exchanges by public authorities, registered free of charge.',
      ),
    ],
    motsCles: ['échange', 'soulte', 'immeuble', 'exchange', 'swap'],
    calculateur: 'enregistrement',
  },
  {
    id: 'bail',
    groupe: 'iii-mutations',
    titre: t('Droit de bail', 'Lease duty'),
    sigles: [],
    refs: 'Art. 539, 713 et 715 du CGI',
    redevable: t('Les parties au bail.', 'The parties to the lease.'),
    definition: t(
      'Droit perçu à l’occasion des mutations de jouissance temporaire d’un bien, selon que le bail est à durée limitée ou illimitée.',
      'Duty on the temporary transfer of the use of an asset, depending on whether the lease is for a fixed or unlimited term.',
    ),
    assiette: t('Montant des loyers.', 'Amount of the rent.'),
    taux: [
      pct(t('Bail à durée limitée — immeubles, fonds de commerce, propriété intellectuelle', 'Fixed-term lease — property, businesses, intellectual property'), MUTATION.bailLimiteImmeuble),
      pct(t('Loyers versés dans le cadre d’un contrat de crédit-bail', 'Rentals under a finance-lease contract'), MUTATION.bailCreditBail),
      mnt(t('Bail à durée limitée — meubles', 'Fixed-term lease — movables'), MUTATION.bailLimiteMeubles),
      pct(t('Bail à durée illimitée ou à vie — immeubles et fonds de commerce', 'Unlimited or life lease — property and businesses'), MUTATION.bailIllimiteImmeuble),
      mnt(t('Bail à durée illimitée ou à vie — meubles', 'Unlimited or life lease — movables'), MUTATION.bailIllimiteMeubles),
    ],
    motsCles: ['bail', 'loyer', 'location', 'crédit-bail', 'lease', 'rent', 'leasing'],
    calculateur: 'enregistrement',
  },
  {
    id: 'succession',
    groupe: 'iii-mutations',
    titre: t('Droits de succession', 'Inheritance duties'),
    sigles: [],
    refs: 'Art. 527, 554, 654 et 735 du CGI',
    redevable: t('Les bénéficiaires de la succession.', 'The beneficiaries of the estate.'),
    definition: t(
      'Droits de mutation à titre gratuit dus par les héritiers au service de l’Enregistrement.',
      'Gratuitous transfer duties payable by heirs to the Registration office.',
    ),
    assiette: t('Actif brut successoral recueilli.', 'Gross estate received.'),
    taux: [
      txt(
        t('Mutations entre vifs et par décès', 'Transfers inter vivos and on death'),
        t(
          `${(MUTATION.successionMin * 100).toLocaleString('fr-FR')} % à ${(MUTATION.successionMax * 100).toLocaleString('fr-FR')} % selon le lien de parenté`,
          `${(MUTATION.successionMin * 100).toLocaleString('en-US')}% to ${(MUTATION.successionMax * 100).toLocaleString('en-US')}% depending on kinship`,
        ),
      ),
      mnt(t('Seuil d’exonération de l’actif brut', 'Gross estate exemption threshold'), MUTATION.successionSeuilExoneration),
    ],
    exonerations: [
      t('Les successions comportant un actif brut inférieur à 300 000 F.', 'Estates with a gross value below XOF 300,000.'),
    ],
    motsCles: ['succession', 'héritage', 'décès', 'héritier', 'inheritance', 'estate', 'heir'],
    calculateur: 'enregistrement',
  },
  {
    id: 'donation',
    groupe: 'iii-mutations',
    titre: t('Droits de donation', 'Gift duties'),
    sigles: [],
    refs: 'Art. 554, 611 et 743 du CGI',
    redevable: t('Le donataire.', 'The recipient of the gift.'),
    definition: t('Droit dû sur le transfert de propriété sans contrepartie monétaire, soumis à la formalité de l’enregistrement.', 'Duty on a transfer of ownership without monetary consideration, subject to registration.'),
    assiette: t('Valeur du bien donné.', 'Value of the asset given.'),
    taux: [
      pct(t('Dons et legs aux sociétés de secours mutuel et aux sociétés reconnues d’utilité publique', 'Gifts and bequests to mutual aid societies and recognised public-interest bodies'), MUTATION.donationUtilitePublique),
    ],
    exonerations: [
      t(
        'Les collectivités publiques, les établissements publics hospitaliers et les bureaux de bienfaisance.',
        'Public authorities, public hospitals and charitable offices.',
      ),
    ],
    motsCles: ['donation', 'don', 'legs', 'gift', 'bequest'],
    calculateur: 'enregistrement',
  },
  {
    id: 'partage',
    groupe: 'iii-mutations',
    titre: t('Droit de partage', 'Partition duty'),
    sigles: [],
    refs: 'Art. 670 du CGI',
    redevable: t('Les copartageants.', 'The parties to the partition.'),
    definition: t(
      'Droit dû lorsque des personnes possédant des biens en indivision y mettent fin et se les répartissent.',
      'Duty payable where co-owners end an undivided ownership and share out the assets.',
    ),
    assiette: t('Valeur des biens partagés.', 'Value of the assets partitioned.'),
    taux: [pct(t('Partage pur et simple', 'Straightforward partition'), MUTATION.partage)],
    formule: t(
      'Droit = valeur du bien × 1 %. La soulte ou la plus-value est en outre soumise aux droits correspondant à la nature du bien concerné.',
      'Duty = value of the asset × 1%. Any balancing payment or excess is additionally liable to the duties for that type of asset.',
    ),
    motsCles: ['partage', 'indivision', 'soulte', 'partition', 'co-ownership'],
    calculateur: 'enregistrement',
  },
];

const titreIV = [
  {
    id: 'vignettes',
    groupe: 'iv-timbre',
    titre: t('Vignettes automobiles et nautiques', 'Vehicle and watercraft vignettes'),
    sigles: [],
    refs: 'Art. 910 à 940 et 961 du CGI',
    redevable: t('Le propriétaire du véhicule.', 'The owner of the vehicle.'),
    definition: t(
      'Taxe annuelle sur les véhicules à moteur et les véhicules nautiques à moteur de plaisance, dont le tarif varie selon la puissance et l’âge du véhicule.',
      'Annual tax on motor vehicles and motorised pleasure craft, at a rate that varies with engine power and vehicle age.',
    ),
    assiette: t('Puissance et âge du véhicule.', 'Engine power and age of the vehicle.'),
    taux: [
      txt(
        t('Véhicules à deux roues', 'Two-wheeled vehicles'),
        t(
          `De ${VIGNETTES.deuxRouesMin.toLocaleString('fr-FR')} à ${VIGNETTES.deuxRouesMax.toLocaleString('fr-FR')} F`,
          `XOF ${VIGNETTES.deuxRouesMin.toLocaleString('en-US')} to ${VIGNETTES.deuxRouesMax.toLocaleString('en-US')}`,
        ),
      ),
      txt(
        t('Véhicules de plus de deux roues', 'Vehicles with more than two wheels'),
        t(
          `De ${VIGNETTES.plusDeDeuxRouesMin.toLocaleString('fr-FR')} à ${VIGNETTES.plusDeDeuxRouesMax.toLocaleString('fr-FR')} F`,
          `XOF ${VIGNETTES.plusDeDeuxRouesMin.toLocaleString('en-US')} to ${VIGNETTES.plusDeDeuxRouesMax.toLocaleString('en-US')}`,
        ),
      ),
      txt(
        t('Véhicules nautiques à moteur', 'Motorised watercraft'),
        t(
          `De ${VIGNETTES.nautiquesMin.toLocaleString('fr-FR')} à ${VIGNETTES.nautiquesMax.toLocaleString('fr-FR')} F`,
          `XOF ${VIGNETTES.nautiquesMin.toLocaleString('en-US')} to ${VIGNETTES.nautiquesMax.toLocaleString('en-US')}`,
        ),
      ),
      txt(
        t('Véhicules administratifs', 'Government vehicles'),
        t(
          `${VIGNETTES.administratifsMin.toLocaleString('fr-FR')} ou ${VIGNETTES.administratifsMax.toLocaleString('fr-FR')} F`,
          `XOF ${VIGNETTES.administratifsMin.toLocaleString('en-US')} or ${VIGNETTES.administratifsMax.toLocaleString('en-US')}`,
        ),
      ),
    ],
    exonerations: [
      t('Les véhicules diplomatiques.', 'Diplomatic vehicles.'),
      t('Les véhicules nautiques à moteur utilisés à titre exclusivement professionnel.', 'Motorised watercraft used exclusively for business.'),
      t('Les véhicules destinés à la vente et détenus par les marchands, et les véhicules non utilisés.', 'Vehicles held for sale by dealers, and vehicles not in use.'),
    ],
    motsCles: ['vignette', 'voiture', 'véhicule', 'moto', 'bateau', 'vignette', 'car', 'motorcycle', 'boat'],
  },
  {
    id: 'timbres',
    groupe: 'iv-timbre',
    titre: t('Droits de timbre', 'Stamp duties'),
    sigles: [],
    refs: 'Art. 805, 835, 852, 853 et 873 du CGI',
    redevable: t('Le rédacteur ou le détenteur du document.', 'The drafter or holder of the document.'),
    definition: t(
      'Droits perçus sur les documents destinés aux actes civils et judiciaires et sur les écritures produites en justice : timbre de dimension, timbre proportionnel et timbre de quittance.',
      'Duties on documents used in civil and judicial deeds and on writings produced in court: dimension stamp, proportional stamp and receipt stamp.',
    ),
    assiette: t('Format du document, valeur de l’acte ou montant de la quittance.', 'Document size, value of the deed or amount of the receipt.'),
    taux: [
      txt(
        t('Timbre de dimension', 'Dimension stamp'),
        t(
          `De ${TIMBRE.dimensionMin.toLocaleString('fr-FR')} à ${TIMBRE.dimensionMax.toLocaleString('fr-FR')} F selon le format`,
          `XOF ${TIMBRE.dimensionMin.toLocaleString('en-US')} to ${TIMBRE.dimensionMax.toLocaleString('en-US')} depending on format`,
        ),
      ),
      pct(t('Timbre proportionnel (Art. 852)', 'Proportional stamp (art. 852)'), TIMBRE.proportionnelHaut),
      pct(t('Timbre proportionnel (Art. 853)', 'Proportional stamp (art. 853)'), TIMBRE.proportionnelBas),
      ...TIMBRE_QUITTANCE.map((tranche, index, tableau) => {
        const plancher = index === 0 ? 0 : tableau[index - 1].plafond + 1;
        const libelleFr =
          tranche.plafond === Infinity
            ? `Quittance au-delà de ${(tableau[index - 1].plafond).toLocaleString('fr-FR')} F`
            : `Quittance de ${plancher.toLocaleString('fr-FR')} à ${tranche.plafond.toLocaleString('fr-FR')} F`;
        const libelleEn =
          tranche.plafond === Infinity
            ? `Receipt above XOF ${(tableau[index - 1].plafond).toLocaleString('en-US')}`
            : `Receipt of XOF ${plancher.toLocaleString('en-US')} to ${tranche.plafond.toLocaleString('en-US')}`;
        return mnt(t(libelleFr, libelleEn), tranche.droit);
      }),
    ],
    formule: t(
      'Le timbre de quittance se lit dans le barème par tranche du montant quittancé ; les quittances jusqu’à 5 000 F sont exonérées.',
      'The receipt stamp is read from the band schedule for the amount receipted; receipts up to XOF 5,000 are exempt.',
    ),
    motsCles: ['timbre', 'quittance', 'reçu', 'document', 'stamp', 'receipt'],
    calculateur: 'timbre',
  },
];

/* ================================================================== *
 * Titre V — Contributions diverses
 * ================================================================== */

/** Fiche courte : un seul taux ou tarif, sans exonération publiée. */
const simple = ({ id, titre, refs, redevable, definition, assiette, taux, motsCles, sigles = [], calculateur, groupe = 'v-taxes' }) => ({
  id,
  groupe,
  titre,
  sigles,
  refs,
  redevable,
  definition,
  assiette,
  taux,
  motsCles,
  ...(calculateur ? { calculateur } : {}),
});

const titreV = [
  simple({
    id: 'taxe-habitation',
    titre: t('Taxe d’habitation', 'Housing tax'),
    refs: 'Art. 305 du CGI',
    redevable: t(
      'Les occupants d’immeubles d’habitation ou professionnels, propriétaires comme locataires. La taxe est due même en cas de vacance.',
      'Occupiers of residential or business premises, whether owners or tenants. The tax is due even when the property is vacant.',
    ),
    definition: t(
      'Taxe annuelle forfaitaire instituée par l’annexe fiscale 2004 mais jamais mise en œuvre depuis son institution.',
      'Flat annual tax introduced by the 2004 Finance Annex but never implemented since.',
    ),
    assiette: t('Tarif forfaitaire par occupant.', 'Flat rate per occupier.'),
    taux: [mnt(t('Montant annuel', 'Annual amount'), TAXE_HABITATION.montantAnnuel, t('par an', 'per year'))],
    motsCles: ['habitation', 'occupant', 'locataire', 'housing tax', 'tenant'],
  }),
  simple({
    id: 'taxe-speciale-equipement',
    titre: t('Taxe spéciale d’équipement', 'Special equipment tax'),
    refs: 'Art. 1084 du CGI',
    redevable: t('Les entreprises soumises à un régime réel d’imposition.', 'Businesses under an actual-profit regime.'),
    definition: t('Taxe assise sur le chiffre d’affaires des entreprises aux régimes réels.', 'Tax on the turnover of businesses under actual-profit regimes.'),
    assiette: t('Chiffre d’affaires hors taxes.', 'Turnover excluding tax.'),
    taux: [pct(t('Taux unique', 'Single rate'), PRELEVEMENTS.taxeSpecialeEquipement.taux)],
    motsCles: ['équipement', 'chiffre d’affaires', 'equipment', 'turnover'],
    calculateur: 'prelevements',
  }),
  simple({
    id: 'taxe-tabac-sport',
    titre: t('Taxe spéciale sur le tabac pour le développement du sport', 'Special tobacco tax for sport development'),
    refs: 'Art. 1085 du CGI',
    redevable: t('Les entreprises de fabrication, de vente et d’importation de tabacs.', 'Businesses producing, selling or importing tobacco.'),
    definition: t('Taxe additionnelle sur les produits du tabac, affectée au développement du sport.', 'Additional tax on tobacco products, earmarked for sport development.'),
    assiette: t('Prix de vente hors taxes des produits du tabac.', 'Price excluding tax of tobacco products.'),
    taux: [pct(t('Taux unique', 'Single rate'), ACCISES.tabacSport)],
    motsCles: ['tabac', 'sport', 'tobacco', 'sport'],
    calculateur: 'accises',
  }),
  simple({
    id: 'taxe-solidarite-sida',
    titre: t('Taxe de solidarité, de lutte contre le SIDA et le tabagisme', 'Solidarity, AIDS and anti-smoking tax'),
    refs: 'Art. 1133 du CGI',
    redevable: t('Les fabricants et importateurs de tabacs.', 'Tobacco producers and importers.'),
    definition: t('Taxe instituée au profit du Fonds national de lutte contre le SIDA.', 'Tax levied for the national AIDS fund.'),
    assiette: t('Prix de vente sortie usine des produits du tabac.', 'Ex-works selling price of tobacco products.'),
    taux: [pct(t('Taux unique', 'Single rate'), ACCISES.tabacSolidariteSida)],
    motsCles: ['SIDA', 'solidarité', 'tabac', 'AIDS', 'solidarity'],
    calculateur: 'accises',
  }),
  simple({
    id: 'taxe-routiere',
    titre: t('Taxe routière', 'Road toll'),
    refs: 'Art. 1086 du CGI',
    redevable: t('Les usagers des voies soumises au péage.', 'Users of the tolled roads.'),
    definition: t('Droit de péage sur certaines voies routières.', 'Toll levied on certain roads.'),
    assiette: t('Usage de la voie concernée.', 'Use of the road concerned.'),
    taux: [txt(t('Tarif', 'Rate'), t('Fixé par décret', 'Set by decree'))],
    motsCles: ['péage', 'route', 'toll', 'road'],
  }),
  simple({
    id: 'redevance-armes',
    titre: t('Redevance sur les armes à feu et à air comprimé', 'Fee on firearms and air weapons'),
    refs: 'Art. 1087 à 1096 du CGI',
    redevable: t('Tout détenteur d’une arme à feu ou à air comprimé.', 'Any holder of a firearm or air weapon.'),
    definition: t('Redevance annuelle due à raison de la détention d’une arme.', 'Annual fee for holding a weapon.'),
    assiette: t('Type d’arme détenue.', 'Type of weapon held.'),
    taux: [
      mnt(t('Arme de chasse rayée', 'Rifled hunting weapon'), ARMES.chasseRayee),
      mnt(t('Arme de chasse perfectionnée non rayée', 'Advanced smooth-bore hunting weapon'), ARMES.chassePerfectionneeNonRayee),
      mnt(t('Arme de traite', 'Trade weapon'), ARMES.traite),
      mnt(t('Arme de salon', 'Parlour weapon'), ARMES.salon),
      mnt(t('Revolver ou pistolet', 'Revolver or pistol'), ARMES.revolverPistolet),
    ],
    motsCles: ['arme', 'fusil', 'chasse', 'pistolet', 'weapon', 'gun', 'hunting'],
  }),
  simple({
    id: 'taxes-forestieres',
    titre: t('Taxes forestières', 'Forestry taxes'),
    refs: 'Art. 1097, 1097 ter et 1134 du CGI',
    redevable: t('Les exploitants du domaine forestier.', 'Operators of forest concessions.'),
    definition: t(
      'Ensemble de taxes dues au titre du revenu d’exploitation du domaine forestier et des livraisons de bois en grumes.',
      'A set of taxes on income from forest operations and on deliveries of round logs.',
    ),
    assiette: t('Superficie exploitée ou valeur des livraisons de bois.', 'Area under operation or value of timber deliveries.'),
    taux: [
      mnt(t('Taxe de superficie', 'Area tax'), FORESTIERES.superficie, t('par hectare et par an', 'per hectare per year')),
      mnt(t('Taxe d’attribution du périmètre d’exploitation', 'Concession award tax'), FORESTIERES.attributionPerimetre, t('par hectare', 'per hectare')),
      mnt(t('Taxe de renouvellement', 'Renewal tax'), FORESTIERES.renouvellement, t('par hectare', 'per hectare')),
      mnt(t('Taxe d’intérêt général', 'General interest tax'), FORESTIERES.interetGeneral, t('par hectare', 'per hectare')),
      pct(t('Taxe sur les ventes de bois en grumes', 'Tax on sales of round logs'), FORESTIERES.ventesBoisGrumes),
      pct(t('Taxe de reboisement, sur la valeur mercuriale des grumes exportées', 'Reforestation tax, on the reference value of exported logs'), FORESTIERES.reboisement),
      pct(t('Taxe spéciale pour la préservation et le développement forestier (Art. 1134)', 'Special forest preservation and development tax (art. 1134)'), FORESTIERES.preservationDeveloppement),
    ],
    motsCles: ['forêt', 'bois', 'grume', 'reboisement', 'forest', 'timber', 'logging'],
  }),
  simple({
    id: 'taxe-transports-prives',
    titre: t('Taxe spéciale sur les transports privés de marchandises', 'Special tax on private goods transport'),
    refs: 'Art. 1117 du CGI',
    redevable: t(
      'Toute personne effectuant pour son propre compte le transport de marchandises.',
      'Anyone transporting goods on their own account.',
    ),
    definition: t(
      'Taxe assise et perçue dans les mêmes conditions que la contribution des patentes, due par véhicule.',
      'Tax assessed and collected like the business licence tax, due per vehicle.',
    ),
    assiette: t('Charge utile du véhicule.', 'Payload of the vehicle.'),
    taux: [
      mnt(t('Véhicule dont la charge utile n’excède pas 3 tonnes', 'Vehicle with a payload of up to 3 tonnes'), PRELEVEMENTS.taxeTransportPriveMarchandises.base),
      mnt(
        t('Majoration par tonne ou fraction de tonne au-delà de 3 tonnes', 'Surcharge per tonne or part-tonne above 3 tonnes'),
        PRELEVEMENTS.taxeTransportPriveMarchandises.majorationParTonne,
      ),
    ],
    motsCles: ['transport', 'camion', 'marchandises', 'tonnage', 'truck', 'freight'],
    calculateur: 'prelevements',
  }),
  simple({
    id: 'redevance-evaluation-immobiliere',
    titre: t('Redevance d’évaluation immobilière', 'Property valuation fee'),
    refs: 'Art. 1125 du CGI',
    redevable: t(
      'Les personnes sollicitant l’expertise immobilière de la Direction générale des Impôts.',
      'Those requesting a property valuation from the Directorate General of Taxes.',
    ),
    definition: t('Redevance assise sur la valeur du patrimoine immobilier expertisé.', 'Fee based on the value of the property valued.'),
    assiette: t('Montant de l’évaluation.', 'Amount of the valuation.'),
    taux: [
      pct(t('Taux', 'Rate'), PRELEVEMENTS.redevanceEvaluationImmobiliere.taux),
      mnt(t('Minimum de perception', 'Collection floor'), PRELEVEMENTS.redevanceEvaluationImmobiliere.minimum),
    ],
    motsCles: ['évaluation', 'expertise', 'immobilier', 'valuation', 'appraisal'],
    calculateur: 'prelevements',
  }),
  simple({
    id: 'taxe-nt-rurales',
    titre: t('Taxe pour le développement des nouvelles technologies en zones rurales', 'Rural new-technologies development tax'),
    refs: 'Art. 1127 du CGI',
    redevable: t(
      'Les sociétés de téléphonie et les entreprises de transfert d’argent par téléphone mobile.',
      'Telephone operators and mobile money transfer businesses.',
    ),
    definition: t('Taxe parafiscale destinée au développement des nouvelles technologies en zones rurales.', 'Parafiscal levy funding new technologies in rural areas.'),
    assiette: t('Chiffre d’affaires mensuel hors taxes.', 'Monthly turnover excluding tax.'),
    taux: [pct(t('Taux unique', 'Single rate'), PRELEVEMENTS.taxeNouvellesTechnologiesRurales.taux)],
    motsCles: ['téléphonie', 'rural', 'mobile money', 'telecom', 'rural'],
    calculateur: 'prelevements',
  }),
  simple({
    id: 'prelevement-culture',
    titre: t('Prélèvement au profit de la promotion de la culture', 'Levy for the promotion of culture'),
    refs: 'Art. 1129 du CGI',
    redevable: t('Les sociétés de téléphonie.', 'Telephone operators.'),
    definition: t('Taxe parafiscale destinée à soutenir la création culturelle et artistique.', 'Parafiscal levy supporting cultural and artistic creation.'),
    assiette: t('Chiffre d’affaires mensuel.', 'Monthly turnover.'),
    taux: [pct(t('Taux unique', 'Single rate'), PRELEVEMENTS.prelevementCulture.taux)],
    motsCles: ['culture', 'téléphonie', 'artiste', 'culture', 'telecom'],
    calculateur: 'prelevements',
  }),
  simple({
    id: 'taxe-telecoms',
    titre: t('Taxe sur les entreprises de télécommunications, des TIC et de transfert d’argent', 'Tax on telecommunications, ICT and money-transfer businesses'),
    refs: 'Art. 1130 du CGI',
    redevable: t(
      'Les entreprises du secteur des télécommunications et des TIC installées en Côte d’Ivoire et les entreprises de transfert d’argent par téléphone mobile.',
      'Telecommunications and ICT businesses established in Côte d’Ivoire and mobile money transfer businesses.',
    ),
    definition: t('Taxe sectorielle assise sur le chiffre d’affaires mensuel.', 'Sector tax on monthly turnover.'),
    assiette: t('Chiffre d’affaires mensuel hors taxes.', 'Monthly turnover excluding tax.'),
    taux: [pct(t('Taux unique', 'Single rate'), PRELEVEMENTS.taxeTelecoms.taux)],
    motsCles: ['télécom', 'TIC', 'transfert d’argent', 'mobile money', 'telecom', 'ICT'],
    calculateur: 'prelevements',
  }),
  simple({
    id: 'taxe-ferraille',
    titre: t('Taxe sur l’exportation de la ferraille et des sous-produits ferreux', 'Tax on exports of scrap and ferrous by-products'),
    refs: 'Art. 1136 du CGI',
    redevable: t('Les exportateurs de ferrailles et de sous-produits ferreux.', 'Exporters of scrap and ferrous by-products.'),
    definition: t('Taxe spécifique au tonnage exporté.', 'Specific tax per tonne exported.'),
    assiette: t('Tonnage exporté.', 'Tonnage exported.'),
    taux: [mnt(t('Ferraille ou sous-produits ferreux exportés', 'Scrap or ferrous by-products exported'), SECTORIELLES.ferrailleExport.montantParTonne, t('par tonne', 'per tonne'))],
    motsCles: ['ferraille', 'export', 'métal', 'scrap', 'export'],
  }),
  {
    id: 'taxe-environnement',
    groupe: 'v-taxes',
    titre: t('Taxe pour la protection de l’environnement', 'Environmental protection tax'),
    sigles: [],
    refs: 'Art. 1137 du CGI',
    redevable: t(
      'Les importateurs de véhicules d’occasion, les producteurs de cigarettes et les émetteurs de substances chimiques polluantes.',
      'Importers of used vehicles, cigarette producers and emitters of polluting chemicals.',
    ),
    definition: t(
      'Ensemble de taxes de salubrité et de protection de l’environnement portant sur les véhicules d’occasion de plus de cinq ans, les mégots de cigarettes et les activités polluantes.',
      'A set of sanitation and environmental protection taxes on used vehicles over five years old, cigarette butts and polluting activities.',
    ),
    assiette: t('Véhicule importé, tranche de tiges de cigarettes ou teneur en substance polluante.', 'Imported vehicle, band of cigarette sticks, or pollutant content.'),
    taux: [
      mnt(t('Véhicule de transport de personnes de 5 à 10 ans', 'Passenger vehicle aged 5 to 10 years'), ENVIRONNEMENT.vehiculePersonnes5A10Ans, t('par véhicule', 'per vehicle')),
      mnt(t('Véhicule de marchandises jusqu’à 10 tonnes, de 5 à 10 ans', 'Goods vehicle up to 10 tonnes, aged 5 to 10 years'), ENVIRONNEMENT.vehiculeMarchandisesJusqua10T, t('par véhicule', 'per vehicle')),
      mnt(t('Véhicule de marchandises de plus de 10 tonnes', 'Goods vehicle above 10 tonnes'), ENVIRONNEMENT.vehiculeMarchandisesPlus10T, t('par véhicule', 'per vehicle')),
      mnt(t('Mégots de cigarette', 'Cigarette butts'), ENVIRONNEMENT.megotsParTranche, t('par tranche de tiges', 'per band of sticks')),
      mnt(t('Oxyde de soufre et autres composés soufrés', 'Sulphur oxide and other sulphur compounds'), ENVIRONNEMENT.oxydeSoufre),
      mnt(t('Acide chlorhydrique et protoxyde d’azote', 'Hydrochloric acid and nitrous oxide'), ENVIRONNEMENT.acideChlorhydriqueProtoxydeAzote),
      mnt(t('Oxyde d’azote et composés oxygénés de l’azote', 'Nitrogen oxide and oxygenated nitrogen compounds'), ENVIRONNEMENT.oxydeAzote),
      mnt(t('Hydrocarbures non méthaniques, solvants et composés organiques', 'Non-methane hydrocarbons, solvents and organic compounds'), ENVIRONNEMENT.hydrocarburesNonMethaniques),
    ],
    exonerations: [t('Les véhicules d’occasion de moins de cinq ans.', 'Used vehicles less than five years old.')],
    motsCles: ['environnement', 'pollution', 'véhicule occasion', 'mégot', 'environment', 'used vehicle'],
  },
  simple({
    id: 'taxe-emballages',
    titre: t('Taxe spéciale sur les emballages plastique, métal, verre et carton', 'Special tax on plastic, metal, glass and cardboard packaging'),
    refs: 'Art. 1138 du CGI',
    redevable: t('Les entreprises productrices et importatrices d’emballages.', 'Businesses producing or importing packaging.'),
    definition: t('Taxe spécifique au poids d’emballage mis sur le marché.', 'Specific tax on the weight of packaging placed on the market.'),
    assiette: t('Poids d’emballage en kilogrammes.', 'Weight of packaging in kilograms.'),
    taux: [mnt(t('Emballage plastique, métal, verre ou carton', 'Plastic, metal, glass or cardboard packaging'), SECTORIELLES.emballages.montantParKg, t('par kilogramme', 'per kilogram'))],
    motsCles: ['emballage', 'plastique', 'carton', 'packaging', 'plastic'],
  }),
  {
    id: 'taxe-tourisme',
    groupe: 'v-taxes',
    titre: t('Taxe pour le développement touristique', 'Tourism development tax'),
    sigles: [],
    refs: 'Art. 1140 du CGI',
    redevable: t(
      'Les hôtels, restaurants, maquis, bars, night-clubs, agences de voyages, loueurs de véhicules, marinas, casinos et salles de jeux relevant du RME ou d’un régime réel.',
      'Hotels, restaurants, bars, night clubs, travel agencies, vehicle rental firms, marinas, casinos and gaming halls under the micro-enterprise or an actual-profit regime.',
    ),
    definition: t('Taxe facturée au client par les établissements touristiques.', 'Tax charged to the customer by tourism establishments.'),
    assiette: t('Montant hors taxes de la facture adressée au client.', 'Amount excluding tax of the invoice issued to the customer.'),
    taux: [pct(t('Taux unique', 'Single rate'), SECTORIELLES.tourisme.taux)],
    exonerations: [t('Les entreprises relevant de la taxe d’Etat de l’entreprenant.', 'Businesses under the State entrepreneur tax.')],
    motsCles: ['tourisme', 'hôtel', 'restaurant', 'maquis', 'casino', 'tourism', 'hotel', 'restaurant'],
  },
  simple({
    id: 'taxe-communications-telephoniques',
    titre: t('Taxe spécifique sur les communications téléphoniques et les TIC', 'Specific tax on telephone communications and ICT'),
    refs: 'Art. 1141 du CGI',
    redevable: t(
      'L’émetteur de l’appel ou le client du fournisseur d’accès internet ; la taxe est collectée par l’opérateur.',
      'The caller or the internet service customer; the tax is collected by the operator.',
    ),
    definition: t('Taxe sur le prix des communications téléphoniques et des accès internet.', 'Tax on the price of telephone calls and internet access.'),
    assiette: t('Prix hors taxe de la communication.', 'Price of the communication excluding tax.'),
    taux: [pct(t('Taux unique', 'Single rate'), SECTORIELLES.communicationsTelephoniques.taux)],
    motsCles: ['communication', 'téléphone', 'internet', 'appel', 'phone', 'internet', 'call'],
  }),
  {
    id: 'taxe-titres-transport-aerien',
    groupe: 'v-taxes',
    titre: t('Taxes spécifiques sur les titres de transport aérien', 'Specific taxes on air tickets'),
    sigles: [],
    refs: 'Art. 1142 du CGI',
    redevable: t('L’acheteur du titre de transport.', 'The purchaser of the ticket.'),
    definition: t('Taxe perçue sur les titres de transport aérien au moment de leur achat ou de leur délivrance.', 'Tax levied on air tickets when purchased or issued.'),
    assiette: t('Titre de transport, selon la destination.', 'Ticket, by destination.'),
    taux: [
      mnt(t('Vols domestiques', 'Domestic flights'), SECTORIELLES.titresTransportAerien.domestique, t('par titre', 'per ticket')),
      mnt(t('Vols CEDEAO', 'ECOWAS flights'), SECTORIELLES.titresTransportAerien.cedeao, t('par titre', 'per ticket')),
      mnt(t('Autres destinations', 'Other destinations'), SECTORIELLES.titresTransportAerien.autresDestinations, t('par titre', 'per ticket')),
    ],
    exonerations: [t('Les titres de transport gratuits.', 'Free tickets.')],
    motsCles: ['avion', 'billet', 'vol', 'aérien', 'flight', 'ticket', 'air'],
  },
  simple({
    id: 'taxe-excedent-cautions',
    titre: t('Taxe sur les excédents de cautions et avances sur loyer', 'Tax on excess deposits and rent advances'),
    refs: 'Art. 1143 du CGI',
    redevable: t('Les propriétaires d’immeubles donnés en location.', 'Owners of property let out.'),
    definition: t(
      'Taxe due sur l’excédent des cautions et avances sur loyer perçues au-delà des montants autorisés.',
      'Tax on deposits and rent advances collected above the authorised amounts.',
    ),
    assiette: t('Excédent du montant perçu.', 'The excess amount collected.'),
    taux: [pct(t('Taux appliqué à l’excédent', 'Rate applied to the excess'), SECTORIELLES.excedentCautionsLoyers.taux)],
    motsCles: ['caution', 'avance', 'loyer', 'bailleur', 'deposit', 'rent advance'],
  }),
  simple({
    id: 'taxe-vod',
    titre: t('Taxe sur la diffusion de vidéos à la demande', 'Tax on video-on-demand services'),
    refs: 'Art. 1146 du CGI',
    redevable: t('Les diffuseurs professionnels de vidéos à la demande.', 'Professional video-on-demand providers.'),
    definition: t(
      'Taxe perçue en contrepartie de la mise à disposition d’œuvres cinématographiques ou audiovisuelles par voie électronique.',
      'Tax on making cinematographic or audiovisual works available electronically.',
    ),
    assiette: t('Montant hors taxes payé par le client.', 'Amount excluding tax paid by the customer.'),
    taux: [pct(t('Taux unique', 'Single rate'), SECTORIELLES.videoALaDemande.taux)],
    motsCles: ['vidéo', 'VOD', 'streaming', 'film', 'video', 'streaming'],
  }),
  simple({
    id: 'taxe-cola',
    titre: t('Taxe à l’exportation sur la noix de cola', 'Export tax on kola nuts'),
    refs: 'Art. 1147 du CGI',
    redevable: t('Les exportateurs de noix de cola.', 'Kola nut exporters.'),
    definition: t('Taxe spécifique perçue sur les exportations de noix de cola.', 'Specific tax on exports of kola nuts.'),
    assiette: t('Poids exporté.', 'Weight exported.'),
    taux: [mnt(t('Noix de cola exportée', 'Kola nuts exported'), SECTORIELLES.noixDeCola.montantParKg, t('par kilogramme', 'per kilogram'))],
    motsCles: ['cola', 'export', 'noix', 'kola', 'export'],
  }),
  simple({
    id: 'taxe-caoutchouc',
    titre: t('Taxe à l’exportation sur le caoutchouc', 'Export tax on rubber'),
    refs: 'Art. 1148 du CGI',
    redevable: t('Les entreprises exportatrices de caoutchouc.', 'Rubber exporting businesses.'),
    definition: t('Taxe assise sur le prix de référence international du caoutchouc sec.', 'Tax based on the international reference price of dry rubber.'),
    assiette: t('Prix de référence du caoutchouc sec sur le marché international.', 'Reference price of dry rubber on the international market.'),
    taux: [pct(t('Taux unique', 'Single rate'), SECTORIELLES.caoutchouc.taux)],
    motsCles: ['caoutchouc', 'hévéa', 'export', 'rubber', 'export'],
  }),
  simple({
    id: 'taxe-jeux-hasard',
    titre: t('Taxe sur les jeux de hasard', 'Tax on games of chance'),
    refs: 'Art. 1149 et 1150 du CGI',
    redevable: t('Les opérateurs de jeux de hasard, y compris en ligne et les paris sportifs.', 'Operators of games of chance, including online games and sports betting.'),
    definition: t(
      'Taxe instituée sur le produit net des opérations de ventes, de commissions et de courtage portant sur les jeux de hasard.',
      'Tax on the net proceeds of sales, commissions and brokerage on games of chance.',
    ),
    assiette: t('Produit net des opérations.', 'Net proceeds of the operations.'),
    taux: [
      pct(t('Jeux de hasard', 'Games of chance'), SECTORIELLES.jeuxDeHasard.taux),
      pct(t('Jeux de hasard en ligne et paris sportifs', 'Online games of chance and sports betting'), SECTORIELLES.jeuxDeHasardEnLigne.taux),
    ],
    motsCles: ['jeu', 'hasard', 'pari', 'loterie', 'casino', 'gambling', 'betting', 'lottery'],
  }),
  simple({
    id: 'timbre-fiscal-tabac',
    titre: t('Timbre fiscal sur les produits du tabac', 'Tax stamp on tobacco products'),
    refs: 'Art. 1151 du CGI',
    redevable: t('Le fabricant ou l’importateur des produits du tabac.', 'The producer or importer of tobacco products.'),
    definition: t('Impôt matérialisé par un timbre apposé sur les produits du tabac.', 'Tax evidenced by a stamp affixed to tobacco products.'),
    assiette: t('Produits du tabac mis sur le marché.', 'Tobacco products placed on the market.'),
    taux: [
      txt(
        t('Tarif', 'Rate'),
        t(
          'Fixé par arrêté conjoint des ministres en charge du Budget, du Commerce et de la Santé',
          'Set by joint order of the ministers for the Budget, Trade and Health',
        ),
      ),
    ],
    motsCles: ['timbre', 'tabac', 'cigarette', 'stamp', 'tobacco'],
  }),
  simple({
    id: 'taxe-etablissements-classes',
    titre: t('Taxe et redevance environnementales sur les établissements classés', 'Environmental tax and fee on classified establishments'),
    refs: 'Art. 1152 du CGI',
    redevable: t('Tout établissement classé, lors de son ouverture puis annuellement.', 'Any classified establishment, on opening and annually thereafter.'),
    definition: t(
      'Taxe à l’ouverture assise sur la superficie de l’établissement, complétée d’une redevance annuelle forfaitaire.',
      'Tax on opening based on the establishment’s floor area, plus a flat annual fee.',
    ),
    assiette: t('Superficie de l’établissement en mètres carrés.', 'Floor area of the establishment in square metres.'),
    taux: [
      ...ETABLISSEMENTS_CLASSES.bareme.map((tranche, index, tableau) => {
        const plancher = index === 0 ? 0 : tableau[index - 1].plafondM2 + 1;
        const libelleFr =
          tranche.plafondM2 === Infinity
            ? `Au-delà de ${tableau[index - 1].plafondM2.toLocaleString('fr-FR')} m²`
            : `De ${plancher.toLocaleString('fr-FR')} à ${tranche.plafondM2.toLocaleString('fr-FR')} m²`;
        const libelleEn =
          tranche.plafondM2 === Infinity
            ? `Above ${tableau[index - 1].plafondM2.toLocaleString('en-US')} m²`
            : `${plancher.toLocaleString('en-US')} to ${tranche.plafondM2.toLocaleString('en-US')} m²`;
        return mnt(t(libelleFr, libelleEn), tranche.tarifParM2, t('par m²', 'per m²'));
      }),
      mnt(t('Redevance environnementale annuelle', 'Annual environmental fee'), ETABLISSEMENTS_CLASSES.redevanceAnnuelle, t('par an', 'per year')),
    ],
    motsCles: ['établissement classé', 'environnement', 'superficie', 'classified establishment', 'environment'],
  }),
  simple({
    id: 'prelevement-plateformes',
    groupe: 'v-acomptes',
    titre: t('Prélèvement sur les revenus des transporteurs utilisant des plateformes en ligne', 'Withholding on transport operators using online platforms'),
    refs: 'Art. 1153 du CGI',
    redevable: t(
      'Les propriétaires de véhicules de transport public utilisant une plateforme de mise en relation en ligne ; le prélèvement est opéré par l’exploitant de la plateforme.',
      'Owners of public transport vehicles using an online matching platform; the withholding is made by the platform operator.',
    ),
    definition: t(
      'Prélèvement à la source libératoire de la patente transport, opéré sur chaque course.',
      'Withholding at source that discharges the transport business licence, applied to each ride.',
    ),
    assiette: t('Montant de la course.', 'Amount of the ride.'),
    taux: [pct(t('Taux unique, libératoire de la patente transport', 'Single rate, discharging the transport business licence'), SECTORIELLES.plateformesTransport.taux)],
    motsCles: ['plateforme', 'VTC', 'course', 'taxi', 'transport', 'platform', 'ride-hailing'],
  }),
  simple({
    id: 'redevance-terrains-industriels',
    titre: t('Redevance d’occupation des terrains industriels', 'Industrial land occupation fee'),
    refs: 'Décret n° 2015-810 du 18 décembre 2015',
    redevable: t('Les opérateurs économiques occupant des terrains industriels.', 'Businesses occupying industrial land.'),
    definition: t('Redevance annuelle au mètre carré, différenciée par zone.', 'Annual fee per square metre, varying by zone.'),
    assiette: t('Superficie occupée, selon la zone.', 'Area occupied, by zone.'),
    taux: [
      mnt(t('Zone A — zones industrielles de Koumassi, Vridi et Port-Bouët', 'Zone A — Koumassi, Vridi and Port-Bouët industrial estates'), TERRAINS_INDUSTRIELS.zoneAKoumassiVridi, t('par m² et par an', 'per m² per year')),
      mnt(t('Zone A — Yopougon, PK24 et hors zone industrielle', 'Zone A — Yopougon, PK24 and outside industrial estates'), TERRAINS_INDUSTRIELS.zoneAYopougonPk24HorsZone, t('par m² et par an', 'per m² per year')),
      mnt(t('Zone B', 'Zone B'), TERRAINS_INDUSTRIELS.zoneB, t('par m² et par an', 'per m² per year')),
      mnt(t('Zone C', 'Zone C'), TERRAINS_INDUSTRIELS.zoneC, t('par m² et par an', 'per m² per year')),
    ],
    motsCles: ['terrain industriel', 'zone industrielle', 'occupation', 'industrial land', 'estate'],
  }),
  simple({
    id: 'redevance-domaine-public',
    titre: t('Redevance pour occupation du domaine public et privé de l’Etat', 'Fee for occupying State public and private land'),
    refs: 'Ord. n° 61-183 du 18 mai 1961 modifiée',
    redevable: t('Les établissements pétroliers et stations-service, et les demandeurs d’actes d’occupation.', 'Petroleum facilities and service stations, and applicants for occupation deeds.'),
    definition: t(
      'Redevance annuelle d’occupation, complétée de droits sur les demandes d’actes et d’amendes en cas d’occupation non autorisée.',
      'Annual occupation fee, plus charges on applications for deeds and fines for unauthorised occupation.',
    ),
    assiette: t('Localité et catégorie de l’établissement.', 'Locality and category of the establishment.'),
    taux: [
      mnt(t('District d’Abidjan — 1re catégorie', 'Abidjan District — category 1'), DOMAINE_PUBLIC.abidjan.categorie1),
      mnt(t('District d’Abidjan — 2e catégorie', 'Abidjan District — category 2'), DOMAINE_PUBLIC.abidjan.categorie2),
      mnt(t('Bouaké, Yamoussoukro, San Pedro, Korhogo — 1re catégorie', 'Bouaké, Yamoussoukro, San Pedro, Korhogo — category 1'), DOMAINE_PUBLIC.grandesVilles.categorie1),
      mnt(t('Chefs-lieux de régions — 1re catégorie', 'Regional capitals — category 1'), DOMAINE_PUBLIC.chefsLieuxRegions.categorie1),
      mnt(t('Autres localités — 1re catégorie', 'Other localities — category 1'), DOMAINE_PUBLIC.autresLocalites.categorie1),
      mnt(t('Demande d’occupation — particuliers', 'Occupation application — individuals'), DOMAINE_PUBLIC.demandeParticulier),
      mnt(t('Demande d’occupation — personnes morales', 'Occupation application — legal entities'), DOMAINE_PUBLIC.demandePersonneMorale),
      mnt(t('Amende pour occupation non autorisée — stations-service', 'Fine for unauthorised occupation — service stations'), DOMAINE_PUBLIC.amendeOccupationStationService),
    ],
    motsCles: ['domaine public', 'occupation', 'station-service', 'amende', 'public land', 'fine'],
  }),
  simple({
    id: 'redevance-superficiaire-miniere',
    titre: t('Redevance superficiaire et taxes proportionnelles minières', 'Mining surface fee and ad valorem taxes'),
    refs: 'Ord. n° 2014-148 du 26 mars 2014',
    redevable: t(
      'Les titulaires de titres miniers et les bénéficiaires d’autorisations d’exploitation minière ou de carrière.',
      'Holders of mining titles and beneficiaries of mining or quarry operating permits.',
    ),
    definition: t(
      'Redevance annuelle à la superficie, complétée d’une taxe ad valorem sur la substance extraite.',
      'Annual fee on surface area, plus an ad valorem tax on the substance extracted.',
    ),
    assiette: t('Superficie du titre minier et valeur de la substance extraite.', 'Area of the mining title and value of the substance extracted.'),
    taux: [
      txt(t('Redevance superficiaire', 'Surface fee'), t('Tarif fixé annuellement par km² ou par hectare', 'Rate set annually per km² or per hectare')),
      txt(t('Taxe proportionnelle', 'Ad valorem tax'), t('Taux fixé selon la substance minérale', 'Rate set according to the mineral substance')),
    ],
    motsCles: ['mine', 'minier', 'carrière', 'superficiaire', 'mining', 'quarry'],
  }),
  {
    id: 'airsi',
    groupe: 'v-acomptes',
    titre: t('Acompte d’impôt sur le revenu du secteur informel (AIRSI)', 'Income tax prepayment on the informal sector (AIRSI)'),
    sigles: ['AIRSI'],
    refs: 'Divers textes fiscaux, textes législatifs n° 15',
    redevable: t(
      'Le client relevant de la TEE, de la TCE ou du régime des microentreprises ; le prélèvement est opéré par l’importateur ou le commerçant vendeur.',
      'The customer under the TEE, TCE or micro-enterprise regime; the withholding is made by the importer or selling trader.',
    ),
    definition: t(
      'Prélèvement à la source opéré sur les ventes faites aux contribuables des régimes de l’entreprenant et des microentreprises, imputable sur leur impôt.',
      'Withholding on sales to taxpayers under the entrepreneur and micro-enterprise regimes, creditable against their tax.',
    ),
    assiette: t('Prix de vente ou valeur CAF en douane.', 'Sale price or CIF customs value.'),
    taux: [
      pct(t('Taux normal', 'Standard rate'), PRELEVEMENTS.airsiNormal.taux),
      pct(t('Taux réduit sur certains produits de grande consommation', 'Reduced rate on certain staple products'), PRELEVEMENTS.airsiReduits[2]),
      pct(t('Taux réduit sur certains produits de grande consommation', 'Reduced rate on certain staple products'), PRELEVEMENTS.airsiReduits[1]),
      pct(t('Taux réduit sur certains produits de grande consommation', 'Reduced rate on certain staple products'), PRELEVEMENTS.airsiReduits[0]),
    ],
    exonerations: [
      t('Les achats et importations effectués par les entreprises relevant d’un régime réel d’imposition.', 'Purchases and imports by businesses under an actual-profit regime.'),
      t(
        'Les ventes aux coopératives agricoles, planteurs, éleveurs, pêcheurs artisanaux et sociétés de recherche minière en exploration.',
        'Sales to farming cooperatives, growers, breeders, artisanal fishers and mining exploration companies.',
      ),
      t('Les ventes portant sur l’eau, l’électricité, le gaz et les produits pétroliers.', 'Sales of water, electricity, gas and petroleum products.'),
    ],
    motsCles: ['AIRSI', 'acompte', 'informel', 'importateur', 'prepayment', 'informal sector'],
    calculateur: 'prelevements',
  },
  simple({
    id: 'acompte-prestataires',
    groupe: 'v-acomptes',
    titre: t('Acompte sur les prestataires de services du secteur informel', 'Prepayment on informal-sector service providers'),
    refs: 'Art. 84 bis du CGI',
    redevable: t(
      'Le prestataire relevant du RME ou du régime de l’entreprenant ; la retenue est opérée par le client soumis à un régime réel.',
      'The provider under the micro-enterprise or entrepreneur regime; the withholding is made by the customer under an actual-profit regime.',
    ),
    definition: t(
      'Retenue à la source sur les paiements faits aux prestataires de services du secteur informel.',
      'Withholding on payments to informal-sector service providers.',
    ),
    assiette: t('Sommes brutes versées au prestataire.', 'Gross amounts paid to the provider.'),
    taux: [pct(t('Taux unique', 'Single rate'), PRELEVEMENTS.acomptePrestatairesInformel.taux)],
    motsCles: ['acompte', 'prestataire', 'retenue', 'informel', 'prepayment', 'service provider'],
    calculateur: 'prelevements',
  }),
  {
    id: 'rme',
    groupe: 'v-forfaitaires',
    titre: t('Impôt des microentreprises (RME)', 'Micro-enterprise tax (RME)'),
    sigles: ['RME', 'IME'],
    refs: 'Art. 71 bis et suivants du CGI',
    redevable: t(
      'Les contribuables, personnes physiques ou morales, dont le chiffre d’affaires annuel TTC est compris entre 50 000 001 et 200 millions de francs, quelle que soit l’activité.',
      'Taxpayers, individuals or companies, with annual turnover including tax between XOF 50,000,001 and 200 million, whatever the activity.',
    ),
    definition: t(
      'Impôt forfaitaire libératoire de la patente, de la TVA et de l’impôt sur les BIC, payable par douzièmes.',
      'Flat tax that discharges the business licence, VAT and BIC tax, payable in twelfths.',
    ),
    assiette: t('Chiffre d’affaires annuel toutes taxes comprises.', 'Annual turnover including tax.'),
    taux: [
      pct(t('Taux de droit commun', 'General rate'), RME.taux),
      pct(t('Adhérents d’un centre de gestion agréé ou suivis par un expert-comptable conventionné', 'Members of an approved management centre or monitored by a chartered accountant under agreement'), RME.tauxCga),
    ],
    formule: t(
      'Impôt annuel = chiffre d’affaires TTC × 6 % (4 % en cas d’adhésion à un CGA). Le contribuable acquitte le douzième de ce montant chaque 10 du mois.',
      'Annual tax = turnover including tax × 6% (4% for members of an approved management centre). The taxpayer pays one twelfth on the 10th of each month.',
    ),
    motsCles: ['microentreprise', 'RME', 'forfait', 'CGA', 'micro-enterprise', 'flat tax'],
    calculateur: 'bic',
  },
  {
    id: 'tee',
    groupe: 'v-forfaitaires',
    titre: t('Taxe d’Etat de l’entreprenant (TEE)', 'State entrepreneur tax (TEE)'),
    sigles: ['TEE'],
    refs: 'Art. 72 à 84 du CGI',
    redevable: t(
      'Les contribuables dont le chiffre d’affaires annuel TTC est compris entre 5 000 001 et 50 millions de francs.',
      'Taxpayers with annual turnover including tax between XOF 5,000,001 and 50 million.',
    ),
    definition: t(
      'Impôt forfaitaire libératoire de la patente, de la TVA et de l’impôt sur les BIC, payable par douzièmes.',
      'Flat tax that discharges the business licence, VAT and BIC tax, payable in twelfths.',
    ),
    assiette: t(
      'Chiffre d’affaires annuel TTC réalisé ou chiffre d’affaires prévisionnel déclaré.',
      'Annual turnover including tax, or the declared forecast turnover.',
    ),
    taux: [
      pct(t('Taux de droit commun', 'General rate'), TEE.taux),
      pct(t('Activités de commerce ou de négoce', 'Trading or resale activities'), TEE.tauxCommerce),
      txt(t('Adhérents d’un centre de gestion agréé', 'Members of an approved management centre'), t('Montant réduit de moitié', 'Amount halved')),
    ],
    formule: t(
      'Taxe annuelle = chiffre d’affaires TTC × 5 % (4 % pour le commerce), réduite de moitié en cas d’adhésion à un CGA, acquittée par douzièmes chaque 10 du mois.',
      'Annual tax = turnover including tax × 5% (4% for trading), halved for members of an approved management centre, paid in twelfths on the 10th of each month.',
    ),
    motsCles: ['entreprenant', 'TEE', 'forfait', 'petite entreprise', 'entrepreneur', 'small business'],
    calculateur: 'bic',
  },
  {
    id: 'tce',
    groupe: 'v-forfaitaires',
    titre: t('Taxe communale de l’entreprenant (TCE)', 'Municipal entrepreneur tax (TCE)'),
    sigles: ['TCE'],
    refs: 'Loi n° 2020-972 du 23 décembre 2020, annexe fiscale, art. 33',
    redevable: t(
      'Les personnes physiques ou morales dont le chiffre d’affaires annuel TTC est inférieur ou égal à 5 millions de francs.',
      'Individuals or companies with annual turnover including tax of XOF 5 million or less.',
    ),
    definition: t(
      'Taxe communale représentative de la contribution des patentes, des licences et des taxes communales.',
      'Municipal tax standing in for the business licence, liquor licence and municipal taxes.',
    ),
    assiette: t('Chiffre d’affaires annuel réalisé ou prévisionnel.', 'Actual or forecast annual turnover.'),
    taux: [
      pct(t('Activités de commerce ou de négoce', 'Trading or resale activities'), TCE.tauxCommerce),
      pct(t('Autres activités, y compris les prestations de services', 'Other activities, including services'), TCE.tauxAutres),
    ],
    exonerations: [
      t(
        'Les commerçants, artisans et façonniers en étalage, sur les marchés ou en ambulance réalisant moins de 1 200 000 F peuvent être autorisés par le conseil municipal à acquitter une taxe journalière.',
        'Street, market and itinerant traders, craftspeople and finishers below XOF 1,200,000 may be authorised by the municipal council to pay a daily tax instead.',
      ),
    ],
    motsCles: ['TCE', 'commune', 'entreprenant', 'petit commerce', 'municipal', 'small trader'],
    calculateur: 'bic',
  },
];

/** Corpus complet, toutes fiches confondues. */
export const FICHES = [...titreI, ...titreIAutres, ...titreII, ...titreIII, ...titreIV, ...titreV];

/** Retourne une fiche par son identifiant. */
export function ficheParId(id) {
  return FICHES.find((fiche) => fiche.id === id);
}

/** Fiches rattachées à un simulateur donné. */
export function fichesDuCalculateur(calculateurId) {
  return FICHES.filter((fiche) => fiche.calculateur === calculateurId);
}
