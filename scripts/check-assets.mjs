#!/usr/bin/env node
/**
 * Reports which declared assets are present under /public and which are not.
 *
 * It does NOT fail the build: the files arrive on their own schedule, and a
 * red pipeline every day until then teaches everyone to ignore the pipeline.
 * What it does is make the gap impossible to lose track of — and it fails
 * loudly if an asset that WAS present disappears, which is a regression.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const source = readFileSync(join(root, "src/content/assets.ts"), "utf8")

// The manifest is TypeScript; read the declared paths straight out of it
// rather than compiling, so this stays a zero-dependency check.
const declared = [...source.matchAll(/"(\/(?:assets|brands)\/[^"]+)"/g)].map((m) => m[1])
const unique = [...new Set(declared)]

const present = unique.filter((path) => existsSync(join(root, "public", path)))
const missing = unique.filter((path) => !present.includes(path))

const lockPath = join(root, "design-system/assets-present.json")
const previous = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, "utf8")) : []
const vanished = previous.filter((path) => !present.includes(path))

console.log(`assets: ${present.length}/${unique.length} present`)
for (const path of present) console.log(`  ✓ ${path}`)
for (const path of missing) console.log(`  · ${path}  — not supplied yet`)

if (vanished.length > 0) {
  console.error(`\n✗ ${vanished.length} asset(s) that used to be present have gone missing:`)
  for (const path of vanished) console.error(`  ${path}`)
  console.error("A page that referenced them now renders a broken image.")
  process.exit(1)
}

writeFileSync(lockPath, JSON.stringify(present, null, 2) + "\n")
