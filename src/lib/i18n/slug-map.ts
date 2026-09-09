import { caseStudies } from "@/content/case-studies"
import { news } from "@/content/corporate"
import { expertises } from "@/content/expertises"
import { legalDocuments } from "@/content/legal"
import { solutions } from "@/content/solutions"
import { technologies } from "@/content/technologies"
import { locales, type Locale } from "@/lib/i18n/routes"
import type { I18n } from "@/types/content"

/**
 * Translations for the CONTENT slugs — the part of a URL the route table does
 * not cover.
 *
 * Without this the language switcher could only translate route segments, so
 * anyone reading /fr/solutions/kultix and pressing EN landed on the solutions
 * index instead of the same page in English. Every collection whose entries
 * carry a localized slug is registered here.
 */
type SlugCarrier = { slug: I18n }

const collections: SlugCarrier[][] = [
  solutions,
  expertises,
  technologies,
  caseStudies,
  news,
  legalDocuments,
]

/** "fr:cartes-usb-securisees" -> "secure-usb-cards" */
const translations = new Map<string, string>()

for (const collection of collections) {
  for (const entry of collection) {
    for (const from of locales) {
      for (const to of locales) {
        if (from === to) continue
        translations.set(`${from}:${to}:${entry.slug[from]}`, entry.slug[to])
      }
    }
  }
}

/**
 * The same slug in the other language, or null when the segment belongs to no
 * known entry — in which case the caller stops rather than guessing.
 */
export function translateSlug(from: Locale, to: Locale, slug: string): string | null {
  return translations.get(`${from}:${to}:${slug}`) ?? null
}
