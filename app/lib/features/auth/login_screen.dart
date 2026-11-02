import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../core/secure_screen.dart';
import '../../core/services.dart';
import '../../ui/widgets/common.dart';

/// Écran de connexion (section 3) :
/// * téléphone OU e-mail + mot de passe ;
/// * chauffeur : téléphone + PIN 6 chiffres (vérifié côté serveur).
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _id = TextEditingController();
  final _secret = TextEditingController();
  bool _driver = false;
  bool _busy = false;
  String? _message;

  /// Le serveur convertit le téléphone en identifiant ; l'app transmet le
  /// numéro tel quel, comme le web.
  bool get _looksLikeEmail => _id.text.contains('@');

  Future<void> _submit() async {
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      final services = Services.maybeOf(context);
      if (services == null) throw 'Aperçu : connexion au serveur désactivée.';
      if (_driver) {
        if (!RegExp(r'^\d{6}$').hasMatch(_secret.text)) {
          throw 'Le code PIN comporte 6 chiffres.';
        }
        services.session.markDriverSession();
        await services.api.driverLogin(phone: _id.text.trim(), pin: _secret.text);
      } else if (_looksLikeEmail) {
        await services.session.client.auth
            .signInWithPassword(email: _id.text.trim(), password: _secret.text);
      } else {
        await services.session.client.auth
            .signInWithPassword(phone: _id.text.trim(), password: _secret.text);
      }
    } on AuthException catch (e) {
      // Message générique + code court du serveur, affiché tel quel ;
      // aucune nouvelle tentative automatique (anti-abus).
      setState(() => _message = e.statusCode == null ? e.message : '${e.message} (${e.statusCode})');
    } catch (e) {
      setState(() => _message = '$e');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context);
    return SecureScreenScope(
      child: Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                  Text('C-GESCAR', textAlign: TextAlign.center,
                      style: t.textTheme.displaySmall?.copyWith(
                          color: t.colorScheme.primary, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 32),
                  SegmentedButton<bool>(
                    segments: const [
                      ButtonSegment(value: false, label: Text('Mot de passe'), icon: Icon(Icons.lock)),
                      ButtonSegment(value: true, label: Text('Chauffeur (PIN)'), icon: Icon(Icons.local_shipping)),
                    ],
                    selected: {_driver},
                    onSelectionChanged: (s) => setState(() {
                      _driver = s.first;
                      _secret.clear();
                    }),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _id,
                    keyboardType: _driver ? TextInputType.phone : TextInputType.emailAddress,
                    decoration: InputDecoration(
                        labelText: _driver ? 'Téléphone' : 'Téléphone ou e-mail'),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _secret,
                    obscureText: true,
                    keyboardType: _driver ? TextInputType.number : TextInputType.visiblePassword,
                    maxLength: _driver ? 6 : null,
                    decoration: InputDecoration(labelText: _driver ? 'Code PIN (6 chiffres)' : 'Mot de passe'),
                    onSubmitted: (_) => _submit(),
                  ),
                  if (_message != null) ...[
                    const SizedBox(height: 8),
                    Text(_message!, style: TextStyle(color: t.colorScheme.error)),
                  ],
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: _busy ? null : _submit,
                    child: _busy
                        ? const SizedBox.square(dimension: 22, child: CircularProgressIndicator(strokeWidth: 2))
                        : const Text('Se connecter'),
                  ),
                  if (!_driver) ...[
                    const SizedBox(height: 12),
                    OutlinedButton.icon(
                      onPressed: _busy
                          ? null
                          : () async {
                              try {
                                await Services.of(context).session.client.auth.signInWithOAuth(
                                    OAuthProvider.google,
                                    redirectTo: 'com.syitech.cgescar://login-callback');
                              } catch (e) {
                                if (context.mounted) showError(context, e);
                              }
                            },
                      icon: const Icon(Icons.g_mobiledata),
                      label: const Text('Continuer avec Google'),
                    ),
                  ],
                ]),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Compte Syitech : pas de console mobile.
class WebConsoleScreen extends StatelessWidget {
  const WebConsoleScreen({super.key});

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.desktop_windows, size: 64),
              const SizedBox(height: 16),
              const Text('Utilisez la console web', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              const Text('https://c-gescar.lovable.app', textAlign: TextAlign.center),
              const SizedBox(height: 24),
              OutlinedButton(
                onPressed: () => Services.of(context).session.signOut(),
                child: const Text('Se déconnecter'),
              ),
            ]),
          ),
        ),
      );
}
