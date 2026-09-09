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
  {
    // Confirmed publishable by Syitech Group on 2026-09-09, and corroborated by
    // the official timeline: "2019 — Contrat stratégique avec le BURIDA".
    // The relationship is published as text; the logo is NOT, because using
    // BURIDA's mark needs BURIDA's own written approval, which we do not have.
    id: "burida",
    partnerName: "BURIDA",
    category: "culture_music",
    relationshipType: "Strategic Partner",
    description: {
      fr: "Contrat stratégique noué en 2019, dans le prolongement des premières solutions de distribution culturelle du Groupe.",
      en: "Strategic contract signed in 2019, extending the Group's first cultural distribution solutions.",
    },
    startDate: "2019-01-01",
    endDate: null,
    showAfterEnd: false,
    website: null,
    contractReference: null,
    logoUsageApproved: false,
    legalValidatedBy: "Syitech Group — confirmation du 2026-09-09",
    isPublic: true,
    featured: true,
  },
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
