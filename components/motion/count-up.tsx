"use client"

import * as React from "react"

import { gsap, REDUCE, useGSAP } from "@/lib/motion"

/*
 * A figure that counts up from zero tied to the scroll (Daylight's Step 3
 * counter, §2.11). Only the leading number moves; any suffix ("M+", "+")
 * stays put. The server renders the final value, so it is right without JS.
 */
export function CountUp({
  value,
  start = "top 60%",
  end = "top 35%",
  trigger,
}: {
  value: string
  start?: string
  end?: string
  /** Defaults to the figure itself. */
  trigger?: React.RefObject<HTMLElement | null>
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !match) return
      const [, prefix, digits, suffix] = match
      const to = Number(digits.replace(/,/g, ""))
      const decimals = digits.split(".")[1]?.length ?? 0
      const format = (n: number) =>
        `${prefix}${n.toLocaleString("en", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`
      const mm = gsap.matchMedia()
      mm.add(`not all and ${REDUCE}`, () => {
        const state = { n: 0 }
        el.textContent = format(0)
        gsap.to(state, {
          n: to,
          ease: "power1.out",
          onUpdate: () => {
            el.textContent = format(state.n)
          },
          scrollTrigger: {
            trigger: trigger?.current ?? el,
            start,
            end,
            scrub: 1,
          },
        })
        return () => {
          el.textContent = value
        }
      })
    },
    { scope: ref, dependencies: [value] }
  )

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  )
}
