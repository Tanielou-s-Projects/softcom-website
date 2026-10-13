"use client"

import * as React from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export type StoryStep = {
  id: string
  label: string
  title: string
  body: string
}

/**
 * A pinned scroll story: the steps scroll past on one side while the figure
 * holds still on the other, and the figure follows the step in view: the
 * wrapper carries `data-focus` set to the active step's id, which the
 * drawing's own CSS reads, so the art stays server-built and never re-renders.
 */
function PinnedStory({
  steps,
  figure,
  className,
}: {
  steps: StoryStep[]
  figure: React.ReactNode
  className?: string
}) {
  const [active, setActive] = React.useState(0)
  const refs = React.useRef<(HTMLElement | null)[]>([])

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = refs.current.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActive(index)
        }
      },
      // A thin band across the middle of the viewport decides the step.
      { rootMargin: "-30% 0px -60% 0px" }
    )
    refs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={cn(
        "grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16",
        className
      )}
    >
      {/*
       * The figure pins in both layouts: beside the steps on desktop, and
       * across the top on a phone, where the steps scroll up under it.
       */}
      <div className="sticky top-16 z-10 order-first bg-background pb-2 lg:static lg:order-last lg:bg-transparent lg:pb-0">
        <div className="lg:sticky lg:top-[calc(50svh-min(36vw,340px))]">
          <div data-focus={steps[active]?.id}>{figure}</div>
        </div>
      </div>

      <ol className="flex flex-col">
        {steps.map((step, index) => (
          <li
            key={step.id}
            ref={(node) => {
              refs.current[index] = node
            }}
            className="flex min-h-[46svh] flex-col justify-center py-10 lg:min-h-[78svh]"
          >
            <motion.div
              animate={{ opacity: index === active ? 1 : 0.32 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-4"
            >
              <span className="flex items-center gap-3 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">
                <span className="tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-8 bg-border" />
                {step.label}
              </span>
              <h3 className="font-heading text-3xl leading-[1.1] tracking-tight text-foreground lg:text-[2.5rem]">
                {step.title}
              </h3>
              <p className="max-w-[44ch] text-base leading-[1.6] text-muted-foreground lg:text-lg">
                {step.body}
              </p>
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export { PinnedStory }
