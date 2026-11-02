import 'package:flutter/material.dart';

import '../../core/services.dart';
import '../../ui/widgets/common.dart';
import '../sync/sync_screen.dart';
import 'index_calculator_screen.dart';

/// Accueil Gérant / Inspecteur / Direction : « Actions du jour » (§9, §10).
class ManagerHome extends StatelessWidget {
  const ManagerHome({super.key});

  @override
  Widget build(BuildContext context) {
    final s = Services.of(context).session;
    void open(Widget w) => Navigator.of(context).push(MaterialPageRoute(builder: (_) => w));
    void na(String t) => open(ModuleUnavailable(title: t));

    final tiles = <(IconData, String, VoidCallback)>[
      (Icons.speed, 'Index du jour', () => open(const IndexCalculatorScreen())),
      (Icons.water_drop, 'Jaugeages', () => na('Jaugeages et cuves')),
      (Icons.local_shipping, 'Réceptions', () => na('Réceptions')),
      (Icons.point_of_sale, 'Caisse du jour', () => na('Caisse du jour')),
      (Icons.people, 'Clients & bons', () => na('Clients & bons')),
      (Icons.build, 'Pannes', () => na('Pannes & maintenance')),
      (Icons.warning_amber, 'Alertes', () => na('Salle de contrôle')),
      (Icons.badge, 'RH', () => na('RH')),
      (Icons.sync, 'Synchronisation', () => open(const SyncScreen())),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(s.currentOrg?.name ?? 'Actions du jour'),
        actions: [
          if (s.orgs.length > 1)
            PopupMenuButton(
              icon: const Icon(Icons.business),
              itemBuilder: (_) => [
                for (final o in s.orgs) PopupMenuItem(value: o, child: Text(o.name)),
              ],
              onSelected: s.selectOrg,
            ),
          IconButton(icon: const Icon(Icons.logout), onPressed: s.signOut),
        ],
      ),
      body: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: MediaQuery.sizeOf(context).width > 600 ? 4 : 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        children: [
          for (final (icon, label, onTap) in tiles)
            BigActionButton(icon: icon, label: label, onPressed: onTap,
                color: Theme.of(context).colorScheme.primary),
        ],
      ),
    );
  }
}
