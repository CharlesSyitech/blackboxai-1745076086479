import type { Metadata } from "next"
import { site } from "@/content/site"
import { absoluteUrl, locales, segments, siteUrl, type Locale, type RouteKey } from "@/lib/i18n/routes"

/**
 * Single place where page metadata is composed. hreflang is derived from the
 * routing table, so alternates can never drift from the actual URLs.
 */
export function buildMetadata({
  locale,
  title,
  description,
  routeKeys = [],
  slug,
  noindex = false,
}: {
  locale: Locale
  title: string
  description: string
  /** Canonical route keys for this page, e.g. ["solutions"]. */
  routeKeys?: RouteKey[]
  /** Optional localized content slug, keyed by locale. */
  slug?: Record<Locale, string>
  noindex?: boolean
}): Metadata {
  const buildPath = (target: Locale) => {
    const parts: string[] = routeKeys.map((key) => segments[key][target])
    if (slug) parts.push(slug[target])
    return "/" + [target, ...parts].join("/")
  }

  const canonical = buildPath(locale)
  const languages: Record<string, string> = {}
  for (const candidate of locales) {
    languages[candidate] = absoluteUrl(buildPath(candidate))
  }
  languages["x-default"] = absoluteUrl(buildPath("en"))

  const fullTitle = title === site.name ? `${site.name} — ${site.signature}` : `${title} | ${site.name}`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: absoluteUrl(canonical), languages },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description,
      url: absoluteUrl(canonical),
      locale: locale === "fr" ? "fr_FR" : "en_GB",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  }
}
