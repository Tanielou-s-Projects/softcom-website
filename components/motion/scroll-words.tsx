"use client"

import * as React from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

import { cn } from "@/lib/utils"

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}
    </motion.span>
  )
}

/**
 * Paragraphs that light word by word as they cross the viewport — read at the
 * pace of the scroll. Words start faint rather than hidden, so the copy is
 * whole without motion and before hydration.
 */
function ScrollWords({
  paragraphs,
  className,
  paragraphClassName,
}: {
  paragraphs: string[]
  className?: string
  paragraphClassName?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  })
  const words = paragraphs.map((p) => p.split(" "))
  const total = words.reduce((sum, list) => sum + list.length, 0)
  let index = 0

  return (
    <div ref={ref} className={cn("flex flex-col gap-8", className)}>
      {words.map((list, p) => (
        <p key={p} className={paragraphClassName}>
          {list.map((word, w) => {
            const at = index++
            return (
              <React.Fragment key={w}>
                <Word
                  progress={scrollYProgress}
                  range={[at / total, Math.min(1, (at + 1.5) / total)]}
                >
                  {word}
                </Word>
                {w < list.length - 1 ? " " : null}
              </React.Fragment>
            )
          })}
        </p>
      ))}
    </div>
  )
}

export { ScrollWords }
