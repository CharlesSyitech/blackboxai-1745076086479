import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';

import '../../core/services.dart';

/// Écran « Synchronisation » : en attente / envoyé / conflit / erreur (§12).
class SyncScreen extends StatelessWidget {
  const SyncScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final services = Services.of(context);
    final q = services.queue;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Synchronisation'),
        actions: [
          IconButton(
            tooltip: 'Envoyer maintenant',
            icon: const Icon(Icons.cloud_upload),
            onPressed: () => q.flush(services.api.sendQueued),
          ),
          IconButton(tooltip: 'Purger les envoyés', icon: const Icon(Icons.cleaning_services), onPressed: q.clearSent),
        ],
      ),
      body: StreamBuilder<void>(
        stream: q.changes,
        builder: (context, _) => FutureBuilder(
          future: q.all(),
          builder: (context, snap) {
            final ops = snap.data ?? const <QueuedOp>[];
            if (ops.isEmpty) return const Center(child: Text('Rien en attente'));
            return ListView(children: [
              for (final op in ops)
                ListTile(
                  leading: Icon(switch (op.status) {
                    OpStatus.pending || OpStatus.sending => Icons.schedule,
                    OpStatus.sent => Icons.check_circle,
                    OpStatus.conflict => Icons.call_split,
                    OpStatus.error => Icons.error,
                  }),
                  title: Text(op.type.name),
                  subtitle: Text([
                    formatDateTime(op.createdAt.toLocal()),
                    switch (op.status) {
                      OpStatus.pending => 'En attente',
                      OpStatus.sending => 'Envoi…',
                      OpStatus.sent => 'Envoyé',
                      OpStatus.conflict => 'Conflit : la donnée a été modifiée ailleurs',
                      OpStatus.error => 'Erreur : ${op.lastError ?? ''}',
                    },
                  ].join(' · ')),
                  trailing: switch (op.status) {
                    OpStatus.error => TextButton(onPressed: () => q.retry(op.clientOpId), child: const Text('Réessayer')),
                    OpStatus.conflict => TextButton(
                        // Ne jamais écraser (P7) : abandonner sa version
                        // est le seul choix sans relire les données.
                        onPressed: () => q.resolveByDiscarding(op.clientOpId),
                        child: const Text('Garder la version serveur')),
                    _ => null,
                  },
                ),
            ]);
          },
        ),
      ),
    );
  }
}
