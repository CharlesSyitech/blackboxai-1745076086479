import 'package:cgescar_core/cgescar_core.dart';
import 'package:test/test.dart';

void main() {
  group('Routage après connexion', () {
    test('syitech_admin → console web', () {
      expect(decideLanding(const SessionFacts(roles: {'syitech_admin'})),
          isA<UseWebConsole>());
    });

    test('aucun rôle → standard', () {
      final d = decideLanding(const SessionFacts()) as LandOn;
      expect(d.profile, Profile.standard);
    });

    test('pompiste → poste uniquement', () {
      final d = decideLanding(
              const SessionFacts(roles: {'operator'}, linkedToCustomer: true))
          as LandOn;
      expect(d.profile, Profile.operator);
      expect(d.profiles, {Profile.operator});
    });

    test('chauffeur', () {
      final d = decideLanding(const SessionFacts(isDriverSession: true)) as LandOn;
      expect(d.profile, Profile.driver);
    });

    test('plusieurs rôles : accueil = rôle le plus élevé, union des droits', () {
      final d = decideLanding(
          const SessionFacts(roles: {'manager', 'inspector'})) as LandOn;
      expect(d.profile, Profile.inspector);
      expect(hasFeature(d.profiles, Feature.hr), isTrue); // via gérant
      expect(hasFeature(d.profiles, Feature.investigations), isTrue); // via inspecteur
    });

    test('lien client / prestataire', () {
      expect((decideLanding(const SessionFacts(linkedToCustomer: true)) as LandOn).profile,
          Profile.client);
      expect((decideLanding(const SessionFacts(linkedToProvider: true)) as LandOn).profile,
          Profile.provider);
    });
  });

  group('Matrice des fonctions (section 4)', () {
    test('standard', () {
      const p = {Profile.standard};
      expect(hasFeature(p, Feature.myVehicles), isTrue);
      expect(hasFeature(p, Feature.loyalty), isTrue);
      expect(hasFeature(p, Feature.cashDesk), isFalse);
      expect(hasFeature(p, Feature.attendantPost), isFalse);
    });

    test('pompiste ne peut ouvrir que poste + assistant', () {
      expect(operatorMayOpen(Feature.attendantPost), isTrue);
      expect(operatorMayOpen(Feature.assistant), isTrue);
      expect(operatorMayOpen(Feature.cashDesk), isFalse);
      expect(operatorMayOpen(Feature.directory), isFalse);
    });

    test('prestataire : maintenance seulement', () {
      const p = {Profile.provider};
      expect(hasFeature(p, Feature.maintenance), isTrue);
      expect(hasFeature(p, Feature.marketPrices), isFalse);
    });
  });

  test('Périmètre station : vide / null = toutes', () {
    expect(stationInScope(null, 's1'), isTrue);
    expect(stationInScope(const [], 's1'), isTrue);
    expect(stationInScope(const ['s2'], 's1'), isFalse);
    expect(stationInScope(const ['s1', 's2'], 's1'), isTrue);
  });

  group('Matrice des rôles (P3)', () {
    final m = RoleMatrix.fromJson({
      'manager': {
        'cash': ['view', 'create'],
        'readings': {'view': true, 'validate': false},
      },
      'inspector': {
        'readings': ['view', 'validate'],
      },
    });

    test('lecture et union des rôles', () {
      expect(m.can({'manager'}, 'cash', PermAction.create), isTrue);
      expect(m.can({'manager'}, 'cash', PermAction.delete), isFalse);
      expect(m.can({'manager'}, 'readings', PermAction.validate), isFalse);
      expect(m.can({'manager', 'inspector'}, 'readings', PermAction.validate), isTrue);
      expect(m.can({'unknown'}, 'cash', PermAction.view), isFalse);
    });

    test('matrice absente = rien d\'autorisé côté affichage', () {
      expect(RoleMatrix.fromJson(null).can({'admin'}, 'cash', PermAction.view), isFalse);
    });
  });
}
