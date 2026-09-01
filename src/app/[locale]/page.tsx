import { notFound } from "next/navigation"
import { CollectionSection, ImpactDashboard, NewsTeaser, PartnerWall, WorkGrid } from "@/components/blocks/collections"
import { HomeHero } from "@/components/blocks/home-hero"
import {
  AboutSection,
  CaseStudyFeature,
  EcosystemSection,
  EngineSection,
  ExpertiseSection,
  FinalCta,
  FintechSection,
  MobileSolutionsDigest,
  SolutionSpotlight,
} from "@/components/blocks/home-sections"
import { Section, SectionHeader } from "@/components/ui/primitives"
import { StatsRow } from "@/components/ui/stats"
import { getDictionary, type Dictionary } from "@/content/dictionaries"
import { homeKpiKeys, impactKpiKeys } from "@/content/kpis"
import { partnerCategoryOrder } from "@/content/partners"
import { site } from "@/content/site"
import {
  getCaseStudies,
  getExpertises,
  getKpis,
  getNews,
  getPartners,
  getSolutions,
  getTechnologies,
} from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path, type Locale } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return buildMetadata({ locale, title: site.name, description: site.description[locale] })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const expertises = getExpertises()
  const solutions = getSolutions()
  const technologies = getTechnologies()
  const studies = getCaseStudies()
  const news = getNews().slice(0, 3)

  const solutionHref = (id: string) => {
    const solution = solutions.find((item) => item.id === id)
    return solution ? path(locale, "solutions", solution.slug[locale]) : path(locale, "solutions")
  }
  const solutionById = (id: string) => solutions.find((item) => item.id === id)

  const sytium = solutionById("sytium")
  const sydica = solutionById("sydica")
  const kultix = solutionById("kultix")
  const fintech = solutionById("fintech")
  const secureUsb = solutionById("secure-usb")
  const featured = studies[0]

  const impactGroups = [
    { category: "culture", label: locale === "fr" ? "Culture" : "Culture", keys: impactKpiKeys.culture ?? [] },
    { category: "technology", label: locale === "fr" ? "Technologie" : "Technology", keys: impactKpiKeys.technology ?? [] },
    { category: "enterprise", label: locale === "fr" ? "Entreprise" : "Enterprise", keys: impactKpiKeys.enterprise ?? [] },
    { category: "economic", label: locale === "fr" ? "Économie" : "Economic", keys: impactKpiKeys.economic ?? [] },
    { category: "social", label: locale === "fr" ? "Social" : "Social", keys: impactKpiKeys.social ?? [] },
  ]

  return (
    <>
      {/* 1 — Hero */}
      <HomeHero
        title={t.home.heroTitle}
        subtitle={t.home.heroSubtitle}
        primaryCta={{ label: t.cta.discoverGroup, href: path(locale, "group") }}
        secondaryCta={{ label: t.cta.exploreEcosystem, href: "#ecosystem" }}
        verticals={expertises.map((expertise) => ({
          label: expertise.name[locale],
          href: path(locale, "expertise", expertise.slug[locale]),
        }))}
      />

      {/* 2 — About */}
      <AboutSection t={t} href={path(locale, "group", "history")} />

      {/* 3 — Key figures. Renders only what Finance and Legal have cleared. */}
      <HomeStats locale={locale} t={t} />

      {/* 4 — Expertise */}
      <ExpertiseSection
        t={t}
        locale={locale}
        expertises={expertises}
        hrefFor={(expertise) => path(locale, "expertise", expertise.slug[locale])}
      />

      {/* 5 — Ecosystem */}
      <div id="ecosystem">
        <EcosystemSection
          t={t}
          centerLabel={site.name}
          nodes={solutions.map((solution) => ({
            id: solution.id,
            label: solution.name,
            hint: solution.vertical,
            href: path(locale, "solutions", solution.slug[locale]),
          }))}
          foundation={technologies.map((technology) => technology.name[locale])}
        />
      </div>

      {/* 6, 7, 9 — Product spotlights (consolidated on mobile) */}
      {sytium ? (
        <SolutionSpotlight
          solution={sytium}
          locale={locale}
          t={t}
          href={solutionHref("sytium")}
          tone="ink"
          className="hidden lg:block"
        />
      ) : null}
      {sydica ? (
        <SolutionSpotlight
          solution={sydica}
          locale={locale}
          t={t}
          href={solutionHref("sydica")}
          className="hidden lg:block"
        />
      ) : null}

      {/* 8 — FinTech */}
      {fintech ? (
        <FintechSection
          t={t}
          locale={locale}
          solution={fintech}
          href={solutionHref("fintech")}
          disclaimer={site.regulatoryDisclaimer[locale]}
        />
      ) : null}

      {kultix ? (
        <SolutionSpotlight
          solution={kultix}
          locale={locale}
          t={t}
          href={solutionHref("kultix")}
          tone="surface"
          className="hidden lg:block"
        />
      ) : null}

      <MobileSolutionsDigest
        solutions={solutions.filter((solution) => solution.featuredOnHome)}
        locale={locale}
        title={locale === "fr" ? "Nos solutions" : "Our solutions"}
        hrefFor={(solution) => path(locale, "solutions", solution.slug[locale])}
      />

      {/* 10 — Case study */}
      {featured ? (
        <CaseStudyFeature
          study={featured}
          locale={locale}
          t={t}
          href={path(locale, "work", featured.slug[locale])}
        />
      ) : null}

      {/* 11 — Hardware */}
      {secureUsb ? (
        <SolutionSpotlight
          solution={secureUsb}
          locale={locale}
          t={t}
          href={solutionHref("secure-usb")}
          tone="surface"
          className="hidden lg:block"
        />
      ) : null}

      {/* 12 — Technology engine */}
      <EngineSection
        t={t}
        centerLabel={locale === "fr" ? "Syitech Technology" : "Syitech Technology"}
        technologies={technologies.map((technology) => ({
          id: technology.id,
          label: technology.name[locale],
          href: path(locale, "technology", technology.slug[locale]),
        }))}
        applications={solutions.map((solution) => ({
          id: solution.id,
          label: solution.name,
          href: path(locale, "solutions", solution.slug[locale]),
        }))}
      />

      {/* 13 — Work */}
      {studies.length > 0 ? (
        <CollectionSection
          eyebrow={t.home.workEyebrow}
          title={t.home.workTitle}
          action={{ label: t.cta.allWork, href: path(locale, "work") }}
        >
          <WorkGrid
            studies={studies.slice(0, 4)}
            locale={locale}
            t={t}
            hrefFor={(study) => path(locale, "work", study.slug[locale])}
          />
        </CollectionSection>
      ) : null}

      {/* 14 — Impact */}
      <ImpactSection locale={locale} t={t} groups={impactGroups} />

      {/* 15 — Partners */}
      <PartnersSection locale={locale} t={t} />

      {/* 16 — News */}
      {news.length > 0 ? (
        <CollectionSection
          eyebrow={t.home.newsEyebrow}
          title={t.home.newsTitle}
          action={{ label: t.cta.seeAll, href: path(locale, "news") }}
          tone="surface"
        >
          <NewsTeaser
            items={news}
            locale={locale}
            t={t}
            hrefFor={(item) => path(locale, "news", item.slug[locale])}
          />
        </CollectionSection>
      ) : null}

      {/* 17 — Corporate CTA */}
      <FinalCta t={t} primary={path(locale, "contact")} secondary={path(locale, "contact")} />
    </>
  )
}

function HomeStats({ locale, t }: { locale: Locale; t: Dictionary }) {
  // The section itself disappears when nothing is publishable — no empty grid,
  // no dash, no "coming soon".
  if (getKpis(homeKpiKeys).length === 0) return null
  return (
    <Section padding="tight">
      <StatsRow keys={homeKpiKeys} locale={locale} labels={{ source: t.labels.source, period: t.labels.period }} />
    </Section>
  )
}

function ImpactSection({
  locale,
  t,
  groups,
}: {
  locale: Locale
  t: Dictionary
  groups: { category: string; label: string; keys: string[] }[]
}) {
  const populated = groups.some((group) => getKpis(group.keys).length > 0)
  if (!populated) return null
  return (
    <Section tone="surface">
      <SectionHeader eyebrow={t.home.impactEyebrow} title={t.home.impactTitle} />
      <div className="mt-14">
        <ImpactDashboard groups={groups} locale={locale} t={t} />
      </div>
    </Section>
  )
}

function PartnersSection({ locale, t }: { locale: Locale; t: Dictionary }) {
  if (getPartners().length === 0) return null
  return (
    <Section>
      <SectionHeader eyebrow={t.home.partnersEyebrow} title={t.home.partnersTitle} />
      <div className="mt-14">
        <PartnerWall locale={locale} order={partnerCategoryOrder} />
      </div>
    </Section>
  )
}
