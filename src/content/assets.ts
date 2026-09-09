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
    src: "/assets/hero/hero-bg-abidjan.webp",
    alt: "",
    depth: 0.15,
  },
  /** The African network the subject stands in. */
  network: {
    src: "/assets/hero/hero-africa-network.png",
    alt: "",
    depth: 0.25,
  },
  /**
   * The cut-out subject. Held to roughly ±8px of travel — the figure reacts,
   * it is never swung around.
   */
  portrait: {
    src: "/assets/hero/hero-woman.webp",
    alt: "",
    depth: 0.45,
  },
  /** Interface marks and particles, the most mobile plane. */
  hud: {
    src: "/assets/hero/hero-hud.png",
    alt: "",
    depth: 0.65,
  },
  /** Light, kept off the portrait so it can follow the pointer on its own. */
  glow: {
    src: "/assets/hero/hero-glow.png",
    alt: "",
    depth: 0.85,
  },
} satisfies Record<string, AssetSlot>

/** One dedicated visual per product card. */
export const productCards: Record<string, string> = {
  sydica: "/assets/products/card-sydica.webp",
  sytium: "/assets/products/card-sytium.webp",
  sydicard: "/assets/products/card-sydicard.webp",
  kultix: "/assets/products/card-kultix.webp",
  syitex: "/assets/products/card-syitex.webp",
  rd: "/assets/products/card-rd.webp",
}

/**
 * Brand marks. The directory per brand is Syitech's structure; the file
 * inside it is named here so nothing has to guess an extension at runtime.
 * A mark is never substituted, recoloured or redrawn.
 */
export const brandLogos: Record<string, string> = {
  syitech: "/brands/syitech/logo.svg",
  sydica: "/brands/sydica/logo.svg",
  sytium: "/brands/sytium/logo.svg",
  sydicard: "/brands/sydicard/logo.svg",
  kultix: "/brands/kultix/logo.svg",
  syitex: "/brands/syitex/logo.svg",
  rd: "/brands/rd/logo.svg",
}

/** Every declared path, for the build-time report. */
export const declaredAssets: string[] = [
  ...Object.values(heroLayers).map((layer) => layer.src),
  ...Object.values(productCards),
  ...Object.values(brandLogos),
]
