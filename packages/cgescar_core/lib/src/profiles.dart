/// Profils, accueil et périmètre (sections 3 et 4).
library;

/// Profils applicatifs, du plus élevé au plus bas pour le choix d'accueil.
enum Profile {
  syitechAdmin,
  direction,
  admin,
  inspector,
  manager,
  operator,
  provider,
  client,
  driver,
  standard,
}

/// Rangs pour « accueil = rôle le plus élevé ».
const List<Profile> profilePriority = [
  Profile.direction,
  Profile.admin,
  Profile.inspector,
  Profile.manager,
  Profile.operator,
  Profile.provider,
  Profile.client,
  Profile.driver,
  Profile.standard,
];

Profile? profileFromRole(String role) => switch (role) {
      'syitech_admin' => Profile.syitechAdmin,
      'direction' || 'owner' => Profile.direction,
      'admin' => Profile.admin,
      'inspector' || 'inspecteur' => Profile.inspector,
      'manager' || 'gerant' || 'station_manager' => Profile.manager,
      'operator' || 'pompiste' => Profile.operator,
      _ => null,
    };

/// Ce que l'app sait de l'utilisateur après connexion.
class SessionFacts {
  final Set<String> roles;
  final bool isDriverSession;
  final bool linkedToCustomer;
  final bool linkedToProvider;

  const SessionFacts({
    this.roles = const {},
    this.isDriverSession = false,
    this.linkedToCustomer = false,
    this.linkedToProvider = false,
  });
}

/// Résultat du routage après connexion.
sealed class LandingDecision {
  const LandingDecision();
}

/// Le compte Syitech n'a pas de console mobile.
class UseWebConsole extends LandingDecision {
  const UseWebConsole();
}

class LandOn extends LandingDecision {
  final Profile profile;

  /// Tous les profils de l'utilisateur (union des droits).
  final Set<Profile> profiles;
  const LandOn(this.profile, this.profiles);
}

LandingDecision decideLanding(SessionFacts f) {
  if (f.isDriverSession) {
    return const LandOn(Profile.driver, {Profile.driver});
  }
  final profiles = <Profile>{
    for (final r in f.roles)
      if (profileFromRole(r) case final p?) p,
  };
  if (profiles.contains(Profile.syitechAdmin)) return const UseWebConsole();

  // Pompiste : poste + assistant UNIQUEMENT, même s'il a d'autres liens.
  if (profiles.contains(Profile.operator) &&
      profiles.difference({Profile.operator}).isEmpty) {
    return const LandOn(Profile.operator, {Profile.operator});
  }
  if (f.linkedToCustomer) profiles.add(Profile.client);
  if (f.linkedToProvider) profiles.add(Profile.provider);
  if (profiles.isEmpty) profiles.add(Profile.standard);

  for (final p in profilePriority) {
    if (profiles.contains(p)) return LandOn(p, profiles);
  }
  return const LandOn(Profile.standard, {Profile.standard});
}

/// Fonctions de la matrice section 4.
enum Feature {
  marketPrices,
  directory,
  companyStats,
  tripMap,
  myVehicles,
  takeFuelQr,
  loyalty,
  loyaltyManagement,
  attendantPost,
  assistant,
  readings,
  indexControl,
  cashDesk,
  customersVouchers,
  dayValidation,
  maintenance,
  investigations,
  dashboard,
  alerts,
  hr,
  reports,
  sync,
  mySpace,
}

const Map<Feature, Set<Profile>> _featureMatrix = {
  Feature.marketPrices: {
    Profile.standard, Profile.driver, Profile.client, Profile.manager,
    Profile.inspector, Profile.admin, Profile.direction,
  },
  Feature.directory: {
    Profile.standard, Profile.driver, Profile.client, Profile.manager,
    Profile.inspector, Profile.admin, Profile.direction,
  },
  // Standard : uniquement connecté — toujours le cas une fois routé.
  Feature.companyStats: {
    Profile.standard, Profile.client, Profile.manager, Profile.inspector,
    Profile.admin, Profile.direction,
  },
  Feature.tripMap: {Profile.standard, Profile.driver, Profile.inspector},
  Feature.myVehicles: {Profile.standard},
  Feature.takeFuelQr: {Profile.standard, Profile.driver, Profile.client},
  Feature.loyalty: {Profile.standard},
  Feature.loyaltyManagement: {
    Profile.manager, Profile.inspector, Profile.admin, Profile.direction,
  },
  Feature.attendantPost: {Profile.operator},
  Feature.assistant: {
    Profile.standard, Profile.operator, Profile.manager, Profile.inspector,
    Profile.admin, Profile.direction,
  },
  Feature.readings: {
    Profile.manager, Profile.inspector, Profile.admin, Profile.direction,
  },
  Feature.indexControl: {
    Profile.manager, Profile.inspector, Profile.admin, Profile.direction,
  },
  Feature.cashDesk: {
    Profile.manager, Profile.inspector, Profile.admin, Profile.direction,
  },
  Feature.customersVouchers: {
    Profile.client, Profile.manager, Profile.inspector, Profile.admin,
    Profile.direction,
  },
  Feature.dayValidation: {
    Profile.manager, Profile.inspector, Profile.admin, Profile.direction,
  },
  Feature.maintenance: {
    Profile.provider, Profile.manager, Profile.inspector, Profile.admin,
    Profile.direction,
  },
  Feature.investigations: {Profile.inspector, Profile.admin, Profile.direction},
  Feature.dashboard: {
    Profile.client, Profile.manager, Profile.inspector, Profile.admin,
    Profile.direction,
  },
  Feature.alerts: {
    Profile.manager, Profile.inspector, Profile.admin, Profile.direction,
  },
  Feature.hr: {Profile.manager, Profile.admin, Profile.direction},
  Feature.reports: {
    Profile.client, Profile.manager, Profile.inspector, Profile.admin,
    Profile.direction,
  },
  Feature.sync: {
    Profile.manager, Profile.inspector, Profile.admin, Profile.direction,
  },
  Feature.mySpace: {
    Profile.standard, Profile.driver, Profile.client, Profile.provider,
    Profile.manager, Profile.inspector, Profile.admin, Profile.direction,
  },
};

/// Union des droits de tous les profils de l'utilisateur.
bool hasFeature(Set<Profile> profiles, Feature f) {
  final allowed = _featureMatrix[f] ?? const {};
  return profiles.any(allowed.contains);
}

/// Le pompiste n'a accès qu'au poste et à l'assistant ; toute autre page
/// renvoie au poste (parcours de test n° 10).
bool operatorMayOpen(Feature f) =>
    f == Feature.attendantPost || f == Feature.assistant;

/// Périmètre station : `station_ids` vide ou NULL = toutes les stations.
bool stationInScope(List<String>? stationIds, String stationId) =>
    stationIds == null || stationIds.isEmpty || stationIds.contains(stationId);
