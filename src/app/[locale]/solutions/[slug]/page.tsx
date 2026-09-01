import Link from "next/link"
import { notFound } from "next/navigation"
import { WorkGrid } from "@/components/blocks/collections"
import { ProcessFlow } from "@/components/graphics/process-flow"
import { PageHero } from "@/components/layout/page-hero"
import { Arrow, Badge, ButtonLink, Section, SectionHeader } from "@/components/ui/primitives"
import { StatsRow } from "@/components/ui/stats"
import { getDictionary } from "@/content/dictionaries"
import { site } from "@/content/site"
import { solutions } from "@/content/solutions"
import {
  getCaseStudiesForSolution,
  getExpertises,
  getKpis,
  getSolutionBySlug,
  getTechnologiesByIds,
} from "@/lib/content/queries"
import { JsonLd, softwareApplicationJsonLd } from "@/lib/seo/json-ld"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, locales, path } from "@/lib/i18n/routes"

export function generateStaticParams() {
  return locales.flatMap((locale) => solutions.map((solution) => ({ locale, slug: solution.slug[locale] })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const solution = getSolutionBySlug(locale, slug)
  if (!solution) return {}
  return buildMetadata({
    locale,
    title: `${solution.name} — ${solution.positioning[locale]}`,
    description: solution.tagline[locale],
    routeKeys: ["solutions"],
    slug: solution.slug,
  })
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const solution = getSolutionBySlug(locale, slug)
  if (!solution) notFound()

  const t = getDictionary(locale)
  const technologies = getTechnologiesByIds(solution.technologies)
  const expertise = getExpertises().find((item) => item.id === solution.expertise)
  const studies = getCaseStudiesForSolution(solution.id)
  const showRegulatory = solution.regulatoryStatus !== "not_applicable"

  return (
    <>
      <JsonLd data={softwareApplicationJsonLd(solution, locale)} />

      <PageHero
        eyebrow={`${solution.vertical} · ${t.labels.aSyitechSolution}`}
        title={solution.positioning[locale]}
        intro={solution.tagline[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.solutions, href: path(locale, "solutions") },
          { label: solution.name, href: path(locale, "solutions", solution.slug[locale]) },
        ]}
        aside={
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={path(locale, "contact")} variant="accent">
              {solution.ctaPrimary[locale]}
            </ButtonLink>
            {solution.universes.length > 1 ? (
              <ButtonLink href="#modules" variant="secondary">
                {t.labels.modules}
              </ButtonLink>
            ) : null}
          </div>
        }
      />

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-5">
            <h2 className="type-h3">{t.labels.problem}</h2>
            <ul className="flex flex-col gap-4">
              {solution.problem[locale].map((item) => (
                <li key={item} className="border-l-2 border-line pl-5 text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="type-h3">{t.labels.answer}</h2>
            <ul className="flex flex-col gap-4">
              {solution.answer[locale].map((item) => (
                <li key={item} className="border-l-2 border-accent pl-5 text-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="modules">
        <SectionHeader title={t.labels.modules} />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {solution.universes.map((universe) => (
            <li key={universe.key} className="flex flex-col gap-4 rounded-lg border border-line bg-page p-7 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="type-h4">{universe.title[locale]}</h3>
                {universe.maturity === "beta" ? <Badge>{t.labels.maturityBeta}</Badge> : null}
                {universe.maturity === "roadmap" ? <Badge tone="warn">{t.labels.maturityRoadmap}</Badge> : null}
              </div>
              <p className="text-sm text-muted">{universe.description[locale]}</p>
              <ul className="flex flex-wrap gap-x-2 gap-y-2 pt-1">
                {universe.features[locale].map((feature) => (
                  <li
                    key={feature}
                    className="rounded-sm border border-line-soft px-2.5 py-1 text-[0.78rem] text-muted"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      {solution.id === "kultix" ? (
        <Section tone="surface">
          <SectionHeader title={locale === "fr" ? "Le parcours organisateur" : "The organiser journey"} />
          <div className="mt-12">
            <ProcessFlow
              steps={solution.universes.map((universe) => ({
                key: universe.key,
                label: universe.title[locale],
                hint: universe.description[locale],
              }))}
            />
          </div>
        </Section>
      ) : null}

      {showRegulatory ? (
        <Section tone="ink" padding="tight">
          <div className="flex flex-col gap-3">
            <span className="type-overline text-warn">{t.labels.regulatoryNotice}</span>
            <p className="max-w-4xl text-sm leading-relaxed text-muted">{site.regulatoryDisclaimer[locale]}</p>
          </div>
        </Section>
      ) : null}

      {getKpis(solution.kpis).length > 0 ? (
        <Section padding="tight">
          <StatsRow
            keys={solution.kpis}
            locale={locale}
            labels={{ source: t.labels.source, period: t.labels.period }}
          />
        </Section>
      ) : null}

      <Section tone="surface">
        <SectionHeader title={t.labels.useCases} />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {solution.useCases.map((useCase) => (
            <li key={useCase.sector[locale]} className="flex flex-col gap-3 rounded-lg border border-line bg-raised p-6">
              <span className="type-h4">{useCase.sector[locale]}</span>
              <span className="text-sm text-muted">{useCase.body[locale]}</span>
            </li>
          ))}
        </ul>
      </Section>

      {technologies.length > 0 ? (
        <Section>
          <SectionHeader eyebrow={t.labels.technologies} title={t.home.engineTitle} />
          <ul className="mt-12 flex flex-wrap gap-3">
            {technologies.map((technology) => (
              <li key={technology.id}>
                <Link
                  href={path(locale, "technology", technology.slug[locale])}
                  className="inline-flex flex-col gap-1 rounded-md border border-line px-5 py-4 transition-colors hover:border-line-strong"
                >
                  <span className="type-overline text-accent-ink">{technology.name[locale]}</span>
                  <span className="text-sm text-muted">{technology.short[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
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

      <Section padding="tight">
        <div className="flex flex-col gap-4 rounded-lg border border-line p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="type-overline text-faint">{t.labels.aSyitechSolution}</span>
            <p className="measure text-sm text-muted">{site.description[locale]}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            {expertise ? (
              <Link
                href={path(locale, "expertise", expertise.slug[locale])}
                className="group inline-flex items-center gap-2 text-sm font-medium"
              >
                {expertise.name[locale]}
                <Arrow />
              </Link>
            ) : null}
          </div>
        </div>
      </Section>
    </>
  )
}
