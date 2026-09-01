import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { group } from "@/content/group"
import { getCountries } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    title: locale === "fr" ? "Présence internationale" : "Global presence",
    description: group.presenceNote[locale],
    routeKeys: ["group", "presence"],
  })
}

export default async function PresencePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const countries = getCountries()

  const groups = (["headquarters", "operations", "market", "distribution", "development"] as const)
    .map((type) => ({
      type,
      label: group.presenceLabels[type][locale],
      items: countries.filter((country) => country.presenceType === type),
    }))
    .filter((entry) => entry.items.length > 0)

  return (
    <>
      <PageHero
        eyebrow={t.nav.group}
        title={locale === "fr" ? "Présence internationale" : "Global presence"}
        intro={group.presenceNote[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.group, href: path(locale, "group") },
          {
            label: locale === "fr" ? "Présence internationale" : "Global presence",
            href: path(locale, "group", "presence"),
          },
        ]}
      />
      <Section>
        <div className="flex flex-col gap-12">
          {groups.map((entry) => (
            <div key={entry.type} className="flex flex-col gap-4">
              <h2 className="type-overline text-accent-ink">{entry.label}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {entry.items.map((country) => (
                  <li key={country.id} className="flex flex-col gap-1 rounded-lg border border-line bg-page p-5">
                    <span className="type-h4">{country.name[locale]}</span>
                    {country.entityName ? (
                      <span className="text-sm text-muted">{country.entityName}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
