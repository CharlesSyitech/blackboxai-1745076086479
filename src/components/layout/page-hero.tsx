import Link from "next/link"
import { Container, Eyebrow } from "@/components/ui/primitives"
import type { BrandId } from "@/content/brands"

export interface Crumb {
  label: string
  href: string
}

export function Breadcrumb({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="type-overline text-faint">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="type-overline text-muted transition-colors hover:text-ink">
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="type-overline text-faint">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  crumbLabel,
  aside,
  tone = "page",
  brand,
}: {
  eyebrow?: string
  title: string
  intro?: string
  crumbs?: Crumb[]
  crumbLabel: string
  aside?: React.ReactNode
  tone?: "page" | "surface" | "ink"
  /**
   * Runs the hero in a brand's own tokens. A product is introduced in its own
   * universe rather than in the Group's, which is the rule stated in
   * design-system/brands.json; the body below stays on the shared neutral
   * ground so long-form reading is unaffected.
   */
  brand?: BrandId
}) {
  return (
    <section
      {...(brand ? { "data-brand": brand } : tone === "ink" ? { "data-theme": "dark" as const } : {})}
      className={
        "grain border-b border-line " +
        (brand ? "bg-page" : tone === "surface" ? "bg-surface" : "bg-page") +
        " text-ink"
      }
    >
      <Container size="wide" className="py-12 md:py-16 lg:py-20">
        {crumbs?.length ? (
          <div className="mb-8">
            <Breadcrumb items={crumbs} label={crumbLabel} />
          </div>
        ) : null}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-5">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h1 className="type-display max-w-[18ch]">{title}</h1>
          </div>
          <div className="flex flex-col gap-6">
            {intro ? <p className="type-body-lg measure text-muted">{intro}</p> : null}
            {aside}
          </div>
        </div>
      </Container>
    </section>
  )
}
