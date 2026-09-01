import { caseStudies } from "@/content/case-studies"
import { awards, countries, jobs, news, patents, people } from "@/content/corporate"
import { expertises } from "@/content/expertises"
import { kpis } from "@/content/kpis"
import { partners } from "@/content/partners"
import { solutions } from "@/content/solutions"
import { technologies } from "@/content/technologies"
import type { Locale } from "@/lib/i18n/routes"
import type { CaseStudy, Kpi, Partner, Solution } from "@/types/content"

/**
 * Publication gate.
 *
 * Everything the site renders passes through this module. Filtering happens
 * here — on the server — so that unvalidated figures and unqualified partner
 * relationships never reach the client payload at all.
 */

/** A KPI is publishable only when cleared AND actually carrying a value. */
export function isPublishableKpi(kpi: Kpi): boolean {
  return kpi.isPublic && kpi.value !== null && kpi.period !== null && kpi.source !== null
}

export function getKpis(keys: string[]): Kpi[] {
  return keys
    .map((key) => kpis.find((kpi) => kpi.key === key))
    .filter((kpi): kpi is Kpi => kpi !== undefined && isPublishableKpi(kpi))
}

/** A partner is publishable only with an explicit relationship and written approvals. */
export function isPublishablePartner(partner: Partner): boolean {
  if (!partner.isPublic) return false
  if (partner.relationshipType === null) return false
  if (!partner.logoUsageApproved) return false
  if (partner.legalValidatedBy === null) return false
  const contractRequired: Partner["relationshipType"][] = [
    "Strategic Partner",
    "Institutional Partner",
    "Financial Partner",
  ]
  if (contractRequired.includes(partner.relationshipType) && !partner.contractReference) return false
  if (partner.endDate && new Date(partner.endDate) < new Date() && !partner.showAfterEnd) return false
  return true
}

export function getPartners() {
  return partners.filter(isPublishablePartner)
}

export function getPartnersByCategory(category: Partner["category"]) {
  return getPartners().filter((partner) => partner.category === category)
}

export function getCaseStudies(sector?: CaseStudy["sector"]) {
  return caseStudies
    .filter((study) => study.disclosureLevel === "public" && study.clientApprovalRef !== null)
    .filter((study) => (sector ? study.sector === sector : true))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getCaseStudyBySlug(locale: Locale, slug: string) {
  return getCaseStudies().find((study) => study.slug[locale] === slug)
}

/** Sectors with nothing publishable are not offered as filters. */
export function getAvailableSectors(): CaseStudy["sector"][] {
  const available = new Set(getCaseStudies().map((study) => study.sector))
  return Array.from(available)
}

export function getSolutions() {
  return [...solutions].sort((a, b) => a.order - b.order)
}

export function getSolutionBySlug(locale: Locale, slug: string) {
  return solutions.find((solution) => solution.slug[locale] === slug)
}

export function getSolutionsByIds(ids: string[]): Solution[] {
  return ids
    .map((id) => solutions.find((solution) => solution.id === id))
    .filter((solution): solution is Solution => solution !== undefined)
}

export function getExpertises() {
  return [...expertises].sort((a, b) => a.order - b.order)
}

export function getExpertiseBySlug(locale: Locale, slug: string) {
  return expertises.find((expertise) => expertise.slug[locale] === slug)
}

export function getTechnologies() {
  return technologies
}

export function getTechnologyBySlug(locale: Locale, slug: string) {
  return technologies.find((technology) => technology.slug[locale] === slug)
}

export function getTechnologiesByIds(ids: string[]) {
  return ids
    .map((id) => technologies.find((technology) => technology.id === id))
    .filter((technology): technology is (typeof technologies)[number] => technology !== undefined)
}

export function getCaseStudiesForSolution(solutionId: string) {
  return getCaseStudies().filter((study) => study.solutions.includes(solutionId))
}

export function getCaseStudiesForExpertise(expertiseId: string) {
  return getCaseStudies().filter((study) => study.expertise === expertiseId)
}

export function getSolutionsForTechnology(technologyId: string) {
  return getSolutions().filter((solution) => solution.technologies.includes(technologyId as never))
}

export function getNews() {
  return news.filter((item) => item.isPublished).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function getNewsBySlug(locale: Locale, slug: string) {
  return getNews().find((item) => item.slug[locale] === slug)
}

export function getJobs() {
  return jobs.filter((job) => job.isOpen)
}

export function getJobBySlug(locale: Locale, slug: string) {
  return getJobs().find((job) => job.slug[locale] === slug)
}

export function getPeople() {
  return people.filter((person) => person.isPublic && person.imageRightsApproved)
}

export function getAwards() {
  return awards.filter((award) => award.isPublic && award.proofUrl !== null)
}

/** Only granted patents are ever counted as "patents". */
export function getPatents(status?: "filed" | "pending" | "granted") {
  return patents.filter((patent) => patent.isPublic && (status ? patent.status === status : true))
}

export function getCountries() {
  return countries.filter((country) => {
    if (!country.isPublic) return false
    const needsEntity = country.presenceType === "headquarters" || country.presenceType === "operations"
    return needsEntity ? country.entityName !== null : true
  })
}
