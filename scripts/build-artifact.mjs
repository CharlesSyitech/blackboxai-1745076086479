/**
 * Prépare la page d'entrée publiable comme Artifact.
 *
 *   node scripts/build-artifact.mjs
 *
 * Le service d'Artifacts enveloppe lui-même le fichier dans un squelette
 * <!doctype html><head>…</head><body>. La page publiée ne doit donc contenir
 * ni <html>, ni <head>, ni <body> : on reprend le contenu du <body> de
 * index.html, précédé du <title> et du lien vers la feuille de style.
 *
 * Les fichiers d'assets ne sont pas copiés : ils sont publiés depuis le dépôt
 * à leurs chemins d'origine, que la page et les modules référencent déjà.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SORTIE = 'dist/artifact';

/** Nom de l'artifact dans la galerie et l'onglet du navigateur. */
const TITRE = 'Guide fiscal ivoirien';

const html = await readFile('index.html', 'utf8');

const corps = html.match(/<body>([\s\S]*?)<\/body>/);
if (!corps) throw new Error("index.html : aucune balise <body> trouvée");

const page = [
  `<title>${TITRE}</title>`,
  '<link rel="stylesheet" href="assets/css/styles.css" />',
  corps[1].replace(/^\n/, '').replace(/\n {4}/g, '\n'),
].join('\n');

// Le nom de balise doit être suivi d'une espace ou d'un chevron, sinon « <header »
// serait pris pour « <head ».
const interdite = page.match(/<\/?(?:!doctype|html|head|body)(?=[\s>])/i);
if (interdite) throw new Error(`la page publiée contient ${interdite[0]}`);

await mkdir(SORTIE, { recursive: true });
await writeFile(join(SORTIE, 'index.html'), `${page}\n`);
console.log(`${TITRE} → ${join(SORTIE, 'index.html')} (${page.length} octets)`);
