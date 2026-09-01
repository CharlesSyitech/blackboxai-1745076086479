import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { Arrow, Badge, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { getSolutions } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({
    locale,
    title: t.nav.solutions,
    description: t.home.ecosystemBody,
    routeKeys: ["solutions"],
  })
}

export default async function SolutionsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={t.nav.solutions}
        title={t.home.ecosystemTitle}
        intro={t.home.ecosystemBody}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.solutions, href: path(locale, "solutions") },
        ]}
      />
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {getSolutions().map((solution) => (
            <li key={solution.id}>
              <Link
                href={path(locale, "solutions", solution.slug[locale])}
                className="group flex h-full flex-col gap-4 rounded-lg border border-line p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md md:p-9"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-xl font-extrabold tracking-[-0.02em]">{solution.name}</span>
                  <Badge>{solution.vertical}</Badge>
                </div>
                <span className="type-h4 text-ink">{solution.positioning[locale]}</span>
                <span className="measure text-sm text-muted">{solution.tagline[locale]}</span>
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
