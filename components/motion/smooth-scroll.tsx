"use client"

import * as React from "react"
import Lenis from "lenis"

import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/motion"

/*
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the
 * scroll position never disagree. Off under reduced motion and on touch
 * devices, where native scrolling is better.
 */
export function SmoothScroll() {
  React.useEffect(() => {
    if (prefersReducedMotion()) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    const lenis = new Lenis({ lerp: 0.12, anchors: true })
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return null
}
