"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useReducedMotion } from "motion/react"

const COLS = 12
const ROWS = 8
/** How far the per-pixel delays spread within each phase, in ms. */
const SPREAD = 300
/** When the uncover phase starts, in ms — cover spread plus a short hold. */
const HOLD = 400

/**
 * Deterministic scatter — a pure hash of the cell index, so render stays
 * idempotent while the delays still read as random. The salt shifts the
 * order between the cover and uncover phases.
 */
function scatter(index: number, salt: number) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return (x - Math.floor(x)) * SPREAD
}

/**
 * The pixel wipe between pages: on every route change a 12×8 grid of
 * brand-blue pixels flickers over the viewport in random order, then flickers
 * away to uncover the new page. A fixed overlay rather than a wrapper around
 * the page, so it can never put a transform on the sticky header/CTA
 * ancestors. Skipped on the first load, under reduced motion, and in the
 * Studio.
 */
function PixelPageTransition() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [lastPathname, setLastPathname] = React.useState(pathname)
  const [phase, setPhase] = React.useState<"idle" | "cover" | "uncover">("idle")

  // The sanctioned adjust-state-during-render pattern: react to the route
  // change in the same render that delivers it, not in an effect.
  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    if (!reduceMotion && !pathname.startsWith("/studio")) {
      setPhase("cover")
    }
  }

  React.useEffect(() => {
    if (phase === "idle") return
    const timer = setTimeout(
      () => setPhase(phase === "cover" ? "uncover" : "idle"),
      phase === "cover" ? HOLD : SPREAD + 150
    )
    return () => clearTimeout(timer)
  }, [phase])

  if (phase === "idle") return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: COLS * ROWS }, (_, index) => (
        <div
          key={index}
          className="bg-brand-blue"
          style={{
            opacity: phase === "cover" ? 0 : 1,
            animation: `${
              phase === "cover" ? "softcom-pixel-in" : "softcom-pixel-out"
            } 1ms steps(1, end) ${scatter(index, phase === "cover" ? 1 : 2)}ms forwards`,
          }}
        />
      ))}
    </div>
  )
}

export { PixelPageTransition }
