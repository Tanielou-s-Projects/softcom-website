"use client"

import * as React from "react"
import Lenis from "lenis"

import { smoothScroll } from "@/lib/smooth-scroll"

/*
 * Smooth, eased scrolling, as in the rebuild (Lenis). Off under reduced
 * motion and on touch devices, where native scrolling is better. It moves the
 * real scroll position, so every scroll-driven section works unchanged.
 */
function SmoothScroll() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    const lenis = new Lenis({ lerp: 0.12, anchors: true, autoRaf: true })
    smoothScroll.lenis = lenis
    return () => {
      lenis.destroy()
      smoothScroll.lenis = null
    }
  }, [])

  return null
}

export { SmoothScroll }
