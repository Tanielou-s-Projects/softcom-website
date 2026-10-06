"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"
import { monoFamily } from "@/components/motion/dither-glyphs"
import {
  createAsciiScreen,
  type ScreenState,
} from "@/components/about/ascii-screen"

/* Scroll timeline, as fractions of the track. */
const SIZE_END = 0.7
const TV_END = 0.55
const POWER_MS = 1000
/** Pointer trail: points kept, and how fast each fades per frame. */
const TRAIL_MAX = 12
const TRAIL_DECAY = 0.86

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => t * t * (3 - 2 * t)

/**
 * The Alumni hero, after revelatio.studio: the team video rendered as
 * coloured ASCII on a curved CRT screen (see ascii-screen.ts). The screen
 * switches on with a flare when first seen, sits small and lifted on a black
 * stage, and as the page scrolls it grows to fill the viewport while its tube
 * curvature relaxes and the headline rises past it. The pointer leaves a
 * glitch trail through the glyphs.
 *
 * Renders only while on screen. Reduced motion: the finished, flat,
 * full-width screen drawn once from the poster — no pinning, autoplay or
 * switch-on. Without WebGL the poster is shown as a plain image.
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
      tv: reduce ? 0 : 1,
      power: reduce ? 1 : 0,
      flash: 0,
      time: 0,
      trail: [],
    }
    let hasFrame = false

    // --- Layout: screen size, lift and tube-ness follow scroll. -----------
    const layout = () => {
      const vw = window.innerWidth
      const vh = window.visualViewport?.height ?? window.innerHeight
      if (reduce) {
        screen.resize()
        return
      }
      const distance = track.offsetHeight - vh
      const raw =
        distance > 4
          ? clamp01(-track.getBoundingClientRect().top / distance)
          : 0
      const size = ease(clamp01(raw / SIZE_END))
      state.tv = 1 - clamp01(raw / TV_END)

      const mobile = vw < 768
      const baseW = mobile ? vw * 0.92 : Math.min(vw * 0.62, vh * 0.6 * 1.6)
      const baseH = mobile ? Math.min(baseW * 0.9, vh * 0.48) : baseW / 1.6
      const lift = lerp(mobile ? -0.1 : -0.07, 0, size) * vh

      screenEl.style.width = `${lerp(baseW, vw, size)}px`
      screenEl.style.height = `${lerp(baseH, vh, size)}px`
      screenEl.style.transform = `translate(-50%, calc(-50% + ${lift}px))`
      track.style.setProperty("--p", String(size))
      screen.resize()
    }

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
    window.addEventListener("scroll", scheduleLayout, { passive: true })
    window.addEventListener("resize", scheduleLayout)

    return () => {
      pause()
      cancelAnimationFrame(layoutFrame)
      io.disconnect()
      stage.removeEventListener("pointermove", onMove)
      stage.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("scroll", scheduleLayout)
      window.removeEventListener("resize", scheduleLayout)
      if (videoEl) {
        videoEl.removeAttribute("src")
        videoEl.load()
      }
      screen.dispose()
    }
  }, [video, poster, fx, fy, fz])

  return (
    <div
      ref={trackRef}
      className="h-[300vh] [--p:0] motion-reduce:h-auto motion-reduce:[--p:1]"
    >
      <section
        className={cn(
          "dark sticky top-0 h-svh overflow-hidden bg-black",
          "motion-reduce:relative motion-reduce:flex motion-reduce:h-auto motion-reduce:flex-col motion-reduce:gap-10 motion-reduce:pt-28 motion-reduce:pb-6"
        )}
      >
        {/* Centred by the transform the layout pass writes (it adds the lift). */}
        <div
          ref={screenRef}
          className="absolute top-1/2 left-1/2 motion-reduce:relative motion-reduce:top-auto motion-reduce:left-auto motion-reduce:aspect-[1.6] motion-reduce:w-full motion-reduce:transform-none"
        >
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
        {/* The headline rises from beneath the screen to the top-left. */}
        <h1
          className={cn(
            displayText,
            "absolute left-6 z-10 max-w-[14ch] text-foreground md:left-[3.2vw]",
            "top-[calc(14%+(1-var(--p))*72%)] -translate-y-[calc((1-var(--p))*100%)]",
            "motion-reduce:static motion-reduce:order-first motion-reduce:translate-y-0 motion-reduce:px-6 motion-reduce:md:px-[3.2vw]"
          )}
        >
          {title}
        </h1>
      </section>
    </div>
  )
}

export { AlumniHero }
