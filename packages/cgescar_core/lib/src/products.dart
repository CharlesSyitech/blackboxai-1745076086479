/// Produits : codes, couleurs et noms générés (sections 2 et 9.9).
library;

/// Code produit utilisé dans les noms générés.
enum ProductCode {
  go('GO', 'GAZOIL'),
  sp('SP', 'SUPER'),
  dp('DP', 'PÉTROLE LAMPANT');

  final String code;
  final String label;
  const ProductCode(this.code, this.label);

  static ProductCode? fromName(String name) {
    final n = name.trim().toUpperCase();
    if (n.startsWith('GAZ') || n == 'GO' || n.contains('DIESEL')) {
      return ProductCode.go;
    }
    if (n.startsWith('SUPER') || n == 'SP' || n.contains('ESSENCE')) {
      return ProductCode.sp;
    }
    if (n.contains('LAMPANT') || n.contains('PETROLE') || n.contains('PÉTROLE') ||
        n == 'DP') {
      return ProductCode.dp;
    }
    return null;
  }
}

/// Couleur ARGB d'un produit. GAZOIL = jaune, SUPER = vert, sinon couleur
/// choisie par l'organisation (`products.color`, format `#RRGGBB`).
/// `null` si aucune couleur n'est définie (pas de couleur inventée).
int? productColor({required String name, String? organisationColor}) {
  final org = parseHexColor(organisationColor);
  final code = ProductCode.fromName(name);
  if (code == ProductCode.go) return 0xFFF5C400; // jaune
  if (code == ProductCode.sp) return 0xFF1E9E4A; // vert
  return org;
}

int? parseHexColor(String? hex) {
  if (hex == null) return null;
  var h = hex.trim().replaceFirst('#', '');
  if (h.length == 3) h = h.split('').map((c) => '$c$c').join();
  if (h.length == 6) h = 'FF$h';
  if (h.length != 8) return null;
  return int.tryParse(h, radix: 16);
}

/// Nom / code compteur généré d'une pompe : `POMPE-GO-0001`.
/// [existing] = noms déjà présents dans la station ; renvoie le premier
/// numéro libre après le plus grand existant.
String nextPumpName(ProductCode product, Iterable<String> existing) {
  final re = RegExp('^POMPE-${product.code}-(\\d+)\$');
  var max = 0;
  for (final n in existing) {
    final m = re.firstMatch(n.trim().toUpperCase());
    if (m != null) {
      final v = int.parse(m.group(1)!);
      if (v > max) max = v;
    }
  }
  return 'POMPE-${product.code}-${(max + 1).toString().padLeft(4, '0')}';
}

/// Un distributeur porte au plus 2 pompes (produits mixtes autorisés).
const int maxPumpsPerDispenser = 2;
