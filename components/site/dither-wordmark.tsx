"use client"

import * as React from "react"
import { useInView, useReducedMotion } from "motion/react"

import { bayer8, CELL, cellState, field, FIELD_MAX, SPREAD } from "@/lib/dither"
import { paintGlyphs } from "@/components/motion/dither-glyphs"
import { cn } from "@/lib/utils"

/* Greyscale on the neutral-900 plate: the letterforms a quiet step up, the
   front a lighter grey so its data glyphs read without shouting. */
const ON = "#2b2b2b"
const FRONT = "#6b6b6b"
const RESOLVE_MS = 1600
/** Cursor ring: radius and softness, in plate heights. */
const RING = 0.7

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * The footer's oversized wordmark, drawn in the shared dither (lib/dither.ts)
 * in greyscale: the logo sampled into cells the way the sector marks sample
 * their silhouettes, resolving from the bottom with a data-glyph front the
 * first time the footer comes into view — the page's closing beat. Afterwards
 * the cursor decodes it locally: cells near the pointer fall back to the
 * front, so a ring of glyphs follows it across the letters.
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
  const inView = useInView(canvasRef, { once: true, amount: 0.3 })
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let size = 0
    let ratio = 1
    let cols = 0
    let rows = 0
    let mask = new Uint8Array(0)
    let image: HTMLImageElement | null = null

    const sample = () => {
      if (!image) return
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      size = CELL * ratio
      cols = Math.ceil(canvas.width / size)
      rows = Math.ceil(canvas.height / size)
      const probe = document.createElement("canvas")
      probe.width = cols
      probe.height = rows
      const p = probe.getContext("2d")
      if (!p) return
      p.drawImage(image, 0, 0, cols, rows)
      const { data } = p.getImageData(0, 0, cols, rows)
      mask = new Uint8Array(cols * rows)
      for (let i = 0; i < mask.length; i++)
        mask[i] = data[i * 4 + 3] > 110 ? 1 : 0
    }

    // Pointer, in cell units; `on` eases the ring in and out.
    const target = { x: 0, y: 0, on: 0 }
    const shown = { x: 0, y: 0, on: 0 }
    const onMove = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      target.x = ((event.clientX - r.left) / r.width) * cols
      target.y = ((event.clientY - r.top) / r.height) * rows
      if (shown.on < 0.01) {
        shown.x = target.x
        shown.y = target.y
      }
      target.on = 1
    }
    const onLeave = () => {
      target.on = 0
    }
    const host = canvas.closest("footer") ?? canvas
    host.addEventListener("pointermove", onMove)
    host.addEventListener("pointerleave", onLeave)

    const inside = (col: number, up: number) =>
      col >= 0 && col < cols && up >= 0 && up < rows
        ? mask[(rows - 1 - up) * cols + col] === 1
        : false
    /*
     * The cursor caps coverage nearby, written as a raised field so the glyph
     * pass agrees: inside the ring the letters drop back to the front.
     */
    const fieldAt = (progress: number) => (col: number, up: number) => {
      const base = field(col, up, up / Math.max(1, rows - 1))
      if (shown.on < 0.01) return base
      const d = Math.hypot(col - shown.x, rows - 1 - up - shown.y) / rows
      const cap = 0.15 + (d / RING) * 0.9 + (1 - shown.on) * 2
      return Math.max(base, progress * (FIELD_MAX + SPREAD) - cap * SPREAD)
    }

    let progress = 0
    const paint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const f = fieldAt(progress)
      for (let row = 0; row < rows; row++) {
        const up = rows - 1 - row
        for (let col = 0; col < cols; col++) {
          if (!mask[row * cols + col]) continue
          const state = cellState(progress, f(col, up), bayer8(col, up))
          if (state === "rest") continue
          ctx.fillStyle = state === "front" ? FRONT : ON
          ctx.fillRect(col * size, row * size, size, size)
        }
      }
      paintGlyphs(ctx, {
        progress,
        cell: size,
        ratio,
        color: FRONT,
        fieldAt: f,
        maskAt: inside,
      })
    }

    let frame = 0
    let start = 0
    let painted = false
    let stopped = false
    const tick = (now: number) => {
      if (stopped) return
      if (inView) {
        if (!start) start = now
        progress = reduceMotion
          ? 1
          : easeOut(Math.min(1, (now - start) / RESOLVE_MS))
      }
      const follow = reduceMotion ? 1 : 0.14
      shown.x += (target.x - shown.x) * follow
      shown.y += (target.y - shown.y) * follow
      shown.on += (target.on - shown.on) * follow
      // Paint only while something changes: the resolve, or a moving ring.
      const settling =
        progress < 1 ||
        Math.abs(target.on - shown.on) > 0.002 ||
        (shown.on > 0.01 &&
          Math.hypot(target.x - shown.x, target.y - shown.y) > 0.05)
      if (settling || !painted) {
        paint()
        painted = true
      }
      frame = requestAnimationFrame(tick)
    }

    const img = new window.Image()
    img.decoding = "async"
    img.onload = () => {
      image = img
      sample()
      frame = requestAnimationFrame(tick)
    }
    img.src = src

    const resize = new ResizeObserver(() => {
      sample()
      painted = false
    })
    resize.observe(canvas)
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
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
