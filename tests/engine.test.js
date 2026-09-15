import test from 'node:test';
import assert from 'node:assert/strict';
import { baremeProgressif, borner, horsTaxes, toNumber, trancheFixe, tauxEffectif } from '../assets/js/engine.js';
import { BAREME_ITS_MENSUEL, TIMBRE_QUITTANCE, TVA } from '../assets/js/rates.js';

test('toNumber accepte les séparateurs usuels', () => {
  assert.equal(toNumber('1 250 000'), 1250000);
  assert.equal(toNumber('12,5'), 12.5);
  assert.equal(toNumber(''), 0);
  assert.equal(toNumber('abc'), 0);
  assert.equal(toNumber(Number.NaN), 0);
});

test('baremeProgressif ne taxe que la fraction de chaque tranche', () => {
  // 75 000 F : intégralement dans la tranche à 0 %.
  assert.equal(baremeProgressif(75000, BAREME_ITS_MENSUEL).total, 0);
  // 240 000 F : 165 000 F taxés à 16 %.
  assert.equal(baremeProgressif(240000, BAREME_ITS_MENSUEL).total, 165000 * 0.16);
  // 800 000 F : 16 % puis 21 %.
  assert.equal(
    baremeProgressif(800000, BAREME_ITS_MENSUEL).total,
    165000 * 0.16 + 560000 * 0.21,
  );
});

test('baremeProgressif renvoie le détail des tranches atteintes', () => {
  const { detail } = baremeProgressif(300000, BAREME_ITS_MENSUEL);
  assert.equal(detail.length, 3);
  assert.equal(detail[2].assiette, 60000);
  assert.equal(detail[2].taux, 0.21);
});

test('baremeProgressif traite les bases nulles ou négatives', () => {
  assert.equal(baremeProgressif(0, BAREME_ITS_MENSUEL).total, 0);
  assert.equal(baremeProgressif(-5000, BAREME_ITS_MENSUEL).total, 0);
});

test('trancheFixe sélectionne la bonne tranche du timbre de quittance', () => {
  assert.equal(trancheFixe(5000, TIMBRE_QUITTANCE).droit, 0);
  assert.equal(trancheFixe(5001, TIMBRE_QUITTANCE).droit, 100);
  assert.equal(trancheFixe(500000, TIMBRE_QUITTANCE).droit, 500);
  assert.equal(trancheFixe(9000000, TIMBRE_QUITTANCE).droit, 5000);
});

test('borner applique plancher et plafond', () => {
  assert.equal(borner(10, { minimum: 100 }), 100);
  assert.equal(borner(1000, { maximum: 500 }), 500);
  assert.equal(borner(300, { minimum: 100, maximum: 500 }), 300);
});

test('horsTaxes inverse correctement la TVA', () => {
  assert.equal(Math.round(horsTaxes(118000, TVA.commun)), 100000);
  assert.equal(Math.round(horsTaxes(109000, TVA.reduit)), 100000);
});

test('tauxEffectif protège de la division par zéro', () => {
  assert.equal(tauxEffectif(1000, 0), 0);
  assert.equal(tauxEffectif(25, 100), 0.25);
});
