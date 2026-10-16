"use client"

import * as React from "react"
import { animate, inView, scroll, stagger as staggerBy } from "motion"
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
  /**
   * The rebuild's group modes (Daylight §2.15–2.16), for sections ported from
   * it: `true` fades the children up in turn; `"rows"` slides ruled rows in as
   * their top hairlines draw across; `"cards"` raises cards from below,
   * scrubbed to the scroll. The children animate, not a wrapper.
   */
  stagger?: boolean | "rows" | "cards"
  /** Play on mount rather than on scroll — for heroes already in view. */
  immediate?: boolean
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
  stagger,
  immediate,
}: RevealProps) {
  if (stagger || immediate)
    return (
      <RevealGroup
        as={as}
        className={className}
        stagger={stagger}
        immediate={immediate}
        delay={delay}
        y={y}
      >
        {children}
      </RevealGroup>
    )
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

const REDUCE = "(prefers-reduced-motion: reduce)"
const DESKTOP = "(min-width: 1024px)"
/** Where a reveal starts: the element's top crossing 85% down the viewport. */
const START = { margin: "0px 0px -15% 0px" } as const

/**
 * The rebuild's Reveal, on motion's imperative API: the same choreography
 * GSAP ran there, animating the element's children directly. Content is only
 * hidden once JS has run, so it reads without it.
 */
function RevealGroup({
  as,
  className,
  children,
  stagger,
  immediate,
  delay,
  y,
}: {
  as: RevealTag
  className?: string
  children: React.ReactNode
  stagger?: boolean | "rows" | "cards"
  immediate?: boolean
  delay: number
  y: number
}) {
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia(REDUCE).matches) return
    const items = [...el.children] as HTMLElement[]
    const targets = stagger ? items : [el]
    const play = (run: () => void) =>
      immediate ? (run(), undefined) : inView(el, run, START)

    if (stagger === "cards") {
      const from = { opacity: 0, y: 48, scale: 0.94 }
      items.forEach((item) => (item.style.transformOrigin = "50% 100%"))
      if (window.matchMedia(DESKTOP).matches) {
        const rise = animate(
          items,
          { opacity: [0, 1], y: [from.y, 0], scale: [from.scale, 1] },
          { ease: "easeOut", delay: staggerBy(0.14) }
        )
        return scroll(rise, { target: el, offset: ["start 88%", "start 30%"] })
      }
      const stops = items.map((item) =>
        scroll(
          animate(
            item,
            { opacity: [0, 1], y: [from.y, 0], scale: [from.scale, 1] },
            { ease: "easeOut" }
          ),
          { target: item, offset: ["start 92%", "start 55%"] }
        )
      )
      return () => stops.forEach((stop) => stop())
    }

    if (stagger === "rows") {
      items.forEach((item) => {
        item.style.setProperty("--rule", "0")
        item.style.opacity = "0"
      })
      return play(() => {
        animate(
          items,
          { "--rule": [0, 1] },
          { duration: 0.9, ease: EASE, delay: staggerBy(0.08) }
        )
        animate(
          items,
          { opacity: [0, 1], x: [-10, 0] },
          {
            duration: 0.45,
            ease: [0.33, 1, 0.68, 1],
            delay: staggerBy(0.08, { startDelay: 0.1 }),
          }
        )
      })
    }

    targets.forEach((t) => (t.style.opacity = "0"))
    return play(() => {
      animate(
        targets,
        { opacity: [0, 1], y: [y, 0] },
        {
          duration: 0.8,
          ease: EASE,
          delay: staggerBy(stagger ? 0.08 : 0, { startDelay: delay }),
        }
      )
    })
  }, [stagger, immediate, delay, y])

  const Tag = as as React.ElementType
  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={stagger === "rows" ? "rows" : undefined}
    >
      {children}
    </Tag>
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
