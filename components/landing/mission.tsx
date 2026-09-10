"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"

import { Button } from "@/components/ui/button"
import {
  Bleed,
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { TENURE } from "@/components/landing/content"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

const viewport = { once: true, amount: 0.3 } as const

/*
 * The image's resting crop, derived from the original Figma rect
 * (top 58.01%, left 25.43%, w 50.36%, h 49.48% — it bled past the panel
 * bottom into the clip, so the bottom inset is 0). Kept as a static class
 * too so the pre-hydration paint matches the scrub's starting frame.
 */
const CLIP_TOP = 58.01
const CLIP_RIGHT = 24.21
const CLIP_LEFT = 25.43

/**
 * One full-bleed panel (Figma group 210:82): the mission statement on brand
 * blue with the photograph resting beneath it. On desktop the section pins
 * and the photo's crop window scales up with scroll until it covers the whole
 * panel, the statement fades out under it, and the accent dot, second copy,
 * and CTA surface over the darkened image. Scrolling back reverses it.
 *
 * On mobile and under reduced motion there is no pin — the panel flows and
 * the second phase plays as a one-time in-view sequence.
 */
function Mission() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const scrub = isDesktop && !reduceMotion

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  })
  // A light spring smooths discrete wheel steps without lagging the scrub.
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 34,
    mass: 0.6,
  })

  // The crop window grows to full bleed; its radius eases 2xl → 4xl so the
  // final frame is congruent with the panel's own corners.
  const clipTop = useTransform(progress, [0.1, 0.55], [CLIP_TOP, 0])
  const clipRight = useTransform(progress, [0.1, 0.55], [CLIP_RIGHT, 0])
  const clipLeft = useTransform(progress, [0.1, 0.55], [CLIP_LEFT, 0])
  const clipRadius = useTransform(progress, [0.1, 0.55], [16, 32])
  const clipPath = useMotionTemplate`inset(${clipTop}% ${clipRight}% 0% ${clipLeft}% round ${clipRadius}px)`

  // The statement bows out before the crop reaches it.
  const introOpacity = useTransform(progress, [0.12, 0.32], [1, 0])
  const introY = useTransform(progress, [0.12, 0.32], [0, -24])

  const overlayOpacity = useTransform(progress, [0.4, 0.6], [0, 0.64])

  // The blue bows out with the cover — otherwise it rings the panel's
  // antialiased rounded edge under the clipped image at full bleed.
  const panelBackground = useTransform(
    progress,
    [0.5, 0.7],
    ["#004bff", "rgba(0, 75, 255, 0)"]
  )

  const dotScale = useTransform(progress, [0.56, 0.7], [0, 1])
  const dotOpacity = useTransform(progress, [0.56, 0.62], [0, 1])
  const copyOpacity = useTransform(progress, [0.62, 0.78], [0, 1])
  const copyY = useTransform(progress, [0.62, 0.78], [24, 0])
  const buttonOpacity = useTransform(progress, [0.7, 0.86], [0, 1])
  const buttonY = useTransform(progress, [0.7, 0.86], [16, 0])
  // 0.86 → 1 holds the finished frame while still pinned, then releases.

  const inViewFor = (delay: number) =>
    scrub
      ? {}
      : ({
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport,
          transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
        } as const)

  return (
    <Bleed className="pt-6">
      {/* Scroll track — a plain div (no transforms) so the sticky child pins. */}
      <div ref={trackRef} className="relative lg:motion-safe:h-[280vh]">
        <motion.div
          style={scrub ? { backgroundColor: panelBackground } : undefined}
          className="dark relative flex flex-col items-center gap-12 overflow-clip rounded-4xl bg-brand-blue px-6 pt-20 pb-6 lg:gap-32 lg:pt-32 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:pb-6 lg:motion-reduce:h-auto lg:motion-reduce:pb-20"
        >
          {/* Phase one — the mission statement. */}
          <motion.div
            style={scrub ? { opacity: introOpacity, y: introY } : undefined}
            className="flex flex-col items-center gap-12 lg:gap-24"
          >
            <h2
              className={cn(
                headingText,
                "max-w-[600px] text-center leading-[1.1] text-foreground"
              )}
            >
              We exist to create lasting impact.
            </h2>
            <p
              className={cn(
                leadText,
                "max-w-[684px] text-center text-neutral-200"
              )}
            >
              Founded in Lagos in 2007, Softcom builds the systems that help
              organisations operate, grow, and better serve the people who
              depend on them. We believe stronger organisations are the
              foundation of a more prosperous society.
            </p>
          </motion.div>

          {/*
           * The one photograph. Mobile / reduced motion: an in-flow block.
           * Desktop scrub: full-bleed and clipped down to the resting rect,
           * with the crop window driven by scroll.
           */}
          <motion.div
            style={scrub ? { clipPath } : undefined}
            className={cn(
              "relative z-10 aspect-[701/506.668] w-full overflow-clip rounded-2xl",
              // -inset-px overdraws the panel edge by 1px so no blue antialiasing ring shows at full cover.
              "lg:motion-safe:absolute lg:motion-safe:-inset-px lg:motion-safe:aspect-auto lg:motion-safe:rounded-none",
              "lg:motion-safe:[clip-path:inset(58.01%_24.21%_0%_25.43%_round_16px)]"
            )}
          >
            <Image
              src="/landing/story.png"
              alt="A Softcom team member reviewing printed reports"
              fill
              sizes="100vw"
              className="object-cover object-bottom"
            />
            <motion.div
              aria-hidden
              style={scrub ? { opacity: overlayOpacity } : undefined}
              {...(!scrub && {
                initial: { opacity: 0 },
                whileInView: { opacity: 0.64 },
                viewport,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              })}
              className="absolute inset-0 bg-black"
            />
          </motion.div>

          {/* Phase two — dot, copy, CTA. Centered over the image on desktop. */}
          {/* pointer-events off while absolute so the hidden layer never blocks the statement; the CTA re-enables. */}
          <div className="relative z-20 flex flex-col items-center gap-10 lg:motion-safe:pointer-events-none lg:motion-safe:absolute lg:motion-safe:inset-0 lg:motion-safe:justify-center lg:motion-safe:gap-16">
            <motion.img
              src="/brand/accent-dot.svg"
              alt=""
              width={26}
              height={26}
              style={
                scrub ? { scale: dotScale, opacity: dotOpacity } : undefined
              }
              {...(!scrub && {
                initial: { opacity: 0, scale: 0 },
                whileInView: { opacity: 1, scale: 1 },
                viewport,
                transition: {
                  type: "spring",
                  stiffness: 520,
                  damping: 15,
                  delay: 0.5,
                },
              })}
              className="size-[26px] shrink-0"
            />
            <motion.p
              style={scrub ? { opacity: copyOpacity, y: copyY } : undefined}
              {...inViewFor(0.25)}
              className={cn(
                leadText,
                "max-w-[576px] text-center text-neutral-200"
              )}
            >
              For {TENURE}, we have partnered with governments, financial
              institutions, global development agencies, and growth-stage
              enterprises to build the platforms, data systems, and digital
              capabilities that drive their most important outcomes.
            </motion.p>
            <motion.div
              style={scrub ? { opacity: buttonOpacity, y: buttonY } : undefined}
              {...inViewFor(0.4)}
              className="pointer-events-auto"
            >
              <Button asChild size="lg" className={primaryPill}>
                <Link href="/about">Our Story</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Bleed>
  )
}

export { Mission }
