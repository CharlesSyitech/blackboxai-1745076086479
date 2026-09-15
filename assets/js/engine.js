/**
 * Fonctions de calcul génériques partagées par les simulateurs.
 * Aucun accès au DOM ici : le module est testable sous Node.
 */

/** Convertit une entrée utilisateur en nombre fini (0 par défaut). */
export function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/\s/g, '').replace(/,/g, '.');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Arrondit au franc. */
export function arrondiFranc(montant) {
  return Math.round(montant);
}

/**
 * Applique un barème progressif par tranches.
 * @param {number} base montant imposable
 * @param {{plafond:number, taux:number}[]} bareme tranches ordonnées par plafond croissant
 * @returns {{total:number, detail:{plancher:number, plafond:number, taux:number, assiette:number, impot:number}[]}}
 */
export function baremeProgressif(base, bareme) {
  const assietteTotale = Math.max(0, base);
  let plancher = 0;
  let total = 0;
  const detail = [];
  for (const tranche of bareme) {
    if (assietteTotale <= plancher) break;
    const assiette = Math.min(assietteTotale, tranche.plafond) - plancher;
    const impot = assiette * tranche.taux;
    total += impot;
    detail.push({ plancher, plafond: tranche.plafond, taux: tranche.taux, assiette, impot });
    plancher = tranche.plafond;
  }
  return { total, detail };
}

/** Retourne la tranche d'un barème de droits fixes correspondant au montant. */
export function trancheFixe(montant, bareme) {
  const valeur = Math.max(0, montant);
  return bareme.find((tranche) => valeur <= tranche.plafond) ?? bareme[bareme.length - 1];
}

/** Borne une valeur entre un minimum et un maximum optionnels. */
export function borner(valeur, { minimum = -Infinity, maximum = Infinity } = {}) {
  return Math.min(Math.max(valeur, minimum), maximum);
}

/** Extrait le montant hors taxes d'un montant toutes taxes comprises. */
export function horsTaxes(montantTtc, taux) {
  return montantTtc / (1 + taux);
}

/** Taux effectif d'imposition (0 si l'assiette est nulle). */
export function tauxEffectif(impot, base) {
  return base > 0 ? impot / base : 0;
}
