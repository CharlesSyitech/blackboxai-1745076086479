import Link from "next/link"
import { Tilt, WordReveal } from "@/components/ui/motion"
import { ButtonLink, Container } from "@/components/ui/primitives"
import { site } from "@/content/site"

export interface HeroNode {
  id: string
  label: string
  hint: string
  href: string
}

/**
 * Opening statement. Ink surface, one soft light source, and the Group's
 * actual ecosystem turning around its core — the diagram is the argument,
 * not decoration: one core, seven platforms, one shared foundation.
 */
export function HomeHero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  verticals,
  nodes,
  foundation,
}: {
  title: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  verticals: { label: string; href: string }[]
  nodes: HeroNode[]
  foundation: string[]
}) {
  return (
    <section data-theme="dark" className="grain relative overflow-hidden bg-page">
      <Container size="wide" className="relative pt-12 pb-16 md:pt-16 md:pb-20 lg:pt-20 lg:pb-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="stage flex flex-col gap-7">
            <p className="type-overline text-accent">{site.name}</p>
            <WordReveal as="h1" text={title} delay={120} className="type-display-xl max-w-[16ch] text-ink" />
            <p className="type-body-lg max-w-[54ch] text-muted">{subtitle}</p>
            <div className="mt-1 flex flex-wrap gap-3">
              <ButtonLink href={primaryCta.href} variant="accent" size="lg">
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href={secondaryCta.href} variant="secondary" size="lg">
                {secondaryCta.label}
              </ButtonLink>
            </div>
            <p className="type-overline pt-2 text-faint">{site.signature}</p>
          </div>

          <Tilt>
            <OrbitalEcosystem nodes={nodes} foundation={foundation} />
          </Tilt>
        </div>
      </Container>

      <VerticalsMarquee verticals={verticals} />
    </section>
  )
}

function polar(index: number, total: number, radius: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180)
  return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) }
}

function OrbitalEcosystem({ nodes, foundation }: { nodes: HeroNode[]; foundation: string[] }) {
  const points = nodes.map((node, index) => ({ node, ...polar(index, nodes.length, 36) }))

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="halo left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle
          className="orbit-ring"
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="0.25"
          strokeDasharray="0.6 2.4"
        />
        <circle cx="50" cy="50" r="36" fill="none" stroke="var(--color-line-soft)" strokeWidth="0.25" />

        {points.map(({ node, x, y }, index) => (
          <g key={node.id}>
            <line x1="50" y1="50" x2={x} y2={y} stroke="var(--color-line-soft)" strokeWidth="0.25" />
            {/* A pulse travelling from the core to each platform. */}
            <line
              className="orbit-pulse"
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="var(--color-accent)"
              strokeWidth="0.5"
              strokeLinecap="round"
              style={{ animationDelay: `${index * 0.45}s` }}
            />
          </g>
        ))}

        <circle className="orbit-core" cx="50" cy="50" r="9" fill="var(--color-accent)" opacity="0.22" />
        <circle cx="50" cy="50" r="6.5" fill="var(--color-raised)" stroke="var(--color-accent)" strokeWidth="0.4" />
      </svg>

      {/* Real links, positioned by the same maths that draws the spokes. */}
      <ul className="absolute inset-0">
        {points.map(({ node, x, y }, index) => (
          <li
            key={node.id}
            className="orbit-node absolute"
            style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${400 + index * 70}ms` }}
          >
            <Link
              href={node.href}
              className="group block -translate-x-1/2 -translate-y-1/2 rounded-md border border-line bg-raised/85 px-3 py-2 text-center backdrop-blur-sm transition-colors hover:border-accent"
            >
              <span className="block text-[0.78rem] font-semibold whitespace-nowrap text-ink">{node.label}</span>
              <span className="type-overline block text-[0.6rem] text-faint">{node.hint}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="type-overline absolute inset-x-0 bottom-0 text-center text-faint">
        {foundation.join(" · ")}
      </p>
    </div>
  )
}

/**
 * The seven verticals, in continuous motion. This is the proof that closes
 * the "mono-product" reading within the first screen. Pauses on hover and
 * on keyboard focus, and holds still under reduced-motion.
 */
function VerticalsMarquee({ verticals }: { verticals: { label: string; href: string }[] }) {
  return (
    <div className="marquee relative border-t border-line-soft py-4">
      <div className="flex w-max min-w-full gap-10 overflow-hidden">
        <ul className="marquee-track flex shrink-0 items-center gap-10 pr-10" aria-label={undefined}>
          {[...verticals, ...verticals].map((vertical, index) => (
            <li key={`${vertical.href}-${index}`} className="flex items-center gap-10 whitespace-nowrap">
              <Link
                href={vertical.href}
                className="type-overline text-faint transition-colors hover:text-accent"
                aria-hidden={index >= verticals.length}
                tabIndex={index >= verticals.length ? -1 : undefined}
              >
                {vertical.label}
              </Link>
              <span aria-hidden="true" className="text-accent/50">
                ◆
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
