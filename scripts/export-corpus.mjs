/**
 * Exporte le corpus vers des fichiers réutilisables par un pipeline RAG externe.
 *
 *   node scripts/export-corpus.mjs [dossier]
 *
 * Produit, dans `dist/` par défaut :
 *   - corpus.json   : le corpus structuré, une entrée par fiche, métadonnées comprises ;
 *   - corpus.jsonl  : un document par ligne, avec un champ `text` prêt à vectoriser.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { FICHES, TITRES } from '../assets/js/corpus.js';
import { SOURCE } from '../assets/js/rates.js';

const dossier = process.argv[2] ?? 'dist';

/** Valeur lisible d'une ligne de taux, dans une langue donnée. */
function valeurTaux(ligne, langue) {
  if (ligne.taux !== undefined) {
    const pourcentage = (ligne.taux * 100).toLocaleString(langue === 'en' ? 'en-US' : 'fr-FR', {
      maximumFractionDigits: 3,
    });
    return langue === 'en' ? `${pourcentage}%` : `${pourcentage} %`;
  }
  if (ligne.montant !== undefined) {
    const montant = ligne.montant.toLocaleString(langue === 'en' ? 'en-US' : 'fr-FR');
    const base = langue === 'en' ? `XOF ${montant}` : `${montant} F CFA`;
    return ligne.unite ? `${base} ${ligne.unite[langue]}` : base;
  }
  return ligne.valeur[langue];
}

/** Bloc de texte continu d'une fiche, destiné à l'indexation vectorielle. */
function texteFiche(fiche, langue) {
  const titre = TITRES.find((t) => t.id === fiche.groupe);
  const lignes = [
    fiche.titre[langue],
    fiche.sigles.length > 0 ? `${langue === 'en' ? 'Acronyms' : 'Sigles'} : ${fiche.sigles.join(', ')}` : '',
    `${langue === 'en' ? 'Part of the system' : 'Rattachement'} : ${titre.libelle[langue]}`,
    `${langue === 'en' ? 'Legal basis' : 'Fondement'} : ${fiche.refs}`,
    `${langue === 'en' ? 'What it is' : 'Ce que c’est'} : ${fiche.definition[langue]}`,
    `${langue === 'en' ? 'Who pays' : 'Qui paie'} : ${fiche.redevable[langue]}`,
    `${langue === 'en' ? 'Tax base' : 'Base de calcul'} : ${fiche.assiette[langue]}`,
    `${langue === 'en' ? 'Rates and tariffs' : 'Taux et tarifs'} :`,
    ...fiche.taux.map((ligne) => `  - ${ligne.libelle[langue]} : ${valeurTaux(ligne, langue)}`),
    fiche.formule ? `${langue === 'en' ? 'How to compute it' : 'Comment le calculer'} : ${fiche.formule[langue]}` : '',
    ...(fiche.exonerations?.length
      ? [
          `${langue === 'en' ? 'Main exemptions' : 'Exonérations principales'} :`,
          ...fiche.exonerations.map((exoneration) => `  - ${exoneration[langue]}`),
        ]
      : []),
  ];
  return lignes.filter(Boolean).join('\n');
}

const documents = FICHES.flatMap((fiche) =>
  ['fr', 'en'].map((langue) => ({
    id: `${fiche.id}.${langue}`,
    fiche: fiche.id,
    langue,
    titre: fiche.titre[langue],
    groupe: fiche.groupe,
    refs: fiche.refs,
    sigles: fiche.sigles,
    motsCles: fiche.motsCles,
    calculateur: fiche.calculateur ?? null,
    source: `${SOURCE.titre[langue]} — ${SOURCE.editeur}, ${SOURCE.edition}`,
    text: texteFiche(fiche, langue),
  })),
);

await mkdir(dossier, { recursive: true });
await writeFile(
  join(dossier, 'corpus.json'),
  `${JSON.stringify({ source: SOURCE, titres: TITRES, fiches: FICHES }, null, 2)}\n`,
);
await writeFile(join(dossier, 'corpus.jsonl'), `${documents.map((d) => JSON.stringify(d)).join('\n')}\n`);

console.log(`${FICHES.length} fiches → ${join(dossier, 'corpus.json')}`);
console.log(`${documents.length} documents (FR + EN) → ${join(dossier, 'corpus.jsonl')}`);
