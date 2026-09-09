"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils/format"

/**
 * Reveals content once, on entry. Content is in the DOM and visible without
 * JavaScript; the hidden state only ever applies when JS is running, and
 * prefers-reduced-motion cancels it in CSS.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: "div" | "li" | "section"
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    // Failsafe: if the observer never fires (detached tab, odd viewport),
    // the content shows anyway rather than staying invisible.
    const failsafe = window.setTimeout(() => setVisible(true), 1500)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    )
    observer.observe(node)
    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", className)}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
