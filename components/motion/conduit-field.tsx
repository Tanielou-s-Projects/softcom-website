"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "motion/react"

import { bayer8, CELL, coverage, field, FRONT } from "@/lib/dither"
import { cn } from "@/lib/utils"

const BLUE = "#004bff"
const CYAN = "#00ffff"
/* The footer wordmark's ink: a quiet step up from black. */
const HALO = "#2e2e2e"
const RESOLVE_MS = 1600
/** Seconds for one pulse to cross from disc to disc. */
const PULSE_S = 3.2
const PULSES = 3

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

type Cell = {
  x: number
  y: number
  /** Ordered-dither threshold, 0–1. */
  t: number
  /** Where the cell sits in the shared rising field (lib/dither). */
  f: number
  /** How much of the cell's neighbourhood is inked, 0–1. */
  density: number
  color: string
}

type ConduitCell = { x: number; y: number; t: number; along: number }

/**
 * The Solutions mark in the site's dither: two discs, brand blue and brand
 * cyan, joined by a conduit — the landing hero's capsule pulled apart so the
 * connection itself shows. The pair is one ordered-dither gradient from blue
 * to cyan; the conduit thins toward its edges and the discs carry a faint grey
 * halo, so the mark sits in a field rather than on a flat black.
 *
 * It resolves once in the shared order (bottom first, cyan at the front),
 * then pulses travel the conduit from disc to disc — the work moving between
 * the two ends. Reduced motion gets the resolved still. The pulses pause while
 * the hero is off screen.
 */
function ConduitField({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const inView = useInView(canvasRef, { amount: 0.1 })
  const reduceMotion = useReducedMotion()
  const sceneRef = React.useRef<{
    paint: (progress: number) => void
    pulse: (seconds: number) => void
  } | null>(null)
  const resolvedRef = React.useRef(false)

  // Layout: sample the mark into cells whenever the canvas changes size.
  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let cells: Cell[] = []
    let conduit: ConduitCell[] = []
    let size = 0
    let pulseWidth = 1
    // Pulses run between the discs' inner edges.
    let pulseRange = { from: 0, to: 0 }
    let progress = 0
    // The resolved mark, cached so the pulse loop only draws the conduit.
    const still = document.createElement("canvas")
    const stillCtx = still.getContext("2d")

    const layout = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = still.width = Math.round(w * ratio)
      canvas.height = still.height = Math.round(h * ratio)
      size = CELL * ratio
      const cols = Math.ceil(w / CELL)
      const rows = Math.ceil(h / CELL)
      if (!cols || !rows) return

      // Geometry in CSS px. The mark rides high so the copy owns the bottom.
      const narrow = w < 768
      const cx = w / 2
      const cy = h * (narrow ? 0.32 : 0.38)
      const r = Math.max(
        40,
        Math.min(w * (narrow ? 0.15 : 0.11), h * 0.16, 180)
      )
      const half = Math.min(w * (narrow ? 0.3 : 0.28), r * 3.2)
      const ax = cx - half
      const bx = cx + half
      const tube = r * 0.4
      const halo = r * 1.3
      pulseWidth = r * 0.45

      cells = []
      conduit = []
      for (let row = 0; row < rows; row++) {
        const up = rows - 1 - row
        const py = (row + 0.5) * CELL
        for (let col = 0; col < cols; col++) {
          const px = (col + 0.5) * CELL
          const da = Math.hypot(px - ax, py - cy)
          const db = Math.hypot(px - bx, py - cy)
          const edge = Math.min(da, db)

          let density = 0
          let color = HALO
          // Discs: solid, softening over their outer fifth.
          if (edge < r) {
            density =
              edge < r * 0.8 ? 1 : 1 - ((edge - r * 0.8) / (r * 0.2)) * 0.6
          }
          // Conduit: densest on its axis, thinning to its edges.
          const dy = Math.abs(py - cy)
          const inTube = px > ax && px < bx && dy < tube
          if (inTube) {
            density = Math.max(density, 0.6 * Math.sqrt(1 - dy / tube))
          }
          if (density > 0) {
            // One blue → cyan gradient across the whole mark, dithered.
            const along = (px - (ax - r)) / (bx - ax + 2 * r)
            color = bayer8(col + 3, up + 5) < along ? CYAN : BLUE
          } else if (edge < r + halo) {
            density = 0.16 * (1 - (edge - r) / halo)
          }
          if (density <= 0) continue

          const t = bayer8(col, up)
          cells.push({
            x: col * size,
            y: row * size,
            t,
            f: field(col, up, up / Math.max(1, rows - 1), 3),
            density,
            color,
          })
          if (inTube && edge >= r) {
            conduit.push({
              x: col * size,
              y: row * size,
              t,
              along: px,
            })
          }
        }
      }
      pulseRange = { from: ax + r, to: bx - r }
    }

    const paintCells = (target: CanvasRenderingContext2D, value: number) => {
      target.clearRect(0, 0, canvas.width, canvas.height)
      for (const cell of cells) {
        const cover = value >= 1 ? 1 : coverage(value, cell.f)
        if (cell.t >= cell.density * cover) continue
        target.fillStyle = cover < FRONT ? CYAN : cell.color
        target.fillRect(cell.x, cell.y, size, size)
      }
    }

    const paint = (value: number) => {
      progress = value
      paintCells(ctx, value)
      if (value >= 1 && stillCtx) paintCells(stillCtx, 1)
    }

    const pulse = (seconds: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(still, 0, 0)
      const span = pulseRange.to - pulseRange.from
      if (span <= 0) return
      const heads: number[] = []
      for (let k = 0; k < PULSES; k++) {
        const phase = (seconds / PULSE_S + k / PULSES) % 1
        heads.push(pulseRange.from + phase * span)
      }
      ctx.fillStyle = CYAN
      for (const cell of conduit) {
        let intensity = 0
        for (const head of heads) {
          const d = (cell.along - head) / pulseWidth
          intensity = Math.max(intensity, Math.exp(-d * d))
        }
        if (cell.t < intensity * 0.9) ctx.fillRect(cell.x, cell.y, size, size)
      }
    }

    sceneRef.current = { paint, pulse }
    layout()
    paint(progress)

    const resize = new ResizeObserver(() => {
      layout()
      paint(progress)
    })
    resize.observe(canvas)
    return () => {
      resize.disconnect()
      sceneRef.current = null
    }
  }, [])

  // Resolve once, then keep the pulses moving while the hero is on screen.
  React.useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    if (reduceMotion) {
      scene.paint(1)
      resolvedRef.current = true
      return
    }
    if (!inView) return

    let frame = 0
    const start = performance.now()
    const skip = resolvedRef.current ? RESOLVE_MS : 0
    frame = requestAnimationFrame(function tick(now) {
      const elapsed = now - start + skip
      if (elapsed < RESOLVE_MS) {
        scene.paint(easeOut(elapsed / RESOLVE_MS))
      } else {
        if (!resolvedRef.current) {
          scene.paint(1)
          resolvedRef.current = true
        }
        scene.pulse((elapsed - RESOLVE_MS) / 1000)
      }
      frame = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block size-full", className)}
    />
  )
}

export { ConduitField }
