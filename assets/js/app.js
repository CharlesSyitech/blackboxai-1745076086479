/**
 * Interface du guide fiscal ivoirien.
 *
 * Deux vues partagent le même état : le guide interrogeable, qui répond à une
 * question en assemblant la fiche correspondante depuis le corpus, et les
 * simulateurs, qui exécutent le calcul. Les deux se renvoient l'un à l'autre.
 */

import { CALCULATEURS, GROUPES, parId, valeursParDefaut } from './calculators.js';
import { FICHES, TITRES, ficheParId, fichesDuCalculateur } from './corpus.js';
import { EXEMPLES, rechercher } from './search.js';
import { UI, formatMontant, formatNombre, formatTaux, tr } from './i18n.js';
import { SOURCE } from './rates.js';
import { toNumber } from './engine.js';

const STOCKAGE = 'guide-fiscal-ci';

const etat = {
  langue: 'fr',
  vue: 'guide',
  question: '',
  ficheId: 'its',
  calculateurId: CALCULATEURS[0].id,
  valeurs: {},
  recherche: '',
};

/* ------------------------------ Persistance ------------------------------ */

function chargerEtat() {
  try {
    const brut = localStorage.getItem(STOCKAGE);
    if (brut) Object.assign(etat, JSON.parse(brut));
  } catch {
    // Stockage indisponible (navigation privée, cookies bloqués) : valeurs par défaut.
  }
  appliquerHash(location.hash);
  if (!ficheParId(etat.ficheId)) etat.ficheId = 'its';
  if (!parId(etat.calculateurId)) etat.calculateurId = CALCULATEURS[0].id;
  if (etat.vue !== 'simulateurs') etat.vue = 'guide';
  if (etat.langue !== 'en') etat.langue = 'fr';
}

function sauverEtat() {
  try {
    localStorage.setItem(
      STOCKAGE,
      JSON.stringify({
        langue: etat.langue,
        vue: etat.vue,
        question: etat.question,
        ficheId: etat.ficheId,
        calculateurId: etat.calculateurId,
        valeurs: etat.valeurs,
      }),
    );
  } catch {
    // Sans stockage, l'état reste en mémoire pour la session.
  }
}

/** `#fiche/its` ou `#calc/tva` sélectionnent directement une fiche ou un simulateur. */
function appliquerHash(hash) {
  const [type, id] = hash.replace('#', '').split('/');
  if (type === 'fiche' && ficheParId(id)) {
    etat.vue = 'guide';
    etat.ficheId = id;
  } else if (type === 'calc' && parId(id)) {
    etat.vue = 'simulateurs';
    etat.calculateurId = id;
  }
}

function majHash() {
  const cible = etat.vue === 'guide' ? `#fiche/${etat.ficheId}` : `#calc/${etat.calculateurId}`;
  if (location.hash !== cible) history.replaceState(null, '', cible);
}

/* --------------------------------- Outils -------------------------------- */

const $ = (selecteur) => document.querySelector(selecteur);

function el(balise, classe, contenu) {
  const noeud = document.createElement(balise);
  if (classe) noeud.className = classe;
  if (contenu !== undefined) noeud.textContent = contenu;
  return noeud;
}

function bouton(classe, contenu, onClick) {
  const noeud = el('button', classe, contenu);
  noeud.type = 'button';
  noeud.addEventListener('click', onClick);
  return noeud;
}

/** Rend une ligne de taux du corpus : pourcentage, montant ou texte libre. */
function formatLigneTaux(ligne, langue) {
  if (ligne.taux !== undefined) return formatTaux(ligne.taux, langue);
  if (ligne.montant !== undefined) {
    const montant = formatMontant(ligne.montant, langue);
    return ligne.unite ? `${montant} ${tr(ligne.unite, langue)}` : montant;
  }
  return tr(ligne.valeur, langue);
}

function formatValeurResultat(ligne, langue) {
  switch (ligne.format) {
    case 'money':
      return formatMontant(ligne.valeur, langue);
    case 'percent':
      return formatTaux(ligne.valeur, langue);
    default:
      return tr(ligne.valeur, langue);
  }
}

function valeursCourantes(calculateur) {
  return { ...valeursParDefaut(calculateur), ...(etat.valeurs[calculateur.id] ?? {}) };
}

function champsVisibles(calculateur, valeurs) {
  return calculateur.champs.filter((champ) => !champ.visible || champ.visible(valeurs));
}

/** Libellé lisible de la valeur saisie pour un champ de simulateur. */
function libelleValeurChamp(champ, valeur, langue) {
  if (champ.type === 'bool') return valeur ? tr(UI.oui, langue) : tr(UI.non, langue);
  if (champ.type === 'select') {
    const option = champ.options.find((o) => String(o.valeur) === String(valeur));
    return option ? tr(option.libelle, langue) : String(valeur);
  }
  if (champ.type === 'montant') return formatMontant(toNumber(valeur), langue);
  return formatNombre(toNumber(valeur), langue);
}

/**
 * Exemple chiffré d'une fiche : le simulateur rattaché est exécuté avec ses
 * valeurs par défaut, de sorte que le chiffre montré est toujours celui que
 * l'utilisateur retrouvera en ouvrant le calculateur.
 */
function exempleChiffre(fiche, langue) {
  if (!fiche.calculateur) return null;
  const calculateur = parId(fiche.calculateur);
  const valeurs = valeursParDefaut(calculateur);
  const resultat = calculateur.calcule(valeurs);
  return {
    parametres: champsVisibles(calculateur, valeurs).map(
      (champ) => `${tr(champ.libelle, langue)} : ${libelleValeurChamp(champ, valeurs[champ.nom], langue)}`,
    ),
    libelle: tr(resultat.total.libelle, langue),
    valeur: formatValeurResultat(resultat.total, langue),
  };
}

/* ------------------------------ Vue « guide » ----------------------------- */

function rendreExemples() {
  const langue = etat.langue;
  const conteneur = $('#exemples');
  conteneur.textContent = '';
  if (etat.question.trim()) return;

  conteneur.append(el('span', 'exemples-titre', tr(UI.exemplesTitre, langue)));
  for (const exemple of EXEMPLES) {
    const texte = tr(exemple, langue);
    conteneur.append(
      bouton('puce', texte, () => {
        etat.question = texte;
        $('#question').value = texte;
        const premier = rechercher(texte)[0];
        if (premier) etat.ficheId = premier.fiche.id;
        sauverEtat();
        rendreGuide();
      }),
    );
  }
}

function rendreListeFiches() {
  const langue = etat.langue;
  const liste = $('#liste-fiches');
  liste.textContent = '';
  const question = etat.question.trim();

  const lienFiche = (fiche, score) => {
    const noeud = bouton('nav-lien', undefined, () => {
      etat.ficheId = fiche.id;
      sauverEtat();
      majHash();
      rendreGuide();
      $('#panneau-fiche').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    noeud.append(el('span', 'nav-lien-titre', tr(fiche.titre, langue)));
    noeud.append(el('span', 'nav-lien-ref', fiche.refs));
    if (fiche.id === etat.ficheId) {
      noeud.classList.add('actif');
      noeud.setAttribute('aria-current', 'true');
    }
    if (score !== undefined) noeud.dataset.score = score.toFixed(1);
    return noeud;
  };

  if (question) {
    const resultats = rechercher(question, undefined, { limite: 10 });
    $('#titre-liste').textContent = tr(UI.resultatsRecherche, langue);
    if (resultats.length === 0) {
      liste.append(el('p', 'vide', tr(UI.aucuneFiche, langue)));
      liste.append(el('p', 'vide', tr(UI.reformuler, langue)));
      return;
    }
    const ul = el('ul', 'nav-liste');
    for (const resultat of resultats) {
      const item = el('li');
      item.append(lienFiche(resultat.fiche, resultat.score));
      ul.append(item);
    }
    liste.append(ul);
    return;
  }

  $('#titre-liste').textContent = tr(UI.parcourir, langue);
  liste.append(el('p', 'compteur', `${FICHES.length} ${tr(UI.ficheCompte, langue)}`));
  for (const titre of TITRES) {
    const membres = FICHES.filter((fiche) => fiche.groupe === titre.id);
    if (membres.length === 0) continue;
    const section = el('section', 'nav-groupe');
    section.append(el('h3', 'nav-groupe-titre', tr(titre.libelle, langue)));
    const ul = el('ul', 'nav-liste');
    for (const fiche of membres) {
      const item = el('li');
      item.append(lienFiche(fiche));
      ul.append(item);
    }
    section.append(ul);
    liste.append(section);
  }
}

/** Bloc « intitulé / contenu » d'une fiche. */
function section(titre, contenu) {
  const bloc = el('section', 'fiche-section');
  bloc.append(el('h3', 'fiche-section-titre', titre));
  bloc.append(contenu);
  return bloc;
}

function rendreFiche() {
  const langue = etat.langue;
  const fiche = ficheParId(etat.ficheId);
  const article = $('#fiche');
  article.textContent = '';

  const entete = el('header', 'fiche-entete');
  entete.append(el('h2', 'fiche-titre', tr(fiche.titre, langue)));
  const meta = el('p', 'fiche-meta');
  meta.append(el('span', 'panneau-ref', fiche.refs));
  if (fiche.sigles.length > 0) meta.append(el('span', 'fiche-sigles', fiche.sigles.join(' · ')));
  entete.append(meta);
  article.append(entete);

  article.append(section(tr(UI.definitionLabel, langue), el('p', 'fiche-texte', tr(fiche.definition, langue))));

  if (fiche.situations?.length) {
    const liste = el('ul', 'fiche-situations');
    for (const situation of fiche.situations) liste.append(el('li', null, tr(situation, langue)));
    article.append(section(tr(UI.situationsLabel, langue), liste));
  }

  article.append(section(tr(UI.redevableLabel, langue), el('p', 'fiche-texte', tr(fiche.redevable, langue))));
  article.append(section(tr(UI.assietteLabel, langue), el('p', 'fiche-texte', tr(fiche.assiette, langue))));

  const tableau = el('div', 'taux-liste');
  for (const ligne of fiche.taux) {
    const item = el('div', 'ligne');
    item.append(el('span', 'ligne-libelle', tr(ligne.libelle, langue)));
    item.append(el('span', 'ligne-valeur', formatLigneTaux(ligne, langue)));
    tableau.append(item);
  }
  article.append(section(tr(UI.tauxLabel, langue), tableau));

  if (fiche.formule) {
    const encart = el('p', 'fiche-formule', tr(fiche.formule, langue));
    article.append(section(tr(UI.formuleLabel, langue), encart));
  }

  const exemple = exempleChiffre(fiche, langue);
  if (exemple) {
    const bloc = el('div', 'fiche-exemple');
    const params = el('ul', 'fiche-exemple-params');
    for (const parametre of exemple.parametres) params.append(el('li', null, parametre));
    bloc.append(params);
    const resultat = el('p', 'fiche-exemple-resultat');
    resultat.append(el('span', null, `${exemple.libelle} : `));
    resultat.append(el('strong', null, exemple.valeur));
    bloc.append(resultat);
    article.append(section(tr(UI.exempleChiffre, langue), bloc));
  }

  if (fiche.exonerations?.length) {
    const ul = el('ul', 'fiche-liste');
    for (const exoneration of fiche.exonerations) ul.append(el('li', null, tr(exoneration, langue)));
    article.append(section(tr(UI.exonerationsLabel, langue), ul));
  }

  const liens = (fiche.liens ?? []).map(ficheParId).filter(Boolean);
  if (liens.length > 0) {
    const groupe = el('div', 'fiche-liens');
    for (const voisine of liens) {
      groupe.append(
        bouton('puce', tr(voisine.titre, langue), () => {
          etat.ficheId = voisine.id;
          sauverEtat();
          majHash();
          rendreGuide();
          $('#panneau-fiche').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }),
      );
    }
    article.append(section(tr(UI.liensLabel, langue), groupe));
  }

  const actions = el('div', 'actions');
  if (fiche.calculateur) {
    actions.append(
      bouton('bouton bouton-principal', tr(UI.ouvrirSimulateur, langue), () => {
        etat.vue = 'simulateurs';
        etat.calculateurId = fiche.calculateur;
        sauverEtat();
        majHash();
        rendreTout();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }),
    );
  }
  actions.append(
    bouton('bouton bouton-secondaire', tr(UI.copierFiche, langue), async (evenement) => {
      await copier(evenement.currentTarget, ficheEnTexte(fiche, langue));
    }),
  );
  article.append(actions);
}

function rendreGuide() {
  rendreExemples();
  rendreListeFiches();
  rendreFiche();
}

/** Fiche exportée en texte brut, pour le presse-papiers. */
function ficheEnTexte(fiche, langue) {
  const lignes = [
    tr(fiche.titre, langue),
    fiche.refs,
    '',
    `${tr(UI.definitionLabel, langue)} : ${tr(fiche.definition, langue)}`,
    `${tr(UI.redevableLabel, langue)} : ${tr(fiche.redevable, langue)}`,
    `${tr(UI.assietteLabel, langue)} : ${tr(fiche.assiette, langue)}`,
    ...(fiche.situations?.length
      ? ['', `${tr(UI.situationsLabel, langue)} :`, ...fiche.situations.map((s) => `  - ${tr(s, langue)}`)]
      : []),
    '',
    `${tr(UI.tauxLabel, langue)} :`,
    ...fiche.taux.map((ligne) => `  - ${tr(ligne.libelle, langue)} : ${formatLigneTaux(ligne, langue)}`),
  ];
  if (fiche.formule) lignes.push('', `${tr(UI.formuleLabel, langue)} : ${tr(fiche.formule, langue)}`);
  if (fiche.exonerations?.length) {
    lignes.push('', `${tr(UI.exonerationsLabel, langue)} :`);
    lignes.push(...fiche.exonerations.map((exoneration) => `  - ${tr(exoneration, langue)}`));
  }
  lignes.push('', `${tr(UI.sourceLabel, langue)} : ${tr(SOURCE.titre, langue)} — ${SOURCE.editeur}, ${SOURCE.edition}.`);
  return lignes.join('\n');
}

/* --------------------------- Vue « simulateurs » -------------------------- */

function rendreNavigation() {
  const langue = etat.langue;
  const nav = $('#navigation');
  nav.textContent = '';
  const recherche = etat.recherche.trim().toLowerCase();

  const correspond = (calculateur) =>
    !recherche ||
    [calculateur.titre, calculateur.resume].some((champ) => tr(champ, langue).toLowerCase().includes(recherche)) ||
    calculateur.ref.toLowerCase().includes(recherche);

  let visibles = 0;
  for (const groupe of GROUPES) {
    const membres = CALCULATEURS.filter((c) => c.groupe === groupe.id && correspond(c));
    if (membres.length === 0) continue;
    visibles += membres.length;

    const bloc = el('section', 'nav-groupe');
    bloc.append(el('h3', 'nav-groupe-titre', tr(groupe.libelle, langue)));
    const liste = el('ul', 'nav-liste');

    for (const calculateur of membres) {
      const item = el('li');
      const lien = bouton('nav-lien', undefined, () => {
        etat.calculateurId = calculateur.id;
        sauverEtat();
        majHash();
        rendreNavigation();
        rendreSimulateur();
        $('#panneau').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      lien.append(el('span', 'nav-lien-titre', tr(calculateur.titre, langue)));
      lien.append(el('span', 'nav-lien-ref', calculateur.ref));
      if (calculateur.id === etat.calculateurId) {
        lien.classList.add('actif');
        lien.setAttribute('aria-current', 'page');
      }
      item.append(lien);
      liste.append(item);
    }
    bloc.append(liste);
    nav.append(bloc);
  }

  if (visibles === 0) nav.append(el('p', 'vide', tr(UI.aucunResultat, langue)));
}

function rendreChamp(calculateur, champ, valeurs) {
  const langue = etat.langue;
  const bloc = el('div', `champ champ-${champ.type}`);
  const identifiant = `champ-${calculateur.id}-${champ.nom}`;

  const majRendu = (valeur) => {
    etat.valeurs[calculateur.id] = { ...valeurs, [champ.nom]: valeur };
    sauverEtat();
    rendreSimulateur({ focus: identifiant });
  };

  if (champ.type === 'bool') {
    const label = el('label', 'bool-controle');
    const case_ = document.createElement('input');
    case_.type = 'checkbox';
    case_.id = identifiant;
    case_.checked = Boolean(valeurs[champ.nom]);
    case_.addEventListener('change', () => majRendu(case_.checked));
    label.append(case_, el('span', null, tr(champ.libelle, langue)));
    bloc.append(label);
    if (champ.aide) bloc.append(el('p', 'champ-aide', tr(champ.aide, langue)));
    return bloc;
  }

  const label = el('label', 'champ-label', tr(champ.libelle, langue));
  label.htmlFor = identifiant;
  bloc.append(label);

  if (champ.type === 'select') {
    const select = document.createElement('select');
    select.id = identifiant;
    for (const option of champ.options) {
      const noeud = document.createElement('option');
      noeud.value = String(option.valeur);
      noeud.textContent = tr(option.libelle, langue);
      noeud.selected = String(option.valeur) === String(valeurs[champ.nom]);
      select.append(noeud);
    }
    select.addEventListener('change', () => majRendu(select.value));
    bloc.append(select);
  } else {
    const enveloppe = el('div', 'champ-nombre');
    const input = document.createElement('input');
    input.type = 'number';
    input.id = identifiant;
    input.min = '0';
    input.step = champ.type === 'montant' ? '1000' : 'any';
    input.inputMode = 'decimal';
    input.value = valeurs[champ.nom] === '' ? '' : String(toNumber(valeurs[champ.nom]));
    input.addEventListener('input', () => majRendu(input.value === '' ? '' : toNumber(input.value)));
    enveloppe.append(input);
    if (champ.type === 'montant') {
      enveloppe.append(el('span', 'champ-unite', langue === 'en' ? 'XOF' : 'F CFA'));
    }
    bloc.append(enveloppe);
    if (champ.type === 'montant' && toNumber(valeurs[champ.nom]) > 0) {
      bloc.append(el('p', 'champ-apercu', formatMontant(toNumber(valeurs[champ.nom]), langue)));
    }
  }

  if (champ.aide) bloc.append(el('p', 'champ-aide', tr(champ.aide, langue)));
  return bloc;
}

function rendreSimulateur(options = {}) {
  const langue = etat.langue;
  const calculateur = parId(etat.calculateurId);
  const valeurs = valeursCourantes(calculateur);
  const resultat = calculateur.calcule(valeurs);

  $('#titre-calculateur').textContent = tr(calculateur.titre, langue);
  $('#resume-calculateur').textContent = tr(calculateur.resume, langue);
  $('#ref-calculateur').textContent = `${tr(UI.reference, langue)} : ${calculateur.ref}`;
  $('#titre-parametres').textContent = tr(UI.parametres, langue);
  $('#titre-resultats').textContent = tr(UI.resultats, langue);
  $('#titre-detail').textContent = tr(UI.detail, langue);
  $('#bouton-reinitialiser').textContent = tr(UI.reinitialiser, langue);
  $('#bouton-copier').textContent = tr(UI.copier, langue);
  $('#bouton-imprimer').textContent = tr(UI.imprimer, langue);

  const fiches = fichesDuCalculateur(calculateur.id);
  const lienFiche = $('#bouton-voir-fiche');
  lienFiche.textContent = tr(UI.voirFiche, langue);
  lienFiche.hidden = fiches.length === 0;
  lienFiche.onclick = () => {
    etat.vue = 'guide';
    etat.ficheId = fiches[0].id;
    sauverEtat();
    majHash();
    rendreTout();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formulaire = $('#formulaire');
  formulaire.textContent = '';
  for (const champ of champsVisibles(calculateur, valeurs)) {
    formulaire.append(rendreChamp(calculateur, champ, valeurs));
  }

  const totalValeur = $('#total-valeur');
  $('#total-libelle').textContent = tr(resultat.total.libelle, langue);
  totalValeur.textContent = formatValeurResultat(resultat.total, langue);
  totalValeur.classList.toggle('total-texte', resultat.total.format === 'texte');

  const detail = $('#detail');
  detail.textContent = '';
  for (const ligne of resultat.lignes) {
    const item = el('div', ligne.sousLigne ? 'ligne ligne-secondaire' : 'ligne');
    item.append(el('span', 'ligne-libelle', tr(ligne.libelle, langue)));
    item.append(el('span', 'ligne-valeur', formatValeurResultat(ligne, langue)));
    detail.append(item);
  }

  const notes = $('#notes');
  notes.textContent = '';
  if (resultat.notes.length > 0) {
    notes.append(el('h3', 'notes-titre', tr(UI.notes, langue)));
    const liste = el('ul', 'notes-liste');
    for (const note of resultat.notes) liste.append(el('li', null, tr(note, langue)));
    notes.append(liste);
  }

  if (options.focus) {
    // Le formulaire est reconstruit à chaque frappe : on rend le focus au champ saisi.
    const cible = document.getElementById(options.focus);
    if (cible && document.activeElement !== cible && cible.type !== 'checkbox') cible.focus();
  }
}

/** Résultat du simulateur exporté en texte brut. */
function resultatEnTexte() {
  const langue = etat.langue;
  const calculateur = parId(etat.calculateurId);
  const valeurs = valeursCourantes(calculateur);
  const resultat = calculateur.calcule(valeurs);

  return [
    `${tr(calculateur.titre, langue)} — ${calculateur.ref}`,
    '',
    `${tr(UI.parametres, langue)} :`,
    ...champsVisibles(calculateur, valeurs).map(
      (champ) => `  - ${tr(champ.libelle, langue)} : ${libelleValeurChamp(champ, valeurs[champ.nom], langue)}`,
    ),
    '',
    `${tr(UI.detail, langue)} :`,
    ...resultat.lignes.map((ligne) => `  - ${tr(ligne.libelle, langue)} : ${formatValeurResultat(ligne, langue)}`),
    '',
    `${tr(resultat.total.libelle, langue)} : ${formatValeurResultat(resultat.total, langue)}`,
    '',
    `${tr(UI.sourceLabel, langue)} : ${tr(SOURCE.titre, langue)} — ${SOURCE.editeur}, ${SOURCE.edition}.`,
  ].join('\n');
}

/* ------------------------------- Événements ------------------------------ */

async function copier(bouton, texte) {
  try {
    await navigator.clipboard.writeText(texte);
    const original = bouton.textContent;
    bouton.textContent = tr(UI.copie, etat.langue);
    setTimeout(() => {
      bouton.textContent = original;
    }, 1600);
  } catch {
    // Presse-papiers refusé : l'utilisateur peut sélectionner le texte lui-même.
  }
}

function brancherEvenements() {
  for (const noeud of document.querySelectorAll('[data-langue]')) {
    noeud.addEventListener('click', () => {
      etat.langue = noeud.dataset.langue;
      sauverEtat();
      rendreTout();
    });
  }

  for (const onglet of document.querySelectorAll('[data-vue]')) {
    onglet.addEventListener('click', () => {
      etat.vue = onglet.dataset.vue;
      sauverEtat();
      majHash();
      rendreTout();
    });
  }

  $('#question').addEventListener('input', (evenement) => {
    etat.question = evenement.target.value;
    const premier = rechercher(etat.question)[0];
    if (premier) etat.ficheId = premier.fiche.id;
    sauverEtat();
    majHash();
    rendreGuide();
  });

  $('#bouton-effacer').addEventListener('click', () => {
    etat.question = '';
    $('#question').value = '';
    sauverEtat();
    rendreGuide();
    $('#question').focus();
  });

  $('#recherche').addEventListener('input', (evenement) => {
    etat.recherche = evenement.target.value;
    rendreNavigation();
  });

  $('#bouton-reinitialiser').addEventListener('click', () => {
    delete etat.valeurs[etat.calculateurId];
    sauverEtat();
    rendreSimulateur();
  });

  $('#bouton-copier').addEventListener('click', (evenement) => copier(evenement.currentTarget, resultatEnTexte()));
  $('#bouton-imprimer').addEventListener('click', () => window.print());

  window.addEventListener('hashchange', () => {
    appliquerHash(location.hash);
    sauverEtat();
    rendreTout();
  });
}

/* --------------------------------- Rendu --------------------------------- */

function rendreChrome() {
  const langue = etat.langue;
  $('#titre-app').textContent = tr(UI.appTitre, langue);
  $('#sous-titre-app').textContent = tr(UI.appSousTitre, langue);
  $('#label-langue').textContent = tr(UI.langue, langue);
  $('#onglet-guide').textContent = tr(UI.vueGuide, langue);
  $('#onglet-simulateurs').textContent = tr(UI.vueSimulateurs, langue);
  $('#label-question').textContent = tr(UI.questionLabel, langue);
  $('#question').placeholder = tr(UI.questionPlaceholder, langue);
  $('#question').value = etat.question;
  $('#bouton-effacer').textContent = tr(UI.effacer, langue);
  $('#recherche').placeholder = tr(UI.rechercher, langue);
  $('#recherche').value = etat.recherche;
  $('#titre-nav').textContent = tr(UI.choisirSimulateur, langue);
  $('#titre-avertissement').textContent = tr(UI.avertissementTitre, langue);
  $('#texte-avertissement').textContent = tr(UI.avertissement, langue);
  $('#source').textContent = `${tr(UI.sourceLabel, langue)} : ${tr(SOURCE.titre, langue)} — ${SOURCE.editeur}, ${SOURCE.edition}.`;

  document.documentElement.lang = langue;
  document.title = tr(UI.appTitre, langue);

  for (const noeud of document.querySelectorAll('[data-langue]')) {
    const actif = noeud.dataset.langue === langue;
    noeud.classList.toggle('actif', actif);
    noeud.setAttribute('aria-pressed', String(actif));
  }
  for (const onglet of document.querySelectorAll('[data-vue]')) {
    const actif = onglet.dataset.vue === etat.vue;
    onglet.classList.toggle('actif', actif);
    onglet.setAttribute('aria-pressed', String(actif));
  }
  $('#vue-guide').hidden = etat.vue !== 'guide';
  $('#vue-simulateurs').hidden = etat.vue !== 'simulateurs';
}

function rendreTout() {
  rendreChrome();
  if (etat.vue === 'guide') rendreGuide();
  else {
    rendreNavigation();
    rendreSimulateur();
  }
}

chargerEtat();
brancherEvenements();
majHash();
rendreTout();
document.documentElement.dataset.prete = 'true';
