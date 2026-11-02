import 'dart:convert';

import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:signature/signature.dart';

import '../../core/services.dart';
import '../../ui/widgets/common.dart';
import '../../ui/widgets/number_field.dart';
import 'receipt_preview.dart';

/// Poste pompiste (§8). Seuls ce poste et l'assistant sont accessibles.
/// Toutes les prises exigent le réseau (contrôle serveur à usage unique).
class AttendantPostScreen extends StatefulWidget {
  const AttendantPostScreen({super.key});

  @override
  State<AttendantPostScreen> createState() => _AttendantPostScreenState();
}

class _AttendantPostScreenState extends State<AttendantPostScreen> {
  final _code = TextEditingController();
  bool _busy = false;

  String? get _station {
    final ids = Services.of(context).session.currentOrg?.stationIds;
    return ids == null || ids.isEmpty ? null : ids.first;
  }

  Future<void> _open(String raw) async {
    final code = normalizePassCode(raw);
    final kind = detectPassKind(code);
    final station = _station;
    if (kind == null) return showError(context, 'Code non reconnu (CGF-… ou CGB-…).');
    if (station == null) return showError(context, 'Aucune station rattachée à votre compte.');
    final api = Services.of(context).api;
    setState(() => _busy = true);
    try {
      final data = kind == PassKind.loyalty
          ? await api.attendantLoyaltyOpen(station, code)
          : await api.attendantVoucherOpen(station, code);
      if (!mounted) return;
      _code.clear();
      await Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => _ServeScreen(kind: kind, code: code, station: station, opened: data),
      ));
    } catch (e) {
      if (mounted) showError(context, e);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _scan() async {
    final value = await Navigator.of(context).push<String>(MaterialPageRoute(
      builder: (ctx) => Scaffold(
        appBar: AppBar(title: const Text('Scanner le QR')),
        body: MobileScanner(
          onDetect: (capture) {
            final v = capture.barcodes.firstOrNull?.rawValue;
            if (v != null) Navigator.of(ctx).pop(v);
          },
        ),
      ),
    ));
    if (value != null) await _open(value);
  }

  @override
  Widget build(BuildContext context) {
    final session = Services.of(context).session;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Poste pompiste'),
        actions: [
          IconButton(
            tooltip: 'Reçus du jour',
            icon: const Icon(Icons.receipt_long),
            onPressed: () => ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Reçus du jour : liste à brancher sur les prises de la station.'))),
          ),
          IconButton(icon: const Icon(Icons.logout), onPressed: session.signOut),
        ],
      ),
      body: ListView(padding: const EdgeInsets.all(20), children: [
        BigActionButton(icon: Icons.qr_code_scanner, label: 'Scanner le QR', onPressed: _busy ? null : _scan),
        const SizedBox(height: 24),
        TextField(
          controller: _code,
          textCapitalization: TextCapitalization.characters,
          style: const TextStyle(fontSize: 22, letterSpacing: 2),
          decoration: const InputDecoration(labelText: 'Ou saisir le code (CGF-… / CGB-…)'),
          onSubmitted: _open,
        ),
        const SizedBox(height: 12),
        FilledButton(
          onPressed: _busy ? null : () => _open(_code.text),
          child: _busy ? const CircularProgressIndicator() : const Text('Ouvrir'),
        ),
      ]),
    );
  }
}

class _ServeScreen extends StatefulWidget {
  final PassKind kind;
  final String code;
  final String station;
  final Map<String, dynamic> opened;
  const _ServeScreen({required this.kind, required this.code, required this.station, required this.opened});

  @override
  State<_ServeScreen> createState() => _ServeScreenState();
}

class _ServeScreenState extends State<_ServeScreen> {
  final _form = GlobalKey<FormState>();
  final _value = TextEditingController();
  final _plate = TextEditingController();
  final _driverSig = SignatureController(penStrokeWidth: 3);
  final _attendantSig = SignatureController(penStrokeWidth: 3);
  bool _byAmount = true; // saisie par défaut en montant FCFA
  String? _productId;
  String? _nozzleId;
  bool _busy = false;

  bool get _isVoucher => widget.kind == PassKind.voucher;

  List<Map<String, dynamic>> _list(String key) =>
      List<Map<String, dynamic>>.from((widget.opened[key] as List?) ?? const []);

  Map<String, dynamic>? get _product =>
      _list('products').where((p) => '${p['id']}' == _productId).firstOrNull;

  double? get _unitPrice => (_product?['price'] as num?)?.toDouble();

  @override
  void dispose() {
    _driverSig.dispose();
    _attendantSig.dispose();
    super.dispose();
  }

  Future<String?> _png(SignatureController c) async {
    if (c.isEmpty) return null;
    final bytes = await c.toPngBytes();
    return bytes == null ? null : base64Encode(bytes);
  }

  Future<void> _submit() async {
    if (!_form.currentState!.validate()) return;
    if (_productId == null) return showError(context, 'Choisissez le produit.');
    final api = Services.of(context).api;
    final driverPng = _isVoucher ? await _png(_driverSig) : null;
    final attendantPng = await _png(_attendantSig);
    if (_isVoucher && driverPng == null) {
      if (mounted) showError(context, 'Signature du chauffeur obligatoire.');
      return;
    }
    if (attendantPng == null) {
      if (mounted) showError(context, 'Signature du pompiste obligatoire.');
      return;
    }
    final value = parseNumberInput(_value.text)!;
    setState(() => _busy = true);
    try {
      final params = <String, dynamic>{
        '_station': widget.station,
        '_code': widget.code,
        '_product_id': _productId,
        '_nozzle_id': _nozzleId,
        if (_byAmount) '_amount': value else '_litres': value,
        if (_plate.text.trim().isNotEmpty) '_plate': _plate.text.trim(),
        '_attendant_signature': attendantPng,
        if (_isVoucher) '_driver_signature': driverPng,
      };
      final res = _isVoucher
          ? await api.attendantVoucherTake(params)
          : await api.attendantLoyaltyTake(params);
      final takeId = '${res['take_id'] ?? res['id']}';
      final receipt = await api.attendantTakeReceipt(
          widget.station, takeId, _isVoucher ? 'voucher' : 'loyalty');
      if (!mounted) return;
      await Navigator.of(context).pushReplacement(MaterialPageRoute(
        builder: (_) => ReceiptPreviewScreen(receipt: receipt, kind: _isVoucher ? ReceiptKind.voucher : ReceiptKind.loyalty),
      ));
    } catch (e) {
      if (mounted) showError(context, e);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Widget _sigPad(String label, SignatureController c) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Text(label, style: const TextStyle(fontWeight: FontWeight.w700)),
            const Spacer(),
            TextButton(onPressed: c.clear, child: const Text('Effacer')),
          ]),
          Container(
            height: 140,
            decoration: BoxDecoration(border: Border.all(color: Theme.of(context).colorScheme.outline)),
            child: Signature(controller: c, backgroundColor: Colors.white),
          ),
        ],
      );

  @override
  Widget build(BuildContext context) {
    final o = widget.opened;
    final price = _unitPrice;
    final v = parseNumberInput(_value.text);
    final preview = (v == null || price == null || price <= 0)
        ? null
        : _byAmount
            ? '≈ ${formatLitres(roundTo(v / price, 2))}'
            : '≈ ${formatFcfa(v * price)}';
    return Scaffold(
      appBar: AppBar(title: Text(_isVoucher ? 'Bon client' : 'Client fidélité')),
      body: Form(
        key: _form,
        child: ListView(padding: const EdgeInsets.all(16), children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.person, size: 40),
              title: Text('${o['customer_name'] ?? o['client_name'] ?? '—'}',
                  style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text(_isVoucher
                  ? 'Chauffeur : ${o['driver_name'] ?? '—'} · Engin : ${o['vehicle'] ?? '—'}\nSolde : ${o['balance'] == null ? '—' : formatFcfa(o['balance'] as num)}'
                  : '${o['company_name'] ?? ''} · Carte ${o['tier'] ?? 'Argent'} · ${o['points'] ?? 0} pts'),
              isThreeLine: _isVoucher,
            ),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _productId,
            decoration: const InputDecoration(labelText: 'Produit (obligatoire)'),
            items: [
              for (final p in _list('products'))
                DropdownMenuItem(
                  value: '${p['id']}',
                  child: Row(children: [
                    ProductDot(name: '${p['name']}', organisationColor: p['color'] as String?),
                    const SizedBox(width: 8),
                    Text('${p['name']}'),
                  ]),
                ),
            ],
            validator: (v) => v == null ? 'Obligatoire' : null,
            onChanged: (v) => setState(() => _productId = v),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _nozzleId,
            decoration: const InputDecoration(labelText: 'Pompe (facultative)'),
            items: [
              const DropdownMenuItem(value: null, child: Text('—')),
              for (final n in _list('nozzles'))
                DropdownMenuItem(value: '${n['id']}', child: Text('${n['name']}')),
            ],
            onChanged: (v) => setState(() => _nozzleId = v),
          ),
          const SizedBox(height: 12),
          SegmentedButton<bool>(
            segments: const [
              ButtonSegment(value: true, label: Text('Montant FCFA')),
              ButtonSegment(value: false, label: Text('Litres')),
            ],
            selected: {_byAmount},
            onSelectionChanged: (s) => setState(() => _byAmount = s.first),
          ),
          const SizedBox(height: 12),
          NumberField(
            controller: _value,
            label: _byAmount ? 'Montant' : 'Quantité',
            suffix: _byAmount ? 'FCFA' : 'L',
            required: true,
            onChanged: (_) => setState(() {}),
          ),
          if (preview != null) Padding(padding: const EdgeInsets.only(top: 6), child: Text(preview)),
          const SizedBox(height: 12),
          TextField(controller: _plate, decoration: const InputDecoration(labelText: 'Immatriculation (facultative)')),
          const SizedBox(height: 16),
          if (_isVoucher) ...[_sigPad('Signature du chauffeur', _driverSig), const SizedBox(height: 12)],
          _sigPad('Signature du pompiste', _attendantSig),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _busy ? null : _submit,
            child: _busy ? const CircularProgressIndicator() : const Text('Valider la prise'),
          ),
        ]),
      ),
    );
  }
}
