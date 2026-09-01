import Link from "next/link"

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
      <div className="relative hidden aspect-[16/9] w-full md:block">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
          {points.map(({ node, x, y }) => (
            <line
              key={node.id}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="var(--color-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <circle cx="50" cy="50" r="0.6" fill="var(--color-accent)" />
        </svg>

        <div className="absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 rounded-md border border-accent bg-raised px-5 py-4 text-center">
          <span className="type-overline text-accent">{center}</span>
        </div>

        {points.map(({ node, x, y }) => (
          <Link
            key={node.id}
            href={node.href}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute w-36 -translate-x-1/2 -translate-y-1/2 rounded-md border border-line bg-raised px-3 py-2.5 text-center transition-colors hover:border-accent"
          >
            <span className="type-overline text-ink">{node.label}</span>
          </Link>
        ))}
      </div>

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
