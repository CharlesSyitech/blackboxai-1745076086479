import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Arrow, Badge, Section, SectionHeader } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { technologies } from "@/content/technologies"
import { getSolutionsForTechnology, getTechnologyBySlug } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, locales, path } from "@/lib/i18n/routes"

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    technologies.map((technology) => ({ locale, slug: technology.slug[locale] })),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const technology = getTechnologyBySlug(locale, slug)
  if (!technology) return {}
  return buildMetadata({
    locale,
    title: technology.name[locale],
    description: technology.short[locale],
    routeKeys: ["technology"],
    slug: technology.slug,
  })
}

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const technology = getTechnologyBySlug(locale, slug)
  if (!technology) notFound()

  const t = getDictionary(locale)
  const solutions = getSolutionsForTechnology(technology.id)
  const maturityLabel = {
    production: locale === "fr" ? "En production" : "In production",
    pilot: locale === "fr" ? "Pilote" : "Pilot",
    research: locale === "fr" ? "Recherche" : "Research",
  }[technology.maturity]

  return (
    <>
      <PageHero
        eyebrow={t.labels.technology}
        title={technology.name[locale]}
        intro={technology.description[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.technology, href: path(locale, "technology") },
          { label: technology.name[locale], href: path(locale, "technology", technology.slug[locale]) },
        ]}
        aside={<Badge tone="data">{maturityLabel}</Badge>}
      />

      <Section>
        <SectionHeader title={t.labels.ourApproach} />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {technology.applications.map((application) => (
            <li key={application.title[locale]} className="flex flex-col gap-3 rounded-lg border border-line bg-page p-7">
              <span className="type-overline text-accent-ink">
                {application.context === "business"
                  ? locale === "fr" ? "Entreprise" : "Business"
                  : application.context === "culture"
                    ? locale === "fr" ? "Culture" : "Culture"
                    : locale === "fr" ? "Opérations" : "Operations"}
              </span>
              <span className="type-h4">{application.title[locale]}</span>
              <span className="text-sm text-muted">{application.body[locale]}</span>
            </li>
          ))}
        </ul>
      </Section>

      {solutions.length > 0 ? (
        <Section tone="surface">
          <SectionHeader eyebrow={t.labels.appliedTo} title={t.labels.ourSolutions} />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution) => (
              <li key={solution.id}>
                <Link
                  href={path(locale, "solutions", solution.slug[locale])}
                  className="group flex h-full flex-col gap-3 rounded-lg border border-line bg-raised p-6 transition-colors hover:border-line-strong"
                >
                  <span className="font-display text-lg font-bold">{solution.name}</span>
                  <span className="text-sm text-muted">{solution.positioning[locale]}</span>
                  <span className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium">
                    {t.cta.learnMore}
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  )
}
