/**
 * Moteur de recherche local du corpus fiscal.
 *
 * Index inversé construit en mémoire au chargement, pondéré par champ, puis
 * classement BM25. Tout est interrogé dans les deux langues à la fois : une
 * question posée en anglais retrouve une fiche rédigée en français, et
 * inversement. Aucun appel réseau, aucune clé : la recherche fonctionne
 * hors ligne et rend toujours le même classement pour la même question.
 */

import { FICHES } from './corpus.js';

/** Poids de chaque champ dans l'index. */
const POIDS = {
  sigles: 6,
  titre: 4,
  motsCles: 3,
  situations: 3,
  refs: 2,
  definition: 1.5,
  assiette: 1.5,
  formule: 1.5,
  redevable: 1,
  taux: 0.8,
  exonerations: 0.8,
};

/** Paramètres BM25. */
const K1 = 1.5;
const B = 0.5;

/**
 * Mots vides français et anglais. Ils sont retirés des questions comme du
 * corpus : « comment calculer l'ITS » se réduit ainsi à « its ».
 */
const MOTS_VIDES = new Set([
  'a', 'ai', 'au', 'aux', 'avec', 'ce', 'ces', 'cet', 'cette', 'combien', 'comment', 'dans', 'de',
  'des', 'du', 'elle', 'en', 'est', 'et', 'etre', 'eux', 'il', 'ils', 'je', 'la', 'le', 'les', 'leur',
  'lui', 'ma', 'mais', 'me', 'mes', 'moi', 'mon', 'ne', 'nos', 'notre', 'nous', 'on', 'ou', 'par',
  'pas', 'pour', 'qu', 'que', 'quel', 'quelle', 'quelles', 'quels', 'qui', 'sa', 'sans', 'se', 'ses',
  'son', 'sont', 'sur', 'ta', 'te', 'tes', 'toi', 'ton', 'tu', 'un', 'une', 'vos', 'votre', 'vous',
  'y', 'calcul', 'calculer', 'calcule', 'savoir', 'veux', 'faut', 'doit', 'dois', 'fait', 'faire',
  'about', 'all', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'by', 'calculate', 'calculated',
  'calculation', 'can', 'do', 'does', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'its', 'know',
  'many', 'me', 'much', 'must', 'my', 'of', 'on', 'or', 'our', 'should', 'that', 'the', 'their',
  'there', 'they', 'this', 'to', 'want', 'was', 'we', 'what', 'when', 'where', 'which', 'who',
  'will', 'with', 'you', 'your',
]);

/**
 * Synonymes réduits à une forme unique avant indexation et avant recherche.
 * « article 146 » doit retrouver les fiches dont la référence s'écrit « Art. 146 ».
 */
const ALIAS = new Map([
  ['article', 'art'],
  ['impot', 'impot'],
  ['taux', 'taux'],
  ['pourcentage', 'taux'],
  ['rate', 'taux'],
  ['percentage', 'taux'],
  ['bareme', 'bareme'],
  ['scale', 'bareme'],
  ['bracket', 'tranche'],
  ['exemption', 'exoneration'],
  ['exempt', 'exoneration'],
  ['deadline', 'delai'],
]);

/** Le sigle « ITS » ne doit pas être écrasé par le mot vide anglais « its ». */
const SIGLES_PROTEGES = new Set(FICHES.flatMap((fiche) => fiche.sigles.map((s) => s.toLowerCase())));

/** Minuscules, sans accents ni apostrophes typographiques. */
export function normaliser(texte) {
  return String(texte ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .toLowerCase();
}

/** Réduit les pluriels usuels pour que « patentes » et « patente » se rejoignent. */
function radical(mot) {
  if (mot.length > 3 && (mot.endsWith('s') || mot.endsWith('x'))) return mot.slice(0, -1);
  return mot;
}

/**
 * Découpe un texte en termes indexables.
 *
 * Les sigles courts se confondent avec des mots vides — « IS » pour l'impôt sur
 * les salaires et « is » en anglais, « CE » pour la contribution employeur et
 * « ce » en français. Un sigle de moins de trois lettres n'est donc retenu que
 * s'il a été écrit en majuscules ; au-delà, il l'est toujours.
 */
export function tokeniser(texte) {
  const bruts = String(texte ?? '')
    .replace(/[’']/g, ' ')
    .split(/[^0-9A-Za-zÀ-ÖØ-öø-ÿ]+/)
    .filter(Boolean);

  const termes = [];
  for (const brut of bruts) {
    const mot = normaliser(brut);
    if (mot.length < 2) continue;
    const estSigle = SIGLES_PROTEGES.has(mot) && (mot.length >= 3 || brut === brut.toUpperCase());
    if (!estSigle && MOTS_VIDES.has(mot)) continue;
    const forme = radical(mot);
    termes.push(ALIAS.get(forme) ?? forme);
  }
  return termes;
}

/** Concatène les deux langues d'un libellé bilingue. */
function bilingue(libelle) {
  if (libelle === null || libelle === undefined) return '';
  if (typeof libelle === 'string') return libelle;
  return `${libelle.fr ?? ''} ${libelle.en ?? ''}`;
}

/** Textes indexables d'une fiche, champ par champ. */
function champsIndexables(fiche) {
  return {
    sigles: fiche.sigles.join(' '),
    titre: bilingue(fiche.titre),
    motsCles: (fiche.motsCles ?? []).join(' '),
    situations: (fiche.situations ?? []).map(bilingue).join(' '),
    refs: fiche.refs ?? '',
    definition: bilingue(fiche.definition),
    assiette: bilingue(fiche.assiette),
    formule: bilingue(fiche.formule),
    redevable: bilingue(fiche.redevable),
    taux: (fiche.taux ?? []).map((ligne) => `${bilingue(ligne.libelle)} ${bilingue(ligne.valeur)}`).join(' '),
    exonerations: (fiche.exonerations ?? []).map(bilingue).join(' '),
  };
}

/** Construit l'index inversé à partir d'un corpus. */
export function construireIndex(fiches = FICHES) {
  const documents = fiches.map((fiche) => {
    const frequences = new Map();
    let longueur = 0;
    for (const [champ, texte] of Object.entries(champsIndexables(fiche))) {
      const poids = POIDS[champ] ?? 1;
      for (const terme of tokeniser(texte)) {
        frequences.set(terme, (frequences.get(terme) ?? 0) + poids);
        longueur += poids;
      }
    }
    return { fiche, frequences, longueur };
  });

  const documentsParTerme = new Map();
  for (const document of documents) {
    for (const terme of document.frequences.keys()) {
      documentsParTerme.set(terme, (documentsParTerme.get(terme) ?? 0) + 1);
    }
  }

  const longueurMoyenne =
    documents.reduce((somme, document) => somme + document.longueur, 0) / (documents.length || 1);

  return { documents, documentsParTerme, longueurMoyenne, termes: [...documentsParTerme.keys()] };
}

/** Fréquence pondérée d'un terme dans un document, avec repli sur le préfixe. */
function frequenceAvecPrefixe(document, terme, termeConnu) {
  const exacte = document.frequences.get(terme);
  if (exacte !== undefined) return exacte;
  if (termeConnu || terme.length < 4) return 0;
  // Terme absent de tout l'index : on tolère une correspondance par préfixe,
  // à poids réduit, pour rattraper les variantes non prévues. Le préfixe ne joue
  // que dans un sens — le terme cherché doit commencer le terme indexé — sinon
  // une question comportant « article » viendrait matcher « art » partout.
  let somme = 0;
  for (const [candidat, poids] of document.frequences) {
    if (candidat.startsWith(terme)) somme += poids * 0.5;
  }
  return somme;
}

/**
 * Classe les fiches par pertinence pour une question en langage naturel.
 * @returns {{fiche: object, score: number}[]} résultats triés, score décroissant
 */
export function rechercher(question, index = INDEX, { limite = 8 } = {}) {
  const termes = tokeniser(question);
  if (termes.length === 0) return [];

  const total = index.documents.length;
  const resultats = [];

  for (const document of index.documents) {
    let score = 0;
    for (const terme of termes) {
      const termeConnu = index.documentsParTerme.has(terme);
      const frequence = frequenceAvecPrefixe(document, terme, termeConnu);
      if (frequence === 0) continue;
      const nombreDocuments = termeConnu
        ? index.documentsParTerme.get(terme)
        : Math.max(1, index.termes.filter((candidat) => candidat.startsWith(terme)).length);
      const idf = Math.log(1 + (total - nombreDocuments + 0.5) / (nombreDocuments + 0.5));
      const denominateur = frequence + K1 * (1 - B + (B * document.longueur) / index.longueurMoyenne);
      score += idf * ((frequence * (K1 + 1)) / denominateur);
    }
    if (score > 0) resultats.push({ fiche: document.fiche, score });
  }

  resultats.sort((a, b) => b.score - a.score || a.fiche.id.localeCompare(b.fiche.id));
  return resultats.slice(0, limite);
}

/** Index par défaut, construit une fois au chargement du module. */
export const INDEX = construireIndex();

/** Questions proposées à l'utilisateur au premier chargement. */
export const EXEMPLES = [
  { fr: 'Comment calculer l’ITS ?', en: 'How is the wage tax (ITS) calculated?' },
  { fr: 'Quel taux de TVA sur les produits pétroliers ?', en: 'What VAT rate applies to petroleum products?' },
  { fr: 'Quel régime pour un chiffre d’affaires de 30 millions ?', en: 'Which regime applies to a turnover of 30 million?' },
  { fr: 'Combien coûte l’enregistrement d’une vente d’immeuble ?', en: 'What duty applies to a property sale?' },
  { fr: 'Impôt foncier sur une maison en location', en: 'Property tax on a house that is let out' },
  { fr: 'Taxe sur les contrats d’assurance automobile', en: 'Tax on motor insurance contracts' },
  { fr: 'Droits de succession', en: 'Inheritance duties' },
  { fr: 'Article 146 du CGI', en: 'Article 146 of the Tax Code' },
];
