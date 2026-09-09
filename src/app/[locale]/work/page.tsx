import { notFound } from "next/navigation"
import { WorkGrid } from "@/components/blocks/collections"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { getAvailableSectors, getCaseStudies } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

const sectorLabels: Record<string, { fr: string; en: string }> = {
  culture: { fr: "Culture", en: "Culture" },
  enterprise: { fr: "Entreprise", en: "Enterprise" },
  events: { fr: "Événementiel", en: "Events" },
  public: { fr: "Secteur public", en: "Public sector" },
  technology: { fr: "Technologie", en: "Technology" },
  iot: { fr: "IoT", en: "IoT" },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, title: t.nav.work, description: t.home.workTitle, routeKeys: ["work"] })
}

export default async function WorkIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const studies = getCaseStudies()
  // Filters are derived from what is actually publishable: a sector with no
  // cleared case study is never offered and can never return an empty grid.
  const sectors = getAvailableSectors()

  return (
    <>
      <PageHero
        eyebrow={t.home.workEyebrow}
        title={t.home.workTitle}
        intro={
          locale === "fr"
            ? "Des projets documentés : le contexte, la réponse technologique, la mise en œuvre et ce qui a changé."
            : "Documented projects: the context, the technology response, the implementation and what changed."
        }
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.work, href: path(locale, "work") },
        ]}
      />
      <Section>
        {sectors.length > 1 ? (
          <ul className="mb-12 flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <li key={sector} className="type-overline rounded-sm border border-line px-3 py-1.5 text-muted">
                {sectorLabels[sector]?.[locale] ?? sector}
              </li>
            ))}
          </ul>
        ) : null}
        <WorkGrid
          studies={studies}
          locale={locale}
          t={t}
          hrefFor={(study) => path(locale, "work", study.slug[locale])}
        />
      </Section>
    </>
  )
}
