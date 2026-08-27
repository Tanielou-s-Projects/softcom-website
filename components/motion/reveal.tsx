"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Slot } from "radix-ui"

/** The site's shared fade-up ease — matches the existing copy reveals. */
const EASE = [0.16, 1, 0.3, 1] as const

const MotionSlot = motion.create(Slot.Root)

/* Static component table — selecting from it in render keeps identity stable. */
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  dl: motion.dl,
  span: motion.span,
} as const

type RevealTag = keyof typeof MOTION_TAGS

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Semantic tag when a wrapper is fine. */
  as?: RevealTag
  /** Animate the child itself instead of adding a wrapper — for grid/flex children whose classes are load-bearing. */
  asChild?: boolean
  delay?: number
  y?: number
  amount?: number
  once?: boolean
}

/**
 * The site-wide entrance: a subtle fade-up when the element scrolls into view.
 * Server components can wrap their content in it freely — children pass
 * through the client boundary. Never place it around anything that relies on
 * `position: sticky` (the transform creates a containing block).
 *
 * Reduced motion is handled by the layout's `MotionConfig reducedMotion="user"`
 * (movement stripped, opacity kept) rather than a `useReducedMotion` branch —
 * branching on it would change the SSR markup and break hydration.
 */
function Reveal({
  children,
  className,
  as = "div",
  asChild,
  delay = 0,
  y = 20,
  amount = 0.25,
  once = true,
}: RevealProps) {
  const Comp = asChild ? MotionSlot : (MOTION_TAGS[as] as typeof motion.div)

  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Comp>
  )
}

type RevealStaggerProps = {
  children: React.ReactNode
  className?: string
  as?: RevealTag
  stagger?: number
  delay?: number
  amount?: number
  once?: boolean
}

/**
 * Container for a staggered group — pair with `RevealItem` children, which
 * inherit their timing from this container's variants.
 */
function RevealStagger({
  children,
  className,
  as = "div",
  stagger = 0.08,
  delay = 0,
  amount = 0.2,
  once = true,
}: RevealStaggerProps) {
  const Comp = MOTION_TAGS[as] as typeof motion.div

  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </Comp>
  )
}

type RevealItemProps = {
  children: React.ReactNode
  className?: string
  as?: RevealTag
  asChild?: boolean
  y?: number
}

function RevealItem({
  children,
  className,
  as = "div",
  asChild,
  y = 20,
}: RevealItemProps) {
  const Comp = asChild ? MotionSlot : (MOTION_TAGS[as] as typeof motion.div)

  return (
    <Comp
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </Comp>
  )
}

export { Reveal, RevealItem, RevealStagger }
