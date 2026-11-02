/// Matrice des rôles par organisation (principe P3) :
/// `companies.role_matrix` = { rôle: { module: [actions] } }.
///
/// Le masquage côté app est du **confort** : l'accès réel est garanti par
/// la base (P2).
library;

enum PermAction { view, create, update, delete, validate }

PermAction? _parseAction(String s) => switch (s.toLowerCase()) {
      'view' || 'vue' || 'read' => PermAction.view,
      'create' || 'creer' || 'créer' => PermAction.create,
      'update' || 'edit' || 'modifier' => PermAction.update,
      'delete' || 'supprimer' => PermAction.delete,
      'validate' || 'valider' => PermAction.validate,
      _ => null,
    };

class RoleMatrix {
  /// rôle → module → actions
  final Map<String, Map<String, Set<PermAction>>> _grants;

  const RoleMatrix._(this._grants);

  static const RoleMatrix empty = RoleMatrix._({});

  /// Accepte `{role: {module: ["view","create"]}}` ou
  /// `{role: {module: {"view": true, "create": false}}}`.
  factory RoleMatrix.fromJson(Map<String, Object?>? json) {
    if (json == null) return empty;
    final grants = <String, Map<String, Set<PermAction>>>{};
    json.forEach((role, modules) {
      if (modules is! Map) return;
      final byModule = <String, Set<PermAction>>{};
      modules.forEach((module, actions) {
        final set = <PermAction>{};
        if (actions is List) {
          for (final a in actions) {
            final p = _parseAction('$a');
            if (p != null) set.add(p);
          }
        } else if (actions is Map) {
          actions.forEach((a, v) {
            final p = _parseAction('$a');
            if (p != null && v == true) set.add(p);
          });
        }
        byModule['$module'] = set;
      });
      grants[role] = byModule;
    });
    return RoleMatrix._(grants);
  }

  /// Union des droits de tous les rôles de l'utilisateur.
  bool can(Iterable<String> roles, String module, PermAction action) {
    for (final r in roles) {
      if (_grants[r]?[module]?.contains(action) ?? false) return true;
    }
    return false;
  }
}
