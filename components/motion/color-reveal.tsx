"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Where the image's top edge is when the reveal starts and completes, as a
 * share of viewport height (0 = top, 1 = bottom). Measured from the top, not
 * the centre, so tall images finish colouring while still well in view.
 */
const START = 0.95
const END = 0.35

let observed = new Set<HTMLElement>()
let frame = 0
let listening = false

/*
 * One scroll listener and one rAF for every reveal on the page: each frame
 * writes --reveal (0 greyscale → 1 full colour) on the elements in view.
 */
function update() {
  frame = 0
  const vh = window.innerHeight
  for (const element of observed) {
    const r = element.getBoundingClientRect()
    const top = r.top / vh
    const t = Math.max(0, Math.min(1, (START - top) / (START - END)))
    element.style.setProperty("--reveal", (t * t * (3 - 2 * t)).toFixed(3))
  }
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(update)
}
function listen() {
  if (listening) return
  listening = true
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
}
function unlisten() {
  if (observed.size) return
  listening = false
  cancelAnimationFrame(frame)
  frame = 0
  window.removeEventListener("scroll", schedule)
  window.removeEventListener("resize", schedule)
  observed = new Set()
}

/**
 * The site's photographs arrive in greyscale and turn to full colour as they
 * scroll into view — reversible, driven by position, not a one-shot fade.
 * Wraps a `fill` image: it is the positioned box the image fills.
 *
 * Only elements near the viewport are tracked (IntersectionObserver), so a
 * long page costs one listener and a handful of rect reads per frame. Reduced
 * motion, or no JS: full colour (the CSS default).
 */
function ColorReveal({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    element.style.setProperty("--reveal", "0")
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observed.add(element)
          listen()
          schedule()
        } else {
          observed.delete(element)
          unlisten()
        }
      },
      { rootMargin: "20% 0px" }
    )
    io.observe(element)
    return () => {
      io.disconnect()
      observed.delete(element)
      unlisten()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn("softcom-color-reveal absolute inset-0", className)}
    >
      {children}
    </div>
  )
}

export { ColorReveal }
