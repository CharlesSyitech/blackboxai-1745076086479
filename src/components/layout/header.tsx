"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { LocaleSwitcher } from "@/components/layout/locale-switcher"
import type { Locale } from "@/lib/i18n/routes"
import { cn } from "@/lib/utils/format"

export interface NavChild {
  label: string
  href: string
  hint?: string
}
export interface NavItem {
  label: string
  href: string
  children?: NavChild[]
}

export function Header({
  locale,
  items,
  utility,
  cta,
  strings,
}: {
  locale: Locale
  items: NavItem[]
  utility: NavChild[]
  cta: { label: string; href: string }
  strings: {
    home: string
    openMenu: string
    close: string
    primaryNav: string
    utilityNav: string
    language: string
    menu: string
  }
}) {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement | null>(null)
  const menuId = useId()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled || openMenu || mobileOpen
          ? "border-line bg-page/95 backdrop-blur"
          : "border-transparent bg-page",
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="hidden border-b border-line-soft lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-end gap-6 px-10 py-1.5">
          <nav aria-label={strings.utilityNav}>
            <ul className="flex items-center gap-6">
              {utility.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="type-overline text-muted transition-colors hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LocaleSwitcher locale={locale} label={strings.language} />
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-3.5 md:px-8 lg:px-10">
        <Link
          href={`/${locale}`}
          aria-label={strings.home}
          className="font-display text-[0.95rem] font-extrabold tracking-[-0.02em] whitespace-nowrap"
        >
          SYITECH GROUP
        </Link>

        <nav aria-label={strings.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => {
              const active = pathname.startsWith(item.href)
              const hasChildren = Boolean(item.children?.length)
              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenMenu(item.href)}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-expanded={openMenu === item.href}
                      aria-controls={`${menuId}-${item.href}`}
                      onClick={() => setOpenMenu(openMenu === item.href ? null : item.href)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-sm px-3 py-2 text-[0.9rem] transition-colors",
                        active ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      {item.label}
                      <svg viewBox="0 0 10 6" aria-hidden="true" className="h-1.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 1l4 4 4-4" strokeLinecap="round" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-sm px-3 py-2 text-[0.9rem] transition-colors",
                        active ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {hasChildren && openMenu === item.href ? (
                    <div
                      id={`${menuId}-${item.href}`}
                      className="absolute left-0 top-full z-50 w-[min(92vw,560px)] border border-line bg-raised p-2 shadow-md"
                    >
                      <ul className="grid grid-cols-2 gap-1">
                        {item.children?.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="group flex flex-col gap-0.5 rounded-sm px-3 py-2.5 transition-colors hover:bg-surface"
                            >
                              <span className="text-[0.9rem] font-medium text-ink">{child.label}</span>
                              {child.hint ? (
                                <span className="text-[0.78rem] leading-snug text-muted">{child.hint}</span>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={cta.href}
            className="hidden min-h-11 items-center rounded-md bg-accent px-5 text-[0.9rem] font-medium text-ink-900 transition-colors hover:bg-amber-600 lg:inline-flex"
          >
            {cta.label}
          </Link>
          <div className="lg:hidden">
            <LocaleSwitcher locale={locale} label={strings.language} />
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-controls={`${menuId}-mobile`}
            className="flex size-11 items-center justify-center rounded-sm border border-line lg:hidden"
          >
            <span className="sr-only">{mobileOpen ? strings.close : strings.openMenu}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id={`${menuId}-mobile`}
          className="fixed inset-x-0 bottom-0 top-[65px] z-40 overflow-y-auto border-t border-line bg-page lg:hidden"
        >
          <nav aria-label={strings.primaryNav} className="px-5 py-6">
            <ul className="flex flex-col divide-y divide-line-soft">
              {items.map((item) => (
                <li key={item.href} className="py-1">
                  {item.children?.length ? (
                    <details>
                      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-medium marker:hidden">
                        {item.label}
                        <svg viewBox="0 0 10 6" aria-hidden="true" className="h-1.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M1 1l4 4 4-4" strokeLinecap="round" />
                        </svg>
                      </summary>
                      <ul className="flex flex-col gap-1 pb-3 pl-1">
                        <li>
                          <Link href={item.href} className="block py-2 text-[0.92rem] text-muted">
                            {item.label}
                          </Link>
                        </li>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} className="block py-2 text-[0.92rem] text-muted">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link href={item.href} className="block py-3 text-base font-medium">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <ul className="mt-6 flex flex-col gap-3 border-t border-line-soft pt-6">
              {utility.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="type-overline text-muted">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={cta.href}
              className="mt-8 flex min-h-12 items-center justify-center rounded-md bg-accent px-5 font-medium text-ink-900"
            >
              {cta.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
