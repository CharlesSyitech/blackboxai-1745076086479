/** Chaînes d'interface et formatage, en français et en anglais. */

export const LANGUES = ['fr', 'en'];

export const UI = {
  appTitre: { fr: "Guide fiscal — Côte d'Ivoire", en: "Tax guide — Côte d'Ivoire" },
  appSousTitre: {
    fr: "Toutes les bases de calcul des impôts, taxes et redevances ivoiriens, interrogeables en langage courant. D'après le tableau synoptique de la DGI, édition 2025.",
    en: 'Every calculation basis for Ivorian taxes, duties and levies, searchable in plain language. Based on the DGI synoptic table, 2025 edition.',
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

  // Guide interrogeable
  vueGuide: { fr: 'Guide fiscal', en: 'Tax guide' },
  vueSimulateurs: { fr: 'Simulateurs', en: 'Simulators' },
  questionPlaceholder: {
    fr: 'Posez votre question : comment calculer l’ITS ?',
    en: 'Ask your question: how is the wage tax calculated?',
  },
  questionLabel: { fr: 'Votre question', en: 'Your question' },
  exemplesTitre: { fr: 'Exemples de questions', en: 'Example questions' },
  resultatsRecherche: { fr: 'Fiches correspondantes', en: 'Matching entries' },
  parcourir: { fr: 'Parcourir tout le dispositif', en: 'Browse the whole system' },
  effacer: { fr: 'Effacer', en: 'Clear' },
  redevableLabel: { fr: 'Qui paie', en: 'Who pays' },
  definitionLabel: { fr: 'Ce que c’est', en: 'What it is' },
  assietteLabel: { fr: 'Base de calcul', en: 'Tax base' },
  tauxLabel: { fr: 'Taux et tarifs', en: 'Rates and tariffs' },
  formuleLabel: { fr: 'Comment le calculer', en: 'How to compute it' },
  exonerationsLabel: { fr: 'Exonérations principales', en: 'Main exemptions' },
  exempleChiffre: { fr: 'Exemple chiffré', en: 'Worked example' },
  ouvrirSimulateur: { fr: 'Ouvrir le simulateur', en: 'Open the simulator' },
  voirFiche: { fr: 'Voir la fiche du guide', en: 'Open the guide entry' },
  aucuneFiche: { fr: 'Aucune fiche ne correspond à cette question.', en: 'No entry matches this question.' },
  reformuler: {
    fr: 'Essayez un mot-clé plus simple : « TVA », « salaire », « patente », ou un article du CGI.',
    en: 'Try a simpler keyword: "VAT", "salary", "licence", or a Tax Code article.',
  },
  ficheCompte: { fr: 'fiches couvrant les cinq titres du dispositif', en: 'entries covering the five titles of the system' },
  copierFiche: { fr: 'Copier la fiche', en: 'Copy entry' },
  situationsLabel: { fr: 'Dans quels cas', en: 'When it applies' },
  liensLabel: { fr: 'Voir aussi', en: 'See also' },
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
