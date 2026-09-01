import type { MetadataRoute } from "next"
import { caseStudies } from "@/content/case-studies"
import { news } from "@/content/corporate"
import { expertises } from "@/content/expertises"
import { getLegalDocuments } from "@/content/legal"
import { solutions } from "@/content/solutions"
import { technologies } from "@/content/technologies"
import { getAwards, getJobs, getPeople } from "@/lib/content/queries"
import { absoluteUrl, locales, path, type Locale } from "@/lib/i18n/routes"

/**
 * Built from the same routing table as the pages themselves, with alternates
 * for every locale. Unpublished content never appears here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  const add = (build: (locale: Locale) => string, priority: number) => {
    for (const locale of locales) {
      entries.push({
        url: absoluteUrl(build(locale)),
        lastModified: now,
        priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((candidate) => [candidate, absoluteUrl(build(candidate))]),
          ),
        },
      })
    }
  }

  add((locale) => `/${locale}`, 1)
  add((locale) => path(locale, "group"), 0.8)
  add((locale) => path(locale, "group", "history"), 0.5)
  add((locale) => path(locale, "group", "vision-mission"), 0.5)
  add((locale) => path(locale, "group", "governance"), 0.5)
  add((locale) => path(locale, "group", "presence"), 0.5)
  if (getPeople().length > 0) add((locale) => path(locale, "group", "leadership"), 0.5)
  if (getAwards().length > 0) add((locale) => path(locale, "group", "awards"), 0.4)

  add((locale) => path(locale, "expertise"), 0.8)
  for (const expertise of expertises) {
    add((locale) => path(locale, "expertise", expertise.slug[locale]), 0.7)
  }

  add((locale) => path(locale, "solutions"), 0.9)
  for (const solution of solutions) {
    add((locale) => path(locale, "solutions", solution.slug[locale]), 0.9)
  }

  add((locale) => path(locale, "technology"), 0.7)
  for (const technology of technologies) {
    add((locale) => path(locale, "technology", technology.slug[locale]), 0.6)
  }

  add((locale) => path(locale, "work"), 0.8)
  for (const study of caseStudies) {
    if (study.disclosureLevel !== "public") continue
    add((locale) => path(locale, "work", study.slug[locale]), 0.7)
  }

  add((locale) => path(locale, "impact"), 0.6)
  add((locale) => path(locale, "partners"), 0.6)
  add((locale) => path(locale, "news"), 0.6)
  for (const item of news) {
    if (!item.isPublished) continue
    add((locale) => path(locale, "news", item.slug[locale]), 0.5)
  }

  add((locale) => path(locale, "careers"), 0.6)
  for (const job of getJobs()) {
    add((locale) => path(locale, "careers", job.slug[locale]), 0.5)
  }

  add((locale) => path(locale, "investors"), 0.6)
  add((locale) => path(locale, "contact"), 0.7)

  for (const document of getLegalDocuments()) {
    add((locale) => path(locale, "legal", document.slug[locale]), 0.2)
  }

  return entries
}
