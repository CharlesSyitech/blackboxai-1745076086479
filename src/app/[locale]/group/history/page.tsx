import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Prose, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { timeline } from "@/content/corporate"
import { group } from "@/content/group"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({
    locale,
    title: locale === "fr" ? "Notre histoire" : "Our history",
    description: group.vision[locale],
    routeKeys: ["group", "history"],
  })
}

export default async function HistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={t.nav.group}
        title={locale === "fr" ? "Notre histoire" : "Our history"}
        intro={group.vision[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.group, href: path(locale, "group") },
          { label: locale === "fr" ? "Notre histoire" : "Our history", href: path(locale, "group", "history") },
        ]}
      />
      <Section>
        <Prose paragraphs={group.model[locale]} />
      </Section>
      {timeline.length > 0 ? (
        <Section tone="surface">
          <ol className="flex flex-col">
            {timeline.map((entry) => (
              <li key={entry.year} className="grid gap-4 border-t border-line py-8 md:grid-cols-[120px_1fr] md:gap-12">
                <span className="type-overline text-accent-ink">{entry.year}</span>
                <div className="flex flex-col gap-2">
                  <span className="type-h3">{entry.title[locale]}</span>
                  <span className="measure text-muted">{entry.body[locale]}</span>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
    </>
  )
}
