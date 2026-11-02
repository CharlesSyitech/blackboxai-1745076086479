import 'dart:convert';

import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';

import 'config.dart';

/// Erreur métier renvoyée par le serveur, affichée telle quelle (anti-abus :
/// message générique + code court, section 3).
class ApiError implements Exception {
  final String message;
  final String? code;

  /// Vrai si le serveur refuse parce que la `version` lue a changé (P7).
  final bool isVersionConflict;
  const ApiError(this.message, {this.code, this.isVersionConflict = false});

  @override
  String toString() => code == null ? message : '$message ($code)';
}

/// RPC utilisée pour chaque type d'opération hors ligne (annexe A).
/// `null` = aucune RPC dédiée listée dans le cahier des charges : à
/// confirmer avec Syitech avant activation.
const Map<OfflineOpType, String?> queuedOpRpc = {
  OfflineOpType.shiftReading: 'close_shift',
  OfflineOpType.gaugeReading: null,
  OfflineOpType.delivery: 'validate_delivery',
  OfflineOpType.cashEntry: null,
  OfflineOpType.expense: null,
  OfflineOpType.incident: 'declare_incident_full',
};

/// Point d'accès unique au backend. **Toute écriture sensible passe par une
/// RPC serveur** (règle d'or). Les noms de paramètres suivent la convention
/// `_param` de la base (ex. `attendant_take_receipt(_station, _take_id,
/// _kind)`) ; ils doivent être confirmés avec le schéma généré fourni par
/// Syitech (annexe B).
class CgescarApi {
  final SupabaseClient client;
  CgescarApi(this.client);

  static bool _looksLikeConflict(PostgrestException e) {
    final m = '${e.message} ${e.details ?? ''} ${e.hint ?? ''}'.toLowerCase();
    return e.code == '40001' ||
        m.contains('version_conflict') ||
        m.contains('version mismatch') ||
        m.contains('conflit');
  }

  Future<T> rpc<T>(String fn, [Map<String, dynamic>? params]) async {
    try {
      final res = await client.rpc(fn, params: params);
      return res as T;
    } on PostgrestException catch (e) {
      throw ApiError(e.message,
          code: e.code, isVersionConflict: _looksLikeConflict(e));
    }
  }

  // ---- Public --------------------------------------------------------------
  Future<List<dynamic>> publicNetworkStations() =>
      rpc<List<dynamic>>('public_network_stations');
  Future<List<dynamic>> publicOilCompanies() =>
      rpc<List<dynamic>>('public_oil_companies');

  Future<List<Map<String, dynamic>>> latestMarketPrices() async {
    final rows = await client
        .from('market_prices')
        .select()
        .order('effective_date', ascending: false)
        .limit(50);
    return List<Map<String, dynamic>>.from(rows);
  }

  // ---- Fidélité -----------------------------------------------------------
  Future<Map<String, dynamic>> loyaltyIssuePass({
    required String vehicleId,
    required DevicePosition position,
  }) async =>
      Map<String, dynamic>.from(await rpc('loyalty_issue_pass', {
        '_vehicle_id': vehicleId,
        '_lat': position.latitude,
        '_lng': position.longitude,
        '_accuracy': position.accuracyMeters,
      }));

  Future<List<dynamic>> loyaltyMyTakes() =>
      rpc<List<dynamic>>('loyalty_my_takes');

  // ---- Pompiste -----------------------------------------------------------
  Future<Map<String, dynamic>> attendantLoyaltyOpen(String station, String code) async =>
      Map<String, dynamic>.from(
          await rpc('attendant_loyalty_open', {'_station': station, '_code': code}));

  Future<Map<String, dynamic>> attendantVoucherOpen(String station, String code) async =>
      Map<String, dynamic>.from(
          await rpc('attendant_voucher_open', {'_station': station, '_code': code}));

  Future<Map<String, dynamic>> attendantLoyaltyTake(Map<String, dynamic> p) async =>
      Map<String, dynamic>.from(await rpc('attendant_loyalty_take', p));

  Future<Map<String, dynamic>> attendantVoucherTake(Map<String, dynamic> p) async =>
      Map<String, dynamic>.from(await rpc('attendant_voucher_take', p));

  Future<Map<String, dynamic>> attendantTakeReceipt(
          String station, String takeId, String kind) async =>
      Map<String, dynamic>.from(await rpc('attendant_take_receipt',
          {'_station': station, '_take_id': takeId, '_kind': kind}));

  Future<Map<String, dynamic>> myAttendantContact() async =>
      Map<String, dynamic>.from(await rpc('my_attendant_contact'));

  // ---- Annulation (P4) ----------------------------------------------------
  Future<void> cancelRecord({
    required String table,
    required String id,
    required String reason,
  }) async {
    final err = validateCancelReason(reason);
    if (err != null) throw ApiError(err);
    await rpc('cancel_record',
        {'_table': table, '_id': id, '_reason': reason.trim()});
  }

  // ---- Fonctions serveur HTTP --------------------------------------------
  /// Appel d'une fonction serveur HTTP (TanStack) avec le jeton de session.
  Future<Map<String, dynamic>> serverFn(String name, Map<String, dynamic> body) async {
    if (AppConfig.functionsBase.isEmpty) {
      throw const ApiError('Service non configuré (CGESCAR_FN_BASE).');
    }
    final token = client.auth.currentSession?.accessToken;
    final res = await http.post(
      Uri.parse('${AppConfig.functionsBase}/$name'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
    final decoded = res.body.isEmpty ? <String, dynamic>{} : jsonDecode(res.body);
    if (res.statusCode >= 400) {
      final map = decoded is Map ? decoded : const {};
      throw ApiError('${map['message'] ?? map['error'] ?? 'Erreur serveur'}',
          code: map['code']?.toString());
    }
    return decoded is Map<String, dynamic> ? decoded : {'data': decoded};
  }

  /// Connexion chauffeur : le PIN est vérifié **côté serveur** (hash +
  /// verrouillage). L'app ne dérive jamais de mot de passe du PIN.
  Future<void> driverLogin({required String phone, required String pin}) async {
    final res = await serverFn('driverLogin', {'phone': phone, 'pin': pin});
    final refresh = res['refresh_token'] as String?;
    if (refresh == null) {
      throw ApiError('${res['message'] ?? 'Connexion refusée'}',
          code: res['code']?.toString());
    }
    await client.auth.setSession(refresh);
  }

  /// Envoie une opération de la file hors ligne. Le serveur déduplique sur
  /// `client_op_id` (P6).
  Future<SendResult> sendQueued(QueuedOp op) async {
    final fn = queuedOpRpc[op.type];
    if (fn == null) {
      // Pas de RPC listée en annexe A pour ce type : on n'invente rien (P8).
      return SendRejected('Envoi « ${op.type.name} » non disponible : RPC à confirmer par Syitech.');
    }
    try {
      await rpc(fn, {...op.payload, '_client_op_id': op.clientOpId});
      return const SendOk();
    } on ApiError catch (e) {
      if (e.isVersionConflict) return SendConflict({'message': e.message});
      return SendRejected(e.toString());
    } catch (e) {
      debugPrint('sync: $e');
      return SendRetryLater(e.toString());
    }
  }
}
