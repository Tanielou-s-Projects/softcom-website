"use client"

import * as React from "react"

import {
  createDitherField,
  type DitherField,
} from "@/components/motion/dither-field"
import { prefersReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** Where the resolve starts and ends, as the block's top in viewport heights. */
const START = 1
const END = 0.35
/** The content fades in over the last stretch, once the blue can carry it. */
const CONTENT_FROM = 0.75

/*
 * A block whose ground is the site's dither (lib/dither.ts): as it scrolls
 * into view, brand blue rises through it in Bayer order with a cyan front and
 * code glyphs flickering at the edge, until it is solid blue. Scroll owns the
 * progress, so scrolling back up drains it again. Without WebGL, or under
 * reduced motion, the block is simply blue.
 */
export function DitherReveal({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  /*
   * The server can't know about WebGL or reduced motion, so both renders start
   * as the animated version and the effect falls back to plain blue after
   * mount — the markup always matches at hydration.
   */
  const [animated, setAnimated] = React.useState(true)

  React.useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const content = contentRef.current
    if (!root || !canvas || !content) return

    let field: DitherField | null = prefersReducedMotion()
      ? null
      : createDitherField(canvas)
    if (!field) {
      // Reduced motion or no WebGL: the solid-blue fallback takes over.
      setAnimated(false)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const top = root.getBoundingClientRect().top / window.innerHeight
      const progress = Math.max(0, Math.min(1, (START - top) / (START - END)))
      field?.draw(progress)
      const shown = Math.max(0, (progress - CONTENT_FROM) / (1 - CONTENT_FROM))
      content.style.opacity = String(shown)
      content.style.transform = `translateY(${(1 - shown) * 16}px)`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const resize = new ResizeObserver(() => {
      field?.resize()
      schedule()
    })
    resize.observe(canvas)
    window.addEventListener("scroll", schedule, { passive: true })
    update()

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      window.removeEventListener("scroll", schedule)
      field?.dispose()
      field = null
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative isolate overflow-hidden",
        !animated && "bg-accent",
        className
      )}
    >
      {animated && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full"
        />
      )}
      <div ref={contentRef} style={animated ? { opacity: 0 } : undefined}>
        {children}
      </div>
    </div>
  )
}
