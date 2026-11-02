/// Annulation avec motif obligatoire (principe P4).
library;

/// Longueur minimale du motif d'annulation.
const int minCancelReasonLength = 5;

/// Renvoie un message d'erreur, ou `null` si le motif est valide.
String? validateCancelReason(String? reason) {
  final r = reason?.trim() ?? '';
  if (r.isEmpty) return 'Le motif est obligatoire.';
  if (r.runes.length < minCancelReasonLength) {
    return 'Le motif doit contenir au moins $minCancelReasonLength caractères.';
  }
  return null;
}
