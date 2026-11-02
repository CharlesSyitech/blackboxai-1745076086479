import 'dart:async';

import 'package:cgescar_core/cgescar_core.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:screen_brightness/screen_brightness.dart';

import '../../core/secure_screen.dart';
import '../../core/services.dart';

/// « Prendre carburant » — QR fidélité CGF (§5.5).
///
/// Nouveau QR à chaque ouverture, compte à rebours 15 min, luminosité
/// maximale, « Renouveler » ; les réponses tardives sont ignorées.
class TakeFuelScreen extends StatefulWidget {
  final String vehicleId;
  final String vehicleLabel;
  const TakeFuelScreen({super.key, required this.vehicleId, required this.vehicleLabel});

  @override
  State<TakeFuelScreen> createState() => _TakeFuelScreenState();
}

class _TakeFuelScreenState extends State<TakeFuelScreen> {
  final _guard = PassRequestGuard();
  static DevicePosition? _lastPosition;
  IssuedPass? _pass;
  String? _error;
  bool _busy = false;
  Timer? _tick;

  @override
  void initState() {
    super.initState();
    ScreenBrightness().setScreenBrightness(1.0).catchError((_) {});
    _tick = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() {});
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _issue());
  }

  @override
  void dispose() {
    _guard.invalidate();
    _tick?.cancel();
    ScreenBrightness().resetScreenBrightness().catchError((_) {});
    super.dispose();
  }

  Future<DevicePosition> _position() async {
    final now = DateTime.now();
    if (isReusablePosition(_lastPosition, now: now)) return _lastPosition!;
    if (!await Geolocator.isLocationServiceEnabled()) throw gpsErrorMessage;
    var perm = await Geolocator.checkPermission();
    if (perm == LocationPermission.denied) perm = await Geolocator.requestPermission();
    if (perm == LocationPermission.denied || perm == LocationPermission.deniedForever) {
      throw gpsErrorMessage;
    }
    final p = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high, timeLimit: Duration(seconds: 20)),
    );
    return _lastPosition = DevicePosition(
      latitude: p.latitude,
      longitude: p.longitude,
      accuracyMeters: p.accuracy,
      timestamp: p.timestamp,
      isMocked: p.isMocked,
    );
  }

  Future<void> _issue() async {
    final ticket = _guard.begin();
    final api = Services.of(context).api;
    setState(() {
      _busy = true;
      _error = null;
      _pass = null;
    });
    try {
      final pos = await _position();
      final res = await api.loyaltyIssuePass(vehicleId: widget.vehicleId, position: pos);
      if (!_guard.accept(ticket) || !mounted) return; // réponse tardive
      final now = DateTime.now();
      setState(() => _pass = IssuedPass(
            code: '${res['code']}',
            qrPayload: '${res['qr'] ?? res['token'] ?? res['code']}',
            issuedAt: now,
            expiresAt: res['expires_at'] == null
                ? null
                : DateTime.parse('${res['expires_at']}').toLocal(),
          ));
    } catch (e) {
      if (_guard.accept(ticket) && mounted) setState(() => _error = '$e');
    } finally {
      if (_guard.accept(ticket) && mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final pass = _pass;
    final now = DateTime.now();
    final remaining = pass?.remaining(now) ?? Duration.zero;
    final expired = pass != null && pass.isExpired(now);
    String mmss(Duration d) =>
        '${d.inMinutes.toString().padLeft(2, '0')}:${(d.inSeconds % 60).toString().padLeft(2, '0')}';

    return SecureScreenScope(
      child: Scaffold(
        appBar: AppBar(title: Text('Prendre carburant · ${widget.vehicleLabel}')),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              if (_busy) const CircularProgressIndicator(),
              if (_error != null) ...[
                const Icon(Icons.location_off, size: 56),
                const SizedBox(height: 12),
                Text(_error!, textAlign: TextAlign.center, style: const TextStyle(fontSize: 18)),
              ],
              if (pass != null && !expired) ...[
                Container(
                  color: Colors.white, // QR toujours sur fond blanc
                  padding: const EdgeInsets.all(16),
                  child: QrImageView(data: pass.qrPayload, size: 280),
                ),
                const SizedBox(height: 16),
                SelectableText(pass.code,
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: 2)),
                const SizedBox(height: 8),
                Text('Expire dans ${mmss(remaining)}', style: const TextStyle(fontSize: 18)),
                const SizedBox(height: 8),
                const Text('Présentez ce code au pompiste.'),
              ],
              if (expired) const Text('QR expiré', style: TextStyle(fontSize: 20)),
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: _busy ? null : _issue,
                icon: const Icon(Icons.refresh),
                label: const Text('Renouveler'),
              ),
            ]),
          ),
        ),
      ),
    );
  }
}
