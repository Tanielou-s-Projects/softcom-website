"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "motion/react"

import { bayer8, CELL, cellState, field } from "@/lib/dither"
import { paintGlyphs } from "@/components/motion/dither-glyphs"
import { cn } from "@/lib/utils"

const BLUE = "#004bff"
const RESOLVE_MS = 900

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

type Cell = { x: number; y: number; t: number; f: number }

/**
 * A canvas of the site's dither (lib/dither.ts): brand blue risen to some
 * progress with its cyan front.
 *
 * Two modes. By default it is a still: it resolves from 0 to `level` the first
 * time it scrolls into view — the same move as the hero and the page
 * transition — then holds. Pass `progress` instead and it is controlled: it
 * draws exactly that value, so any driver (page scroll, a slider) can own it.
 *
 * Canvas 2D rather than WebGL: panels come several to a page, and browsers
 * cap live WebGL contexts. The cell maths is the shared JS port, so the weave
 * is identical to the shader's. `seed` gives each panel its own front.
 */
function DitherPanel({
  level = 0.8,
  progress,
  seed = 0,
  className,
}: {
  /** Still mode: how far the blue rises when it resolves, 0–1. */
  level?: number
  /** Controlled mode: the progress to draw, 0–1. */
  progress?: number
  seed?: number
  className?: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const inView = useInView(canvasRef, { once: true, amount: 0.25 })
  const reduceMotion = useReducedMotion()
  const controlled = progress !== undefined
  /** Redraws at the given progress; set up once the canvas is laid out. */
  const paintRef = React.useRef<(progress: number) => void>(() => {})
  const shownRef = React.useRef(0)

  // Layout, colour and repaint plumbing — independent of what drives progress.
  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let cells: Cell[] = []
    let size = 0
    let ratio = 1
    let rows = 0
    const layout = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      size = CELL * ratio
      const cols = Math.ceil(canvas.width / size)
      rows = Math.ceil(canvas.height / size)
      cells = []
      for (let row = 0; row < rows; row++) {
        // Rows count up from the bottom, as the shader's do.
        const up = rows - 1 - row
        for (let col = 0; col < cols; col++) {
          cells.push({
            x: col * size,
            y: row * size,
            t: bayer8(col, up),
            f: field(col, up, up / Math.max(1, rows - 1), seed),
          })
        }
      }
    }
    const paint = (value: number) => {
      shownRef.current = value
      // The front's cyan is themed (see the canvas class), read per paint.
      const front = getComputedStyle(canvas).color
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const cell of cells) {
        const state = cellState(value, cell.f, cell.t)
        if (state === "rest") continue
        ctx.fillStyle = state === "front" ? front : BLUE
        ctx.fillRect(cell.x, cell.y, size, size)
      }
      // The tech layer: data glyphs in the front.
      paintGlyphs(ctx, {
        progress: value,
        cell: size,
        ratio,
        color: front,
        fieldAt: (col, up) => field(col, up, up / Math.max(1, rows - 1), seed),
      })
    }
    paintRef.current = paint

    layout()
    paint(shownRef.current)
    const resize = new ResizeObserver(() => {
      layout()
      paint(shownRef.current)
    })
    resize.observe(canvas)
    // Repaint on a theme switch, which flips the front colour.
    const theme = new MutationObserver(() => paint(shownRef.current))
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => {
      resize.disconnect()
      theme.disconnect()
      paintRef.current = () => {}
    }
  }, [seed])

  // Controlled: draw what we're given.
  React.useEffect(() => {
    if (controlled) paintRef.current(progress)
  }, [controlled, progress])

  // Still: resolve to `level` once, the first time it is seen.
  React.useEffect(() => {
    if (controlled || !inView) return
    if (reduceMotion) {
      paintRef.current(level)
      return
    }
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / RESOLVE_MS)
      paintRef.current(level * easeOut(t))
      if (t < 1) frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [controlled, inView, reduceMotion, level])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // Pure cyan barely shows on light plates; the ramp's 600 holds there.
      className={cn(
        "block size-full text-brand-cyan-600 dark:text-brand-cyan",
        className
      )}
    />
  )
}

export { DitherPanel }
