/// Politique de position GPS pour « Prendre carburant » (section 5.5).
///
/// On réutilise une position **réelle** de l'appareil de moins de 2 min,
/// sinon on demande une position haute précision. On n'utilise jamais
/// les coordonnées de la station.
library;

const Duration maxPositionAge = Duration(minutes: 2);

const String gpsErrorMessage = 'Activez la localisation puis réessayez.';

class DevicePosition {
  final double latitude;
  final double longitude;
  final double? accuracyMeters;
  final DateTime timestamp;

  /// Vrai uniquement pour une position issue du capteur de l'appareil.
  /// Faux pour une position simulée / saisie / issue d'une station.
  final bool fromDeviceSensor;

  /// Position fournie par une application de localisation fictive.
  final bool isMocked;

  const DevicePosition({
    required this.latitude,
    required this.longitude,
    required this.timestamp,
    this.accuracyMeters,
    this.fromDeviceSensor = true,
    this.isMocked = false,
  });
}

/// Vrai si [p] peut être réutilisée sans nouvelle demande GPS.
bool isReusablePosition(DevicePosition? p, {required DateTime now}) {
  if (p == null || !p.fromDeviceSensor || p.isMocked) return false;
  final age = now.difference(p.timestamp);
  return !age.isNegative && age < maxPositionAge;
}
