import { notFound } from "next/navigation"
import { NewsTeaser } from "@/components/blocks/collections"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { site } from "@/content/site"
import { getNews } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, title: t.nav.news, description: t.home.newsTitle, routeKeys: ["news"] })
}

export default async function NewsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const items = getNews()

  return (
    <>
      <PageHero
        eyebrow={t.home.newsEyebrow}
        title={t.home.newsTitle}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.news, href: path(locale, "news") },
        ]}
      />
      <Section>
        {items.length > 0 ? (
          <NewsTeaser
            items={items}
            locale={locale}
            t={t}
            hrefFor={(item) => path(locale, "news", item.slug[locale])}
          />
        ) : (
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 className="type-h3">{t.states.newsroomTitle}</h2>
            <p className="text-muted">{t.states.newsroomBody}</p>
            <p className="mt-2 flex flex-col gap-1">
              <span className="type-overline text-faint">{t.states.pressContact}</span>
              <a href={`mailto:${site.contact.email}`} className="link-underline w-fit">
                {site.contact.email}
              </a>
            </p>
          </div>
        )}
      </Section>
    </>
  )
}
