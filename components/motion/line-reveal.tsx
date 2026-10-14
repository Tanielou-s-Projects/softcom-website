"use client"

import * as React from "react"

import {
  DURATION,
  EASE,
  gsap,
  prefersReducedMotion,
  REVEAL_START,
  SplitText,
  STAGGER,
  useGSAP,
} from "@/lib/motion"

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span"

/*
 * Text that rises into place line by line, each line inside its own mask
 * (SplitText with `mask: "lines"`), the first time it scrolls into view.
 * `autoSplit` re-splits on resize and once fonts load, so lines always match
 * the rendered wrap. `immediate` plays on mount instead of on scroll — for
 * heroes already in view.
 */
export function LineReveal({
  as: Tag = "div",
  id,
  className,
  children,
  delay = 0,
  immediate = false,
}: {
  as?: Tag
  id?: string
  className?: string
  children: React.ReactNode
  delay?: number
  immediate?: boolean
}) {
  const ref = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 100,
            duration: DURATION.line,
            ease: EASE.out,
            stagger: STAGGER.line,
            delay,
            scrollTrigger: immediate
              ? undefined
              : { trigger: el, start: REVEAL_START, once: true },
          })
        },
      })
      return () => split.revert()
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref as React.Ref<never>} id={id} className={className}>
      {children}
    </Tag>
  )
}
