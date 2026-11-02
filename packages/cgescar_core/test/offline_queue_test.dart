import 'package:cgescar_core/cgescar_core.dart';
import 'package:test/test.dart';

void main() {
  test('client_op_id est un UUID v4 unique', () {
    final ids = List.generate(1000, (_) => newClientOpId()).toSet();
    expect(ids.length, 1000);
    expect(ids.every(isValidClientOpId), isTrue);
  });

  group('OfflineQueue', () {
    late OfflineQueue q;
    setUp(() => q = OfflineQueue(InMemoryOpStore(), maxAutoTries: 3));

    QueuedOp op(int minute, String label) => QueuedOp.create(
        OfflineOpType.shiftReading, {'label': label},
        now: DateTime.utc(2026, 11, 2, 8, minute));

    test('envoi FIFO', () async {
      await q.enqueue(op(2, 'b'));
      await q.enqueue(op(1, 'a'));
      await q.enqueue(op(3, 'c'));
      final order = <String>[];
      final n = await q.flush((o) async {
        order.add(o.payload['label']! as String);
        return const SendOk();
      });
      expect(n, 3);
      expect(order, ['a', 'b', 'c']);
      expect((await q.all()).every((o) => o.status == OpStatus.sent), isTrue);
    });

    test('renvoi = même client_op_id (aucun doublon côté serveur)', () async {
      await q.enqueue(op(1, 'a'));
      final serverSeen = <String>{};
      var calls = 0;
      Future<SendResult> sender(QueuedOp o) async {
        calls++;
        serverSeen.add(o.clientOpId); // dédup serveur sur client_op_id
        return calls == 1
            ? const SendRetryLater('timeout après écriture')
            : const SendOk();
      }

      await q.flush(sender);
      await q.flush(sender);
      expect(calls, 2);
      expect(serverSeen.length, 1);
    });

    test('erreur temporaire : arrêt pour préserver l\'ordre', () async {
      await q.enqueue(op(1, 'a'));
      await q.enqueue(op(2, 'b'));
      final sent = <String>[];
      await q.flush((o) async {
        sent.add(o.payload['label']! as String);
        return const SendRetryLater('réseau');
      });
      expect(sent, ['a']);
      final all = await q.all();
      expect(all.map((o) => o.status), [OpStatus.pending, OpStatus.pending]);
    });

    test('conflit de version : rien n\'est écrasé, choix utilisateur', () async {
      final o = await q.enqueue(op(1, 'a'));
      await q.flush((_) async => const SendConflict({'version': 7}));
      var all = await q.all();
      expect(all.single.status, OpStatus.conflict);
      expect(all.single.conflictServerState, {'version': 7});

      // Une nouvelle passe ne renvoie pas une opération en conflit.
      var resent = false;
      await q.flush((_) async {
        resent = true;
        return const SendOk();
      });
      expect(resent, isFalse);

      await q.resolveByResending(o.clientOpId, {'label': 'a', 'version': 7});
      all = await q.all();
      expect(all.single.status, OpStatus.pending);
      expect(all.single.clientOpId, isNot(o.clientOpId));
    });

    test('rejet définitif puis relance manuelle', () async {
      final o = await q.enqueue(op(1, 'a'));
      await q.flush((_) async => const SendRejected('droits'));
      expect((await q.all()).single.status, OpStatus.error);
      await q.retry(o.clientOpId);
      expect((await q.all()).single.status, OpStatus.pending);
    });

    test('trop d\'échecs → erreur', () async {
      await q.enqueue(op(1, 'a'));
      for (var i = 0; i < 3; i++) {
        await q.flush((_) async => throw Exception('hors ligne'));
      }
      expect((await q.all()).single.status, OpStatus.error);
    });

    test('sérialisation JSON aller-retour', () {
      final o = op(1, 'a');
      final back = QueuedOp.fromJson(o.toJson());
      expect(back.clientOpId, o.clientOpId);
      expect(back.type, o.type);
      expect(back.payload, o.payload);
      expect(back.createdAt, o.createdAt);
    });
  });
}
