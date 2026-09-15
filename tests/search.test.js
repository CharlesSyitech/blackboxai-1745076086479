import test from 'node:test';
import assert from 'node:assert/strict';
import { INDEX, construireIndex, normaliser, rechercher, tokeniser, EXEMPLES } from '../assets/js/search.js';
import { FICHES } from '../assets/js/corpus.js';

test('la normalisation retire accents et apostrophes', () => {
  assert.equal(normaliser('Impôt général sur le revenu'), 'impot general sur le revenu');
  assert.equal(normaliser('chiffre d’affaires'), 'chiffre d affaires');
});

test('la tokenisation écarte les mots vides mais garde les sigles', () => {
  assert.deepEqual(tokeniser('Comment calculer l’ITS ?'), ['its']);
  assert.deepEqual(tokeniser('What is the VAT rate?'), ['vat', 'taux']);
  // « article » est ramené sur « art » pour rejoindre les références du CGI.
  assert.deepEqual(tokeniser('article 146'), ['art', '146']);
  // Les pluriels rejoignent le singulier.
  assert.deepEqual(tokeniser('patentes'), ['patente']);
});

test('l’index couvre tout le corpus', () => {
  assert.equal(INDEX.documents.length, FICHES.length);
  assert.ok(INDEX.termes.length > 1000, `index trop pauvre : ${INDEX.termes.length} termes`);
  for (const document of INDEX.documents) {
    assert.ok(document.longueur > 0, `${document.fiche.id} : document vide`);
  }
});

test('une question sans terme utile ne renvoie rien plutôt qu’un résultat au hasard', () => {
  assert.deepEqual(rechercher('comment ?'), []);
  assert.deepEqual(rechercher('   '), []);
  assert.deepEqual(rechercher('zzzzzzqwerty'), []);
});

test('les questions courantes remontent la bonne fiche en tête', () => {
  const attendus = [
    ['Comment calculer l’ITS ?', 'its'],
    ['comment on calcule l’impôt sur les salaires', 'its'],
    ['How is the wage tax calculated?', 'its'],
    ['barème de l’IGR', 'igr'],
    ['taux de TVA', 'tva'],
    ['what VAT rate applies', 'tva'],
    ['exonérations de TVA', 'tva'],
    ['impôt minimum forfaitaire', 'imf'],
    ['quel régime pour 30 millions de chiffre d’affaires', 'regimes-imposition'],
    ['which regime for a turnover of 30 million', 'regimes-imposition'],
    ['droits de succession', 'succession'],
    ['vente d’un immeuble', 'vente-immeubles'],
    ['assurance automobile', 'taxe-assurance'],
    ['contribution des patentes', 'patente'],
    ['vignette voiture', 'vignettes'],
    ['dividendes BRVM', 'irvm'],
    ['intérêts d’un compte courant', 'irc'],
    ['taxe sur les jeux en ligne', 'taxe-jeux-hasard'],
    ['taxe sur les hôtels', 'taxe-tourisme'],
    ['billet d’avion', 'taxe-titres-transport-aerien'],
    ['mobile money', 'taxe-telecoms'],
    ['profession libérale', 'bnc'],
    ['charges patronales sur les salaires', 'contribution-employeur'],
    ['timbre de quittance', 'timbres'],
  ];
  const echecs = [];
  for (const [question, attendu] of attendus) {
    const resultats = rechercher(question);
    const tete = resultats[0]?.fiche.id;
    if (tete !== attendu) echecs.push(`« ${question} » → ${tete ?? 'aucun'} au lieu de ${attendu}`);
  }
  assert.deepEqual(echecs, [], `${echecs.length} question(s) mal classée(s) :\n${echecs.join('\n')}`);
});

test('l’article du CGI cité dans une question retrouve les fiches concernées', () => {
  const resultats = rechercher('article 146 du CGI').map((r) => r.fiche.id);
  assert.ok(
    ['contribution-employeur', 'contribution-nationale', 'taxe-apprentissage', 'formation-continue'].some((id) =>
      resultats.slice(0, 4).includes(id),
    ),
    `l’article 146 n’a pas retrouvé les charges sur salaires : ${resultats.join(', ')}`,
  );
});

test('chaque fiche est retrouvable par son propre titre', () => {
  const introuvables = [];
  for (const fiche of FICHES) {
    const resultats = rechercher(fiche.titre.fr, INDEX, { limite: 5 });
    if (!resultats.some((resultat) => resultat.fiche.id === fiche.id)) introuvables.push(fiche.id);
  }
  assert.deepEqual(introuvables, [], `fiches introuvables par leur titre : ${introuvables.join(', ')}`);
});

test('chaque fiche est retrouvable par ses sigles', () => {
  const introuvables = [];
  for (const fiche of FICHES) {
    for (const sigle of fiche.sigles) {
      const resultats = rechercher(sigle, INDEX, { limite: 5 });
      if (!resultats.some((resultat) => resultat.fiche.id === fiche.id)) introuvables.push(`${fiche.id} (${sigle})`);
    }
  }
  assert.deepEqual(introuvables, [], `sigles non résolus : ${introuvables.join(', ')}`);
});

test('les questions d’exemple proposées renvoient toutes un résultat', () => {
  for (const exemple of EXEMPLES) {
    for (const langue of ['fr', 'en']) {
      assert.ok(rechercher(exemple[langue]).length > 0, `aucun résultat pour « ${exemple[langue]} »`);
    }
  }
});

test('construireIndex accepte un sous-corpus', () => {
  const index = construireIndex(FICHES.slice(0, 5));
  assert.equal(index.documents.length, 5);
  assert.ok(rechercher('impôt', index).length > 0);
});

test('les questions posées en langage courant trouvent la bonne fiche', () => {
  // Un contribuable ne dit pas « impôt sur le revenu foncier » mais « je loue mon
  // appartement ». Chaque cas liste les fiches réellement pertinentes : la première
  // doit arriver en tête, et toute réponse listée est acceptée lorsque plusieurs
  // impôts répondent également à la situation.
  const cas = [
    ['je loue mon appartement, quel impôt ?', ['revenu-foncier']],
    ['j’ai vendu ma maison', ['vente-immeubles']],
    ['je viens d’embaucher quelqu’un', ['contribution-employeur', 'contribution-nationale', 'taxe-apprentissage', 'formation-continue']],
    ['je suis coiffeuse dans mon quartier', ['tce']],
    ['j’ouvre un maquis', ['licences']],
    ['combien je paie sur mon bulletin de paie', ['its']],
    ['mon père est décédé, que dois-je payer', ['succession']],
    ['j’ai une boutique, quel impôt payer', ['regimes-imposition']],
    ['je suis chauffeur Uber', ['prelevement-plateformes']],
    ['j’importe des voitures d’occasion', ['taxe-environnement']],
    ['je fais du transport de marchandises', ['taxe-transports-prives']],
    ['ma société fait des pertes, dois-je payer ?', ['imf']],
    ['j’ai un terrain vide à Abidjan', ['patrimoine-foncier-non-bati']],
    ['je suis médecin en cabinet privé', ['bnc']],
    ['combien coûte une assurance auto en taxe', ['taxe-assurance']],
    ['je paie mes employés expatriés', ['its', 'contribution-employeur']],
    ['je plante du cacao', ['retenues-bic', 'patrimoine-foncier-non-bati']],
    ['taxe sur mon abonnement internet', ['taxe-communications-telephoniques']],
    ['je fais des paris sportifs en ligne', ['taxe-jeux-hasard']],
    ['I am hiring an employee', ['contribution-employeur', 'contribution-nationale', 'taxe-apprentissage', 'formation-continue']],
    ['I rent out my flat', ['revenu-foncier']],
    ['my company is loss-making', ['imf']],
  ];

  const echecs = [];
  for (const [question, acceptes] of cas) {
    const resultats = rechercher(question, INDEX, { limite: 3 });
    const tete = resultats[0]?.fiche.id;
    if (!tete) echecs.push(`« ${question} » → aucun résultat`);
    else if (!acceptes.includes(tete)) echecs.push(`« ${question} » → ${tete}, attendu l’un de ${acceptes.join(' / ')}`);
  }
  assert.deepEqual(echecs, [], `${echecs.length} question(s) mal classée(s) :\n${echecs.join('\n')}`);
});

test('les situations décrites sont bien indexées', () => {
  const introuvables = [];
  for (const fiche of FICHES) {
    for (const situation of fiche.situations ?? []) {
      const resultats = rechercher(situation.fr, INDEX, { limite: 5 });
      if (!resultats.some((resultat) => resultat.fiche.id === fiche.id)) {
        introuvables.push(`${fiche.id} : « ${situation.fr} »`);
      }
    }
  }
  assert.deepEqual(introuvables, [], `situations non indexées :\n${introuvables.join('\n')}`);
});
