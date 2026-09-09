import type { BrandId } from "@/content/brands"

/**
 * One signature motif per brand, drawn in the tokens already in scope.
 *
 * These are the `texture` and `motion` entries of design-system/brands.json
 * made literal: a waveform for Sydica, a data grid for Sytium, a card for
 * SydiCard, a ticket and its scan for KultiX, a forecast curve for SyitEx, a
 * node mesh for R&D, the orbit for the Group.
 *
 * Every motif uses currentColor and the accent token, so none of them carries
 * a colour of its own — the brand block above decides. All motion is CSS on
 * transform/opacity/stroke-dashoffset only, and stops under reduced-motion.
 */
export function BrandSignature({ brand }: { brand: BrandId }) {
  const Motif = motifs[brand]
  return (
    <div className="brand-signature relative aspect-4/3 w-full max-w-[440px]" aria-hidden="true">
      <svg viewBox="0 0 160 120" className="h-full w-full overflow-visible">
        <Motif />
      </svg>
    </div>
  )
}

const line = "var(--color-line)"
const accent = "var(--color-accent)"
const faint = "var(--color-faint)"

/** Group — the ecosystem turning around its core. */
function GroupMotif() {
  const nodes = Array.from({ length: 6 }, (_, index) => {
    const angle = (-90 + 60 * index) * (Math.PI / 180)
    return { x: 80 + 42 * Math.cos(angle), y: 60 + 42 * Math.sin(angle), index }
  })
  return (
    <g>
      <circle cx="80" cy="60" r="52" fill="none" stroke={line} strokeWidth="0.5" strokeDasharray="1 4" />
      <circle cx="80" cy="60" r="42" fill="none" stroke={line} strokeWidth="0.5" />
      {nodes.map(({ x, y, index }) => (
        <g key={index}>
          <line x1="80" y1="60" x2={x} y2={y} stroke={line} strokeWidth="0.5" />
          <circle
            className="sig-pulse"
            cx={x}
            cy={y}
            r="3"
            fill={accent}
            style={{ animationDelay: `${index * 0.4}s` }}
          />
        </g>
      ))}
      <circle cx="80" cy="60" r="10" fill="none" stroke={accent} strokeWidth="1" />
    </g>
  )
}

/** Sydica — the waveform already present in the brand's own icon. */
function SydicaMotif() {
  const bars = Array.from({ length: 28 }, (_, index) => index)
  return (
    <g>
      {bars.map((index) => {
        // A stable pseudo-random envelope: the same shape on server and client.
        const height = 8 + Math.abs(Math.sin(index * 1.7)) * 46 + Math.abs(Math.cos(index * 0.6)) * 14
        return (
          <rect
            key={index}
            className="sig-bar"
            x={12 + index * 5}
            y={60 - height / 2}
            width="2.4"
            height={height}
            rx="1.2"
            fill={index % 4 === 0 ? accent : faint}
            style={{ animationDelay: `${index * 70}ms` }}
          />
        )
      })}
    </g>
  )
}

/** Sytium — modules composing into a single grid, and a curve drawn from data. */
function SytiumMotif() {
  const cells = Array.from({ length: 12 }, (_, index) => index)
  return (
    <g>
      {cells.map((index) => (
        <rect
          key={index}
          className="sig-cell"
          x={16 + (index % 4) * 33}
          y={16 + Math.floor(index / 4) * 30}
          width="28"
          height="24"
          rx="2"
          fill="none"
          stroke={line}
          strokeWidth="0.6"
          style={{ animationDelay: `${index * 60}ms` }}
        />
      ))}
      <path
        className="sig-draw"
        d="M18 96 L46 78 L74 86 L102 58 L130 66"
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </g>
  )
}

/** SydiCard — the card in volume, and the flow leaving it. */
function SydicardMotif() {
  return (
    <g>
      <g className="sig-float">
        <rect x="34" y="30" width="92" height="58" rx="6" fill="none" stroke={line} strokeWidth="0.8" />
        <rect x="34" y="30" width="92" height="58" rx="6" fill={accent} opacity="0.06" />
        <rect x="44" y="48" width="18" height="13" rx="2" fill="none" stroke={accent} strokeWidth="0.8" />
        <line x1="44" y1="74" x2="86" y2="74" stroke={faint} strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="112" cy="74" r="4" fill={accent} />
      </g>
      {[0, 1, 2].map((index) => (
        <circle
          key={index}
          className="sig-flow"
          cx="126"
          cy="59"
          r="1.8"
          fill={accent}
          style={{ animationDelay: `${index * 0.7}s` }}
        />
      ))}
    </g>
  )
}

/** KultiX — a ticket and the scan line that admits it. */
function KultixMotif() {
  return (
    <g>
      <path
        d="M30 34 h100 v18 a8 8 0 0 0 0 16 v18 h-100 v-18 a8 8 0 0 0 0 -16 z"
        fill="none"
        stroke={line}
        strokeWidth="0.8"
      />
      <line x1="96" y1="38" x2="96" y2="82" stroke={line} strokeWidth="0.6" strokeDasharray="2 3" />
      {Array.from({ length: 9 }, (_, index) => (
        <rect
          key={index}
          x={106 + index * 2.6}
          y="50"
          width={index % 3 === 0 ? 1.6 : 0.8}
          height="20"
          fill={faint}
        />
      ))}
      <line x1="40" y1="52" x2="84" y2="52" stroke={faint} strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="62" x2="70" y2="62" stroke={faint} strokeWidth="2" strokeLinecap="round" />
      <rect className="sig-scan" x="26" y="30" width="108" height="2" rx="1" fill={accent} />
    </g>
  )
}

/** SyitEx — scores composing, and a forecast continuing past the data. */
function SyitexMotif() {
  const bars = [26, 38, 30, 52, 44, 62]
  return (
    <g>
      {bars.map((height, index) => (
        <rect
          key={index}
          className="sig-rise"
          x={18 + index * 15}
          y={92 - height}
          width="9"
          height={height}
          rx="1.5"
          fill={faint}
          style={{ animationDelay: `${index * 90}ms`, transformOrigin: `0 92px` }}
        />
      ))}
      <path
        className="sig-draw"
        d="M22 66 L37 54 L52 60 L67 38 L82 46 L97 30"
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
      {/* Past the last observation the line becomes a projection, and must keep
          looking like one: `sig-draw` would overwrite stroke-dasharray, so the
          dashed segment fades in instead of being drawn. A forecast never
          renders as if it were measured. */}
      <path
        className="sig-appear"
        d="M97 30 L118 24 L139 16"
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="3 3"
        style={{ animationDelay: "0.9s" }}
      />
      <line x1="97" y1="14" x2="97" y2="98" stroke={line} strokeWidth="0.5" strokeDasharray="2 3" />
    </g>
  )
}

/** R&D — a mesh of nodes, still being wired. */
function RdMotif() {
  const nodes = [
    [30, 34], [72, 22], [116, 40], [46, 70], [88, 62], [128, 82], [58, 100], [102, 96],
  ] as const
  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [6, 7], [7, 5],
  ] as const
  return (
    <g>
      {edges.map(([a, b], index) => {
        const from = nodes[a]
        const to = nodes[b]
        if (!from || !to) return null
        return (
          <line
            key={index}
            className="sig-draw"
            x1={from[0]}
            y1={from[1]}
            x2={to[0]}
            y2={to[1]}
            stroke={line}
            strokeWidth="0.6"
            pathLength={1}
            style={{ animationDelay: `${index * 90}ms` }}
          />
        )
      })}
      {nodes.map(([x, y], index) => (
        <circle
          key={index}
          className="sig-pulse"
          cx={x}
          cy={y}
          r={index % 3 === 0 ? 3.4 : 2.2}
          fill={index % 3 === 0 ? accent : faint}
          style={{ animationDelay: `${index * 0.35}s` }}
        />
      ))}
    </g>
  )
}

const motifs: Record<BrandId, () => React.JSX.Element> = {
  group: GroupMotif,
  sydica: SydicaMotif,
  sytium: SytiumMotif,
  sydicard: SydicardMotif,
  kultix: KultixMotif,
  syitex: SyitexMotif,
  rd: RdMotif,
}
