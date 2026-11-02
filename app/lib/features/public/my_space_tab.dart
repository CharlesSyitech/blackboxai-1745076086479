import 'package:flutter/material.dart';

import '../../core/services.dart';

/// Mon espace (§5.7).
class MySpaceTab extends StatelessWidget {
  const MySpaceTab({super.key});

  @override
  Widget build(BuildContext context) {
    final s = Services.of(context).session;
    final user = s.client.auth.currentUser;
    return Scaffold(
      appBar: AppBar(title: const Text('Mon espace')),
      body: ListView(children: [
        ListTile(
          leading: const CircleAvatar(child: Icon(Icons.person)),
          title: Text(user?.email ?? user?.phone ?? '—'),
        ),
        const Divider(),
        const ListTile(leading: Icon(Icons.directions_car), title: Text('Mes véhicules')),
        const ListTile(leading: Icon(Icons.language), title: Text('Langue'), trailing: Text('Français')),
        const ListTile(leading: Icon(Icons.currency_exchange), title: Text('Devise'), trailing: Text('XOF')),
        const ListTile(leading: Icon(Icons.business), title: Text('Passer en organisation')),
        const Divider(),
        ListTile(
          leading: const Icon(Icons.logout),
          title: const Text('Se déconnecter'),
          onTap: s.signOut,
        ),
      ]),
    );
  }
}
