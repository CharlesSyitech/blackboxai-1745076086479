import Link from "next/link"

export interface GraphNode {
  id: string
  label: string
  hint?: string
  href: string
}

function polar(index: number, total: number, radiusX: number, radiusY: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180)
  return {
    x: 50 + radiusX * Math.cos(angle),
    y: 50 + radiusY * Math.sin(angle),
  }
}

/**
 * Signature graphic. Three renderings, all present at once:
 *  - the positioned diagram (>= lg)
 *  - a plain card grid (< lg, and whenever the diagram is hidden)
 *  - the same links as real anchors, so it is navigable and readable
 *    by assistive technology with no JavaScript involved.
 */
export function EcosystemGraph({
  center,
  nodes,
  foundation,
  foundationLabel,
}: {
  center: string
  nodes: GraphNode[]
  foundation: string[]
  foundationLabel: string
}) {
  const points = nodes.map((node, index) => ({ node, ...polar(index, nodes.length, 37, 39) }))

  return (
    <div>
      <div className="relative hidden aspect-[16/11] w-full lg:block">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <ellipse
            cx="50"
            cy="50"
            rx="44"
            ry="46"
            fill="none"
            stroke="var(--color-line-soft)"
            strokeDasharray="1 2"
            vectorEffect="non-scaling-stroke"
          />
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
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-md border border-line-strong bg-raised px-6 py-4 text-center shadow-sm">
            <span className="type-overline text-accent-ink">{center}</span>
          </div>
        </div>

        {points.map(({ node, x, y }) => (
          <Link
            key={node.id}
            href={node.href}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="group absolute w-40 -translate-x-1/2 -translate-y-1/2 rounded-md border border-line bg-raised px-4 py-3 text-center transition-all duration-200 hover:-translate-y-[calc(50%+2px)] hover:border-line-strong hover:shadow-md"
          >
            <span className="block text-[0.82rem] font-semibold text-ink">{node.label}</span>
            {node.hint ? <span className="mt-0.5 block text-[0.7rem] text-muted">{node.hint}</span> : null}
          </Link>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {nodes.map((node) => (
          <li key={node.id}>
            <Link
              href={node.href}
              className="flex h-full flex-col gap-1 rounded-md border border-line bg-raised px-4 py-3.5 transition-colors hover:border-line-strong"
            >
              <span className="text-[0.92rem] font-semibold">{node.label}</span>
              {node.hint ? <span className="text-[0.78rem] text-muted">{node.hint}</span> : null}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line-soft pt-6">
        <span className="type-overline text-faint">{foundationLabel}</span>
        {foundation.map((item) => (
          <span key={item} className="type-overline rounded-sm border border-line-soft px-2 py-1 text-muted">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
