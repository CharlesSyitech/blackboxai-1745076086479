import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Aperçu du reçu 80 / 58 mm (§8.4). L'impression ESC/POS Bluetooth ou via
/// le SDK du terminal (Sunmi, PAX…) se branche sur [buildReceipt].
class ReceiptPreviewScreen extends StatefulWidget {
  final Map<String, dynamic> receipt;
  final ReceiptKind kind;
  const ReceiptPreviewScreen({super.key, required this.receipt, required this.kind});

  @override
  State<ReceiptPreviewScreen> createState() => _ReceiptPreviewScreenState();
}

class _ReceiptPreviewScreenState extends State<ReceiptPreviewScreen> {
  static const _widthKey = 'receipt.paper_width';
  PaperWidth _width = PaperWidth.mm80;

  @override
  void initState() {
    super.initState();
    SharedPreferences.getInstance().then((p) {
      final w = p.getString(_widthKey);
      if (w != null && mounted) setState(() => _width = PaperWidth.values.byName(w));
    });
  }

  ReceiptData _data() {
    final r = widget.receipt;
    double n(String k) => (r[k] as num?)?.toDouble() ?? 0;
    return ReceiptData(
      kind: widget.kind,
      companyName: '${r['company_name'] ?? ''}',
      stationName: '${r['station_name'] ?? ''}',
      stationAddress: r['station_address'] as String?,
      stationPhone: r['station_phone'] as String?,
      receiptNumber: '${r['receipt_number'] ?? r['id'] ?? ''}',
      dateTime: DateTime.tryParse('${r['created_at']}')?.toLocal() ?? DateTime.now(),
      customerName: r['customer_name'] as String?,
      vehicle: r['vehicle'] as String?,
      productName: '${r['product_name'] ?? ''}',
      litres: n('litres'),
      unitPrice: n('unit_price'),
      amount: n('amount'),
      points: (r['points'] as num?)?.toInt(),
      attendantName: '${r['attendant_name'] ?? ''}',
      attendantPhone: '${r['attendant_phone'] ?? ''}',
      hasDriverSignature: r['driver_signature_url'] != null,
      hasAttendantSignature: r['attendant_signature_url'] != null,
      cancelled: r['cancelled_at'] != null,
    );
  }

  @override
  Widget build(BuildContext context) {
    final text = renderReceiptText(buildReceipt(_data(), _width), _width);
    return Scaffold(
      appBar: AppBar(title: const Text('Reçu')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        SegmentedButton<PaperWidth>(
          segments: const [
            ButtonSegment(value: PaperWidth.mm80, label: Text('80 mm')),
            ButtonSegment(value: PaperWidth.mm58, label: Text('58 mm')),
          ],
          selected: {_width},
          onSelectionChanged: (s) async {
            setState(() => _width = s.first);
            (await SharedPreferences.getInstance()).setString(_widthKey, s.first.name);
          },
        ),
        const SizedBox(height: 16),
        Container(
          color: Colors.white,
          padding: const EdgeInsets.all(12),
          child: Text(text,
              style: const TextStyle(fontFamily: 'monospace', color: Colors.black, fontSize: 12, height: 1.3)),
        ),
        const SizedBox(height: 16),
        FilledButton.icon(
          onPressed: () => ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
              content: Text('Impression : sélectionnez l\'imprimante Bluetooth dans les réglages.'))),
          icon: const Icon(Icons.print),
          label: const Text('Imprimer'),
        ),
        const SizedBox(height: 8),
        OutlinedButton(onPressed: () => Navigator.pop(context), child: const Text('Terminer')),
      ]),
    );
  }
}
