"use client"

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils/format"

/** Shared observer: one instance for the whole page rather than one per node. */
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    // Failsafe: content is never left hidden if the observer never fires.
    const failsafe = window.setTimeout(() => setVisible(true), 2000)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px", ...options },
    )
    observer.observe(node)
    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
  }, [options])

  return { ref, visible }
}

/** Wipes a heading upward out of its own mask when it comes into view. */
export function MaskUp({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  as?: "div" | "h2" | "h3"
}) {
  const { ref, visible } = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref as never}
      className={cn("mask-up", className)}
      data-visible={visible ? "true" : "false"}
    >
      {children}
    </Tag>
  )
}

/**
 * Marks a subtree visible once it enters the viewport. Descendants opt in
 * with `.draw` (connection lines) or `.settle` (nodes), so a diagram can
 * draw its links and then place its labels.
 */
export function InViewStage({
  children,
  className,
  threshold = 0.25,
}: {
  children: ReactNode
  className?: string
  threshold?: number
}) {
  const { ref, visible } = useInView<HTMLDivElement>({ threshold })
  return (
    <div ref={ref} className={className} data-stage={visible ? "true" : "false"}>
      {children}
    </div>
  )
}

/** Gives the hero diagram a little volume as the pointer moves across it. */
export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(hover: none)").matches) return

    let frame = 0
    function onMove(event: PointerEvent) {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const element = ref.current
        if (!element) return
        const box = element.getBoundingClientRect()
        const x = (event.clientX - box.left) / box.width - 0.5
        const y = (event.clientY - box.top) / box.height - 0.5
        element.style.setProperty("--tx", String(Math.max(-1, Math.min(1, x * 2))))
        element.style.setProperty("--ty", String(Math.max(-1, Math.min(1, y * 2))))
      })
    }
    function onLeave() {
      const element = ref.current
      if (!element) return
      element.style.setProperty("--tx", "0")
      element.style.setProperty("--ty", "0")
    }

    node.addEventListener("pointermove", onMove)
    node.addEventListener("pointerleave", onLeave)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      node.removeEventListener("pointermove", onMove)
      node.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={cn("tilt", className)}>
      {children}
    </div>
  )
}

/** Splits a headline into masked words that rise in reading order. */
export function WordReveal({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  style,
}: {
  text: string
  className?: string
  as?: "h1" | "h2" | "p" | "span"
  delay?: number
  style?: CSSProperties
}) {
  const words = text.split(" ")
  return (
    <Tag className={className} style={style}>
      {words.map((word, index) => (
        // The separator sits BETWEEN the masks and must be an ordinary
        // breaking space: a mask sets overflow:hidden, and a space trapped
        // inside one — or a non-breaking space — removes the line-break
        // opportunity, so the headline runs off its column.
        <Fragment key={`${word}-${index}`}>
          <span className="word">
            <span style={{ animationDelay: `${delay + index * 55}ms` }}>{word}</span>
          </span>
          {index < words.length - 1 ? "\u0020" : null}
        </Fragment>
      ))}
    </Tag>
  )
}
