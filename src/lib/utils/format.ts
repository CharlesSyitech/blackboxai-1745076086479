import type { Locale } from "@/lib/i18n/routes"
import type { Kpi } from "@/types/content"

export function formatKpiValue(kpi: Kpi, locale: Locale): string {
  if (kpi.value === null) return ""
  const value = kpi.value

  if (kpi.displayFormat === "compact" && Math.abs(value) >= 1000) {
    const compact = new Intl.NumberFormat(locale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
    return kpi.unit === "plus" ? `${compact}+` : compact
  }

  const formatted = new Intl.NumberFormat(locale).format(value)
  if (kpi.unit === "percent") return `${formatted} %`
  if (kpi.unit === "plus") return `${formatted}+`
  return formatted
}

export function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(value),
  )
}

export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ")
}
