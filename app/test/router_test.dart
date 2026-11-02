import 'package:cgescar_core/cgescar_core.dart';
import 'package:cgescar_mobile/router.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  String? go(String location, {LandingDecision? landing, bool signedIn = true}) {
    final profiles = landing is LandOn ? landing.profiles : <Profile>{};
    final home = landing is LandOn ? landing.profile : null;
    return redirectFor(
      signedIn: signedIn,
      loading: false,
      landing: landing,
      can: (f) => home == Profile.operator ? operatorMayOpen(f) : hasFeature(profiles, f),
      location: location,
    );
  }

  test('non connecté → /login', () {
    expect(go('/manager', signedIn: false), '/login');
    expect(go('/login', signedIn: false), isNull);
  });

  test('syitech_admin → console web', () {
    expect(go('/public', landing: const UseWebConsole()), '/web-console');
  });

  test('pompiste renvoyé au poste depuis toute autre page (test n° 10)', () {
    const op = LandOn(Profile.operator, {Profile.operator});
    for (final r in ['/manager', '/public', '/client', '/driver', '/provider', '/inconnu']) {
      expect(go(r, landing: op), '/attendant', reason: r);
    }
    expect(go('/attendant', landing: op), isNull);
  });

  test('standard ne peut pas ouvrir le poste ni la gestion', () {
    const std = LandOn(Profile.standard, {Profile.standard});
    expect(go('/attendant', landing: std), '/public');
    expect(go('/manager', landing: std), '/public');
    expect(go('/login', landing: std), '/public');
  });

  test('gérant arrive sur Actions du jour', () {
    const m = LandOn(Profile.manager, {Profile.manager});
    expect(go('/loading', landing: m), '/manager');
    expect(go('/manager', landing: m), isNull);
  });
}
