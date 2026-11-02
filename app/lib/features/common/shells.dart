import 'package:flutter/material.dart';

import '../../ui/widgets/common.dart';
import '../loyalty/loyalty_tab.dart';
import '../public/directory_tab.dart';
import '../public/home_tab.dart';
import '../public/my_space_tab.dart';

/// Barre du bas grand public :
/// Accueil · Annuaire · Carte & trajet · Fidélité · Mon espace (§5).
class StandardShell extends StatefulWidget {
  const StandardShell({super.key});

  @override
  State<StandardShell> createState() => _StandardShellState();
}

class _StandardShellState extends State<StandardShell> {
  int _index = 0;

  static const _pages = <Widget>[
    HomeTab(),
    DirectoryTab(),
    ModuleUnavailable(title: 'Carte & trajet'),
    LoyaltyTab(),
    MySpaceTab(),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
        body: IndexedStack(index: _index, children: _pages),
        bottomNavigationBar: NavigationBar(
          selectedIndex: _index,
          onDestinationSelected: (i) => setState(() => _index = i),
          destinations: const [
            NavigationDestination(icon: Icon(Icons.home), label: 'Accueil'),
            NavigationDestination(icon: Icon(Icons.store), label: 'Annuaire'),
            NavigationDestination(icon: Icon(Icons.map), label: 'Trajet'),
            NavigationDestination(icon: Icon(Icons.card_membership), label: 'Fidélité'),
            NavigationDestination(icon: Icon(Icons.person), label: 'Mon espace'),
          ],
        ),
      );
}
