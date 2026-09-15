import test from 'node:test';
import assert from 'node:assert/strict';
import { CALCULATEURS, GROUPES, parId, valeursParDefaut } from '../assets/js/calculators.js';

/** Exécute un simulateur avec ses valeurs par défaut surchargées. */
function run(id, overrides = {}) {
  const calculateur = parId(id);
  assert.ok(calculateur, `simulateur inconnu : ${id}`);
  return calculateur.calcule({ ...valeursParDefaut(calculateur), ...overrides });
}

test('chaque simulateur est bien formé et calcule avec ses valeurs par défaut', () => {
  const ids = new Set();
  for (const c of CALCULATEURS) {
    assert.ok(!ids.has(c.id), `identifiant dupliqué : ${c.id}`);
    ids.add(c.id);
    assert.ok(GROUPES.some((g) => g.id === c.groupe), `groupe inconnu pour ${c.id}`);
    for (const cle of ['titre', 'resume']) {
      assert.equal(typeof c[cle].fr, 'string', `${c.id}.${cle}.fr`);
      assert.equal(typeof c[cle].en, 'string', `${c.id}.${cle}.en`);
    }
    assert.ok(c.champs.length > 0, `${c.id} n'a aucun champ`);
    for (const champ of c.champs) {
      assert.ok(champ.libelle.fr && champ.libelle.en, `${c.id}.${champ.nom} : libellé incomplet`);
      if (champ.type === 'select') {
        assert.ok(champ.options.length > 0, `${c.id}.${champ.nom} : aucune option`);
        assert.ok(
          champ.options.some((o) => String(o.valeur) === String(champ.defaut)),
          `${c.id}.${champ.nom} : la valeur par défaut n'est pas une option`,
        );
      }
    }
    const resultat = c.calcule(valeursParDefaut(c));
    assert.ok(resultat.total, `${c.id} ne renvoie pas de total`);
    assert.ok(Array.isArray(resultat.lignes), `${c.id} ne renvoie pas de lignes`);
    assert.ok(Array.isArray(resultat.notes), `${c.id} ne renvoie pas de notes`);
  }
});

test('aucun simulateur ne produit NaN sur des entrées vides', () => {
  for (const c of CALCULATEURS) {
    const vides = Object.fromEntries(c.champs.map((champ) => [champ.nom, champ.type === 'select' ? champ.defaut : '']));
    const resultat = c.calcule(vides);
    const valeurs = [resultat.total, ...resultat.lignes]
      .filter((l) => l.format === 'money' || l.format === 'percent')
      .map((l) => l.valeur);
    for (const valeur of valeurs) {
      assert.ok(Number.isFinite(valeur), `${c.id} produit une valeur non finie : ${valeur}`);
    }
  }
});

test('ITS : barème progressif mensuel', () => {
  // 75 000 F reste dans la tranche à 0 %.
  assert.equal(run('its', { base: 75000, parts: '1' }).total.valeur, 0);
  // 500 000 F : 165 000 x 16 % + 260 000 x 21 %.
  assert.equal(run('its', { base: 500000, parts: '1' }).total.valeur, 26400 + 54600);
  // 10 000 000 F : toutes les tranches, jusqu'à 32 %.
  const haut = run('its', { base: 10000000, parts: '1' }).total.valeur;
  assert.equal(haut, 26400 + 117600 + 384000 + 1568000 + 640000);
});

test('ITS : la RICF se déduit de l’impôt brut sans devenir négative', () => {
  const avec = run('its', { base: 500000, parts: '5' }).total.valeur;
  assert.equal(avec, 81000 - 44000);
  // Impôt brut de 4 800 F pour 105 000 F de salaire, RICF de 44 000 F : plancher à zéro.
  assert.equal(run('its', { base: 105000, parts: '5' }).total.valeur, 0);
});

test('ITS : abattement retraité et taux docker', () => {
  assert.equal(run('its', { base: 500000, parts: '1', retraite70: true }).total.valeur, 81000 * 0.25);
  assert.equal(run('its', { base: 500000, docker: true }).total.valeur, 7500);
});

test('Charges employeur : 2,8 % en local, 12 % en expatrié', () => {
  assert.equal(run('charges-employeur', { masseLocale: 10000000, masseExpatriee: 0 }).total.valeur, 280000);
  assert.equal(run('charges-employeur', { masseLocale: 0, masseExpatriee: 10000000 }).total.valeur, 1200000);
});

test('IGR : barème annuel et imputation des acomptes', () => {
  assert.equal(run('igr', { revenu: 6000000, acomptes: 0 }).total.valeur, 584000);
  const excedent = run('igr', { revenu: 6000000, acomptes: 700000 });
  assert.equal(excedent.total.valeur, 116000);
  assert.equal(excedent.total.libelle.fr, 'Excédent d’acomptes');
});

test('BIC : le régime se déduit du chiffre d’affaires TTC', () => {
  const regime = (caTtc, extra = {}) => run('bic', { caTtc, ...extra }).lignes[0].valeur.fr;
  assert.match(regime(4000000), /communale/);
  assert.match(regime(30000000), /d'Etat/);
  assert.match(regime(120000000), /microentreprises/);
  assert.match(regime(400000000), /simplifié/);
  assert.match(regime(900000000), /normal/);
});

test('BIC : TEE, RME et TCE appliquent leurs taux et réductions', () => {
  assert.equal(run('bic', { caTtc: 4000000, commerce: true }).total.valeur, 80000);
  assert.equal(run('bic', { caTtc: 4000000, commerce: false }).total.valeur, 100000);
  assert.equal(run('bic', { caTtc: 30000000, commerce: false, cga: false }).total.valeur, 1500000);
  assert.equal(run('bic', { caTtc: 30000000, commerce: true, cga: false }).total.valeur, 1200000);
  assert.equal(run('bic', { caTtc: 30000000, commerce: false, cga: true }).total.valeur, 750000);
  assert.equal(run('bic', { caTtc: 120000000, cga: false }).total.valeur, 7200000);
  assert.equal(run('bic', { caTtc: 120000000, cga: true }).total.valeur, 4800000);
});

test('BIC : l’IMF respecte minimum, plafond et taux sectoriels', () => {
  // Bénéfice nul : l'IMF de 0,5 % s'applique.
  assert.equal(run('bic', { caTtc: 800000000, benefice: 0, secteur: 'commun' }).total.valeur, 4000000);
  // Minimum de perception de 3 millions.
  assert.equal(run('bic', { caTtc: 600000000, benefice: 0, secteur: 'commun' }).total.valeur, 3000000);
  // Plafond de 35 millions au réel normal.
  assert.equal(run('bic', { caTtc: 50000000000, benefice: 0, secteur: 'commun' }).total.valeur, 35000000);
  // Taux sectoriels : 0,15 % pour les banques et assurances, 0,10 % pour le secteur pétrolier.
  assert.equal(run('bic', { caTtc: 4000000000, benefice: 0, secteur: 'banqueAssurance' }).total.valeur, 6000000);
  assert.equal(run('bic', { caTtc: 4000000000, benefice: 0, secteur: 'petrolier' }).total.valeur, 4000000);
  // Le minimum de perception de 3 millions s'applique aussi aux taux particuliers.
  assert.equal(run('bic', { caTtc: 600000000, benefice: 0, secteur: 'petrolier' }).total.valeur, 3000000);
  // Station-service : minimum ramené à 500 000 F.
  assert.equal(
    run('bic', { caTtc: 600000000, benefice: 0, secteur: 'petrolier', stationService: true }).total.valeur,
    600000,
  );
  // Télécoms : impôt BIC à 30 %.
  assert.equal(run('bic', { caTtc: 800000000, benefice: 100000000, secteur: 'telecomsTic' }).total.valeur, 30000000);
});

test('BNC : l’IMF/BNC l’emporte quand il excède l’impôt sur les bénéfices', () => {
  assert.equal(run('bnc', { recettes: 40000000, benefice: 15000000 }).total.valeur, 3750000);
  // Bénéfice faible : IMF de 5 % des recettes.
  assert.equal(run('bnc', { recettes: 40000000, benefice: 1000000 }).total.valeur, 2000000);
  // Minimum de perception de 400 000 F.
  assert.equal(run('bnc', { recettes: 1000000, benefice: 0 }).total.valeur, 400000);
  // Greffier-notaire : 50 % des honoraires.
  assert.equal(run('bnc', { recettes: 40000000, qualite: 'greffierNotaire' }).total.valeur, 20000000);
});

test('Foncier : cumul revenu foncier et patrimoine foncier', () => {
  assert.equal(run('foncier', { valeurLocative: 6000000, qualite: 'physique' }).total.valeur, 720000);
  assert.equal(run('foncier', { valeurLocative: 6000000, qualite: 'morale' }).total.valeur, 900000);
  assert.equal(run('foncier', { nature: 'batiNonProductif', valeurMarchande: 50000000 }).total.valeur, 250000);
  assert.equal(run('foncier', { nature: 'nonBati', valeurMarchande: 50000000 }).total.valeur, 500000);
  assert.equal(run('foncier', { nature: 'agricole', culture: 'hevea', hectares: 150 }).total.valeur, 1125000);
});

test('Patente : plafonds du DCA et plancher du DVL', () => {
  // CA de 600 M : DCA plafonné à 1 300 000 F, DVL de 18,5 %.
  assert.equal(run('patente', { caHt: 600000000, valeurLocative: 12000000 }).total.valeur, 1300000 + 2220000);
  // Petit CA : minimum de 300 000 F et plancher du DVL au tiers du DCA.
  assert.equal(run('patente', { caHt: 10000000, valeurLocative: 0 }).total.valeur, 300000 + 100000);
  // Exonération du DVL : DCA à 0,7 %, pas de DVL.
  assert.equal(run('patente', { caHt: 100000000, valeurLocative: 12000000, exonereDvl: true }).total.valeur, 350000);
});

test('Capitaux : IRVM et IRC selon le bénéficiaire', () => {
  assert.equal(run('capitaux', { nature: 'irvmCommun', beneficiaire: 'morale', montant: 10000000 }).total.valeur, 1500000);
  assert.equal(run('capitaux', { nature: 'irvmCommun', beneficiaire: 'physique', montant: 10000000 }).total.valeur, 1700000);
  assert.equal(run('capitaux', { nature: 'irvmBrvm', beneficiaire: 'physique', montant: 10000000 }).total.valeur, 1200000);
  assert.equal(run('capitaux', { nature: 'ircCommun', montant: 10000000 }).total.valeur, 1800000);
  assert.equal(
    run('capitaux', { nature: 'ircCompteCourant', beneficiaire: 'physique', montant: 10000000 }).total.valeur,
    1350000,
  );
});

test('TVA et TOB : conversions HT/TTC symétriques', () => {
  assert.equal(run('tva', { taxe: 'tvaCommun', sens: 'htVersTtc', montant: 1000000 }).total.valeur, 180000);
  assert.equal(run('tva', { taxe: 'tvaCommun', sens: 'ttcVersHt', montant: 1180000 }).total.valeur, 180000);
  assert.equal(run('tva', { taxe: 'tvaReduit', sens: 'htVersTtc', montant: 1000000 }).total.valeur, 90000);
  assert.equal(run('tva', { taxe: 'tobCommun', sens: 'htVersTtc', montant: 1000000 }).total.valeur, 100000);
  assert.equal(run('tva', { taxe: 'tobReduit', sens: 'htVersTtc', montant: 1000000 }).total.valeur, 50000);
});

test('Accises : ad valorem, cumul tabac et tarifs unitaires', () => {
  assert.equal(run('accises', { produit: 'bieresCidres', base: 5000000 }).total.valeur, 850000);
  assert.equal(run('accises', { produit: 'alcool35EtPlus', base: 5000000 }).total.valeur, 2250000);
  // Tabac : 57 % + 7 % + 2 % = 66 %.
  assert.equal(run('accises', { produit: 'tabacs', base: 10000000 }).total.valeur, 6600000);
  assert.equal(run('accises', { produit: 'superCarburant', quantite: 1000 }).total.valeur, 85000);
  assert.equal(run('accises', { produit: 'cartouches', quantite: 500 }).total.valeur, 6000);
});

test('Assurance : tarifs classiques et microassurance', () => {
  assert.equal(run('assurance', { regime: 'classique', risque: 'incendie', prime: 1000000 }).total.valeur, 250000);
  assert.equal(run('assurance', { regime: 'micro', risque: 'incendie', prime: 1000000 }).total.valeur, 125000);
  assert.equal(run('assurance', { regime: 'classique', risque: 'automobile', prime: 500000 }).total.valeur, 72500);
  assert.equal(run('assurance', { regime: 'micro', risque: 'automobile', prime: 500000 }).total.valeur, 72500);
});

test('Enregistrement : droits proportionnels, fixes et cas particuliers', () => {
  assert.equal(run('enregistrement', { operation: 'venteImmeuble', valeur: 50000000 }).total.valeur, 2000000);
  assert.equal(run('enregistrement', { operation: 'venteFondsDeCommerce', valeur: 50000000 }).total.valeur, 5000000);
  assert.equal(run('enregistrement', { operation: 'venteMeublesTarifGeneral', valeur: 50000000 }).total.valeur, 25000);
  assert.equal(run('enregistrement', { operation: 'formationSociete', valeur: 1000000000 }).total.valeur, 3000000);
  assert.equal(run('enregistrement', { operation: 'formationSociete', valeur: 6000000000 }).total.valeur, 6000000);
  assert.equal(run('enregistrement', { operation: 'succession', valeur: 250000 }).total.valeur, 0);
  assert.equal(run('enregistrement', { operation: 'succession', valeur: 10000000 }).total.format, 'texte');
});

test('Timbre : tranches de quittance et timbre proportionnel', () => {
  assert.equal(run('timbre', { montant: 5000 }).total.valeur, 0);
  assert.equal(run('timbre', { montant: 750000 }).total.valeur, 1000);
  assert.equal(run('timbre', { montant: 6000000 }).total.valeur, 5000);
  assert.equal(run('timbre', { montant: 1000000, proportionnel: 'haut' }).total.valeur, 1000 + 10000);
  assert.equal(run('timbre', { montant: 1000000, proportionnel: 'bas' }).total.valeur, 1000 + 2500);
});

test('Prélèvements : taux, minimum de perception et tarif au tonnage', () => {
  assert.equal(run('prelevements', { nature: 'airsiNormal', base: 20000000 }).total.valeur, 1000000);
  assert.equal(run('prelevements', { nature: 'acomptePrestataires', base: 20000000 }).total.valeur, 400000);
  assert.equal(run('prelevements', { nature: 'taxeSpecialeEquipement', base: 20000000 }).total.valeur, 20000);
  // Minimum de 50 000 F sur la redevance d'évaluation immobilière.
  assert.equal(run('prelevements', { nature: 'redevanceEvaluation', base: 1000000 }).total.valeur, 50000);
  assert.equal(run('prelevements', { nature: 'redevanceEvaluation', base: 20000000 }).total.valeur, 200000);
  // 5 tonnes : 24 000 F + 2 x 1 000 F, pour deux véhicules.
  assert.equal(run('prelevements', { nature: 'transportPrive', charge: 5, vehicules: 2 }).total.valeur, 52000);
  // Toute fraction de tonne compte pour une tonne entière.
  assert.equal(run('prelevements', { nature: 'transportPrive', charge: 4.2, vehicules: 1 }).total.valeur, 26000);
});
