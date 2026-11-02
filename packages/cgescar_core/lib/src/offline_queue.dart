/// File locale des opérations hors ligne (principes P6, P7, section 12).
///
/// Entrée : `{client_op_id, type, payload, created_at, tries, status}`.
/// Envoi FIFO au retour réseau ; un renvoi de la même opération ne crée
/// jamais de doublon car le serveur déduplique sur `client_op_id`.
library;

import 'dart:async';

import 'client_op_id.dart';

enum OpStatus { pending, sending, sent, conflict, error }

/// Types d'opérations autorisés hors ligne. Les QR, prises pompiste et
/// paiements **exigent le réseau** et ne sont jamais mis en file.
enum OfflineOpType {
  shiftReading,
  gaugeReading,
  delivery,
  cashEntry,
  expense,
  incident,
}

/// Opérations qui exigent un contrôle serveur à usage unique.
const Set<String> networkOnlyOperations = {
  'loyalty_issue_pass',
  'portal_voucher_qr',
  'attendant_voucher_take',
  'attendant_loyalty_take',
  'record_customer_payment',
};

class QueuedOp {
  final String clientOpId;
  final OfflineOpType type;
  final Map<String, Object?> payload;
  final DateTime createdAt;
  int tries;
  OpStatus status;
  String? lastError;

  /// Réponse serveur en cas de conflit de version (P7), pour que
  /// l'utilisateur choisisse.
  Map<String, Object?>? conflictServerState;

  QueuedOp({
    required this.clientOpId,
    required this.type,
    required this.payload,
    required this.createdAt,
    this.tries = 0,
    this.status = OpStatus.pending,
    this.lastError,
    this.conflictServerState,
  });

  factory QueuedOp.create(OfflineOpType type, Map<String, Object?> payload,
          {DateTime? now}) =>
      QueuedOp(
        clientOpId: newClientOpId(),
        type: type,
        payload: Map.unmodifiable(payload),
        createdAt: now ?? DateTime.now().toUtc(),
      );

  Map<String, Object?> toJson() => {
        'client_op_id': clientOpId,
        'type': type.name,
        'payload': payload,
        'created_at': createdAt.toIso8601String(),
        'tries': tries,
        'status': status.name,
        'last_error': lastError,
        'conflict_server_state': conflictServerState,
      };

  factory QueuedOp.fromJson(Map<String, Object?> j) => QueuedOp(
        clientOpId: j['client_op_id']! as String,
        type: OfflineOpType.values.byName(j['type']! as String),
        payload: Map<String, Object?>.from(j['payload']! as Map),
        createdAt: DateTime.parse(j['created_at']! as String),
        tries: (j['tries'] as int?) ?? 0,
        status: OpStatus.values.byName((j['status'] as String?) ?? 'pending'),
        lastError: j['last_error'] as String?,
        conflictServerState: j['conflict_server_state'] == null
            ? null
            : Map<String, Object?>.from(j['conflict_server_state']! as Map),
      );
}

/// Résultat d'un envoi au serveur.
sealed class SendResult {
  const SendResult();
}

class SendOk extends SendResult {
  const SendOk();
}

/// Le serveur refuse : la `version` lue a changé (P7). Ne jamais écraser.
class SendConflict extends SendResult {
  final Map<String, Object?> serverState;
  const SendConflict(this.serverState);
}

/// Erreur métier définitive (droits, validation…) : pas de renvoi auto.
class SendRejected extends SendResult {
  final String message;
  const SendRejected(this.message);
}

/// Erreur réseau / temporaire : on réessaiera.
class SendRetryLater extends SendResult {
  final String message;
  const SendRetryLater(this.message);
}

typedef OpSender = Future<SendResult> Function(QueuedOp op);

/// Persistance de la file (Drift/SQLite dans l'app, mémoire en test).
abstract interface class OpStore {
  Future<List<QueuedOp>> loadAll();
  Future<void> upsert(QueuedOp op);
  Future<void> remove(String clientOpId);
}

class InMemoryOpStore implements OpStore {
  final Map<String, QueuedOp> _ops = {};

  @override
  Future<List<QueuedOp>> loadAll() async => _ops.values.toList();

  @override
  Future<void> upsert(QueuedOp op) async => _ops[op.clientOpId] = op;

  @override
  Future<void> remove(String clientOpId) async => _ops.remove(clientOpId);
}

class OfflineQueue {
  final OpStore store;
  final int maxAutoTries;
  bool _flushing = false;
  final _changes = StreamController<void>.broadcast();

  OfflineQueue(this.store, {this.maxAutoTries = 8});

  /// Notifie l'écran « Synchronisation ».
  Stream<void> get changes => _changes.stream;

  Future<QueuedOp> enqueue(QueuedOp op) async {
    await store.upsert(op);
    _changes.add(null);
    return op;
  }

  /// Opérations triées par date de création (FIFO).
  Future<List<QueuedOp>> all() async {
    final ops = await store.loadAll();
    ops.sort((a, b) {
      final c = a.createdAt.compareTo(b.createdAt);
      return c != 0 ? c : a.clientOpId.compareTo(b.clientOpId);
    });
    return ops;
  }

  /// Envoie les opérations en attente, dans l'ordre. S'arrête à la
  /// première erreur temporaire pour préserver l'ordre FIFO.
  /// Renvoie le nombre d'opérations envoyées avec succès.
  Future<int> flush(OpSender send) async {
    if (_flushing) return 0;
    _flushing = true;
    var sent = 0;
    try {
      for (final op in await all()) {
        if (op.status != OpStatus.pending && op.status != OpStatus.sending) {
          continue;
        }
        op
          ..status = OpStatus.sending
          ..tries += 1;
        await store.upsert(op);

        final SendResult result;
        try {
          result = await send(op);
        } catch (e) {
          await _retryLater(op, e.toString());
          break;
        }

        switch (result) {
          case SendOk():
            op
              ..status = OpStatus.sent
              ..lastError = null;
            sent++;
          case SendConflict(:final serverState):
            op
              ..status = OpStatus.conflict
              ..conflictServerState = serverState;
          case SendRejected(:final message):
            op
              ..status = OpStatus.error
              ..lastError = message;
          case SendRetryLater(:final message):
            await _retryLater(op, message);
            _changes.add(null);
            return sent;
        }
        await store.upsert(op);
        _changes.add(null);
      }
    } finally {
      _flushing = false;
    }
    return sent;
  }

  Future<void> _retryLater(QueuedOp op, String message) async {
    op
      ..lastError = message
      ..status =
          op.tries >= maxAutoTries ? OpStatus.error : OpStatus.pending;
    await store.upsert(op);
  }

  /// Choix utilisateur après conflit : renvoyer (avec la nouvelle version
  /// lue, fournie par l'appelant dans [updatedPayload]) …
  Future<void> resolveByResending(
      String clientOpId, Map<String, Object?> updatedPayload) async {
    final op = await _find(clientOpId);
    if (op == null) return;
    // Même client_op_id ? Non : c'est une nouvelle intention de
    // l'utilisateur sur une nouvelle version → nouvelle opération.
    await store.remove(clientOpId);
    await enqueue(QueuedOp.create(op.type, updatedPayload));
  }

  /// … ou abandonner sa modification (la version serveur est conservée).
  Future<void> resolveByDiscarding(String clientOpId) async {
    await store.remove(clientOpId);
    _changes.add(null);
  }

  /// Relance manuelle d'une opération en erreur (même client_op_id :
  /// aucun doublon possible côté serveur).
  Future<void> retry(String clientOpId) async {
    final op = await _find(clientOpId);
    if (op == null || op.status != OpStatus.error) return;
    op
      ..status = OpStatus.pending
      ..tries = 0;
    await store.upsert(op);
    _changes.add(null);
  }

  /// Purge les opérations envoyées.
  Future<void> clearSent() async {
    for (final op in await store.loadAll()) {
      if (op.status == OpStatus.sent) await store.remove(op.clientOpId);
    }
    _changes.add(null);
  }

  Future<QueuedOp?> _find(String id) async {
    for (final op in await store.loadAll()) {
      if (op.clientOpId == id) return op;
    }
    return null;
  }

  Future<void> dispose() => _changes.close();
}
