"use client"

import * as React from "react"

import {
  createDitherField,
  type DitherField,
} from "@/components/motion/dither-field"
import { LineReveal } from "@/components/motion/line-reveal"
import { ButtonLink } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { Navigation } from "@/content/site/chrome-copy"
import {
  DESKTOP,
  gsap,
  MOBILE,
  REDUCE,
  ScrollTrigger,
  useGSAP,
} from "@/lib/motion"

type Cta = Navigation["closingCtas"]["home"]

/*
 * Window keyframes [top, right, bottom, left] in % of the image half
 * (Daylight's diptych, docs/research/references/daylight-motion-spec.md
 * §2.13): top right, wide in the middle, bottom right.
 */
const KEYS = {
  desktop: [
    [7.5, 9.57, 65.8, 42.67],
    [31.6, 29.15, 39.3, 15.36],
    [52.5, 16.33, 10.7, 46.9],
  ],
  mobile: [
    [8.42, 10.6, 72.2, 41.3],
    [37.68, 29.6, 40.42, 17.6],
    [54.52, 24.26, 9.86, 46.4],
  ],
}
/** How far the window leans toward the cursor, in px each way. */
const LEAN = 25

const vars = ([t, r, b, l]: number[]) => ({
  "--wt": `${t}%`,
  "--wr": `${r}%`,
  "--wb": `${b}%`,
  "--wl": `${l}%`,
})

/*
 * A page's last word, as a diptych: the question and the door on brand blue,
 * beside an image crossed by a window of the site's weave. As the panel
 * scrolls through, the window travels between three positions, its hairlines
 * running edge to edge along its sides; on desktop it also leans toward the
 * cursor. The window is CSS variables (insets plus a pointer offset), so the
 * clip and the lines can never disagree.
 */
export function ClosingCta({ copy }: { copy: Cta }) {
  const root = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      const q = gsap.utils.selector(section)
      const media = q("[data-diptych-media]")[0] as HTMLElement
      const canvas = q("canvas")[0] as HTMLCanvasElement

      const field: DitherField | null = createDitherField(canvas)
      const draw = () => field?.draw(0.55)
      if (field) {
        q("[data-diptych-window]")[0].style.background = "var(--color-paper)"
        draw()
      }
      const resize = new ResizeObserver(() => {
        field?.resize()
        draw()
      })
      resize.observe(canvas)

      const mm = gsap.matchMedia()
      mm.add({ desktop: DESKTOP, mobile: MOBILE, reduce: REDUCE }, (ctx) => {
        const { desktop, reduce } = ctx.conditions as Record<string, boolean>
        const keys = desktop ? KEYS.desktop : KEYS.mobile
        gsap.set(media, vars(keys[0]))
        if (reduce) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 25%",
            scrub: 0.5,
          },
        })
        keys
          .slice(1)
          .forEach((k, i) =>
            tl.to(media, { ...vars(k), duration: 1, ease: "sine.inOut" }, i)
          )

        if (!desktop) return
        // Lean toward the pointer, eased, only while the panel is on screen.
        const lean = { x: 0, y: 0 }
        const target = { x: 0, y: 0 }
        const onMove = (e: PointerEvent) => {
          const r = media.getBoundingClientRect()
          target.x = ((e.clientX - r.left) / r.width - 0.5) * LEAN * 2
          target.y = ((e.clientY - r.top) / r.height - 0.5) * LEAN * 2
        }
        const onLeave = () => {
          target.x = 0
          target.y = 0
        }
        const tick = () => {
          lean.x += (target.x - lean.x) * 0.1
          lean.y += (target.y - lean.y) * 0.1
          media.style.setProperty("--mx", `${lean.x.toFixed(2)}px`)
          media.style.setProperty("--my", `${lean.y.toFixed(2)}px`)
        }
        const watch = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: ({ isActive }) =>
            isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick),
        })
        media.addEventListener("pointermove", onMove)
        media.addEventListener("pointerleave", onLeave)
        return () => {
          watch.kill()
          gsap.ticker.remove(tick)
          media.removeEventListener("pointermove", onMove)
          media.removeEventListener("pointerleave", onLeave)
        }
      })

      return () => {
        resize.disconnect()
        field?.dispose()
      }
    },
    { scope: root }
  )

  return (
    <section ref={root} className="shell mt-32 md:mt-48">
      <div className="grid overflow-hidden rounded-xl lg:min-h-[min(100svh,52rem)] lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-16 bg-accent p-6 text-on-accent md:p-10">
          <p className="label text-signal">{copy.lead}</p>
          <div>
            <LineReveal
              as="h2"
              className="max-w-xl text-display font-light text-balance"
            >
              {copy.heading}
            </LineReveal>
            <ButtonLink href={copy.buttonHref} tone="light" className="mt-10">
              {copy.buttonLabel}
            </ButtonLink>
          </div>
        </div>

        <div
          data-diptych-media
          className="relative isolate h-[30rem] overflow-hidden [--mx:0px] [--my:0px] [--wb:65.8%] [--wl:42.67%] [--wr:9.57%] [--wt:7.5%] lg:h-auto"
        >
          <ImagePlaceholder
            reveal={false}
            className="absolute inset-0 ring-0"
          />
          <div
            data-diptych-window
            className="absolute inset-0 z-[2] bg-accent [clip-path:inset(calc(var(--wt)_+_var(--my))_calc(var(--wr)_-_var(--mx))_calc(var(--wb)_-_var(--my))_calc(var(--wl)_+_var(--mx)))]"
          >
            <canvas aria-hidden="true" className="absolute inset-0 size-full" />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1]"
          >
            <div className="absolute inset-x-0 top-[calc(var(--wt)+var(--my))] h-px -translate-y-px bg-line-strong" />
            <div className="absolute inset-x-0 bottom-[calc(var(--wb)-var(--my))] h-px translate-y-px bg-line-strong" />
            <div className="absolute inset-y-0 left-[calc(var(--wl)+var(--mx))] w-px -translate-x-px bg-line-strong" />
            <div className="absolute inset-y-0 right-[calc(var(--wr)-var(--mx))] w-px translate-x-px bg-line-strong" />
          </div>
        </div>
      </div>
    </section>
  )
}
