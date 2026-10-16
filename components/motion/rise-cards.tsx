"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"

/*
 * Cards that rise from below and scale up, scrubbed to the scroll so they
 * settle as the grid comes up the screen, cascading left to right — the
 * rebuild's `stagger="cards"` (Daylight §2.15), in motion rather than GSAP.
 * On phones each card has its own trigger. Reduced motion: no animation.
 */

/* One card's share of the run: each starts STAGGER after the last. */
const SPAN = 0.5
const STAGGER = 0.14
/* scrub: 0.8 — the progress trails the scroll a little. */
const SMOOTH = { stiffness: 120, damping: 30, mass: 0.6 }

function useRise(progress: MotionValue<number>, from: number, to: number) {
  const smooth = useSpring(progress, SMOOTH)
  const t = useTransform(smooth, [from, to], [0, 1], { clamp: true })
  return {
    opacity: t,
    y: useTransform(t, [0, 1], [48, 0]),
    scale: useTransform(t, [0, 1], [0.94, 1]),
    transformOrigin: "50% 100%",
  }
}

function Card({
  progress,
  index,
  count,
  className,
  children,
}: {
  progress: MotionValue<number>
  index: number
  count: number
  className?: string
  children: React.ReactNode
}) {
  const total = SPAN + STAGGER * (count - 1)
  const from = (index * STAGGER) / total
  const style = useRise(progress, from, from + SPAN / total)
  return (
    <motion.li style={style} className={className}>
      {children}
    </motion.li>
  )
}

function OwnTrigger({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLLIElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 55%"],
  })
  const style = useRise(scrollYProgress, 0, 1)
  return (
    <motion.li ref={ref} style={style} className={className}>
      {children}
    </motion.li>
  )
}

function RiseCards({
  className,
  itemClassName,
  children,
}: {
  className?: string
  itemClassName?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLUListElement>(null)
  const reduce = useReducedMotion()
  const desktop = useMediaQuery("(min-width: 768px)")
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "start 30%"],
  })
  const items = React.Children.toArray(children)

  return (
    <ul ref={ref} className={className}>
      {items.map((child, i) =>
        reduce ? (
          <li key={i} className={itemClassName}>
            {child}
          </li>
        ) : desktop ? (
          <Card
            key={i}
            progress={scrollYProgress}
            index={i}
            count={items.length}
            className={itemClassName}
          >
            {child}
          </Card>
        ) : (
          <OwnTrigger key={i} className={itemClassName}>
            {child}
          </OwnTrigger>
        )
      )}
    </ul>
  )
}

export { RiseCards }
