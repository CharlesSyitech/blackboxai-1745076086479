import Link from "next/link"
import { Container } from "@/components/ui/primitives"
import { site } from "@/content/site"
import type { Locale } from "@/lib/i18n/routes"

export interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

export function Footer({
  locale,
  columns,
  legalLinks,
  strings,
}: {
  locale: Locale
  columns: FooterColumn[]
  legalLinks: { label: string; href: string }[]
  strings: { rights: string; footerNav: string }
}) {
  const year = new Date().getFullYear()

  return (
    <footer data-theme="dark" className="bg-page text-ink">
      <Container size="wide" className="py-16 md:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
          <div className="flex max-w-sm flex-col gap-4">
            <span className="font-display text-base font-extrabold tracking-[-0.02em]">SYITECH GROUP</span>
            <p className="type-overline text-accent">{site.signature}</p>
            <p className="text-sm text-muted">{site.baseline[locale]}</p>
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted">
              <span>{site.contact.city[locale]}</span>
              <a href={`mailto:${site.contact.email}`} className="link-underline w-fit">
                {site.contact.email}
              </a>
            </div>
          </div>

          <nav aria-label={strings.footerNav} className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4 lg:max-w-3xl">
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h2 className="type-overline text-faint">{column.title}</h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted transition-colors hover:text-ink">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-14 max-w-4xl border-t border-line-soft pt-8 text-xs leading-relaxed text-faint">
          {site.regulatoryDisclaimer[locale]}
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-line-soft pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-faint">
            © {year} {site.name}. {strings.rights}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-xs text-faint transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
