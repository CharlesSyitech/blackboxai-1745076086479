import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Nettoie à la frappe et au collage (P11).
class _NumberInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    final cleaned = sanitizeNumberTyping(newValue.text);
    if (cleaned == newValue.text) return newValue;
    return TextEditingValue(
      text: cleaned,
      selection: TextSelection.collapsed(offset: cleaned.length),
    );
  }
}

/// Champ numérique tolérant (« 12 345,6 » = 12345.6).
class NumberField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String? suffix;
  final bool required;
  final ValueChanged<double?>? onChanged;

  const NumberField({
    super.key,
    required this.controller,
    required this.label,
    this.suffix,
    this.required = false,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) => TextFormField(
        controller: controller,
        keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
        inputFormatters: [_NumberInputFormatter()],
        decoration: InputDecoration(labelText: label, suffixText: suffix),
        onChanged: onChanged == null ? null : (v) => onChanged!(parseNumberInput(v)),
        validator: (v) {
          if ((v ?? '').trim().isEmpty) return required ? 'Obligatoire' : null;
          return parseNumberInput(v) == null ? 'Nombre invalide' : null;
        },
      );
}
