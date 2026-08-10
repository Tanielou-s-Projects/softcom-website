"use client"

import { Dithering } from "@paper-design/shaders-react"

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

/**
 * Defaults chosen for atmosphere rather than presence — this sits behind the
 * headline and the brand mark and must not compete with either.
 *
 * `warp` reads as flow, which is the point: the hero is about carrying
 * something from one end to the other, and the capsule already says that
 * literally. The 8×8 matrix is the finest of the four, so the grain stays fine
 * enough to read as texture instead of pattern.
 */
const SHAPE = "warp"
const MATRIX = "8x8"
const GRAIN = 2
const SPEED = 0.18

/** Transparent, so the canvas composites over the page rather than boxing it. */
const TRANSPARENT = "#00000000"

/**
 * An atmospheric dither field behind the hero.
 *
 * Deliberately client-only and decorative. The shader renders nothing until
 * hydration, which would be unacceptable for the brand mark but is fine here —
 * the layer fades in when it arrives, and the hero is complete without it. That
 * keeps the capsule and the headline server-rendered and instant.
 *
 * Colours are literal hex on purpose: the shader's parser does not accept the
 * `oklch()` that Tailwind's ramp uses, and silently yields grey for it. The
 * brand tokens happen to be hex, but hardcoding here keeps the failure mode
 * visible rather than mysterious.
 */
function HeroDither({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-clip",
        // Low enough to be felt rather than seen.
        "opacity-[0.18]",
        "animate-in duration-1000 fade-in",
        className
      )}
    >
      <Dithering
        style={{ width: "100%", height: "100%" }}
        colorBack={TRANSPARENT}
        colorFront="#004bff"
        shape={SHAPE}
        type={MATRIX}
        size={GRAIN}
        // Frozen rather than hidden: the texture survives, the motion does not.
        speed={reducedMotion ? 0 : SPEED}
      />
    </div>
  )
}

export { HeroDither }
