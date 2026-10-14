"use client"

import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

/*
 * The site's motion constants and plugin registration, in one place. Every
 * GSAP-driven component imports gsap from here so the plugins and the house
 * eases exist before its first tween.
 *
 * The eases follow the reference (Daylight, see
 * docs/research/references/daylight.md): a quick, slightly overshooting
 * out-curve for reveals and an expo in-out for anything that travels.
 */

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)

export const EASE = {
  /** Reveals: lines rising, cards arriving. */
  out: CustomEase.create("softcom.out", "0.16, 1.08, 0.38, 0.98"),
  /** Travel: clip windows, panels moving between positions. */
  inOut: "expo.inOut",
} as const

export const DURATION = {
  line: 0.66,
  reveal: 0.9,
  travel: 1.2,
} as const

export const STAGGER = {
  line: 0.15,
  item: 0.08,
} as const

/** Where in-view reveals fire: the element's top passing 85% of the viewport. */
export const REVEAL_START = "top 85%"

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
