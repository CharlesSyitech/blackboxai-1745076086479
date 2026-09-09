"use client"

import { useEffect, useRef } from "react"

export interface PointerParallaxOptions {
  /** Spring constant. Higher follows the pointer more eagerly. */
  stiffness?: number
  /** Viscous damping. Higher settles sooner and overshoots less. */
  damping?: number
  mass?: number
}

/**
 * One pointer listener and one animation frame for the whole hero.
 *
 * Every reactive layer reads the same smoothed values as CSS custom
 * properties, so adding a layer costs nothing at runtime and no component
 * subscribes to the pointer itself. Nothing here touches React state: a
 * setState per pointermove would re-render the hero sixty times a second.
 *
 * Published on the container, all as unitless numbers so CSS can scale them:
 *
 *   --px, --py    smoothed pointer, -1..1 from the centre
 *   --cx, --cy    smoothed pointer as a percentage of the box, for lights
 *   --energy      0..1, how fast the pointer is currently moving
 *   data-pointer  "in" while the pointer is over the container
 *
 * The values are integrated by a spring rather than assigned, so the scene
 * keeps drifting for a moment after the pointer stops and returns home on
 * its own when it leaves — no transition, no snap.
 */
export function usePointerParallax<T extends HTMLElement>({
  stiffness = 85,
  damping = 21,
  mass = 1,
}: PointerParallaxOptions = {}) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    // Bound once so the hoisted handlers below close over a non-null element.
    const element: T = node

    // A coarse pointer cannot hover: on touch the scene runs its own slow
    // cinematic loop in CSS instead. Reduced motion opts out of both.
    if (typeof window.matchMedia !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    // Target (where the pointer is) and state (where the scene has got to).
    const target = { x: 0, y: 0 }
    const position = { x: 0, y: 0 }
    const velocity = { x: 0, y: 0 }
    let energy = 0
    let inside = false
    let frame = 0
    let last = 0

    const setVar = (name: string, value: number) => {
      element.style.setProperty(name, value.toFixed(4))
    }

    function step(now: number) {
      frame = 0
      // First frame after a gap has no meaningful delta; clamp so a
      // backgrounded tab cannot integrate a huge step on return.
      const dt = last === 0 ? 1 / 60 : Math.min((now - last) / 1000, 1 / 30)
      last = now

      let moving = false
      for (const axis of ["x", "y"] as const) {
        const displacement = position[axis] - target[axis]
        const acceleration = (-stiffness * displacement - damping * velocity[axis]) / mass
        velocity[axis] += acceleration * dt
        position[axis] += velocity[axis] * dt
        if (Math.abs(velocity[axis]) > 0.0008 || Math.abs(displacement) > 0.0008) moving = true
      }

      // Energy trails the pointer's speed and decays on its own, so the
      // network keeps glowing for a beat after a fast sweep.
      const speed = Math.min(1, Math.hypot(velocity.x, velocity.y) / 6)
      energy += (speed - energy) * Math.min(1, dt * 6)
      if (energy > 0.002) moving = true

      setVar("--px", position.x)
      setVar("--py", position.y)
      setVar("--cx", 50 + position.x * 50)
      setVar("--cy", 50 + position.y * 50)
      setVar("--energy", energy)

      if (moving || inside) {
        frame = window.requestAnimationFrame(step)
      } else {
        // Fully at rest: park exactly at zero and stop burning frames.
        position.x = position.y = velocity.x = velocity.y = energy = 0
        setVar("--px", 0)
        setVar("--py", 0)
        setVar("--cx", 50)
        setVar("--cy", 50)
        setVar("--energy", 0)
        last = 0
      }
    }

    function wake() {
      if (frame) return
      last = 0
      frame = window.requestAnimationFrame(step)
    }

    function onMove(event: PointerEvent) {
      // Mouse and pen only: a stylus hovers, a finger does not.
      if (event.pointerType === "touch") return
      const box = element.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) return
      target.x = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2))
      target.y = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height - 0.5) * 2))
      if (!inside) {
        inside = true
        element.dataset.pointer = "in"
      }
      wake()
    }

    function onLeave() {
      inside = false
      element.dataset.pointer = "out"
      target.x = 0
      target.y = 0
      wake()
    }

    element.addEventListener("pointermove", onMove, { passive: true })
    element.addEventListener("pointerleave", onLeave)
    // A pointer can also be lost without a leave event (window blur, tab
    // switch); treat that as leaving so the scene never stays deflected.
    window.addEventListener("blur", onLeave)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      element.removeEventListener("pointermove", onMove)
      element.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
    }
  }, [stiffness, damping, mass])

  return ref
}
