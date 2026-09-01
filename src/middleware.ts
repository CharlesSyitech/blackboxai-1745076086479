import { NextResponse, type NextRequest } from "next/server"
import { defaultLocale, isLocale, locales, toCanonicalSegment } from "@/lib/i18n/routes"

const PUBLIC_FILE = /\.(.*)$/

function detectLocale(request: NextRequest) {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value
  if (cookie && isLocale(cookie)) return cookie
  const header = request.headers.get("accept-language") ?? ""
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().slice(0, 2).toLowerCase()
    if (tag && isLocale(tag)) return tag
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next()
  }

  const parts = pathname.split("/").filter(Boolean)
  const first = parts[0]

  // No locale prefix: send the visitor to their language, temporarily (307),
  // so neither locale gets frozen into search indexes.
  if (!first || !isLocale(first)) {
    const url = request.nextUrl.clone()
    url.pathname = "/" + [detectLocale(request), ...parts].join("/")
    return NextResponse.redirect(url, 307)
  }

  const locale = first
  const rest = parts.slice(1)
  const canonical = rest.map((segment) => toCanonicalSegment(locale, segment))

  if (canonical.join("/") !== rest.join("/")) {
    const url = request.nextUrl.clone()
    url.pathname = "/" + [locale, ...canonical].join("/")
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
}

export { locales }
