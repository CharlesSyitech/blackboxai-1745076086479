"use client"

import { usePathname, useRouter } from "next/navigation"
import { locales, segments, type Locale, type RouteKey } from "@/lib/i18n/routes"
import { translateSlug } from "@/lib/i18n/slug-map"

/**
 * Keeps the visitor on the same page across languages by translating each
 * known route segment. Content slugs that have no translation fall back to
 * the section index rather than a 404.
 */
export function LocaleSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const target = locales.find((candidate) => candidate !== locale) ?? locale

  function translate(): string {
    const parts = pathname.split("/").filter(Boolean).slice(1)
    const translated: string[] = []
    for (const part of parts) {
      const key = (Object.keys(segments) as RouteKey[]).find(
        (candidate) => segments[candidate][locale] === part || candidate === part,
      )
      if (key) {
        translated.push(segments[key][target])
        continue
      }
      // Not a route segment, so it is a content slug. Translating it is what
      // keeps the reader on the SAME page across languages; stopping here
      // would drop them on the section index, which is what used to happen.
      const slug = translateSlug(locale, target, part)
      if (slug) {
        translated.push(slug)
        continue
      }
      // Genuinely unknown: fall back to the section index rather than build a
      // URL that would 404.
      break
    }
    return "/" + [target, ...translated].join("/")
  }

  return (
    <button
      type="button"
      lang={target}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000;samesite=lax`
        router.push(translate())
      }}
      className="type-overline text-muted transition-colors hover:text-ink"
      aria-label={`${label} : ${target === "fr" ? "Français" : "English"}`}
    >
      {target === "fr" ? "FR" : "EN"}
    </button>
  )
}
