"use client"

import * as React from "react"
import { motion } from "motion/react"

import { SectorMark } from "@/components/landing/sector-mark"
import type { Sector } from "@/content/home/content"
import { cn } from "@/lib/utils"

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * The sector cards as one row: the rebuild's card (title and dot-matrix mark
 * up top, description and tags settled at the bottom) on main's plates —
 * edge to edge, alternating a step lighter so they read as overlapping.
 *
 * Each plate wipes up into view in turn. On wide screens the row is an
 * accordion, after the WorldQuant Foundry ethos row: the hovered card grows to
 * 1.35× its share and its neighbours split what is left, with a 100ms delay so
 * a cursor sweeping past doesn't churn the row. Flex-grow rather than widths,
 * so the cards never stack.
 */
function SectorRow({ sectors }: { sectors: Sector[] }) {
  const [hovered, setHovered] = React.useState<number | null>(null)

  return (
    <ul className="flex flex-col gap-2 lg:flex-row lg:gap-0">
      {sectors.map((sector, index) => {
        const grow = hovered === null ? 1 : hovered === index ? 1.35 : 0.825
        return (
          <motion.li
            key={sector.id}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: index * 0.08, ease: EASE },
              },
            }}
            style={{ "--grow": grow } as React.CSSProperties}
            className="flex min-w-0 motion-reduce:transition-none lg:flex-[var(--grow)_1_0%] lg:transition-[flex-grow] lg:delay-100 lg:duration-500 lg:ease-[cubic-bezier(.62,.16,.13,1.01)]"
          >
            {/*
             * Two layers on purpose: Chrome folds an element's own clip-path
             * into its IntersectionObserver ratio, so the observed item stays
             * unclipped and this inner plate does the wipe.
             */}
            <motion.div
              variants={{
                hidden: { clipPath: "inset(0 0 100% 0 round 24px)" },
                show: {
                  clipPath: "inset(0 0 0% 0 round 24px)",
                  transition: {
                    duration: 0.8,
                    delay: index * 0.08,
                    ease: EASE,
                  },
                },
              }}
              className={cn(
                "flex w-full flex-col rounded-3xl p-6 md:min-h-[26rem] md:p-8",
                index % 2 === 1 ? "bg-surface-raised" : "bg-surface"
              )}
            >
              <div className="flex items-start justify-between gap-6">
                <h3 className="text-title whitespace-pre-line text-ink">
                  {sector.title}
                </h3>
                <SectorMark
                  src={sector.silhouette}
                  tone={sector.tone}
                  className="w-20 shrink-0 md:w-24"
                />
              </div>
              <p className="mt-auto pt-10 text-body text-ink-soft md:pt-16">
                {sector.description}
              </p>
              <ul className="mt-6 flex flex-wrap gap-1.5">
                {sector.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 text-sm text-ink"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.li>
        )
      })}
    </ul>
  )
}

export { SectorRow }
