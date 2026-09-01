import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Prose, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { group } from "@/content/group"
import { getPeople } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    title: locale === "fr" ? "Gouvernance" : "Governance",
    description: group.governance[locale][0] ?? "",
    routeKeys: ["group", "governance"],
  })
}

export default async function GovernancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const people = getPeople()

  return (
    <>
      <PageHero
        eyebrow={t.nav.group}
        title={locale === "fr" ? "Gouvernance" : "Governance"}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.group, href: path(locale, "group") },
          { label: locale === "fr" ? "Gouvernance" : "Governance", href: path(locale, "group", "governance") },
        ]}
      />
      <Section>
        <Prose paragraphs={group.governance[locale]} />
      </Section>
      {people.length > 0 ? (
        <Section tone="surface">
          <ul className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
            {people.map((person) => (
              <li key={person.id} className="flex flex-col gap-2">
                <span className="type-h4">{person.name}</span>
                <span className="type-overline text-faint">{person.role[locale]}</span>
                <span className="text-sm text-muted">{person.bio[locale]}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  )
}
