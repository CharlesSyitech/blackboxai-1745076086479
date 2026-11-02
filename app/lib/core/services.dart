import 'dart:async';

import 'package:cgescar_core/cgescar_core.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/widgets.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'api.dart';
import 'session.dart';
import 'sqlite_op_store.dart';

/// Conteneur des services de l'app, exposé via [Services.of].
class Services {
  final CgescarApi api;
  final SessionController session;
  final OfflineQueue queue;
  StreamSubscription<List<ConnectivityResult>>? _net;

  Services._(this.api, this.session, this.queue);

  factory Services.create(SupabaseClient client) {
    final s = Services._(
      CgescarApi(client),
      SessionController(client),
      OfflineQueue(SqliteOpStore()),
    );
    // Envoi FIFO automatique au retour du réseau (section 12).
    s._net = Connectivity().onConnectivityChanged.listen((r) {
      if (!r.contains(ConnectivityResult.none) && s.session.signedIn) {
        unawaited(s.queue.flush(s.api.sendQueued));
      }
    });
    return s;
  }

  static Services of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<ServicesScope>()!.services;

  static Services? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<ServicesScope>()?.services;

  void dispose() {
    _net?.cancel();
    session.dispose();
  }
}

class ServicesScope extends InheritedWidget {
  final Services services;
  const ServicesScope({super.key, required this.services, required super.child});

  @override
  bool updateShouldNotify(ServicesScope oldWidget) =>
      services != oldWidget.services;
}
