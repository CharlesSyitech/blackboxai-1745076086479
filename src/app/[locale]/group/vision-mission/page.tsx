import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Section, SectionHeader } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { group } from "@/content/group"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    title: "Vision & Mission",
    description: group.mission[locale],
    routeKeys: ["group", "vision-mission"],
  })
}

export default async function VisionMissionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={t.nav.group}
        title="Vision & Mission"
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.group, href: path(locale, "group") },
          { label: "Vision & Mission", href: path(locale, "group", "vision-mission") },
        ]}
      />
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="type-overline text-accent-ink">Vision</h2>
            <p className="type-h3 measure">{group.vision[locale]}</p>
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="type-overline text-accent-ink">Mission</h2>
            <p className="type-h3 measure">{group.mission[locale]}</p>
          </div>
        </div>
      </Section>
      <Section tone="surface">
        <SectionHeader title={locale === "fr" ? "Nos valeurs" : "Our values"} />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {group.values.map((value) => (
            <li key={value.title[locale]} className="flex flex-col gap-3 rounded-lg border border-line bg-raised p-7 md:p-9">
              <span className="type-h3">{value.title[locale]}</span>
              <span className="measure text-muted">{value.body[locale]}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
