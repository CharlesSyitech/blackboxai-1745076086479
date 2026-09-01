import Link from "next/link"
import { notFound } from "next/navigation"
import { WorkGrid } from "@/components/blocks/collections"
import { PageHero } from "@/components/layout/page-hero"
import { Arrow, Section, SectionHeader } from "@/components/ui/primitives"
import { StatsRow } from "@/components/ui/stats"
import { getDictionary } from "@/content/dictionaries"
import { expertises } from "@/content/expertises"
import {
  getCaseStudiesForExpertise,
  getExpertiseBySlug,
  getKpis,
  getSolutionsByIds,
  getTechnologiesByIds,
} from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, locales, path } from "@/lib/i18n/routes"

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    expertises.map((expertise) => ({ locale, slug: expertise.slug[locale] })),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const expertise = getExpertiseBySlug(locale, slug)
  if (!expertise) return {}
  return buildMetadata({
    locale,
    title: expertise.name[locale],
    description: expertise.tagline[locale],
    routeKeys: ["expertise"],
    slug: expertise.slug,
  })
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const expertise = getExpertiseBySlug(locale, slug)
  if (!expertise) notFound()

  const t = getDictionary(locale)
  const technologies = getTechnologiesByIds(expertise.technologies)
  const solutions = getSolutionsByIds(expertise.solutions)
  const studies = getCaseStudiesForExpertise(expertise.id)
  const kpiKeys = solutions.flatMap((solution) => solution.kpis)

  return (
    <>
      <PageHero
        eyebrow={t.labels.expertise}
        title={expertise.name[locale]}
        intro={expertise.tagline[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.expertise, href: path(locale, "expertise") },
          { label: expertise.name[locale], href: path(locale, "expertise", expertise.slug[locale]) },
        ]}
      />

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
          <h2 className="type-h2">{t.labels.theIssue}</h2>
          <p className="type-body-lg measure text-muted">{expertise.challenge[locale]}</p>
        </div>
      </Section>

      <Section>
        <SectionHeader title={t.labels.capabilities} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.capabilities[locale].map((capability) => (
            <li key={capability} className="rounded-lg border border-line bg-page p-6 text-[0.95rem]">
              {capability}
            </li>
          ))}
        </ul>
      </Section>

      {technologies.length > 0 ? (
        <Section tone="ink" padding="standard">
          <SectionHeader eyebrow={t.labels.technologies} title={t.home.engineTitle} />
          <ul className="mt-12 flex flex-wrap gap-3">
            {technologies.map((technology) => (
              <li key={technology.id}>
                <Link
                  href={path(locale, "technology", technology.slug[locale])}
                  className="group inline-flex flex-col gap-1 rounded-md border border-line px-5 py-4 transition-colors hover:border-accent"
                >
                  <span className="type-overline text-accent">{technology.name[locale]}</span>
                  <span className="text-sm text-muted">{technology.short[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {solutions.length > 0 ? (
        <Section>
          <SectionHeader title={t.labels.ourSolutions} />
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution) => (
              <li key={solution.id}>
                <Link
                  href={path(locale, "solutions", solution.slug[locale])}
                  className="group flex h-full flex-col gap-3 rounded-lg border border-line p-6 transition-colors hover:border-line-strong"
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

      {getKpis(kpiKeys).length > 0 ? (
        <Section tone="surface" padding="tight">
          <StatsRow keys={kpiKeys} locale={locale} labels={{ source: t.labels.source, period: t.labels.period }} />
        </Section>
      ) : null}

      {studies.length > 0 ? (
        <Section tone="surface">
          <SectionHeader title={t.labels.relatedWork} />
          <div className="mt-12">
            <WorkGrid
              studies={studies}
              locale={locale}
              t={t}
              hrefFor={(study) => path(locale, "work", study.slug[locale])}
            />
          </div>
        </Section>
      ) : null}
    </>
  )
}
