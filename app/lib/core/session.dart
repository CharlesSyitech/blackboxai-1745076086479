import 'dart:async';

import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'config.dart';

/// Organisation accessible par l'utilisateur.
class OrgMembership {
  final String companyId;
  final String name;
  final Set<String> roles;

  /// `null` ou vide = toutes les stations de l'organisation.
  final List<String>? stationIds;
  const OrgMembership({
    required this.companyId,
    required this.name,
    required this.roles,
    this.stationIds,
  });
}

/// État de session : profils, organisation courante, matrice des rôles.
class SessionController extends ChangeNotifier {
  final SupabaseClient client;
  StreamSubscription<AuthState>? _sub;
  Timer? _idleTimer;

  SessionController(this.client) {
    _sub = client.auth.onAuthStateChange.listen((s) {
      if (s.event == AuthChangeEvent.signedOut) {
        _reset();
      } else if (s.event == AuthChangeEvent.signedIn ||
          s.event == AuthChangeEvent.initialSession) {
        if (s.session != null) unawaited(refresh());
      }
    });
  }

  bool loading = false;
  LandingDecision? landing;
  List<OrgMembership> orgs = const [];
  OrgMembership? currentOrg;
  RoleMatrix roleMatrix = RoleMatrix.empty;
  bool isDriverSession = false;
  String? error;

  bool get signedIn => client.auth.currentSession != null;

  Set<Profile> get profiles =>
      landing is LandOn ? (landing! as LandOn).profiles : const {};

  Profile? get homeProfile =>
      landing is LandOn ? (landing! as LandOn).profile : null;

  bool get isInternal => profiles.any((p) => const {
        Profile.manager,
        Profile.inspector,
        Profile.admin,
        Profile.direction,
        Profile.operator,
      }.contains(p));

  bool can(Feature f) {
    if (homeProfile == Profile.operator) return operatorMayOpen(f);
    return hasFeature(profiles, f);
  }

  /// Masquage de confort (P3) — la base reste juge (P2).
  bool canDo(String module, PermAction action) =>
      roleMatrix.can(currentOrg?.roles ?? const {}, module, action);

  void markDriverSession() => isDriverSession = true;

  Future<void> refresh() async {
    final user = client.auth.currentUser;
    if (user == null) return _reset();
    loading = true;
    error = null;
    notifyListeners();
    try {
      final roleRows = await client
          .from('user_roles')
          .select('role, company_id, station_ids, companies(name, role_matrix)')
          .eq('user_id', user.id);

      final byCompany = <String, OrgMembership>{};
      final matrices = <String, Map<String, Object?>?>{};
      final allRoles = <String>{};
      for (final r in roleRows) {
        final role = r['role'] as String;
        allRoles.add(role);
        final cid = r['company_id'] as String?;
        if (cid == null) continue;
        final company = r['companies'] as Map<String, dynamic>?;
        matrices[cid] = (company?['role_matrix'] as Map?)?.cast<String, Object?>();
        final prev = byCompany[cid];
        final ids = (r['station_ids'] as List?)?.cast<String>();
        byCompany[cid] = OrgMembership(
          companyId: cid,
          name: company?['name'] as String? ?? '—',
          roles: {...?prev?.roles, role},
          // Union des périmètres ; une ligne « toutes stations » l'emporte.
          stationIds: prev == null
              ? ids
              : (prev.stationIds == null || prev.stationIds!.isEmpty ||
                      ids == null || ids.isEmpty)
                  ? null
                  : {...prev.stationIds!, ...ids}.toList(),
        );
      }

      final customer = await client
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
      final provider = await client
          .from('maintenance_providers')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

      orgs = byCompany.values.toList();
      currentOrg = orgs.isEmpty ? null : orgs.first;
      roleMatrix = RoleMatrix.fromJson(
          currentOrg == null ? null : matrices[currentOrg!.companyId]);
      landing = decideLanding(SessionFacts(
        roles: allRoles,
        isDriverSession: isDriverSession,
        linkedToCustomer: customer.isNotEmpty,
        linkedToProvider: provider.isNotEmpty,
      ));
      unawaited(client.rpc('log_login').catchError((_) => null));
      touch();
    } catch (e) {
      error = e.toString();
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  void selectOrg(OrgMembership org) {
    currentOrg = org;
    notifyListeners();
  }

  /// À appeler à chaque interaction : déconnexion après 15 min
  /// d'inactivité pour les profils internes (P12).
  void touch() {
    _idleTimer?.cancel();
    if (!isInternal) return;
    _idleTimer = Timer(AppConfig.internalIdleTimeout, signOut);
  }

  Future<void> signOut() async {
    _idleTimer?.cancel();
    await client.auth.signOut();
    _reset();
  }

  void _reset() {
    landing = null;
    orgs = const [];
    currentOrg = null;
    roleMatrix = RoleMatrix.empty;
    isDriverSession = false;
    notifyListeners();
  }

  @override
  void dispose() {
    _sub?.cancel();
    _idleTimer?.cancel();
    super.dispose();
  }
}
