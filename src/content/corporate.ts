import type { Award, CountryPresence, NewsItem, Job, Patent, Person, TimelineEntry } from "@/types/content"

/**
 * Corporate records awaiting validation (see docs/13, blockers B3, B7, B8).
 * Empty or unpublished collections make their sections disappear rather than
 * fill with placeholder content.
 */

export const people: Person[] = []

export const awards: Award[] = []

export const patents: Patent[] = []

export const countries: CountryPresence[] = [
  {
    id: "ci",
    name: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" },
    isoCode: "CI",
    presenceType: "headquarters",
    entityName: "Syitech Group",
    isPublic: true,
  },
]

export const timeline: TimelineEntry[] = []

export const news: NewsItem[] = []

export const jobs: Job[] = []
