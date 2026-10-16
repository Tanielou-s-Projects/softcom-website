"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A horizontal rail driven by vertical scroll: on desktop the section pins
 * and the track slides left as you scroll down, so a row of cards reads one
 * after another without a carousel. On a phone it is an ordinary swipeable
 * row with snap points.
 */
function ScrollRail({
  intro,
  children,
  className,
}: {
  /** Sits at the head of the track, scrolling away with it. */
  intro?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const section = React.useRef<HTMLDivElement>(null)
  const track = React.useRef<HTMLDivElement>(null)
  const [travel, setTravel] = React.useState(0)

  React.useLayoutEffect(() => {
    const measure = () => {
      const node = track.current
      if (!node) return
      setTravel(Math.max(0, node.scrollWidth - window.innerWidth))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (track.current) observer.observe(track.current)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div className={className}>
      {/* Desktop: the pinned rail. Its height is the distance the track travels. */}
      <div
        ref={section}
        className="relative hidden lg:block"
        style={{ height: `calc(100svh + ${travel}px)` }}
      >
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <motion.div
            ref={track}
            style={{ x }}
            className="flex w-max items-stretch gap-2.5 px-6"
          >
            {intro}
            {children}
          </motion.div>
          <div className="mx-6 mt-10 h-px bg-line">
            <motion.div
              style={{ scaleX: progress }}
              className="h-px origin-left bg-ink"
            />
          </div>
        </div>
      </div>

      {/* Phone and tablet: a swipeable row. */}
      <div
        className={cn(
          "flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-6 pb-4 lg:hidden",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {intro}
        {children}
      </div>
    </div>
  )
}

export { ScrollRail }
