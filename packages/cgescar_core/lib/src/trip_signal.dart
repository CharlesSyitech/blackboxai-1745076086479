/// Carte & trajet : signal d'autonomie et alertes vocales (section 5.3).
library;

enum TripSignal {
  /// Arrivée possible sans arrêt.
  green,

  /// Arrêt nécessaire : une station est atteignable.
  orange,

  /// Aucune station atteignable.
  red,
}

class RouteStation {
  final String id;

  /// Distance depuis le départ, le long de l'itinéraire (km).
  final double distanceAlongRouteKm;
  const RouteStation(this.id, this.distanceAlongRouteKm);
}

class TripAssessment {
  final TripSignal signal;
  final double rangeKm;

  /// Dernière station atteignable (orange).
  final RouteStation? lastReachableStation;

  /// Litres manquants pour arriver à destination.
  final double missingLitres;

  const TripAssessment({
    required this.signal,
    required this.rangeKm,
    this.lastReachableStation,
    this.missingLitres = 0,
  });
}

/// [consumptionLPer100] = consommation du véhicule (L/100 km), saisie par
/// l'utilisateur dans « Mon véhicule & limites ». Sans consommation, on ne
/// peut pas évaluer : `null` (pas de valeur inventée, P8).
TripAssessment? assessTrip({
  required double litresAvailable,
  required double? consumptionLPer100,
  required double routeKm,
  required List<RouteStation> stations,
}) {
  if (consumptionLPer100 == null || consumptionLPer100 <= 0) return null;
  final range = litresAvailable / consumptionLPer100 * 100;
  if (range >= routeKm) {
    return TripAssessment(signal: TripSignal.green, rangeKm: range);
  }
  final needed = routeKm * consumptionLPer100 / 100;
  final missing = needed - litresAvailable;
  RouteStation? last;
  for (final s in stations) {
    if (s.distanceAlongRouteKm <= range &&
        (last == null || s.distanceAlongRouteKm > last.distanceAlongRouteKm)) {
      last = s;
    }
  }
  return TripAssessment(
    signal: last == null ? TripSignal.red : TripSignal.orange,
    rangeKm: range,
    lastReachableStation: last,
    missingLitres: missing,
  );
}

const Duration approachAlertLead = Duration(minutes: 5);
const double passedAlertMeters = 300;

String approachMessage(int minutes) =>
    'Vous êtes à $minutes min d\'une station-service';
const String passedMessage = 'Vous venez de dépasser une station-service';

/// Gère les alertes vocales d'approche / dépassement d'une station, une
/// seule fois par station et par course.
class StationAlertTracker {
  final Set<String> _announcedApproach = {};
  final Set<String> _announcedPassed = {};

  /// [etaToStation] : temps estimé jusqu'à la station (null si dépassée).
  /// [metersPastStation] : distance après la station si dépassée.
  /// [stopped] : vrai si le véhicule s'est arrêté à la station.
  String? update({
    required String stationId,
    Duration? etaToStation,
    double? metersPastStation,
    bool stopped = false,
  }) {
    if (etaToStation != null &&
        etaToStation <= approachAlertLead &&
        _announcedApproach.add(stationId)) {
      final m = etaToStation.inSeconds <= 0
          ? 0
          : (etaToStation.inSeconds / 60).ceil();
      return approachMessage(m);
    }
    if (!stopped &&
        metersPastStation != null &&
        metersPastStation >= passedAlertMeters &&
        _announcedPassed.add(stationId)) {
      return passedMessage;
    }
    return null;
  }

  /// « Inverser l'itinéraire » : nouvelle course, alertes réarmées.
  void reset() {
    _announcedApproach.clear();
    _announcedPassed.clear();
  }
}

/// Alerte d'excès de vitesse : limite selon le type de voie, réglée par
/// l'utilisateur. Sans limite réglée, pas d'alerte.
bool isSpeeding({required double speedKmh, required double? limitKmh}) =>
    limitKmh != null && limitKmh > 0 && speedKmh > limitKmh;
