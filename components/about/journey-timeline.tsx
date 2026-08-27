"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import { AnimatePresence, motion, useInView } from "motion/react"

import { cn } from "@/lib/utils"
import { milestones, type Milestone } from "@/components/about/content"
import { bodyText, Container, headingText } from "@/components/landing/section"

/**
 * "Our Journey" — a V7-style ruler timeline, adapted to the Softcom dark theme.
 *
 * The milestones sit on a horizontal scale positioned by their actual year
 * (2007 → 2025), so the gaps read true. Navigate by hovering a tick, dragging /
 * horizontal-scrolling to scrub, the prev/next arrows, or the keyboard — and it
 * auto-advances while on screen until you touch it. Selecting a milestone
 * reveals its full copy; `reveal` swaps how that reveal is composed so the
 * variations can be compared side by side.
 */

const items = milestones.items
const YEAR_MIN = 2007
const YEAR_MAX = 2025
/** 0–1 position of a year across the span. */
const posOf = (year: string) =>
  (Number(year) - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)

/** Decorative background rhythm — a dense, low-contrast ruler behind the marks. */
const MINOR_TICKS = 56

export type JourneyReveal = "side" | "below" | "card"

export function JourneyTimeline({
  reveal = "side",
  className,
}: {
  reveal?: JourneyReveal
  className?: string
}) {
  const [active, setActive] = React.useState(0)
  const [hovered, setHovered] = React.useState<number | null>(null)
  const [paused, setPaused] = React.useState(false)

  const rootRef = React.useRef<HTMLDivElement>(null)
  const rulerRef = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef(false)
  const wheelAt = React.useRef(0)
  const inView = useInView(rootRef, { amount: 0.4 })

  const current = items[active]

  // Auto-advance while visible and untouched.
  React.useEffect(() => {
    if (!inView || paused) return
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 3800)
    return () => clearInterval(id)
  }, [inView, paused])

  const clampGo = (dir: number) =>
    setActive((a) => (a + dir + items.length) % items.length)

  /** Map a clientX to the nearest milestone and select it. */
  const scrubTo = (clientX: number) => {
    const el = rulerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = Math.min(Math.max((clientX - r.left) / r.width, 0), 1)
    let best = 0
    let bestDist = Infinity
    items.forEach((m, i) => {
      const d = Math.abs(posOf(m.year) - x)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    setActive(best)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    setPaused(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    scrubTo(e.clientX)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) scrubTo(e.clientX)
  }
  const endDrag = () => {
    dragging.current = false
  }

  // Horizontal wheel / trackpad swipe scrubs; vertical wheel is left to scroll.
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    const now = Date.now()
    if (now - wheelAt.current < 260) return
    wheelAt.current = now
    clampGo(e.deltaX > 0 ? 1 : -1)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, items.length - 1))
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === "Home") {
      setActive(0)
    } else if (e.key === "End") {
      setActive(items.length - 1)
    }
  }

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false)
        setHovered(null)
      }}
      className={cn("flex flex-col gap-8", className)}
    >
      {/* Header — eyebrow + heading on the left, arrows on the right. */}
      <div className="flex items-end justify-between gap-6">
        <h2 className={cn(headingText, "text-foreground")}>
          {milestones.heading}
        </h2>
        <div className="flex items-center gap-2">
          <Arrow direction="left" onClick={() => clampGo(-1)} />
          <Arrow direction="right" onClick={() => clampGo(1)} />
        </div>
      </div>

      {/* The ruler. */}
      <div
        ref={rulerRef}
        role="slider"
        tabIndex={0}
        aria-label="Timeline of milestones"
        aria-valuemin={0}
        aria-valuemax={items.length - 1}
        aria-valuenow={active}
        aria-valuetext={`${current.year} — ${current.headline}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        className={cn(
          "relative h-24 cursor-ew-resize touch-pan-y outline-none select-none",
          "focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        )}
      >
        {/* Minor rhythm ticks. */}
        <div className="pointer-events-none absolute inset-x-0 top-8 flex items-start justify-between">
          {Array.from({ length: MINOR_TICKS }).map((_, i) => (
            <span key={i} className="h-4 w-px bg-border/70" />
          ))}
        </div>

        {/* Baseline. */}
        <div className="pointer-events-none absolute inset-x-0 top-8 h-px bg-border" />

        {/* Sliding playhead. */}
        <motion.div
          className="pointer-events-none absolute top-0 -translate-x-1/2"
          animate={{ left: `${posOf(current.year) * 100}%` }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        >
          <span className="block size-2 -translate-x-1/2 translate-y-1 rounded-full bg-brand-accent shadow-[0_0_12px] shadow-brand-accent/60" />
        </motion.div>

        {/* Milestone marks. */}
        {items.map((m, i) => {
          const isActive = i === active
          const isHover = i === hovered && !isActive
          return (
            <div
              key={m.year}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${posOf(m.year) * 100}%` }}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                aria-label={`${m.year} — ${m.headline}`}
                className="relative flex h-16 w-8 items-start justify-center pt-8"
              >
                <motion.span
                  className="block w-[2px] origin-top rounded-full"
                  animate={{
                    height: isActive ? 40 : isHover ? 28 : 16,
                    backgroundColor: isActive
                      ? "var(--color-brand-accent)"
                      : isHover
                        ? "color-mix(in oklch, var(--color-brand-accent) 60%, transparent)"
                        : "var(--color-border)",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                />
              </button>

              {/* Year label under every mark. */}
              <motion.span
                animate={{
                  color: isActive
                    ? "var(--color-brand-accent)"
                    : "var(--color-muted-foreground)",
                  opacity: isActive || isHover ? 1 : 0.7,
                }}
                className="mt-1 font-mono text-xs tracking-wide"
              >
                {m.year}
              </motion.span>

              {/* Hover preview bubble (non-active). */}
              <AnimatePresence>
                {isHover && (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute -top-11 rounded-full bg-black px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-xl"
                  >
                    {m.headline}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* The reveal — swapped by variation. */}
      <Reveal reveal={reveal} active={active} />
    </motion.div>
  )
}

function Arrow({
  direction,
  onClick,
}: {
  direction: "left" | "right"
  onClick: () => void
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-label={
        direction === "left" ? "Previous milestone" : "Next milestone"
      }
      className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand-accent/50 hover:text-brand-accent"
    >
      <Icon size={18} weight="bold" />
    </motion.button>
  )
}

/** Shared side-layout fields — the giant year, and the headline + description. */
function SideYear({ m }: { m: Milestone }) {
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={m.year}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="font-heading text-6xl leading-none text-foreground lg:text-8xl"
      >
        {m.year}
      </motion.p>
    </AnimatePresence>
  )
}

function SideText({ m }: { m: Milestone }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={m.year}
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-w-[52ch] flex-col gap-3"
      >
        <h3 className="font-heading text-2xl text-foreground">{m.headline}</h3>
        <p className={cn(bodyText, "text-muted-foreground")}>{m.description}</p>
      </motion.div>
    </AnimatePresence>
  )
}

/** Side — giant year on the left, detail sliding in on the right. */
function SidePlain({ m }: { m: Milestone }) {
  return (
    <div className="grid gap-6 border-t border-border pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
      <SideYear m={m} />
      <SideText m={m} />
    </div>
  )
}

function BelowReveal({ m }: { m: Milestone }) {
  return (
    <div className="min-h-[9rem] border-t border-border pt-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={m.year}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-[70ch] flex-col gap-3"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-heading text-3xl text-brand-accent">
              {m.year}
            </span>
            <h3 className="font-heading text-2xl text-foreground">
              {m.headline}
            </h3>
          </div>
          <p className={cn(bodyText, "text-muted-foreground")}>
            {m.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CardReveal({ m }: { m: Milestone }) {
  return (
    <div className="relative min-h-[13rem]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={m.year}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -12 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 lg:max-w-[62ch] lg:p-10"
        >
          <span className="font-mono text-xs tracking-widest text-brand-accent uppercase">
            {m.year}
          </span>
          <h3 className="font-heading text-3xl text-foreground">
            {m.headline}
          </h3>
          <p className={cn(bodyText, "text-muted-foreground")}>
            {m.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** The detail panel — each variation composes the same fields differently. */
function Reveal({ reveal, active }: { reveal: JourneyReveal; active: number }) {
  const m = items[active]
  switch (reveal) {
    case "below":
      return <BelowReveal m={m} />
    case "card":
      return <CardReveal m={m} />
    default:
      return <SidePlain m={m} />
  }
}

/** A ready-to-drop section wrapper for the About page (default reveal). */
export function JourneySection({ reveal }: { reveal?: JourneyReveal }) {
  return (
    <Container className="py-16">
      <JourneyTimeline reveal={reveal} />
    </Container>
  )
}
