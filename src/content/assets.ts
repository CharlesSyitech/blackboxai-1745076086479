/**
 * The visual assets the site expects, at the paths Syitech Group specified.
 *
 * This file is the single declaration of what the pages load. Nothing here is
 * drawn, generated or approximated: each entry names a file that must exist
 * under /public. `npm run check:assets` reports which are present and which
 * are still missing, so the gap is visible rather than discovered in a
 * browser.
 *
 * Dropping the files in is the whole integration — no component changes.
 */

export interface AssetSlot {
  /** Public URL, exactly as served from /public. */
  src: string
  /** Empty where the image is decorative and the meaning sits in the text. */
  alt: string
  /** Parallax movement factor. Distant planes move least. */
  depth?: number
}

/**
 * The opening, as five independent planes. The separation is the point: a
 * flattened composite cannot produce depth, so the portrait, the map, the
 * HUD and the light each arrive as their own file.
 */
export const heroLayers = {
  /** Abidjan behind everything. Barely moves. */
  background: {
    // 1920x1080, Abidjan without a figure.
    src: "/assets/hero/hero-bg-abidjan.webp",
    alt: "",
    depth: 0.15,
  },
  /** The African network the subject stands in. */
  network: {
    // 1200x1200, transparent.
    src: "/assets/hero/hero-africa-network.png",
    alt: "",
    depth: 0.25,
  },
  /**
   * The cut-out subject. Held to roughly ±8px of travel — the figure reacts,
   * it is never swung around.
   */
  portrait: {
    // 1200x1400, cut out on transparency.
    src: "/assets/hero/hero-woman.webp",
    alt: "",
    depth: 0.45,
  },
  /** Interface marks and particles, the most mobile plane. */
  hud: {
    // 1200x1200, transparent.
    src: "/assets/hero/hero-hud.png",
    alt: "",
    depth: 0.65,
  },
  /** Light, kept off the portrait so it can follow the pointer on its own. */
  glow: {
    // 1200x1200, transparent.
    src: "/assets/hero/hero-glow.png",
    alt: "",
    depth: 0.85,
  },
} satisfies Record<string, AssetSlot>

/** One dedicated visual per product card. All 1200x1600. */
export const productCards: Record<string, string> = {
  sydica: "/assets/products/card-sydica.webp",
  sytium: "/assets/products/card-sytium.webp",
  sydicard: "/assets/products/card-sydicard.webp",
  kultix: "/assets/products/card-kultix.webp",
  syitex: "/assets/products/card-syitex.webp",
  rd: "/assets/products/card-rd.webp",
}

/**
 * Brand marks, per ground.
 *
 * A mark is never recoloured to suit a surface: each brand supplies the
 * version drawn for a dark ground and the version drawn for a light one, and
 * the page picks. Sytium is the case that proves the rule — its identity is
 * strictly monochrome, so tinting one variant to make the other would destroy
 * the mark rather than adapt it.
 *
 * `onDark` is what the brand band and every product hero use; `onLight` is
 * for the light surfaces of the site.
 */
export interface BrandMark {
  onDark: string
  onLight: string
  /**
   * The fraction of the file's height the mark actually occupies, measured on
   * the supplied file. A logo delivered inside a large transparent canvas
   * would otherwise render far smaller than its neighbours in the same row;
   * the band divides by this so every mark lands at the same optical size.
   * 1 means the file is trimmed to its content — which is how logos should
   * be supplied.
   */
  contentHeight?: number
}

export const brandLogoVariants: Record<string, BrandMark> = {
  // Supplied and verified by Syitech Group on 2026-09-09. The blue-diamond
  // Sytium mark that appeared in the composition was a stand-in; the client's
  // own pack says in writing not to use it.
  sytium: {
    onDark: "/brands/sytium/logo-sytium-white.png",
    onLight: "/brands/sytium/logo-sytium-dark.png",
    // Measured on the supplied file: the mark is 993x337 inside 1250x625.
    contentHeight: 337 / 625,
  },
  // Named per the asset sheet of 2026-09-09. The suffix there names the
  // GROUND the file is drawn for, not the colour of the artwork: `-light` is
  // the version for light surfaces, `-dark` the version for dark ones. If the
  // convention is the reverse, swapping the two strings per brand is the whole
  // correction.
  syitech: { onDark: "/brands/syitech/logo-syitech-dark.svg", onLight: "/brands/syitech/logo-syitech-light.svg" },
  sydica: { onDark: "/brands/sydica/logo-sydica-dark.svg", onLight: "/brands/sydica/logo-sydica-light.svg" },
  sydicard: { onDark: "/brands/sydicard/logo-sydicard-dark.svg", onLight: "/brands/sydicard/logo-sydicard-light.svg" },
  kultix: { onDark: "/brands/kultix/logo-kultix-dark.svg", onLight: "/brands/kultix/logo-kultix-light.svg" },
  syitex: { onDark: "/brands/syitex/logo-syitex-dark.svg", onLight: "/brands/syitex/logo-syitex-light.svg" },
  rd: { onDark: "/brands/rd/logo-rd-dark.svg", onLight: "/brands/rd/logo-rd-light.svg" },
}

/** The mark used on the dark brand surfaces of the homepage band. */
export const brandLogos: Record<string, string> = Object.fromEntries(
  Object.entries(brandLogoVariants).map(([id, mark]) => [id, mark.onDark]),
)

/** Every declared path, for the build-time report. */
export const declaredAssets: string[] = [
  ...Object.values(heroLayers).map((layer) => layer.src),
  ...Object.values(productCards),
  ...Object.values(brandLogoVariants).flatMap((mark) => [mark.onDark, mark.onLight]),
]
