/// Formules de référence (annexe C du cahier des charges v2.0).
///
/// Toutes ces valeurs sont **provisoires** côté mobile (P5) : elles servent
/// à l'affichage en direct, le serveur recalcule à la validation. Elles
/// doivent néanmoins donner exactement le même résultat que le web sur le
/// jeu de données partagé par Syitech.
library;

import 'dart:math' as math;

/// Tolérance numérique pour neutraliser les erreurs d'arrondi binaire
/// (ex. 10.0 stocké comme 9.999999999).
const double _eps = 1e-9;

// ---------------------------------------------------------------------------
// Opérations annulées (P4)
// ---------------------------------------------------------------------------

/// Toute ligne pouvant être annulée (relève, caisse, vente, bon, prise).
abstract interface class Cancellable {
  bool get isCancelled;
}

/// Exclut les lignes annulées avant tout calcul.
Iterable<T> activeOnly<T extends Cancellable>(Iterable<T> rows) =>
    rows.where((r) => !r.isCancelled);

// ---------------------------------------------------------------------------
// Index / relèves
// ---------------------------------------------------------------------------

/// Segment de compteur : entre deux changements de compteur, ou une
/// période complète s'il n'y a pas eu de changement.
class MeterSegment {
  /// Index d'ouverture (IO) du segment.
  final double opening;

  /// Index de fermeture (IF) du segment.
  final double closing;

  const MeterSegment({required this.opening, required this.closing});

  /// Sortie du segment = IF − IO.
  double get output => closing - opening;
}

/// Construit les segments d'une période avec changement de compteur en
/// cours de journée : `[IO → ancien index de fin]`, puis
/// `[nouvel index de départ → IF]`.
List<MeterSegment> segmentsWithMeterChange({
  required double opening,
  required double oldMeterEnd,
  required double newMeterStart,
  required double closing,
}) =>
    [
      MeterSegment(opening: opening, closing: oldMeterEnd),
      MeterSegment(opening: newMeterStart, closing: closing),
    ];

/// Sortie = Σ (IF − IO) sur tous les segments (un seul segment s'il n'y a
/// pas eu de changement de compteur).
double meterOutput(Iterable<MeterSegment> segments) =>
    segments.fold(0.0, (sum, s) => sum + s.output);

/// Quantité vendue = Sortie − RC (retours en cuve, contre-pleins inclus).
double quantitySold({required double output, double returnedToTank = 0}) =>
    output - returnedToTank;

/// Base de calcul du CA choisie par le gérant.
enum RevenueBasis { mechanical, electronic }

/// CA = Quantité vendue (base mécanique ou électronique) × prix appliqué.
double revenue({
  required RevenueBasis basis,
  required double mechanicalQuantity,
  required double electronicQuantity,
  required double unitPrice,
}) {
  final qty = basis == RevenueBasis.mechanical
      ? mechanicalQuantity
      : electronicQuantity;
  return qty * unitPrice;
}

/// Écart électronique = Index électronique − quantité vendue aux pompes.
double electronicGap({
  required double electronicIndex,
  required double soldAtPumps,
}) =>
    electronicIndex - soldAtPumps;

// ---------------------------------------------------------------------------
// Stocks et jaugeages
// ---------------------------------------------------------------------------

/// Stock théorique disponible pour vente =
/// Jauge ouverture + réceptions − vente sur stock.
double theoreticalStock({
  required double openingGauge,
  double receipts = 0,
  required double salesFromStock,
}) =>
    openingGauge + receipts - salesFromStock;

/// Écart de vente = jauge de fermeture − stock théorique.
/// Négatif = manquant.
double salesGap({required double closingGauge, required double theoretical}) =>
    closingGauge - theoretical;

/// Cuve physique (ou virtuelle) avec sa capacité et son dernier niveau.
class TankLevel {
  final String productId;
  final double capacity;

  /// `null` = cuve non jaugée : comptée à 0.
  final double? level;

  const TankLevel({
    required this.productId,
    required this.capacity,
    this.level,
  });

  double get levelOrZero => level ?? 0;
}

/// « Grande Cuve » virtuelle d'un produit (jeu de vannes) :
/// Σ capacités et Σ niveaux des cuves du produit (cuve non jaugée = 0).
TankLevel bigTank(String productId, Iterable<TankLevel> tanks) {
  var capacity = 0.0;
  var level = 0.0;
  for (final t in tanks.where((t) => t.productId == productId)) {
    capacity += t.capacity;
    level += t.levelOrZero;
  }
  return TankLevel(productId: productId, capacity: capacity, level: level);
}

/// Niveau de sécurité d'une cuve.
enum TankAlert { ok, safetyPreAlert, unusable }

/// Pré-alerte à +10 % de la capacité minimale, alerte direction au niveau
/// non utilisable. [minimumLevel] et [unusableLevel] viennent de la
/// configuration de la cuve — jamais de seuil inventé (P8).
TankAlert tankAlert({
  required double level,
  required double minimumLevel,
  required double unusableLevel,
}) {
  if (level <= unusableLevel + _eps) return TankAlert.unusable;
  if (level <= minimumLevel * 1.10 + _eps) return TankAlert.safetyPreAlert;
  return TankAlert.ok;
}

// ---------------------------------------------------------------------------
// Tolérances (‰)
// ---------------------------------------------------------------------------

/// Seuil par défaut ±5 ‰ (configurable par inspecteur/direction).
const double defaultTolerancePerMille = 5.0;

/// TV (‰) = écart vente / quantité vendue × 1000.
/// `null` si la quantité vendue est nulle (indicateur non calculable).
double? salesTolerance({required double salesGap, required double sold}) =>
    sold.abs() < _eps ? null : salesGap / sold * 1000;

/// TL (‰) = écart livraison / (réception + écart livraison) × 1000.
double? deliveryTolerance({
  required double deliveryGap,
  required double received,
}) {
  final base = received + deliveryGap;
  return base.abs() < _eps ? null : deliveryGap / base * 1000;
}

/// Tolérance totale = TV + TL (une composante absente compte pour 0,
/// les deux absentes = `null`).
double? totalTolerance(double? tv, double? tl) =>
    tv == null && tl == null ? null : (tv ?? 0) + (tl ?? 0);

/// Vrai si la valeur reste dans ±[threshold] ‰.
bool withinTolerance(double perMille,
        {double threshold = defaultTolerancePerMille}) =>
    perMille.abs() <= threshold + _eps;

/// Les écarts ne s'affichent que si jaugeages ET index existent à la
/// même date.
bool canShowGaps({DateTime? gaugeDate, DateTime? indexDate}) =>
    gaugeDate != null &&
    indexDate != null &&
    gaugeDate.year == indexDate.year &&
    gaugeDate.month == indexDate.month &&
    gaugeDate.day == indexDate.day;

// ---------------------------------------------------------------------------
// Caisse
// ---------------------------------------------------------------------------

/// Dû du jour = Revenus carburant − Conso clients à crédit − Dépenses
/// + Encaissements de créances.
double cashDueOfDay({
  required double fuelRevenue,
  required double creditConsumption,
  required double expenses,
  required double receivablesCollected,
}) =>
    fuelRevenue - creditConsumption - expenses + receivablesCollected;

/// Espèce théorique = (qté vendue − conso bons − conso internes) × prix.
double theoreticalCash({
  required double quantitySold,
  required double voucherConsumption,
  required double internalConsumption,
  required double unitPrice,
}) =>
    (quantitySold - voucherConsumption - internalConsumption) * unitPrice;

// ---------------------------------------------------------------------------
// Fidélité
// ---------------------------------------------------------------------------

/// Points fidélité = ⌊litres⌋ + bonus de campagne actifs.
/// 13,79 L = 13 points. Le calcul définitif est fait par le serveur.
int loyaltyPoints(double litres, {Iterable<int> activeBonuses = const []}) {
  if (litres <= 0) return activeBonuses.fold(0, (a, b) => a + b);
  final base = (litres + _eps).floor();
  return base + activeBonuses.fold(0, (a, b) => a + b);
}

/// Niveaux de carte fidélité.
enum LoyaltyTier { silver, gold, diamond }

/// Niveau selon les seuils propres à chaque compagnie
/// (`loyalty_programs`). Sans seuils configurés, la carte reste Argent.
LoyaltyTier loyaltyTier(int points, {int? goldThreshold, int? diamondThreshold}) {
  if (diamondThreshold != null && points >= diamondThreshold) {
    return LoyaltyTier.diamond;
  }
  if (goldThreshold != null && points >= goldThreshold) return LoyaltyTier.gold;
  return LoyaltyTier.silver;
}

// ---------------------------------------------------------------------------
// Divers
// ---------------------------------------------------------------------------

/// Conversion montant → litres au prix du marché (Carte & trajet).
double litresForAmount(double amount, double unitPrice) =>
    unitPrice <= 0 ? 0 : amount / unitPrice;

/// Arrondi « FCFA » (sans décimales), demi vers le haut.
int roundFcfa(double amount) => amount.round();

/// Arrondi à [decimals] décimales (litres : 2).
double roundTo(double v, int decimals) {
  final f = math.pow(10, decimals);
  return (v * f).round() / f;
}
