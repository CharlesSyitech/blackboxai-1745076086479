import Link from "next/link"
import {
  HeroInteractive,
  HeroPortrait,
  HeroSheen,
  InteractiveCursor,
  ParallaxLayer,
  TechParticles,
} from "@/components/blocks/hero-interactive"
import { AssetLayer } from "@/components/blocks/asset-layer"
import { BrandSignature } from "@/components/graphics/brand-signature"
import { WordReveal } from "@/components/ui/motion"
import { Badge, ButtonLink, Container } from "@/components/ui/primitives"
import type { BrandId } from "@/content/brands"
import { brandLogoVariants, heroLayers, productCards } from "@/content/assets"
import { brandCards, heroRail, homeFigures } from "@/content/home-figures"
import type { Locale } from "@/lib/i18n/routes"
import { path } from "@/lib/i18n/routes"

/**
 * The homepage as laid out in the composition Syitech Group supplied:
 * a full-bleed opening, the six brands as a single band of cards, the
 * figures rule, the group statement beside its film, and the ecosystem.
 *
 * ON IMAGERY. The composition shows photography in the opening, in each
 * card and behind the ecosystem. No photograph exists in this project, so
 * each of those places is built as a composed surface — the brand's own
 * ground, its signature motif, its light — rather than a grey box waiting
 * for an asset. Every one of them takes a picture the moment there is one:
 * the opening through `HeroPortrait src`, the cards through `image`.
 */

/* ── 1. Opening ─────────────────────────────────────────────────────────── */

export function ShowcaseHero({
  locale,
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  primaryCta,
  videoCta,
  cursorLabel,
  nodes,
  assets,
}: {
  locale: Locale
  eyebrow: string
  /** The statement, and the clause the accent carries. */
  titleLead: string
  titleAccent: string
  subtitle: string
  primaryCta: { label: string; href: string }
  videoCta: string
  cursorLabel: string
  nodes: { id: string; label: string; hint: string; href: string }[]
  /** Which hero planes have been supplied, resolved on the server. */
  assets: Record<"background" | "network" | "portrait" | "hud" | "glow", boolean>
}) {
  return (
    <section data-theme="dark" className="grain hero-grain relative overflow-hidden bg-page">
      {/* The visual runs to the right edge, as in the composition. Each plane
          is its own supplied file, moving by its own factor — that separation
          is what produces depth. A plane whose file has not arrived renders
          nothing; none of them is stood in for. */}
      <div className="showcase-hero-visual" aria-hidden="true">
        <HeroInteractive className="h-full w-full">
          <ParallaxLayer depth={heroLayers.background.depth}>
            <AssetLayer asset={heroLayers.background} present={assets.background} position="center right" />
          </ParallaxLayer>

          <ParallaxLayer depth={heroLayers.network.depth} idle="drift">
            <AssetLayer asset={heroLayers.network} present={assets.network} fit="contain" />
            {!assets.network ? <TechParticles nodes={heroField} /> : null}
          </ParallaxLayer>

          <ParallaxLayer depth={heroLayers.portrait.depth} idle="float">
            {assets.portrait ? (
              // Held to the ±8px of travel the art direction fixes; the
              // figure reacts, it is never swung around.
              <div className="showcase-hero-portrait">
                <HeroPortrait src={heroLayers.portrait.src} alt={heroLayers.portrait.alt} />
              </div>
            ) : (
              <div className="showcase-orbit-frame">
                <HeroPortrait>
                  <ShowcaseOrbit nodes={nodes} />
                </HeroPortrait>
              </div>
            )}
          </ParallaxLayer>

          <ParallaxLayer depth={heroLayers.hud.depth} idle="drift">
            <AssetLayer asset={heroLayers.hud} present={assets.hud} fit="contain" />
          </ParallaxLayer>

          {/* Light is its own plane, never baked into the portrait, so it can
              follow the pointer independently. */}
          <ParallaxLayer depth={heroLayers.glow.depth}>
            <AssetLayer asset={heroLayers.glow} present={assets.glow} />
            <HeroSheen />
          </ParallaxLayer>

          <ParallaxLayer depth={0.85}>
            <InteractiveCursor label={cursorLabel} />
          </ParallaxLayer>
        </HeroInteractive>
      </div>

      <Container size="wide" className="relative z-2 py-16 md:py-20 lg:py-28">
        <div className="stage flex max-w-[46rem] flex-col gap-7">
          <p className="type-overline text-faint">{eyebrow}</p>
          <h1 className="type-display-xl text-ink">
            <WordReveal as="span" text={titleLead} className="block" />
            <WordReveal as="span" text={titleAccent} delay={260} className="block text-accent" />
          </h1>
          <p className="type-body-lg max-w-[46ch] text-muted">{subtitle}</p>
          <div className="mt-1 flex flex-wrap gap-3">
            <ButtonLink href={primaryCta.href} variant="secondary" size="lg">
              {primaryCta.label}
            </ButtonLink>
            <Link href="#film" className="showcase-video-cta">
              <span aria-hidden="true" className="showcase-play" />
              {videoCta}
            </Link>
          </div>
        </div>
      </Container>

      {/* The rail, reading down the right edge. */}
      <ul className="showcase-rail" aria-hidden="true">
        {heroRail.map((word) => (
          <li key={word.en} className="type-overline text-faint">
            {word[locale]}
          </li>
        ))}
      </ul>
    </section>
  )
}

const heroField = [
  { x: 14, y: 18, r: 0.6 }, { x: 38, y: 8, r: 0.4 }, { x: 66, y: 14, r: 0.55 },
  { x: 88, y: 28, r: 0.45 }, { x: 94, y: 58, r: 0.6 }, { x: 76, y: 82, r: 0.4 },
  { x: 48, y: 92, r: 0.55 }, { x: 20, y: 76, r: 0.45 }, { x: 7, y: 46, r: 0.55 },
  { x: 32, y: 52, r: 0.35 }, { x: 70, y: 44, r: 0.35 }, { x: 54, y: 30, r: 0.3 },
]

/** The brands turning around the Group, as in the composition's opening. */
function ShowcaseOrbit({ nodes }: { nodes: { id: string; label: string; href: string }[] }) {
  const points = nodes.slice(0, 6).map((node, index) => {
    const angle = (-90 + (360 / Math.min(nodes.length, 6)) * index) * (Math.PI / 180)
    return { node, x: 50 + 34 * Math.cos(angle), y: 50 + 34 * Math.sin(angle) }
  })
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-line)" strokeWidth="0.2" strokeDasharray="0.6 2.4" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="var(--color-line-soft)" strokeWidth="0.2" />
        {points.map(({ x, y }, index) => (
          <g key={index}>
            <line x1="50" y1="50" x2={x} y2={y} stroke="var(--color-line-soft)" strokeWidth="0.2" />
            <circle className="orbit-pulse" cx={x} cy={y} r="1.2" fill="var(--color-accent)"
              style={{ animationDelay: `${index * 0.5}s` }} />
          </g>
        ))}
        <circle cx="50" cy="50" r="11" fill="var(--color-accent)" opacity="0.14" />
        <circle cx="50" cy="50" r="8" fill="var(--color-raised)" stroke="var(--color-accent)" strokeWidth="0.3" />
      </svg>
      <ul className="absolute inset-0">
        {points.map(({ node, x, y }) => (
          <li key={node.id} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className="showcase-orbit-chip">{node.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── 2. The six brands ──────────────────────────────────────────────────── */

export function BrandBand({
  locale,
  label,
  assets,
}: {
  locale: Locale
  label: string
  /** Which logos and card visuals have been supplied, keyed by brand. */
  assets: Record<string, { logo: boolean; visual: boolean }>
}) {
  return (
    <section aria-label={label} className="showcase-band">
      {brandCards.map((card) => {
        const href = card.href ? path(locale, "solutions", card.href) : path(locale, "brands")
        const supplied = assets[card.brandId] ?? { logo: false, visual: false }
        const mark = brandLogoVariants[card.brandId]
        const logoSrc = mark?.onDark
        const visualSrc = productCards[card.brandId]
        return (
          <article key={card.brandId} data-brand={card.brandId} className="showcase-card">
            <Link href={href} className="showcase-card-link">
              <header className="flex flex-col gap-3">
                {/* The brand's own mark where it exists. Never redrawn, never
                    recoloured; the wordmark stands in only until it arrives. */}
                {supplied.logo && logoSrc ? (
                  <span
                    className="showcase-card-logo"
                    style={{ "--content-height": mark?.contentHeight ?? 1 } as React.CSSProperties}
                  >
                    <AssetLayer
                      asset={{ src: logoSrc, alt: card.name }}
                      present
                      fit="contain"
                      position="left center"
                    />
                  </span>
                ) : (
                  <span className="showcase-card-name">{card.name}</span>
                )}
                <span className="showcase-card-headline">{card.headline[locale]}</span>
              </header>

              <div className="showcase-card-visual">
                {supplied.visual && visualSrc ? (
                  <AssetLayer asset={{ src: visualSrc, alt: "" }} present className="showcase-card-image" />
                ) : (
                  <BrandSignature brand={card.brandId as BrandId} />
                )}
                {card.badge ? (
                  <span className="showcase-card-badge">
                    <Badge tone="warn">{card.badge[locale]}</Badge>
                  </span>
                ) : null}
              </div>

              <footer className="showcase-card-footer">
                <span>{card.footer[locale]}</span>
                <span aria-hidden="true" className="showcase-card-arrow">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </footer>
            </Link>
          </article>
        )
      })}
    </section>
  )
}

/* ── 3. The figures rule ────────────────────────────────────────────────── */

export function FigureRule({ locale }: { locale: Locale }) {
  return (
    <section className="showcase-figures">
      <Container size="wide">
        <ul className="showcase-figures-list">
          {homeFigures.map((figure) => (
            <li key={figure.id} className="showcase-figure">
              <FigureMark icon={figure.icon} />
              <div className="flex flex-col">
                <span className="showcase-figure-value">{figure.value}</span>
                <span className="showcase-figure-label">{figure.label[locale]}</span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/** A distinct mark per figure — never the same glyph repeated five times. */
function FigureMark({ icon }: { icon: string }) {
  const paths: Record<string, React.ReactNode> = {
    founded: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
    solutions: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" /></>,
    countries: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" /></>,
    distributed: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M17 11a3 3 0 1 0-2-5.2M21 20a5 5 0 0 0-4-4.9" /></>,
    vision: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="showcase-figure-mark">
      {paths[icon]}
    </svg>
  )
}

/* ── 4. The group statement, beside its film ────────────────────────────── */

export function GroupStatement({
  eyebrow,
  titleLead,
  titleAccent,
  body,
  cta,
  filmLabel,
  filmPlace,
}: {
  eyebrow: string
  titleLead: string
  titleAccent: string
  body: string
  cta: { label: string; href: string }
  filmLabel: string
  filmPlace: string
}) {
  return (
    <section id="film" className="showcase-statement">
      <Container size="wide">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <p className="type-overline text-faint">{eyebrow}</p>
            <h2 className="type-display text-ink">
              {titleLead} <span className="text-accent-ink">{titleAccent}</span>
            </h2>
            <p className="type-body-lg measure text-muted">{body}</p>
            <div>
              <ButtonLink href={cta.href} variant="primary" size="lg">
                {cta.label}
              </ButtonLink>
            </div>
          </div>

          {/* The film's place. A composed surface until there is footage; the
              caption names where it was shot, as the composition does. */}
          <div data-theme="dark" className="showcase-film">
            <div className="showcase-film-surface" aria-hidden="true" />
            <div className="showcase-film-body">
              <span className="showcase-film-play" aria-hidden="true" />
              <span className="showcase-film-label">{filmLabel}</span>
            </div>
            <span className="showcase-film-place">{filmPlace}</span>
          </div>
        </div>
      </Container>
    </section>
  )
}
