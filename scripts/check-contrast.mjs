#!/usr/bin/env node
/**
 * Enforces the contrast contract declared in design-system/tokens.json.
 *
 * The design system asserts specific foreground/background pairs meet WCAG 2.2,
 * and forbids others outright (amber-500 as text on light, teal-500 as text).
 * This turns those assertions into a build gate: a rebrand that breaks one is
 * caught here rather than by a user who cannot read the page.
 */
import { readFileSync } from "node:fs"

const tokens = JSON.parse(readFileSync(new URL("../design-system/tokens.json", import.meta.url), "utf8"))

/** Resolves a "{primitive.color.navy.700}" reference to its hex value. */
function resolve(reference) {
  if (!reference.startsWith("{")) return reference
  const path = reference.slice(1, -1).split(".")
  let node = tokens
  for (const key of path) {
    node = node?.[key]
    if (node === undefined) throw new Error(`Unresolved token reference: ${reference}`)
  }
  return node.$value ?? node
}

function channel(value) {
  const srgb = value / 255
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const clean = hex.replace("#", "")
  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function ratio(foreground, background) {
  const a = luminance(foreground)
  const b = luminance(background)
  const [light, dark] = a > b ? [a, b] : [b, a]
  return (light + 0.05) / (dark + 0.05)
}

const contract = tokens.contrastContract
const failures = []
let checked = 0

for (const group of ["text", "nonText"]) {
  for (const pair of contract[group] ?? []) {
    const fg = resolve(pair.fg)
    const bg = resolve(pair.bg)
    const measured = ratio(fg, bg)
    checked += 1
    if (measured < pair.min) {
      failures.push(`${fg} on ${bg} — ${measured.toFixed(2)}:1, contract requires ${pair.min}:1`)
    }
  }
}

// Forbidden pairs must stay forbidden: if one ever climbs above 4.5:1 the
// stated reason is stale and the rule needs revisiting, not silent drift.
for (const pair of contract.forbidden ?? []) {
  const fg = resolve(pair.fg)
  const bg = resolve(pair.bg)
  const measured = ratio(fg, bg)
  checked += 1
  if (measured >= 4.5) {
    failures.push(`${fg} on ${bg} is listed as forbidden but now measures ${measured.toFixed(2)}:1 — update the contract`)
  }
}

if (failures.length > 0) {
  console.error(`✗ contrast contract: ${failures.length} violation(s)`)
  for (const failure of failures) console.error(`  ${failure}`)
  process.exit(1)
}

console.log(`✓ contrast contract: ${checked} pairs verified`)
