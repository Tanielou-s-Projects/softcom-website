"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { PixelArrowDown } from "@/components/ui/pixel-arrow-down"
import { Button } from "@/components/ui/button"
import { YEARS_ACTIVE } from "@/components/landing/content"
import {
  ghostPill,
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { cn } from "@/lib/utils"
import { createDitherField } from "@/components/motion/dither-field"
import { HeroHeader } from "./hero-header"

/* Mirrors Tailwind's `md` breakpoint, which the markup below switches on. */
const MOBILE_QUERY = "(max-width: 767.98px)"

/*
 * The `dissolve` variant is one pinned scene, as fractions of its scroll
 * track: the circles play out, blue rises over them in the shared dither, the
 * statement decodes out of the blue, holds, and decodes back in; then the
 * same blue drains away to reveal the mission photograph and its copy. The
 * blue that arrived is the blue that leaves — there is no section edge.
 */
const PHASE = {
  circles: 0.26,
  dither: [0.28, 0.42],
  text: [0.4, 0.53],
  actions: [0.52, 0.56],
  out: [0.62, 0.68],
  drain: [0.68, 0.82],
  mission: [0.79, 0.88],
  missionCta: [0.87, 0.92],
} as const

/** Pixel glyphs for the decode — the same visual vocabulary as the dither. */
const GLYPHS = "▖▗▘▝▚▞▙▟"
/** How many characters are mid-decode at once. */
const SCRAMBLE_WINDOW = 14

const segment = (raw: number, [from, to]: readonly [number, number]) =>
  Math.max(0, Math.min(1, (raw - from) / (to - from)))
const ease = (t: number) => t * t * (3 - 2 * t)

const statementClass =
  "max-w-[1140px] font-heading text-[clamp(26px,3.6vw,58px)] leading-[1.25] tracking-[-0.035em]"

/** The positioning statement, in runs so the tenure can carry the accent. */
const STATEMENT = [
  {
    text: "Softcom is a technology and innovation company with ",
    accent: false,
  },
  { text: `${YEARS_ACTIVE} years`, accent: true },
  {
    text: " of experience building for public institutions, private organisations and development enablers. We help organisations think through what they want to achieve, then bring together the technology, people and processes to make it happen.",
    accent: false,
  },
]

function StatementActions() {
  return (
    <>
      <Button asChild size="lg" className={primaryPill}>
        <Link href="/solutions">Explore our solutions</Link>
      </Button>
      <Button asChild size="lg" variant="ghost" className={ghostPill}>
        <Link href="/contact">Start a conversation</Link>
      </Button>
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
}: {
  ref: React.RefObject<HTMLParagraphElement | null>
}) {
  return (
    <p ref={ref} aria-hidden className={statementClass}>
      {STATEMENT.map((run) =>
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
                "after:pointer-events-none after:absolute after:inset-0 after:text-brand-cyan data-[state=scramble]:after:content-[attr(data-glyph)]",
                run.accent && "text-brand-accent"
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

// Illustrative story using existing photography, not a customer case study.
export function PortalHero({
  variant,
}: {
  variant: "grid" | "circles" | "dissolve"
}) {
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
    const dissolving = variant === "dissolve"
    const canvas = canvasRef.current
    const dither = dissolving && canvas ? createDitherField(canvas) : null
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
      const t = Math.min(1, raw / (dissolving ? PHASE.circles : 0.88))
      const p = media.matches ? 0 : t * t * (3 - 2 * t)
      if (dissolving) {
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
        // In, hold, then back out the way it came — glyph by glyph.
        const out = segment(raw, PHASE.out)
        decode(reduce ? 1 : segment(raw, PHASE.text) * (1 - out))
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
          mission.style.visibility =
            raw >= PHASE.dither[1] ? "visible" : "hidden"
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
      }
      if (variant !== "grid") {
        const width = element.clientWidth
        const height = window.innerHeight
        const mobile = window.matchMedia(MOBILE_QUERY).matches
        const upperRadius =
          Math.min(
            width * (mobile ? 0.43 : 0.34),
            height * (mobile ? 0.3 : 0.42)
          ) / 2
        const lowerRadius =
          (mobile ? Math.min(width * 1.05, height * 0.58) : width * 0.8) / 2
        const scale = 1 - p * 0.72
        const growingRadius =
          upperRadius + (Math.max(width, height) * 0.75 - upperRadius) * p
        // Push along the line joining the initial centres. Centre distance
        // always equals both rendered radii plus a gap, even on reverse scroll.
        const dx = (mobile ? -width * 0.08 : 0) + lowerRadius - width * 0.77
        const dy = height * (mobile ? 0.38 : 0.32) + lowerRadius - height * 0.27
        const length = Math.hypot(dx, dy)
        const separation =
          growingRadius + lowerRadius * scale + (mobile ? 12 : 24)
        const x = width * (0.77 - p * 0.27) + (dx / length) * separation
        let y = height * (0.27 + p * 0.23) + (dy / length) * separation
        // The lower circle is sized by width, the headline partly by height,
        // so on wide or short screens the circle rises into the headline.
        // Push it clear at rest, easing back to its path as the scene plays.
        // offset* metrics ignore the headline's own scroll transform.
        const headline = headlineRef.current
        const band = headline?.offsetParent as HTMLElement | null
        if (headline && band) {
          const headlineBottom =
            band.offsetTop + headline.offsetTop + headline.offsetHeight
          const circleTop = y - lowerRadius * scale
          y += Math.max(0, headlineBottom + 24 - circleTop) * (1 - p)
        }
        element.style.setProperty("--lower-x", `${x}px`)
        element.style.setProperty("--lower-y", `${y}px`)
        element.style.setProperty("--lower-visible", "visible")
      }
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
  }, [variant])
  // `dissolve` is the circles composition with a longer, dithered ending.
  const circles = variant !== "grid"
  const dissolve = variant === "dissolve"
  return (
    <div className="bg-background text-foreground">
      <HeroHeader />
      <div
        ref={track}
        className={cn(
          dissolve ? "h-[560vh]" : "h-[200vh]",
          "[--arrival:0] [--exit:1] [--p:0] [--row:48%] [--split:60%] motion-reduce:h-auto md:[--row:52%] md:[--split:70%]"
        )}
      >
        <section
          aria-labelledby="story-title"
          className={cn(
            "sticky top-0 isolate h-screen overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-screen",
            circles
              ? "[--diameter:min(43vw,30vh)] [--hero-type-size:clamp(20px,5.3vw,38px)] [--lower-diameter:min(105vw,58vh)] md:[--diameter:min(34vw,42vh)] md:[--hero-type-size:clamp(28px,min(5.7vw,11vh),100px)] md:[--lower-diameter:80vw]"
              : "border border-border"
          )}
        >
          <div
            className={cn(
              "softcom-portal-exit-up absolute top-0 left-0 flex",
              "motion-reduce:relative motion-reduce:m-0 motion-reduce:h-auto motion-reduce:min-h-[40vh] motion-reduce:w-full motion-reduce:transform-none motion-reduce:px-[5vw] motion-reduce:pt-20 motion-reduce:pb-10 motion-reduce:opacity-100 motion-reduce:md:mt-0 motion-reduce:md:px-[5vw] motion-reduce:md:pt-20 motion-reduce:md:pb-10",
              circles
                ? "h-[45%] w-[62%] items-start px-3.5 pt-24 pb-5 md:px-[3.2vw] md:pb-8"
                : "h-(--row) w-(--split) items-end border-r border-b border-border px-3.5 py-5 md:px-[3.2vw] md:py-8"
            )}
          >
            <h1
              id="story-title"
              ref={headlineRef}
              className={cn(
                "font-heading font-normal tracking-[-0.055em]",
                // Size before leading: tailwind-merge drops a leading-* that a later text-* follows.
                circles
                  ? "text-(length:--hero-type-size)"
                  : "text-[clamp(20px,5.3vw,38px)] md:text-[clamp(30px,min(6.6vw,12vh),116px)]",
                "leading-[1.04]"
              )}
            >
              Technology for
              <br />
              Organisations.
            </h1>
          </div>
          {/* Always dark: white type over a shaded photograph in either theme. */}
          <section
            aria-labelledby="progress-title"
            className={cn(
              "dark @container absolute top-0 z-4 flex items-center justify-center overflow-hidden text-foreground",
              "motion-reduce:relative motion-reduce:inset-auto motion-reduce:h-[60vh] motion-reduce:w-full motion-reduce:[clip-path:none]",
              circles
                ? "softcom-portal-circle inset-0 size-full bg-brand-blue"
                : "softcom-portal-panel border-b border-l border-border bg-neutral-900"
            )}
          >
            <Image
              src="/images/market-payment.jpg"
              alt="A market trader at her stall confirming a payment on her phone"
              fill
              priority
              sizes="100vw"
              className={cn(
                "object-cover object-[center_48%]",
                circles && "softcom-portal-photo-in motion-reduce:opacity-100"
              )}
            />
            <div className="softcom-portal-shade absolute inset-0 bg-[color-mix(in_oklab,var(--color-brand-blue-950),black_60%)] motion-reduce:opacity-65" />
            <h2
              id="progress-title"
              className={cn(
                "softcom-portal-arrival relative z-1 p-3.5 font-heading font-normal motion-reduce:transform-none motion-reduce:opacity-100 md:p-6",
                circles
                  ? "text-(length:--hero-type-size) leading-[1.04] tracking-[-0.055em]"
                  : "text-[clamp(22px,12cqw,84px)] leading-[1.02] tracking-[-0.05em] md:text-[clamp(24px,10cqw,144px)]"
              )}
            >
              Progress
              <br />
              for Society.
            </h2>
          </section>
          <figure
            className={cn(
              "absolute z-3 overflow-hidden motion-reduce:hidden",
              circles
                ? "softcom-portal-orbit rounded-full"
                : "softcom-portal-exit-left top-(--row) left-0 h-[calc(100%-var(--row))] w-(--split) border-t border-r border-border bg-neutral-900"
            )}
          >
            <Image
              src="/images/pos-agent.jpg"
              alt="A mobile-money agent handing cash to a customer under a blue umbrella"
              fill
              priority
              sizes="(max-width: 767px) 60vw, 70vw"
              className="object-cover object-[center_48%]"
            />
            {/* A layer over the photo rather than a background behind it, so
                no cyan fringe shows at the circle's antialiased edge. */}
            {circles && (
              <div className="softcom-portal-tint-in absolute inset-0 bg-brand-cyan" />
            )}
          </figure>
          {circles && (
            <button
              className="absolute right-[5vw] bottom-22 z-5 grid h-18 w-14 cursor-pointer place-items-center rounded-full text-brand-accent transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent active:scale-[0.97] motion-reduce:hidden md:bottom-[max(24px,4vh)]"
              aria-label="Scroll to Progress for Society"
              onClick={() => {
                const element = track.current
                if (!element) return
                const reduce = window.matchMedia(
                  "(prefers-reduced-motion: reduce)"
                ).matches
                const top = window.scrollY + element.getBoundingClientRect().top
                window.scrollTo({
                  top:
                    top +
                    (reduce
                      ? element.offsetHeight
                      : (element.offsetHeight - window.innerHeight) *
                        (dissolve ? PHASE.circles : 0.88)),
                  behavior: reduce ? "instant" : "smooth",
                })
              }}
            >
              <PixelArrowDown
                cascade
                className="softcom-pixel-cascade size-12"
              />
            </button>
          )}
          {dissolve && (
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
                className="dark invisible absolute inset-0 z-5 flex flex-col items-center justify-center gap-10 px-6 text-center text-foreground motion-reduce:visible motion-reduce:relative motion-reduce:min-h-[90vh] motion-reduce:py-24"
              >
                <Image
                  src="/images/lagos-dusk.jpg"
                  alt="Lagos at dusk across the lagoon, a fisherman in a canoe"
                  fill
                  sizes="100vw"
                  className="-z-10 object-cover object-bottom"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-black/64"
                />
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
                      headingText,
                      "max-w-[760px] leading-[1.1] text-foreground"
                    )}
                  >
                    We believe stronger organisations are the foundation of a
                    more prosperous society.
                  </h2>
                  <p className={cn(leadText, "max-w-[576px] text-neutral-200")}>
                    We build technology and capabilities that strengthen those
                    organisations, helping them operate better, make informed
                    decisions and create possibilities for the people who depend
                    on them.
                  </p>
                </div>
                <div
                  ref={missionCtaRef}
                  className="opacity-0 motion-reduce:opacity-100"
                >
                  <Button asChild size="lg" className={primaryPill}>
                    <Link href="/about">Our story</Link>
                  </Button>
                </div>
              </div>
              {/* Where WebGL is unavailable, the dither falls back to a fade. */}
              <div
                ref={fallbackRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-6 bg-brand-blue opacity-0 motion-reduce:hidden"
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
                className="dark pointer-events-none absolute inset-0 z-7 flex flex-col items-start justify-center gap-10 px-6 pt-24 pb-12 text-foreground motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:min-h-[90vh] motion-reduce:bg-brand-blue motion-reduce:py-16 md:px-[7vw]"
              >
                <p className="sr-only">
                  {STATEMENT.map((run) => run.text).join("")}
                </p>
                <ScrambleStatement ref={statementRef} />
                <div
                  ref={actionsRef}
                  className="pointer-events-auto flex flex-wrap items-center gap-2 opacity-0 motion-reduce:opacity-100"
                >
                  <StatementActions />
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      {/* Brand blue in both themes; `dark` resolves the pills and accent. */}
      {!dissolve && (
        <section
          aria-label="About Softcom"
          className="dark flex min-h-[90vh] flex-col items-start justify-center gap-10 bg-brand-blue px-6 py-16 text-foreground md:px-[7vw] md:py-25"
        >
          <p className={statementClass}>
            {STATEMENT.map((run) =>
              run.accent ? (
                <span key={run.text} className="text-brand-accent">
                  {run.text}
                </span>
              ) : (
                run.text
              )
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <StatementActions />
          </div>
        </section>
      )}
    </div>
  )
}
