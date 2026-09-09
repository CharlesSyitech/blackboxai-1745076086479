import Link from "next/link"
import { Section } from "@/components/ui/primitives"
import { getDictionary } from "@/content/dictionaries"
import { defaultLocale, path } from "@/lib/i18n/routes"

export default function NotFound() {
  const locale = defaultLocale
  const t = getDictionary(locale)
  const links = [
    { label: t.nav.group, href: path(locale, "group") },
    { label: t.nav.expertise, href: path(locale, "expertise") },
    { label: t.nav.solutions, href: path(locale, "solutions") },
    { label: t.nav.work, href: path(locale, "work") },
    { label: t.nav.contact, href: path(locale, "contact") },
  ]
  return (
    <Section padding="major">
      <div className="flex flex-col gap-6">
        <p className="type-overline text-accent-ink">404</p>
        <h1 className="type-h1 max-w-[16ch]">{t.states.notFoundTitle}</h1>
        <p className="measure text-muted">{t.states.notFoundBody}</p>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="link-underline text-sm">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
