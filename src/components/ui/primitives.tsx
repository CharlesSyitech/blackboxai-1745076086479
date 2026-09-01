import Link from "next/link"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils/format"

export function Container({
  children,
  className,
  size = "content",
}: {
  children: ReactNode
  className?: string
  size?: "narrow" | "content" | "wide"
}) {
  const width = size === "narrow" ? "max-w-[800px]" : size === "wide" ? "max-w-[1440px]" : "max-w-[1200px]"
  return <div className={cn("mx-auto w-full px-5 md:px-8 lg:px-10", width, className)}>{children}</div>
}

export function Section({
  children,
  id,
  tone = "page",
  className,
  size = "content",
  padding = "standard",
}: {
  children: ReactNode
  id?: string
  tone?: "page" | "surface" | "ink"
  className?: string
  size?: "narrow" | "content" | "wide"
  padding?: "standard" | "major" | "tight"
}) {
  const tones = {
    page: "bg-page text-ink",
    surface: "bg-surface text-ink",
    ink: "bg-page text-ink",
  }
  const paddings = {
    tight: "py-12 md:py-16",
    standard: "py-20 md:py-24 lg:py-32",
    major: "py-24 md:py-32 lg:py-40",
  }
  return (
    <section
      id={id}
      {...(tone === "ink" ? { "data-theme": "dark" as const } : {})}
      className={cn(tones[tone], paddings[padding], className)}
    >
      <Container size={size}>{children}</Container>
    </section>
  )
}

type ButtonProps = {
  href: string
  children: ReactNode
  variant?: "accent" | "primary" | "secondary" | "ghost"
  size?: "md" | "lg"
  className?: string
}

export function ButtonLink({ href, children, variant = "primary", size = "md", className }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-150 whitespace-nowrap"
  const sizes = {
    md: "min-h-11 px-5 text-[0.95rem]",
    lg: "min-h-13 px-6 text-base",
  }
  const variants = {
    accent: "bg-accent text-ink-900 hover:bg-amber-600",
    primary: "bg-brand text-page hover:opacity-90",
    secondary: "border border-line text-ink hover:border-line-strong",
    ghost: "text-ink hover:text-accent-ink px-0",
  }
  return (
    <Link href={href} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
      {variant === "ghost" ? <Arrow /> : null}
    </Link>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-1", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("type-overline text-accent-ink", className)}>{children}</p>
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  action,
  align = "left",
}: {
  eyebrow?: string
  title: string
  intro?: string
  action?: ReactNode
  align?: "left" | "center"
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <h2 className={cn("type-h2 max-w-[22ch]", align === "center" && "mx-auto")}>{title}</h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {intro ? (
        <p className={cn("type-body-lg measure text-muted", align === "center" && "mx-auto text-center")}>
          {intro}
        </p>
      ) : null}
    </div>
  )
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "accent" | "data" | "warn"
}) {
  const tones = {
    neutral: "border-line text-muted",
    accent: "border-accent text-accent-ink",
    data: "border-data text-data",
    warn: "border-warn text-warn",
  }
  return (
    <span
      className={cn(
        "type-overline inline-flex items-center rounded-sm border px-2 py-1",
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line-soft", className)} />
}

export function Prose({ paragraphs, className }: { paragraphs: readonly string[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="measure text-muted">
          {paragraph}
        </p>
      ))}
    </div>
  )
}
