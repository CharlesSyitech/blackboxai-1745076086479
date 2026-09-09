import type { Locale } from "@/lib/i18n/routes"
import type { I18n } from "@/types/content"

/**
 * The brand architecture. Mirror of design-system/brands.json for the fields
 * the site renders; the JSON keeps the full record (palette provenance,
 * regulatory analysis, open questions) that never reaches a page.
 *
 * A brand is not a solution. `solutions.ts` describes what is sold; this
 * describes who says it. Two brands here have no solution page at all —
 * SyitEx and Syitech R&D — and one solution has no brand of its own: the
 * secure USB cards are a Group capability.
 */
export type BrandId = "group" | "sydica" | "sytium" | "sydicard" | "kultix" | "syitex" | "rd"

export interface Brand {
  id: BrandId
  name: string
  /** Short descriptor set under the wordmark. */
  role: I18n
  /** The universe in a single line — used as the card's atmosphere caption. */
  universe: I18n
  status: "live" | "in_development"
  /** Rendered on every surface where an unopened product appears. */
  statusLabel: I18n | null
  /**
   * The brand's own site. Null where none is public — never a placeholder,
   * never a link to a domain the Group does not control.
   */
  website: string | null
  /**
   * False where no logo has been supplied. Those brands are set in the Group's
   * typography instead of borrowing another brand's mark, and say so.
   */
  hasOfficialLogo: boolean
  /** The solution page this brand carries, when it has one. */
  solutionId: string | null
  positioning: I18n
  order: number
}

export const brands: Brand[] = [
  {
    id: "group",
    name: "Syitech Group",
    role: {
      fr: "Marque ombrelle",
      en: "Umbrella brand",
    },
    universe: {
      fr: "Premium · institutionnel · technologique · international",
      en: "Premium · institutional · technological · international",
    },
    status: "live",
    statusLabel: null,
    website: null,
    hasOfficialLogo: true,
    solutionId: null,
    positioning: {
      fr: "Le Groupe se tient au-dessus des produits, jamais à côté d'eux : il porte la recherche, l'ingénierie et les infrastructures que chaque marque utilise.",
      en: "The Group stands above its products rather than beside them: it carries the research, the engineering and the infrastructure every brand draws on.",
    },
    order: 1,
  },
  {
    id: "sydica",
    name: "Sydica",
    role: {
      fr: "CultTech — musique, culture, créateurs",
      en: "CultTech — music, culture, creators",
    },
    universe: {
      fr: "Émotion · scène · Afrique contemporaine · création",
      en: "Emotion · stage · contemporary Africa · creation",
    },
    status: "live",
    statusLabel: null,
    website: "https://sydica.art",
    hasOfficialLogo: true,
    solutionId: "sydica",
    positioning: {
      fr: "La chaîne de valeur de la musique — distribution, audience, droits — tenue par une seule plateforme.",
      en: "The music value chain — distribution, audience, rights — held by a single platform.",
    },
    order: 2,
  },
  {
    id: "sytium",
    name: "Sytium",
    role: {
      fr: "Enterprise Technology — ERP, finance, RH, décisionnel",
      en: "Enterprise Technology — ERP, finance, HR, analytics",
    },
    universe: {
      fr: "SaaS premium monochrome — la couleur vient des données, jamais de la marque",
      en: "Monochrome premium SaaS — colour comes from the data, never from the brand",
    },
    status: "live",
    statusLabel: null,
    website: "https://sytium.tech",
    hasOfficialLogo: true,
    solutionId: "sytium",
    positioning: {
      fr: "Un référentiel unique pour piloter l'organisation : comptabilité, paie, commercial et projets partagent la même base.",
      en: "One source of truth to run the organisation: accounting, payroll, sales and projects share a single database.",
    },
    order: 3,
  },
  {
    id: "sydicard",
    name: "SydiCard",
    role: {
      fr: "FinTech — paiements et reversements créateurs",
      en: "FinTech — payments and creator payouts",
    },
    universe: {
      fr: "Noir absolu, wordmark blanc, point turquoise — l'extension financière de l'univers Sydica",
      en: "Absolute black, white wordmark, turquoise dot — the financial extension of the Sydica universe",
    },
    status: "in_development",
    statusLabel: { fr: "En développement", en: "In development" },
    website: null,
    hasOfficialLogo: true,
    solutionId: "fintech",
    positioning: {
      fr: "Porter les revenus jusqu'au créateur, en monnaie locale, sur les moyens de paiement qu'il utilise déjà.",
      en: "Carrying revenue through to the creator, in local currency, on the payment rails they already use.",
    },
    order: 4,
  },
  {
    id: "kultix",
    name: "KultiX",
    role: {
      fr: "EventTech — billetterie, contrôle d'accès, expérience live",
      en: "EventTech — ticketing, access control, live experience",
    },
    universe: {
      fr: "Live premium — violet vif sur noir, jamais les codes du festival",
      en: "Premium live — vivid violet on black, never festival clichés",
    },
    status: "live",
    statusLabel: null,
    website: "https://kultix.art",
    hasOfficialLogo: true,
    solutionId: "kultix",
    positioning: {
      fr: "De la mise en vente au contrôle à l'entrée, un événement tenu de bout en bout.",
      en: "From on-sale to the gate, an event held end to end.",
    },
    order: 5,
  },
  {
    id: "syitex",
    name: "SyitEx",
    role: {
      fr: "Intelligence décisionnelle appliquée à l'économie culturelle",
      en: "Decision intelligence for the cultural economy",
    },
    universe: {
      fr: "Data et prédiction — évaluation, valorisation et prévision du potentiel économique",
      en: "Data and prediction — assessing, valuing and forecasting economic potential",
    },
    status: "live",
    statusLabel: null,
    website: null,
    hasOfficialLogo: false,
    solutionId: null,
    positioning: {
      fr: "Transformer les données de streaming, d'audience, de billetterie et de médias en indicateurs comparables, agrégés par l'Artist Value Index.",
      en: "Turning streaming, audience, ticketing and media data into comparable indicators, aggregated by the Artist Value Index.",
    },
    order: 6,
  },
  {
    id: "rd",
    name: "Syitech R&D",
    role: {
      fr: "Recherche appliquée — IA, blockchain, IoT, données, prototypage",
      en: "Applied research — AI, blockchain, IoT, data, prototyping",
    },
    universe: {
      fr: "DeepTech · expérimental",
      en: "DeepTech · experimental",
    },
    status: "live",
    statusLabel: null,
    website: null,
    hasOfficialLogo: false,
    solutionId: null,
    positioning: {
      fr: "Là où Syitech construit demain : les briques technologiques sont éprouvées ici avant d'entrer dans une marque.",
      en: "Where Syitech builds tomorrow: technology is proven here before it enters a brand.",
    },
    order: 7,
  },
]

export function brandById(id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id)
}

/** The brand carrying a given solution, when the solution has one. */
export function brandForSolution(solutionId: string): Brand | undefined {
  return brands.find((brand) => brand.solutionId === solutionId)
}

/**
 * The order the scroll journey moves through, from the Group and back to it.
 * Declared in design-system/brands.json §scrollJourney.
 */
export const scrollJourney: BrandId[] = ["group", "sydica", "sytium", "sydicard", "kultix", "syitex", "rd"]

export function brandLabel(brand: Brand, locale: Locale): string {
  return brand.role[locale]
}
