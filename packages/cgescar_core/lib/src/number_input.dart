/// Saisie des nombres (principe P11).
///
/// Accepte les collages du type « 12 345,6 », « 12 345.6 » (espace
/// insécable), « 12'345.6 », « 1,234,567.89 » ou « 1.234.567,89 ».
library;

/// Caractères considérés comme séparateurs de milliers « visuels ».
final RegExp _spaces = RegExp("[\\s   '’`]");

/// Nettoie une saisie et renvoie la valeur numérique, ou `null` si la
/// saisie n'est pas un nombre.
///
/// Règles :
/// * espaces (y compris insécables / fines) et apostrophes = milliers ;
/// * s'il y a à la fois `.` et `,`, le **dernier** des deux est le
///   séparateur décimal, l'autre est un séparateur de milliers ;
/// * un seul type de séparateur présent plusieurs fois = milliers
///   (« 1.234.567 » = 1234567) ;
/// * un seul séparateur présent une fois = décimal (« 12,5 » = 12.5).
double? parseNumberInput(String? raw) {
  if (raw == null) return null;
  var s = raw.trim().replaceAll(_spaces, '');
  if (s.isEmpty) return null;

  var negative = false;
  if (s.startsWith('-') || s.startsWith('−')) {
    negative = true;
    s = s.substring(1);
  } else if (s.startsWith('+')) {
    s = s.substring(1);
  }
  if (s.isEmpty) return null;

  final lastDot = s.lastIndexOf('.');
  final lastComma = s.lastIndexOf(',');
  String normalized;
  if (lastDot >= 0 && lastComma >= 0) {
    final decimalSep = lastDot > lastComma ? '.' : ',';
    final thousandSep = decimalSep == '.' ? ',' : '.';
    normalized = s.replaceAll(thousandSep, '').replaceAll(decimalSep, '.');
  } else if (lastDot >= 0 || lastComma >= 0) {
    final sep = lastDot >= 0 ? '.' : ',';
    final count = sep.allMatches(s).length;
    normalized = count > 1 ? s.replaceAll(sep, '') : s.replaceAll(sep, '.');
  } else {
    normalized = s;
  }

  if (!RegExp(r'^\d*\.?\d*$').hasMatch(normalized) || normalized == '.') {
    return null;
  }
  final value = double.tryParse(normalized);
  if (value == null) return null;
  return negative ? -value : value;
}

/// Nettoyage « à la frappe » : retire ce qui n'est ni chiffre, ni
/// séparateur, ni signe moins, sans interpréter la valeur.
String sanitizeNumberTyping(String raw) {
  final buffer = StringBuffer();
  for (final rune in raw.runes) {
    final c = String.fromCharCode(rune);
    if (RegExp(r'[0-9.,\-]').hasMatch(c)) {
      buffer.write(c);
    } else if (_spaces.hasMatch(c)) {
      buffer.write(' ');
    }
  }
  return buffer.toString();
}
