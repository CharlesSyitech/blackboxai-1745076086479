import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { ButtonLink, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { jobs } from "@/content/corporate"
import { getJobBySlug } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, locales, path } from "@/lib/i18n/routes"

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    jobs.filter((job) => job.isOpen).map((job) => ({ locale, slug: job.slug[locale] })),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const job = getJobBySlug(locale, slug)
  if (!job) return {}
  return buildMetadata({
    locale,
    title: job.title[locale],
    description: job.description[locale],
    routeKeys: ["careers"],
    slug: job.slug,
  })
}

export default async function JobPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const job = getJobBySlug(locale, slug)
  if (!job) notFound()
  const t = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={`${job.department[locale]} · ${job.location[locale]}`}
        title={job.title[locale]}
        intro={job.description[locale]}
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.careers, href: path(locale, "careers") },
          { label: job.title[locale], href: path(locale, "careers", job.slug[locale]) },
        ]}
      />
      <Section size="narrow">
        <ul className="flex flex-col gap-3">
          {job.requirements[locale].map((requirement) => (
            <li key={requirement} className="border-l-2 border-line pl-5 text-muted">
              {requirement}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href={path(locale, "contact")} variant="accent">
            {t.cta.talkToTeam}
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
