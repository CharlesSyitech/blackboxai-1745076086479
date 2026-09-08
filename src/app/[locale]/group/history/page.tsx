import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Prose, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { Timeline } from "@/components/blocks/timeline"
import { group } from "@/content/group"
import { getTimeline } from "@/lib/content/queries"
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
  const entries = getTimeline()

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
      {entries.length > 0 ? (
        <Section tone="surface">
          <Timeline entries={entries} locale={locale} />
        </Section>
      ) : null}
    </>
  )
}
