import 'package:cgescar_core/cgescar_core.dart';
import 'package:test/test.dart';

class _Row implements Cancellable {
  final double v;
  @override
  final bool isCancelled;
  _Row(this.v, {this.isCancelled = false});
}

void main() {
  group('Index / relèves', () {
    test('Sortie = IF − IO', () {
      expect(meterOutput([const MeterSegment(opening: 1000, closing: 1450.5)]),
          450.5);
    });

    test('Changement de compteur : calcul par segments', () {
      final segs = segmentsWithMeterChange(
          opening: 10000, oldMeterEnd: 10200, newMeterStart: 0, closing: 350);
      expect(meterOutput(segs), 550);
    });

    test('Plusieurs périodes : somme des segments = dernier − premier', () {
      final p1 = const MeterSegment(opening: 100, closing: 250);
      final p2 = const MeterSegment(opening: 250, closing: 400);
      expect(meterOutput([p1, p2]), 400 - 100);
    });

    test('Vendu = Sortie − RC', () {
      expect(quantitySold(output: 550, returnedToTank: 20), 530);
    });

    test('CA selon la base choisie', () {
      expect(
          revenue(
              basis: RevenueBasis.mechanical,
              mechanicalQuantity: 100,
              electronicQuantity: 102,
              unitPrice: 715),
          71500);
      expect(
          revenue(
              basis: RevenueBasis.electronic,
              mechanicalQuantity: 100,
              electronicQuantity: 102,
              unitPrice: 715),
          72930);
    });

    test('Écart électronique = électronique − vendu aux pompes', () {
      expect(electronicGap(electronicIndex: 1205, soldAtPumps: 1200), 5);
    });
  });

  group('Stocks', () {
    test('Stock théorique', () {
      expect(
          theoreticalStock(
              openingGauge: 10000, receipts: 5000, salesFromStock: 2368),
          12632);
    });

    test('Grande Cuve : somme, cuve non jaugée = 0, autre produit ignoré', () {
      final t = bigTank('go', const [
        TankLevel(productId: 'go', capacity: 20000, level: 8000),
        TankLevel(productId: 'go', capacity: 15000),
        TankLevel(productId: 'sp', capacity: 30000, level: 1),
      ]);
      expect(t.capacity, 35000);
      expect(t.level, 8000);
    });

    test('Alertes de cuve', () {
      expect(tankAlert(level: 5000, minimumLevel: 1000, unusableLevel: 300),
          TankAlert.ok);
      expect(tankAlert(level: 1100, minimumLevel: 1000, unusableLevel: 300),
          TankAlert.safetyPreAlert);
      expect(tankAlert(level: 300, minimumLevel: 1000, unusableLevel: 300),
          TankAlert.unusable);
    });
  });

  group('Tolérances', () {
    test('TV : exemple GAZOIL −161 L ≈ −6,8 ‰', () {
      final tv = salesTolerance(salesGap: -161, sold: 23676)!;
      expect(tv, closeTo(-6.8, 0.01));
      expect(withinTolerance(tv), isFalse);
    });

    test('TV non calculable sans vente', () {
      expect(salesTolerance(salesGap: 10, sold: 0), isNull);
    });

    test('TL et totale', () {
      final tl = deliveryTolerance(deliveryGap: -20, received: 10020)!;
      expect(tl, closeTo(-2.0, 1e-9));
      expect(totalTolerance(-2.5, tl), closeTo(-4.5, 1e-9));
      expect(withinTolerance(-4.5), isTrue);
      expect(withinTolerance(5.0), isTrue);
      expect(totalTolerance(null, null), isNull);
    });

    test('Écarts affichés seulement si jaugeage et index même date', () {
      expect(
          canShowGaps(
              gaugeDate: DateTime(2026, 11, 2, 6),
              indexDate: DateTime(2026, 11, 2, 22)),
          isTrue);
      expect(
          canShowGaps(
              gaugeDate: DateTime(2026, 11, 1), indexDate: DateTime(2026, 11, 2)),
          isFalse);
      expect(canShowGaps(gaugeDate: null, indexDate: DateTime(2026)), isFalse);
    });
  });

  group('Caisse', () {
    test('Dû du jour', () {
      expect(
          cashDueOfDay(
              fuelRevenue: 1000000,
              creditConsumption: 150000,
              expenses: 25000,
              receivablesCollected: 40000),
          865000);
    });

    test('Espèce théorique', () {
      expect(
          theoreticalCash(
              quantitySold: 1000,
              voucherConsumption: 120,
              internalConsumption: 30,
              unitPrice: 715),
          607750);
    });

    test('Les lignes annulées sont exclues', () {
      final rows = [_Row(10), _Row(5, isCancelled: true), _Row(2)];
      expect(activeOnly(rows).fold<double>(0, (a, r) => a + r.v), 12);
    });
  });

  group('Fidélité', () {
    test('1 L = 1 point, arrondi inférieur', () {
      expect(loyaltyPoints(13.79), 13);
      expect(loyaltyPoints(10), 10);
      expect(loyaltyPoints(0.1 + 0.2 + 9.7), 10); // 9.999999… binaire
      expect(loyaltyPoints(0), 0);
    });

    test('Bonus de campagne ajoutés', () {
      expect(loyaltyPoints(10, activeBonuses: [5, 2]), 17);
    });

    test('Niveaux selon seuils de la compagnie', () {
      expect(loyaltyTier(0), LoyaltyTier.silver);
      expect(loyaltyTier(499, goldThreshold: 500, diamondThreshold: 2000),
          LoyaltyTier.silver);
      expect(loyaltyTier(500, goldThreshold: 500, diamondThreshold: 2000),
          LoyaltyTier.gold);
      expect(loyaltyTier(2000, goldThreshold: 500, diamondThreshold: 2000),
          LoyaltyTier.diamond);
    });
  });

  test('Montant → litres', () {
    expect(litresForAmount(10000, 800), 12.5);
    expect(litresForAmount(10000, 0), 0);
  });
}
