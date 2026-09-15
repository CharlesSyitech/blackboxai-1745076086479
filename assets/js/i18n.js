/** Chaînes d'interface et formatage, en français et en anglais. */

export const LANGUES = ['fr', 'en'];

export const UI = {
  appTitre: { fr: "Simulateur fiscal — Côte d'Ivoire", en: "Tax simulator — Côte d'Ivoire" },
  appSousTitre: {
    fr: 'Calculs fondés sur le tableau synoptique des impôts, taxes, redevances et prélèvements de la DGI, édition 2025.',
    en: "Calculations based on the DGI's synoptic table of taxes, duties and levies, 2025 edition.",
  },
  choisirSimulateur: { fr: 'Simulateurs', en: 'Simulators' },
  parametres: { fr: 'Paramètres', en: 'Inputs' },
  resultats: { fr: 'Résultats', en: 'Results' },
  detail: { fr: 'Détail du calcul', en: 'Calculation breakdown' },
  notes: { fr: 'À retenir', en: 'Notes' },
  reference: { fr: 'Référence', en: 'Reference' },
  reinitialiser: { fr: 'Réinitialiser', en: 'Reset' },
  copier: { fr: 'Copier le résultat', en: 'Copy result' },
  copie: { fr: 'Copié', en: 'Copied' },
  imprimer: { fr: 'Imprimer', en: 'Print' },
  oui: { fr: 'Oui', en: 'Yes' },
  non: { fr: 'Non', en: 'No' },
  rechercher: { fr: 'Rechercher un simulateur…', en: 'Search a simulator…' },
  aucunResultat: { fr: 'Aucun simulateur ne correspond.', en: 'No simulator matches.' },
  avertissementTitre: { fr: 'Avertissement', en: 'Disclaimer' },
  avertissement: {
    fr:
      "Cet outil est fourni à titre informatif et pédagogique. Il reprend les taux publiés par la Direction générale des Impôts mais ne remplace ni le Code général des Impôts, ni l'avis d'un conseil fiscal, ni une position officielle de l'administration. Les assiettes retenues sont celles saisies par l'utilisateur.",
    en:
      'This tool is provided for information and educational purposes. It reproduces the rates published by the Directorate General of Taxes but replaces neither the Tax Code, nor professional tax advice, nor an official ruling. Tax bases are those entered by the user.',
  },
  sourceLabel: { fr: 'Source', en: 'Source' },
  langue: { fr: 'Langue', en: 'Language' },
};

/** Retourne la variante linguistique d'un libellé bilingue. */
export function tr(libelle, langue) {
  if (libelle === null || libelle === undefined) return '';
  if (typeof libelle === 'string') return libelle;
  return libelle[langue] ?? libelle.fr ?? '';
}

/** Locale Intl correspondant à la langue. */
export function locale(langue) {
  return langue === 'en' ? 'en-US' : 'fr-FR';
}

/** Formate un montant en francs CFA. */
export function formatMontant(valeur, langue) {
  const arrondi = Math.round(valeur);
  const nombre = new Intl.NumberFormat(locale(langue), { maximumFractionDigits: 0 }).format(Math.abs(arrondi));
  const signe = arrondi < 0 ? '−' : '';
  return langue === 'en' ? `${signe}XOF ${nombre}` : `${signe}${nombre} F CFA`;
}

/** Formate un taux (0,185 → « 18,5 % »). */
export function formatTaux(valeur, langue) {
  return new Intl.NumberFormat(locale(langue), {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(valeur);
}

/** Formate un nombre simple. */
export function formatNombre(valeur, langue) {
  return new Intl.NumberFormat(locale(langue), { maximumFractionDigits: 2 }).format(valeur);
}
