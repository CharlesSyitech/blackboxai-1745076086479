import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { getAwards } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    title: locale === "fr" ? "Distinctions" : "Awards",
    description: locale === "fr" ? "Distinctions" : "Awards",
    routeKeys: ["group", "awards"],
  })
}

/** An award is only published with an organisation, a year and a proof link. */
export default async function AwardsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const awards = getAwards()
  if (awards.length === 0) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={t.nav.group}
        title={locale === "fr" ? "Distinctions" : "Awards"}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.group, href: path(locale, "group") },
          { label: locale === "fr" ? "Distinctions" : "Awards", href: path(locale, "group", "awards") },
        ]}
      />
      <Section>
        <ul className="flex flex-col">
          {awards.map((award) => (
            <li key={award.id} className="grid gap-2 border-t border-line py-6 md:grid-cols-[100px_1fr_auto]">
              <span className="type-overline text-accent-ink">{award.year}</span>
              <span className="type-h4">{award.name[locale]}</span>
              <span className="text-sm text-muted">{award.organization}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
