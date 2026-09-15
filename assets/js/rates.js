/**
 * Barèmes, taux et tarifs du dispositif fiscal ivoirien.
 * Source : DGI, « Impôts et taxes en Côte d'Ivoire — Tableau synoptique »,
 * édition 2025 (intègre l'annexe fiscale 2025). Références au CGI indiquées.
 *
 * Ce fichier est l'unique source de vérité des taux : les calculateurs
 * n'utilisent aucune valeur codée en dur.
 */

/** Barème progressif mensuel de l'impôt sur les traitements et salaires (Art. 115 et s. du CGI). */
export const BAREME_ITS_MENSUEL = [
  { plafond: 75_000, taux: 0 },
  { plafond: 240_000, taux: 0.16 },
  { plafond: 800_000, taux: 0.21 },
  { plafond: 2_400_000, taux: 0.24 },
  { plafond: 8_000_000, taux: 0.28 },
  { plafond: Infinity, taux: 0.32 },
];

/**
 * Réduction d'impôt pour charges de famille, montant mensuel (Art. 119 bis du CGI).
 * Le montant annuel est obtenu par multiplication par 12 : le tableau annuel publié
 * indique 380 000 F pour 3,5 parts, ce qui est incohérent avec le montant mensuel
 * de 27 500 F (27 500 x 12 = 330 000). Voir NOTES_SOURCE.ricf35.
 */
export const RICF_MENSUEL = {
  1: 0,
  1.5: 5_500,
  2: 11_000,
  2.5: 16_500,
  3: 22_000,
  3.5: 27_500,
  4: 33_000,
  4.5: 38_500,
  5: 44_000,
};

/** Abattement d'impôt pour les retraités de plus de 70 ans (Art. 120 du CGI). */
export const ABATTEMENT_RETRAITE_70 = 0.75;

/** Taux applicable aux dockers et dockers transit (Art. 120 du CGI). */
export const TAUX_DOCKERS = 0.015;

/** Impôts et taxes sur les salaires à la charge de l'employeur (Art. 134 à 146 du CGI). */
export const CHARGES_EMPLOYEUR = {
  contributionEmployeur: { local: 0, expatrie: 0.092, ref: 'Art. 146 du CGI' },
  contributionNationale: { local: 0.012, expatrie: 0.012, ref: 'Art. 146 du CGI' },
  taxeApprentissage: { local: 0.004, expatrie: 0.004, ref: 'Art. 143 et 146 du CGI' },
  formationContinue: { local: 0.012, expatrie: 0.012, ref: 'Art. 146 du CGI' },
};

/** Barème progressif annuel de l'impôt général sur le revenu (Art. 251 du CGI). */
export const BAREME_IGR = [
  { plafond: 2_200_000, taux: 0.02 },
  { plafond: 3_600_000, taux: 0.1 },
  { plafond: 5_200_000, taux: 0.15 },
  { plafond: 7_200_000, taux: 0.2 },
  { plafond: 9_600_000, taux: 0.24 },
  { plafond: 12_600_000, taux: 0.26 },
  { plafond: 20_000_000, taux: 0.29 },
  { plafond: 30_000_000, taux: 0.32 },
  { plafond: 40_000_000, taux: 0.34 },
  { plafond: 50_000_000, taux: 0.35 },
  { plafond: Infinity, taux: 0.36 },
];

/** Seuils de chiffre d'affaires annuel TTC délimitant les régimes d'imposition. */
export const SEUILS_REGIMES = {
  tce: 5_000_000, // Taxe communale de l'entreprenant : CA TTC <= 5 000 000
  tee: 50_000_000, // Taxe d'Etat de l'entreprenant : 5 000 001 à 50 000 000
  rme: 200_000_000, // Régime des microentreprises : 50 000 001 à 200 000 000
  rsi: 500_000_000, // Réel simplifié : 200 000 001 à 500 000 000
  // Au-delà de 500 000 000 : réel normal (RNI)
};

/** Impôt sur les bénéfices industriels et commerciaux (Art. 51 du CGI). */
export const TAUX_BIC = {
  commun: 0.25,
  telecomsTic: 0.3,
  jeuxHasard: 0.3,
};

/** Impôt minimum forfaitaire, régimes réels (Art. 39 et 53 du CGI). */
export const IMF = {
  tauxCommun: 0.005,
  tauxPetrolierEauElectriciteGaz: 0.001,
  tauxBanqueAssurance: 0.0015,
  minimum: 3_000_000,
  minimumStationService: 500_000,
  maximumRni: 35_000_000,
};

/** Régime des microentreprises (Art. 71 bis et s. du CGI). */
export const RME = { taux: 0.06, tauxCga: 0.04 };

/** Taxe d'Etat de l'entreprenant (Art. 72 à 84 du CGI). */
export const TEE = { taux: 0.05, tauxCommerce: 0.04, reductionCga: 0.5 };

/** Taxe communale de l'entreprenant (annexe fiscale 2021, art. 33). */
export const TCE = { tauxCommerce: 0.02, tauxAutres: 0.025 };

/** Bénéfices non commerciaux (Art. 90 et 102 du CGI). */
export const BNC = {
  taux: 0.25,
  tauxSansInstallation: 0.25,
  tauxReassuranceNonDomiciliee: 0.125,
  tauxGreffiersNotaires: 0.5,
  imfTaux: 0.05,
  imfMinimum: 400_000,
  retenueSource: 0.075,
};

/** Impôts fonciers (Art. 149 à 166 du CGI). */
export const FONCIER = {
  revenuFoncier: { personnePhysique: 0.03, personneMorale: 0.04, ref: 'Art. 156 du CGI' },
  patrimoineBati: { personnePhysique: 0.09, personneMorale: 0.11, ref: 'Art. 158 du CGI' },
  patrimoineBatiNonProductif: { taux: 0.005, ref: 'Art. 158 du CGI' },
  patrimoineNonBati: { taux: 0.01, tauxPortSanPedro: 0.0075, ref: 'Art. 165 du CGI' },
  taxeVoirie: { taux: 0.02, ref: 'Art. 166 du CGI' },
};

/** Tarifs à l'hectare planté des exploitations agricoles (Art. 165 du CGI). */
export const TARIFS_AGRICOLES = {
  hevea: 7_500,
  cacao: 5_000,
  cafe: 5_000,
  banane: 5_000,
  ananas: 5_000,
  coco: 5_000,
  palmierHuile: 5_000,
  fleurs: 5_000,
  canneASucre: 2_500,
  mangue: 2_500,
  anacarde: 2_500,
  citron: 2_500,
  papaye: 2_500,
};

/** Contribution des patentes (Art. 264 à 302 du CGI). */
export const PATENTE = {
  dcaTaux: 0.005,
  dcaTauxExonereValeurLocative: 0.007,
  dcaMinimum: 300_000,
  dcaPlafonds: [
    { plafondCa: 200_000_000, maximum: 350_000 },
    { plafondCa: 500_000_000, maximum: 700_000 },
    { plafondCa: 1_000_000_000, maximum: 1_300_000 },
    { plafondCa: Infinity, maximum: 3_000_000 },
  ],
  dvlTaux: 0.185,
  dvlTauxHorsCommune: 0.16,
  dvlFractionMinimaleDuDca: 1 / 3,
};

/** Impôt sur le revenu des valeurs mobilières (Art. 182 et 183 du CGI). */
export const IRVM = {
  commun: { morale: 0.15, physique: 0.17 },
  brvm: { morale: 0.1, physique: 0.12 },
  obligations5Ans: { morale: 0.02, physique: 0.03 },
};

/** Impôt sur le revenu des créances (Art. 193 du CGI). */
export const IRC = {
  commun: 0.18,
  compteCourantParticulier: 0.135,
  compteCourantEntreprise: 0.165,
  depotParticulierMin: 0.01,
  depotParticulierMax: 0.135,
  depotEntrepriseMin: 0.01,
  depotEntrepriseMax: 0.165,
};

/** Taxes sur le chiffre d'affaires (Art. 359 et 401 du CGI). */
export const TVA = { commun: 0.18, reduit: 0.09 };
export const TOB = { commun: 0.1, reduitPme: 0.05 };

/** Droits d'accises et taxes spécifiques (Art. 403 à 421 bis du CGI). */
export const ACCISES = {
  boissons: {
    champagne: 0.4,
    vinsAc: 0.4,
    vinsMousseux: 0.4,
    vinsOrdinaires: 0.35,
    bieresCidres: 0.17,
    alcoolMoins35: 0.4,
    alcool35EtPlus: 0.45,
    energisantes: 0.14,
    nonAlcoolisees: 0.14,
  },
  tabacs: 0.57,
  tabacSport: 0.07,
  tabacSolidariteSida: 0.02,
  marbreVehiculesCosmetiques: 0.1,
  cosmetiquesHydroquinone: 0.15,
  cartouche: 12,
  produitsPetroliers: {
    superCarburant: 85,
    essenceAuto: 75,
    gasoil: 25,
    huilesMinerales: 25,
    ddo: 45,
    fuelOilDomestique: 10,
    fuelOilLeger: 10,
    fuelOilLourd: 10,
    graissesConsistantes: 20,
  },
  eau: {
    sociale: 0,
    domestique: 27,
    normale: 165,
    industrielle: 221,
    administrative: 108,
  },
};

/** Taxe sur les contrats d'assurance et de microassurance (Art. 423 du CGI). */
export const ASSURANCE = {
  classique: {
    maritimeFluvialeAerienne: 0.07,
    incendie: 0.25,
    incendieEdificesReligieux: 0.125,
    rentesViageres: 0.05,
    creditsExport: 0.001,
    automobile: 0.145,
    maladie: 0.08,
    maladieGroupe: 0.03,
    volEdificesReligieux: 0.07,
    autresRisques: 0.145,
  },
  micro: {
    maritimeFluvialeAerienne: 0.035,
    incendie: 0.125,
    incendieEdificesReligieux: 0.065,
    rentesViageres: 0.025,
    creditsExport: 0.0005,
    automobile: 0.145,
    maladie: 0.04,
    maladieGroupe: 0.015,
    volEdificesReligieux: 0.035,
    autresRisques: 0.0725,
  },
};

/** Droits de mutation à titre onéreux (Art. 669 à 765 du CGI). */
export const MUTATION = {
  venteImmeuble: 0.04,
  venteImmeubleEtranger: 0.015,
  venteImmeubleAssociationCaritative: 0.02,
  venteImmeubleCreditBailleur: 0.02,
  venteImmeubleLeveeOption: 0.01,
  plusValueCessionImmeuble: 0.15,
  venteMeublesTarifGeneral: 25_000,
  venteFondsDeCommerce: 0.1,
  venteDroitsSociaux: 0.1,
  echangeSansRetour: 0.03,
  echangeAvecRetour: 0.02,
  bailLimiteImmeuble: 0.025,
  bailCreditBail: 0.015,
  bailLimiteMeubles: 25_000,
  bailIllimiteImmeuble: 0.1,
  bailIllimiteMeubles: 25_000,
  partage: 0.01,
  successionMin: 0.01,
  successionMax: 0.12,
  successionSeuilExoneration: 300_000,
  donationUtilitePublique: 0.01,
  formationSocieteJusqua5Md: 0.003,
  formationSocieteAudela5Md: 0.001,
  seuilCapitalFormationSociete: 5_000_000_000,
};

/** Timbre de quittance (Art. 873 du CGI). */
export const TIMBRE_QUITTANCE = [
  { plafond: 5_000, droit: 0 },
  { plafond: 100_000, droit: 100 },
  { plafond: 500_000, droit: 500 },
  { plafond: 1_000_000, droit: 1_000 },
  { plafond: 5_000_000, droit: 2_000 },
  { plafond: Infinity, droit: 5_000 },
];

/** Timbre proportionnel (Art. 852 et 853 du CGI) et timbre de dimension (Art. 835 du CGI). */
export const TIMBRE = {
  proportionnelHaut: 0.01,
  proportionnelBas: 0.0025,
  dimensionMin: 1_000,
  dimensionMax: 4_000,
};

/** Acomptes, prélèvements et taxes diverses (Titre V du CGI). */
export const PRELEVEMENTS = {
  airsiNormal: { taux: 0.05, ref: 'Textes législatifs n° 15' },
  airsiReduits: [0.002, 0.015, 0.02],
  acomptePrestatairesInformel: { taux: 0.02, ref: 'Art. 84 bis du CGI' },
  taxeSpecialeEquipement: { taux: 0.001, ref: 'Art. 1084 du CGI' },
  taxeTelecoms: { taux: 0.05, ref: 'Art. 1130 du CGI' },
  taxeNouvellesTechnologiesRurales: { taux: 0.02, ref: 'Art. 1127 du CGI' },
  prelevementCulture: { taux: 0.002, ref: 'Art. 1129 du CGI' },
  taxePublicite: { taux: 0.03, ref: 'Art. 421 du CGI' },
  taxeCommunicationAudiovisuelle: { montantParHeure: 20_000, ref: 'Art. 421 bis du CGI' },
  redevanceEvaluationImmobiliere: { taux: 0.01, minimum: 50_000, ref: 'Art. 1125 du CGI' },
  taxeTransportPriveMarchandises: {
    base: 24_000,
    majorationParTonne: 1_000,
    seuilTonnes: 3,
    ref: 'Art. 1117 du CGI',
  },
};

/** Retenues à la source sur les BIC (Art. 56 et s. du CGI). */
export const RETENUES_BIC = [0.075, 0.015, 0.025, 0.05, 0.1, 0.07];

/** Anomalies relevées dans le document source, signalées à l'utilisateur. */
export const NOTES_SOURCE = {
  ricf35: {
    fr:
      "Le tableau publié indique 380 000 F de RICF annuelle pour 3,5 parts, incohérent avec le montant mensuel de 27 500 F. Le simulateur retient 27 500 F x 12 = 330 000 F.",
    en:
      'The published table shows an annual family-allowance credit of XOF 380,000 for 3.5 shares, which is inconsistent with the monthly XOF 27,500. This simulator uses 27,500 x 12 = XOF 330,000.',
  },
};

/** Devise utilisée par l'ensemble des calculateurs. */
export const DEVISE = { fr: 'F CFA', en: 'XOF' };

/** Edition du document de référence. */
export const SOURCE = {
  titre: {
    fr: "Impôts et taxes en Côte d'Ivoire — Tableau synoptique",
    en: "Taxes and duties in Côte d'Ivoire — Synoptic table",
  },
  editeur: 'Direction générale des Impôts (DGI)',
  edition: '2025',
  url: 'https://www.dgi.gouv.ci',
};
