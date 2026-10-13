"use client"

import { useRef } from "react"
import Image from "next/image"
import { Image as ImageIcon } from "@phosphor-icons/react"
import { motion, useScroll, useSpring, useTransform } from "motion/react"

import type { AboutPage } from "@/components/about/page-copy"
import { ColorReveal } from "@/components/motion/color-reveal"
import { FullHero } from "@/components/site/full-hero"

/**
 * The circular team band, after Apollo's "Life at Apollo" section. The
 * portraits sit on near-black backgrounds, so the faces emerge from the hero.
 *
 * The band is wider than the viewport and full-bleed, so the outermost circles
 * are cut to half-circles at the screen edges. As the page scrolls, the whole
 * row drifts sideways through a spring — the lag gives it a weighty, physical,
 * carousel-like feel rather than a rigid scroll lock.
 *
 * Each circle takes the next photograph from the hero copy's `images` (greyscale
 * until scrolled into view, like every photo on the site); a slot without one
 * stays a grey placeholder with an image icon. Seven keeps the row wider than
 * the viewport so the edges always read as half-circles.
 */
/** Seven keeps the row wider than the viewport, so its ends read as half-circles. */
const SLOT_COUNT = 7

const band = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}

const circle = {
  hidden: { opacity: 0, scale: 0.86 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 22 },
  },
} as const

/**
 * The band of circles, as the hero's background: full-bleed across the upper
 * part of the frame, drifting sideways on a spring as the page scrolls.
 */
function CircleBand({ images }: { images: string[] }) {
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => images[i])
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  // Drift left as the hero scrolls up and out; the spring adds the weight.
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -300])
  const x = useSpring(xRaw, { stiffness: 45, damping: 20, mass: 1.3 })

  return (
    <div ref={ref} className="absolute inset-0">
      {/* Rides high, like the dither marks, so the copy owns the bottom. */}
      <div className="absolute inset-x-0 top-[12svh] flex justify-center overflow-hidden py-2 lg:top-[10svh]">
        <motion.div
          variants={band}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{ x, ["--d" as string]: "clamp(200px, 26vw, 420px)" }}
          className="flex w-max items-center will-change-transform"
          aria-hidden
        >
          {slots.map((photo, i) => (
            <motion.div
              key={i}
              variants={circle}
              className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-neutral-800 ring-8 ring-black lg:ring-[12px]"
              style={{
                width: "var(--d)",
                height: "var(--d)",
                marginLeft: i === 0 ? undefined : "calc(var(--d) * -0.12)",
                marginTop:
                  i % 2 ? "calc(var(--d) * 0.035)" : "calc(var(--d) * -0.035)",
              }}
            >
              {photo ? (
                <ColorReveal>
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 420px, 26vw"
                    className="object-cover"
                  />
                </ColorReveal>
              ) : (
                <ImageIcon
                  size="32%"
                  weight="light"
                  className="text-neutral-600"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* The standard film's bottom half, so the copy holds below the band. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-b from-transparent to-black"
      />
    </div>
  )
}

/**
 * The About hero, on the shared frame: the circular team band (after Apollo's
 * "Life at Apollo") as its background, the shared anatomy beneath it.
 */
function AboutHero({ copy }: { copy: AboutPage["hero"] }) {
  return (
    <FullHero
      background={<CircleBand images={copy.images} />}
      badge={copy.badge}
      title={copy.title}
      lead={copy.lead}
    />
  )
}

export { AboutHero }
