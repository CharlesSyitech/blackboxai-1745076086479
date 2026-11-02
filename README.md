# C-GESCAR Mobile

Application Flutter (Android 8+ / iOS 14+) de C-GESCAR, d'après le
*Cahier des charges Flutter v2.0 du 02/11/2026* (Syitech-Group).

**Règle d'or : le mobile est un client de plus du même backend.** Aucune
règle métier définitive ni aucun contrôle d'accès n'existe uniquement dans
l'app : toute écriture sensible passe par les RPC serveur (annexe A).

## Structure

| Dossier | Contenu |
|---|---|
| `packages/cgescar_core/` | Règles métier pures (Dart, sans Flutter), testées avec `dart test` : formules de l'annexe C, saisie des nombres (P11), formats (P10), devises (P9), motif d'annulation (P4), profils et matrice des fonctions (§3–4), matrice des rôles (P3), file hors ligne idempotente (P6/P7), QR 15 min (§5.5), politique GPS, signal de trajet et alertes vocales (§5.3), reçu 80/58 mm (§8.4), noms de pompes (§9.9). |
| `app/` | Application Flutter : bootstrap Supabase, session dans le Keychain/Keystore, routage par profil, FLAG_SECURE sur les écrans PIN/QR, écrans. |

## Lancer

```bash
cd app
flutter pub get
flutter run \
  --dart-define=SUPABASE_URL=<fourni par Syitech> \
  --dart-define=SUPABASE_ANON_KEY=<clé publique fournie par Syitech> \
  --dart-define=CGESCAR_FN_BASE=<base des fonctions serveur HTTP>
```

Aucune clé secrète n'est embarquée (P1).

## Tests

```bash
cd packages/cgescar_core && dart test   # formules et règles (82 tests)
cd app && flutter test                  # routage par profil, widgets
```

## État d'avancement

| Domaine | État |
|---|---|
| Formules annexe C, formats, saisie nombres, devises | ✔ implémenté + testé |
| File hors ligne (FIFO, `client_op_id`, conflits sans écrasement) | ✔ moteur + stockage SQLite + écran Synchronisation |
| Connexion mot de passe / téléphone / PIN chauffeur / Google | ✔ (PIN vérifié côté serveur via `driverLogin`) |
| Routage par profil, pompiste limité au poste | ✔ testé |
| Accueil prix du marché, Annuaire (filtre logos + « Tout ») | ✔ premier jet |
| Fidélité : cartes, stats, reçus, QR CGF 15 min | ✔ premier jet |
| Poste pompiste : scan/saisie CGF/CGB, prise, signatures, reçu | ✔ premier jet (impression ESC/POS à brancher) |
| Gérant : Index du jour (calcul provisoire en direct) | ✔ calcul ; enregistrement `close_shift` à brancher |
| Carte & trajet, caisse, jaugeages, réceptions, clients & bons, pannes, RH, enquêtes, espaces client/chauffeur/prestataire | panneau « Module non disponible » (P8) |

## Points à confirmer avec Syitech

1. **Schéma généré (annexe B)** : les noms de colonnes et de paramètres RPC
   utilisés (`_station`, `_code`, `_product_id`, `plate`, `loyalty_cards`…)
   suivent la convention `_param` de `attendant_take_receipt(_station,
   _take_id, _kind)` et sont centralisés dans `app/lib/core/api.dart`.
   Ils doivent être alignés sur le schéma réel.
2. **RPC hors ligne** pour les jaugeages et les écritures de caisse : aucune
   n'est listée en annexe A, donc leur envoi est désactivé
   (`queuedOpRpc` dans `api.dart`) au lieu d'être inventé.
3. **Code d'erreur de conflit de version** (P7) renvoyé par le serveur
   (aujourd'hui détecté par `40001` ou un message contenant `version_conflict`).
4. **URL exactes** des fonctions serveur HTTP et format de réponse de
   `driverLogin` (l'app attend un `refresh_token`).
5. **Jeu de données de référence** pour vérifier que chaque formule donne
   exactement le même résultat que le web (§13).

## Aperçu web (revue visuelle, sans serveur)

`app/lib/preview_main.dart` affiche quelques écrans avec des valeurs
d'exemple signalées comme telles, sans connexion au backend :

```bash
cd app
flutter build web --release -t lib/preview_main.dart --web-renderer html --no-web-resources-cdn
```
