import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { getDictionary } from "@/content/dictionaries"
import { site } from "@/content/site"
import { JsonLd, organizationJsonLd } from "@/lib/seo/json-ld"
import { buildNavigation } from "@/lib/i18n/navigation"
import { isLocale, locales, path, siteUrl } from "@/lib/i18n/routes"
import "@/app/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} — ${site.signature}`, template: `%s` },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const t = getDictionary(locale)
  const { items, utility, footerColumns, legalLinks } = buildNavigation(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
        <script
          // Marks JS as available so scroll-reveal can start from a hidden
          // state. Without JS the content simply stays visible.
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js')` }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-ink-900"
        >
          {t.nav.skipToContent}
        </a>
        <JsonLd data={organizationJsonLd(locale)} />
        <Header
          locale={locale}
          items={items}
          utility={utility}
          cta={{ label: t.cta.becomePartner, href: path(locale, "contact") }}
          strings={{
            home: t.nav.home,
            openMenu: t.nav.openMenu,
            close: t.nav.close,
            primaryNav: t.nav.primaryNav,
            utilityNav: t.nav.utilityNav,
            language: t.nav.language,
            menu: t.nav.menu,
          }}
        />
        <main id="main">{children}</main>
        <Footer
          locale={locale}
          columns={footerColumns}
          legalLinks={legalLinks}
          strings={{ rights: t.footer.rights, footerNav: t.nav.footerNav }}
        />
      </body>
    </html>
  )
}
