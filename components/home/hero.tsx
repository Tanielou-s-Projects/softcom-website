"use client"

import * as React from "react"

import {
  createDitherField,
  type DitherField,
} from "@/components/motion/dither-field"
import { Wordmark } from "@/components/site/wordmark"
import { ButtonLink } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { withYears, type HomePage } from "@/content/home/page-copy"
import {
  DESKTOP,
  gsap,
  lockScroll,
  MOBILE,
  REDUCE,
  SplitText,
  useGSAP,
} from "@/lib/motion"

/*
 * Daylight's hero intro (docs/research/references/daylight-motion-spec.md
 * §2.1–2.3), in Softcom's dither.
 *
 * The stage is a full-bleed image under a window of brand blue. The window is
 * one set of CSS variables (--wt --wr --wb --wl, its insets in %): they clip
 * the blue, place four hairlines that run edge to edge along its sides (a cell
 * cut from a full-bleed grid) and pin two data chips to its corners. Inside
 * the window the blue is the site's weave, settled short of full so its cyan
 * front and data glyphs stay live.
 *
 * First visit of a session: the hero opens solid blue with the wordmark, the
 * blue clips down into the window as the image settles, then the headline
 * slides in and the chips rise. An inline script marks <html> as
 * `data-intro="pending"` before first paint so that opening state is in the
 * markup; later visits (and reduced motion) render the final layout directly.
 * On scroll the window keeps closing and accelerates away while the weave
 * drains and the image lags behind.
 */

const INTRO_KEY = "softcom:intro"
/** Window insets [top, right, bottom, left] in %: after the intro, after scrolling out. */
const WIN = { desktop: [30, 15, 30, 67.15], mobile: [22.29, 28.27, 53.83, 36] }
const OUT = { desktop: [35, 20, 35, 72], mobile: [26, 32, 57, 41] }
/** The weave's progress: full, settled in the window, drained on the way out. */
const WEAVE = { full: 1, settled: 0.62, out: 0.4 }

const vars = ([t, r, b, l]: number[]) => ({
  "--wt": `${t}%`,
  "--wr": `${r}%`,
  "--wb": `${b}%`,
  "--wl": `${l}%`,
})

const PENDING_SCRIPT = `try{if(!sessionStorage.getItem("${INTRO_KEY}")&&!matchMedia("${REDUCE}").matches)document.documentElement.dataset.intro="pending"}catch(e){}`

/* Classes that only apply while the intro is pending (before its first frame). */
const pending = {
  stage:
    "[html[data-intro=pending]_&]:[--wt:0%] [html[data-intro=pending]_&]:[--wr:0%] [html[data-intro=pending]_&]:[--wb:0%] [html[data-intro=pending]_&]:[--wl:0%]",
  hidden: "[html[data-intro=pending]_&]:opacity-0",
  shown: "opacity-0 [html[data-intro=pending]_&]:opacity-100",
  photo: "[html[data-intro=pending]_&]:scale-110",
}

export function Hero({
  copy,
  chips,
}: {
  copy: HomePage["hero"]
  /** Two figures pinned to the window's corners (from the numbers block). */
  chips: { value: string; label: string }[]
}) {
  const root = React.useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const stage = root.current
      if (!stage) return
      const q = gsap.utils.selector(stage)
      const html = document.documentElement
      const canvas = q("[data-hero-weave]")[0] as HTMLCanvasElement
      const win = q("[data-hero-window]")[0] as HTMLElement

      let field: DitherField | null = createDitherField(canvas)
      // With the weave drawing, the window's own blue gives way to paper.
      if (field) win.style.background = "var(--color-paper)"
      const weave = { p: WEAVE.settled }
      const draw = () => field?.draw(weave.p)
      const resize = new ResizeObserver(() => {
        field?.resize()
        draw()
      })
      resize.observe(canvas)

      const mm = gsap.matchMedia()
      // matchMedia only runs when a condition matches, so mobile is listed too.
      mm.add({ desktop: DESKTOP, mobile: MOBILE, reduce: REDUCE }, (ctx) => {
        const { desktop, reduce } = ctx.conditions as Record<string, boolean>
        const win0 = desktop ? WIN.desktop : WIN.mobile
        const win1 = desktop ? OUT.desktop : OUT.mobile
        const text = q("[data-hero-text]")[0]
        const chipEls = q("[data-hero-chip]")
        const photo = q("[data-hero-photo]")[0]
        const logo = q("[data-hero-logo]")[0]

        if (reduce) {
          weave.p = 0.7
          draw()
          return
        }

        const scrollOut = () =>
          gsap
            .timeline({
              defaults: {
                duration: 1,
                ease: desktop ? "power2.in" : "power3.out",
              },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(stage, vars(win0), vars(win1), 0)
            .fromTo(
              weave,
              { p: WEAVE.settled },
              { p: WEAVE.out, onUpdate: draw },
              0
            )
            .fromTo(
              chipEls,
              { xPercent: 0, autoAlpha: 1 },
              { xPercent: 40, yPercent: -20, autoAlpha: 0 },
              0
            )
            .fromTo(photo, { y: 0 }, { y: 200, ease: "none" }, 0)

        if (html.dataset.intro !== "pending") {
          weave.p = WEAVE.settled
          draw()
          scrollOut()
          return
        }

        try {
          sessionStorage.setItem(INTRO_KEY, "1")
        } catch {}
        const split = SplitText.create(q("h1"), { type: "lines" })
        weave.p = WEAVE.full
        draw()

        const intro = gsap.timeline({
          onStart: () => {
            lockScroll(true)
            gsap.delayedCall(desktop ? 2 : 1, () => lockScroll(false))
          },
          onComplete: () => {
            lockScroll(false)
            gsap.set(stage, { clearProps: "--wt,--wr,--wb,--wl" })
            scrollOut()
          },
        })
        intro
          .set(stage, vars([0, 0, 0, 0]), 0)
          .set(photo, { scale: 1.1 }, 0)
          .set(text, desktop ? { xPercent: -100 } : { yPercent: 120 }, 0)
          .set(text, { autoAlpha: 1 }, 0)
          .set(split.lines, desktop ? { x: -50 } : { y: 60 }, 0)
          .set(chipEls, { yPercent: 100, autoAlpha: 1 }, 0)
          .fromTo(
            logo,
            { autoAlpha: 0, scale: 0.92 },
            { autoAlpha: 1, scale: 1, duration: 0.8, ease: "expo.out" },
            0.1
          )
          // The window closes in; the weave settles; the image de-scales.
          .to(stage, { ...vars(win0), duration: 2, ease: "expo.inOut" }, 1)
          .to(
            weave,
            {
              p: WEAVE.settled,
              duration: 2,
              ease: "expo.inOut",
              onUpdate: draw,
            },
            1
          )
          .to(photo, { scale: 1, duration: 2, ease: "expo.inOut" }, 1)
          .to(
            logo,
            {
              scale: 0.4,
              x: () => (win0[3] / 100) * stage.offsetWidth * 0.33,
              autoAlpha: 0,
              duration: 1.9,
              ease: "expo.inOut",
            },
            1
          )
          // The header drops back in as the copy arrives.
          .call(() => delete html.dataset.intro, [], 2)
          .to(
            text,
            {
              xPercent: 0,
              yPercent: 0,
              duration: 1,
              ease: desktop ? "power4.out" : "expo.out",
            },
            2
          )
          .to(
            split.lines,
            {
              x: 0,
              y: 0,
              duration: 1,
              stagger: desktop ? 0.1 : 0.07,
              ease: desktop ? "power4.out" : "expo.out",
            },
            2
          )
          .to(
            chipEls,
            { yPercent: 0, duration: 0.5, stagger: 0.04, ease: "expo.out" },
            2.3
          )

        return () => {
          lockScroll(false)
          delete html.dataset.intro
          split.revert()
        }
      })

      return () => {
        resize.disconnect()
        field?.dispose()
        field = null
      }
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className={`relative isolate h-svh min-h-[40rem] overflow-hidden [--wb:53.83%] [--wl:36%] [--wr:28.27%] [--wt:22.29%] lg:[--wb:30%] lg:[--wl:67.15%] lg:[--wr:15%] lg:[--wt:30%] ${pending.stage}`}
    >
      <script dangerouslySetInnerHTML={{ __html: PENDING_SCRIPT }} />

      <div
        data-hero-photo
        className={`absolute inset-0 -z-10 will-change-transform ${pending.photo}`}
      >
        <ImagePlaceholder
          reveal={false}
          label={copy.portalImageAlt}
          className="ring-0 max-lg:[&>svg]:hidden"
        />
      </div>

      {/* The window of blue: clipped by the shared insets. */}
      <div
        data-hero-window
        className="absolute inset-0 z-[2] bg-accent [clip-path:inset(var(--wt)_var(--wr)_var(--wb)_var(--wl))]"
      >
        <canvas
          data-hero-weave
          aria-hidden="true"
          className="absolute inset-0 size-full"
        />
        <div
          data-hero-logo
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center text-white ${pending.shown}`}
        >
          <Wordmark className="w-[min(40vw,22rem)]" />
        </div>
      </div>

      {/* Four hairlines along the window's sides, edge to edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
      >
        <div className="absolute inset-x-0 top-[var(--wt)] h-px -translate-y-px bg-line-strong" />
        <div className="absolute inset-x-0 bottom-[var(--wb)] h-px translate-y-px bg-line-strong" />
        <div className="absolute inset-y-0 left-[var(--wl)] w-px -translate-x-px bg-line-strong" />
        <div className="absolute inset-y-0 right-[var(--wr)] w-px translate-x-px bg-line-strong" />
      </div>

      {/* Data chips pinned above the window's top-left and below its bottom-right. */}
      {chips[0] && (
        <div className="absolute top-[var(--wt)] left-[var(--wl)] z-[2] -translate-y-full pb-3 pl-3">
          <p className="overflow-hidden">
            <span
              data-hero-chip
              className={`label inline-block text-ink-soft ${pending.hidden}`}
            >
              {chips[0].label}{" "}
              <span className="text-ink">{withYears(chips[0].value)}</span>
            </span>
          </p>
        </div>
      )}
      {chips[1] && (
        <div className="absolute right-[var(--wr)] bottom-[var(--wb)] z-[2] translate-y-full pt-3 pr-3 text-right">
          <p className="overflow-hidden">
            <span
              data-hero-chip
              className={`label inline-block text-ink-soft ${pending.hidden}`}
            >
              {chips[1].label}{" "}
              <span className="text-ink">{withYears(chips[1].value)}</span>
            </span>
          </p>
        </div>
      )}

      <div className="shell relative z-[3] flex h-full flex-col justify-end pb-10 md:pb-14 lg:justify-center lg:pb-0">
        <div data-hero-text className={`lg:max-w-[58%] ${pending.hidden}`}>
          <h1 className="text-display font-light">
            <span className="block">
              {copy.headlineFirstLine} {copy.headlineSecondLine}
            </span>
            <span className="block text-ink-faint">
              {copy.progressFirstLine} {copy.progressSecondLine}
            </span>
          </h1>
          <div className="mt-10 flex flex-wrap gap-2 md:mt-14">
            <ButtonLink href={copy.primaryCta.href} tone="accent">
              {copy.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={copy.secondaryCta.href} tone="outline">
              {copy.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
