/// Devises (principe P9) : stockage toujours en XOF, conversion visuelle
/// uniquement avec le taux daté `fx_rates`.
library;

import 'formatters.dart';

enum Currency { xof, xaf, eur, usd }

extension CurrencyCode on Currency {
  String get code => name.toUpperCase();

  /// Symbole affiché.
  String get label => switch (this) {
        Currency.xof => 'FCFA',
        Currency.xaf => 'FCFA (XAF)',
        Currency.eur => '€',
        Currency.usd => r'$',
      };

  int get displayDecimals =>
      this == Currency.xof || this == Currency.xaf ? 0 : 2;
}

/// Taux daté : 1 XOF = [perXof] unités de [currency] à la date [date].
class FxRate {
  final Currency currency;
  final double perXof;
  final DateTime date;

  const FxRate({
    required this.currency,
    required this.perXof,
    required this.date,
  });
}

/// Choisit le taux applicable à [on] : le plus récent dont la date est
/// ≤ [on]. `null` si aucun taux n'existe (on n'invente pas de taux, P8).
FxRate? rateFor(Currency c, DateTime on, Iterable<FxRate> rates) {
  FxRate? best;
  for (final r in rates) {
    if (r.currency != c || r.date.isAfter(on)) continue;
    if (best == null || r.date.isAfter(best.date)) best = r;
  }
  return best;
}

/// Affiche un montant stocké en XOF dans la devise choisie. Retombe sur
/// l'affichage XOF si aucun taux n'est disponible.
String displayAmount(
  double amountXof, {
  required Currency target,
  required DateTime on,
  Iterable<FxRate> rates = const [],
}) {
  if (target == Currency.xof) return formatFcfa(amountXof);
  final rate = rateFor(target, on, rates);
  if (rate == null) return formatFcfa(amountXof);
  final converted = amountXof * rate.perXof;
  final d = target.displayDecimals;
  return '${formatNumber(converted, maxDecimals: d, minDecimals: d)} ${target.label}';
}
