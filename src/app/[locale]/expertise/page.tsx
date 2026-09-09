import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Arrow, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { getExpertises } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({
    locale,
    title: t.nav.expertise,
    description: t.home.expertiseTitle,
    routeKeys: ["expertise"],
  })
}

export default async function ExpertiseIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const expertises = getExpertises()

  return (
    <>
      <PageHero
        eyebrow={t.nav.expertise}
        title={t.home.expertiseTitle}
        intro={t.home.ecosystemBody}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.expertise, href: path(locale, "expertise") },
        ]}
      />
      <Section>
        <ul className="grid gap-4 md:grid-cols-2">
          {expertises.map((expertise) => (
            <li key={expertise.id} className="rounded-lg border border-line bg-page">
              <Link
                href={path(locale, "expertise", expertise.slug[locale])}
                className="group flex h-full flex-col gap-4 rounded-lg p-7 transition-colors hover:bg-surface md:p-9"
              >
                <span className="type-overline text-faint">{String(expertise.order).padStart(2, "0")}</span>
                <span className="type-h3">{expertise.name[locale]}</span>
                <span className="measure text-sm text-muted">{expertise.tagline[locale]}</span>
                <span className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium">
                  {t.cta.learnMore}
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
