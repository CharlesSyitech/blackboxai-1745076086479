import type { Partner } from "@/types/content"

/**
 * GOVERNANCE — absolute rule.
 * A logo does not qualify a relationship. Every partner stays `isPublic: false`
 * until Legal has recorded the exact `relationshipType`, a contract reference
 * and written logo-usage approval. Nothing below is presumed.
 *
 * Publication requires, at minimum:
 *   relationshipType !== null && logoUsageApproved && legalValidatedBy !== null
 * Strategic / Institutional / Financial additionally require contractReference.
 */
const pending = (
  id: string,
  partnerName: string,
  category: Partner["category"],
): Partner => ({
  id,
  partnerName,
  category,
  relationshipType: null,
  description: null,
  startDate: null,
  endDate: null,
  showAfterEnd: false,
  website: null,
  contractReference: null,
  logoUsageApproved: false,
  legalValidatedBy: null,
  isPublic: false,
  featured: false,
})

export const partners: Partner[] = [
  pending("universal-music-africa", "Universal Music Africa", "culture_music"),
  pending("burida", "BURIDA", "culture_music"),
  pending("bbda", "BBDA", "culture_music"),
  pending("visa", "Visa", "finance_payments"),
  pending("onafriq", "Onafriq", "finance_payments"),
  pending("gtp", "GTP", "finance_payments"),
  pending("cnps", "CNPS", "institutions_social"),
  pending("brvm", "BRVM", "institutions_social"),
]

export const partnerCategoryOrder: Partner["category"][] = [
  "culture_music",
  "finance_payments",
  "institutions_social",
  "technology_innovation",
  "research_education",
  "international_ecosystem",
]
