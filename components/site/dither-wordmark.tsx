"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "motion/react"

import { bayer8, CELL } from "@/lib/dither"
import { cn } from "@/lib/utils"

/* A quiet step up from the neutral-900 plate. */
const INK = "#2e2e2e"
/** Density at the top of the letters, and where it has thinned to at the bottom. */
const TOP = 0.96
const BOTTOM = 0.04
const RESOLVE_MS = 1400

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The footer's oversized wordmark in the shared dither, in greyscale: the
 * logo sampled into 6px cells and filled as a dithered gradient — dense at the
 * top of the letters, thinning in 8×8 Bayer order toward the bottom, so the
 * half the plate crops away dissolves into it rather than being sliced off.
 * It resolves in once, in that same order, the first time the footer is seen.
 */
function DitherWordmark({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const inView = useInView(canvasRef, { once: true, amount: 0.15 })
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let cells: { x: number; y: number; t: number; tone: number }[] = []
    let size = 0
    let image: HTMLImageElement | null = null
    let progress = inView && reduceMotion ? 1 : 0

    const paint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = INK
      for (const cell of cells) {
        if (cell.t < cell.tone * progress)
          ctx.fillRect(cell.x, cell.y, size, size)
      }
    }
    const sample = () => {
      if (!image) return
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      // ~220 columns at any width: the shared 6px cell on desktop, finer on
      // phones so the letters survive (never below 3px).
      size = Math.max(3, Math.min(CELL, canvas.clientWidth / 220)) * ratio
      const cols = Math.ceil(canvas.width / size)
      const rows = Math.ceil(canvas.height / size)
      const probe = document.createElement("canvas")
      probe.width = cols
      probe.height = rows
      const p = probe.getContext("2d")
      if (!p) return
      p.drawImage(image, 0, 0, cols, rows)
      const { data } = p.getImageData(0, 0, cols, rows)
      cells = []
      for (let row = 0; row < rows; row++) {
        const tone = TOP + (BOTTOM - TOP) * (row / Math.max(1, rows - 1))
        for (let col = 0; col < cols; col++) {
          if (data[(row * cols + col) * 4 + 3] <= 110) continue
          cells.push({
            x: col * size,
            y: row * size,
            t: bayer8(col, rows - 1 - row),
            tone,
          })
        }
      }
      paint()
    }

    let frame = 0
    const img = new window.Image()
    img.decoding = "async"
    img.onload = () => {
      image = img
      sample()
      if (!inView || reduceMotion) return
      const start = performance.now()
      frame = requestAnimationFrame(function tick(now) {
        const t = Math.min(1, (now - start) / RESOLVE_MS)
        progress = easeOut(t)
        paint()
        if (t < 1) frame = requestAnimationFrame(tick)
      })
    }
    img.src = src

    const resize = new ResizeObserver(sample)
    resize.observe(canvas)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
    }
  }, [src, inView, reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={cn("block aspect-[1268/284] h-auto w-full", className)}
    />
  )
}

export { DitherWordmark }
