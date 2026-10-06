"use client"

import { useEffect } from "react"

/** The two brand anchors, as RGB. */
const CYAN = [0, 255, 255] as const
const BLUE = [0, 75, 255] as const

/** One full cyan → blue → cyan breath. Slow enough to read as calm. */
const PERIOD_MS = 4000
/** ~12fps: smooth in a visible tab; browsers throttle hidden tabs to ~1s anyway. */
const FRAME_MS = 80

function circle(rgb: readonly number[]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="rgb(${rgb.join(",")})"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Breathes the favicon between brand cyan and brand blue.
 *
 * Browsers don't run animations inside an SVG favicon, so the icon is redrawn
 * from here: each frame rewrites the `href` of the `<link rel="icon">` Next
 * renders from `app/icon.svg`, which stays the static cyan fallback. Under
 * prefers-reduced-motion it never starts.
 */
function AnimatedFavicon() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const links = () =>
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"][type="image/svg+xml"]'
      )
    const original = [...links()].map((link) => link.href)
    const start = performance.now()

    const id = window.setInterval(() => {
      // 0 → 1 → 0 on a cosine, so it eases at both ends instead of bouncing.
      const t =
        (1 -
          Math.cos(((performance.now() - start) / PERIOD_MS) * 2 * Math.PI)) /
        2
      const rgb = CYAN.map((c, i) => Math.round(c + (BLUE[i] - c) * t))
      const href = circle(rgb)
      for (const link of links()) link.href = href
    }, FRAME_MS)

    return () => {
      window.clearInterval(id)
      links().forEach((link, i) => {
        if (original[i]) link.href = original[i]
      })
    }
  }, [])

  return null
}

export { AnimatedFavicon }
