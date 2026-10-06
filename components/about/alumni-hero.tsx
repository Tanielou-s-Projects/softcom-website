"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"
import { monoFamily } from "@/components/motion/dither-glyphs"

/** CSS px per glyph cell — fixed, so the growing screen reveals more glyphs. */
const CELL = 10
/** Sparse to dense. Darker pixels get heavier glyphs (see the draw pass). */
const RAMP = " .:-=+*01x#%@"
/** How strongly the video shows through beneath the glyphs (0–1). */
const UNDERLAY = 0.55

const ease = (t: number) => t * t * (3 - 2 * t)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * The Alumni hero, after revelatio.studio: the team photograph (or, once it
 * exists, a video of it) rendered as a coloured ASCII mosaic on a curved
 * screen. It starts small and centred; scrolling grows it toward full bleed
 * while its curvature relaxes, and the headline travels up past it.
 *
 * Canvas 2D, three passes per frame: glyphs chosen by each cell's luminance
 * are stamped from a white atlas, then the source drawn at one pixel per cell
 * is composited `source-in`, so each glyph takes its cell's colour. Images
 * redraw only on scroll; video redraws per frame while visible. Reduced
 * motion: the finished state, unpinned, with no autoplay.
 */
function AlumniHero({
  src,
  video,
  alt,
  title,
  focus = { y: 0.5, zoom: 1 },
  videoFocus = focus,
}: {
  src: string
  /** Optional video; `src` is its poster and the fallback. */
  video?: string
  alt: string
  title: string
  /**
   * Where the subject sits in the source (y, 0–1 from the top) and how far to
   * crop in on it — a team in a thin strip of a wide shot needs both.
   */
  focus?: { y: number; zoom: number }
  /** The video's own framing, when it differs from the photo's. */
  videoFocus?: { y: number; zoom: number }
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const track = trackRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!track || !canvas || !ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const small = document.createElement("canvas")
    const sctx = small.getContext("2d", { willReadFrequently: true })
    const atlas = document.createElement("canvas")
    if (!sctx) return

    let ratio = 1
    let cell = CELL
    let source: HTMLImageElement | HTMLVideoElement | null = null
    let sourceW = 0
    let sourceH = 0
    let framing = focus
    let progress = reduce ? 1 : 0

    const buildAtlas = () => {
      atlas.width = RAMP.length * cell
      atlas.height = cell
      const a = atlas.getContext("2d")
      if (!a) return
      a.clearRect(0, 0, atlas.width, atlas.height)
      a.fillStyle = "#fff"
      a.font = `600 ${Math.round(cell * 1.05)}px ${monoFamily()}`
      a.textAlign = "center"
      a.textBaseline = "middle"
      ;[...RAMP].forEach((char, i) =>
        a.fillText(char, i * cell + cell / 2, cell / 2 + cell * 0.06)
      )
    }

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(canvas.clientWidth * ratio)
      canvas.height = Math.round(canvas.clientHeight * ratio)
      cell = Math.round(CELL * ratio)
      buildAtlas()
    }

    const draw = () => {
      if (!source || !sourceW) return
      const W = canvas.width
      const H = canvas.height
      const mobile = canvas.clientWidth < 768
      const p = progress
      const cols = Math.floor((W * lerp(mobile ? 0.86 : 0.58, 0.97, p)) / cell)
      const rows = Math.floor((H * lerp(mobile ? 0.42 : 0.5, 0.9, p)) / cell)
      // Centred high at the start, leaving the headline room beneath it.
      const centre = lerp(mobile ? 0.38 : 0.42, 0.5, p)
      const x0 = Math.round((W - cols * cell) / 2)
      const y0 = Math.round(H * centre - (rows * cell) / 2)

      // Cover-crop the source into one pixel per cell.
      small.width = cols
      small.height = rows
      const scale = Math.max(cols / sourceW, rows / sourceH) * framing.zoom
      const sw = cols / scale
      const sh = rows / scale
      // Centre the crop on the subject, kept inside the source.
      const sy = Math.max(
        0,
        Math.min(sourceH - sh, sourceH * framing.y - sh / 2)
      )
      // Cropped in on the subject (see `focus`).
      sctx.drawImage(source, (sourceW - sw) / 2, sy, sw, sh, 0, 0, cols, rows)
      const data = sctx.getImageData(0, 0, cols, rows).data

      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, W, H)
      // The curved screen: top and bottom edges bow outward, relaxing to flat.
      const bulge = lerp(0.07, 0.012, p) * rows
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const u = ((c + 0.5) / cols) * 2 - 1
          const edge = bulge * u * u
          if (r < edge || r >= rows - edge) continue
          const i = (r * cols + c) * 4
          const lum =
            (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
            255
          // Bright cells get the heavier glyphs, so highlights sparkle and
          // shadows stay open; the video underneath carries the image.
          const g = Math.round(Math.pow(lum, 1.6) * (RAMP.length - 1))
          if (g === 0) continue
          ctx.drawImage(
            atlas,
            g * cell,
            0,
            cell,
            cell,
            x0 + c * cell,
            y0 + r * cell,
            cell,
            cell
          )
        }
      }
      // Tint each glyph with its cell's colour.
      ctx.globalCompositeOperation = "source-in"
      ctx.globalAlpha = 0.75
      ctx.imageSmoothingEnabled = false
      // Lift only the tint: navy shirts become a readable blue on black,
      // while glyph weight still follows the true luminance.
      ctx.filter = "brightness(1.5) saturate(1.3)"
      ctx.drawImage(small, 0, 0, cols, rows, x0, y0, cols * cell, rows * cell)
      ctx.filter = "none"

      // The picture itself, dimmed, behind the glyphs and clipped to the
      // same curved screen: the ASCII becomes a texture over a readable
      // image rather than the whole image.
      ctx.globalCompositeOperation = "destination-over"
      ctx.globalAlpha = UNDERLAY
      ctx.imageSmoothingEnabled = true
      ctx.save()
      ctx.beginPath()
      const screenW = cols * cell
      const screenH = rows * cell
      const bow = bulge * cell
      ctx.moveTo(x0, y0 + bow)
      ctx.quadraticCurveTo(x0 + screenW / 2, y0 - bow, x0 + screenW, y0 + bow)
      ctx.lineTo(x0 + screenW, y0 + screenH - bow)
      ctx.quadraticCurveTo(
        x0 + screenW / 2,
        y0 + screenH + bow,
        x0,
        y0 + screenH - bow
      )
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(
        source,
        (sourceW - sw) / 2,
        sy,
        sw,
        sh,
        x0,
        y0,
        screenW,
        screenH
      )
      ctx.restore()
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
    }

    const readProgress = () => {
      if (reduce) return 1
      const distance = track.offsetHeight - window.innerHeight
      const raw = -track.getBoundingClientRect().top / Math.max(1, distance)
      return ease(Math.max(0, Math.min(1, raw)))
    }

    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        progress = readProgress()
        track.style.setProperty("--p", String(progress))
        draw()
      })
    }

    // Video redraws every frame while it is on screen.
    let videoFrame = 0
    let visible = true
    const loop = () => {
      draw()
      videoFrame = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!(source instanceof HTMLVideoElement)) return
      cancelAnimationFrame(videoFrame)
      if (visible) {
        source.play().catch(() => {})
        videoFrame = requestAnimationFrame(loop)
      } else source.pause()
    })
    io.observe(track)

    const ready = (
      element: HTMLImageElement | HTMLVideoElement,
      w: number,
      h: number
    ) => {
      source = element
      sourceW = w
      sourceH = h
      resize()
      schedule()
    }

    const image = new window.Image()
    image.decoding = "async"
    image.onload = () => {
      if (!source) {
        framing = focus
        ready(image, image.naturalWidth, image.naturalHeight)
      }
    }
    image.src = src

    let videoEl: HTMLVideoElement | null = null
    if (video) {
      videoEl = document.createElement("video")
      videoEl.muted = true
      videoEl.loop = true
      videoEl.playsInline = true
      videoEl.preload = "auto"
      videoEl.src = video
      videoEl.addEventListener("loadeddata", () => {
        if (!videoEl) return
        framing = videoFocus
        ready(videoEl, videoEl.videoWidth, videoEl.videoHeight)
        if (!reduce && visible) {
          videoEl.play().catch(() => {})
          videoFrame = requestAnimationFrame(loop)
        }
      })
    }

    const ro = new ResizeObserver(() => {
      resize()
      schedule()
    })
    ro.observe(canvas)
    window.addEventListener("scroll", schedule, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(videoFrame)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("scroll", schedule)
      videoEl?.pause()
      videoEl?.removeAttribute("src")
    }
    // Framing is static per page; reading it once at mount is intended.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, video])

  return (
    <div
      ref={trackRef}
      className="h-[260vh] [--p:0] motion-reduce:h-auto motion-reduce:[--p:1]"
    >
      <section className="dark sticky top-0 h-svh overflow-hidden bg-black motion-reduce:relative">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={alt}
          className="absolute inset-0 size-full"
        />
        {/* A soft shade so the headline holds over the bright picture. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_70%_45%_at_15%_18%,rgb(0_0_0/0.75),transparent_70%)] opacity-(--p)"
        />
        {/* The headline travels from the bottom-left up past the screen. */}
        <h1
          className={cn(
            displayText,
            "absolute left-6 z-10 max-w-[14ch] text-foreground md:left-[3.2vw]",
            // Bottom-anchored at the start (86%), top-anchored at the end (14%).
            "top-[calc(14%+(1-var(--p))*72%)] -translate-y-[calc((1-var(--p))*100%)]"
          )}
        >
          {title}
        </h1>
      </section>
    </div>
  )
}

export { AlumniHero }
