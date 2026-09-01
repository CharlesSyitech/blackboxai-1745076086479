import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { getPeople } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({ locale, title: "Leadership", description: "Leadership", routeKeys: ["group", "leadership"] })
}

/** No cleared profile means no page, and no link in the navigation. */
export default async function LeadershipPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const people = getPeople()
  if (people.length === 0) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={t.nav.group}
        title="Leadership"
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.group, href: path(locale, "group") },
          { label: "Leadership", href: path(locale, "group", "leadership") },
        ]}
      />
      <Section>
        <ul className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">
          {people.map((person) => (
            <li key={person.id} className="flex flex-col gap-2">
              <span className="type-h4">{person.name}</span>
              <span className="type-overline text-faint">{person.role[locale]}</span>
              <span className="text-sm text-muted">{person.bio[locale]}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
