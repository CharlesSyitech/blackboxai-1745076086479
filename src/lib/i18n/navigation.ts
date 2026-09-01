import { getDictionary } from "@/content/dictionaries"
import type { NavChild, NavItem } from "@/components/layout/header"
import type { FooterColumn } from "@/components/layout/footer"
import { getLegalDocuments } from "@/content/legal"
import { getAwards, getExpertises, getPeople, getSolutions } from "@/lib/content/queries"
import { path, type Locale } from "@/lib/i18n/routes"

/**
 * Navigation is derived from the data. Sections with nothing publishable
 * (leadership, awards) do not appear in the menu at all.
 */
export function buildNavigation(locale: Locale) {
  const t = getDictionary(locale)

  const groupChildren: NavChild[] = [
    { label: locale === "fr" ? "Notre histoire" : "Our history", href: path(locale, "group", "history") },
    { label: locale === "fr" ? "Vision & Mission" : "Vision & Mission", href: path(locale, "group", "vision-mission") },
    { label: locale === "fr" ? "Gouvernance" : "Governance", href: path(locale, "group", "governance") },
    { label: locale === "fr" ? "Présence internationale" : "Global presence", href: path(locale, "group", "presence") },
  ]
  if (getPeople().length > 0) {
    groupChildren.splice(3, 0, {
      label: locale === "fr" ? "Leadership" : "Leadership",
      href: path(locale, "group", "leadership"),
    })
  }
  if (getAwards().length > 0) {
    groupChildren.push({
      label: locale === "fr" ? "Distinctions" : "Awards",
      href: path(locale, "group", "awards"),
    })
  }

  const items: NavItem[] = [
    {
      label: t.nav.group,
      href: path(locale, "group"),
      children: [
        { label: locale === "fr" ? "À propos" : "About", href: path(locale, "group") },
        ...groupChildren,
      ],
    },
    {
      label: t.nav.expertise,
      href: path(locale, "expertise"),
      children: getExpertises().map((expertise) => ({
        label: expertise.name[locale],
        href: path(locale, "expertise", expertise.slug[locale]),
      })),
    },
    {
      label: t.nav.solutions,
      href: path(locale, "solutions"),
      children: getSolutions().map((solution) => ({
        label: solution.name,
        href: path(locale, "solutions", solution.slug[locale]),
        hint: solution.vertical,
      })),
    },
    { label: t.nav.technology, href: path(locale, "technology") },
    { label: t.nav.work, href: path(locale, "work") },
    { label: t.nav.impact, href: path(locale, "impact") },
    { label: t.nav.partners, href: path(locale, "partners") },
    { label: t.nav.news, href: path(locale, "news") },
  ]

  const utility: NavChild[] = [
    { label: t.nav.investors, href: path(locale, "investors") },
    { label: t.nav.careers, href: path(locale, "careers") },
    { label: t.nav.contact, href: path(locale, "contact") },
  ]

  const footerColumns: FooterColumn[] = [
    {
      title: t.nav.group,
      links: [
        { label: locale === "fr" ? "À propos" : "About", href: path(locale, "group") },
        ...groupChildren.map((child) => ({ label: child.label, href: child.href })),
      ],
    },
    {
      title: t.nav.expertise,
      links: getExpertises().map((expertise) => ({
        label: expertise.name[locale],
        href: path(locale, "expertise", expertise.slug[locale]),
      })),
    },
    {
      title: t.nav.solutions,
      links: getSolutions().map((solution) => ({
        label: solution.name,
        href: path(locale, "solutions", solution.slug[locale]),
      })),
    },
    {
      title: locale === "fr" ? "Ressources" : "Resources",
      links: [
        { label: t.nav.technology, href: path(locale, "technology") },
        { label: t.nav.work, href: path(locale, "work") },
        { label: t.nav.impact, href: path(locale, "impact") },
        { label: t.nav.partners, href: path(locale, "partners") },
        { label: t.nav.news, href: path(locale, "news") },
        { label: t.nav.investors, href: path(locale, "investors") },
        { label: t.nav.careers, href: path(locale, "careers") },
        { label: t.nav.contact, href: path(locale, "contact") },
      ],
    },
  ]

  // A legal document that cannot be published honestly (missing registry
  // facts) is neither routed nor linked.
  const legalLinks = getLegalDocuments().map((document) => ({
    label: document.title[locale],
    href: path(locale, "legal", document.slug[locale]),
  }))

  return { items, utility, footerColumns, legalLinks }
}
