#!/usr/bin/env node
/**
 * Content guards derived from the governance rules in docs/03 and docs/13.
 *
 *  1. No {{placeholder}} may survive into published content — the drafting
 *     placeholders for unvalidated figures must never reach production.
 *  2. Every localized slug must exist in both locales, and be unique within
 *     its locale, or hreflang alternates and static params silently break.
 *  3. Route segments must be defined in both locales and stay unique per
 *     locale — a collision would make the middleware's reverse lookup
 *     ambiguous and route two pages to the same place.
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const contentDir = new URL("../src/content", import.meta.url).pathname
const failures = []

function walk(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) files.push(...walk(full))
    else if (full.endsWith(".ts") || full.endsWith(".tsx")) files.push(full)
  }
  return files
}

const files = walk(contentDir)

for (const file of files) {
  const source = readFileSync(file, "utf8")

  source.split("\n").forEach((line, index) => {
    if (/\{\{[a-zA-Z][\w.]*\}\}/.test(line)) {
      failures.push(`${file}:${index + 1} — drafting placeholder left in content: ${line.trim()}`)
    }
  })

  // slug: { fr: "…", en: "…" }
  const slugs = [...source.matchAll(/slug:\s*\{\s*fr:\s*"([^"]*)"\s*,\s*en:\s*"([^"]*)"\s*\}/g)]
  const partial = [...source.matchAll(/slug:\s*\{\s*(?:fr|en):\s*"[^"]*"\s*\}/g)]

  if (partial.length > 0) {
    failures.push(`${file} — ${partial.length} slug(s) declared in a single locale`)
  }

  const seen = { fr: new Map(), en: new Map() }
  for (const [, fr, en] of slugs) {
    if (!fr || !en) {
      failures.push(`${file} — empty slug in pair (fr: "${fr}", en: "${en}")`)
      continue
    }
    for (const [locale, value] of [["fr", fr], ["en", en]]) {
      if (seen[locale].has(value)) {
        failures.push(`${file} — duplicate ${locale} slug "${value}"`)
      }
      seen[locale].set(value, true)
    }
  }
}

// Route segments (src/lib/i18n/routes.ts) — the single source of truth for
// the router, the locale switcher, hreflang and the sitemap.
const routesFile = new URL("../src/lib/i18n/routes.ts", import.meta.url).pathname
const routesSource = readFileSync(routesFile, "utf8")
const segmentBlock = routesSource.slice(
  routesSource.indexOf("export const segments"),
  routesSource.indexOf("} as const"),
)
const segments = [...segmentBlock.matchAll(/"?([\w-]+)"?:\s*\{\s*fr:\s*"([^"]*)"\s*,\s*en:\s*"([^"]*)"\s*\}/g)]

if (segments.length === 0) {
  failures.push(`${routesFile} — no route segments parsed; the guard cannot verify the routing table`)
}

const segmentsSeen = { fr: new Map(), en: new Map() }
for (const [, key, fr, en] of segments) {
  for (const [locale, value] of [["fr", fr], ["en", en]]) {
    if (!value) {
      failures.push(`${routesFile} — route "${key}" has an empty ${locale} segment`)
      continue
    }
    const previous = segmentsSeen[locale].get(value)
    if (previous) {
      failures.push(`${routesFile} — ${locale} segment "${value}" is used by both "${previous}" and "${key}"`)
    }
    segmentsSeen[locale].set(value, key)
  }
}

if (failures.length > 0) {
  console.error(`✗ content guards: ${failures.length} problem(s)`)
  for (const failure of failures) console.error(`  ${failure}`)
  process.exit(1)
}

console.log(`✓ content guards: ${files.length} content files and ${segments.length} routes clean`)
