/// Cycle de vie d'un QR (fidélité CGF ou bon CGB), sections 5.5 et 6.
///
/// * nouveau QR à chaque ouverture et à chaque « Renouveler » ;
/// * validité 15 min ;
/// * toute réponse serveur arrivée après un renouvellement est ignorée.
library;

const Duration passValidity = Duration(minutes: 15);

/// Format du code lisible fidélité : CGF-XXXXXXXX.
final RegExp loyaltyCodePattern = RegExp(r'^CGF-[A-Z0-9]{8}$');

/// Format du code bon chauffeur : CGB-… (la longueur exacte est fixée
/// par le serveur, on ne contrôle que le préfixe).
final RegExp voucherCodePattern = RegExp(r'^CGB-[A-Z0-9]{4,}$');

enum PassKind { loyalty, voucher }

/// Détecte le type de code saisi ou scanné par le pompiste.
PassKind? detectPassKind(String raw) {
  final code = normalizePassCode(raw);
  if (code.startsWith('CGF-')) return PassKind.loyalty;
  if (code.startsWith('CGB-')) return PassKind.voucher;
  return null;
}

/// Majuscules, sans espaces ; ajoute le tiret après le préfixe si oublié.
String normalizePassCode(String raw) {
  var c = raw.trim().toUpperCase().replaceAll(RegExp(r'[\s ]'), '');
  final m = RegExp(r'^(CGF|CGB)-?(.+)$').firstMatch(c);
  if (m != null) c = '${m.group(1)}-${m.group(2)}';
  return c;
}

class IssuedPass {
  final String code;
  final String qrPayload;
  final DateTime issuedAt;
  final DateTime expiresAt;

  IssuedPass({
    required this.code,
    required this.qrPayload,
    required this.issuedAt,
    DateTime? expiresAt,
  }) : expiresAt = expiresAt ?? issuedAt.add(passValidity);

  Duration remaining(DateTime now) {
    final r = expiresAt.difference(now);
    return r.isNegative ? Duration.zero : r;
  }

  bool isExpired(DateTime now) => !now.isBefore(expiresAt);
}

/// Garde-fou contre les réponses tardives : chaque demande reçoit un
/// numéro, seule la réponse à la dernière demande est acceptée.
class PassRequestGuard {
  int _generation = 0;

  /// À appeler au début de chaque demande (ouverture ou « Renouveler »).
  int begin() => ++_generation;

  /// Vrai si la réponse à la demande [ticket] doit être affichée.
  bool accept(int ticket) => ticket == _generation;

  /// Invalide toutes les demandes en cours (écran fermé).
  void invalidate() => _generation++;
}
