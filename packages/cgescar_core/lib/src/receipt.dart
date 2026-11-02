/// Reçu imprimé du pompiste (section 8.4) : ticket 80 mm (48 colonnes)
/// compatible 58 mm (32 colonnes), noir et blanc.
///
/// Ce module produit un **modèle de lignes** indépendant de l'imprimante ;
/// l'app le traduit en ESC/POS (Bluetooth, SDK Sunmi/PAX) ou en PDF.
library;

import 'formatters.dart';

enum PaperWidth {
  mm58(32),
  mm80(48);

  final int columns;
  const PaperWidth(this.columns);
}

enum ReceiptKind { voucher, loyalty }

enum LineStyle { normal, bold, big, center, centerBold, separator }

class ReceiptLine {
  final String text;
  final LineStyle style;
  const ReceiptLine(this.text, [this.style = LineStyle.normal]);
}

class ReceiptData {
  final ReceiptKind kind;
  final String companyName;
  final String stationName;
  final String? stationAddress;
  final String? stationPhone;
  final String receiptNumber;
  final DateTime dateTime;
  final String? customerName;
  final String? vehicle;
  final String productName;
  final double litres;
  final double unitPrice;
  final double amount;
  final int? points;
  final String attendantName;
  final String attendantPhone;
  final bool hasDriverSignature;
  final bool hasAttendantSignature;
  final bool cancelled;

  const ReceiptData({
    required this.kind,
    required this.companyName,
    required this.stationName,
    required this.receiptNumber,
    required this.dateTime,
    required this.productName,
    required this.litres,
    required this.unitPrice,
    required this.amount,
    required this.attendantName,
    required this.attendantPhone,
    this.stationAddress,
    this.stationPhone,
    this.customerName,
    this.vehicle,
    this.points,
    this.hasDriverSignature = false,
    this.hasAttendantSignature = false,
    this.cancelled = false,
  });
}

String _kv(String k, String v, int cols) {
  final space = cols - k.length - v.length;
  if (space >= 1) return '$k${' ' * space}$v';
  return '$k\n${v.padLeft(cols)}';
}

/// Construit les lignes du ticket. Le nom ET le téléphone du pompiste
/// sont toujours présents (exigence 8.4).
List<ReceiptLine> buildReceipt(ReceiptData d, PaperWidth width) {
  final c = width.columns;
  final sep = ReceiptLine('-' * c, LineStyle.separator);
  final lines = <ReceiptLine>[
    // Le logo est imprimé en image juste avant ces lignes.
    ReceiptLine(d.companyName.toUpperCase(), LineStyle.centerBold),
    ReceiptLine(d.stationName, LineStyle.center),
    if (d.stationAddress != null) ReceiptLine(d.stationAddress!, LineStyle.center),
    if (d.stationPhone != null) ReceiptLine('Tél : ${d.stationPhone}', LineStyle.center),
    sep,
    if (d.cancelled) const ReceiptLine('*** ANNULÉ ***', LineStyle.big),
    ReceiptLine(
        d.kind == ReceiptKind.voucher ? 'BON CARBURANT' : 'FIDÉLITÉ',
        LineStyle.centerBold),
    ReceiptLine(_kv('Reçu n°', d.receiptNumber, c)),
    ReceiptLine(_kv('Date', formatDateTime(d.dateTime), c)),
    if (d.customerName != null) ReceiptLine(_kv('Client', d.customerName!, c)),
    if (d.vehicle != null) ReceiptLine(_kv('Véhicule', d.vehicle!, c)),
    sep,
    ReceiptLine(_kv('Produit', d.productName, c)),
    ReceiptLine(_kv('Litres', formatLitres(d.litres), c)),
    ReceiptLine(_kv('Prix unitaire', formatFcfa(d.unitPrice), c)),
    sep,
    ReceiptLine(formatFcfa(d.amount), LineStyle.big),
    if (d.points != null) ReceiptLine(_kv('Points', '+${d.points}', c), LineStyle.bold),
    sep,
    ReceiptLine(_kv('Pompiste', d.attendantName, c)),
    ReceiptLine(_kv('Tél. pompiste', d.attendantPhone, c)),
    if (d.kind == ReceiptKind.voucher)
      ReceiptLine(_kv('Signature chauffeur', d.hasDriverSignature ? 'OUI' : 'NON', c)),
    ReceiptLine(_kv('Signature pompiste', d.hasAttendantSignature ? 'OUI' : 'NON', c)),
    if (d.cancelled) const ReceiptLine('*** ANNULÉ ***', LineStyle.big),
    sep,
    const ReceiptLine('Merci de votre visite', LineStyle.center),
    const ReceiptLine('C-GESCAR', LineStyle.center),
  ];
  return lines;
}

/// Rendu texte brut (aperçu, tests, imprimantes sans mise en forme).
String renderReceiptText(List<ReceiptLine> lines, PaperWidth width) {
  final c = width.columns;
  String center(String t) {
    if (t.length >= c) return t;
    final left = (c - t.length) ~/ 2;
    return '${' ' * left}$t';
  }

  return lines.map((l) {
    return switch (l.style) {
      LineStyle.center || LineStyle.centerBold || LineStyle.big => center(l.text),
      _ => l.text,
    };
  }).join('\n');
}
