import type { Locale } from "@/lib/i18n/routes"

export type I18n<T = string> = Record<Locale, T>
export type I18nList = I18n<string[]>

/** Governance: a figure is never a literal in a component. */
export interface Kpi {
  key: string
  value: number | null
  unit: "number" | "percent" | "currency" | "count" | "plus"
  displayFormat: "raw" | "compact" | "rounded"
  label: I18n
  category: "culture" | "technology" | "enterprise" | "economic" | "social" | "corporate"
  period: string | null
  source: I18n | null
  lastUpdated: string | null
  /** Defaults to false. Nothing reaches the client until legal has cleared it. */
  isPublic: boolean
  approvedBy?: string
}

export type RelationshipType =
  | "Strategic Partner"
  | "Institutional Partner"
  | "Technology Partner"
  | "Content Partner"
  | "Financial Partner"
  | "Client"
  | "Supplier"
  | "POC"
  | "Collaboration"
  | "Program"
  | "Research Partner"

export type PartnerCategory =
  | "culture_music"
  | "finance_payments"
  | "institutions_social"
  | "technology_innovation"
  | "research_education"
  | "international_ecosystem"

export interface Partner {
  id: string
  partnerName: string
  category: PartnerCategory
  /** Never inferred from a logo. Empty until legal qualifies the relationship. */
  relationshipType: RelationshipType | null
  description: I18n | null
  startDate: string | null
  endDate: string | null
  showAfterEnd: boolean
  website: string | null
  contractReference: string | null
  logoUsageApproved: boolean
  legalValidatedBy: string | null
  isPublic: boolean
  featured: boolean
}

export type TechnologyId = "ai" | "blockchain" | "data" | "iot" | "cloud" | "security"

export interface Technology {
  id: TechnologyId
  slug: I18n
  name: I18n
  short: I18n
  description: I18n
  applications: { context: "business" | "culture" | "operations"; title: I18n; body: I18n }[]
  maturity: "production" | "pilot" | "research"
}

export interface Expertise {
  id: string
  slug: I18n
  name: I18n
  tagline: I18n
  challenge: I18n
  capabilities: I18n<string[]>
  technologies: TechnologyId[]
  solutions: string[]
  order: number
}

export type Maturity = "live" | "beta" | "roadmap"

export interface FunctionalUniverse {
  key: string
  title: I18n
  description: I18n
  features: I18nList
  maturity: Maturity
}

export interface Solution {
  id: string
  slug: I18n
  name: string
  vertical: string
  accent: "navy" | "amber" | "teal" | "neutral"
  positioning: I18n
  tagline: I18n
  problem: I18nList
  answer: I18nList
  universes: FunctionalUniverse[]
  useCases: { sector: I18n; body: I18n }[]
  technologies: TechnologyId[]
  expertise: string
  kpis: string[]
  regulatoryStatus: "not_applicable" | "technology_only" | "partner_operated" | "licensed"
  licenseReference: string | null
  ctaPrimary: I18n
  ctaSecondary: I18n | null
  order: number
  featuredOnHome: boolean
}

export interface CaseStudy {
  id: string
  slug: I18n
  title: I18n
  client: I18n
  sector: "culture" | "enterprise" | "events" | "public" | "technology" | "iot"
  date: string
  location: I18n
  summary: I18n
  challenge: I18n
  solution: I18n
  implementation: I18n
  impact: I18n
  disciplines: I18nList
  technologies: TechnologyId[]
  solutions: string[]
  expertise: string
  results: string[]
  disclosureLevel: "public" | "client_approved" | "internal"
  clientApprovalRef: string | null
  featured: boolean
}

export interface NewsItem {
  id: string
  slug: I18n
  category: "corporate" | "innovation" | "partnerships" | "events" | "research" | "products" | "press" | "insights"
  title: I18n
  excerpt: I18n
  body: I18nList
  publishedAt: string
  isPublished: boolean
}

export interface Job {
  id: string
  slug: I18n
  title: I18n
  department: I18n
  location: I18n
  contractType: I18n
  experience: I18n
  description: I18n
  requirements: I18nList
  validThrough: string
  isOpen: boolean
}

export interface Person {
  id: string
  name: string
  role: I18n
  governanceLevel: "executive" | "leadership" | "business"
  bio: I18n
  linkedin: string | null
  imageRightsApproved: boolean
  isPublic: boolean
}

export interface Award {
  id: string
  name: I18n
  organization: string
  year: number
  proofUrl: string | null
  isPublic: boolean
}

export interface Patent {
  id: string
  title: I18n
  status: "filed" | "pending" | "granted"
  office: string | null
  filingDate: string | null
  applicationNumber: string | null
  grantDate: string | null
  patentNumber: string | null
  isPublic: boolean
}

export interface CountryPresence {
  id: string
  name: I18n
  isoCode: string
  presenceType: "headquarters" | "operations" | "market" | "distribution" | "development"
  entityName: string | null
  isPublic: boolean
}

export interface TimelineEntry {
  year: string
  title: I18n
  body: I18n
}
