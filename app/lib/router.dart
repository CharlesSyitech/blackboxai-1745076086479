import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'core/session.dart';
import 'features/attendant/attendant_post_screen.dart';
import 'features/auth/login_screen.dart';
import 'features/common/shells.dart';
import 'features/manager/manager_home.dart';
import 'ui/widgets/common.dart';

/// Route d'accueil de chaque profil.
String homeRouteFor(Profile p) => switch (p) {
      Profile.operator => '/attendant',
      Profile.manager || Profile.inspector || Profile.admin || Profile.direction => '/manager',
      Profile.client => '/client',
      Profile.driver => '/driver',
      Profile.provider => '/provider',
      Profile.standard => '/public',
      Profile.syitechAdmin => '/web-console',
    };

/// Fonction requise par chaque route protégée.
const Map<String, Feature> routeFeature = {
  '/attendant': Feature.attendantPost,
  '/manager': Feature.readings,
  '/client': Feature.customersVouchers,
  '/driver': Feature.takeFuelQr,
  '/provider': Feature.maintenance,
  '/public': Feature.marketPrices,
};

/// Décision de redirection, testable sans widget.
String? redirectFor({
  required bool signedIn,
  required bool loading,
  required LandingDecision? landing,
  required bool Function(Feature) can,
  required String location,
}) {
  if (!signedIn) return location == '/login' ? null : '/login';
  if (landing == null || loading) return location == '/loading' ? null : '/loading';
  if (landing is UseWebConsole) return location == '/web-console' ? null : '/web-console';
  final home = homeRouteFor((landing as LandOn).profile);
  if (location == '/login' || location == '/loading' || location == '/web-console') return home;
  final f = routeFeature[location];
  // Pompiste qui tente une autre page → renvoyé au poste (§8, test n° 10).
  if (f == null || !can(f)) return location == home ? null : home;
  return null;
}

GoRouter buildRouter(SessionController session) => GoRouter(
      initialLocation: '/loading',
      refreshListenable: session,
      redirect: (context, state) => redirectFor(
        signedIn: session.signedIn,
        loading: session.loading,
        landing: session.landing,
        can: session.can,
        location: state.matchedLocation,
      ),
      routes: [
        GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
        GoRoute(
          path: '/loading',
          builder: (_, __) => Scaffold(
            body: Center(
              child: session.error == null
                  ? const CircularProgressIndicator()
                  : Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(mainAxisSize: MainAxisSize.min, children: [
                        Text(session.error!, textAlign: TextAlign.center),
                        const SizedBox(height: 12),
                        FilledButton(onPressed: session.refresh, child: const Text('Réessayer')),
                        TextButton(onPressed: session.signOut, child: const Text('Se déconnecter')),
                      ]),
                    ),
            ),
          ),
        ),
        GoRoute(path: '/web-console', builder: (_, __) => const WebConsoleScreen()),
        GoRoute(path: '/public', builder: (_, __) => const StandardShell()),
        GoRoute(path: '/attendant', builder: (_, __) => const AttendantPostScreen()),
        GoRoute(path: '/manager', builder: (_, __) => const ManagerHome()),
        GoRoute(path: '/client', builder: (_, __) => const ModuleUnavailable(title: 'Espace client')),
        GoRoute(path: '/driver', builder: (_, __) => const ModuleUnavailable(title: 'Espace chauffeur')),
        GoRoute(path: '/provider', builder: (_, __) => const ModuleUnavailable(title: 'Espace prestataire')),
      ],
    );
