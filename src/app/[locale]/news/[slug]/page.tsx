import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Prose, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { news } from "@/content/corporate"
import { getNewsBySlug } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, locales, path } from "@/lib/i18n/routes"
import { formatDate } from "@/lib/utils/format"

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    news.filter((item) => item.isPublished).map((item) => ({ locale, slug: item.slug[locale] })),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const item = getNewsBySlug(locale, slug)
  if (!item) return {}
  return buildMetadata({
    locale,
    title: item.title[locale],
    description: item.excerpt[locale],
    routeKeys: ["news"],
    slug: item.slug,
  })
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const item = getNewsBySlug(locale, slug)
  if (!item) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={`${item.category} · ${formatDate(item.publishedAt, locale)}`}
        title={item.title[locale]}
        intro={item.excerpt[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.news, href: path(locale, "news") },
          { label: item.title[locale], href: path(locale, "news", item.slug[locale]) },
        ]}
      />
      <Section size="narrow">
        <Prose paragraphs={item.body[locale]} />
      </Section>
    </>
  )
}
