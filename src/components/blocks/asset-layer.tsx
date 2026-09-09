import type { AssetSlot } from "@/content/assets"

/**
 * Renders a supplied asset — and nothing else.
 *
 * When the file is not in the project yet the slot renders empty rather than
 * substituting a drawn stand-in: Syitech's instruction is that no visual is
 * replaced by a generated surface, and an empty plane is honest where a
 * gradient pretending to be a photograph is not.
 *
 * `next/image` is deliberately not used here. These planes are positioned and
 * transformed by the parallax system, which needs them to fill their layer
 * exactly; the wrapper element `next/image` injects fights that, and the hero
 * art is served pre-sized rather than resized per breakpoint.
 */
export function AssetLayer({
  asset,
  present,
  className,
  fit = "cover",
  position,
}: {
  asset: AssetSlot
  /** Whether the file exists. Passed from the server so the client never probes. */
  present: boolean
  className?: string
  fit?: "cover" | "contain"
  position?: string
}) {
  if (!present) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.src}
      alt={asset.alt}
      draggable={false}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: fit,
        ...(position ? { objectPosition: position } : {}),
      }}
    />
  )
}
