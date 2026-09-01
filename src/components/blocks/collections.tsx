import Link from "next/link"
import { StatsRow } from "@/components/ui/stats"
import { Arrow, Badge, ButtonLink, Section, SectionHeader } from "@/components/ui/primitives"
import type { Dictionary } from "@/content/dictionaries"
import { getKpis, getPartners } from "@/lib/content/queries"
import type { Locale } from "@/lib/i18n/routes"
import { formatDate } from "@/lib/utils/format"
import type { CaseStudy, NewsItem, Partner } from "@/types/content"

export function CaseStudyCard({
  study,
  locale,
  href,
  t,
  featured = false,
}: {
  study: CaseStudy
  locale: Locale
  href: string
  t: Dictionary
  featured?: boolean
}) {
  return (
    <Link
      href={href}
      className={
        "group flex h-full flex-col gap-4 rounded-lg border border-line bg-raised p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md md:p-8 " +
        (featured ? "lg:col-span-2" : "")
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">{t.labels.caseStudy}</Badge>
        <span className="type-overline text-faint">{formatDate(study.date, locale)}</span>
      </div>
      <h3 className={featured ? "type-h2 max-w-[16ch]" : "type-h3"}>{study.title[locale]}</h3>
      <p className="measure text-sm text-muted">{study.summary[locale]}</p>
      <span className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium">
        {t.cta.discoverProject}
        <Arrow />
      </span>
    </Link>
  )
}

/** A single publishable case study becomes a feature rather than a grid with holes. */
export function WorkGrid({
  studies,
  locale,
  t,
  hrefFor,
}: {
  studies: CaseStudy[]
  locale: Locale
  t: Dictionary
  hrefFor: (study: CaseStudy) => string
}) {
  if (studies.length === 0) return null
  return (
    <ul className="grid gap-6 lg:grid-cols-2">
      {studies.map((study) => (
        <li key={study.id} className={studies.length === 1 ? "lg:col-span-2" : ""}>
          <CaseStudyCard
            study={study}
            locale={locale}
            t={t}
            href={hrefFor(study)}
            featured={studies.length === 1}
          />
        </li>
      ))}
    </ul>
  )
}

/**
 * Impact dashboard. Categories with no cleared indicator are not rendered,
 * and the whole section disappears if nothing is publishable.
 */
export function ImpactDashboard({
  groups,
  locale,
  t,
}: {
  groups: { category: string; label: string; keys: string[] }[]
  locale: Locale
  t: Dictionary
}) {
  const populated = groups.filter((group) => getKpis(group.keys).length > 0)
  if (populated.length === 0) return null

  return (
    <div className="flex flex-col gap-14">
      {populated.map((group) => (
        <div key={group.category} className="flex flex-col gap-6">
          <h3 className="type-overline text-accent-ink">{group.label}</h3>
          <StatsRow
            keys={group.keys}
            locale={locale}
            labels={{ source: t.labels.source, period: t.labels.period }}
          />
        </div>
      ))}
    </div>
  )
}

const categoryLabels: Record<Partner["category"], { fr: string; en: string }> = {
  culture_music: { fr: "Culture & Musique", en: "Culture & Music" },
  finance_payments: { fr: "Finance & Paiements", en: "Finance & Payments" },
  institutions_social: { fr: "Institutions & Impact social", en: "Institutions & Social Impact" },
  technology_innovation: { fr: "Technologie & Innovation", en: "Technology & Innovation" },
  research_education: { fr: "Recherche & Éducation", en: "Research & Education" },
  international_ecosystem: { fr: "Écosystème international", en: "International Ecosystem" },
}

export function partnerCategoryLabel(category: Partner["category"], locale: Locale) {
  return categoryLabels[category][locale]
}

/**
 * Partner wall. A partner only exists here once Legal has recorded the exact
 * relationship type — which is always displayed, never hidden behind a logo.
 */
export function PartnerWall({ locale, order }: { locale: Locale; order: Partner["category"][] }) {
  const published = getPartners()
  if (published.length === 0) return null

  return (
    <div className="flex flex-col gap-12">
      {order.map((category) => {
        const inCategory = published.filter((partner) => partner.category === category)
        if (inCategory.length === 0) return null
        return (
          <div key={category} className="flex flex-col gap-5">
            <h3 className="type-overline text-faint">{partnerCategoryLabel(category, locale)}</h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inCategory.map((partner) => (
                <li key={partner.id} className="flex flex-col gap-2 rounded-lg border border-line bg-raised p-5">
                  <span className="type-h4">{partner.partnerName}</span>
                  <span className="type-overline text-data">{partner.relationshipType}</span>
                  {partner.description ? (
                    <span className="text-sm text-muted">{partner.description[locale]}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export function NewsTeaser({
  items,
  locale,
  t,
  hrefFor,
}: {
  items: NewsItem[]
  locale: Locale
  t: Dictionary
  hrefFor: (item: NewsItem) => string
}) {
  if (items.length === 0) return null
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={hrefFor(item)}
            className="flex h-full flex-col gap-3 rounded-lg border border-line bg-raised p-6 transition-colors hover:border-line-strong"
          >
            <span className="type-overline text-accent-ink">{item.category}</span>
            <span className="type-h4">{item.title[locale]}</span>
            <span className="text-sm text-muted">{item.excerpt[locale]}</span>
            <span className="type-overline mt-auto pt-4 text-faint">
              {formatDate(item.publishedAt, locale)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function CollectionSection({
  eyebrow,
  title,
  action,
  children,
  tone = "page",
}: {
  eyebrow: string
  title: string
  action?: { label: string; href: string }
  children: React.ReactNode
  tone?: "page" | "surface" | "ink"
}) {
  return (
    <Section tone={tone}>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        action={
          action ? (
            <ButtonLink href={action.href} variant="secondary">
              {action.label}
            </ButtonLink>
          ) : undefined
        }
      />
      <div className="mt-14">{children}</div>
    </Section>
  )
}
