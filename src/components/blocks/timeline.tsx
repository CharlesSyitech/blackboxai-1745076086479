import { Badge } from "@/components/ui/primitives"
import { Reveal } from "@/components/ui/reveal"
import type { Locale } from "@/lib/i18n/routes"
import type { TimelineEntry } from "@/types/content"

/**
 * Signature section: a luminous line running through the years, each year
 * revealing its own step. Figures appear only when cleared for publication —
 * and an objective never renders as though it were a result.
 */
export function Timeline({ entries, locale }: { entries: TimelineEntry[]; locale: Locale }) {
  if (entries.length === 0) return null

  return (
    <ol className="relative flex flex-col">
      {/* The line itself, drawn behind the markers. */}
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-4 bottom-4 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent md:left-[calc(7rem+7px)]"
      />
      {entries.map((entry, index) => (
        <Reveal
          as="li"
          key={entry.year}
          delay={Math.min(index, 6) * 70}
          className="relative grid gap-3 border-b border-line-soft py-8 pl-9 md:grid-cols-[7rem_1fr] md:gap-10 md:pl-0"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-[2.4rem] size-[15px] rounded-full border border-accent bg-page md:left-[7rem]"
          />
          <span className="type-overline text-accent-ink md:pt-1">{entry.year}</span>
          <div className="flex flex-col gap-3 md:pl-10">
            <h3 className="type-h3">{entry.title[locale]}</h3>
            <p className="measure text-muted">{entry.body[locale]}</p>
            {entry.figures && entry.figures.length > 0 ? (
              <ul className="mt-1 flex flex-wrap gap-3">
                {entry.figures.map((figure) => (
                  <li key={figure.label[locale]} className="flex items-baseline gap-2">
                    <span className="type-metric text-[1.6rem]">{figure.value[locale]}</span>
                    <span className="text-sm text-muted">{figure.label[locale]}</span>
                    {figure.kind === "objective" ? (
                      <Badge tone="warn">{locale === "fr" ? "Objectif" : "Target"}</Badge>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Reveal>
      ))}
    </ol>
  )
}
