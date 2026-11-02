import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'features/attendant/receipt_preview.dart';
import 'features/auth/login_screen.dart';
import 'features/loyalty/loyalty_tab.dart';
import 'features/manager/index_calculator_screen.dart';
import 'ui/theme.dart';
import 'ui/widgets/common.dart';

/// Aperçu web des écrans, **sans connexion au serveur**. Les valeurs
/// affichées sont des exemples, signalés comme tels. Ne sert qu'à la
/// revue visuelle ; l'application réelle démarre par `main.dart`.
void main() => runApp(const PreviewApp());

class PreviewApp extends StatelessWidget {
  const PreviewApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
        title: 'Aperçu C-GESCAR',
        debugShowCheckedModeBanner: false,
        theme: buildTheme(Brightness.light),
        darkTheme: buildTheme(Brightness.dark),
        locale: const Locale('fr'),
        supportedLocales: const [Locale('fr'), Locale('en')],
        localizationsDelegates: GlobalMaterialLocalizations.delegates,
        builder: (context, child) => Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: Banner(
              message: 'APERÇU',
              location: BannerLocation.topEnd,
              child: child!,
            ),
          ),
        ),
        home: const _PreviewMenu(),
      );
}

class _PreviewMenu extends StatelessWidget {
  const _PreviewMenu();

  static final _exampleReceipt = <String, dynamic>{
    'company_name': 'Compagnie exemple',
    'station_name': 'Station exemple',
    'station_address': 'Adresse exemple',
    'station_phone': '00 00 00 00 00',
    'receipt_number': 'EXEMPLE-0001',
    'created_at': DateTime.now().toIso8601String(),
    'customer_name': 'Client exemple',
    'vehicle': 'AA-0000-XX',
    'product_name': 'SUPER',
    'litres': 10,
    'unit_price': 875,
    'amount': 8750,
    'points': 10,
    'attendant_name': 'Pompiste exemple',
    'attendant_phone': '00 00 00 00 00',
    'attendant_signature_url': 'x',
  };

  @override
  Widget build(BuildContext context) {
    void open(Widget w) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => w));
    final items = <(IconData, String, String, Widget)>[
      (Icons.login, 'Connexion', 'Mot de passe ou PIN chauffeur', const LoginScreen()),
      (Icons.speed, 'Index du jour', 'Calcul provisoire en direct (annexe C)', const IndexCalculatorScreen()),
      (Icons.card_membership, 'Carte fidélité', 'Carte Argent à 0 point', const _CardPreview()),
      (Icons.receipt_long, 'Reçu pompiste', 'Ticket 80 / 58 mm (valeurs d\'exemple)',
          ReceiptPreviewScreen(receipt: _exampleReceipt, kind: ReceiptKind.loyalty)),
      (Icons.construction, 'Module non livré', 'Panneau affiché à la place des données', const ModuleUnavailable(title: 'Caisse du jour')),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('C-GESCAR · Aperçu')),
      body: ListView(padding: const EdgeInsets.all(12), children: [
        const Padding(
          padding: EdgeInsets.all(8),
          child: Text('Aperçu des écrans sans serveur : aucune donnée réelle, rien n\'est enregistré.'),
        ),
        for (final (icon, title, sub, w) in items)
          Card(
            child: ListTile(
              leading: Icon(icon, color: Theme.of(context).colorScheme.secondary),
              title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
              subtitle: Text(sub),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => open(w),
            ),
          ),
      ]),
    );
  }
}

class _CardPreview extends StatelessWidget {
  const _CardPreview();

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('Fidélité')),
        body: ListView(padding: const EdgeInsets.all(16), children: [
          const LoyaltyCardView(companyName: 'C-GESCAR', points: 0, tier: 'silver'),
          const SizedBox(height: 12),
          const Text(
            'Bienvenue ! Votre carte Argent est active avec 0 point. Faites scanner votre QR lors de votre plein : 1 litre = 1 point, carte Or puis Diamant ensuite.',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          FilledButton.icon(onPressed: null, icon: const Icon(Icons.qr_code_2), label: const Text('Prendre carburant')),
        ]),
      );
}
