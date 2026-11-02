import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

/// Interdit les captures d'écran sur les écrans PIN / QR (FLAG_SECURE,
/// principe P12). Implémentation native dans `MainActivity.kt`.
class SecureScreen {
  static const _channel = MethodChannel('cgescar/secure_screen');
  static int _depth = 0;

  static Future<void> _apply() async {
    if (!Platform.isAndroid) return;
    try {
      await _channel.invokeMethod('setSecure', _depth > 0);
    } on PlatformException {
      // Pas bloquant : l'écran reste utilisable.
    }
  }

  static Future<void> enter() async {
    _depth++;
    await _apply();
  }

  static Future<void> leave() async {
    if (_depth > 0) _depth--;
    await _apply();
  }
}

/// Enveloppe un écran sensible : FLAG_SECURE actif tant qu'il est monté.
class SecureScreenScope extends StatefulWidget {
  final Widget child;
  const SecureScreenScope({super.key, required this.child});

  @override
  State<SecureScreenScope> createState() => _SecureScreenScopeState();
}

class _SecureScreenScopeState extends State<SecureScreenScope> {
  @override
  void initState() {
    super.initState();
    SecureScreen.enter();
  }

  @override
  void dispose() {
    SecureScreen.leave();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.child;
}
