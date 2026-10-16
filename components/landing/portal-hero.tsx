"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { PixelArrowDown } from "@/components/ui/pixel-arrow-down"
import { ButtonLink, ArrowLink } from "@/components/ui/button"
import { withYears, type HomePage } from "@/content/home/page-copy"
import { cn } from "@/lib/utils"
import { createDitherField } from "@/components/motion/dither-field"
import { HeroHeader } from "./hero-header"

/* Mirrors Tailwind's `md` breakpoint, which the markup below switches on. */
const MOBILE_QUERY = "(max-width: 767.98px)"

/*
 * The hero is one pinned scene, as fractions of its scroll
 * track: the circles play out, blue rises over them in the shared dither, the
 * statement decodes out of the blue and holds; then the same blue drains away
 * — taking the statement with it — to reveal the mission photograph and its
 * copy. The blue that arrived is the blue that leaves — there is no section
 * edge.
 */
const PHASE = {
  circles: 0.26,
  dither: [0.28, 0.42],
  text: [0.4, 0.53],
  actions: [0.52, 0.56],
  /** Where the arrow rests on the statement, before the drain. */
  hold: 0.62,
  drain: [0.68, 0.82],
  /**
   * The statement's exit, inside the drain: it fades while the draining
   * front (top first) crosses the middle of the screen where it sits, so the
   * dither reads as carrying it away. No exit of its own.
   */
  statementOut: [0.7, 0.75],
  mission: [0.79, 0.88],
  missionCta: [0.87, 0.92],
} as const

/**
 * Where the scroll arrow stops, as fractions of the scene's scroll track: each
 * scene's resting points, in order. Past the last, it leaves the scene.
 */
const SCROLL_STOPS = [PHASE.circles, PHASE.hold, PHASE.missionCta[1]]

/** Pixel glyphs for the decode — the same visual vocabulary as the dither. */
const GLYPHS = "▖▗▘▝▚▞▙▟"
/** How many characters are mid-decode at once. */
const SCRAMBLE_WINDOW = 14

const segment = (raw: number, [from, to]: readonly [number, number]) =>
  Math.max(0, Math.min(1, (raw - from) / (to - from)))
const ease = (t: number) => t * t * (3 - 2 * t)

const statementClass =
  "max-w-[1140px] font-heading font-light text-[clamp(26px,3.6vw,58px)] leading-[1.25] tracking-[-0.035em]"

type HeroCopy = HomePage["hero"]
type Run = { text: string; accent: boolean }

/** The positioning statement, in runs so the tenure can carry the accent. */
const statementOf = (copy: HeroCopy): Run[] =>
  [
    { text: copy.statementBefore, accent: false },
    { text: withYears(copy.statementHighlight), accent: true },
    { text: copy.statementAfter, accent: false },
  ].filter((run) => run.text)

function StatementActions({ copy }: { copy: HeroCopy }) {
  return (
    <>
      <ButtonLink href={copy.primaryCta.href} tone="light">
        {copy.primaryCta.label}
      </ButtonLink>
      <ArrowLink href={copy.secondaryCta.href}>
        {copy.secondaryCta.label}
      </ArrowLink>
    </>
  )
}

/**
 * The statement, one span per character so each can decode on its own. A
 * character mid-decode keeps its real glyph (transparent) for layout and shows
 * a pixel glyph over it, so lines never reflow as the text resolves.
 */
function ScrambleStatement({
  ref,
  runs,
}: {
  ref: React.RefObject<HTMLParagraphElement | null>
  runs: Run[]
}) {
  return (
    <p ref={ref} aria-hidden className={statementClass}>
      {runs.map((run) =>
        [...run.text].map((char, i) =>
          char === " " ? (
            " "
          ) : (
            <span
              key={`${run.text}-${i}`}
              data-ch
              data-state="hidden"
              className={cn(
                "relative data-[state=hidden]:text-transparent data-[state=scramble]:text-transparent",
                "after:pointer-events-none after:absolute after:inset-0 after:text-signal data-[state=scramble]:after:content-[attr(data-glyph)]",
                run.accent && "text-accent-ink"
              )}
            >
              {char}
            </span>
          )
        )
      )}
    </p>
  )
}

type Circle = { x: number; y: number; d: number }

/**
 * Where the two circles start, in px for a viewport, as centres and
 * diameters: the wordmark's two dots at the scale of the screen. Equal
 * circles side by side, edge to edge, starting under the headline and running
 * off the bottom. `upper` is the blue circle that grows into Progress for
 * Society (toward the centre); `lower` is the photograph, which keeps clear
 * of it as it grows.
 */
function circlesOf(
  w: number,
  h: number,
  mobile: boolean,
  /** The bottom of the headline, in scene px. */
  headlineBottom: number | null
): { upper: Circle; lower: Circle } {
  const gap = mobile ? 8 : 16
  const d = (w - gap) / 2
  const under = (headlineBottom ?? h * 0.3) + gap * 2
  const cy = Math.max(h * 0.62, under + d / 2)
  return {
    lower: { x: d / 2, y: cy, d },
    upper: { x: w - d / 2, y: cy, d },
  }
}

// Illustrative story using existing photography, not a customer case study.
export function PortalHero({ copy }: { copy: HeroCopy }) {
  const statement = statementOf(copy)
  const track = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)
  const statementRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const missionCopyRef = useRef<HTMLDivElement>(null)
  const missionCtaRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    const element = track.current
    if (!element) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const canvas = canvasRef.current
    const dither = canvas ? createDitherField(canvas) : null
    const chars = [
      ...(statementRef.current?.querySelectorAll<HTMLElement>("[data-ch]") ??
        []),
    ]
    const decode = (q: number) => {
      const front = q * (chars.length + SCRAMBLE_WINDOW)
      chars.forEach((char, i) => {
        const state =
          i < front - SCRAMBLE_WINDOW
            ? "done"
            : i < front
              ? "scramble"
              : "hidden"
        if (char.dataset.state !== state) char.dataset.state = state
        if (state === "scramble")
          char.dataset.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      })
    }
    let frame = 0
    const update = () => {
      frame = 0
      const distance = element.offsetHeight - window.innerHeight
      const raw = Math.max(
        0,
        Math.min(
          1,
          -element.getBoundingClientRect().top / Math.max(1, distance)
        )
      )
      const t = Math.min(1, raw / PHASE.circles)
      const p = media.matches ? 0 : t * t * (3 - 2 * t)
      const reduce = media.matches
      const drain = ease(segment(raw, PHASE.drain))
      const d = reduce
        ? 0
        : raw < PHASE.drain[0]
          ? ease(segment(raw, PHASE.dither))
          : 1 - drain
      if (dither) {
        dither.resize()
        dither.draw(d)
      } else if (fallbackRef.current) {
        fallbackRef.current.style.opacity = String(d)
      }
      // Decodes in and holds; the drain carries it out (see PHASE).
      const out = reduce ? 0 : ease(segment(raw, PHASE.statementOut))
      decode(reduce ? 1 : segment(raw, PHASE.text))
      if (statementRef.current)
        statementRef.current.style.opacity = String(1 - out)
      const actions = actionsRef.current
      if (actions) {
        const a = reduce ? 1 : ease(segment(raw, PHASE.actions)) * (1 - out)
        actions.style.opacity = String(a)
        actions.style.transform = `translateY(${(1 - a) * 16}px)`
        actions.inert = a < 0.5
      }
      // The mission layer waits under the blue until the blue is whole.
      const mission = missionRef.current
      if (mission && !reduce)
        mission.style.visibility = raw >= PHASE.dither[1] ? "visible" : "hidden"
      const reveal = (node: HTMLElement | null, value: number) => {
        if (!node) return
        node.style.opacity = String(value)
        node.style.transform = `translateY(${(1 - value) * 24}px)`
        node.inert = value < 0.5
      }
      reveal(
        missionCopyRef.current,
        reduce ? 1 : ease(segment(raw, PHASE.mission))
      )
      reveal(
        missionCtaRef.current,
        reduce ? 1 : ease(segment(raw, PHASE.missionCta))
      )
      const width = element.clientWidth
      const height = window.innerHeight
      const mobile = window.matchMedia(MOBILE_QUERY).matches
      const headline = headlineRef.current
      const band = headline?.offsetParent as HTMLElement | null
      const headlineBottom =
        headline && band
          ? band.offsetTop + headline.offsetTop + headline.offsetHeight
          : null
      const { upper, lower } = circlesOf(width, height, mobile, headlineBottom)
      element.style.setProperty("--upper-x", `${upper.x}px`)
      element.style.setProperty("--upper-y", `${upper.y}px`)
      element.style.setProperty("--diameter", `${upper.d}px`)
      element.style.setProperty("--lower-diameter", `${lower.d}px`)
      const upperRadius = upper.d / 2
      const lowerRadius = lower.d / 2
      const scale = 1 - p * 0.72
      const growingRadius =
        upperRadius + (Math.max(width, height) * 0.75 - upperRadius) * p
      // The blue circle's centre travels to the middle of the screen.
      const ux = upper.x + (width / 2 - upper.x) * p
      const uy = upper.y + (height / 2 - upper.y) * p
      // Push along the line joining the initial centres. Centre distance
      // always equals both rendered radii plus a gap, even on reverse scroll.
      const dx = lower.x - upper.x
      const dy = lower.y - upper.y
      const length = Math.max(1, Math.hypot(dx, dy))
      const rest = length - upperRadius - lowerRadius
      // Starts where it was placed and closes to a fixed gap as it plays.
      const gap = mobile ? 12 : 24
      const separation =
        growingRadius + lowerRadius * scale + Math.max(gap, rest * (1 - p))
      const x = ux + (dx / length) * separation
      const y = uy + (dy / length) * separation
      element.style.setProperty("--lower-x", `${x}px`)
      element.style.setProperty("--lower-y", `${y}px`)
      element.style.setProperty("--lower-visible", "visible")
      element.style.setProperty("--p", String(p))
      element.style.setProperty("--exit", String(Math.max(0, 1 - p * 3)))
      element.style.setProperty(
        "--arrival",
        String(Math.max(0, (p - 0.55) / 0.45))
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    media.addEventListener("change", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      media.removeEventListener("change", schedule)
      dither?.dispose()
    }
  }, [])
  return (
    <div className="bg-paper text-ink">
      <HeroHeader />
      <div
        ref={track}
        className={cn(
          "h-[560vh]",
          // Circle sizes are written by the component (circlesOf); these
          // match them for the first paint.
          "[--arrival:0] [--exit:1] [--p:0] [--row:48%] [--split:60%] motion-reduce:h-auto md:[--row:52%] md:[--split:70%]",
          "[--diameter:calc((100vw-8px)/2)] [--lower-diameter:calc((100vw-8px)/2)] md:[--diameter:calc((100vw-16px)/2)] md:[--lower-diameter:calc((100vw-16px)/2)]"
        )}
      >
        <section
          aria-labelledby="story-title"
          className={cn(
            "sticky top-0 isolate h-screen overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-screen",
            "[--hero-type-size:clamp(20px,5.3vw,38px)] md:[--hero-type-size:clamp(28px,min(5.7vw,11vh),100px)]"
          )}
        >
          <div
            className={cn(
              "softcom-portal-exit-up absolute top-0 left-0 flex",
              "motion-reduce:relative motion-reduce:m-0 motion-reduce:h-auto motion-reduce:min-h-[40vh] motion-reduce:w-full motion-reduce:transform-none motion-reduce:px-[5vw] motion-reduce:pt-20 motion-reduce:pb-10 motion-reduce:opacity-100 motion-reduce:md:mt-0 motion-reduce:md:px-[5vw] motion-reduce:md:pt-20 motion-reduce:md:pb-10",
              "h-[45%] w-[62%] items-start px-3.5 pt-24 pb-5 md:px-[3.2vw] md:pb-8"
            )}
          >
            <h1
              id="story-title"
              ref={headlineRef}
              className={cn(
                "font-heading font-normal tracking-[-0.055em]",
                // Size before leading: tailwind-merge drops a leading-* that a later text-* follows.
                "text-(length:--hero-type-size)",
                "leading-[1.04]"
              )}
            >
              {copy.headlineFirstLine}
              <br />
              {copy.headlineSecondLine}
            </h1>
          </div>
          {/* Always dark: white type over a shaded photograph in either theme. */}
          <section
            aria-labelledby="progress-title"
            className={cn(
              "dark @container absolute top-0 z-4 flex items-center justify-center overflow-hidden text-ink",
              "motion-reduce:relative motion-reduce:inset-auto motion-reduce:h-[60vh] motion-reduce:w-full motion-reduce:[clip-path:none]",
              "softcom-portal-circle inset-0 size-full bg-accent"
            )}
          >
            <Image
              src={copy.progressImage}
              alt={copy.progressImageAlt}
              fill
              priority
              sizes="100vw"
              className={cn(
                "object-cover object-[center_48%]",
                "softcom-portal-photo-in motion-reduce:opacity-100"
              )}
            />
            <div className="softcom-portal-shade absolute inset-0 bg-[color-mix(in_oklab,var(--color-accent-night),black_60%)] motion-reduce:opacity-65" />
            <h2
              id="progress-title"
              className={cn(
                "softcom-portal-arrival relative z-1 p-3.5 text-center font-heading font-normal motion-reduce:transform-none motion-reduce:opacity-100 md:p-6",
                "text-(length:--hero-type-size) leading-[1.04] tracking-[-0.055em]"
              )}
            >
              {copy.progressFirstLine}
              <br />
              {copy.progressSecondLine}
            </h2>
          </section>
          <figure
            className={cn(
              "absolute z-3 overflow-hidden motion-reduce:hidden",
              "softcom-portal-orbit rounded-full"
            )}
          >
            <Image
              src={copy.portalImage}
              alt={copy.portalImageAlt}
              fill
              priority
              sizes="(max-width: 767px) 60vw, 70vw"
              className="object-cover object-[center_48%]"
            />
            {/* A layer over the photo rather than a background behind it, so
                no cyan fringe shows at the circle's antialiased edge. */}
            <div className="softcom-portal-tint-in absolute inset-0 bg-signal" />
          </figure>
          <button
            className="group absolute bottom-22 left-1/2 z-8 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 rounded-full px-2 py-1 text-accent-ink transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink active:scale-[0.97] motion-reduce:hidden md:bottom-[max(24px,4vh)]"
            aria-label="Scroll to the next section"
            onClick={() => {
              const element = track.current
              if (!element) return
              const reduce = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
              ).matches
              const top = window.scrollY + element.getBoundingClientRect().top
              const range = element.offsetHeight - window.innerHeight
              const progress = (window.scrollY - top) / range
              /*
               * Section by section: each press goes to the next resting
               * point of the pinned scene, and past the last one to the
               * section below. It used to stop after the first.
               */
              const next = SCROLL_STOPS.find((stop) => stop > progress + 0.01)
              window.scrollTo({
                top:
                  next === undefined || reduce
                    ? top + element.offsetHeight
                    : top + range * next,
                behavior: reduce ? "instant" : "smooth",
              })
            }}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
              {copy.scrollLabel}
            </span>
            <span className="softcom-nudge group-hover:[animation-play-state:paused]">
              <PixelArrowDown
                cascade
                className="softcom-pixel-cascade size-12"
              />
            </span>
          </button>
          <>
            {/*
             * Mission, inside the scene: under the canvas, hidden until the
             * blue is whole, then uncovered as the blue drains (top first,
             * the shared field run backwards). Reduced motion: in flow.
             */}
            <div
              ref={missionRef}
              aria-label="Our mission"
              role="group"
              className="dark invisible absolute inset-0 z-5 flex flex-col items-center justify-center gap-10 px-6 text-center text-ink motion-reduce:visible motion-reduce:relative motion-reduce:min-h-[90vh] motion-reduce:py-24"
            >
              <Image
                src={copy.missionImage}
                alt={copy.missionImageAlt}
                fill
                sizes="100vw"
                className="-z-10 object-cover object-bottom"
              />
              <div aria-hidden className="absolute inset-0 -z-10 bg-black/64" />
              <div
                ref={missionCopyRef}
                className="flex flex-col items-center gap-10 opacity-0 motion-reduce:opacity-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- local SVG dot */}
                <img
                  src="/brand/accent-dot.svg"
                  alt=""
                  width={26}
                  height={26}
                  className="size-[26px]"
                />
                <h2
                  className={cn(
                    "text-headline",
                    "max-w-[760px] leading-[1.1] text-ink"
                  )}
                >
                  {/* Trimmed from the deck's "We believe stronger organisations
                        are the foundation of a more prosperous society." */}
                  {copy.missionHeading}
                </h2>
                <p
                  className={cn("text-lede", "max-w-[576px] text-neutral-200")}
                >
                  {copy.missionText}
                </p>
              </div>
              <div
                ref={missionCtaRef}
                className="opacity-0 motion-reduce:opacity-100"
              >
                <ButtonLink href={copy.missionCta.href} tone="light">
                  {copy.missionCta.label}
                </ButtonLink>
              </div>
            </div>
            {/* Where WebGL is unavailable, the dither falls back to a fade. */}
            <div
              ref={fallbackRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-6 bg-accent opacity-0 motion-reduce:hidden"
            />
            <canvas
              ref={canvasRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-6 size-full motion-reduce:hidden"
            />
            {/* The statement lives inside the scene: it is the dither's end
                  state, so there is no section edge to cross. */}
            <div
              aria-label="About Softcom"
              role="group"
              className="dark pointer-events-none absolute inset-0 z-7 flex flex-col items-start justify-center gap-10 px-6 pt-24 pb-12 text-ink motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:min-h-[90vh] motion-reduce:bg-accent motion-reduce:py-16 md:px-[7vw]"
            >
              <p className="sr-only">
                {statement.map((run) => run.text).join("")}
              </p>
              <ScrambleStatement ref={statementRef} runs={statement} />
              <div
                ref={actionsRef}
                className="pointer-events-auto flex flex-wrap items-center gap-2 opacity-0 motion-reduce:opacity-100"
              >
                <StatementActions copy={copy} />
              </div>
            </div>
          </>
        </section>
      </div>
    </div>
  )
}
