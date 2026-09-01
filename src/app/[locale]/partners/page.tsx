import { notFound } from "next/navigation"
import { PartnerWall } from "@/components/blocks/collections"
import { PageHero } from "@/components/layout/page-hero"
import { ButtonLink, Prose, Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { partnerCategoryOrder } from "@/content/partners"
import { getPartners } from "@/lib/content/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { isLocale, path } from "@/lib/i18n/routes"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({ locale, title: t.nav.partners, description: t.home.partnersTitle, routeKeys: ["partners"] })
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const published = getPartners()

  const method =
    locale === "fr"
      ? [
          "Chaque organisation présentée sur cette page l'est avec la nature exacte de sa relation avec Syitech Group : partenaire stratégique, partenaire technologique, collaboration, programme, preuve de concept, client ou fournisseur.",
          "Un logo n'établit pas un partenariat. Une organisation n'apparaît ici qu'après qualification contractuelle et autorisation écrite d'usage de sa marque.",
        ]
      : [
          "Every organisation shown on this page appears with the exact nature of its relationship with Syitech Group: strategic partner, technology partner, collaboration, programme, proof of concept, client or supplier.",
          "A logo does not establish a partnership. An organisation appears here only after contractual qualification and written approval to use its brand.",
        ]

  return (
    <>
      <PageHero
        eyebrow={t.home.partnersEyebrow}
        title={t.home.partnersTitle}
        intro={
          locale === "fr"
            ? "Nous construisons avec un écosystème de confiance — et nous en décrivons précisément les contours."
            : "We build with a trusted ecosystem — and we describe its boundaries precisely."
        }
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.partners, href: path(locale, "partners") },
        ]}
      />

      <Section tone="surface" padding="tight">
        <div className="grid gap-8 lg:grid-cols-[0.5fr_1.5fr] lg:gap-20">
          <h2 className="type-overline text-faint">{locale === "fr" ? "Note de méthode" : "How we qualify"}</h2>
          <Prose paragraphs={method} />
        </div>
      </Section>

      {published.length > 0 ? (
        <Section>
          <PartnerWall locale={locale} order={partnerCategoryOrder} />
        </Section>
      ) : null}

      <Section padding="tight">
        <div className="flex flex-col items-start gap-5 rounded-lg border border-line p-8 md:flex-row md:items-center md:justify-between">
          <p className="measure text-muted">
            {locale === "fr"
              ? "Vous souhaitez construire avec nous ? Décrivez-nous le périmètre envisagé."
              : "Interested in building with us? Tell us about the scope you have in mind."}
          </p>
          <ButtonLink href={path(locale, "contact")} variant="accent">
            {t.cta.becomePartner}
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
