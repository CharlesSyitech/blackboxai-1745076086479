import 'package:flutter/material.dart';

/// Identité C-GESCAR : bleu marine (principal) + orange (action).
/// Les widgets lisent les couleurs dans le thème — jamais en dur (§2).
class CgescarColors extends ThemeExtension<CgescarColors> {
  final Color ok;
  final Color warning;
  final Color danger;
  final Color clientBadge;
  final Color nonClientBadge;

  const CgescarColors({
    required this.ok,
    required this.warning,
    required this.danger,
    required this.clientBadge,
    required this.nonClientBadge,
  });

  static const light = CgescarColors(
    ok: Color(0xFF1E9E4A),
    warning: Color(0xFFF08A00),
    danger: Color(0xFFD32F2F),
    clientBadge: Color(0xFF1E9E4A),
    nonClientBadge: Color(0xFF9E9E9E),
  );

  static const dark = CgescarColors(
    ok: Color(0xFF4CC777),
    warning: Color(0xFFFFA733),
    danger: Color(0xFFEF6F6F),
    clientBadge: Color(0xFF4CC777),
    nonClientBadge: Color(0xFF757575),
  );

  @override
  CgescarColors copyWith({Color? ok, Color? warning, Color? danger,
          Color? clientBadge, Color? nonClientBadge}) =>
      CgescarColors(
        ok: ok ?? this.ok,
        warning: warning ?? this.warning,
        danger: danger ?? this.danger,
        clientBadge: clientBadge ?? this.clientBadge,
        nonClientBadge: nonClientBadge ?? this.nonClientBadge,
      );

  @override
  CgescarColors lerp(CgescarColors? other, double t) {
    if (other == null) return this;
    return CgescarColors(
      ok: Color.lerp(ok, other.ok, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      danger: Color.lerp(danger, other.danger, t)!,
      clientBadge: Color.lerp(clientBadge, other.clientBadge, t)!,
      nonClientBadge: Color.lerp(nonClientBadge, other.nonClientBadge, t)!,
    );
  }
}

const _navy = Color(0xFF0B2545);
const _orange = Color(0xFFF26B1D);

ThemeData buildTheme(Brightness b, {Color? orgPrimary}) {
  final scheme = ColorScheme.fromSeed(
    seedColor: orgPrimary ?? _navy,
    brightness: b,
  ).copyWith(
    primary: b == Brightness.light ? (orgPrimary ?? _navy) : null,
    secondary: _orange,
    onSecondary: Colors.white,
  );
  return ThemeData(
    colorScheme: scheme,
    useMaterial3: true,
    extensions: [b == Brightness.light ? CgescarColors.light : CgescarColors.dark],
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: scheme.secondary,
        foregroundColor: scheme.onSecondary,
        minimumSize: const Size(64, 52),
        textStyle: const TextStyle(fontSize: 17, fontWeight: FontWeight.w600),
      ),
    ),
    inputDecorationTheme: const InputDecorationTheme(border: OutlineInputBorder()),
  );
}

extension CgescarThemeX on BuildContext {
  CgescarColors get cg => Theme.of(this).extension<CgescarColors>()!;
}
