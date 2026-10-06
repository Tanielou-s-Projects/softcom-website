"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useReducedMotion } from "motion/react"

import { createDitherField } from "@/components/motion/dither-field"

/** Coarser than the 6px base so the weave reads at speed; still on the grid. */
const SCALE = 4
const COVER_MS = 340
const HOLD_MS = 110
const UNCOVER_MS = 420

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

/**
 * The page transition, in the site's dither language (`lib/dither.ts`): on a
 * route change brand blue rises over the viewport in Bayer order with a cyan
 * front, holds, then recedes to uncover the new page — the hero's dissolve on
 * a clock instead of scroll, so every page change passes through the same
 * blue the hero ends on.
 *
 * A fixed overlay rather than a wrapper around the page, so it can never put
 * a transform on the sticky header/CTA ancestors. The WebGL context lives
 * only for the transition and is freed after it. Skipped on the first load,
 * under reduced motion, and in the Studio.
 */
function PixelPageTransition() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [lastPathname, setLastPathname] = React.useState(pathname)
  const [run, setRun] = React.useState(0)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const fallbackRef = React.useRef<HTMLDivElement>(null)

  // The sanctioned adjust-state-during-render pattern: react to the route
  // change in the same render that delivers it, not in an effect.
  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    if (!reduceMotion && !pathname.startsWith("/studio")) {
      setRun((n) => n + 1)
    }
  }

  const [done, setDone] = React.useState(0)
  const active = run > done

  React.useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const field = createDitherField(canvas, { scale: SCALE })
    const fallback = fallbackRef.current
    const draw = (progress: number) => {
      if (field) field.draw(progress)
      else if (fallback) fallback.style.opacity = String(progress)
    }

    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = now - start
      if (t < COVER_MS) draw(easeInOut(t / COVER_MS))
      else if (t < COVER_MS + HOLD_MS) draw(1)
      else if (t < COVER_MS + HOLD_MS + UNCOVER_MS)
        draw(1 - easeInOut((t - COVER_MS - HOLD_MS) / UNCOVER_MS))
      else {
        draw(0)
        setDone(run)
        return
      }
      frame = requestAnimationFrame(tick)
    })

    return () => {
      cancelAnimationFrame(frame)
      field?.dispose()
    }
  }, [active, run])

  if (!active) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={fallbackRef}
        className="absolute inset-0 bg-brand-blue opacity-0"
      />
      {/* Keyed per run: a disposed context cannot be revived on the same canvas. */}
      <canvas
        key={run}
        ref={canvasRef}
        className="absolute inset-0 size-full"
      />
    </div>
  )
}

export { PixelPageTransition }
