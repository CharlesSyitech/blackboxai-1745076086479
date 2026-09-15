/**
 * Définition déclarative des simulateurs.
 *
 * Chaque simulateur expose :
 *  - `champs` : les entrées du formulaire (rendues génériquement par app.js) ;
 *  - `calcule(v)` : une fonction pure renvoyant { lignes, total, notes }.
 *
 * Tous les libellés sont bilingues : { fr: '...', en: '...' }.
 */

import {
  arrondiFranc,
  baremeProgressif,
  borner,
  horsTaxes,
  tauxEffectif,
  toNumber,
  trancheFixe,
} from './engine.js';

import {
  ABATTEMENT_RETRAITE_70,
  ACCISES,
  ASSURANCE,
  BAREME_IGR,
  BAREME_ITS_MENSUEL,
  BNC,
  CHARGES_EMPLOYEUR,
  FONCIER,
  IMF,
  IRC,
  IRVM,
  MUTATION,
  NOTES_SOURCE,
  PATENTE,
  PRELEVEMENTS,
  RICF_MENSUEL,
  RME,
  SEUILS_REGIMES,
  TARIFS_AGRICOLES,
  TAUX_BIC,
  TAUX_DOCKERS,
  TCE,
  TEE,
  TIMBRE,
  TIMBRE_QUITTANCE,
  TOB,
  TVA,
} from './rates.js';

/** Raccourci de libellé bilingue. */
const t = (fr, en) => ({ fr, en });

/** Ligne monétaire du tableau de résultats. */
const money = (libelle, valeur, options = {}) => ({
  libelle,
  valeur: arrondiFranc(valeur),
  format: 'money',
  ...options,
});

/** Ligne en pourcentage. */
const percent = (libelle, valeur, options = {}) => ({ libelle, valeur, format: 'percent', ...options });

/** Ligne de texte libre. */
const texte = (libelle, valeur, options = {}) => ({ libelle, valeur, format: 'texte', ...options });

/** Détaille les tranches d'un barème progressif en lignes de résultat. */
function lignesTranches(detail, suffixe = '') {
  return detail
    .filter((tranche) => tranche.assiette > 0)
    .map((tranche) => {
      const borne =
        tranche.plafond === Infinity
          ? `> ${tranche.plancher.toLocaleString('fr-FR')}`
          : `${tranche.plancher.toLocaleString('fr-FR')} – ${tranche.plafond.toLocaleString('fr-FR')}`;
      const pct = `${(tranche.taux * 100).toLocaleString('fr-FR')} %`;
      return money(
        t(`Tranche ${borne} à ${pct}${suffixe}`, `Bracket ${borne} at ${pct}${suffixe}`),
        tranche.impot,
        { sousLigne: true },
      );
    });
}

/* ------------------------------------------------------------------ *
 * Titre I — Impôts directs
 * ------------------------------------------------------------------ */

const its = {
  id: 'its',
  groupe: 'revenus',
  titre: t('Impôt sur les traitements et salaires (ITS)', 'Tax on wages and salaries (ITS)'),
  resume: t(
    'Retenue à la source sur les salaires, pensions et rentes viagères, barème progressif mensuel et réduction pour charges de famille.',
    'Withholding tax on wages, pensions and life annuities, using the monthly progressive scale and the family-allowance credit.',
  ),
  ref: 'Art. 115 à 120 du CGI',
  champs: [
    {
      nom: 'base',
      type: 'montant',
      defaut: 500000,
      libelle: t('Revenu mensuel imposable', 'Monthly taxable income'),
      aide: t(
        "Rémunération imposable au sens de l'article 118 du CGI (salaire, pension ou rente viagère).",
        'Taxable remuneration as defined by article 118 of the Tax Code (salary, pension or life annuity).',
      ),
    },
    {
      nom: 'parts',
      type: 'select',
      defaut: '1',
      libelle: t('Nombre de parts', 'Number of family shares'),
      options: Object.keys(RICF_MENSUEL).map((part) => ({
        valeur: part,
        libelle: t(part.replace('.', ','), part),
      })),
    },
    {
      nom: 'retraite70',
      type: 'bool',
      defaut: false,
      libelle: t('Retraité de plus de 70 ans', 'Pensioner over 70'),
      aide: t('Abattement de 75 % après RICF.', '75% relief applied after the family credit.'),
    },
    {
      nom: 'docker',
      type: 'bool',
      defaut: false,
      libelle: t('Docker ou docker transit', 'Docker or transit docker'),
      aide: t('Taux forfaitaire de 1,5 % du total des rémunérations.', 'Flat rate of 1.5% of total remuneration.'),
    },
  ],
  calcule(v) {
    const base = Math.max(0, toNumber(v.base));
    const parts = toNumber(v.parts) || 1;
    const notes = [];

    if (v.docker) {
      const impot = base * TAUX_DOCKERS;
      return {
        lignes: [
          money(t('Rémunération mensuelle', 'Monthly remuneration'), base),
          percent(t('Taux applicable aux dockers', 'Rate applicable to dockers'), TAUX_DOCKERS),
          money(t('Impôt annuel', 'Annual tax'), impot * 12),
          money(t('Net après impôt (mensuel)', 'Net of tax (monthly)'), base - impot),
        ],
        total: money(t('Impôt mensuel dû', 'Monthly tax due'), impot, { accent: true }),
        notes: [t('Art. 120 du CGI, dernier alinéa.', 'Article 120 of the Tax Code, final paragraph.')],
      };
    }

    const { total: impotBrut, detail } = baremeProgressif(base, BAREME_ITS_MENSUEL);
    const ricf = RICF_MENSUEL[parts] ?? 0;
    const apresRicf = Math.max(0, impotBrut - ricf);
    const abattement = v.retraite70 ? apresRicf * ABATTEMENT_RETRAITE_70 : 0;
    const impot = apresRicf - abattement;

    if (parts === 3.5) notes.push(NOTES_SOURCE.ricf35);
    if (ricf > impotBrut) {
      notes.push(
        t(
          "La réduction pour charges de famille excède l'impôt brut : l'impôt est ramené à zéro, sans restitution.",
          'The family-allowance credit exceeds the gross tax: the tax is reduced to zero, with no refund.',
        ),
      );
    }

    const lignes = [
      money(t('Revenu mensuel imposable', 'Monthly taxable income'), base),
      ...lignesTranches(detail),
      money(t('Impôt brut (IB)', 'Gross tax'), impotBrut),
      money(t('Réduction pour charges de famille (RICF)', 'Family-allowance credit'), -ricf),
    ];
    if (v.retraite70) {
      lignes.push(money(t('Abattement retraité (75 %)', 'Pensioner relief (75%)'), -abattement));
    }
    lignes.push(
      money(t('Impôt annuel', 'Annual tax'), impot * 12),
      percent(t('Taux effectif', 'Effective rate'), tauxEffectif(impot, base)),
      money(t('Net après impôt (mensuel)', 'Net of tax (monthly)'), base - impot),
    );

    return { lignes, total: money(t('Impôt mensuel dû', 'Monthly tax due'), impot, { accent: true }), notes };
  },
};

const chargesEmployeur = {
  id: 'charges-employeur',
  groupe: 'revenus',
  titre: t("Charges fiscales de l'employeur", 'Employer payroll taxes'),
  resume: t(
    "Contribution employeur, contribution nationale, taxe d'apprentissage et taxe additionnelle à la formation professionnelle continue.",
    'Employer contribution, national contribution, apprenticeship tax and the additional continuing-training levy.',
  ),
  ref: 'Art. 134 à 146 du CGI',
  champs: [
    {
      nom: 'masseLocale',
      type: 'montant',
      defaut: 10000000,
      libelle: t('Masse salariale — personnel local', 'Payroll — local staff'),
    },
    {
      nom: 'masseExpatriee',
      type: 'montant',
      defaut: 0,
      libelle: t('Masse salariale — personnel expatrié', 'Payroll — expatriate staff'),
    },
  ],
  calcule(v) {
    const locale = Math.max(0, toNumber(v.masseLocale));
    const expatriee = Math.max(0, toNumber(v.masseExpatriee));
    const postes = [
      { cle: 'contributionEmployeur', libelle: t("Contribution à la charge de l'employeur (CE)", 'Employer contribution (CE)') },
      { cle: 'contributionNationale', libelle: t('Contribution nationale (CN)', 'National contribution (CN)') },
      { cle: 'taxeApprentissage', libelle: t("Taxe d'apprentissage (FDFP)", 'Apprenticeship tax (FDFP)') },
      { cle: 'formationContinue', libelle: t('Taxe additionnelle formation continue (FDFP)', 'Additional continuing-training levy (FDFP)') },
    ];

    const lignes = [];
    let total = 0;
    for (const poste of postes) {
      const taux = CHARGES_EMPLOYEUR[poste.cle];
      const montant = locale * taux.local + expatriee * taux.expatrie;
      total += montant;
      const detailTaux =
        taux.local === taux.expatrie
          ? `${(taux.local * 100).toLocaleString('fr-FR')} %`
          : `${(taux.local * 100).toLocaleString('fr-FR')} % / ${(taux.expatrie * 100).toLocaleString('fr-FR')} %`;
      lignes.push(money(t(`${poste.libelle.fr} — ${detailTaux}`, `${poste.libelle.en} — ${detailTaux}`), montant));
    }

    const tauxLocal =
      CHARGES_EMPLOYEUR.contributionEmployeur.local +
      CHARGES_EMPLOYEUR.contributionNationale.local +
      CHARGES_EMPLOYEUR.taxeApprentissage.local +
      CHARGES_EMPLOYEUR.formationContinue.local;
    const tauxExpatrie =
      CHARGES_EMPLOYEUR.contributionEmployeur.expatrie +
      CHARGES_EMPLOYEUR.contributionNationale.expatrie +
      CHARGES_EMPLOYEUR.taxeApprentissage.expatrie +
      CHARGES_EMPLOYEUR.formationContinue.expatrie;

    lignes.push(
      percent(t('Taux global — personnel local', 'Overall rate — local staff'), tauxLocal),
      percent(t('Taux global — personnel expatrié', 'Overall rate — expatriate staff'), tauxExpatrie),
      money(t('Coût employeur total (salaires + charges)', 'Total employer cost (payroll + taxes)'), locale + expatriee + total),
    );

    return {
      lignes,
      total: money(t('Charges fiscales mensuelles', 'Monthly payroll taxes'), total, { accent: true }),
      notes: [
        t(
          "Le taux de 9,2 % de la contribution employeur ne vise que les salaires du personnel expatrié (Art. 146 du CGI). Les cotisations sociales CNPS ne sont pas des impôts et ne figurent pas dans ce document.",
          'The 9.2% employer contribution applies only to expatriate payroll (article 146). CNPS social-security contributions are not taxes and are outside the scope of this document.',
        ),
      ],
    };
  },
};

const igr = {
  id: 'igr',
  groupe: 'revenus',
  titre: t('Impôt général sur le revenu (IGR)', 'General income tax (IGR)'),
  resume: t(
    "Impôt global progressif sur l'ensemble des revenus nets catégoriels d'une personne physique ; les impôts cédulaires s'y imputent.",
    'Progressive global tax on the aggregate net income of an individual; schedular taxes are credited against it.',
  ),
  ref: 'Art. 237 à 251 du CGI',
  champs: [
    {
      nom: 'revenu',
      type: 'montant',
      defaut: 6000000,
      libelle: t('Revenu net annuel imposable', 'Annual net taxable income'),
    },
    {
      nom: 'acomptes',
      type: 'montant',
      defaut: 0,
      libelle: t('Impôts cédulaires déjà acquittés', 'Schedular taxes already paid'),
      aide: t(
        "Chaque impôt cédulaire constitue un acompte de l'IGR et y est directement imputable.",
        'Each schedular tax is a prepayment of the IGR and is directly creditable against it.',
      ),
    },
  ],
  calcule(v) {
    const revenu = Math.max(0, toNumber(v.revenu));
    const acomptes = Math.max(0, toNumber(v.acomptes));
    const { total: impot, detail } = baremeProgressif(revenu, BAREME_IGR);
    const solde = impot - acomptes;

    return {
      lignes: [
        money(t('Revenu net annuel imposable', 'Annual net taxable income'), revenu),
        ...lignesTranches(detail),
        money(t('IGR théorique', 'Gross IGR'), impot),
        money(t('Impôts cédulaires imputés', 'Schedular taxes credited'), -acomptes),
        percent(t('Taux effectif', 'Effective rate'), tauxEffectif(impot, revenu)),
        money(t('Équivalent mensuel', 'Monthly equivalent'), impot / 12),
      ],
      total:
        solde >= 0
          ? money(t('Solde à payer', 'Balance payable'), solde, { accent: true })
          : money(t('Excédent d’acomptes', 'Excess prepayments'), -solde, { accent: true }),
      notes: [
        t(
          "L'obligation de déclaration annuelle de l'IGR est suspendue depuis l'entrée en vigueur de l'annexe fiscale 2017.",
          'The annual IGR return has been suspended since the 2017 Finance Annex came into force.',
        ),
      ],
    };
  },
};

const bic = {
  id: 'bic',
  groupe: 'revenus',
  titre: t('Bénéfices industriels et commerciaux (BIC/BA)', 'Business and agricultural profits (BIC/BA)'),
  resume: t(
    "Détermine le régime d'imposition d'après le chiffre d'affaires TTC, puis l'impôt sur les bénéfices ou l'impôt minimum forfaitaire.",
    'Determines the tax regime from turnover including tax, then the profits tax or the minimum flat tax.',
  ),
  ref: 'Art. 1 à 84 et 71 bis du CGI',
  champs: [
    {
      nom: 'caTtc',
      type: 'montant',
      defaut: 800000000,
      libelle: t('Chiffre d’affaires annuel TTC', 'Annual turnover including tax'),
    },
    {
      nom: 'benefice',
      type: 'montant',
      defaut: 60000000,
      libelle: t('Bénéfice net imposable', 'Net taxable profit'),
      visible: (v) => toNumber(v.caTtc) > SEUILS_REGIMES.rme,
    },
    {
      nom: 'secteur',
      type: 'select',
      defaut: 'commun',
      libelle: t('Secteur d’activité', 'Sector of activity'),
      options: [
        { valeur: 'commun', libelle: t('Droit commun', 'General regime') },
        { valeur: 'telecomsTic', libelle: t('Télécommunications / TIC', 'Telecommunications / ICT') },
        { valeur: 'jeuxHasard', libelle: t('Jeux de hasard', 'Games of chance') },
        { valeur: 'petrolier', libelle: t('Pétrole, eau, électricité, gaz butane', 'Petroleum, water, electricity, butane gas') },
        { valeur: 'banqueAssurance', libelle: t('Banque, finance, assurance', 'Banking, finance, insurance') },
      ],
      visible: (v) => toNumber(v.caTtc) > SEUILS_REGIMES.rme,
    },
    {
      nom: 'commerce',
      type: 'bool',
      defaut: false,
      libelle: t('Activité de commerce ou de négoce', 'Trading or resale activity'),
      visible: (v) => toNumber(v.caTtc) <= SEUILS_REGIMES.tee,
    },
    {
      nom: 'cga',
      type: 'bool',
      defaut: false,
      libelle: t('Adhérent d’un centre de gestion agréé', 'Member of an approved management centre'),
      visible: (v) => toNumber(v.caTtc) <= SEUILS_REGIMES.rme,
    },
    {
      nom: 'stationService',
      type: 'bool',
      defaut: false,
      libelle: t('Station-service ou distributeur de gaz butane', 'Service station or butane gas distributor'),
      visible: (v) => toNumber(v.caTtc) > SEUILS_REGIMES.rme,
    },
  ],
  calcule(v) {
    const caTtc = Math.max(0, toNumber(v.caTtc));
    const notes = [];

    // Régime de la taxe communale de l'entreprenant.
    if (caTtc <= SEUILS_REGIMES.tce) {
      const taux = v.commerce ? TCE.tauxCommerce : TCE.tauxAutres;
      const taxe = caTtc * taux;
      return {
        lignes: [
          texte(t('Régime applicable', 'Applicable regime'), t("Taxe communale de l'entreprenant (TCE)", 'Municipal entrepreneur tax (TCE)')),
          money(t('Chiffre d’affaires annuel TTC', 'Annual turnover including tax'), caTtc),
          percent(t('Taux', 'Rate'), taux),
          money(t('Équivalent mensuel', 'Monthly equivalent'), taxe / 12),
        ],
        total: money(t('Taxe annuelle due', 'Annual tax due'), taxe, { accent: true }),
        notes: [
          t(
            "La TCE est représentative de la contribution des patentes, des licences et des taxes communales. Les très petits commerçants en étalage réalisant moins de 1 200 000 F peuvent être autorisés à acquitter une taxe journalière.",
            'The TCE stands in for the business licence, liquor licence and municipal taxes. Street traders below XOF 1,200,000 may be authorised to pay a daily tax instead.',
          ),
        ],
      };
    }

    // Régime de la taxe d'Etat de l'entreprenant.
    if (caTtc <= SEUILS_REGIMES.tee) {
      const tauxBase = v.commerce ? TEE.tauxCommerce : TEE.taux;
      const taux = v.cga ? tauxBase * TEE.reductionCga : tauxBase;
      const taxe = caTtc * taux;
      return {
        lignes: [
          texte(t('Régime applicable', 'Applicable regime'), t("Taxe d'Etat de l'entreprenant (TEE)", 'State entrepreneur tax (TEE)')),
          money(t('Chiffre d’affaires annuel TTC', 'Annual turnover including tax'), caTtc),
          percent(t('Taux appliqué', 'Applied rate'), taux),
          money(t('Versement mensuel (1/12e, le 10 du mois)', 'Monthly instalment (1/12, on the 10th)'), taxe / 12),
        ],
        total: money(t('Taxe annuelle due', 'Annual tax due'), taxe, { accent: true }),
        notes: [
          t(
            "La TEE est libératoire de la patente, de la TVA et de l'impôt sur les BIC. Pour les adhérents d'un CGA, le montant est réduit de moitié pendant toute la période d'adhésion.",
            'The TEE discharges the business licence, VAT and BIC tax. Members of an approved management centre pay half for the duration of their membership.',
          ),
        ],
      };
    }

    // Régime des microentreprises.
    if (caTtc <= SEUILS_REGIMES.rme) {
      const taux = v.cga ? RME.tauxCga : RME.taux;
      const impot = caTtc * taux;
      return {
        lignes: [
          texte(t('Régime applicable', 'Applicable regime'), t('Régime des microentreprises (RME)', 'Micro-enterprise regime (RME)')),
          money(t('Chiffre d’affaires annuel TTC', 'Annual turnover including tax'), caTtc),
          percent(t('Taux appliqué', 'Applied rate'), taux),
          money(t('Versement mensuel (1/12e, le 10 du mois)', 'Monthly instalment (1/12, on the 10th)'), impot / 12),
        ],
        total: money(t('Impôt annuel dû', 'Annual tax due'), impot, { accent: true }),
        notes: [
          t(
            "L'impôt des microentreprises est libératoire de la patente, de la TVA et de l'impôt sur les BIC. Le taux est de 4 % pour les adhérents d'un CGA ou les contribuables suivis par un expert-comptable conventionné.",
            'The micro-enterprise tax discharges the business licence, VAT and BIC tax. The rate is 4% for members of an approved management centre or taxpayers monitored by a chartered accountant under agreement.',
          ),
        ],
      };
    }

    // Régimes réels : RSI ou RNI.
    const rni = caTtc > SEUILS_REGIMES.rsi;
    const benefice = Math.max(0, toNumber(v.benefice));
    const tauxIs =
      v.secteur === 'telecomsTic' || v.secteur === 'jeuxHasard' ? TAUX_BIC[v.secteur] : TAUX_BIC.commun;
    const impotBic = benefice * tauxIs;

    let tauxImf = IMF.tauxCommun;
    if (rni && v.secteur === 'petrolier') tauxImf = IMF.tauxPetrolierEauElectriciteGaz;
    if (rni && v.secteur === 'banqueAssurance') tauxImf = IMF.tauxBanqueAssurance;

    const imfBrut = caTtc * tauxImf;
    const minimum = v.stationService ? IMF.minimumStationService : IMF.minimum;
    const imf = borner(imfBrut, {
      minimum,
      maximum: rni ? IMF.maximumRni : Infinity,
    });
    const du = Math.max(impotBic, imf);

    if (imfBrut < minimum) {
      notes.push(
        t(
          `L'IMF calculé (${arrondiFranc(imfBrut).toLocaleString('fr-FR')} F) est inférieur au minimum de perception : le minimum s'applique.`,
          `The computed minimum tax (XOF ${arrondiFranc(imfBrut).toLocaleString('en-US')}) is below the collection floor, so the floor applies.`,
        ),
      );
    }
    if (rni && imfBrut > IMF.maximumRni) {
      notes.push(
        t(
          "L'IMF est plafonné à 35 millions de francs au réel normal.",
          'The minimum flat tax is capped at XOF 35 million under the normal regime.',
        ),
      );
    }
    notes.push(
      t(
        "L'impôt minimum forfaitaire est dû lorsqu'il excède l'impôt sur les bénéfices : le simulateur retient le plus élevé des deux.",
        'The minimum flat tax applies where it exceeds the profits tax: the simulator keeps the higher of the two.',
      ),
    );

    return {
      lignes: [
        texte(
          t('Régime applicable', 'Applicable regime'),
          rni
            ? t('Réel normal d’imposition (RNI)', 'Normal actual-profit regime (RNI)')
            : t('Réel simplifié d’imposition (RSI)', 'Simplified actual-profit regime (RSI)'),
        ),
        money(t('Chiffre d’affaires annuel TTC', 'Annual turnover including tax'), caTtc),
        money(t('Bénéfice net imposable', 'Net taxable profit'), benefice),
        percent(t('Taux de l’impôt BIC', 'BIC tax rate'), tauxIs),
        money(t('Impôt sur les bénéfices', 'Profits tax'), impotBic),
        percent(t('Taux de l’IMF', 'Minimum flat tax rate'), tauxImf),
        money(t('IMF avant minimum/plafond', 'Minimum flat tax before floor/cap'), imfBrut, { sousLigne: true }),
        money(t('IMF retenu', 'Minimum flat tax retained'), imf),
      ],
      total: money(t('Cotisation due', 'Amount due'), du, { accent: true }),
      notes,
    };
  },
};

const bnc = {
  id: 'bnc',
  groupe: 'revenus',
  titre: t('Bénéfices non commerciaux (BNC)', 'Non-commercial profits (BNC)'),
  resume: t(
    "Impôt cédulaire sur les professions libérales et activités non commerciales, avec son impôt minimum forfaitaire propre.",
    'Schedular tax on the liberal professions and non-commercial activities, with its own minimum flat tax.',
  ),
  ref: 'Art. 85 à 102 du CGI',
  champs: [
    {
      nom: 'qualite',
      type: 'select',
      defaut: 'commun',
      libelle: t('Situation du contribuable', 'Taxpayer situation'),
      options: [
        { valeur: 'commun', libelle: t('Droit commun (25 %)', 'General regime (25%)') },
        { valeur: 'sansInstallation', libelle: t("Sans installation en Côte d'Ivoire (25 %)", "No establishment in Côte d'Ivoire (25%)") },
        { valeur: 'reassurance', libelle: t('Réassurance non domiciliée (12,5 % effectif)', 'Non-resident reinsurance (12.5% effective)') },
        { valeur: 'greffierNotaire', libelle: t('Greffier-notaire (50 % des honoraires)', 'Notary-registrar (50% of fees)') },
      ],
    },
    {
      nom: 'recettes',
      type: 'montant',
      defaut: 40000000,
      libelle: t('Recettes brutes TTC de l’exercice', 'Gross receipts including tax'),
    },
    {
      nom: 'benefice',
      type: 'montant',
      defaut: 15000000,
      libelle: t('Bénéfice net imposable', 'Net taxable profit'),
      visible: (v) => v.qualite === 'commun' || v.qualite === 'sansInstallation',
    },
  ],
  calcule(v) {
    const recettes = Math.max(0, toNumber(v.recettes));
    const benefice = Math.max(0, toNumber(v.benefice));
    const lignes = [money(t('Recettes brutes TTC', 'Gross receipts including tax'), recettes)];
    let impot = 0;
    let taux = BNC.taux;

    if (v.qualite === 'reassurance') {
      taux = BNC.tauxReassuranceNonDomiciliee;
      impot = recettes * taux;
      lignes.push(
        texte(
          t('Base imposable', 'Taxable base'),
          t('Encaissements bruts après déduction forfaitaire de 50 %', 'Gross collections after a flat 50% deduction'),
        ),
      );
    } else if (v.qualite === 'greffierNotaire') {
      taux = BNC.tauxGreffiersNotaires;
      impot = recettes * taux;
      lignes.push(
        texte(t('Base imposable', 'Taxable base'), t('Sommes perçues à titre d’honoraires', 'Amounts received as fees')),
      );
    } else {
      impot = benefice * taux;
      lignes.push(money(t('Bénéfice net imposable', 'Net taxable profit'), benefice));
    }

    const imfBrut = recettes * BNC.imfTaux;
    const imf = Math.max(imfBrut, BNC.imfMinimum);
    const du = Math.max(impot, imf);

    lignes.push(
      percent(t('Taux applicable', 'Applicable rate'), taux),
      money(t('Impôt sur les BNC', 'BNC tax'), impot),
      percent(t('Taux de l’IMF/BNC', 'BNC minimum flat tax rate'), BNC.imfTaux),
      money(t('IMF/BNC avant minimum', 'BNC minimum flat tax before floor'), imfBrut, { sousLigne: true }),
      money(t('IMF/BNC retenu (minimum 400 000 F)', 'BNC minimum flat tax retained (floor XOF 400,000)'), imf),
      money(t('Retenue à la source indicative (7,5 %)', 'Indicative withholding (7.5%)'), recettes * BNC.retenueSource),
    );

    return {
      lignes,
      total: money(t('Cotisation due', 'Amount due'), du, { accent: true }),
      notes: [
        t(
          "La retenue à la source de 7,5 % s'applique aux sommes brutes mises en paiement et s'impute sur l'impôt dû (Art. 92 et s. du CGI).",
          'The 7.5% withholding applies to gross amounts paid and is credited against the tax due (articles 92 et seq.).',
        ),
      ],
    };
  },
};

const foncier = {
  id: 'foncier',
  groupe: 'revenus',
  titre: t('Impôts fonciers', 'Property taxes'),
  resume: t(
    "Impôt sur le revenu foncier, impôt sur le patrimoine foncier bâti et non bâti, tarifs des exploitations agricoles.",
    'Rental income tax, tax on built and unbuilt property, and per-hectare rates for farms.',
  ),
  ref: 'Art. 149 à 166 du CGI',
  champs: [
    {
      nom: 'nature',
      type: 'select',
      defaut: 'locationBati',
      libelle: t('Nature du bien', 'Type of property'),
      options: [
        { valeur: 'locationBati', libelle: t('Immeuble donné en location', 'Property let out') },
        { valeur: 'batiNonProductif', libelle: t('Immeuble bâti non productif de revenus', 'Built property not generating income') },
        { valeur: 'nonBati', libelle: t('Terrain urbain non bâti', 'Unbuilt urban land') },
        { valeur: 'agricole', libelle: t('Exploitation agricole', 'Farm') },
      ],
    },
    {
      nom: 'qualite',
      type: 'select',
      defaut: 'physique',
      libelle: t('Qualité du propriétaire', 'Owner'),
      options: [
        { valeur: 'physique', libelle: t('Personne physique', 'Individual') },
        { valeur: 'morale', libelle: t('Entreprise ou personne morale', 'Company or legal entity') },
      ],
      visible: (v) => v.nature === 'locationBati',
    },
    {
      nom: 'valeurLocative',
      type: 'montant',
      defaut: 6000000,
      libelle: t('Valeur locative annuelle', 'Annual rental value'),
      visible: (v) => v.nature === 'locationBati',
    },
    {
      nom: 'valeurMarchande',
      type: 'montant',
      defaut: 50000000,
      libelle: t('Valeur marchande du bien', 'Market value of the property'),
      visible: (v) => v.nature === 'batiNonProductif' || v.nature === 'nonBati',
    },
    {
      nom: 'culture',
      type: 'select',
      defaut: 'hevea',
      libelle: t('Culture', 'Crop'),
      options: [
        { valeur: 'hevea', libelle: t('Hévéa (7 500 F/ha)', 'Rubber (XOF 7,500/ha)') },
        { valeur: 'cacao', libelle: t('Cacao, café, banane, ananas, coco, palmier, fleurs (5 000 F/ha)', 'Cocoa, coffee, banana, pineapple, coconut, palm, flowers (XOF 5,000/ha)') },
        { valeur: 'canneASucre', libelle: t('Canne à sucre, mangue, anacarde, citron, papaye (2 500 F/ha)', 'Sugar cane, mango, cashew, lemon, papaya (XOF 2,500/ha)') },
      ],
      visible: (v) => v.nature === 'agricole',
    },
    {
      nom: 'hectares',
      type: 'nombre',
      defaut: 150,
      libelle: t('Superficie plantée (hectares)', 'Planted area (hectares)'),
      visible: (v) => v.nature === 'agricole',
    },
  ],
  calcule(v) {
    const morale = v.qualite === 'morale';

    if (v.nature === 'locationBati') {
      const vl = Math.max(0, toNumber(v.valeurLocative));
      const tauxRevenu = morale ? FONCIER.revenuFoncier.personneMorale : FONCIER.revenuFoncier.personnePhysique;
      const tauxPatrimoine = morale ? FONCIER.patrimoineBati.personneMorale : FONCIER.patrimoineBati.personnePhysique;
      const revenuFoncier = vl * tauxRevenu;
      const patrimoine = vl * tauxPatrimoine;
      return {
        lignes: [
          money(t('Valeur locative annuelle', 'Annual rental value'), vl),
          percent(t('Taux de l’impôt sur le revenu foncier', 'Rental income tax rate'), tauxRevenu),
          money(t('Impôt sur le revenu foncier', 'Rental income tax'), revenuFoncier),
          percent(t('Taux de l’impôt sur le patrimoine foncier', 'Property wealth tax rate'), tauxPatrimoine),
          money(t('Impôt sur le patrimoine foncier bâti', 'Tax on built property'), patrimoine),
          percent(t('Charge fiscale globale', 'Overall burden'), tauxRevenu + tauxPatrimoine),
        ],
        total: money(t('Total des impôts fonciers', 'Total property taxes'), revenuFoncier + patrimoine, { accent: true }),
        notes: [
          t(
            'Les deux impôts se cumulent sur un immeuble productif de revenus fonciers (Art. 156 et 158 du CGI).',
            'Both taxes apply cumulatively to a property generating rental income (articles 156 and 158).',
          ),
        ],
      };
    }

    if (v.nature === 'batiNonProductif') {
      const vm = Math.max(0, toNumber(v.valeurMarchande));
      const impot = vm * FONCIER.patrimoineBatiNonProductif.taux;
      return {
        lignes: [
          money(t('Valeur marchande', 'Market value'), vm),
          percent(t('Taux', 'Rate'), FONCIER.patrimoineBatiNonProductif.taux),
        ],
        total: money(t('Impôt sur le patrimoine foncier', 'Property wealth tax'), impot, { accent: true }),
        notes: [
          t(
            "Taux de 0,5 % applicable notamment à l'habitation principale du propriétaire, à une résidence secondaire improductive, aux immeubles des entreprises et aux constructions non achevées (Art. 158 du CGI).",
            "The 0.5% rate covers the owner's main home, an unproductive second home, company-held buildings and unfinished constructions (article 158).",
          ),
        ],
      };
    }

    if (v.nature === 'nonBati') {
      const vm = Math.max(0, toNumber(v.valeurMarchande));
      const impot = vm * FONCIER.patrimoineNonBati.taux;
      return {
        lignes: [
          money(t('Valeur marchande', 'Market value'), vm),
          percent(t('Taux', 'Rate'), FONCIER.patrimoineNonBati.taux),
          money(t('Taxe de voirie, d’hygiène et d’assainissement (2 % de la valeur locative)', 'Road, hygiene and sanitation levy (2% of rental value)'), 0, { sousLigne: true }),
        ],
        total: money(t('Impôt sur le patrimoine foncier non bâti', 'Tax on unbuilt property'), impot, { accent: true }),
        notes: [
          t(
            'Taux ramené à 0,75 % pour les immeubles non bâtis improductifs du Port autonome de San Pedro (Art. 165 du CGI).',
            'The rate falls to 0.75% for unproductive unbuilt property of the San Pedro Port Authority (article 165).',
          ),
        ],
      };
    }

    const hectares = Math.max(0, toNumber(v.hectares));
    const tarif = TARIFS_AGRICOLES[v.culture] ?? TARIFS_AGRICOLES.cacao;
    const impot = hectares * tarif;
    return {
      lignes: [
        texte(t('Superficie plantée', 'Planted area'), `${hectares.toLocaleString('fr-FR')} ha`),
        money(t('Tarif par hectare planté', 'Rate per planted hectare'), tarif),
      ],
      total: money(t('Impôt foncier agricole annuel', 'Annual farm property tax'), impot, { accent: true }),
      notes: [
        t(
          "Tarifs applicables aux exploitations agro-industrielles et aux personnes physiques exploitant au moins 100 hectares (Art. 165 du CGI).",
          'Rates apply to agro-industrial estates and individuals farming at least 100 hectares (article 165).',
        ),
      ],
    };
  },
};

const patente = {
  id: 'patente',
  groupe: 'autres-directs',
  titre: t('Contribution des patentes', 'Business licence tax'),
  resume: t(
    "Droit sur le chiffre d'affaires plafonné par tranche de CA, complété par le droit sur la valeur locative.",
    'Turnover duty, capped by turnover band, plus the rental-value duty.',
  ),
  ref: 'Art. 264 à 278 du CGI',
  champs: [
    { nom: 'caHt', type: 'montant', defaut: 600000000, libelle: t('Chiffre d’affaires annuel HT', 'Annual turnover excluding tax') },
    { nom: 'valeurLocative', type: 'montant', defaut: 12000000, libelle: t('Valeur locative des locaux professionnels', 'Rental value of business premises') },
    {
      nom: 'exonereDvl',
      type: 'bool',
      defaut: false,
      libelle: t('Activité exonérée du droit sur la valeur locative', 'Activity exempt from the rental-value duty'),
      aide: t('Le droit sur le chiffre d’affaires passe alors à 0,7 %.', 'The turnover duty then rises to 0.7%.'),
    },
    {
      nom: 'horsCommune',
      type: 'bool',
      defaut: false,
      libelle: t('Établissement hors d’un périmètre communal', 'Establishment outside a municipal boundary'),
    },
  ],
  calcule(v) {
    const caHt = Math.max(0, toNumber(v.caHt));
    const vl = Math.max(0, toNumber(v.valeurLocative));
    const tauxDca = v.exonereDvl ? PATENTE.dcaTauxExonereValeurLocative : PATENTE.dcaTaux;
    const dcaBrut = caHt * tauxDca;
    const plafond = PATENTE.dcaPlafonds.find((p) => caHt <= p.plafondCa) ?? PATENTE.dcaPlafonds.at(-1);
    const dca = borner(dcaBrut, { minimum: PATENTE.dcaMinimum, maximum: plafond.maximum });

    const tauxDvl = v.horsCommune ? PATENTE.dvlTauxHorsCommune : PATENTE.dvlTaux;
    const dvlBrut = v.exonereDvl ? 0 : vl * tauxDvl;
    const plancherDvl = v.exonereDvl ? 0 : dca * PATENTE.dvlFractionMinimaleDuDca;
    const dvl = Math.max(dvlBrut, plancherDvl);

    const lignes = [
      percent(t('Taux du droit sur le chiffre d’affaires', 'Turnover duty rate'), tauxDca),
      money(t('DCA avant minimum/plafond', 'Turnover duty before floor/cap'), dcaBrut, { sousLigne: true }),
      money(t('Plafond applicable à cette tranche de CA', 'Cap for this turnover band'), plafond.maximum, { sousLigne: true }),
      money(t('Droit sur le chiffre d’affaires (DCA)', 'Turnover duty'), dca),
    ];
    if (!v.exonereDvl) {
      lignes.push(
        percent(t('Taux du droit sur la valeur locative', 'Rental-value duty rate'), tauxDvl),
        money(t('DVL calculé', 'Computed rental-value duty'), dvlBrut, { sousLigne: true }),
        money(t('Plancher : un tiers du DCA', 'Floor: one third of the turnover duty'), plancherDvl, { sousLigne: true }),
        money(t('Droit sur la valeur locative (DVL)', 'Rental-value duty'), dvl),
      );
    }

    return {
      lignes,
      total: money(t('Contribution des patentes', 'Business licence tax'), dca + dvl, { accent: true }),
      notes: [
        t(
          'Minimum du DCA : 300 000 F. Le DVL ne peut être inférieur au tiers du DCA (Art. 267, 268 et 278 du CGI). Les entreprises de transport relèvent de tarifs forfaitaires par véhicule.',
          'Turnover duty floor: XOF 300,000. The rental-value duty cannot be less than one third of the turnover duty (articles 267, 268 and 278). Transport businesses are taxed at flat per-vehicle rates.',
        ),
      ],
    };
  },
};

const capitaux = {
  id: 'capitaux',
  groupe: 'autres-directs',
  titre: t('Revenus de capitaux mobiliers (IRVM / IRC)', 'Investment income (IRVM / IRC)'),
  resume: t(
    "Impôt sur le revenu des valeurs mobilières et impôt sur le revenu des créances, retenus à la source.",
    'Tax on income from securities and tax on income from debt claims, both withheld at source.',
  ),
  ref: 'Art. 180 à 193 du CGI',
  champs: [
    {
      nom: 'nature',
      type: 'select',
      defaut: 'irvmCommun',
      libelle: t('Nature du revenu', 'Type of income'),
      options: [
        { valeur: 'irvmCommun', libelle: t('IRVM — taux de droit commun', 'IRVM — general rate') },
        { valeur: 'irvmBrvm', libelle: t('IRVM — dividendes de sociétés cotées à la BRVM', 'IRVM — dividends from BRVM-listed companies') },
        { valeur: 'irvmObligations', libelle: t('IRVM — obligations remboursables en 5 ans au moins', 'IRVM — bonds redeemable in 5 years or more') },
        { valeur: 'ircCommun', libelle: t('IRC — taux de droit commun', 'IRC — general rate') },
        { valeur: 'ircCompteCourant', libelle: t('IRC — comptes courants', 'IRC — current accounts') },
      ],
    },
    {
      nom: 'beneficiaire',
      type: 'select',
      defaut: 'morale',
      libelle: t('Bénéficiaire', 'Beneficiary'),
      options: [
        { valeur: 'morale', libelle: t('Personne morale / entreprise', 'Legal entity / company') },
        { valeur: 'physique', libelle: t('Personne physique / particulier', 'Individual') },
      ],
      visible: (v) => v.nature !== 'ircCommun',
    },
    { nom: 'montant', type: 'montant', defaut: 10000000, libelle: t('Montant brut distribué ou versé', 'Gross amount distributed or paid') },
  ],
  calcule(v) {
    const montant = Math.max(0, toNumber(v.montant));
    const physique = v.beneficiaire === 'physique';
    let taux;
    let libelleImpot;

    switch (v.nature) {
      case 'irvmBrvm':
        taux = physique ? IRVM.brvm.physique : IRVM.brvm.morale;
        libelleImpot = t('IRVM — dividendes BRVM', 'IRVM — BRVM dividends');
        break;
      case 'irvmObligations':
        taux = physique ? IRVM.obligations5Ans.physique : IRVM.obligations5Ans.morale;
        libelleImpot = t('IRVM — obligations', 'IRVM — bonds');
        break;
      case 'ircCommun':
        taux = IRC.commun;
        libelleImpot = t('IRC — droit commun', 'IRC — general rate');
        break;
      case 'ircCompteCourant':
        taux = physique ? IRC.compteCourantParticulier : IRC.compteCourantEntreprise;
        libelleImpot = t('IRC — compte courant', 'IRC — current account');
        break;
      default:
        taux = physique ? IRVM.commun.physique : IRVM.commun.morale;
        libelleImpot = t('IRVM — droit commun', 'IRVM — general rate');
    }

    const impot = montant * taux;
    return {
      lignes: [
        texte(t('Impôt appliqué', 'Tax applied'), libelleImpot),
        money(t('Montant brut', 'Gross amount'), montant),
        percent(t('Taux de la retenue', 'Withholding rate'), taux),
        money(t('Montant net perçu', 'Net amount received'), montant - impot),
      ],
      total: money(t('Retenue à la source', 'Tax withheld'), impot, { accent: true }),
      notes: [
        t(
          "Les comptes de dépôts supportent un taux variable selon la durée du dépôt : de 1 % à 13,5 % pour les particuliers, de 1 % à 16,5 % pour les entreprises (Art. 193 du CGI).",
          'Deposit accounts bear a rate that varies with the term: 1% to 13.5% for individuals, 1% to 16.5% for companies (article 193).',
        ),
      ],
    };
  },
};

/* ------------------------------------------------------------------ *
 * Titre II — Taxes indirectes et assimilées
 * ------------------------------------------------------------------ */

const tva = {
  id: 'tva',
  groupe: 'indirectes',
  titre: t('TVA et taxe sur les opérations bancaires', 'VAT and banking transactions tax'),
  resume: t(
    "Conversion HT/TTC aux taux de 18 % et 9 % pour la TVA, 10 % et 5 % pour la TOB.",
    'Conversion between amounts excluding and including tax at 18% and 9% VAT, 10% and 5% banking tax.',
  ),
  ref: 'Art. 339 à 401 du CGI',
  champs: [
    {
      nom: 'taxe',
      type: 'select',
      defaut: 'tvaCommun',
      libelle: t('Taxe applicable', 'Applicable tax'),
      options: [
        { valeur: 'tvaCommun', libelle: t('TVA — taux de droit commun (18 %)', 'VAT — general rate (18%)') },
        { valeur: 'tvaReduit', libelle: t('TVA — taux réduit (9 %)', 'VAT — reduced rate (9%)') },
        { valeur: 'tobCommun', libelle: t('TOB — taux de droit commun (10 %)', 'Banking tax — general rate (10%)') },
        { valeur: 'tobReduit', libelle: t('TOB — taux particulier PME (5 %)', 'Banking tax — SME rate (5%)') },
      ],
    },
    {
      nom: 'sens',
      type: 'select',
      defaut: 'htVersTtc',
      libelle: t('Sens du calcul', 'Direction'),
      options: [
        { valeur: 'htVersTtc', libelle: t('Du montant HT vers le TTC', 'From amount excluding tax to including tax') },
        { valeur: 'ttcVersHt', libelle: t('Du montant TTC vers le HT', 'From amount including tax to excluding tax') },
      ],
    },
    { nom: 'montant', type: 'montant', defaut: 1000000, libelle: t('Montant', 'Amount') },
  ],
  calcule(v) {
    const montant = Math.max(0, toNumber(v.montant));
    const taux =
      v.taxe === 'tvaReduit' ? TVA.reduit : v.taxe === 'tobCommun' ? TOB.commun : v.taxe === 'tobReduit' ? TOB.reduitPme : TVA.commun;
    const ht = v.sens === 'ttcVersHt' ? horsTaxes(montant, taux) : montant;
    const taxe = ht * taux;

    return {
      lignes: [
        percent(t('Taux appliqué', 'Applied rate'), taux),
        money(t('Montant hors taxes', 'Amount excluding tax'), ht),
        money(t('Montant toutes taxes comprises', 'Amount including tax'), ht + taxe),
      ],
      total: money(t('Taxe due', 'Tax due'), taxe, { accent: true }),
      notes: [
        t(
          "Le taux réduit de 9 % vise le lait (hors yaourts et autres produits laitiers), le lait infantile, les pâtes alimentaires à base de semoule de blé dur à 100 % et les produits pétroliers (Art. 359 du CGI).",
          'The 9% reduced rate covers milk (excluding yoghurt and other dairy products), infant milk, 100% durum-wheat pasta and petroleum products (article 359).',
        ),
      ],
    };
  },
};

const accises = {
  id: 'accises',
  groupe: 'indirectes',
  titre: t('Droits d’accises et taxes spécifiques', 'Excise duties and specific taxes'),
  resume: t(
    "Taxes spéciales sur les boissons, les tabacs, les cosmétiques, les cartouches, les produits pétroliers et l'eau.",
    'Special taxes on drinks, tobacco, cosmetics, cartridges, petroleum products and water.',
  ),
  ref: 'Art. 403 à 418 du CGI',
  champs: [
    {
      nom: 'produit',
      type: 'select',
      defaut: 'bieresCidres',
      libelle: t('Produit', 'Product'),
      options: [
        { valeur: 'champagne', libelle: t('Champagnes, vins AC et mousseux (40 %)', 'Champagne, AC and sparkling wines (40%)') },
        { valeur: 'vinsOrdinaires', libelle: t('Vins ordinaires (35 %)', 'Ordinary wines (35%)') },
        { valeur: 'bieresCidres', libelle: t('Bières et cidres (17 %)', 'Beers and ciders (17%)') },
        { valeur: 'alcoolMoins35', libelle: t('Autres alcools < 35° (40 %)', 'Other spirits below 35° (40%)') },
        { valeur: 'alcool35EtPlus', libelle: t('Autres alcools ≥ 35° (45 %)', 'Other spirits at or above 35° (45%)') },
        { valeur: 'energisantes', libelle: t('Boissons énergétiques et non alcoolisées (14 %)', 'Energy and soft drinks (14%)') },
        { valeur: 'tabacs', libelle: t('Tabacs et succédanés (57 % + 7 % sport + 2 % solidarité)', 'Tobacco and substitutes (57% + 7% sport + 2% solidarity)') },
        { valeur: 'cosmetiques', libelle: t('Marbres, véhicules ≥ 13 CV, parfums et cosmétiques (10 %)', 'Marble, vehicles of 13 hp or more, perfumes and cosmetics (10%)') },
        { valeur: 'hydroquinone', libelle: t('Cosmétiques contenant de l’hydroquinone (15 %)', 'Cosmetics containing hydroquinone (15%)') },
        { valeur: 'cartouches', libelle: t('Cartouches (12 F l’unité)', 'Cartridges (XOF 12 each)') },
        { valeur: 'superCarburant', libelle: t('Super carburant (85 F/litre)', 'Premium fuel (XOF 85/litre)') },
        { valeur: 'essenceAuto', libelle: t('Essence auto (75 F/litre)', 'Motor petrol (XOF 75/litre)') },
        { valeur: 'gasoil', libelle: t('Gasoil et huiles minérales (25 F/litre)', 'Diesel and mineral oils (XOF 25/litre)') },
        { valeur: 'ddo', libelle: t('Distillate Diesel-Oil (45 F/kg)', 'Distillate Diesel-Oil (XOF 45/kg)') },
        { valeur: 'eauNormale', libelle: t('Eau — tranche normale (165 F/m³)', 'Water — standard band (XOF 165/m³)') },
        { valeur: 'eauIndustrielle', libelle: t('Eau — tranche industrielle (221 F/m³)', 'Water — industrial band (XOF 221/m³)') },
      ],
    },
    {
      nom: 'base',
      type: 'montant',
      defaut: 5000000,
      libelle: t('Base taxable (prix de vente HT ou valeur en douane)', 'Taxable base (price excluding tax or customs value)'),
      visible: (v) => ACCISES_AD_VALOREM[v.produit] !== undefined,
    },
    {
      nom: 'quantite',
      type: 'nombre',
      defaut: 1000,
      libelle: t('Quantité (litres, kg, m³ ou unités)', 'Quantity (litres, kg, m³ or units)'),
      visible: (v) => ACCISES_SPECIFIQUES[v.produit] !== undefined,
    },
  ],
  calcule(v) {
    const adValorem = ACCISES_AD_VALOREM[v.produit];
    if (adValorem !== undefined) {
      const base = Math.max(0, toNumber(v.base));
      if (v.produit === 'tabacs') {
        const accise = base * ACCISES.tabacs;
        const sport = base * ACCISES.tabacSport;
        const sida = base * ACCISES.tabacSolidariteSida;
        return {
          lignes: [
            money(t('Base taxable', 'Taxable base'), base),
            money(t('Taxe spéciale sur les tabacs (57 %)', 'Special tobacco tax (57%)'), accise),
            money(t('Taxe pour le développement du sport (7 %)', 'Sport development tax (7%)'), sport),
            money(t('Taxe de solidarité SIDA et tabagisme (2 %)', 'AIDS and tobacco solidarity tax (2%)'), sida),
            money(t('Coût TTC hors TVA', 'Cost including excise, before VAT'), base + accise + sport + sida),
          ],
          total: money(t('Total des taxes spécifiques', 'Total specific taxes'), accise + sport + sida, { accent: true }),
          notes: [
            t(
              "Le prix de vente ne peut être inférieur à 20 000 francs les 1 000 cigarettes (Art. 418 du CGI).",
              'The selling price cannot be less than XOF 20,000 per 1,000 cigarettes (article 418).',
            ),
          ],
        };
      }
      const taxe = base * adValorem;
      return {
        lignes: [
          money(t('Base taxable', 'Taxable base'), base),
          percent(t('Taux', 'Rate'), adValorem),
          money(t('Coût après accise', 'Cost after excise'), base + taxe),
        ],
        total: money(t('Droit d’accise', 'Excise duty'), taxe, { accent: true }),
        notes: [],
      };
    }

    const tarif = ACCISES_SPECIFIQUES[v.produit];
    const quantite = Math.max(0, toNumber(v.quantite));
    const taxe = quantite * tarif;
    return {
      lignes: [
        texte(t('Quantité', 'Quantity'), quantite.toLocaleString('fr-FR')),
        money(t('Tarif unitaire', 'Unit rate'), tarif),
      ],
      total: money(t('Taxe spécifique due', 'Specific tax due'), taxe, { accent: true }),
      notes: [
        t(
          "La taxe spécifique unique sur les produits pétroliers s'applique par litre à 15 °C ou par kilogramme (Art. 408 du CGI).",
          'The single specific tax on petroleum products applies per litre at 15°C or per kilogram (article 408).',
        ),
      ],
    };
  },
};

/** Produits taxés à un taux ad valorem. */
const ACCISES_AD_VALOREM = {
  champagne: ACCISES.boissons.champagne,
  vinsOrdinaires: ACCISES.boissons.vinsOrdinaires,
  bieresCidres: ACCISES.boissons.bieresCidres,
  alcoolMoins35: ACCISES.boissons.alcoolMoins35,
  alcool35EtPlus: ACCISES.boissons.alcool35EtPlus,
  energisantes: ACCISES.boissons.energisantes,
  tabacs: ACCISES.tabacs,
  cosmetiques: ACCISES.marbreVehiculesCosmetiques,
  hydroquinone: ACCISES.cosmetiquesHydroquinone,
};

/** Produits taxés à un tarif unitaire. */
const ACCISES_SPECIFIQUES = {
  cartouches: ACCISES.cartouche,
  superCarburant: ACCISES.produitsPetroliers.superCarburant,
  essenceAuto: ACCISES.produitsPetroliers.essenceAuto,
  gasoil: ACCISES.produitsPetroliers.gasoil,
  ddo: ACCISES.produitsPetroliers.ddo,
  eauNormale: ACCISES.eau.normale,
  eauIndustrielle: ACCISES.eau.industrielle,
};

const assurance = {
  id: 'assurance',
  groupe: 'indirectes',
  titre: t('Taxe sur les contrats d’assurance', 'Insurance contracts tax'),
  resume: t(
    "Taxe assise sur les primes d'assurance, au tarif de l'assurance classique ou de la microassurance.",
    'Tax levied on insurance premiums, at conventional-insurance or microinsurance rates.',
  ),
  ref: 'Art. 422 à 425 du CGI',
  champs: [
    {
      nom: 'regime',
      type: 'select',
      defaut: 'classique',
      libelle: t('Régime', 'Regime'),
      options: [
        { valeur: 'classique', libelle: t('Assurance classique', 'Conventional insurance') },
        { valeur: 'micro', libelle: t('Microassurance', 'Microinsurance') },
      ],
    },
    {
      nom: 'risque',
      type: 'select',
      defaut: 'automobile',
      libelle: t('Nature du risque', 'Type of risk'),
      options: [
        { valeur: 'automobile', libelle: t('Risque automobile', 'Motor risk') },
        { valeur: 'incendie', libelle: t('Incendie', 'Fire') },
        { valeur: 'incendieEdificesReligieux', libelle: t('Incendie — édifices religieux', 'Fire — places of worship') },
        { valeur: 'maritimeFluvialeAerienne', libelle: t('Maritime, fluviale et aérienne', 'Marine, river and air') },
        { valeur: 'maladie', libelle: t('Maladie (individuelle)', 'Health (individual)') },
        { valeur: 'maladieGroupe', libelle: t('Maladie de groupe', 'Group health') },
        { valeur: 'rentesViageres', libelle: t('Contrat de rentes viagères', 'Life annuity contract') },
        { valeur: 'creditsExport', libelle: t('Crédits à l’exportation', 'Export credit') },
        { valeur: 'volEdificesReligieux', libelle: t('Vol — édifices religieux', 'Theft — places of worship') },
        { valeur: 'autresRisques', libelle: t('Autres risques', 'Other risks') },
      ],
    },
    { nom: 'prime', type: 'montant', defaut: 500000, libelle: t('Prime d’assurance', 'Insurance premium') },
  ],
  calcule(v) {
    const prime = Math.max(0, toNumber(v.prime));
    const bareme = v.regime === 'micro' ? ASSURANCE.micro : ASSURANCE.classique;
    const taux = bareme[v.risque] ?? bareme.autresRisques;
    const taxe = prime * taux;

    return {
      lignes: [
        money(t('Prime', 'Premium'), prime),
        percent(t('Taux de la taxe', 'Tax rate'), taux),
        money(t('Coût total pour l’assuré', 'Total cost to the policyholder'), prime + taxe),
      ],
      total: money(t('Taxe due', 'Tax due'), taxe, { accent: true }),
      notes: [
        t(
          "Sont exonérés notamment les conventions de réassurance, l'assurance-vie, les actes contre les accidents du travail et les contrats garantissant les risques agricoles (Art. 424 et 425 du CGI).",
          'Exemptions include reinsurance agreements, life insurance, workplace-accident cover and contracts covering agricultural risks (articles 424 and 425).',
        ),
      ],
    };
  },
};

/* ------------------------------------------------------------------ *
 * Titres III et IV — Droits d'enregistrement et de timbre
 * ------------------------------------------------------------------ */

const enregistrement = {
  id: 'enregistrement',
  groupe: 'enregistrement',
  titre: t('Droits d’enregistrement et de mutation', 'Registration and transfer duties'),
  resume: t(
    "Droits exigibles sur les ventes, échanges, baux, partages et actes de formation de sociétés.",
    'Duties on sales, exchanges, leases, partitions and company incorporation deeds.',
  ),
  ref: 'Art. 539 à 765 du CGI',
  champs: [
    {
      nom: 'operation',
      type: 'select',
      defaut: 'venteImmeuble',
      libelle: t('Nature de l’opération', 'Type of transaction'),
      options: [
        { valeur: 'venteImmeuble', libelle: t('Vente d’immeuble — droit commun (4 %)', 'Sale of property — general rate (4%)') },
        { valeur: 'venteImmeubleEtranger', libelle: t('Vente d’immeuble situé à l’étranger (1,5 %)', 'Sale of property located abroad (1.5%)') },
        { valeur: 'venteImmeubleAssociationCaritative', libelle: t('Immeuble acquis par une association caritative (2 %)', 'Property acquired by a charity (2%)') },
        { valeur: 'venteImmeubleCreditBailleur', libelle: t('Immeuble acquis par un crédit-bailleur (2 %)', 'Property acquired by a lessor (2%)') },
        { valeur: 'venteImmeubleLeveeOption', libelle: t('Levée d’option de crédit-bail immobilier (1 %)', 'Exercise of a property lease option (1%)') },
        { valeur: 'plusValueCessionImmeuble', libelle: t('Plus-value de cession d’immeuble (15 %)', 'Capital gain on property disposal (15%)') },
        { valeur: 'venteFondsDeCommerce', libelle: t('Vente de fonds de commerce (10 %)', 'Sale of a business (10%)') },
        { valeur: 'venteDroitsSociaux', libelle: t('Vente de droits sociaux (10 %)', 'Sale of corporate rights (10%)') },
        { valeur: 'venteMeublesTarifGeneral', libelle: t('Vente de meubles — tarif général (25 000 F)', 'Sale of movables — general rate (XOF 25,000)') },
        { valeur: 'echangeSansRetour', libelle: t('Échange d’immeubles sans retour (3 %)', 'Exchange of properties without balancing payment (3%)') },
        { valeur: 'echangeAvecRetour', libelle: t('Échange avec retour (2 %)', 'Exchange with balancing payment (2%)') },
        { valeur: 'bailLimiteImmeuble', libelle: t('Bail écrit à durée limitée — immeuble (2,5 %)', 'Written fixed-term lease — property (2.5%)') },
        { valeur: 'bailCreditBail', libelle: t('Loyers de crédit-bail (1,5 %)', 'Finance-lease rentals (1.5%)') },
        { valeur: 'bailIllimiteImmeuble', libelle: t('Bail à durée illimitée ou à vie — immeuble (10 %)', 'Unlimited or life lease — property (10%)') },
        { valeur: 'bailLimiteMeubles', libelle: t('Bail de meubles (25 000 F)', 'Lease of movables (XOF 25,000)') },
        { valeur: 'partage', libelle: t('Partage (1 %)', 'Partition (1%)') },
        { valeur: 'donationUtilitePublique', libelle: t('Dons et legs aux organismes d’utilité publique (1 %)', 'Gifts and bequests to public-interest bodies (1%)') },
        { valeur: 'formationSociete', libelle: t('Acte de formation de société (0,3 % / 0,1 %)', 'Company incorporation deed (0.3% / 0.1%)') },
        { valeur: 'succession', libelle: t('Succession (1 % à 12 %)', 'Inheritance (1% to 12%)') },
      ],
    },
    { nom: 'valeur', type: 'montant', defaut: 50000000, libelle: t('Valeur ou prix de l’opération', 'Value or price of the transaction') },
  ],
  calcule(v) {
    const valeur = Math.max(0, toNumber(v.valeur));
    const notes = [];

    if (v.operation === 'venteMeublesTarifGeneral' || v.operation === 'bailLimiteMeubles') {
      const droit = MUTATION.venteMeublesTarifGeneral;
      return {
        lignes: [money(t('Valeur déclarée', 'Declared value'), valeur), texte(t('Type de droit', 'Type of duty'), t('Droit fixe', 'Fixed duty'))],
        total: money(t('Droit dû', 'Duty due'), droit, { accent: true }),
        notes: [t('Art. 703-20° et 703-26 du CGI.', 'Articles 703-20 and 703-26 of the Tax Code.')],
      };
    }

    if (v.operation === 'formationSociete') {
      const taux =
        valeur > MUTATION.seuilCapitalFormationSociete
          ? MUTATION.formationSocieteAudela5Md
          : MUTATION.formationSocieteJusqua5Md;
      const droit = valeur * taux;
      return {
        lignes: [
          money(t('Capital social', 'Share capital'), valeur),
          percent(t('Taux applicable', 'Applicable rate'), taux),
        ],
        total: money(t('Droit d’enregistrement', 'Registration duty'), droit, { accent: true }),
        notes: [
          t(
            'Capital de 0 à 5 milliards : 0,3 %. Au-delà de 5 milliards : 0,1 % (Art. 754 du CGI).',
            'Capital from 0 to XOF 5 billion: 0.3%. Above XOF 5 billion: 0.1% (article 754).',
          ),
        ],
      };
    }

    if (v.operation === 'succession') {
      if (valeur < MUTATION.successionSeuilExoneration) {
        return {
          lignes: [money(t('Actif brut successoral', 'Gross estate'), valeur)],
          total: money(t('Droit dû', 'Duty due'), 0, { accent: true }),
          notes: [
            t(
              'Les successions comportant un actif brut inférieur à 300 000 francs sont exonérées (Art. 654 du CGI).',
              'Estates with a gross value below XOF 300,000 are exempt (article 654).',
            ),
          ],
        };
      }
      return {
        lignes: [
          money(t('Actif brut successoral', 'Gross estate'), valeur),
          money(t('Droit au taux plancher de 1 %', 'Duty at the 1% floor rate'), valeur * MUTATION.successionMin),
          money(t('Droit au taux plafond de 12 %', 'Duty at the 12% ceiling rate'), valeur * MUTATION.successionMax),
        ],
        total: texte(
          t('Fourchette applicable', 'Applicable range'),
          t('1 % à 12 % selon le lien de parenté', '1% to 12% depending on the degree of kinship'),
          { accent: true },
        ),
        notes: [
          t(
            "Le tarif exact des mutations à titre gratuit dépend du lien de parenté et de la part recueillie (Art. 735 du CGI) ; le document de référence n'en publie que la fourchette.",
            'The exact rate for gratuitous transfers depends on kinship and the share received (article 735); the source document publishes only the range.',
          ),
        ],
      };
    }

    const taux = MUTATION[v.operation];
    const droit = valeur * taux;
    if (v.operation === 'plusValueCessionImmeuble') {
      notes.push(
        t(
          "Taux réservé aux plus-values réalisées par les personnes physiques ou sociétés de personnes non passibles de l'impôt sur les bénéfices (Art. 762 du CGI).",
          'This rate applies to gains realised by individuals or partnerships not liable to profits tax (article 762).',
        ),
      );
    }

    return {
      lignes: [
        money(t('Assiette', 'Tax base'), valeur),
        percent(t('Taux applicable', 'Applicable rate'), taux),
        money(t('Coût total de l’opération', 'Total cost of the transaction'), valeur + droit),
      ],
      total: money(t('Droit d’enregistrement', 'Registration duty'), droit, { accent: true }),
      notes,
    };
  },
};

const timbre = {
  id: 'timbre',
  groupe: 'timbre',
  titre: t('Droits de timbre', 'Stamp duties'),
  resume: t(
    "Timbre de quittance par tranche de montant, timbre proportionnel et timbre de dimension.",
    'Receipt stamp duty by amount band, proportional stamp duty and dimension stamp duty.',
  ),
  ref: 'Art. 805 à 873 du CGI',
  champs: [
    { nom: 'montant', type: 'montant', defaut: 750000, libelle: t('Montant de la quittance', 'Amount of the receipt') },
    {
      nom: 'proportionnel',
      type: 'select',
      defaut: 'aucun',
      libelle: t('Timbre proportionnel', 'Proportional stamp duty'),
      options: [
        { valeur: 'aucun', libelle: t('Sans objet', 'Not applicable') },
        { valeur: 'haut', libelle: t('1 % (Art. 852 du CGI)', '1% (article 852)') },
        { valeur: 'bas', libelle: t('0,25 % (Art. 853 du CGI)', '0.25% (article 853)') },
      ],
    },
  ],
  calcule(v) {
    const montant = Math.max(0, toNumber(v.montant));
    const tranche = trancheFixe(montant, TIMBRE_QUITTANCE);
    const tauxProportionnel =
      v.proportionnel === 'haut' ? TIMBRE.proportionnelHaut : v.proportionnel === 'bas' ? TIMBRE.proportionnelBas : 0;
    const proportionnel = montant * tauxProportionnel;

    const lignes = [
      money(t('Montant de la quittance', 'Amount of the receipt'), montant),
      money(t('Timbre de quittance', 'Receipt stamp duty'), tranche.droit),
    ];
    if (tauxProportionnel > 0) {
      lignes.push(
        percent(t('Taux du timbre proportionnel', 'Proportional stamp rate'), tauxProportionnel),
        money(t('Timbre proportionnel', 'Proportional stamp duty'), proportionnel),
      );
    }
    lignes.push(
      texte(
        t('Timbre de dimension', 'Dimension stamp duty'),
        t('De 1 000 F à 4 000 F selon le format (Art. 835 du CGI)', 'From XOF 1,000 to 4,000 depending on format (article 835)'),
      ),
    );

    return {
      lignes,
      total: money(t('Droits de timbre dus', 'Stamp duties due'), tranche.droit + proportionnel, { accent: true }),
      notes: [
        t(
          'Les quittances de 0 à 5 000 francs sont exonérées du timbre de quittance (Art. 873 du CGI).',
          'Receipts from XOF 0 to 5,000 are exempt from the receipt stamp duty (article 873).',
        ),
      ],
    };
  },
};

/* ------------------------------------------------------------------ *
 * Titre V — Contributions diverses
 * ------------------------------------------------------------------ */

const prelevements = {
  id: 'prelevements',
  groupe: 'diverses',
  titre: t('Acomptes, prélèvements et taxes diverses', 'Prepayments, withholdings and miscellaneous taxes'),
  resume: t(
    "AIRSI, acompte sur les prestataires du secteur informel, taxe spéciale d'équipement, taxes sectorielles et redevances.",
    'AIRSI, withholding on informal-sector service providers, special equipment tax, sector taxes and fees.',
  ),
  ref: 'Art. 84 bis, 421, 1084 à 1130 du CGI',
  champs: [
    {
      nom: 'nature',
      type: 'select',
      defaut: 'airsiNormal',
      libelle: t('Prélèvement', 'Levy'),
      options: [
        { valeur: 'airsiNormal', libelle: t('AIRSI — taux normal (5 %)', 'AIRSI — standard rate (5%)') },
        { valeur: 'airsiReduit2', libelle: t('AIRSI — taux réduit (2 %)', 'AIRSI — reduced rate (2%)') },
        { valeur: 'airsiReduit15', libelle: t('AIRSI — taux réduit (1,5 %)', 'AIRSI — reduced rate (1.5%)') },
        { valeur: 'airsiReduit02', libelle: t('AIRSI — taux réduit (0,2 %)', 'AIRSI — reduced rate (0.2%)') },
        { valeur: 'acomptePrestataires', libelle: t('Acompte sur prestataires du secteur informel (2 %)', 'Withholding on informal-sector providers (2%)') },
        { valeur: 'taxeSpecialeEquipement', libelle: t('Taxe spéciale d’équipement (0,1 % du CA HT)', 'Special equipment tax (0.1% of turnover)') },
        { valeur: 'taxeTelecoms', libelle: t('Taxe sur les télécommunications et le transfert d’argent (5 %)', 'Telecommunications and money-transfer tax (5%)') },
        { valeur: 'taxeNtRurales', libelle: t('Taxe nouvelles technologies en zones rurales (2 %)', 'Rural new-technologies tax (2%)') },
        { valeur: 'prelevementCulture', libelle: t('Prélèvement pour la promotion de la culture (0,2 %)', 'Cultural promotion levy (0.2%)') },
        { valeur: 'taxePublicite', libelle: t('Taxe sur la publicité (3 % du CA HT)', 'Advertising tax (3% of turnover)') },
        { valeur: 'redevanceEvaluation', libelle: t('Redevance d’évaluation immobilière (1 %, min. 50 000 F)', 'Property valuation fee (1%, min. XOF 50,000)') },
        { valeur: 'transportPrive', libelle: t('Taxe spéciale sur les transports privés de marchandises', 'Special tax on private goods transport') },
      ],
    },
    {
      nom: 'base',
      type: 'montant',
      defaut: 20000000,
      libelle: t('Base taxable', 'Taxable base'),
      visible: (v) => v.nature !== 'transportPrive',
    },
    {
      nom: 'charge',
      type: 'nombre',
      defaut: 5,
      libelle: t('Charge utile du véhicule (tonnes)', 'Vehicle payload (tonnes)'),
      visible: (v) => v.nature === 'transportPrive',
    },
    {
      nom: 'vehicules',
      type: 'nombre',
      defaut: 1,
      libelle: t('Nombre de véhicules', 'Number of vehicles'),
      visible: (v) => v.nature === 'transportPrive',
    },
  ],
  calcule(v) {
    if (v.nature === 'transportPrive') {
      const tarif = PRELEVEMENTS.taxeTransportPriveMarchandises;
      const charge = Math.max(0, toNumber(v.charge));
      const vehicules = Math.max(0, toNumber(v.vehicules));
      const supplement = Math.max(0, Math.ceil(charge - tarif.seuilTonnes)) * tarif.majorationParTonne;
      const parVehicule = tarif.base + supplement;
      return {
        lignes: [
          money(t('Tarif de base (charge utile ≤ 3 tonnes)', 'Base rate (payload up to 3 tonnes)'), tarif.base),
          money(t('Majoration par tonne supplémentaire', 'Surcharge per additional tonne'), supplement),
          money(t('Taxe par véhicule', 'Tax per vehicle'), parVehicule),
        ],
        total: money(t('Taxe annuelle due', 'Annual tax due'), parVehicule * vehicules, { accent: true }),
        notes: [
          t(
            "Toute fraction de tonne au-delà de 3 tonnes est comptée pour une tonne entière (Art. 1117 du CGI).",
            'Any fraction of a tonne above 3 tonnes counts as a full tonne (article 1117).',
          ),
        ],
      };
    }

    const base = Math.max(0, toNumber(v.base));
    const tauxParNature = {
      airsiNormal: PRELEVEMENTS.airsiNormal.taux,
      airsiReduit2: PRELEVEMENTS.airsiReduits[2],
      airsiReduit15: PRELEVEMENTS.airsiReduits[1],
      airsiReduit02: PRELEVEMENTS.airsiReduits[0],
      acomptePrestataires: PRELEVEMENTS.acomptePrestatairesInformel.taux,
      taxeSpecialeEquipement: PRELEVEMENTS.taxeSpecialeEquipement.taux,
      taxeTelecoms: PRELEVEMENTS.taxeTelecoms.taux,
      taxeNtRurales: PRELEVEMENTS.taxeNouvellesTechnologiesRurales.taux,
      prelevementCulture: PRELEVEMENTS.prelevementCulture.taux,
      taxePublicite: PRELEVEMENTS.taxePublicite.taux,
      redevanceEvaluation: PRELEVEMENTS.redevanceEvaluationImmobiliere.taux,
    };
    const taux = tauxParNature[v.nature] ?? 0;
    const brut = base * taux;
    const montant =
      v.nature === 'redevanceEvaluation'
        ? Math.max(brut, PRELEVEMENTS.redevanceEvaluationImmobiliere.minimum)
        : brut;

    const lignes = [money(t('Base taxable', 'Taxable base'), base), percent(t('Taux', 'Rate'), taux)];
    if (v.nature === 'redevanceEvaluation' && brut < PRELEVEMENTS.redevanceEvaluationImmobiliere.minimum) {
      lignes.push(
        money(t('Montant calculé', 'Computed amount'), brut, { sousLigne: true }),
        money(t('Minimum de perception', 'Collection floor'), PRELEVEMENTS.redevanceEvaluationImmobiliere.minimum, { sousLigne: true }),
      );
    }
    if (v.nature === 'taxeTelecoms' || v.nature === 'taxeNtRurales' || v.nature === 'prelevementCulture') {
      lignes.push(money(t('Équivalent annuel (base mensuelle)', 'Annual equivalent (monthly base)'), montant * 12));
    }

    return {
      lignes,
      total: money(t('Montant dû', 'Amount due'), montant, { accent: true }),
      notes: [
        t(
          "L'AIRSI est prélevé par les importateurs et commerçants sur les ventes faites aux contribuables relevant de la TEE, de la TCE ou du régime des microentreprises ; les achats des entreprises soumises à un régime réel en sont exonérés.",
          'AIRSI is withheld by importers and traders on sales to taxpayers under the TEE, TCE or micro-enterprise regimes; purchases by taxpayers under an actual-profit regime are exempt.',
        ),
      ],
    };
  },
};

/** Regroupement des simulateurs par titre du CGI. */
export const GROUPES = [
  { id: 'revenus', libelle: t('Titre I — Impôts sur les revenus', 'Title I — Income taxes') },
  { id: 'autres-directs', libelle: t('Titre I — Autres impôts directs', 'Title I — Other direct taxes') },
  { id: 'indirectes', libelle: t('Titre II — Taxes indirectes', 'Title II — Indirect taxes') },
  { id: 'enregistrement', libelle: t('Titre III — Droits d’enregistrement', 'Title III — Registration duties') },
  { id: 'timbre', libelle: t('Titre IV — Droits de timbre', 'Title IV — Stamp duties') },
  { id: 'diverses', libelle: t('Titre V — Contributions diverses', 'Title V — Miscellaneous contributions') },
];

/** Liste ordonnée des simulateurs. */
export const CALCULATEURS = [
  its,
  chargesEmployeur,
  igr,
  bic,
  bnc,
  foncier,
  patente,
  capitaux,
  tva,
  accises,
  assurance,
  enregistrement,
  timbre,
  prelevements,
];

/** Retourne un simulateur par son identifiant. */
export function parId(id) {
  return CALCULATEURS.find((c) => c.id === id);
}

/** Valeurs par défaut d'un simulateur. */
export function valeursParDefaut(calculateur) {
  return Object.fromEntries(calculateur.champs.map((champ) => [champ.nom, champ.defaut]));
}
