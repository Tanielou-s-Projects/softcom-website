"use client"

import * as React from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

import type { DeliveryPhase } from "@/content/solutions/content"

function Phase({
  phase,
  index,
  count,
  progress,
}: {
  phase: DeliveryPhase
  index: number
  count: number
  progress: MotionValue<number>
}) {
  // Each phase arrives as the line reaches its marker.
  const at = index / (count - 1)
  const opacity = useTransform(progress, [at - 0.18, at], [0.25, 1])
  const fill = useTransform(progress, [at - 0.02, at], [0, 1])
  return (
    <li className="relative flex flex-col gap-4 pl-10 lg:pt-12 lg:pl-0">
      <span
        aria-hidden
        className="absolute top-1 left-0 grid size-5 place-items-center rounded-full border border-ink/40 bg-accent lg:top-0 lg:-translate-y-1/2"
      >
        <motion.span
          style={{ scale: fill }}
          className="size-2.5 rounded-full bg-ink"
        />
      </span>
      <motion.div style={{ opacity }} className="flex flex-col gap-3">
        <span className="font-heading text-5xl leading-none font-medium text-ink tabular-nums">
          {phase.step}
        </span>
        <h3 className="text-lg font-bold text-ink">{phase.title}</h3>
        <p className="text-base leading-[1.55] text-ink/80">
          {phase.description}
        </p>
      </motion.div>
    </li>
  )
}

/**
 * The delivery phases on a line that draws itself as the section scrolls
 * through the viewport: across on desktop, down on a phone.
 */
function Timeline({ phases }: { phases: DeliveryPhase[] }) {
  const ref = React.useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.55"],
  })

  return (
    <ol
      ref={ref}
      className="relative grid gap-12 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-0"
    >
      {/* The rule, and its drawn part. */}
      <span
        aria-hidden
        className="absolute top-0 bottom-0 left-2.5 w-px bg-ink/20 lg:top-0 lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
      />
      <motion.span
        aria-hidden
        style={{ scaleY: scrollYProgress }}
        className="absolute top-0 bottom-0 left-2.5 w-px origin-top bg-ink lg:hidden"
      />
      <motion.span
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="absolute top-0 right-0 left-0 hidden h-px origin-left bg-ink lg:block"
      />
      {phases.map((phase, index) => (
        <Phase
          key={phase.step}
          phase={phase}
          index={index}
          count={phases.length}
          progress={scrollYProgress}
        />
      ))}
    </ol>
  )
}

export { Timeline }
