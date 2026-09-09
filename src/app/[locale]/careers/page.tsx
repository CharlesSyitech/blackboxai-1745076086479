import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHero } from "@/components/layout/page-hero"
import { ButtonLink, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { getJobs } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({
    locale,
    title: t.nav.careers,
    description:
      locale === "fr"
        ? "Construisez avec nous les prochaines technologies africaines."
        : "Build Africa's next technologies with us.",
    routeKeys: ["careers"],
  })
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const jobs = getJobs()

  return (
    <>
      <PageHero
        eyebrow={t.nav.careers}
        title={
          locale === "fr"
            ? "Construisez avec nous les prochaines technologies africaines."
            : "Build Africa's next technologies with us."
        }
        intro={
          locale === "fr"
            ? "Nous concevons des systèmes utilisés en conditions réelles, sur des marchés exigeants. Les problèmes techniques y sont concrets et les décisions, visibles."
            : "We design systems used in real conditions, in demanding markets. The technical problems are concrete and the decisions are visible."
        }
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.careers, href: path(locale, "careers") },
        ]}
      />
      <Section>
        {jobs.length > 0 ? (
          <ul className="flex flex-col">
            {jobs.map((job) => (
              <li key={job.id} className="border-t border-line">
                <Link href={path(locale, "careers", job.slug[locale])} className="flex flex-col gap-2 py-7">
                  <span className="type-h3">{job.title[locale]}</span>
                  <span className="type-overline text-faint">
                    {job.department[locale]} · {job.location[locale]} · {job.contractType[locale]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex max-w-2xl flex-col items-start gap-5">
            <h2 className="type-h3">{t.states.jobsTitle}</h2>
            <p className="text-muted">{t.states.jobsBody}</p>
            <ButtonLink href={path(locale, "contact")} variant="accent">
              {t.cta.talkToTeam}
            </ButtonLink>
          </div>
        )}
      </Section>
    </>
  )
}
