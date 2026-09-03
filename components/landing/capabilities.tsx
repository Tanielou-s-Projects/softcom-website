"use client"

import * as React from "react"
import Image from "next/image"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"

import {
  bodyText,
  cardHeadingText,
  Container,
  headingText,
  leadText,
} from "@/components/landing/section"
import { capabilities } from "@/components/landing/content"
import { Reveal } from "@/components/motion/reveal"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

/**
 * Three full-bleed capability slides on a horizontal rail. Figma sizes each at
 * 1176x1024 and lets the row overflow.
 *
 * Desktop: the section pins and the page's vertical scroll drives the rail
 * sideways — the slides pass under a fixed header, then the section releases.
 * Mobile and reduced motion: a plain scroll-snap rail, navigable by pointer,
 * keyboard, and touch.
 */
function Capabilities() {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const railRef = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const scrub = isDesktop && !reduceMotion

  // How far the rail must travel so the last slide ends flush with the gutter.
  const [shift, setShift] = React.useState(0)
  React.useEffect(() => {
    if (!scrub) return
    const rail = railRef.current
    if (!rail) return
    const measure = () =>
      setShift(Math.max(0, rail.scrollWidth - rail.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(rail)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [scrub])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 34,
    mass: 0.6,
  })
  // A short hold at each end so the first and last slides get a resting beat.
  const x = useTransform(progress, [0.08, 0.92], [0, -shift])

  return (
    <div
      ref={trackRef}
      // Track height scales with the slide count so scrub speed stays constant.
      className="relative flex flex-col gap-10 lg:gap-16 lg:motion-safe:h-[260vh]"
    >
      <div className="flex flex-col gap-10 lg:gap-16 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:justify-center lg:motion-safe:overflow-hidden">
        <Reveal asChild>
          <Container className="flex flex-col items-center gap-8 pt-6 text-center lg:gap-10">
            <h2 className={cn(headingText, "max-w-[533px] text-foreground")}>
              From infrastructure → intelligence.
            </h2>
            <p className={cn(leadText, "max-w-[576px] text-muted-foreground")}>
              We design and deliver across the full stack of enterprise
              technology, from core operational platforms to data systems that
              turn complexity into clarity.
            </p>
          </Container>
        </Reveal>

        <motion.div
          ref={railRef}
          style={scrub ? { x } : undefined}
          /* Scrollable region on touch, so it must be keyboard-reachable. */
          tabIndex={scrub ? -1 : 0}
          role={scrub ? undefined : "region"}
          aria-label={scrub ? undefined : "What we do"}
          className={cn(
            "flex snap-x snap-mandatory scroll-px-6 items-start gap-3 overflow-x-auto overflow-y-clip px-6 pt-6",
            // Scrubbed: the rail no longer scrolls itself; the transform moves it.
            "lg:motion-safe:snap-none lg:motion-safe:overflow-visible"
          )}
        >
          {capabilities.map((capability) => (
            <article
              key={capability.number}
              /* Figma's 1176×1024 is a ceiling, not a size: the slide never exceeds the viewport. */
              className="dark relative flex h-[min(560px,75svh)] w-[min(1176px,85vw)] shrink-0 snap-start flex-col items-end justify-end gap-2.5 overflow-clip rounded-4xl p-4 sm:h-[min(720px,80svh)] lg:h-[min(1024px,58svh)] lg:p-6"
            >
              <Image
                src={capability.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 1176px, 85vw"
                className="object-cover"
              />

              <div
                className={cn(
                  "relative flex flex-col items-start overflow-clip rounded-4xl p-4 lg:p-6",
                  capability.chipClassName
                )}
              >
                <p className={cn(cardHeadingText, "whitespace-nowrap")}>
                  {capability.number}
                </p>
              </div>

              <div className="relative flex flex-col items-start gap-6 overflow-clip rounded-4xl bg-background p-6 text-foreground lg:gap-8 lg:p-[47px]">
                <h3 className={cn(cardHeadingText, "lg:max-w-[359px]")}>
                  {capability.title}
                </h3>
                <p className={cn(bodyText, "lg:max-w-[600px]")}>
                  {capability.description}
                </p>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export { Capabilities }
