"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const COLS = 12
const ROWS = 14

/*
 * Deterministic "scatter": which dots are lit at rest. A pure hash so server
 * and client agree and the idle matrix looks the same on every load — roughly
 * the density of the old Figma export (27 of 42 dots).
 */
function scatter(i: number) {
  return (Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1
}

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
 * The sector mark: a 12 × 14 field of dots (168, up from the export's 6 × 7)
 * that rests as a sparse scatter and, when `resolved`, re-lights as the sector's
 * silhouette in the sector's colour. The transition staggers along the grid so
 * the image "arrives" rather than switching on.
 */
function DotMatrix({ src, resolved, className }: DotMatrixProps) {
  const coverage = useCoverage(src)
  const show = resolved && coverage !== null

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${COLS} ${ROWS}`}
      className={cn("block aspect-[12/14] w-full", className)}
    >
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const col = i % COLS
        const row = Math.floor(i / COLS)
        const rest = scatter(i) > 0.36 ? 0.18 : 0.05
        const lit = show ? coverage[i] : 0
        // Resolved: the silhouette in colour; the rest of the field dims so it reads.
        const opacity = show ? Math.max(lit, 0.05) : rest
        return (
          <circle
            key={i}
            cx={col + 0.5}
            cy={row + 0.5}
            r={0.27}
            className={cn(
              "transition-[opacity,fill] duration-500 ease-out motion-reduce:transition-none",
              show && lit > 0.35 ? "fill-current" : "fill-neutral-300"
            )}
            style={{
              opacity,
              transitionDelay: `${(col + row) * 14}ms`,
            }}
          />
        )
      })}
    </svg>
  )
}

export { DotMatrix }
