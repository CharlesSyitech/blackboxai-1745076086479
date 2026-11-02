import 'package:cgescar_core/cgescar_core.dart';
import 'package:test/test.dart';

void main() {
  group('parseNumberInput (P11)', () {
    final cases = <String, double?>{
      '12 345,6': 12345.6,
      '12 345,6': 12345.6,
      '12 345.6': 12345.6,
      "12'345.6": 12345.6,
      '1,234,567.89': 1234567.89,
      '1.234.567,89': 1234567.89,
      '1.234.567': 1234567,
      '12,5': 12.5,
      '12.5': 12.5,
      ' 450 ': 450,
      '-161': -161,
      '−6,8': -6.8,
      ',5': 0.5,
      '': null,
      'abc': null,
      '12a': null,
      '.': null,
      '-': null,
    };
    cases.forEach((input, expected) {
      test('« $input »', () => expect(parseNumberInput(input), expected));
    });
  });

  test('sanitizeNumberTyping garde chiffres et séparateurs', () {
    expect(sanitizeNumberTyping('12 345,6 L'), '12 345,6 ');
  });

  group('Formats (P10)', () {
    const n = thousandsSeparator;
    test('dates et heures', () {
      final d = DateTime(2026, 11, 2, 7, 5);
      expect(formatDate(d), '02/11/2026');
      expect(formatTime(d), '07:05');
      expect(formatDateTime(DateTime(2026, 1, 9, 23, 59)), '09/01/2026 23:59');
    });

    test('litres : 2 décimales max', () {
      expect(formatLitres(12345.678), '12${n}345,68 L');
      expect(formatLitres(10), '10 L');
      expect(formatLitres(13.5), '13,5 L');
    });

    test('FCFA : sans décimales, milliers espacés', () {
      expect(formatFcfa(1234567.4), '1${n}234${n}567 FCFA');
      expect(formatFcfa(999), '999 FCFA');
      expect(formatFcfa(-25000), '-25${n}000 FCFA');
    });

    test('‰', () => expect(formatPerMille(-6.8), '-6,8 ‰'));
    test('pas de « -0 »', () => expect(formatNumber(-0.001), '0'));
  });

  group('Devises (P9)', () {
    final rates = [
      FxRate(currency: Currency.eur, perXof: 1 / 655.957, date: DateTime(2026, 1, 1)),
      FxRate(currency: Currency.usd, perXof: 0.0017, date: DateTime(2026, 10, 1)),
      FxRate(currency: Currency.usd, perXof: 0.0018, date: DateTime(2026, 12, 1)),
    ];

    test('XOF affiché tel quel', () {
      expect(displayAmount(655957, target: Currency.xof, on: DateTime(2026, 11, 2)),
          '655${thousandsSeparator}957 FCFA');
    });

    test('EUR avec taux daté', () {
      expect(displayAmount(655957, target: Currency.eur, on: DateTime(2026, 11, 2), rates: rates),
          '1${thousandsSeparator}000,00 €');
    });

    test('taux le plus récent antérieur à la date', () {
      expect(rateFor(Currency.usd, DateTime(2026, 11, 2), rates)!.perXof, 0.0017);
    });

    test('sans taux : retombe sur XOF, pas de taux inventé', () {
      expect(displayAmount(1000, target: Currency.xaf, on: DateTime(2026, 11, 2), rates: rates),
          '1${thousandsSeparator}000 FCFA');
    });
  });

  group('Motif d\'annulation (P4)', () {
    test('≥ 5 caractères obligatoires', () {
      expect(validateCancelReason(null), isNotNull);
      expect(validateCancelReason('   '), isNotNull);
      expect(validateCancelReason('abcd'), isNotNull);
      expect(validateCancelReason(' abcd '), isNotNull);
      expect(validateCancelReason('erreur'), isNull);
    });
  });
}
