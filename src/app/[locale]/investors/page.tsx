import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { ButtonLink, Prose, Section, SectionHeader } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { group } from "@/content/group"
import { site } from "@/content/site"
import { getExpertises, getSolutions } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({
    locale,
    title: t.nav.investors,
    description: site.description[locale],
    routeKeys: ["investors"],
  })
}

export default async function InvestorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const solutions = getSolutions()
  const expertises = getExpertises()

  const glance = [
    {
      label: locale === "fr" ? "Verticales" : "Verticals",
      value: String(expertises.length),
    },
    {
      label: locale === "fr" ? "Solutions propriétaires" : "Proprietary solutions",
      value: String(solutions.length),
    },
    {
      label: locale === "fr" ? "Domaines technologiques" : "Technology domains",
      value: "6",
    },
  ]

  return (
    <>
      <PageHero
        eyebrow={t.nav.investors}
        title={locale === "fr" ? "Syitech Group en bref" : "Syitech Group at a glance"}
        intro={site.description[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.investors, href: path(locale, "investors") },
        ]}
      />

      <Section padding="tight">
        {/* Structural counts only — no financial or traction figure is published here. */}
        <dl className="grid gap-8 sm:grid-cols-3">
          {glance.map((item) => (
            <div key={item.label} className="flex flex-col gap-2 border-t border-line pt-5">
              <dd className="type-metric">{item.value}</dd>
              <dt className="text-sm">{item.label}</dt>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
          <h2 className="type-h2">{locale === "fr" ? "Thèse d'investissement" : "Investment thesis"}</h2>
          <Prose paragraphs={group.investors[locale]} />
        </div>
      </Section>

      <Section>
        <SectionHeader title={locale === "fr" ? "Notre modèle" : "Our model"} />
        <div className="mt-10">
          <Prose paragraphs={group.model[locale]} />
        </div>
      </Section>

      <Section tone="ink" padding="tight">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <p className="measure text-muted">
            {locale === "fr"
              ? "Pour toute demande d'information qualifiée, contactez la relation investisseurs."
              : "For qualified information requests, contact investor relations."}
          </p>
          <ButtonLink href={path(locale, "contact")} variant="accent">
            {t.cta.investorRelations}
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
