"use client"

import * as React from "react"

import { bayer8, field, GLYPH_STREAM } from "@/lib/dither"

/*
 * A quiet layer behind the page, so the paper isn't flat (client, 13 Oct
 * 2026). Three candidates, chosen with `?bg=grid|dither|binary` while we
 * compare; a small switcher shows whenever the parameter is present.
 *
 * - grid:   a hairline scaffold on the shell's rhythm whose nodes pulse
 * - dither: the site's dither as a faint texture drifting with the scroll
 * - binary: sparse ones and zeros surfacing and fading at low contrast
 *
 * Fixed behind everything; plates and photos paint over it. Colours come
 * from the theme tokens, so it follows light and dark. Reduced motion draws
 * one still frame.
 */

export const BACKGROUNDS = ["none", "grid", "dither", "binary"] as const
export type Background = (typeof BACKGROUNDS)[number]

type Draw = (
  ctx: CanvasRenderingContext2D,
  size: { w: number; h: number },
  t: number,
  scroll: number,
  colors: { ink: string; accent: string; mono: string }
) => void

const fract = (x: number) => x - Math.floor(x)
const hash = (x: number, y: number) =>
  fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453)

/* ── grid ── */
const STEP = 96
const drawGrid: Draw = (ctx, { w, h }, t, scroll, { ink, accent }) => {
  const oy = -(scroll * 0.5) % STEP
  ctx.globalAlpha = 0.06
  ctx.strokeStyle = ink
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 0.5; x < w; x += STEP) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
  }
  for (let y = oy + 0.5; y < h; y += STEP) {
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
  }
  ctx.stroke()
  const row0 = Math.floor((scroll * 0.5) / STEP)
  for (let gx = 0; gx * STEP < w + STEP; gx++) {
    for (let gy = -1; oy + gy * STEP < h + STEP; gy++) {
      const seed = hash(gx, gy + row0)
      // Mostly at rest; now and then a node swells and lights.
      const pulse = Math.pow(Math.max(0, Math.sin(t * 0.6 + seed * 40)), 12)
      const x = gx * STEP
      const y = oy + gy * STEP
      ctx.globalAlpha = 0.14 + pulse * 0.6
      ctx.fillStyle = pulse > 0.2 ? accent : ink
      const s = 3 + pulse * 3
      ctx.fillRect(x - s / 2, y - s / 2, s, s)
    }
  }
}

/* ── dither ── */
const CELL = 6
const drawDither: Draw = (ctx, { w, h }, t, scroll, { ink, accent }) => {
  const drift = scroll / CELL / 4 + t * 0.15
  const cols = Math.ceil(w / CELL)
  const rows = Math.ceil(h / CELL)
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      // The field's noise term alone, 0–1: soft islands that drift upward.
      const v = field(c * 0.5, (r + drift) * 0.5, 0, 3) / 0.35
      const threshold = bayer8(c, r)
      const lit = (v - 0.62) * 3.2
      if (threshold >= lit) continue
      const front = lit - threshold < 0.12
      ctx.globalAlpha = front ? 0.22 : 0.07
      ctx.fillStyle = front ? accent : ink
      ctx.fillRect(c * CELL, r * CELL, CELL - 1, CELL - 1)
    }
  }
}

/* ── binary ── */
const G = 28
const drawBinary: Draw = (ctx, { w, h }, t, scroll, { ink, accent, mono }) => {
  const oy = -(scroll * 0.4) % G
  const row0 = Math.floor((scroll * 0.4) / G)
  ctx.font = `500 11px ${mono}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  for (let gx = 0; gx * G < w; gx++) {
    for (let gy = -1; oy + gy * G < h + G; gy++) {
      const seed = hash(gx, gy + row0)
      if (seed > 0.42) continue
      const wave = Math.sin(t * (0.4 + seed) + seed * 60)
      if (wave < 0.55) continue
      const a = (wave - 0.55) / 0.45
      const glyph =
        seed < 0.03 ? GLYPH_STREAM[(gx * 7 + gy) % 40] : seed < 0.22 ? "0" : "1"
      ctx.globalAlpha = a * (seed < 0.03 ? 0.4 : 0.16)
      ctx.fillStyle = seed < 0.03 ? accent : ink
      ctx.fillText(glyph, gx * G + G / 2, oy + gy * G + G / 2)
    }
  }
}

const DRAW: Record<Exclude<Background, "none">, Draw> = {
  grid: drawGrid,
  dither: drawDither,
  binary: drawBinary,
}

function readColors() {
  const s = getComputedStyle(document.documentElement)
  return {
    ink: s.getPropertyValue("--color-ink").trim() || "#888",
    accent: s.getPropertyValue("--color-accent-ink").trim() || "#00ffff",
    // Canvas fonts can't read CSS variables; resolve the family here.
    mono: s.getPropertyValue("--font-mono").trim() || "ui-monospace, monospace",
  }
}

/* The `?bg=` parameter as a store, so the switcher can change it in place. */
const BG_EVENT = "softcom:bg"
const subscribe = (onChange: () => void) => {
  window.addEventListener(BG_EVENT, onChange)
  return () => window.removeEventListener(BG_EVENT, onChange)
}
const readParam = () => new URLSearchParams(window.location.search).get("bg")

function useBackgroundParam(): [Background, (b: Background) => void, boolean] {
  const param = React.useSyncExternalStore(subscribe, readParam, () => null)
  const bg = (BACKGROUNDS as readonly string[]).includes(param ?? "")
    ? (param as Background)
    : "none"
  const choose = (next: Background) => {
    const url = new URL(window.location.href)
    url.searchParams.set("bg", next)
    window.history.replaceState(null, "", url)
    window.dispatchEvent(new Event(BG_EVENT))
  }
  return [bg, choose, param !== null]
}

function PageBackground() {
  const [bg, choose, shown] = useBackgroundParam()
  const canvas = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const el = canvas.current
    if (!el || bg === "none") return
    const ctx = el.getContext("2d")
    if (!ctx) return
    const draw = DRAW[bg]
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    let colors = readColors()
    let size = { w: 0, h: 0 }
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      size = { w: window.innerWidth, h: window.innerHeight }
      el.width = size.w * dpr
      el.height = size.h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const theme = new MutationObserver(() => (colors = readColors()))
    theme.observe(document.documentElement, { attributeFilter: ["class"] })

    let frame = 0
    let last = 0
    const start = performance.now()
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - last < 33 || document.hidden) return // ~30fps is plenty
      last = now
      ctx.clearRect(0, 0, size.w, size.h)
      const t = reduce.matches ? 0 : (now - start) / 1000
      draw(ctx, size, t, window.scrollY, colors)
    }
    frame = requestAnimationFrame(tick)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(frame)
      theme.disconnect()
      window.removeEventListener("resize", resize)
    }
  }, [bg])

  return (
    <>
      {bg !== "none" && (
        <canvas
          ref={canvas}
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 size-full"
        />
      )}
      {shown && (
        <div className="fixed bottom-4 left-4 z-50 flex gap-1 rounded-full border border-line bg-surface/90 p-1 text-sm backdrop-blur">
          {BACKGROUNDS.map((b) => (
            <button
              key={b}
              onClick={() => choose(b)}
              className={
                b === bg
                  ? "rounded-full bg-ink px-3 py-1 text-paper"
                  : "rounded-full px-3 py-1 text-ink-soft hover:text-ink"
              }
            >
              {b}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export { PageBackground }
