import { site } from "@/content/site"
import { absoluteUrl, type Locale } from "@/lib/i18n/routes"
import type { CaseStudy, Solution } from "@/types/content"

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: absoluteUrl(`/${locale}`),
    description: site.description[locale],
    slogan: site.signature,
    email: site.contact.email,
    address: { "@type": "PostalAddress", addressLocality: "Abidjan", addressCountry: "CI" },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}

export function softwareApplicationJsonLd(solution: Solution, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: solution.name,
    applicationCategory: "BusinessApplication",
    description: solution.tagline[locale],
    publisher: { "@type": "Organization", name: site.name },
  }
}

export function eventJsonLd(study: CaseStudy, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: study.title[locale],
    startDate: study.date,
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: study.location[locale] },
    organizer: { "@type": "Organization", name: site.name },
  }
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Schema payloads are built from typed content, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
