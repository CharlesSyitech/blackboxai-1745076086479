import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/i18n/routes"

export default function robots(): MetadataRoute.Robots {
  // Preview and staging environments must never be indexed.
  const isProduction = process.env.NEXT_PUBLIC_ENV === "production"

  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  }
}
