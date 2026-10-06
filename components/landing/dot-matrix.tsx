"use client"

import * as React from "react"

import { bayer8, cellState, field } from "@/lib/dither"
import { cn } from "@/lib/utils"

/* Fine enough for the globe's ring and meridians to survive sampling. */
const COLS = 20
const ROWS = 24
/*
 * Opacities, as classes on each cell: every cell 14% at rest (a grid, not a
 * texture), the silhouette's cells 55% (legible, still neutral), and the field
 * around the shape 7% once it is in colour.
 */

/*
 * Sample a silhouette into per-cell coverage (0–1) by drawing it onto a canvas
 * the size of the grid and reading the alpha channel. Alpha rather than
 * luminance so any opaque shape on a transparent artboard works — SVG, PNG,
 * whatever brand eventually supplies. Cached per src; the image loads once.
 */
const cache = new Map<string, Promise<Float32Array>>()

function sample(src: string): Promise<Float32Array> {
  let pending = cache.get(src)
  if (!pending) {
    pending = new Promise((resolve, reject) => {
      const img = new window.Image()
      img.decoding = "async"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = COLS
        canvas.height = ROWS
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject(new Error("no 2d context"))
        // Fit the silhouette inside the grid, centred, preserving its aspect.
        const scale = Math.min(COLS / img.width, ROWS / img.height)
        const w = img.width * scale
        const h = img.height * scale
        ctx.drawImage(img, (COLS - w) / 2, (ROWS - h) / 2, w, h)
        const { data } = ctx.getImageData(0, 0, COLS, ROWS)
        const out = new Float32Array(COLS * ROWS)
        for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3] / 255
        resolve(out)
      }
      img.onerror = () => reject(new Error(`could not load ${src}`))
      img.src = src
    })
    cache.set(src, pending)
  }
  return pending
}

function useCoverage(src: string) {
  const [coverage, setCoverage] = React.useState<Float32Array | null>(null)
  React.useEffect(() => {
    let live = true
    sample(src).then(
      (c) => live && setCoverage(c),
      () => live && setCoverage(null)
    )
    return () => {
      live = false
    }
  }, [src])
  return coverage
}

type DotMatrixProps = {
  /** Opaque silhouette on a transparent artboard. */
  src: string
  /** Lit cells take `currentColor` when resolved — set a `text-*` token on the wrapper. */
  resolved: boolean
  className?: string
}

/** How long a full resolve takes, and the quicker un-resolve. */
const RESOLVE_MS = 650
const RELEASE_MS = 320
/** Square cell inside its 1×1 slot — the same visual weight as the old dots. */
const CELL = 0.56
const INSET = (1 - CELL) / 2

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/*
 * Per-cell constants for the shared dither (lib/dither.ts): each cell's Bayer
 * threshold and its place in the rising field. Rows count from the bottom, as
 * gl_FragCoord does, so the mark fills the same way the hero does.
 */
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS
  const fromTop = Math.floor(i / COLS)
  const row = ROWS - 1 - fromTop
  return {
    col,
    fromTop,
    threshold: bayer8(col, row),
    field: field(col, row, row / (ROWS - 1)),
  }
})

/**
 * The sector mark: a uniform 20 × 24 field of identical square cells. At rest
 * every cell is the same quiet neutral, so the mark is a clean grid. When
 * `resolved` it fills in the site's dither language: the cells under the
 * silhouette light from the bottom in Bayer order, flash brand cyan at the
 * front and settle into the sector colour, while the rest of the field dims —
 * the hero's dissolve in miniature.
 *
 * Progress is tweened in JS and written straight to `data-state` on each cell,
 * so a resolve costs no React renders. Reduced motion jumps to the end state.
 */
function DotMatrix({ src, resolved, className }: DotMatrixProps) {
  const coverage = useCoverage(src)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const progressRef = React.useRef(0)

  React.useEffect(() => {
    const rects = svgRef.current?.querySelectorAll<SVGRectElement>("rect")
    if (!rects) return
    const apply = (progress: number) => {
      progressRef.current = progress
      CELLS.forEach((cell, i) => {
        const state = cellState(progress, cell.field, cell.threshold)
        const rect = rects[i]
        if (rect && rect.dataset.state !== state) rect.dataset.state = state
      })
    }

    const target = resolved ? 1 : 0
    const from = progressRef.current
    if (
      from === target ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply(target)
      return
    }

    const duration =
      (resolved ? RESOLVE_MS : RELEASE_MS) * Math.abs(target - from)
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      apply(from + (target - from) * easeOut(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [resolved, coverage])

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox={`0 0 ${COLS} ${ROWS}`}
      className={cn("block aspect-[20/24] w-full", className)}
    >
      {CELLS.map((cell, i) => {
        // The shape is always drawn — in neutral at rest, in the sector colour when resolved.
        const shape = coverage !== null && coverage[i] > 0.4
        return (
          <rect
            key={i}
            x={cell.col + INSET}
            y={cell.fromTop + INSET}
            width={CELL}
            height={CELL}
            data-state="rest"
            className={cn(
              // Foreground, not a fixed grey, so the grid shows on both themes.
              // Pure cyan manages ~1.3:1 on the light cards; the ramp's 600 holds
              // the edge legible there, and dark mode keeps the brand anchor.
              "fill-foreground data-[state=front]:fill-brand-cyan-600 dark:data-[state=front]:fill-brand-cyan",
              shape
                ? "opacity-55 data-[state=front]:opacity-100 data-[state=on]:fill-current data-[state=on]:opacity-100"
                : "opacity-14 data-[state=front]:opacity-35 data-[state=on]:opacity-7"
            )}
          />
        )
      })}
    </svg>
  )
}

export { DotMatrix }
