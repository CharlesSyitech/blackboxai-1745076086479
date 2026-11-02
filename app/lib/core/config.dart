/// Configuration injectée à la compilation (aucune clé secrète, P1) :
///
/// ```
/// flutter run \
///   --dart-define=SUPABASE_URL=https://xxxx.supabase.co \
///   --dart-define=SUPABASE_ANON_KEY=eyJ... \
///   --dart-define=CGESCAR_FN_BASE=https://c-gescar.lovable.app/_server
/// ```
library;

class AppConfig {
  static const supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const supabaseAnonKey = String.fromEnvironment('SUPABASE_ANON_KEY');

  /// Base des fonctions serveur HTTP (driverLogin, création pompiste,
  /// assistant IA, e-mail de reçu, taux de change). URL exactes fournies
  /// par Syitech.
  static const functionsBase = String.fromEnvironment('CGESCAR_FN_BASE');

  static bool get isConfigured =>
      supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty;

  /// Déconnexion après inactivité pour les profils internes (P12).
  static const internalIdleTimeout = Duration(minutes: 15);
}
