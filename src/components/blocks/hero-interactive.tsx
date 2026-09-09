"use client"

import type { CSSProperties, ReactNode } from "react"
import { usePointerParallax } from "@/lib/hooks/use-pointer-parallax"
import { cn } from "@/lib/utils/format"

/**
 * The interactive stage of the hero.
 *
 * It owns the single pointer listener and publishes the smoothed values every
 * layer below reads. Layers never listen themselves, so depth costs nothing:
 * adding one is adding a div.
 *
 * NOTE ON THE PORTRAIT. The brief describes a photographed figure reacting to
 * the pointer. No photograph exists in this repository yet, so the same
 * machinery drives the vector scene instead, and `HeroPortrait` is built as
 * the slot that receives the cut-out when it arrives — see its comment.
 */
export function HeroInteractive({ children, className }: { children: ReactNode; className?: string }) {
  const ref = usePointerParallax<HTMLDivElement>()
  return (
    <div ref={ref} data-pointer="out" className={cn("hero-stage", className)}>
      {children}
    </div>
  )
}

/**
 * One plane of the scene. `depth` is the movement factor from the brief:
 * distant things move least, foreground light moves most, and the difference
 * between them is what reads as depth.
 *
 * The pointer transform sits on this element and the idle drift on the child,
 * so the two never overwrite one another.
 */
export function ParallaxLayer({
  depth,
  children,
  className,
  idle,
}: {
  depth: number
  children: ReactNode
  className?: string
  /** Slow ambient motion that plays whether or not a pointer is present. */
  idle?: "float" | "drift" | "zoom" | "none"
}) {
  return (
    <div
      className={cn("parallax-layer", className)}
      style={{ "--depth": depth } as CSSProperties}
    >
      <div className={cn("parallax-inner", idle && idle !== "none" && `idle-${idle}`)}>
        {children}
      </div>
    </div>
  )
}

/**
 * The slot for the figure.
 *
 * Today it renders whatever scene it is given — currently the ecosystem
 * diagram — with the perspective, differential displacement and scale that
 * create the illusion of a reacting subject.
 *
 * When a cut-out figure exists as a transparent PNG/WebP, pass it as `src`:
 * the layer stack, the springs and every other effect stay exactly as they
 * are. Nothing else in the hero changes.
 *
 * What this deliberately does NOT do is warp the image to fake a turning
 * head. A single flat photograph cannot rotate, and pretending otherwise is
 * how a premium hero starts looking like a novelty.
 */
export function HeroPortrait({
  children,
  src,
  alt,
}: {
  children?: ReactNode
  src?: string
  alt?: string
}) {
  return (
    <div className="hero-portrait">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="hero-portrait-image" draggable={false} />
      ) : (
        children
      )}
    </div>
  )
}

/**
 * The specular highlight.
 *
 * On the current vector scene this is the light that grazes the diagram core
 * as the pointer moves. It is the component the brief calls GlassesGlow: once
 * a portrait is supplied, positioning it over the lenses makes it read as the
 * eyewear catching the light, with no change to its behaviour.
 *
 * It brightens with pointer speed rather than blinking — the interface
 * responds to presence, it does not signal.
 */
export function HeroSheen({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("hero-sheen", className)} />
}

/**
 * The light field that follows the pointer.
 *
 * Rather than compute a distance per node every frame, the field is drawn
 * twice: a dim resting copy, and a bright copy revealed only through a soft
 * radial mask centred on the pointer. Nodes and links therefore brighten as
 * the pointer nears them for the cost of two composited layers and no
 * per-node maths at all.
 */
export function TechParticles({ nodes }: { nodes: { x: number; y: number; r: number }[] }) {
  const field = (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      {nodes.map((node, index) => {
        const next = nodes[(index + 1) % nodes.length]
        return (
          <g key={index}>
            {next ? (
              <line
                x1={node.x}
                y1={node.y}
                x2={next.x}
                y2={next.y}
                stroke="var(--color-accent)"
                strokeWidth="0.12"
              />
            ) : null}
            <circle cx={node.x} cy={node.y} r={node.r} fill="var(--color-accent)" />
          </g>
        )
      })}
    </svg>
  )

  return (
    <div aria-hidden="true" className="tech-particles">
      <div className="tech-particles-rest">{field}</div>
      <div className="tech-particles-lit">{field}</div>
    </div>
  )
}

/**
 * A ring that appears around the pointer inside the visual zone, with a label
 * naming what the zone offers.
 *
 * It is drawn in addition to the system cursor, not instead of it, and only
 * within this one element — replacing the cursor across a site costs more in
 * usability than it returns in atmosphere.
 */
export function InteractiveCursor({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="interactive-cursor">
      <span className="interactive-cursor-anchor">
        <span className="interactive-cursor-body">
          <span className="interactive-cursor-ring" />
          <span className="interactive-cursor-label">{label}</span>
        </span>
      </span>
    </div>
  )
}
