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
const brandDoc = JSON.parse(readFileSync(new URL("../design-system/brands.json", import.meta.url), "utf8"))
const brands = brandDoc.brands
const statusTokens = brandDoc.statusTokens

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

/**
 * Every brand runs its own page in its own tokens, so each brand's semantic
 * set is measured against ITS OWN ink and surface — never the Group's. This is
 * the rule brands.json states in `contract.rules`; here it is enforced.
 *
 * `accent` only has to reach 3:1 (it draws marks and rules); `accentText` is
 * the value allowed to carry words, so it owes the full 4.5:1. KultiX is why
 * the two are separate: its violet is a legitimate graphic colour on black and
 * an illegible one for body copy.
 */
const brandChecks = [
  { token: "ink", against: ["page", "surface"], min: 4.5 },
  { token: "muted", against: ["page", "surface"], min: 4.5 },
  { token: "faint", against: ["page"], min: 3 },
  { token: "accent", against: ["page", "surface"], min: 3 },
  { token: "accentText", against: ["page", "surface"], min: 4.5 },
]

for (const [id, brand] of Object.entries(brands)) {
  const semantic = brand.semantic
  if (!semantic) {
    failures.push(`brand ${id} declares no semantic token set`)
    continue
  }
  for (const check of brandChecks) {
    const fg = semantic[check.token]
    if (!fg) {
      failures.push(`brand ${id} is missing semantic.${check.token}`)
      continue
    }
    for (const backgroundToken of check.against) {
      const bg = semantic[backgroundToken]
      const measured = ratio(fg, bg)
      checked += 1
      if (measured < check.min) {
        failures.push(
          `brand ${id}: ${check.token} ${fg} on ${backgroundToken} ${bg} — ${measured.toFixed(2)}:1, requires ${check.min}:1`,
        )
      }
    }
  }
  // Status colours are shared across universes, so each one is measured
  // against every brand's ground. SydiCard is the strict case: absolute black.
  for (const [name, value] of Object.entries(statusTokens ?? {})) {
    if (name.startsWith("$")) continue
    for (const backgroundToken of ["page", "surface"]) {
      const measured = ratio(value, semantic[backgroundToken])
      checked += 1
      if (measured < 4.5) {
        failures.push(
          `brand ${id}: status ${name} ${value} on ${backgroundToken} ${semantic[backgroundToken]} — ${measured.toFixed(2)}:1, requires 4.5:1`,
        )
      }
    }
  }

  // Text set ON the accent (buttons, badges) uses the brand's own onAccent.
  const onAccent = ratio(semantic.onAccent, semantic.accent)
  checked += 1
  if (onAccent < 4.5) {
    failures.push(
      `brand ${id}: onAccent ${semantic.onAccent} on accent ${semantic.accent} — ${onAccent.toFixed(2)}:1, requires 4.5:1`,
    )
  }
}

if (failures.length > 0) {
  console.error(`✗ contrast contract: ${failures.length} violation(s)`)
  for (const failure of failures) console.error(`  ${failure}`)
  process.exit(1)
}

console.log(`✓ contrast contract: ${checked} pairs verified`)
