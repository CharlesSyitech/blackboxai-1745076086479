import Link from "next/link"
import { BrandSignature } from "@/components/graphics/brand-signature"
import { InViewStage, MaskUp } from "@/components/ui/motion"
import { Badge, ButtonLink, Container } from "@/components/ui/primitives"
import type { Brand } from "@/content/brands"
import { solutionById } from "@/content/solutions"
import type { Locale } from "@/lib/i18n/routes"
import { path } from "@/lib/i18n/routes"

/**
 * One brand, in its own universe. The panel carries `data-brand`, so every
 * token underneath it — surfaces, text, rules, the accent, the focus ring —
 * becomes that brand's. No component below has a brand variant; they simply
 * read the tokens in scope.
 *
 * Descending the page therefore moves through seven palettes without a single
 * hardcoded colour, which is exactly what the brief asks the scroll journey
 * to do.
 */
export function BrandPanel({
  brand,
  locale,
  labels,
  index,
}: {
  brand: Brand
  locale: Locale
  labels: {
    discover: string
    visitSite: string
    noLogoYet: string
    aSyitechBrand: string
  }
  index: number
}) {
  const solution = brand.solutionId ? solutionById(brand.solutionId) : undefined
  const number = String(index + 1).padStart(2, "0")

  return (
    <section
      data-brand={brand.id}
      id={brand.id}
      className="grain relative overflow-hidden bg-page text-ink"
    >
      <Container size="wide" className="py-20 md:py-28 lg:py-32">
        <InViewStage className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="type-overline text-faint">{number}</span>
              <span aria-hidden="true" className="h-px w-10 bg-line" />
              <span className="type-overline text-accent-ink">{brand.role[locale]}</span>
            </div>

            <MaskUp>
              <BrandWordmark brand={brand} />
            </MaskUp>

            {/* The Group's endorsement is part of the architecture: a product
                never stands alone, and a partner mark never enters it. */}
            <p className="type-overline text-faint">{labels.aSyitechBrand}</p>

            {brand.statusLabel ? (
              <div>
                <Badge tone="warn">{brand.statusLabel[locale]}</Badge>
              </div>
            ) : null}

            <div className="mt-4 hidden md:block">
              <BrandSignature brand={brand.id} />
            </div>
          </div>

          <div className="flex flex-col gap-7">
            <p className="type-h2 max-w-[24ch] text-ink">{brand.positioning[locale]}</p>
            <p className="type-body-lg measure text-muted">{brand.universe[locale]}</p>

            <div className="flex flex-wrap items-center gap-3">
              {solution ? (
                <ButtonLink
                  href={path(locale, "solutions", solution.slug[locale])}
                  variant="accent"
                >
                  {labels.discover}
                </ButtonLink>
              ) : null}
              {brand.website ? (
                <a
                  href={brand.website}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="type-overline text-accent-ink underline-offset-4 hover:underline"
                >
                  {labels.visitSite}
                </a>
              ) : null}
            </div>

            {!brand.hasOfficialLogo ? (
              <p className="text-sm text-faint">{labels.noLogoYet}</p>
            ) : null}
          </div>
        </InViewStage>
      </Container>
    </section>
  )
}

/**
 * Two brands have no logo yet. Rather than borrow another brand's mark or
 * invent one, they are set in the Group's own typography and say so — the
 * treatment is provisional by design, and swapping in a real logo touches
 * this component only.
 */
function BrandWordmark({ brand }: { brand: Brand }) {
  return (
    <span className="block">
      <span className="type-display block font-display tracking-tight text-ink">{brand.name}</span>
      {!brand.hasOfficialLogo ? (
        <span aria-hidden="true" className="mt-2 block h-px w-24 bg-accent" />
      ) : null}
    </span>
  )
}

/**
 * The seven universes as one map. Each card runs in its own tokens, so the
 * grid reads as an ecosystem of distinct brands rather than a colour palette
 * applied to identical cards.
 */
export function BrandMap({
  brands,
  locale,
  label,
}: {
  brands: Brand[]
  locale: Locale
  label: string
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {brands.map((brand) => (
        <li key={brand.id} data-brand={brand.id} className="rounded-lg">
          <Link
            href={`#${brand.id}`}
            className="group flex h-full flex-col gap-3 rounded-lg border border-line bg-surface p-6 transition-colors hover:border-accent"
          >
            <span className="type-overline text-accent-ink">{brand.role[locale]}</span>
            <span className="font-display text-xl font-bold text-ink">{brand.name}</span>
            <span className="text-sm text-muted">{brand.universe[locale]}</span>
            {brand.statusLabel ? (
              <span className="mt-auto text-sm text-faint">{brand.statusLabel[locale]}</span>
            ) : (
              <span className="mt-auto text-sm text-faint" aria-hidden="true">
                {label}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
