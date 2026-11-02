import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/config.dart';
import 'core/secure_session_storage.dart';
import 'core/services.dart';
import 'router.dart';
import 'ui/theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (!AppConfig.isConfigured) {
    runApp(const _MissingConfigApp());
    return;
  }
  await Supabase.initialize(
    url: AppConfig.supabaseUrl,
    publishableKey: AppConfig.supabaseAnonKey,
    authOptions: FlutterAuthClientOptions(localStorage: SecureSessionStorage()),
  );
  runApp(CgescarApp(services: Services.create(Supabase.instance.client)));
}

class CgescarApp extends StatefulWidget {
  final Services services;
  const CgescarApp({super.key, required this.services});

  @override
  State<CgescarApp> createState() => _CgescarAppState();
}

class _CgescarAppState extends State<CgescarApp> {
  late final _router = buildRouter(widget.services.session);

  @override
  void dispose() {
    widget.services.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ServicesScope(
        services: widget.services,
        child: Listener(
          // Toute interaction réarme le minuteur d'inactivité (P12).
          onPointerDown: (_) => widget.services.session.touch(),
          child: MaterialApp.router(
            title: 'C-GESCAR',
            debugShowCheckedModeBanner: false,
            theme: buildTheme(Brightness.light),
            darkTheme: buildTheme(Brightness.dark),
            locale: const Locale('fr'),
            supportedLocales: const [Locale('fr'), Locale('en')],
            localizationsDelegates: GlobalMaterialLocalizations.delegates,
            routerConfig: _router,
          ),
        ),
      );
}

class _MissingConfigApp extends StatelessWidget {
  const _MissingConfigApp();

  @override
  Widget build(BuildContext context) => MaterialApp(
        theme: buildTheme(Brightness.light),
        home: const Scaffold(
          body: Center(
            child: Padding(
              padding: EdgeInsets.all(24),
              child: Text(
                'Configuration manquante.\n\nLancez avec --dart-define=SUPABASE_URL=… '
                'et --dart-define=SUPABASE_ANON_KEY=… (fournis par Syitech).',
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ),
      );
}
