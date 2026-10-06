"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useReducedMotion } from "motion/react"

import {
  createDitherField,
  type DitherField,
} from "@/components/motion/dither-field"

/** Coarser than the 6px base so the weave reads at speed; still on the grid. */
const SCALE = 4
const COVER_MS = 340
const HOLD_MS = 110
const UNCOVER_MS = 420
/** If a route never arrives (same page, failed fetch), stop waiting and uncover. */
const GIVE_UP_MS = 4000

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

/** An in-site link click the transition should own, or null. */
function internalHref(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return null
  const anchor = (event.target as Element | null)?.closest?.("a[href]")
  if (!(anchor instanceof HTMLAnchorElement)) return null
  if (anchor.target && anchor.target !== "_self") return null
  if (anchor.hasAttribute("download")) return null
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  // Same page (a hash or query change) is not a page change.
  if (url.pathname === window.location.pathname) return null
  if (url.pathname.startsWith("/studio")) return null
  return url.pathname + url.search + url.hash
}

/**
 * The page transition, in the site's dither language (`lib/dither.ts`).
 *
 * On an in-site link click the click is held: brand blue rises over the
 * *current* page in Bayer order with a cyan front, and only once it is fully
 * covered does the router navigate. When the new route renders, the blue
 * holds a beat and recedes to uncover it — so the old page never flashes and
 * every page change passes through the same blue the hero ends on.
 * Back/forward can't be held, so those play the cover after the fact.
 *
 * A fixed overlay rather than a wrapper around the page, so it can never put
 * a transform on the sticky header/CTA ancestors. The WebGL context lives only
 * while the overlay is up. Skipped under reduced motion and in the Studio.
 */
function PixelPageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = React.useState(false)
  const [mount, setMount] = React.useState(0)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const fallbackRef = React.useRef<HTMLDivElement>(null)
  const fieldRef = React.useRef<DitherField | null>(null)
  const frameRef = React.useRef(0)
  const progressRef = React.useRef(0)
  /**
   * Covered and waiting for the route we navigated to. A ref for handlers and
   * effects, mirrored in state for the render-time route check.
   */
  const awaitingRef = React.useRef(false)
  const [awaiting, setAwaiting] = React.useState(false)
  const giveUpRef = React.useRef(0)

  const draw = React.useCallback((progress: number) => {
    progressRef.current = progress
    if (!fieldRef.current && canvasRef.current) {
      fieldRef.current = createDitherField(canvasRef.current, { scale: SCALE })
    }
    if (fieldRef.current) fieldRef.current.draw(progress)
    else if (fallbackRef.current)
      fallbackRef.current.style.opacity = String(progress)
  }, [])

  const animate = React.useCallback(
    (to: number, ms: number, delay: number, done?: () => void) => {
      cancelAnimationFrame(frameRef.current)
      const from = progressRef.current
      const start = performance.now() + delay
      const tick = (now: number) => {
        const t = Math.max(0, Math.min(1, (now - start) / ms))
        draw(from + (to - from) * easeInOut(t))
        if (t < 1) frameRef.current = requestAnimationFrame(tick)
        else done?.()
      }
      frameRef.current = requestAnimationFrame(tick)
    },
    [draw]
  )

  const uncover = React.useCallback(() => {
    awaitingRef.current = false
    setAwaiting(false)
    window.clearTimeout(giveUpRef.current)
    animate(0, UNCOVER_MS, HOLD_MS, () => {
      fieldRef.current?.dispose()
      fieldRef.current = null
      setVisible(false)
    })
  }, [animate])

  // Hold in-site link clicks: cover the current page, then navigate.
  React.useEffect(() => {
    if (reduceMotion || pathname.startsWith("/studio")) return
    const onClick = (event: MouseEvent) => {
      const href = internalHref(event)
      if (!href) return
      event.preventDefault()
      if (awaitingRef.current) return
      awaitingRef.current = true
      setAwaiting(true)
      setMount((n) => n + 1)
      setVisible(true)
      // Wait a frame for the canvas to mount before drawing on it.
      requestAnimationFrame(() =>
        animate(1, COVER_MS, 0, () => {
          router.push(href)
          giveUpRef.current = window.setTimeout(uncover, GIVE_UP_MS)
        })
      )
    }
    // Capture, so this runs before Next's Link handler, which then sees the
    // click as handled and stands down.
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [reduceMotion, pathname, router, animate, uncover])

  // A route arrived. Ours: uncover. Back/forward: play the whole thing.
  const [lastPathname, setLastPathname] = React.useState(pathname)
  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    if (!awaiting && !reduceMotion && !pathname.startsWith("/studio")) {
      setMount((n) => n + 1)
      setVisible(true)
    }
  }
  React.useEffect(() => {
    if (!visible) return
    if (awaitingRef.current) {
      uncover()
    } else if (progressRef.current === 0) {
      animate(1, COVER_MS, 0, uncover)
    }
    // Runs once per route change; the click path drives itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPathname])

  React.useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current)
      window.clearTimeout(giveUpRef.current)
      fieldRef.current?.dispose()
    },
    []
  )

  if (!visible) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={fallbackRef}
        className="absolute inset-0 bg-brand-blue opacity-0"
      />
      {/* Keyed per run: a disposed context cannot be revived on the same canvas. */}
      <canvas
        key={mount}
        ref={canvasRef}
        className="absolute inset-0 size-full"
      />
    </div>
  )
}

export { PixelPageTransition }
