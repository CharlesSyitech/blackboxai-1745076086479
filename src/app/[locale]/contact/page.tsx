import { notFound } from "next/navigation"
import { SmartContactForm } from "@/components/forms/smart-contact-form"
import { PageHero } from "@/components/layout/page-hero"
import { Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { site } from "@/content/site"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, title: t.nav.contact, description: t.contact.subtitle, routeKeys: ["contact"] })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={t.nav.contact}
        title={t.contact.title}
        intro={t.contact.subtitle}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.contact, href: path(locale, "contact") },
        ]}
        aside={
          <div className="flex flex-col gap-1 text-sm text-muted">
            <span>{site.contact.city[locale]}</span>
            <a href={`mailto:${site.contact.email}`} className="link-underline w-fit">
              {site.contact.email}
            </a>
          </div>
        }
      />
      <Section size="content">
        <div className="max-w-3xl">
          <SmartContactForm t={t} locale={locale} />
        </div>
      </Section>
    </>
  )
}
