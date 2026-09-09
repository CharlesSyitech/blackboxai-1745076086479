import Link from "next/link"
import { InViewStage } from "@/components/ui/motion"

export interface EngineNode {
  id: string
  label: string
  href: string
}

function polar(index: number, total: number, radiusX: number, radiusY: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180)
  return { x: 50 + radiusX * Math.cos(angle), y: 50 + radiusY * Math.sin(angle) }
}

export function TechnologyEngine({
  center,
  technologies,
  appliedLabel,
  applications,
}: {
  center: string
  technologies: EngineNode[]
  appliedLabel: string
  applications: { id: string; label: string; href: string }[]
}) {
  const points = technologies.map((node, index) => ({
    node,
    ...polar(index, technologies.length, 34, 36),
  }))

  return (
    <div className="flex flex-col gap-10">
      <InViewStage className="graph-focus relative mx-auto hidden aspect-[2/1] w-full max-w-[880px] md:block">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
          {points.map(({ node, x, y }, index) => (
            <g key={node.id}>
              <line
                className="draw"
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="var(--color-line-strong)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                style={
                  {
                    "--len": Math.hypot(x - 50, y - 50),
                    "--draw-delay": `${index * 80}ms`,
                  } as React.CSSProperties
                }
              />
              <line
                className="orbit-pulse"
                x1={x}
                y1={y}
                x2="50"
                y2="50"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ animationDelay: `${index * 0.4}s` }}
              />
            </g>
          ))}
          <circle cx="50" cy="50" r="0.6" fill="var(--color-accent)" />
        </svg>

        <div className="absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 rounded-md border border-accent bg-raised px-5 py-4 text-center">
          <span className="type-overline text-accent">{center}</span>
        </div>

        {points.map(({ node, x, y }, index) => (
          <Link
            key={node.id}
            href={node.href}
            style={
              { left: `${x}%`, top: `${y}%`, "--settle-delay": `${450 + index * 80}ms` } as React.CSSProperties
            }
            className="settle absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-md border border-line bg-raised px-3 py-2.5 text-center transition-colors hover:border-accent"
          >
            <span className="type-overline text-ink">{node.label}</span>
          </Link>
        ))}
      </InViewStage>

      <ul className="grid grid-cols-2 gap-3 md:hidden">
        {technologies.map((node) => (
          <li key={node.id}>
            <Link
              href={node.href}
              className="flex h-full items-center justify-center rounded-md border border-line px-3 py-3 text-center"
            >
              <span className="type-overline text-ink">{node.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 border-t border-line-soft pt-8">
        <span className="type-overline text-faint">{appliedLabel}</span>
        <ul className="flex flex-wrap gap-2">
          {applications.map((application) => (
            <li key={application.id}>
              <Link
                href={application.href}
                className="inline-flex rounded-sm border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-ink"
              >
                {application.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
