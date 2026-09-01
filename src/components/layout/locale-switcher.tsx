"use client"

import { usePathname, useRouter } from "next/navigation"
import { locales, segments, type Locale, type RouteKey } from "@/lib/i18n/routes"

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
      } else {
        // Unknown segment: a content slug. Stop at the section index.
        break
      }
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
