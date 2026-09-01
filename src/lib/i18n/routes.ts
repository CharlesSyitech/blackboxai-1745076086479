export const locales = ["fr", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "fr"

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/**
 * Canonical route key -> localized public segment.
 * The file tree under app/[locale] uses the KEYS; the middleware rewrites
 * incoming localized paths onto them. Single source of truth for the router,
 * the locale switcher, hreflang and the sitemap.
 */
export const segments = {
  group: { fr: "groupe", en: "group" },
  history: { fr: "histoire", en: "history" },
  "vision-mission": { fr: "vision-mission", en: "vision-mission" },
  governance: { fr: "gouvernance", en: "governance" },
  leadership: { fr: "leadership", en: "leadership" },
  presence: { fr: "presence", en: "global-presence" },
  awards: { fr: "distinctions", en: "awards" },
  expertise: { fr: "expertises", en: "expertise" },
  solutions: { fr: "solutions", en: "solutions" },
  technology: { fr: "technologies", en: "technology" },
  work: { fr: "realisations", en: "work" },
  impact: { fr: "impact", en: "impact" },
  partners: { fr: "partenaires", en: "partners" },
  news: { fr: "actualites", en: "news" },
  careers: { fr: "carrieres", en: "careers" },
  investors: { fr: "investisseurs", en: "investors" },
  contact: { fr: "contact", en: "contact" },
  legal: { fr: "informations", en: "legal" },
} as const

export type RouteKey = keyof typeof segments

const reverse: Record<Locale, Map<string, string>> = {
  fr: new Map(),
  en: new Map(),
}
for (const [key, value] of Object.entries(segments)) {
  reverse.fr.set(value.fr, key)
  reverse.en.set(value.en, key)
}

/** Localized public segment -> canonical key (used by the middleware). */
export function toCanonicalSegment(locale: Locale, segment: string): string {
  return reverse[locale].get(segment) ?? segment
}

/**
 * Builds a public URL. Known route keys are localized; anything else
 * (a content slug) passes through untouched.
 */
export function path(locale: Locale, ...parts: string[]): string {
  const mapped = parts
    .filter(Boolean)
    .map((part) => (part in segments ? segments[part as RouteKey][locale] : part))
  return "/" + [locale, ...mapped].join("/")
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.syitechgroup.com"

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteUrl).toString()
}
