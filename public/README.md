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

Two files per brand — the mark drawn for a dark ground and the one drawn for a
light ground. A mark is never recoloured to suit a surface; Sytium proves why,
its identity being strictly monochrome.

Supplied so far: **Sytium** (`logo-sytium-white.png`, `logo-sytium-dark.png`).

**Trim the transparent margin.** The Sytium files carry the mark at 993×337
inside a 1250×625 canvas, so it would render at little over half the size of
its neighbours in the band. `contentHeight` in `src/content/assets.ts` corrects
for it — measured, not guessed — but a trimmed file needs no correction at all.

Paths and extensions live only in `src/content/assets.ts`.
