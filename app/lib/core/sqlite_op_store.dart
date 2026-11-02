import 'dart:convert';

import 'package:cgescar_core/cgescar_core.dart';
import 'package:path/path.dart' as p;
import 'package:sqflite/sqflite.dart';

/// Persistance SQLite de la file hors ligne (P6). `client_op_id` est la
/// clé primaire : impossible d'enregistrer deux fois la même opération.
class SqliteOpStore implements OpStore {
  Database? _db;

  Future<Database> _open() async => _db ??= await openDatabase(
        p.join(await getDatabasesPath(), 'cgescar_queue.db'),
        version: 1,
        onCreate: (db, _) => db.execute('''
          CREATE TABLE ops (
            client_op_id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            json TEXT NOT NULL
          )'''),
      );

  @override
  Future<List<QueuedOp>> loadAll() async {
    final rows = await (await _open()).query('ops', orderBy: 'created_at');
    return rows
        .map((r) => QueuedOp.fromJson(
            jsonDecode(r['json']! as String) as Map<String, Object?>))
        .toList();
  }

  @override
  Future<void> upsert(QueuedOp op) async => (await _open()).insert(
        'ops',
        {
          'client_op_id': op.clientOpId,
          'created_at': op.createdAt.toIso8601String(),
          'json': jsonEncode(op.toJson()),
        },
        conflictAlgorithm: ConflictAlgorithm.replace,
      );

  @override
  Future<void> remove(String clientOpId) async => (await _open())
      .delete('ops', where: 'client_op_id = ?', whereArgs: [clientOpId]);
}
