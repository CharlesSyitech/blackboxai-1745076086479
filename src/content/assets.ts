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
  /**
   * How the plane is composited.
   *
   * The pack describes the network, HUD and light as transparent overlays, but
   * the delivered files are fully opaque (measured: 0% transparent pixels) —
   * only the portrait carries real alpha, at 22%. Stacked normally, each
   * opaque plane would simply hide everything beneath it, which is exactly
   * what happened on first integration: the light covered the entire scene.
   *
   * `screen` resolves it without touching a single file: black leaves the
   * backdrop untouched and only the luminous artwork carries through — which
   * is what these overlays are drawn to do. Supply them with real alpha and
   * this can go back to "normal".
   */
  composite?: "normal" | "screen"
  /** How the plane fills its layer. */
  fit?: "cover" | "contain"
  position?: string
  /** Held below 1 where a plane would otherwise bury the ones beneath it. */
  opacity?: number
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
    depth: 0.12,
    fit: "cover",
    position: "center right",
  },
  /** The African network the subject stands in. */
  network: {
    // 1200x1200, transparent.
    src: "/assets/hero/hero-africa-network.png",
    alt: "",
    depth: 0.24,
    composite: "screen",
    fit: "contain",
  },
  /**
   * The cut-out subject. Held to roughly ±8px of travel — the figure reacts,
   * it is never swung around.
   */
  portrait: {
    // 1200x1400, cut out on transparency.
    src: "/assets/hero/hero-woman.webp",
    alt: "",
    depth: 0.42,
    // The one plane with real transparency: it composites normally, and sits
    // between the network and the HUD as the pack requires.
    fit: "contain",
    position: "center bottom",
  },
  /** Interface marks and particles, the most mobile plane. */
  hud: {
    // 1200x1200, transparent.
    src: "/assets/hero/hero-hud.png",
    alt: "",
    depth: 0.62,
    composite: "screen",
    fit: "contain",
  },
  /** Light, kept off the portrait so it can follow the pointer on its own. */
  glow: {
    // 1200x1200, transparent.
    src: "/assets/hero/hero-glow.png",
    alt: "",
    depth: 0.78,
    composite: "screen",
    fit: "contain",
    opacity: 0.55,
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
   * the supplied file, so marks with different margins land at the same
   * optical size in a row. 1 means the file is trimmed to its content.
   */
  contentHeight?: number
  /**
   * Set where the file ships with a flat backing rather than transparency.
   *
   * Twelve of the fourteen marks in the supplied pack are opaque rectangles —
   * the pack says so itself: they were isolated from the approved asset board
   * rather than exported from source. A black rectangle dropped on Sydica's
   * deep violet would read as a box around the logo.
   *
   * Rather than alter the files, the black-backed variants are composited with
   * `screen`, under which black leaves the backdrop untouched and the artwork
   * comes through. The files stay exactly as delivered; only the compositing
   * changes. Replace them with true vector originals and drop this flag.
   */
  matte?: "black"
  /**
   * Whether the file may be published AS this brand's mark.
   *
   * The twelve board-isolated marks are not: inspected one by one, they are
   * upscaled crops of a contact sheet — soft, carrying the sheet's rounded
   * tile, and at least one is simply the wrong brand
   * (logo-sydicard-light.png contains the Sytium mark, itself the mocked
   * blue-diamond version the client's own earlier pack ruled out).
   *
   * Publishing another company's mark on a brand card is not a rendering
   * defect, it is an identity error, so these stay unpublished and the clean
   * typographic wordmark holds the place. The files are in the repository:
   * flipping `verified` to true is the whole switch once real originals land.
   */
  verified?: boolean
}

export const brandLogoVariants: Record<string, BrandMark> = {
  /**
   * Sytium is the one brand whose marks are genuine source exports — supplied
   * separately by the client, 87% transparent. They carry a BLACK badge with a
   * white chevron, so they must never be composited with `screen`: it would
   * erase the badge and destroy the mark.
   */
  sytium: {
    onDark: "/brands/sytium/logo-sytium-dark.png",
    onLight: "/brands/sytium/logo-sytium-light.png",
    contentHeight: 337 / 625,
    verified: true,
  },

  // Isolated from the asset board, 900x420, fully opaque. To be replaced by
  // official vector originals when they exist.
  syitech: { onDark: "/brands/syitech/logo-syitech-dark.png", onLight: "/brands/syitech/logo-syitech-light.png", matte: "black", verified: false },
  sydica: { onDark: "/brands/sydica/logo-sydica-dark.png", onLight: "/brands/sydica/logo-sydica-light.png", matte: "black", verified: false },
  // The pack's two SydiCard files are swapped with respect to every other
  // brand: measured mean luminance is 194 for "-dark" (a white ground) and 42
  // for "-light" (a black one). Assigned on the measurement rather than on the
  // filename, so the mark lands on the ground it was drawn for.
  sydicard: { onDark: "/brands/sydicard/logo-sydicard-light.png", onLight: "/brands/sydicard/logo-sydicard-dark.png", matte: "black", verified: false },
  kultix: { onDark: "/brands/kultix/logo-kultix-dark.png", onLight: "/brands/kultix/logo-kultix-light.png", matte: "black", verified: false },
  syitex: { onDark: "/brands/syitex/logo-syitex-dark.png", onLight: "/brands/syitex/logo-syitex-light.png", matte: "black", verified: false },
  rd: { onDark: "/brands/rd/logo-rd-dark.png", onLight: "/brands/rd/logo-rd-light.png", matte: "black", verified: false },
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
