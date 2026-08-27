"use client"

import { Dithering } from "@paper-design/shaders-react"

import { cn } from "@/lib/utils"

/**
 * The category plate on the left of a nav dropdown — a live Paper Shaders
 * dithering effect rather than a static image, so it reads as a shader texture.
 * `accent` picks the per-category preset (tuned in the `/dither` workshop). Both
 * use the same brand blue; the categories read apart by pattern instead —
 * a warp for About, a swirl for Solutions.
 *
 * Only the open dropdown's plate mounts (Radix unmounts inactive content), so at
 * most one WebGL canvas runs at a time. `bg-black` shows through until it paints.
 */
const ACCENTS = {
  blue: {
    colorBack: "#020617",
    colorFront: "#0b3bff",
    shape: "warp",
    type: "4x4",
    size: 2,
    scale: 1,
    speed: 0.6,
  },
  cyan: {
    colorBack: "#020617",
    colorFront: "#0b3bff",
    shape: "swirl",
    type: "4x4",
    size: 2,
    scale: 1.2,
    speed: 0.5,
  },
} as const

function DitherShape({
  accent = "blue",
  className,
}: {
  accent?: keyof typeof ACCENTS
  className?: string
}) {
  const cfg = ACCENTS[accent]

  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden bg-black", className)}
    >
      <Dithering
        style={{ width: "100%", height: "100%" }}
        colorBack={cfg.colorBack}
        colorFront={cfg.colorFront}
        shape={cfg.shape}
        type={cfg.type}
        size={cfg.size}
        scale={cfg.scale}
        speed={cfg.speed}
        fit="cover"
      />
    </div>
  )
}

export { DitherShape }
