import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';

import '../../ui/widgets/common.dart';
import '../../ui/widgets/number_field.dart';

/// Index du jour — calcul provisoire en direct (§9.1, annexe C). Le
/// serveur recalcule à la validation (`close_shift`,
/// `apply_shift_validation`).
class IndexCalculatorScreen extends StatefulWidget {
  const IndexCalculatorScreen({super.key});

  @override
  State<IndexCalculatorScreen> createState() => _IndexCalculatorScreenState();
}

class _IndexCalculatorScreenState extends State<IndexCalculatorScreen> {
  final _io = TextEditingController();
  final _if = TextEditingController();
  final _oldEnd = TextEditingController();
  final _newStart = TextEditingController();
  final _rc = TextEditingController();
  final _price = TextEditingController();
  final _elec = TextEditingController();
  bool _meterChange = false;
  RevenueBasis _basis = RevenueBasis.mechanical;

  double? _n(TextEditingController c) => parseNumberInput(c.text);

  @override
  Widget build(BuildContext context) {
    final io = _n(_io), ifv = _n(_if);
    double? output;
    if (io != null && ifv != null) {
      if (_meterChange) {
        final oe = _n(_oldEnd), ns = _n(_newStart);
        if (oe != null && ns != null) {
          output = meterOutput(segmentsWithMeterChange(
              opening: io, oldMeterEnd: oe, newMeterStart: ns, closing: ifv));
        }
      } else {
        output = meterOutput([MeterSegment(opening: io, closing: ifv)]);
      }
    }
    final sold = output == null ? null : quantitySold(output: output, returnedToTank: _n(_rc) ?? 0);
    final elec = _n(_elec);
    final price = _n(_price);
    final ca = (sold == null || price == null)
        ? null
        : revenue(
            basis: _basis,
            mechanicalQuantity: sold,
            electronicQuantity: elec ?? sold,
            unitPrice: price);
    final gap = (sold == null || elec == null) ? null : electronicGap(electronicIndex: elec, soldAtPumps: sold);

    void upd(_) => setState(() {});
    Widget res(String l, String? v) => ListTile(
        dense: true, title: Text(l), trailing: Text(v ?? '—', style: Theme.of(context).textTheme.titleMedium));

    return Scaffold(
      appBar: AppBar(title: const Text('Index du jour')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        const Align(alignment: Alignment.centerLeft, child: ProvisionalBadge()),
        const SizedBox(height: 12),
        NumberField(controller: _io, label: 'Index ouverture (IO)', onChanged: upd),
        const SizedBox(height: 8),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('Changement de compteur'),
          value: _meterChange,
          onChanged: (v) => setState(() => _meterChange = v),
        ),
        if (_meterChange) ...[
          NumberField(controller: _oldEnd, label: 'Ancien index de fin', onChanged: upd),
          const SizedBox(height: 8),
          NumberField(controller: _newStart, label: 'Nouvel index de départ', onChanged: upd),
          const SizedBox(height: 8),
        ],
        NumberField(controller: _if, label: 'Index fermeture (IF)', onChanged: upd),
        const SizedBox(height: 8),
        NumberField(controller: _rc, label: 'Retour en cuve (RC / CP)', suffix: 'L', onChanged: upd),
        const SizedBox(height: 8),
        NumberField(controller: _price, label: 'Prix appliqué', suffix: 'FCFA/L', onChanged: upd),
        const SizedBox(height: 8),
        NumberField(controller: _elec, label: 'Index électronique (quantité)', suffix: 'L', onChanged: upd),
        const SizedBox(height: 8),
        SegmentedButton<RevenueBasis>(
          segments: const [
            ButtonSegment(value: RevenueBasis.mechanical, label: Text('Base mécanique')),
            ButtonSegment(value: RevenueBasis.electronic, label: Text('Base électronique')),
          ],
          selected: {_basis},
          onSelectionChanged: (s) => setState(() => _basis = s.first),
        ),
        const Divider(height: 32),
        res('Sortie', output == null ? null : formatLitres(output)),
        res('Quantité vendue', sold == null ? null : formatLitres(sold)),
        res('Écart électronique', gap == null ? null : formatLitres(gap)),
        res('Chiffre d\'affaires', ca == null ? null : formatFcfa(ca)),
      ]),
    );
  }
}
