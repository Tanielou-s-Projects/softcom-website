"use client"

import * as React from "react"

import { DitherPanel } from "@/components/motion/dither-panel"
import { useVariant } from "@/components/variants/variant-context"

/** Page scroll as 0–1, rAF-throttled. */
function usePageProgress() {
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])
  return progress
}

/**
 * The `dither` margins: the shared dither (lib/dither.ts) rising up both rails
 * with page scroll — one more driver for the same 0–1 input, reading as a
 * quiet progress indicator. Each rail has its own seed so the fronts differ.
 */
function DitherRails() {
  const progress = usePageProgress()
  return (
    <div aria-hidden className="softcom-blueprint" data-style="dither">
      {(["left", "right"] as const).map((side, i) => (
        <div key={side} className="softcom-blueprint-rail" data-side={side}>
          <DitherPanel progress={progress} seed={i + 5} />
        </div>
      ))}
    </div>
  )
}

/**
 * What lives in the side margins on wide viewports (≥ 1440px, where the
 * 1336px column leaves real space). Fixed behind the page: full-bleed plates
 * cover it as they scroll past, `Container` sections let it show.
 *
 * The client read the first pass (faint drafting rails) as "incomplete", so
 * the default is now nothing, with two alternatives on the variant switcher:
 * `labelled` — the rails, heavier, with a running mono label so they read as
 * an editorial device; `dither` — the site's dither rising up the rails as
 * the page is read, so the margins carry material and a quiet sense of place.
 *
 * Pages that mount this must not repaint `bg-background` on their wrapper —
 * the body already paints it, and an opaque positioned wrapper would sit
 * above the grid's negative z-index and hide it.
 */
function BlueprintGrid() {
  const variant = useVariant("margins")

  if (variant === "none") return null

  if (variant === "dither") return <DitherRails />

  const label = "SOFTCOM — LAGOS — EST. 2007 — TECHNOLOGY FOR ORGANISATIONS"
  return (
    <div aria-hidden className="softcom-blueprint" data-style="labelled">
      <div
        className="softcom-blueprint-rail"
        data-side="left"
        data-label={label}
      />
      <div
        className="softcom-blueprint-rail"
        data-side="right"
        data-label={label}
      />
    </div>
  )
}

export { BlueprintGrid }
