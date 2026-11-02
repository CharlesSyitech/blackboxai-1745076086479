import 'package:cgescar_core/cgescar_core.dart';
import 'package:test/test.dart';

void main() {
  group('QR fidélité / bon', () {
    test('validité 15 min', () {
      final t0 = DateTime(2026, 11, 2, 10);
      final p = IssuedPass(code: 'CGF-AB12CD34', qrPayload: 'x', issuedAt: t0);
      expect(p.remaining(t0.add(const Duration(minutes: 5))),
          const Duration(minutes: 10));
      expect(p.isExpired(t0.add(const Duration(minutes: 15))), isTrue);
      expect(p.remaining(t0.add(const Duration(hours: 1))), Duration.zero);
    });

    test('réponse tardive ignorée après renouvellement', () {
      final g = PassRequestGuard();
      final first = g.begin();
      final second = g.begin(); // « Renouveler »
      expect(g.accept(first), isFalse);
      expect(g.accept(second), isTrue);
      g.invalidate();
      expect(g.accept(second), isFalse);
    });

    test('détection et normalisation du code saisi', () {
      expect(normalizePassCode(' cgf ab12cd34 '), 'CGF-AB12CD34');
      expect(loyaltyCodePattern.hasMatch(normalizePassCode('cgfab12cd34')), isTrue);
      expect(detectPassKind('CGB-1234ABCD'), PassKind.voucher);
      expect(detectPassKind('CGF-1234ABCD'), PassKind.loyalty);
      expect(detectPassKind('XYZ'), isNull);
    });
  });

  group('GPS', () {
    final now = DateTime(2026, 11, 2, 10);
    DevicePosition at(Duration age, {bool sensor = true, bool mock = false}) =>
        DevicePosition(
            latitude: 5.3,
            longitude: -4.0,
            timestamp: now.subtract(age),
            fromDeviceSensor: sensor,
            isMocked: mock);

    test('réutilisation < 2 min seulement, position réelle uniquement', () {
      expect(isReusablePosition(at(const Duration(seconds: 90)), now: now), isTrue);
      expect(isReusablePosition(at(const Duration(minutes: 2)), now: now), isFalse);
      expect(isReusablePosition(at(Duration.zero, sensor: false), now: now), isFalse);
      expect(isReusablePosition(at(Duration.zero, mock: true), now: now), isFalse);
      expect(isReusablePosition(null, now: now), isFalse);
    });
  });

  group('Produits', () {
    test('couleurs', () {
      expect(productColor(name: 'GAZOIL'), 0xFFF5C400);
      expect(productColor(name: 'Super sans plomb'), 0xFF1E9E4A);
      expect(productColor(name: 'Pétrole lampant', organisationColor: '#3366ff'),
          0xFF3366FF);
      expect(productColor(name: 'Lubrifiant'), isNull);
    });

    test('nom de pompe généré', () {
      expect(nextPumpName(ProductCode.go, const []), 'POMPE-GO-0001');
      expect(
          nextPumpName(ProductCode.go,
              const ['POMPE-GO-0001', 'POMPE-GO-0007', 'POMPE-SP-0009']),
          'POMPE-GO-0008');
      expect(nextPumpName(ProductCode.dp, const ['pompe-dp-0002']), 'POMPE-DP-0003');
    });
  });

  group('Trajet', () {
    const stations = [RouteStation('a', 40), RouteStation('b', 120), RouteStation('c', 300)];

    test('vert / orange / rouge', () {
      expect(assessTrip(litresAvailable: 50, consumptionLPer100: 8, routeKm: 500, stations: stations)!.signal,
          TripSignal.green);
      final o = assessTrip(litresAvailable: 12, consumptionLPer100: 8, routeKm: 500, stations: stations)!;
      expect(o.signal, TripSignal.orange);
      expect(o.lastReachableStation!.id, 'b');
      expect(o.missingLitres, closeTo(28, 1e-9));
      expect(assessTrip(litresAvailable: 2, consumptionLPer100: 8, routeKm: 500, stations: stations)!.signal,
          TripSignal.red);
    });

    test('sans consommation : pas d\'évaluation inventée', () {
      expect(assessTrip(litresAvailable: 10, consumptionLPer100: null, routeKm: 10, stations: stations), isNull);
    });

    test('alertes vocales une seule fois par station', () {
      final t = StationAlertTracker();
      expect(t.update(stationId: 'a', etaToStation: const Duration(minutes: 6)), isNull);
      expect(t.update(stationId: 'a', etaToStation: const Duration(minutes: 5)),
          'Vous êtes à 5 min d\'une station-service');
      expect(t.update(stationId: 'a', etaToStation: const Duration(minutes: 3)), isNull);
      expect(t.update(stationId: 'a', metersPastStation: 299), isNull);
      expect(t.update(stationId: 'a', metersPastStation: 300), passedMessage);
      expect(t.update(stationId: 'a', metersPastStation: 500), isNull);
      expect(t.update(stationId: 'b', metersPastStation: 400, stopped: true), isNull);
    });

    test('excès de vitesse', () {
      expect(isSpeeding(speedKmh: 95, limitKmh: 90), isTrue);
      expect(isSpeeding(speedKmh: 95, limitKmh: null), isFalse);
    });
  });

  group('Reçu 80 / 58 mm', () {
    final data = ReceiptData(
      kind: ReceiptKind.loyalty,
      companyName: 'Petro CI',
      stationName: 'Station Plateau',
      stationAddress: 'Bd de la République, Abidjan',
      stationPhone: '27 20 00 00 00',
      receiptNumber: 'R-000123',
      dateTime: DateTime(2026, 11, 2, 14, 5),
      customerName: 'K. Yao',
      vehicle: 'AB-1234-CI',
      productName: 'SUPER',
      litres: 10,
      unitPrice: 875,
      amount: 8750,
      points: 10,
      attendantName: 'Awa Koné',
      attendantPhone: '07 00 00 00 00',
      hasAttendantSignature: true,
    );

    for (final w in PaperWidth.values) {
      test('${w.name} : nom + téléphone pompiste, montant, largeur', () {
        final lines = buildReceipt(data, w);
        final text = renderReceiptText(lines, w);
        expect(text, contains('Awa Koné'));
        expect(text, contains('07 00 00 00 00'));
        expect(text, contains('8${thousandsSeparator}750 FCFA'));
        expect(text, contains('+10'));
        expect(text, isNot(contains('Signature chauffeur')));
        expect(text, isNot(contains('ANNULÉ')));
        for (final l in text.split('\n')) {
          expect(l.length, lessThanOrEqualTo(w.columns), reason: l);
        }
      });
    }

    test('mention ANNULÉ', () {
      final d = ReceiptData(
        kind: ReceiptKind.voucher,
        companyName: 'X', stationName: 'Y', receiptNumber: '1',
        dateTime: DateTime(2026), productName: 'GAZOIL', litres: 1,
        unitPrice: 1, amount: 1, attendantName: 'A', attendantPhone: 'P',
        cancelled: true,
      );
      final text = renderReceiptText(buildReceipt(d, PaperWidth.mm58), PaperWidth.mm58);
      expect(text, contains('ANNULÉ'));
      expect(text, contains('Signature chauffeur'));
    });
  });
}
