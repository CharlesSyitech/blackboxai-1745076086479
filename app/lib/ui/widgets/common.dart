import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';

/// Panneau « Module non disponible » : jamais de données simulées (P8).
class ModuleUnavailable extends StatelessWidget {
  final String title;
  const ModuleUnavailable({super.key, required this.title});

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: Text(title)),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Icon(Icons.construction, size: 64, color: Theme.of(context).colorScheme.outline),
              const SizedBox(height: 16),
              Text('Module non disponible',
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              const Text('Ce module sera livré dans une prochaine version.',
                  textAlign: TextAlign.center),
            ]),
          ),
        ),
      );
}

/// Pastille couleur produit (toujours à côté du nom, §2).
class ProductDot extends StatelessWidget {
  final String name;
  final String? organisationColor;
  final double size;
  const ProductDot({super.key, required this.name, this.organisationColor, this.size = 14});

  @override
  Widget build(BuildContext context) {
    final argb = productColor(name: name, organisationColor: organisationColor);
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: argb == null ? Colors.transparent : Color(argb),
        border: Border.all(color: Theme.of(context).colorScheme.outline),
      ),
    );
  }
}

/// Libellé « Provisoire » tant que la journée n'est pas validée (P5).
class ProvisionalBadge extends StatelessWidget {
  const ProvisionalBadge({super.key});

  @override
  Widget build(BuildContext context) => Chip(
        label: const Text('Provisoire'),
        avatar: const Icon(Icons.hourglass_top, size: 16),
        backgroundColor: Theme.of(context).colorScheme.tertiaryContainer,
      );
}

/// Dialogue d'annulation avec motif obligatoire ≥ 5 caractères (P4).
Future<String?> askCancelReason(BuildContext context) {
  final ctrl = TextEditingController();
  final formKey = GlobalKey<FormState>();
  return showDialog<String>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: const Text('Annuler l\'opération'),
      content: Form(
        key: formKey,
        child: TextFormField(
          controller: ctrl,
          autofocus: true,
          maxLines: 3,
          decoration: const InputDecoration(labelText: 'Motif (obligatoire)'),
          validator: validateCancelReason,
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Retour')),
        FilledButton(
          onPressed: () {
            if (formKey.currentState!.validate()) Navigator.pop(ctx, ctrl.text.trim());
          },
          child: const Text('Annuler l\'opération'),
        ),
      ],
    ),
  );
}

/// Grand bouton pictogramme pour écrans terrain (P13).
class BigActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onPressed;
  final Color? color;
  const BigActionButton({super.key, required this.icon, required this.label, this.onPressed, this.color});

  @override
  Widget build(BuildContext context) {
    final c = color ?? Theme.of(context).colorScheme.secondary;
    return Material(
      color: c,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onPressed,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Icon(icon, size: 44, color: Colors.white),
            const SizedBox(height: 8),
            Text(label,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700)),
          ]),
        ),
      ),
    );
  }
}

void showError(BuildContext context, Object e) {
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
}
