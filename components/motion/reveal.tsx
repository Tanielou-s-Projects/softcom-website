"use client"

import * as React from "react"

import {
  DURATION,
  EASE,
  gsap,
  prefersReducedMotion,
  REVEAL_START,
  STAGGER,
  useGSAP,
} from "@/lib/motion"

/*
 * The one section reveal: content fades and rises into place the first time
 * it scrolls into view. With `stagger`, the direct children arrive one after
 * another (grids, lists); without, the block arrives as one. `immediate`
 * plays on mount instead — for hero content that is on screen from the start
 * (it may sit below the scroll trigger line and would otherwise never fire).
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  stagger = false,
  y = 24,
  delay = 0,
  immediate = false,
}: {
  as?: "div" | "section" | "ul" | "ol" | "dl"
  className?: string
  children: React.ReactNode
  stagger?: boolean
  y?: number
  delay?: number
  immediate?: boolean
}) {
  const ref = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const targets = stagger ? Array.from(el.children) : el
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        duration: DURATION.reveal,
        ease: EASE.out,
        stagger: stagger ? STAGGER.item : 0,
        delay,
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start: REVEAL_START, once: true },
      })
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      {children}
    </Tag>
  )
}
