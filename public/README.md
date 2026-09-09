# Assets

Every file the site loads is declared in `src/content/assets.ts` and reported by
`npm run check:assets`. Drop a file at its declared path and it appears — there
is no code change, no registration step and no build flag.

Nothing in this directory is generated. Where a file has not been supplied, the
page omits that plane rather than substituting a drawn stand-in.

## `assets/hero/` — the opening, as five separate planes

The separation is the point: a flattened composite cannot produce depth. Each
plane moves by its own factor as the pointer travels.

| File | What it is | Movement |
|---|---|---|
| `hero-bg-abidjan.webp` | Abidjan behind everything | very slight |
| `hero-africa-network.png` | the African map and its nodes | slight |
| `hero-woman.webp` | the subject, **cut out on transparency** | subtle, ±8px |
| `hero-hud.png` | interface marks and particles | more pronounced |
| `hero-glow.png` | light, **on its own layer** | follows the pointer |

Two requirements carry the effect:

- `hero-woman.webp` must be **cut out with a transparent background**. A
  rectangular photograph cannot sit between the map and the HUD.
- The eyewear glow belongs in `hero-glow.png`, **not** baked into the portrait.
  Light baked into the subject cannot move independently of it.

## `assets/products/` — one visual per card

`card-sydica.webp`, `card-sytium.webp`, `card-sydicard.webp`,
`card-kultix.webp`, `card-syitex.webp`, `card-rd.webp`.

Rendered at 4:3. Anything wider is cropped to the centre.

## `brands/<brand>/` — the marks

One `logo.svg` per brand: `syitech`, `sydica`, `sytium`, `sydicard`, `kultix`,
`syitex`, `rd`. Set at a fixed height so marks of different proportions align
across the band, and never recoloured — supply the version meant for a dark
ground.

If a mark ships as PNG rather than SVG, change the extension in
`src/content/assets.ts`; that file is the only place a path is written.
