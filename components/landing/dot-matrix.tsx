"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* Fine enough for the globe's ring and meridians to survive sampling. */
const COLS = 20
const ROWS = 24
/* Every cell, same dot, same tone at rest — a grid, not a texture. */
const REST_OPACITY = 0.14
/* The silhouette's cells at rest: legible, still neutral. */
const SHAPE_REST_OPACITY = 0.55
/* The field around the shape once it is in colour. */
const DIM_OPACITY = 0.07

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
  /** Lit dots take `currentColor` when resolved — set a `text-*` token on the wrapper. */
  resolved: boolean
  className?: string
}

/**
 * The sector mark: a uniform 20 × 24 field of identical dots. At rest every
 * dot is the same quiet neutral, so the mark is a clean grid. When `resolved`
 * the cells under the silhouette light up in the sector's colour and the rest
 * of the field dims, so the building / skyline / globe reads inside an
 * unchanged grid. The transition staggers along the grid so the image
 * "arrives" rather than switching on.
 */
function DotMatrix({ src, resolved, className }: DotMatrixProps) {
  const coverage = useCoverage(src)

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${COLS} ${ROWS}`}
      className={cn("block aspect-[20/24] w-full", className)}
    >
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        // The shape is always drawn — in neutral at rest, in the sector colour when resolved.
        const shape = coverage !== null && coverage[i] > 0.4
        return (
          <circle
            key={i}
            cx={col + 0.5}
            cy={row + 0.5}
            r={0.28}
            className={cn(
              "transition-[opacity,fill] duration-500 ease-out motion-reduce:transition-none",
              // Foreground, not a fixed grey, so the grid shows on both themes.
              shape && resolved ? "fill-current" : "fill-foreground"
            )}
            style={{
              opacity: shape
                ? resolved
                  ? 1
                  : SHAPE_REST_OPACITY
                : resolved
                  ? DIM_OPACITY
                  : REST_OPACITY,
              transitionDelay: `${(col + row) * 8}ms`,
            }}
          />
        )
      })}
    </svg>
  )
}

export { DotMatrix }
