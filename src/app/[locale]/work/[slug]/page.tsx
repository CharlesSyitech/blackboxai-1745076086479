import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Arrow, Section } from "@/components/ui/primitives"
import { StatsRow } from "@/components/ui/stats"
import { getDictionary } from "@/content/dictionaries"
import { caseStudies } from "@/content/case-studies"
import {
  getCaseStudyBySlug,
  getKpis,
  getSolutionsByIds,
  getTechnologiesByIds,
} from "@/lib/content/queries"
import { JsonLd, eventJsonLd } from "@/lib/seo/json-ld"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, locales, path } from "@/lib/i18n/routes"
import { formatDate } from "@/lib/utils/format"

export function generateStaticParams() {
  return locales.flatMap((locale) => caseStudies.map((study) => ({ locale, slug: study.slug[locale] })))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const study = getCaseStudyBySlug(locale, slug)
  if (!study) return {}
  return buildMetadata({
    locale,
    title: study.title[locale],
    description: study.summary[locale],
    routeKeys: ["work"],
    slug: study.slug,
  })
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const study = getCaseStudyBySlug(locale, slug)
  if (!study) notFound()

  const t = getDictionary(locale)
  const technologies = getTechnologiesByIds(study.technologies)
  const solutions = getSolutionsByIds(study.solutions)

  const sections = [
    { key: "challenge", title: t.labels.challenge, body: study.challenge[locale] },
    { key: "solution", title: t.labels.theSolution, body: study.solution[locale] },
    { key: "implementation", title: t.labels.implementation, body: study.implementation[locale] },
    { key: "impact", title: t.labels.impact, body: study.impact[locale] },
  ]

  return (
    <>
      {study.sector === "events" ? <JsonLd data={eventJsonLd(study, locale)} /> : null}

      <PageHero
        tone="ink"
        eyebrow={`${t.labels.caseStudy} · ${formatDate(study.date, locale)}`}
        title={study.title[locale]}
        intro={study.summary[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.work, href: path(locale, "work") },
          { label: study.title[locale], href: path(locale, "work", study.slug[locale]) },
        ]}
        aside={
          <ul className="flex flex-wrap gap-2">
            {study.disciplines[locale].map((discipline) => (
              <li key={discipline} className="type-overline rounded-sm border border-line px-2.5 py-1 text-muted">
                {discipline}
              </li>
            ))}
          </ul>
        }
      />

      <Section padding="tight">
        <dl className="grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-1 border-t border-line pt-5">
            <dt className="type-overline text-faint">{t.labels.date}</dt>
            <dd className="type-h4">{formatDate(study.date, locale)}</dd>
          </div>
          <div className="flex flex-col gap-1 border-t border-line pt-5">
            <dt className="type-overline text-faint">{t.labels.location}</dt>
            <dd className="type-h4">{study.location[locale]}</dd>
          </div>
          <div className="flex flex-col gap-1 border-t border-line pt-5">
            <dt className="type-overline text-faint">{t.labels.sector}</dt>
            <dd className="type-h4">{study.client[locale]}</dd>
          </div>
        </dl>
      </Section>

      {sections.map((section, index) => (
        <Section key={section.key} tone={index % 2 === 0 ? "surface" : "page"}>
          <div className="grid gap-8 lg:grid-cols-[0.5fr_1.5fr] lg:gap-20">
            <h2 className="type-h2">{section.title}</h2>
            <p className="type-body-lg measure text-muted">{section.body}</p>
          </div>
        </Section>
      ))}

      {getKpis(study.results).length > 0 ? (
        <Section padding="tight">
          <h2 className="type-h3 mb-10">{t.labels.results}</h2>
          <StatsRow
            keys={study.results}
            locale={locale}
            labels={{ source: t.labels.source, period: t.labels.period }}
          />
        </Section>
      ) : null}

      {(technologies.length > 0 || solutions.length > 0) && (
        <Section tone="surface">
          <div className="grid gap-12 md:grid-cols-2">
            {solutions.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h2 className="type-overline text-faint">{t.labels.solutions}</h2>
                <ul className="flex flex-col gap-2">
                  {solutions.map((solution) => (
                    <li key={solution.id}>
                      <Link
                        href={path(locale, "solutions", solution.slug[locale])}
                        className="group inline-flex items-center gap-2 type-h4"
                      >
                        {solution.name}
                        <Arrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {technologies.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h2 className="type-overline text-faint">{t.labels.technologies}</h2>
                <ul className="flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <li key={technology.id}>
                      <Link
                        href={path(locale, "technology", technology.slug[locale])}
                        className="type-overline inline-flex rounded-sm border border-line px-3 py-1.5 text-muted transition-colors hover:text-ink"
                      >
                        {technology.name[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Section>
      )}
    </>
  )
}
