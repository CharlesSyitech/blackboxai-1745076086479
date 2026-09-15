import test from 'node:test';
import assert from 'node:assert/strict';
import { FICHES, TITRES, ficheParId, fichesDuCalculateur } from '../assets/js/corpus.js';
import { CALCULATEURS } from '../assets/js/calculators.js';

/** Vérifie qu'une valeur est un libellé bilingue complet. */
function bilingueComplet(valeur, chemin) {
  assert.equal(typeof valeur, 'object', `${chemin} n'est pas un libellé bilingue`);
  for (const langue of ['fr', 'en']) {
    assert.equal(typeof valeur[langue], 'string', `${chemin}.${langue} manquant`);
    assert.ok(valeur[langue].trim().length > 0, `${chemin}.${langue} est vide`);
  }
}

test('le corpus couvre les cinq titres du dispositif', () => {
  const groupes = new Set(FICHES.map((fiche) => fiche.groupe));
  for (const titre of TITRES) {
    assert.ok(groupes.has(titre.id), `aucune fiche dans le groupe ${titre.id}`);
  }
  assert.ok(FICHES.length >= 60, `corpus trop court : ${FICHES.length} fiches`);
});

test('chaque fiche est complète et bilingue', () => {
  const identifiants = new Set();
  for (const fiche of FICHES) {
    assert.ok(!identifiants.has(fiche.id), `identifiant dupliqué : ${fiche.id}`);
    identifiants.add(fiche.id);
    assert.match(fiche.id, /^[a-z0-9-]+$/, `identifiant non normalisé : ${fiche.id}`);
    assert.ok(TITRES.some((titre) => titre.id === fiche.groupe), `${fiche.id} : groupe inconnu`);

    for (const champ of ['titre', 'redevable', 'definition', 'assiette']) {
      bilingueComplet(fiche[champ], `${fiche.id}.${champ}`);
    }
    if (fiche.formule) bilingueComplet(fiche.formule, `${fiche.id}.formule`);

    assert.ok(Array.isArray(fiche.sigles), `${fiche.id} : sigles absents`);
    assert.ok(Array.isArray(fiche.motsCles) && fiche.motsCles.length > 0, `${fiche.id} : mots-clés absents`);
    assert.ok(typeof fiche.refs === 'string' && fiche.refs.length > 0, `${fiche.id} : référence absente`);

    assert.ok(Array.isArray(fiche.taux) && fiche.taux.length > 0, `${fiche.id} : aucun taux`);
    for (const [index, ligne] of fiche.taux.entries()) {
      bilingueComplet(ligne.libelle, `${fiche.id}.taux[${index}].libelle`);
      const formes = ['taux', 'montant', 'valeur'].filter((cle) => ligne[cle] !== undefined);
      assert.equal(formes.length, 1, `${fiche.id}.taux[${index}] : une seule forme attendue, reçu ${formes.join('+') || 'aucune'}`);
      if (ligne.taux !== undefined) {
        assert.ok(Number.isFinite(ligne.taux) && ligne.taux >= 0, `${fiche.id}.taux[${index}] : taux invalide`);
      }
      if (ligne.montant !== undefined) {
        assert.ok(Number.isFinite(ligne.montant) && ligne.montant >= 0, `${fiche.id}.taux[${index}] : montant invalide`);
      }
      if (ligne.valeur !== undefined) bilingueComplet(ligne.valeur, `${fiche.id}.taux[${index}].valeur`);
      if (ligne.unite !== undefined) bilingueComplet(ligne.unite, `${fiche.id}.taux[${index}].unite`);
    }

    for (const [index, exoneration] of (fiche.exonerations ?? []).entries()) {
      bilingueComplet(exoneration, `${fiche.id}.exonerations[${index}]`);
    }

    for (const [index, situation] of (fiche.situations ?? []).entries()) {
      bilingueComplet(situation, `${fiche.id}.situations[${index}]`);
    }
  }
});

test('les fiches renvoient vers des simulateurs existants', () => {
  const connus = new Set(CALCULATEURS.map((c) => c.id));
  for (const fiche of FICHES) {
    if (!fiche.calculateur) continue;
    assert.ok(connus.has(fiche.calculateur), `${fiche.id} renvoie au simulateur inconnu ${fiche.calculateur}`);
  }
});

test('chaque simulateur est documenté par au moins une fiche', () => {
  for (const calculateur of CALCULATEURS) {
    assert.ok(
      fichesDuCalculateur(calculateur.id).length > 0,
      `le simulateur ${calculateur.id} n'est rattaché à aucune fiche`,
    );
  }
});

test('ficheParId retrouve une fiche et ignore un identifiant inconnu', () => {
  assert.equal(ficheParId('its').id, 'its');
  assert.equal(ficheParId('inexistant'), undefined);
});

test('les renvois « voir aussi » pointent vers des fiches existantes', () => {
  for (const fiche of FICHES) {
    for (const lien of fiche.liens ?? []) {
      assert.ok(ficheParId(lien), `${fiche.id} renvoie vers la fiche inconnue ${lien}`);
      assert.notEqual(lien, fiche.id, `${fiche.id} se renvoie à elle-même`);
    }
    const uniques = new Set(fiche.liens ?? []);
    assert.equal(uniques.size, (fiche.liens ?? []).length, `${fiche.id} : renvoi dupliqué`);
  }
});

test('les impôts de la vie courante décrivent les situations qui y mènent', () => {
  // Les fiches rattachées à un simulateur sont celles qu'un contribuable
  // atteint depuis une situation concrète : elles doivent la décrire.
  const sans = FICHES.filter((fiche) => fiche.calculateur && !(fiche.situations?.length > 0)).map((f) => f.id);
  assert.deepEqual(sans, [], `fiches sans situation décrite : ${sans.join(', ')}`);
});
