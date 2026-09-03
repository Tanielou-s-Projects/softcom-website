"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const COLS = 24
const ROWS = 28

/*
 * Coverage per cell (0–1) from the silhouette's alpha, drawn contain-fit onto
 * a canvas the size of the grid. Alpha rather than luminance so any opaque
 * shape on a transparent artboard works — SVG, PNG, whatever brand supplies.
 * Cached per src; the image loads once.
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
  /** The shape takes `currentColor` when resolved — set a `text-*` token on the wrapper. */
  resolved: boolean
  className?: string
}

/**
 * The sector mark as a dot-matrix drawing of its silhouette: a 24 × 28 grid
 * where only the cells the shape covers get a dot, each sized by how much of
 * the shape sits under it — so the building / skyline / globe reads crisply
 * from dot size alone, like a printed halftone. No field of filler dots around
 * it. At rest it is legible in neutral; `resolved` colours it in the sector's
 * token, staggered along the grid so the colour arrives rather than switches.
 */
function DotMatrix({ src, resolved, className }: DotMatrixProps) {
  const coverage = useCoverage(src)

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${COLS} ${ROWS}`}
      className={cn("block aspect-[6/7] w-full", className)}
    >
      {coverage &&
        Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = coverage[i]
          if (c < 0.18) return null
          const col = i % COLS
          const row = Math.floor(i / COLS)
          return (
            <circle
              key={i}
              cx={col + 0.5}
              cy={row + 0.5}
              r={0.14 + c * 0.32}
              className={cn(
                "transition-[fill,opacity] duration-500 ease-out motion-reduce:transition-none",
                resolved
                  ? "fill-current opacity-100"
                  : "fill-neutral-400 opacity-60"
              )}
              style={{ transitionDelay: `${(col + row) * 10}ms` }}
            />
          )
        })}
    </svg>
  )
}

export { DotMatrix }
