import Link from "next/link"
import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives"
import { site } from "@/content/site"

export function HomeHero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  verticals,
}: {
  title: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  verticals: { label: string; href: string }[]
}) {
  return (
    <section className="border-b border-line bg-page">
      <Container size="wide" className="pt-14 pb-10 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col gap-7">
            <Eyebrow>{site.name}</Eyebrow>
            <h1 className="type-display-xl max-w-[19ch]">{title}</h1>
            <p className="type-body-lg max-w-[52ch] text-muted">{subtitle}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <ButtonLink href={primaryCta.href} variant="accent" size="lg">
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href={secondaryCta.href} variant="secondary" size="lg">
                {secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <HeroDiagram />
        </div>
      </Container>

      {/* The multi-vertical proof, in the first screen. */}
      <div className="border-t border-line-soft">
        <Container size="wide">
          <ul className="flex snap-x snap-mandatory gap-x-6 gap-y-2 overflow-x-auto py-4 md:flex-wrap md:justify-between md:overflow-visible">
            {verticals.map((vertical) => (
              <li key={vertical.href} className="snap-start whitespace-nowrap">
                <Link
                  href={vertical.href}
                  className="type-overline text-muted transition-colors hover:text-ink"
                >
                  {vertical.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  )
}

/**
 * Abstract representation of the Group's structure: one core, several
 * platforms, one shared technology base underneath. Pure SVG, no motion loop.
 */
function HeroDiagram() {
  const nodes = Array.from({ length: 7 }, (_, index) => {
    const angle = (-90 + (360 / 7) * index) * (Math.PI / 180)
    return { x: 50 + 33 * Math.cos(angle), y: 50 + 33 * Math.sin(angle) }
  })

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <radialGradient id="hero-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#hero-core)" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-line-soft)" strokeDasharray="0.8 2" />
        <circle cx="50" cy="50" r="33" fill="none" stroke="var(--color-line-soft)" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="var(--color-line-soft)" strokeDasharray="0.8 2" />
        {nodes.map((node, index) => (
          <g key={index}>
            <line x1="50" y1="50" x2={node.x} y2={node.y} stroke="var(--color-line)" strokeWidth="0.3" />
            <circle cx={node.x} cy={node.y} r="2.6" fill="var(--color-page)" stroke="var(--color-line-strong)" strokeWidth="0.5" />
          </g>
        ))}
        <circle cx="50" cy="50" r="6.5" fill="var(--color-brand)" />
        <circle cx="50" cy="50" r="9.5" fill="none" stroke="var(--color-accent)" strokeWidth="0.5" />
      </svg>
    </div>
  )
}
