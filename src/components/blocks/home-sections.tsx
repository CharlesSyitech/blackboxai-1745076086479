import Link from "next/link"
import { EcosystemGraph, type GraphNode } from "@/components/graphics/ecosystem-graph"
import { TechnologyEngine } from "@/components/graphics/technology-engine"
import { StageFlow } from "@/components/graphics/process-flow"
import { Arrow, Badge, ButtonLink, Eyebrow, Prose, Section, SectionHeader } from "@/components/ui/primitives"
import { Reveal } from "@/components/ui/reveal"
import type { Dictionary } from "@/content/dictionaries"
import type { Locale } from "@/lib/i18n/routes"
import { formatDate } from "@/lib/utils/format"
import type { CaseStudy, Expertise, Solution } from "@/types/content"

export function AboutSection({
  t,
  href,
}: {
  t: Dictionary
  href: string
}) {
  return (
    <Section tone="surface">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="flex flex-col gap-5">
          <Eyebrow>{t.home.aboutEyebrow}</Eyebrow>
          <h2 className="type-h1 max-w-[14ch]">{t.home.aboutTitle}</h2>
        </div>
        <div className="flex flex-col items-start gap-8">
          <Prose paragraphs={t.home.aboutBody} />
          <Link href={href} className="group inline-flex items-center gap-2 font-medium text-ink">
            {t.cta.ourHistory}
            <Arrow />
          </Link>
        </div>
      </div>
    </Section>
  )
}

export function ExpertiseSection({
  t,
  locale,
  expertises,
  hrefFor,
}: {
  t: Dictionary
  locale: Locale
  expertises: Expertise[]
  hrefFor: (expertise: Expertise) => string
}) {
  return (
    <Section>
      <SectionHeader eyebrow={t.home.expertiseEyebrow} title={t.home.expertiseTitle} />
      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {expertises.map((expertise, index) => (
          <Reveal as="li" key={expertise.id} delay={Math.min(index, 5) * 60} className="rounded-lg border border-line bg-page">
            <Link
              href={hrefFor(expertise)}
              className="group flex h-full flex-col gap-4 rounded-lg p-6 transition-colors hover:bg-surface md:p-8"
            >
              <span className="type-overline text-faint">
                {String(expertise.order).padStart(2, "0")}
              </span>
              <span className="type-h3">{expertise.name[locale]}</span>
              <span className="text-sm leading-relaxed text-muted">{expertise.tagline[locale]}</span>
              <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4">
                {expertise.capabilities[locale].slice(0, 4).map((capability) => (
                  <li key={capability} className="type-overline text-faint">
                    {capability}
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-2 pt-2 text-sm font-medium text-ink">
                {t.cta.learnMore}
                <Arrow />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

export function EcosystemSection({
  t,
  nodes,
  foundation,
  centerLabel,
}: {
  t: Dictionary
  nodes: GraphNode[]
  foundation: string[]
  centerLabel: string
}) {
  return (
    <Section tone="surface" padding="major">
      <SectionHeader eyebrow={t.home.ecosystemEyebrow} title={t.home.ecosystemTitle} intro={t.home.ecosystemBody} />
      <div className="mt-16">
        <EcosystemGraph
          center={centerLabel}
          nodes={nodes}
          foundation={foundation}
          foundationLabel={t.labels.technologies}
        />
      </div>
    </Section>
  )
}

export function SolutionSpotlight({
  solution,
  locale,
  t,
  href,
  tone = "page",
  className,
}: {
  solution: Solution
  locale: Locale
  t: Dictionary
  href: string
  tone?: "page" | "surface" | "ink"
  className?: string
}) {
  const universes = solution.universes.slice(0, 4)
  return (
    <Section tone={tone} className={className}>
      <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-extrabold tracking-[-0.02em]">{solution.name}</span>
            <Badge tone="accent">{solution.vertical}</Badge>
          </div>
          <h2 className="type-h2 max-w-[18ch]">{solution.positioning[locale]}</h2>
          <p className="measure text-muted">{solution.tagline[locale]}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <ButtonLink href={href} variant="primary">
              {solution.ctaPrimary[locale]}
            </ButtonLink>
            {solution.ctaSecondary ? (
              <ButtonLink href={href} variant="secondary">
                {solution.ctaSecondary[locale]}
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {universes.map((universe) => (
            <li key={universe.key} className="flex flex-col gap-3 rounded-lg border border-line bg-raised p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="type-h4">{universe.title[locale]}</span>
                {universe.maturity === "beta" ? <Badge>{t.labels.maturityBeta}</Badge> : null}
                {universe.maturity === "roadmap" ? <Badge tone="warn">{t.labels.maturityRoadmap}</Badge> : null}
              </div>
              <ul className="flex flex-col gap-1.5">
                {universe.features[locale].slice(0, 5).map((feature) => (
                  <li key={feature} className="text-sm text-muted">
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

/** Mobile-only consolidation of the three product spotlights. */
export function MobileSolutionsDigest({
  solutions,
  locale,
  title,
  hrefFor,
}: {
  solutions: Solution[]
  locale: Locale
  title: string
  hrefFor: (solution: Solution) => string
}) {
  return (
    <Section tone="surface" padding="tight" className="lg:hidden">
      <h2 className="type-h2">{title}</h2>
      <ul className="mt-8 flex flex-col divide-y divide-line">
        {solutions.map((solution) => (
          <li key={solution.id}>
            <Link href={hrefFor(solution)} className="flex flex-col gap-2 py-5">
              <span className="flex items-center gap-3">
                <span className="font-display text-base font-bold">{solution.name}</span>
                <span className="type-overline text-faint">{solution.vertical}</span>
              </span>
              <span className="text-sm text-muted">{solution.positioning[locale]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function FintechSection({
  t,
  locale,
  solution,
  href,
  disclaimer,
}: {
  t: Dictionary
  locale: Locale
  solution: Solution
  href: string
  disclaimer: string
}) {
  const stages = [
    { key: "income", labelFr: "Revenus", labelEn: "Income", available: true },
    { key: "wallet", labelFr: "Portefeuille", labelEn: "Wallet", available: true },
    { key: "payment", labelFr: "Paiement", labelEn: "Payment", available: true },
    { key: "card", labelFr: "Carte", labelEn: "Card", available: false },
    { key: "savings", labelFr: "Épargne", labelEn: "Savings", available: false },
    { key: "protection", labelFr: "Protection sociale", labelEn: "Social protection", available: false },
    { key: "investment", labelFr: "Investissement", labelEn: "Investment", available: false },
  ].map((stage) => ({
    key: stage.key,
    label: locale === "fr" ? stage.labelFr : stage.labelEn,
    available: stage.available,
  }))

  return (
    <Section tone="ink" padding="major">
      <SectionHeader
        eyebrow="FinTech"
        title={solution.positioning[locale]}
        intro={solution.tagline[locale]}
      />
      <div className="mt-14">
        <StageFlow stages={stages} />
      </div>
      <div className="mt-10 flex flex-col gap-6 border-t border-line-soft pt-8 md:flex-row md:items-start md:justify-between">
        <p className="max-w-3xl text-sm leading-relaxed text-muted">
          <span className="type-overline mr-2 text-warn">{t.labels.regulatoryNotice}</span>
          {disclaimer}
        </p>
        <ButtonLink href={href} variant="secondary">
          {t.cta.learnMore}
        </ButtonLink>
      </div>
    </Section>
  )
}

export function CaseStudyFeature({
  study,
  locale,
  t,
  href,
}: {
  study: CaseStudy
  locale: Locale
  t: Dictionary
  href: string
}) {
  return (
    <Section tone="ink" padding="major">
      <div className="flex flex-col gap-8">
        <Eyebrow className="text-accent">{t.home.workEyebrow}</Eyebrow>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <div className="flex flex-col gap-5">
            <h2 className="type-display max-w-[14ch]">{study.title[locale]}</h2>
            <p className="type-overline text-muted">
              {formatDate(study.date, locale)} · {study.location[locale]}
            </p>
          </div>
          <div className="flex flex-col items-start gap-6">
            <p className="measure text-muted">{study.summary[locale]}</p>
            <ul className="flex flex-wrap gap-x-3 gap-y-2">
              {study.disciplines[locale].map((discipline) => (
                <li key={discipline} className="type-overline rounded-sm border border-line px-2 py-1 text-muted">
                  {discipline}
                </li>
              ))}
            </ul>
            <ButtonLink href={href} variant="accent">
              {t.cta.discoverProject}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function EngineSection({
  t,
  centerLabel,
  technologies,
  applications,
}: {
  t: Dictionary
  centerLabel: string
  technologies: { id: string; label: string; href: string }[]
  applications: { id: string; label: string; href: string }[]
}) {
  return (
    <Section tone="ink" padding="major">
      <SectionHeader eyebrow={t.home.engineEyebrow} title={t.home.engineTitle} intro={t.home.engineBody} />
      <div className="mt-16">
        <TechnologyEngine
          center={centerLabel}
          technologies={technologies}
          appliedLabel={t.labels.appliedTo}
          applications={applications}
        />
      </div>
    </Section>
  )
}

export function FinalCta({ t, primary, secondary }: { t: Dictionary; primary: string; secondary: string }) {
  return (
    <Section tone="surface" padding="major">
      <div className="flex flex-col items-center gap-7 text-center">
        <h2 className="type-h1 max-w-[18ch]">{t.home.finalCtaTitle}</h2>
        <p className="measure text-muted">{t.home.finalCtaBody}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href={primary} variant="accent" size="lg">
            {t.cta.becomePartner}
          </ButtonLink>
          <ButtonLink href={secondary} variant="secondary" size="lg">
            {t.cta.talkToTeam}
          </ButtonLink>
        </div>
      </div>
    </Section>
  )
}
