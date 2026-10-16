"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { Arrow } from "@/components/ui/arrow"
import { ButtonLink, ArrowLink } from "@/components/ui/button"
import { withYears, type HomePage } from "@/content/home/page-copy"
import { cn } from "@/lib/utils"
import { createDitherField } from "@/components/motion/dither-field"
import { DitherMark } from "@/components/motion/dither-mark"
import { lockScroll, smoothScroll } from "@/lib/smooth-scroll"
import { HeroHeader } from "./hero-header"

/*
 * The hero is one pinned scene, as fractions of its scroll track: the conduit
 * and the headline hold, blue rises over them in the shared dither, the
 * statement decodes out of the blue and holds; then the same blue drains away
 * — taking the statement with it — to reveal the mission photograph and its
 * copy. The blue that arrived is the blue that leaves — there is no section
 * edge.
 *
 * On the first visit of a session the same field also opens the page: it
 * starts whole and drains to reveal the conduit (the preloader), so the load
 * and the scroll are one dither, run backwards and then forwards.
 */
const PHASE = {
  dither: [0.1, 0.28],
  text: [0.26, 0.4],
  actions: [0.38, 0.43],
  /** Where the arrow rests on the statement, before the drain. */
  hold: 0.5,
  drain: [0.56, 0.72],
  /**
   * The statement's exit, inside the drain: it fades while the draining
   * front (top first) crosses the middle of the screen where it sits, so the
   * dither reads as carrying it away. No exit of its own.
   */
  statementOut: [0.58, 0.64],
  mission: [0.7, 0.82],
  missionCta: [0.81, 0.88],
} as const

/**
 * Where the scroll arrow stops, as fractions of the scene's scroll track: each
 * scene's resting points, in order. Past the last, it leaves the scene.
 */
const SCROLL_STOPS = [PHASE.hold, PHASE.missionCta[1]]

/* The load intro: once per session, never under reduced motion. */
const INTRO_KEY = "softcom:intro"
const INTRO_MS = 1600
const REDUCE = "(prefers-reduced-motion: reduce)"
/*
 * Runs before first paint, so a first visit opens on the solid blue the
 * dither starts from rather than flashing the hero first.
 */
const PENDING_SCRIPT = `try{if(!sessionStorage.getItem("${INTRO_KEY}")&&!matchMedia("${REDUCE}").matches&&scrollY<10)document.documentElement.dataset.intro="pending"}catch(e){}`

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
      <ArrowLink arrow={false} href={copy.secondaryCta.href}>
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
    let intro = 0
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
      const reduce = media.matches
      const drain = ease(segment(raw, PHASE.drain))
      const scrolled = reduce
        ? 0
        : raw < PHASE.drain[0]
          ? ease(segment(raw, PHASE.dither))
          : 1 - drain
      // The intro holds the field whole and lets it go; scroll takes over.
      const d = Math.max(scrolled, intro)
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
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const root = document.documentElement
    let introFrame = 0
    if (root.dataset.intro === "pending") {
      sessionStorage.setItem(INTRO_KEY, "1")
      intro = 1
      lockScroll(true)
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / INTRO_MS)
        intro = 1 - ease(t)
        update()
        // The solid cover hands over to the field on its first frame.
        delete root.dataset.intro
        if (t < 1) introFrame = requestAnimationFrame(tick)
        else lockScroll(false)
      }
      introFrame = requestAnimationFrame(tick)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    media.addEventListener("change", schedule)
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(introFrame)
      lockScroll(false)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      media.removeEventListener("change", schedule)
      dither?.dispose()
    }
  }, [])
  const scrollOn = () => {
    const element = track.current
    if (!element) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const top = window.scrollY + element.getBoundingClientRect().top
    const range = element.offsetHeight - window.innerHeight
    const progress = (window.scrollY - top) / range
    /*
     * Section by section: each press goes to the next resting
     * point of the pinned scene, and past the last one to the
     * section below. It used to stop after the first.
     */
    const next = SCROLL_STOPS.find((stop) => stop > progress + 0.01)
    const target =
      next === undefined || reduce
        ? top + element.offsetHeight
        : top + range * next
    // Through the smooth scroller when it is on, so the glide matches.
    if (smoothScroll.lenis)
      smoothScroll.lenis.scrollTo(target, { duration: 1.6 })
    else
      window.scrollTo({ top: target, behavior: reduce ? "instant" : "smooth" })
  }

  return (
    <div className="bg-paper text-ink">
      <script dangerouslySetInnerHTML={{ __html: PENDING_SCRIPT }} />
      <HeroHeader />
      <div ref={track} className="h-[460vh] motion-reduce:h-auto">
        <div className="sticky top-0 isolate h-screen overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-screen">
          {/*
           * The opening: the conduit — the brand's two discs joined, work
           * moving between them — over the headline. Always dark, as the
           * Solutions hero it comes from.
           */}
          <section
            aria-labelledby="story-title"
            className="dark absolute inset-0 flex flex-col justify-end bg-black text-ink motion-reduce:relative motion-reduce:min-h-screen"
          >
            <div aria-hidden className="absolute inset-x-0 top-0 bottom-0">
              <DitherMark layout="conduit" />
            </div>
            <div
              data-hero-copy=""
              className="relative shell flex items-end justify-between gap-6 pb-24 md:gap-10 md:pb-28"
            >
              <h1 id="story-title" className="text-display">
                {/* One sentence per line, as the brand line is written. */}
                <span className="block">
                  {copy.headlineFirstLine} {copy.headlineSecondLine}
                </span>
                <span className="block text-ink-soft">
                  {copy.progressFirstLine} {copy.progressSecondLine}
                </span>
              </h1>
              {/* The scroll cue: one small arrow at the far right, level with the headline. */}
              <button
                type="button"
                aria-label={copy.scrollLabel}
                onClick={scrollOn}
                className="mb-3 shrink-0 cursor-pointer rounded-full p-2 text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-ink"
              >
                <span className="softcom-nudge">
                  <Arrow className="size-5 rotate-90" />
                </span>
              </button>
            </div>
          </section>
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
              className="softcom-intro-cover pointer-events-none absolute inset-0 z-6 bg-accent opacity-0 motion-reduce:hidden"
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
                className="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-4 opacity-0 motion-reduce:opacity-100"
              >
                <StatementActions copy={copy} />
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  )
}
