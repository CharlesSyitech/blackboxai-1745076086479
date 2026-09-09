import { notFound } from "next/navigation"
import { BrandMap, BrandPanel } from "@/components/blocks/brand-universe"
import { PageHero } from "@/components/layout/page-hero"
import { Prose, Section } from "@/components/ui/primitives"
import { brands, scrollJourney } from "@/content/brands"
import { getDictionary } from "@/content/dictionaries"
import { isLocale, path } from "@/lib/i18n/routes"
import { buildMetadata } from "@/lib/seo/metadata"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return buildMetadata({
    locale,
    title: t.nav.brands,
    description:
      locale === "fr"
        ? "Les marques de Syitech Group : Sydica, Sytium, SydiCard, KultiX, SyitEx et Syitech R&D."
        : "The brands of Syitech Group: Sydica, Sytium, SydiCard, KultiX, SyitEx and Syitech R&D.",
    routeKeys: ["brands"],
  })
}

export default async function BrandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)

  const ordered = scrollJourney
    .map((id) => brands.find((brand) => brand.id === id))
    .filter((brand): brand is NonNullable<typeof brand> => Boolean(brand))

  const labels =
    locale === "fr"
      ? {
          discover: "Découvrir",
          visitSite: "Voir le site de la marque",
          noLogoYet:
            "Cette marque n'a pas encore de logo. Elle est posée en traitement typographique dans le système du Groupe, en attendant son identité propre.",
          aSyitechBrand: "Une marque Syitech Group",
          liveLabel: "En service",
        }
      : {
          discover: "Explore",
          visitSite: "Visit the brand site",
          noLogoYet:
            "This brand has no logo yet. It is set in the Group's own typography until its identity exists.",
          aSyitechBrand: "A Syitech Group brand",
          liveLabel: "Live",
        }

  const intro =
    locale === "fr"
      ? [
          "Syitech Group est une marque ombrelle : elle se tient au-dessus de ses produits, jamais à côté d'eux. Le Groupe porte la recherche, l'ingénierie et les infrastructures ; chaque marque porte son marché.",
          "Chaque marque a donc son propre univers — sa palette, sa matière, son rythme. Une page produit s'ouvre dans les couleurs de sa marque, et non dans celles du Groupe.",
        ]
      : [
          "Syitech Group is an umbrella brand: it stands above its products rather than beside them. The Group carries the research, the engineering and the infrastructure; each brand carries its market.",
          "Each brand therefore runs its own universe — palette, texture, tempo. A product page opens in its brand's colours, not the Group's.",
        ]

  return (
    <>
      <PageHero
        eyebrow={locale === "fr" ? "Architecture de marque" : "Brand architecture"}
        title={
          locale === "fr"
            ? "Un groupe, sept univers."
            : "One group, seven universes."
        }
        intro={
          locale === "fr"
            ? "Les marques du Groupe ne partagent pas une charte : elles partagent une structure. Descendez la page pour les traverser."
            : "The Group's brands do not share a style sheet: they share a structure. Scroll to move through them."
        }
        crumbLabel={t.nav.breadcrumb}
        crumbs={[
          { label: t.nav.home, href: path(locale, "") },
          { label: t.nav.brands, href: path(locale, "brands") },
        ]}
        tone="ink"
      />

      <Section tone="surface" padding="tight">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Prose paragraphs={intro} />
          <BrandMap brands={ordered} locale={locale} label={labels.liveLabel} />
        </div>
      </Section>

      {ordered.map((brand, index) => (
        <BrandPanel key={brand.id} brand={brand} locale={locale} labels={labels} index={index} />
      ))}
    </>
  )
}
