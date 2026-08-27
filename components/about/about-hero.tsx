"use client"

import { useRef } from "react"
import { Image as ImageIcon } from "@phosphor-icons/react"
import { motion, useScroll, useSpring, useTransform } from "motion/react"

import { aboutHero } from "@/components/about/content"
import { Container, displayText, leadText } from "@/components/landing/section"
import { cn } from "@/lib/utils"

/**
 * The About hero, after Apollo's "Life at Apollo" section: a headline, then a
 * band of huge circular team cutouts, then the sub text. The portraits sit on
 * near-black backgrounds, so on the dark theme the faces emerge from the page.
 *
 * The band is wider than the viewport and full-bleed, so the outermost circles
 * are cut to half-circles at the screen edges. As the page scrolls, the whole
 * row drifts sideways through a spring — the lag gives it a weighty, physical,
 * carousel-like feel rather than a rigid scroll lock.
 *
 * The circles are plain grey placeholders with an image icon for now — the real
 * "life at Softcom" photography drops into these seven slots later. Seven keeps
 * the row wider than the viewport so the edges always read as half-circles.
 */
const SLOTS = Array.from({ length: 7 })

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

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
} as const

function AboutHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  // Drift left as the hero scrolls up and out; the spring adds the weight.
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -300])
  const x = useSpring(xRaw, { stiffness: 45, damping: 20, mass: 1.3 })

  return (
    <section
      ref={ref}
      className="flex flex-col items-center gap-10 pt-4 pb-6 lg:gap-16 lg:pt-8"
    >
      {/* Headline — above the band, like the reference. */}
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <Container className="flex justify-center">
          <h1
            className={cn(
              displayText,
              "max-w-[16ch] text-center text-foreground"
            )}
          >
            {aboutHero.title}
          </h1>
        </Container>
      </motion.div>

      {/* The huge circular carousel — full-bleed, edge circles cut to half. */}
      <div className="relative flex w-full justify-center overflow-hidden py-2">
        <motion.div
          variants={band}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{ x, ["--d" as string]: "clamp(240px, 33vw, 540px)" }}
          className="flex w-max items-center will-change-transform"
          aria-hidden
        >
          {SLOTS.map((_, i) => (
            <motion.div
              key={i}
              variants={circle}
              className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-neutral-800 ring-8 ring-background lg:ring-[12px]"
              style={{
                width: "var(--d)",
                height: "var(--d)",
                marginLeft: i === 0 ? undefined : "calc(var(--d) * -0.12)",
                marginTop:
                  i % 2 ? "calc(var(--d) * 0.035)" : "calc(var(--d) * -0.035)",
              }}
            >
              <ImageIcon
                size="32%"
                weight="light"
                className="text-neutral-600"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Sub text — after the huge hero. */}
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <Container className="flex justify-center">
          <p
            className={cn(
              leadText,
              "max-w-[60ch] text-center text-muted-foreground"
            )}
          >
            {aboutHero.lead}
          </p>
        </Container>
      </motion.div>
    </section>
  )
}

export { AboutHero }
