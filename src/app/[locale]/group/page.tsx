import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Arrow, Prose, Section, SectionHeader } from "@/components/ui/primitives"
import { StatsRow } from "@/components/ui/stats"
import { getDictionary } from "@/content/dictionaries"
import { group } from "@/content/group"
import { homeKpiKeys } from "@/content/kpis"
import { site } from "@/content/site"
import { getExpertises, getKpis } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({
    locale,
    title: t.nav.group,
    description: site.description[locale],
    routeKeys: ["group"],
  })
}

export default async function GroupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const expertises = getExpertises()

  const subPages = [
    { label: locale === "fr" ? "Notre histoire" : "Our history", href: path(locale, "group", "history") },
    { label: "Vision & Mission", href: path(locale, "group", "vision-mission") },
    { label: locale === "fr" ? "Gouvernance" : "Governance", href: path(locale, "group", "governance") },
    { label: locale === "fr" ? "Présence internationale" : "Global presence", href: path(locale, "group", "presence") },
  ]

  return (
    <>
      <PageHero
        eyebrow={site.name}
        title={t.home.aboutTitle}
        intro={site.description[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.group, href: path(locale, "group") },
        ]}
      />

      {getKpis(homeKpiKeys).length > 0 ? (
        <Section padding="tight">
          <StatsRow keys={homeKpiKeys} locale={locale} labels={{ source: t.labels.source, period: t.labels.period }} />
        </Section>
      ) : null}

      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[0.6fr_1.4fr] lg:gap-20">
          <h2 className="type-h2">{locale === "fr" ? "Notre modèle" : "Our model"}</h2>
          <Prose paragraphs={group.model[locale]} />
        </div>
      </Section>

      <Section>
        <SectionHeader title={locale === "fr" ? "Nos valeurs" : "Our values"} />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {group.values.map((value) => (
            <li key={value.title[locale]} className="flex flex-col gap-3 rounded-lg border border-line bg-page p-7 md:p-9">
              <span className="type-h3">{value.title[locale]}</span>
              <span className="measure text-muted">{value.body[locale]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface">
        <SectionHeader
          title={t.nav.expertise}
          action={
            <Link href={path(locale, "expertise")} className="group inline-flex items-center gap-2 text-sm font-medium">
              {t.cta.seeAll}
              <Arrow />
            </Link>
          }
        />
        <ul className="mt-12 grid gap-x-8 gap-y-4 md:grid-cols-2">
          {expertises.map((expertise) => (
            <li key={expertise.id} className="border-t border-line pt-4">
              <Link
                href={path(locale, "expertise", expertise.slug[locale])}
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="type-h4">{expertise.name[locale]}</span>
                <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section padding="tight">
        <h2 className="type-overline mb-6 text-faint">{t.labels.inThisSection}</h2>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {subPages.map((page) => (
            <li key={page.href}>
              <Link href={page.href} className="link-underline">
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
