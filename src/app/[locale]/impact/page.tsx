import { notFound } from "next/navigation"
import { ImpactDashboard } from "@/components/blocks/collections"
import { PageHero } from "@/components/layout/page-hero"
import { Prose, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { impactKpiKeys } from "@/content/kpis"
import { getKpis } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, title: t.nav.impact, description: t.home.impactTitle, routeKeys: ["impact"] })
}

export default async function ImpactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const groups = [
    { category: "culture", label: locale === "fr" ? "Culture" : "Culture", keys: impactKpiKeys.culture ?? [] },
    { category: "technology", label: locale === "fr" ? "Technologie" : "Technology", keys: impactKpiKeys.technology ?? [] },
    { category: "enterprise", label: locale === "fr" ? "Entreprise" : "Enterprise", keys: impactKpiKeys.enterprise ?? [] },
    { category: "economic", label: locale === "fr" ? "Économie" : "Economic", keys: impactKpiKeys.economic ?? [] },
    { category: "social", label: locale === "fr" ? "Social" : "Social", keys: impactKpiKeys.social ?? [] },
  ]
  const hasData = groups.some((entry) => getKpis(entry.keys).length > 0)

  const methodology =
    locale === "fr"
      ? [
          "Les indicateurs publiés sur cette page proviennent des systèmes internes du Groupe. Chacun porte une période de référence, une source et une date de mise à jour, consultables au survol.",
          "Un indicateur qui n'a pas été validé n'est pas affiché. Nous préférons une page plus courte à une page plus flatteuse.",
        ]
      : [
          "The indicators published on this page come from the Group's internal systems. Each carries a reference period, a source and an update date, visible on hover.",
          "An indicator that has not been validated is not displayed. We would rather publish a shorter page than a more flattering one.",
        ]

  return (
    <>
      <PageHero
        eyebrow={t.home.impactEyebrow}
        title={t.home.impactTitle}
        intro={
          locale === "fr"
            ? "Ce que nos technologies produisent, mesuré et sourcé."
            : "What our technologies produce, measured and sourced."
        }
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.impact, href: path(locale, "impact") },
        ]}
      />
      {hasData ? (
        <Section>
          <ImpactDashboard groups={groups} locale={locale} t={t} />
        </Section>
      ) : null}
      <Section tone="surface" padding="tight">
        <div className="grid gap-8 lg:grid-cols-[0.5fr_1.5fr] lg:gap-20">
          <h2 className="type-overline text-faint">{locale === "fr" ? "Méthodologie" : "Methodology"}</h2>
          <Prose paragraphs={methodology} />
        </div>
      </Section>
    </>
  )
}
