/// Formats d'affichage (principe P10).
///
/// * Dates JJ/MM/AAAA, heures 24 h ;
/// * litres : 2 décimales maximum ;
/// * FCFA : sans décimales ;
/// * séparateur de milliers = espace (insécable fine, U+202F, pour éviter
///   les retours à la ligne au milieu d'un montant).
library;

const String thousandsSeparator = ' ';

String _two(int v) => v.toString().padLeft(2, '0');

/// 02/11/2026
String formatDate(DateTime d) => '${_two(d.day)}/${_two(d.month)}/${d.year}';

/// 14:05
String formatTime(DateTime d) => '${_two(d.hour)}:${_two(d.minute)}';

/// 02/11/2026 14:05
String formatDateTime(DateTime d) => '${formatDate(d)} ${formatTime(d)}';

String _groupThousands(String digits) {
  final out = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) out.write(thousandsSeparator);
    out.write(digits[i]);
  }
  return out.toString();
}

/// Formate un nombre avec au plus [maxDecimals] décimales (zéros inutiles
/// supprimés), virgule décimale, milliers séparés par une espace.
String formatNumber(num value, {int maxDecimals = 2, int minDecimals = 0}) {
  final negative = value < 0;
  var fixed = value.abs().toStringAsFixed(maxDecimals);
  var intPart = fixed;
  var decPart = '';
  final dot = fixed.indexOf('.');
  if (dot >= 0) {
    intPart = fixed.substring(0, dot);
    decPart = fixed.substring(dot + 1);
    while (decPart.length > minDecimals && decPart.endsWith('0')) {
      decPart = decPart.substring(0, decPart.length - 1);
    }
  }
  final grouped = _groupThousands(intPart);
  final result = decPart.isEmpty ? grouped : '$grouped,$decPart';
  final isZero = RegExp(r'^[0\s, ]*$').hasMatch(result);
  return negative && !isZero ? '-$result' : result;
}

/// 1 234,5 L
String formatLitres(num litres) => '${formatNumber(litres)} L';

/// 12 345 FCFA (arrondi à l'unité, pas de décimales)
String formatFcfa(num amount) =>
    '${formatNumber(amount.round(), maxDecimals: 0)} FCFA';

/// -6,8 ‰
String formatPerMille(num value) =>
    '${formatNumber(value, maxDecimals: 1)} ‰';
