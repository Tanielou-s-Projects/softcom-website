"use client"

import * as React from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"

import { Container } from "@/components/landing/section"
import { ButtonLink } from "@/components/ui/button"
import type { HomePage } from "@/content/home/page-copy"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

type Copy = HomePage["howWeWork"]
type Beat = Copy["beats"][number]

/**
 * How Softcom works, as one sequence: technology, then the expertise that
 * puts it to use, then the people behind both. The client asked for the three
 * former sections merged and played as a transition (13 Oct 2026).
 *
 * On wide screens the section pins for one screen per beat: the index on the
 * left marks where the scroll is, and the beat's copy crossfades on the right.
 * On phones and under reduced motion the beats simply stack.
 */
function HowWeWork({ copy }: { copy: Copy }) {
  const pinned = useMediaQuery(
    "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
  )
  return pinned ? <Pinned copy={copy} /> : <Stacked copy={copy} />
}

function Pinned({ copy }: { copy: Copy }) {
  const track = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })
  const count = copy.beats.length
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setActive(Math.min(count - 1, Math.floor(p * count)))
  )
  const beat = copy.beats[active]

  return (
    <div
      ref={track}
      // One screen per beat; the last releases straight into the next section.
      style={{ height: `${count * 80 + 20}svh` }}
      className="relative"
    >
      <div className="sticky top-[10svh] flex h-[80svh] items-center">
        <Container className="grid grid-cols-12 gap-x-6">
          <div className="col-span-4 flex flex-col gap-10">
            <h2 className="label text-ink-soft">{copy.heading}</h2>
            <ol className="flex flex-col">
              {copy.beats.map((b, i) => (
                <li
                  key={b.label}
                  className="relative border-t border-line py-4 last:border-b"
                >
                  {/* The hairline fills as its beat plays. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -top-px left-0 h-px origin-left bg-accent-ink transition-transform duration-700 ease-expo-out",
                      i <= active ? "scale-x-100" : "scale-x-0"
                    )}
                    style={{ width: "100%" }}
                  />
                  <span
                    className={cn(
                      "flex items-baseline gap-4 transition-colors duration-500",
                      i === active ? "text-ink" : "text-ink-faint"
                    )}
                  >
                    <span className="label tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-heading text-2xl font-light">
                      {b.label}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative col-span-7 col-start-6 min-h-[22rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <BeatCopy beat={beat} />
              </motion.div>
            </AnimatePresence>
            <ButtonLink href={copy.cta.href} tone="ink" className="mt-10">
              {copy.cta.label}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </div>
  )
}

function Stacked({ copy }: { copy: Copy }) {
  return (
    <Container className="flex flex-col gap-10">
      <h2 className="label text-ink-soft">{copy.heading}</h2>
      <ol className="flex flex-col">
        {copy.beats.map((beat, i) => (
          <li
            key={beat.label}
            className="grid gap-4 border-t border-line py-10 lg:grid-cols-12 lg:gap-x-6"
          >
            <p className="flex items-baseline gap-4 text-ink lg:col-span-4">
              <span className="label tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-2xl font-light">
                {beat.label}
              </span>
            </p>
            <div className="lg:col-span-7 lg:col-start-6">
              <BeatCopy beat={beat} />
            </div>
          </li>
        ))}
      </ol>
      <ButtonLink href={copy.cta.href} tone="ink" className="self-start">
        {copy.cta.label}
      </ButtonLink>
    </Container>
  )
}

function BeatCopy({ beat }: { beat: Beat }) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-headline text-ink">{beat.title}</h3>
      <p className="max-w-[56ch] text-body text-ink-soft">{beat.text}</p>
    </div>
  )
}

export { HowWeWork }
