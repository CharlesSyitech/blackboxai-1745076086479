#!/usr/bin/env node
/**
 * Generates the [data-brand] blocks in src/app/globals.css from
 * design-system/brands.json.
 *
 * Brand theming works exactly like [data-theme="dark"]: the semantic tokens
 * are redefined, and every component keeps working untouched. Because the
 * values are generated rather than copied, globals.css cannot drift from the
 * palettes the contrast gate verifies.
 *
 * Run with --check to fail instead of writing (used by CI).
 */
import { readFileSync, writeFileSync } from "node:fs"

const brandsUrl = new URL("../design-system/brands.json", import.meta.url)
const cssUrl = new URL("../src/app/globals.css", import.meta.url)

const START = "/* ▼ GENERATED — brand themes, from design-system/brands.json. Run `npm run build:brand-css`. */"
const END = "/* ▲ END GENERATED brand themes */"

const { brands, statusTokens } = JSON.parse(readFileSync(brandsUrl, "utf8"))

const blocks = Object.entries(brands).map(([id, brand]) => {
  const s = brand.semantic
  return `[data-brand="${id}"] {
  /* ${brand.name} — ${brand.universe} */
  --color-page: ${s.page};
  --color-surface: ${s.surface};
  --color-raised: ${s.raised};
  --color-inverse: ${s.ink};
  --color-ink: ${s.ink};
  --color-muted: ${s.muted};
  --color-faint: ${s.faint};
  --color-line: ${s.line};
  --color-line-soft: ${s.lineSoft};
  --color-line-strong: ${s.accent};
  --color-brand: ${s.muted};
  --color-brand-soft: ${s.lineSoft};
  --color-accent: ${s.accent};
  --color-accent-hover: ${s.accentText};
  --color-accent-ink: ${s.accentText};
  --color-on-accent: ${s.onAccent};
  --color-focus: ${s.accentText};
  --color-ok: ${statusTokens.ok};
  --color-warn: ${statusTokens.warn};
  --color-danger: ${statusTokens.danger};
  --color-data: ${statusTokens.data};
  color-scheme: dark;
}`
})

const generated = [START, "", ...blocks.flatMap((block) => [block, ""]), END].join("\n")

const css = readFileSync(cssUrl, "utf8")
const startIndex = css.indexOf(START)
const endIndex = css.indexOf(END)
if (startIndex === -1 || endIndex === -1) {
  console.error(`✗ markers not found in globals.css — expected ${START}`)
  process.exit(1)
}

const next = css.slice(0, startIndex) + generated + css.slice(endIndex + END.length)

if (process.argv.includes("--check")) {
  if (next !== css) {
    console.error("✗ brand CSS is stale — run `npm run build:brand-css` and commit the result")
    process.exit(1)
  }
  console.log(`✓ brand CSS matches brands.json (${blocks.length} brands)`)
} else {
  writeFileSync(cssUrl, next)
  console.log(`✓ brand CSS written (${blocks.length} brands)`)
}
