/** Rendu de l'interface du simulateur fiscal. Aucun framework, uniquement le DOM. */

import { CALCULATEURS, GROUPES, parId, valeursParDefaut } from './calculators.js';
import { UI, formatMontant, formatNombre, formatTaux, locale, tr } from './i18n.js';
import { SOURCE } from './rates.js';
import { toNumber } from './engine.js';

const STOCKAGE = 'simulateur-fiscal-ci';

const etat = {
  langue: 'fr',
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
    // Stockage indisponible (navigation privée, cookies bloqués) : on garde les valeurs par défaut.
  }
  const depuisUrl = location.hash.replace('#', '');
  if (depuisUrl && parId(depuisUrl)) etat.calculateurId = depuisUrl;
  if (!parId(etat.calculateurId)) etat.calculateurId = CALCULATEURS[0].id;
  if (etat.langue !== 'en') etat.langue = 'fr';
}

function sauverEtat() {
  try {
    localStorage.setItem(
      STOCKAGE,
      JSON.stringify({ langue: etat.langue, calculateurId: etat.calculateurId, valeurs: etat.valeurs }),
    );
  } catch {
    // Sans stockage, l'état reste simplement en mémoire.
  }
}

/* --------------------------------- Outils -------------------------------- */

const $ = (selecteur) => document.querySelector(selecteur);

function el(balise, classe, contenu) {
  const noeud = document.createElement(balise);
  if (classe) noeud.className = classe;
  if (contenu !== undefined) noeud.textContent = contenu;
  return noeud;
}

/** Valeurs courantes d'un simulateur, complétées par ses valeurs par défaut. */
function valeursCourantes(calculateur) {
  return { ...valeursParDefaut(calculateur), ...(etat.valeurs[calculateur.id] ?? {}) };
}

/** Champs effectivement visibles compte tenu des valeurs saisies. */
function champsVisibles(calculateur, valeurs) {
  return calculateur.champs.filter((champ) => !champ.visible || champ.visible(valeurs));
}

function formatValeur(ligne, langue) {
  switch (ligne.format) {
    case 'money':
      return formatMontant(ligne.valeur, langue);
    case 'percent':
      return formatTaux(ligne.valeur, langue);
    default:
      return tr(ligne.valeur, langue);
  }
}

/* --------------------------------- Rendu --------------------------------- */

function rendreEntete() {
  const langue = etat.langue;
  $('#titre-app').textContent = tr(UI.appTitre, langue);
  $('#sous-titre-app').textContent = tr(UI.appSousTitre, langue);
  $('#label-langue').textContent = tr(UI.langue, langue);
  document.documentElement.lang = langue;
  document.title = tr(UI.appTitre, langue);

  for (const bouton of document.querySelectorAll('[data-langue]')) {
    const actif = bouton.dataset.langue === langue;
    bouton.classList.toggle('actif', actif);
    bouton.setAttribute('aria-pressed', String(actif));
  }

  $('#recherche').placeholder = tr(UI.rechercher, langue);
  $('#recherche').value = etat.recherche;
  $('#titre-nav').textContent = tr(UI.choisirSimulateur, langue);
  $('#titre-avertissement').textContent = tr(UI.avertissementTitre, langue);
  $('#texte-avertissement').textContent = tr(UI.avertissement, langue);
  $('#source').textContent = `${tr(UI.sourceLabel, langue)} : ${tr(SOURCE.titre, langue)} — ${SOURCE.editeur}, ${SOURCE.edition}.`;
}

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

    const section = el('section', 'nav-groupe');
    section.append(el('h3', 'nav-groupe-titre', tr(groupe.libelle, langue)));
    const liste = el('ul', 'nav-liste');

    for (const calculateur of membres) {
      const item = el('li');
      const bouton = el('button', 'nav-lien');
      bouton.type = 'button';
      bouton.append(el('span', 'nav-lien-titre', tr(calculateur.titre, langue)));
      bouton.append(el('span', 'nav-lien-ref', calculateur.ref));
      if (calculateur.id === etat.calculateurId) {
        bouton.classList.add('actif');
        bouton.setAttribute('aria-current', 'page');
      }
      bouton.addEventListener('click', () => {
        etat.calculateurId = calculateur.id;
        history.replaceState(null, '', `#${calculateur.id}`);
        sauverEtat();
        rendreNavigation();
        rendreSimulateur();
        $('#panneau').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      item.append(bouton);
      liste.append(item);
    }
    section.append(liste);
    nav.append(section);
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
  const visibles = champsVisibles(calculateur, valeurs);
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

  const formulaire = $('#formulaire');
  formulaire.textContent = '';
  for (const champ of visibles) formulaire.append(rendreChamp(calculateur, champ, valeurs));

  const totalLibelle = $('#total-libelle');
  const totalValeur = $('#total-valeur');
  totalLibelle.textContent = tr(resultat.total.libelle, langue);
  totalValeur.textContent = formatValeur(resultat.total, langue);
  totalValeur.classList.toggle('total-texte', resultat.total.format === 'texte');

  const detail = $('#detail');
  detail.textContent = '';
  for (const ligne of resultat.lignes) {
    const item = el('div', ligne.sousLigne ? 'ligne ligne-secondaire' : 'ligne');
    item.append(el('span', 'ligne-libelle', tr(ligne.libelle, langue)));
    item.append(el('span', 'ligne-valeur', formatValeur(ligne, langue)));
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
    // Les champs de type « number » n'exposent pas setSelectionRange ; le curseur se
    // place de lui-même en fin de valeur au focus.
    const cible = document.getElementById(options.focus);
    if (cible && document.activeElement !== cible && cible.type !== 'checkbox') cible.focus();
  }
}

/** Texte exporté par le bouton « Copier le résultat ». */
function resultatEnTexte() {
  const langue = etat.langue;
  const calculateur = parId(etat.calculateurId);
  const valeurs = valeursCourantes(calculateur);
  const resultat = calculateur.calcule(valeurs);

  const lignes = [
    `${tr(calculateur.titre, langue)} — ${calculateur.ref}`,
    '',
    `${tr(UI.parametres, langue)} :`,
    ...champsVisibles(calculateur, valeurs).map((champ) => {
      const valeur = valeurs[champ.nom];
      let affichage;
      if (champ.type === 'bool') affichage = valeur ? tr(UI.oui, langue) : tr(UI.non, langue);
      else if (champ.type === 'select') {
        const option = champ.options.find((o) => String(o.valeur) === String(valeur));
        affichage = option ? tr(option.libelle, langue) : String(valeur);
      } else if (champ.type === 'montant') affichage = formatMontant(toNumber(valeur), langue);
      else affichage = formatNombre(toNumber(valeur), langue);
      return `  - ${tr(champ.libelle, langue)} : ${affichage}`;
    }),
    '',
    `${tr(UI.detail, langue)} :`,
    ...resultat.lignes.map((ligne) => `  - ${tr(ligne.libelle, langue)} : ${formatValeur(ligne, langue)}`),
    '',
    `${tr(resultat.total.libelle, langue)} : ${formatValeur(resultat.total, langue)}`,
    '',
    `${tr(UI.sourceLabel, langue)} : ${tr(SOURCE.titre, langue)} — ${SOURCE.editeur}, ${SOURCE.edition}.`,
  ];
  return lignes.join('\n');
}

/* ------------------------------- Événements ------------------------------ */

function brancherEvenements() {
  for (const bouton of document.querySelectorAll('[data-langue]')) {
    bouton.addEventListener('click', () => {
      etat.langue = bouton.dataset.langue;
      sauverEtat();
      rendreTout();
    });
  }

  $('#recherche').addEventListener('input', (evenement) => {
    etat.recherche = evenement.target.value;
    rendreNavigation();
  });

  $('#bouton-reinitialiser').addEventListener('click', () => {
    delete etat.valeurs[etat.calculateurId];
    sauverEtat();
    rendreSimulateur();
  });

  $('#bouton-copier').addEventListener('click', async (evenement) => {
    const bouton = evenement.currentTarget;
    try {
      await navigator.clipboard.writeText(resultatEnTexte());
      const original = bouton.textContent;
      bouton.textContent = tr(UI.copie, etat.langue);
      setTimeout(() => {
        bouton.textContent = original;
      }, 1600);
    } catch {
      // Presse-papiers refusé : on laisse l'utilisateur sélectionner le texte lui-même.
    }
  });

  $('#bouton-imprimer').addEventListener('click', () => window.print());

  window.addEventListener('hashchange', () => {
    const id = location.hash.replace('#', '');
    if (parId(id) && id !== etat.calculateurId) {
      etat.calculateurId = id;
      sauverEtat();
      rendreNavigation();
      rendreSimulateur();
    }
  });
}

function rendreTout() {
  rendreEntete();
  rendreNavigation();
  rendreSimulateur();
}

chargerEtat();
brancherEvenements();
rendreTout();
document.documentElement.dataset.prete = 'true';
