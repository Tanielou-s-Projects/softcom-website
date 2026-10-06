"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "motion/react"

import { bayer8, CELL, cellState, field } from "@/lib/dither"
import { cn } from "@/lib/utils"

const BLUE = "#004bff"
const CYAN = "#00ffff"
const RESOLVE_MS = 900

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * A still of the site's dither (lib/dither.ts): brand blue risen to `level`
 * with its cyan front frozen mid-weave. It resolves from 0 to `level` the
 * first time it scrolls into view, the same move as the hero and the page
 * transition, then holds.
 *
 * Canvas 2D rather than WebGL: panels come several to a page, and browsers
 * cap live WebGL contexts. The cell maths is the shared JS port, so the
 * weave is identical to the shader's. `seed` gives each panel its own front.
 */
function DitherPanel({
  level = 0.8,
  seed = 0,
  className,
}: {
  /** How far the blue has risen, 0–1. */
  level?: number
  seed?: number
  className?: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const inView = useInView(canvasRef, { once: true, amount: 0.25 })
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let cells: { x: number; y: number; t: number; f: number }[] = []
    let size = 0
    const layout = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      size = CELL * ratio
      const cols = Math.ceil(canvas.width / size)
      const rows = Math.ceil(canvas.height / size)
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
    let progress = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const cell of cells) {
        const state = cellState(progress, cell.f, cell.t)
        if (state === "rest") continue
        ctx.fillStyle = state === "front" ? CYAN : BLUE
        ctx.fillRect(cell.x, cell.y, size, size)
      }
    }

    layout()
    const observer = new ResizeObserver(() => {
      layout()
      draw()
    })
    observer.observe(canvas)

    if (!inView) {
      draw()
      return () => observer.disconnect()
    }
    if (reduceMotion) {
      progress = level
      draw()
      return () => observer.disconnect()
    }
    const start = performance.now()
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / RESOLVE_MS)
      progress = level * easeOut(t)
      draw()
      if (t < 1) frame = requestAnimationFrame(tick)
    })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [inView, reduceMotion, level, seed])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block size-full", className)}
    />
  )
}

export { DitherPanel }
