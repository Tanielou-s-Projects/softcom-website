"use client"

import * as React from "react"

import {
  DESKTOP,
  DURATION,
  EASE,
  gsap,
  MOBILE,
  REDUCE,
  REVEAL_START,
  STAGGER,
  useGSAP,
} from "@/lib/motion"

/*
 * The section reveal, in three forms (Daylight's, see
 * docs/research/references/daylight-motion-spec.md):
 *
 * - default: the block fades and rises once as it scrolls into view; with
 *   `stagger`, its direct children arrive one after another.
 * - `stagger="cards"` (§2.15): the children rise from below and scale up,
 *   scrubbed to the scroll so they settle as the grid comes up the screen,
 *   cascading left to right. On phones each card has its own trigger.
 * - `stagger="rows"` (§2.16): ruled rows slide in from the left as their
 *   hairlines draw across.
 *
 * `immediate` plays on mount instead — for hero content that is on screen
 * from the start (it may sit below the trigger line and would never fire).
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
  stagger?: boolean | "cards" | "rows"
  y?: number
  delay?: number
  immediate?: boolean
}) {
  const ref = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const items = Array.from(el.children) as HTMLElement[]
      const mm = gsap.matchMedia()

      mm.add({ desktop: DESKTOP, mobile: MOBILE, reduce: REDUCE }, (ctx) => {
        const { desktop, reduce } = ctx.conditions as Record<string, boolean>
        if (reduce) return

        if (stagger === "cards") {
          const from = {
            autoAlpha: 0,
            y: 48,
            scale: 0.94,
            transformOrigin: "50% 100%",
          }
          const to = { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out" }
          if (desktop) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  end: "top 30%",
                  scrub: 0.8,
                },
              })
              .fromTo(items, from, { ...to, stagger: 0.14 })
          } else {
            items.forEach((item) =>
              gsap.fromTo(item, from, {
                ...to,
                scrollTrigger: {
                  trigger: item,
                  start: "top 92%",
                  end: "top 55%",
                  scrub: 0.8,
                },
              })
            )
          }
          return
        }

        if (stagger === "rows") {
          // Each row's own top rule draws across while the row slides in.
          gsap
            .timeline({
              scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
            })
            .fromTo(
              items,
              { "--rule": 0 },
              {
                "--rule": 1,
                duration: 0.9,
                ease: "expo.out",
                stagger: STAGGER.item,
              },
              0
            )
            .fromTo(
              items,
              { autoAlpha: 0, x: -10 },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.45,
                ease: "power3.out",
                stagger: STAGGER.item,
              },
              0.1
            )
          return
        }

        gsap.from(stagger ? items : el, {
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
      })
    },
    { scope: ref }
  )

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      data-reveal={stagger === "rows" ? "rows" : undefined}
    >
      {children}
    </Tag>
  )
}
