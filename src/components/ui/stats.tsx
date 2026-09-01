import { getKpis } from "@/lib/content/queries"
import type { Locale } from "@/lib/i18n/routes"
import { formatKpiValue } from "@/lib/utils/format"

/**
 * Renders only cleared indicators. If none of the requested keys are
 * publishable the whole row returns null and the surrounding section
 * collapses — no placeholder, no dash, no "coming soon".
 */
export function StatsRow({
  keys,
  locale,
  labels,
}: {
  keys: string[]
  locale: Locale
  labels: { source: string; period: string }
}) {
  const kpis = getKpis(keys)
  if (kpis.length === 0) return null

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.key} className="flex flex-col gap-2 border-t border-line pt-5">
          <dt className="sr-only">{kpi.label[locale]}</dt>
          <dd className="flex flex-col gap-2">
            <span className="type-metric">{formatKpiValue(kpi, locale)}</span>
            <span className="text-sm text-ink">{kpi.label[locale]}</span>
            {kpi.source ? (
              <span className="type-overline text-faint">
                {labels.source} : {kpi.source[locale]} · {kpi.period}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  )
}
