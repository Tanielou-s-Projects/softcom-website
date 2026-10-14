"use client"

import * as React from "react"

import { gsap, REDUCE, SplitText, useGSAP } from "@/lib/motion"
import { cn } from "@/lib/utils"

/*
 * A statement whose lines rise with the scroll itself (Daylight's
 * FullscreenBannerMotion, §2.6): the label first, then each line of the text
 * from inside its mask, scrubbed as the block's top travels from 85% to 30%
 * of the viewport. Drag back and they sink again.
 */
export function ScrubLines({
  label,
  className,
  labelClassName,
  textClassName,
  children,
}: {
  label?: React.ReactNode
  className?: string
  labelClassName?: string
  textClassName?: string
  children: React.ReactNode
}) {
  const root = React.useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(`not all and ${REDUCE}`, () => {
        const split = (el: Element | undefined) =>
          el
            ? SplitText.create(el, {
                type: "words, lines",
                mask: "lines",
                linesClass: "split-line",
              })
            : null
        const head = split(q("[data-scrub-label]")[0])
        const text = split(q("[data-scrub-text]")[0])
        const lines = text?.lines.length ?? 0
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        // Every line starts below its mask (set up front, as Daylight does:
        // a staggered `from` in a scrubbed timeline only primes its first
        // target), then rises to rest.
        gsap.set([...(head?.lines ?? []), ...(text?.lines ?? [])], {
          yPercent: 100,
        })
        if (head)
          tl.to(
            head.lines,
            { yPercent: 0, duration: 0.25, stagger: 0.1, ease: "power3.out" },
            0
          )
        if (text)
          tl.to(
            text.lines,
            {
              yPercent: 0,
              duration: 0.4,
              // Long statements tighten up so the last line lands in range.
              stagger: lines > 6 ? 0.06 : 0.15,
              ease: "power3.out",
            },
            0.05
          )
        return () => {
          head?.revert()
          text?.revert()
        }
      })
    },
    { scope: root }
  )

  return (
    <div ref={root} className={className}>
      {label && (
        <p data-scrub-label className={labelClassName}>
          {label}
        </p>
      )}
      <p data-scrub-text className={cn(textClassName)}>
        {children}
      </p>
    </div>
  )
}
