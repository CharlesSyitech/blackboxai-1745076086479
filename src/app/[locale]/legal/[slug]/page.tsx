import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { getLegalDocuments } from "@/content/legal"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, locales, path } from "@/lib/i18n/routes"

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getLegalDocuments().map((document) => ({ locale, slug: document.slug[locale] })),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const document = getLegalDocuments().find((entry) => entry.slug[locale] === slug)
  if (!document) return {}
  return buildMetadata({
    locale,
    title: document.title[locale],
    description: document.intro[locale],
    routeKeys: ["legal"],
    slug: document.slug,
  })
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const document = getLegalDocuments().find((entry) => entry.slug[locale] === slug)
  if (!document) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        title={document.title[locale]}
        intro={document.intro[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: document.title[locale], href: path(locale, "legal", document.slug[locale]) },
        ]}
      />
      <Section size="narrow">
        <div className="flex flex-col gap-12">
          {document.sections.map((section) => (
            <section key={section.heading[locale]} className="flex flex-col gap-4">
              <h2 className="type-h3">{section.heading[locale]}</h2>
              {section.body[locale].map((paragraph) => (
                <p key={paragraph} className="text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </Section>
    </>
  )
}
