import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { TechnologyEngine } from "@/components/graphics/technology-engine"
import { Section, SectionHeader } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { getExpertises, getPatents, getSolutions, getTechnologies } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({
    locale,
    title: t.nav.technology,
    description: t.home.engineBody,
    routeKeys: ["technology"],
  })
}

export default async function TechnologyIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const technologies = getTechnologies()
  const solutions = getSolutions()
  const rd = getExpertises().find((expertise) => expertise.id === "research-development")
  const granted = getPatents("granted")
  const pending = getPatents("pending")
  const filed = getPatents("filed")

  return (
    <>
      <PageHero
        eyebrow={t.home.engineEyebrow}
        title={t.home.engineTitle}
        intro={t.home.engineBody}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.technology, href: path(locale, "technology") },
        ]}
      />

      <Section tone="ink" padding="major">
        <TechnologyEngine
          center="Syitech Technology"
          technologies={technologies.map((technology) => ({
            id: technology.id,
            label: technology.name[locale],
            href: path(locale, "technology", technology.slug[locale]),
          }))}
          appliedLabel={t.labels.appliedTo}
          applications={solutions.map((solution) => ({
            id: solution.id,
            label: solution.name,
            href: path(locale, "solutions", solution.slug[locale]),
          }))}
        />
      </Section>

      {rd ? (
        <Section>
          <SectionHeader eyebrow="R&D" title={rd.tagline[locale]} intro={rd.challenge[locale]} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rd.capabilities[locale].map((capability) => (
              <li key={capability} className="rounded-lg border border-line bg-page p-6 text-[0.95rem]">
                {capability}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {granted.length + pending.length + filed.length > 0 ? (
        <Section tone="surface">
          <SectionHeader title={locale === "fr" ? "Propriété intellectuelle" : "Intellectual property"} />
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2 border-t border-line pt-5">
              <dd className="type-metric">{granted.length}</dd>
              <dt className="text-sm">{locale === "fr" ? "Brevets délivrés" : "Patents granted"}</dt>
            </div>
            <div className="flex flex-col gap-2 border-t border-line pt-5">
              <dd className="type-metric">{pending.length}</dd>
              <dt className="text-sm">{locale === "fr" ? "En cours d'examen" : "Under examination"}</dt>
            </div>
            <div className="flex flex-col gap-2 border-t border-line pt-5">
              <dd className="type-metric">{filed.length}</dd>
              <dt className="text-sm">{locale === "fr" ? "Demandes déposées" : "Applications filed"}</dt>
            </div>
          </dl>
        </Section>
      ) : null}
    </>
  )
}
