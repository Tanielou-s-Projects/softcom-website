"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "motion/react"

import { bayer8, CELL, coverage, field, FRONT } from "@/lib/dither"
import { cn } from "@/lib/utils"

const BLUE = "#004bff"
const CYAN = "#00ffff"
/* The halo round each disc: a faint step of ink on paper. */
const HALO = "rgb(12 12 13 / 0.16)"
const RESOLVE_MS = 1600
/** Seconds for one pulse to cross a conduit. */
const PULSE_S = 3.2
const PULSES = 3

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/** Clear space kept between the mark and the hero copy, in px. */
const COPY_GAP = 32
/** The share of its height every layout's mark stays within, top down. */
const MARK_SHARE = 0.6

type Disc = { x: number; y: number; r: number }
/** A conduit between two discs, by index; `half` is half its thickness. */
type Tube = { a: number; b: number; half: number }
type Geometry = { discs: Disc[]; tubes: Tube[] }

/**
 * The marks, one per page that opens on dither. All are the brand's discs and
 * the conduit that joins them — the landing hero's capsule pulled apart — so
 * they read as one family; the arrangement says what the page is about.
 * Geometry is in CSS px and rides high, leaving the bottom to the copy.
 */
const LAYOUTS = {
  /** Solutions: two ends of the work, connected. */
  conduit(w: number, h: number, narrow: boolean): Geometry {
    const cy = h * (narrow ? 0.32 : 0.38)
    const r = Math.max(40, Math.min(w * (narrow ? 0.15 : 0.11), h * 0.16, 180))
    const half = Math.min(w * (narrow ? 0.3 : 0.28), r * 3.2)
    return {
      discs: [
        { x: w / 2 - half, y: cy, r },
        { x: w / 2 + half, y: cy, r },
      ],
      tubes: [{ a: 0, b: 1, half: r * 0.4 }],
    }
  },
  /** Products: four of Softcom's own, on one line. */
  products(w: number, h: number, narrow: boolean): Geometry {
    const cy = h * (narrow ? 0.3 : 0.36)
    const r = Math.max(24, Math.min(w * (narrow ? 0.08 : 0.06), h * 0.1, 110))
    const half = Math.min(w * (narrow ? 0.38 : 0.32), r * 7)
    const discs = [0, 1, 2, 3].map((i) => ({
      x: w / 2 - half + (i * 2 * half) / 3,
      y: cy,
      r,
    }))
    return {
      discs,
      tubes: [0, 1, 2].map((i) => ({ a: i, b: i + 1, half: r * 0.4 })),
    }
  },
  /** Insights: ideas of different weight, loosely connected. */
  insights(w: number, h: number, narrow: boolean): Geometry {
    const cy = h * (narrow ? 0.3 : 0.36)
    const r = Math.max(36, Math.min(w * (narrow ? 0.13 : 0.1), h * 0.15, 160))
    const spread = w * (narrow ? 0.3 : 0.24)
    return {
      discs: [
        { x: w / 2 - spread, y: cy + r * 0.45, r },
        { x: w / 2 + spread * 0.08, y: cy - r * 0.55, r: r * 0.68 },
        { x: w / 2 + spread, y: cy + r * 0.2, r: r * 0.45 },
      ],
      tubes: [
        { a: 0, b: 1, half: r * 0.22 },
        { a: 1, b: 2, half: r * 0.18 },
      ],
    }
  },
} satisfies Record<string, (w: number, h: number, narrow: boolean) => Geometry>

export type DitherMarkLayout = keyof typeof LAYOUTS

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

/** A cell on a conduit, with its distance along it for the pulses. */
type ConduitCell = { x: number; y: number; t: number; tube: number; s: number }

/**
 * A brand mark in the site's dither: discs and conduits, one ordered-dither
 * gradient from blue to cyan across the whole mark, conduits thinning toward
 * their edges, a faint grey halo round each disc so the mark sits in a field
 * rather than on flat paper.
 *
 * It resolves once in the shared order (bottom first, cyan at the front),
 * then pulses travel each conduit — the work moving between the ends.
 * Reduced motion gets the resolved still; the pulses pause off screen.
 */
function DitherMark({
  layout,
  className,
}: {
  layout: DitherMarkLayout
  className?: string
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const inView = useInView(canvasRef, { amount: 0.1 })
  const reduceMotion = useReducedMotion()
  const sceneRef = React.useRef<{
    paint: (progress: number) => void
    pulse: (seconds: number) => void
  } | null>(null)
  const resolvedRef = React.useRef(false)

  // Sample the mark into cells whenever the canvas changes size.
  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let cells: Cell[] = []
    let conduit: ConduitCell[] = []
    /** Per tube: where pulses start and stop along it, in px. */
    let ranges: { from: number; to: number }[] = []
    let size = 0
    let pulseWidth = 1
    let progress = 0
    // The resolved mark, cached so the pulse loop only draws the conduits.
    const still = document.createElement("canvas")
    const stillCtx = still.getContext("2d")

    /*
     * The hero's copy sits over the foot of the canvas. Each layout keeps its
     * mark inside the top 60% of the height it is given, so when the copy
     * rises into that (a short screen, a long title) the mark is laid out in
     * a shorter height and shrinks to stay above it. With room to spare it
     * draws exactly as designed.
     */
    const copy = canvas
      .closest("section")
      ?.querySelector<HTMLElement>("[data-hero-copy]")
    const fitHeight = (h: number) => {
      if (!copy) return h
      const room =
        copy.getBoundingClientRect().top -
        canvas.getBoundingClientRect().top -
        COPY_GAP
      return Math.max(160, Math.min(h, room / MARK_SHARE))
    }

    const sample = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = still.width = Math.round(w * ratio)
      canvas.height = still.height = Math.round(h * ratio)
      size = CELL * ratio
      const cols = Math.ceil(w / CELL)
      const rows = Math.ceil(h / CELL)
      if (!cols || !rows) return

      const { discs, tubes } = LAYOUTS[layout](w, fitHeight(h), w < 768)
      const left = Math.min(...discs.map((d) => d.x - d.r))
      const right = Math.max(...discs.map((d) => d.x + d.r))
      const segments = tubes.map((tube) => {
        const a = discs[tube.a]
        const b = discs[tube.b]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const length = Math.hypot(dx, dy)
        return { ...tube, ax: a.x, ay: a.y, dx, dy, length }
      })
      ranges = tubes.map((tube, i) => ({
        from: discs[tube.a].r,
        to: segments[i].length - discs[tube.b].r,
      }))
      pulseWidth = Math.min(...tubes.map((t) => t.half)) * 1.1

      cells = []
      conduit = []
      for (let row = 0; row < rows; row++) {
        const up = rows - 1 - row
        const py = (row + 0.5) * CELL
        for (let col = 0; col < cols; col++) {
          const px = (col + 0.5) * CELL

          // Nearest disc, measured from its edge (negative inside).
          let edge = Infinity
          let reach = 0
          for (const disc of discs) {
            const e = Math.hypot(px - disc.x, py - disc.y) - disc.r
            if (e < edge) {
              edge = e
              reach = disc.r
            }
          }

          let density = 0
          // Discs: solid, softening over their outer fifth.
          if (edge < 0) {
            const depth = -edge / reach
            density = depth > 0.2 ? 1 : 0.4 + (depth / 0.2) * 0.6
          }

          // Conduits: densest on the axis, thinning to the edges.
          let onTube = -1
          let along = 0
          segments.forEach((seg, i) => {
            const k =
              ((px - seg.ax) * seg.dx + (py - seg.ay) * seg.dy) /
              (seg.length * seg.length)
            if (k <= 0 || k >= 1) return
            const off = Math.hypot(
              px - (seg.ax + k * seg.dx),
              py - (seg.ay + k * seg.dy)
            )
            if (off >= seg.half) return
            density = Math.max(density, 0.6 * Math.sqrt(1 - off / seg.half))
            onTube = i
            along = k * seg.length
          })

          let color = HALO
          if (density > 0) {
            // One blue → cyan gradient across the whole mark, dithered.
            const g = (px - left) / Math.max(1, right - left)
            color = bayer8(col + 3, up + 5) < g ? CYAN : BLUE
          } else if (edge < reach * 1.3) {
            density = 0.16 * (1 - edge / (reach * 1.3))
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
          if (onTube >= 0 && edge >= 0) {
            conduit.push({
              x: col * size,
              y: row * size,
              t,
              tube: onTube,
              s: along,
            })
          }
        }
      }
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
      // Each conduit runs its own train, offset so they don't fire in step.
      const heads = ranges.map((range, i) => {
        const span = range.to - range.from
        return Array.from({ length: PULSES }, (_, k) => {
          const phase = (seconds / PULSE_S + k / PULSES + i * 0.37) % 1
          return range.from + phase * span
        })
      })
      ctx.fillStyle = CYAN
      for (const cell of conduit) {
        let intensity = 0
        for (const head of heads[cell.tube]) {
          const d = (cell.s - head) / pulseWidth
          intensity = Math.max(intensity, Math.exp(-d * d))
        }
        if (cell.t < intensity * 0.9) ctx.fillRect(cell.x, cell.y, size, size)
      }
    }

    sceneRef.current = { paint, pulse }
    sample()
    paint(progress)

    const resize = new ResizeObserver(() => {
      sample()
      paint(progress)
    })
    resize.observe(canvas)
    if (copy) resize.observe(copy)
    return () => {
      resize.disconnect()
      sceneRef.current = null
    }
  }, [layout])

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

export { DitherMark }
