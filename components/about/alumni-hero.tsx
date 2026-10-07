"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"
import { monoFamily } from "@/components/motion/dither-glyphs"
import {
  createAsciiScreen,
  type ScreenState,
} from "@/components/about/ascii-screen"

const POWER_MS = 1000
/** Pointer trail: points kept, and how fast each fades per frame. */
const TRAIL_MAX = 12
const TRAIL_DECAY = 0.86

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

/**
 * The Alumni hero: the team video rendered as coloured ASCII (see
 * ascii-screen.ts), filling the hero edge to edge with the headline over its
 * lower edge. It switches on with a flare when first seen, and the pointer
 * leaves a glitch trail through the glyphs. No scroll animation.
 *
 * Renders only while on screen. Reduced motion: drawn once from the poster —
 * no autoplay or switch-on. Without WebGL the poster is shown as a plain image.
 */
function AlumniHero({
  video,
  poster,
  alt,
  title,
  focus,
}: {
  video?: string
  poster: string
  alt: string
  title: string
  /** Subject position in the footage (x, y from the top) and zoom. */
  focus?: { x: number; y: number; zoom: number }
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const screenRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = React.useState(false)
  // Primitives, so a fresh object literal each render doesn't re-run setup.
  const fx = focus?.x ?? 0.5
  const fy = focus?.y ?? 0.5
  const fz = focus?.zoom ?? 1

  React.useEffect(() => {
    const track = trackRef.current
    const screenEl = screenRef.current
    const canvas = canvasRef.current
    if (!track || !screenEl || !canvas) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const created = createAsciiScreen(canvas, {
      font: monoFamily(),
      focus: { x: fx, y: fy, zoom: fz },
    })
    // Without WebGL the poster stands in, but the screen still grows on scroll.
    if (!created) setFallback(true)
    const screen = created ?? {
      upload: () => {},
      draw: () => {},
      resize: () => {},
      dispose: () => {},
    }

    const state: ScreenState = {
      // A flat, full-bleed screen: no tube curvature, no scroll animation.
      tv: 0,
      power: reduce ? 1 : 0,
      flash: 0,
      time: 0,
      trail: [],
    }
    let hasFrame = false

    // --- Layout: the screen simply fills the hero. ------------------------
    const layout = () => screen.resize()

    // --- Render loop, only while on screen. -------------------------------
    let frame = 0
    let running = false
    let powerStart = 0
    const start = performance.now()
    const render = () => {
      if (hasFrame) screen.draw(state)
    }

    // --- Source: the video once it can play, the poster until then. ------
    const image = new window.Image()
    image.decoding = "async"
    image.onload = () => {
      if (hasFrame) return
      screen.upload(image, image.naturalWidth, image.naturalHeight)
      hasFrame = true
      render()
    }
    image.src = poster

    let videoEl: HTMLVideoElement | null = null
    if (video && !reduce) {
      videoEl = document.createElement("video")
      videoEl.muted = true
      videoEl.loop = true
      videoEl.playsInline = true
      videoEl.preload = "auto"
      videoEl.src = video
    }

    const tick = (now: number) => {
      state.time = (now - start) / 1000
      if (powerStart) {
        const t = clamp01((now - powerStart) / POWER_MS)
        // Opens fast to a sliver, then slower to full; two flare pulses.
        state.power =
          t < 0.35
            ? Math.pow(t / 0.35, 0.6) * 0.28
            : 0.28 + Math.pow((t - 0.35) / 0.65, 1.3) * 0.72
        state.flash =
          Math.exp(-Math.pow((t - 0.12) / 0.08, 2)) * 1.5 +
          Math.exp(-Math.pow((t - 0.32) / 0.14, 2)) * 0.5
        if (t >= 1) {
          state.power = 1
          state.flash = 0
          powerStart = 0
        }
      }
      for (const point of state.trail) point[2] *= TRAIL_DECAY
      state.trail = state.trail.filter((point) => point[2] > 0.02)

      if (videoEl && videoEl.readyState >= 2) {
        screen.upload(videoEl, videoEl.videoWidth, videoEl.videoHeight)
        hasFrame = true
      }
      render()
      frame = requestAnimationFrame(tick)
    }

    const play = () => {
      if (running || reduce || !created) return
      running = true
      videoEl?.play().catch(() => {})
      if (state.power === 0 && !powerStart) powerStart = performance.now()
      frame = requestAnimationFrame(tick)
    }
    const pause = () => {
      running = false
      cancelAnimationFrame(frame)
      videoEl?.pause()
    }

    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? play() : pause()
    )
    io.observe(track)

    // --- Pointer trail. ---------------------------------------------------
    let last: { x: number; y: number; t: number } | null = null
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return
      const r = canvas.getBoundingClientRect()
      const x = (event.clientX - r.left) / r.width
      const y = 1 - (event.clientY - r.top) / r.height
      const now = performance.now()
      const speed = last
        ? Math.hypot(x - last.x, y - last.y) / Math.max(1, now - last.t)
        : 0
      last = { x, y, t: now }
      state.trail.unshift([x, y, Math.min(1, 0.35 + speed * 120)])
      if (state.trail.length > TRAIL_MAX) state.trail.length = TRAIL_MAX
    }
    const onLeave = () => {
      last = null
    }
    const stage = screenEl.parentElement ?? screenEl
    stage.addEventListener("pointermove", onMove)
    stage.addEventListener("pointerleave", onLeave)

    // --- Scroll and resize. -----------------------------------------------
    let layoutFrame = 0
    const scheduleLayout = () => {
      if (layoutFrame) return
      layoutFrame = requestAnimationFrame(() => {
        layoutFrame = 0
        layout()
        if (!running) render()
      })
    }
    layout()
    window.addEventListener("resize", scheduleLayout)

    return () => {
      pause()
      cancelAnimationFrame(layoutFrame)
      io.disconnect()
      stage.removeEventListener("pointermove", onMove)
      stage.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("resize", scheduleLayout)
      if (videoEl) {
        videoEl.removeAttribute("src")
        videoEl.load()
      }
      screen.dispose()
    }
  }, [video, poster, fx, fy, fz])

  return (
    <div ref={trackRef}>
      <section className="dark relative h-svh min-h-[560px] overflow-hidden bg-black">
        <div ref={screenRef} className="absolute inset-0">
          {fallback ? (
            // eslint-disable-next-line @next/next/no-img-element -- poster only when WebGL is unavailable
            <img src={poster} alt={alt} className="size-full object-cover" />
          ) : (
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={alt}
              className="block size-full"
            />
          )}
        </div>
        {/* A low shade so the headline holds over the picture. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent"
        />
        <h1
          className={cn(
            displayText,
            "absolute bottom-[8vh] left-6 z-10 max-w-[14ch] text-foreground md:left-[3.2vw]"
          )}
        >
          {title}
        </h1>
      </section>
    </div>
  )
}

export { AlumniHero }
