import 'package:cgescar_mobile/ui/theme.dart';
import 'package:cgescar_mobile/ui/widgets/common.dart';
import 'package:cgescar_mobile/ui/widgets/number_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

Widget _wrap(Widget w) => MaterialApp(theme: buildTheme(Brightness.light), home: Scaffold(body: w));

void main() {
  testWidgets('NumberField accepte « 12 345,6 » et nettoie les lettres', (t) async {
    final c = TextEditingController();
    double? last;
    await t.pumpWidget(_wrap(NumberField(controller: c, label: 'Qté', onChanged: (v) => last = v)));
    await t.enterText(find.byType(TextFormField), '12 345,6 L');
    expect(c.text, '12 345,6 ');
    expect(last, 12345.6);
  });

  testWidgets('Motif d\'annulation < 5 caractères refusé', (t) async {
    String? result = 'unset';
    await t.pumpWidget(_wrap(Builder(
      builder: (ctx) => TextButton(
        onPressed: () async => result = await askCancelReason(ctx),
        child: const Text('go'),
      ),
    )));
    await t.tap(find.text('go'));
    await t.pumpAndSettle();
    await t.enterText(find.byType(TextFormField), 'abc');
    await t.tap(find.widgetWithText(FilledButton, 'Annuler l\'opération'));
    await t.pumpAndSettle();
    expect(find.textContaining('au moins 5'), findsOneWidget);
    await t.enterText(find.byType(TextFormField), 'Erreur de saisie');
    await t.tap(find.widgetWithText(FilledButton, 'Annuler l\'opération'));
    await t.pumpAndSettle();
    expect(result, 'Erreur de saisie');
  });

  testWidgets('Module non disponible : aucun chiffre simulé', (t) async {
    await t.pumpWidget(const MaterialApp(home: ModuleUnavailable(title: 'Caisse')));
    expect(find.text('Module non disponible'), findsOneWidget);
  });
}
