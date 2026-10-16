"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { DotMatrix } from "@/components/motion/dot-matrix"
import { bodyText, cardHeadingText } from "@/components/landing/section"
import type { Sector } from "@/content/home/content"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

/** Sector → existing token. No new colours: cyan / blue / foreground. */
const TONE: Record<Sector["tone"], string> = {
  cyan: "text-brand-cyan",
  blue: "text-brand-blue",
  neutral: "text-foreground",
}

const EASE = [0.16, 1, 0.3, 1] as const

/** Sector labels as squared-off badges — the client asked for rectangular tags over pills. */
function SectorTags({ tags, contrast }: { tags: string[]; contrast: boolean }) {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={contrast ? "contrast" : "default"}
          className="rounded-sm"
        >
          {tag}
        </Badge>
      ))}
    </div>
  )
}

function SectorCard({
  sector,
  index,
  count,
  hovered,
  onHover,
  coarse,
}: {
  sector: Sector
  index: number
  count: number
  hovered: number | null
  onHover: (i: number | null) => void
  coarse: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const active = hovered === index
  // Pointer devices resolve on hover; touch resolves as the card arrives.
  const resolved = coarse ? inView : active
  // Alternate plates are a step lighter, as the middle card is in Figma.
  const contrast = index % 2 === 1

  /*
   * Accordion, after the WorldQuant Foundry ethos row: explicit column widths
   * (at rest an even share; the hovered card grows to 1.35× that and the rest
   * split what is left — 45% / 27.5% for three cards), a 100ms delay so a
   * cursor sweeping past doesn't churn the row, and an ease that gathers
   * before it arrives rather than leaping. Nothing stacks — the hovered card
   * squeezes its neighbours, and every plate fills exactly its own column.
   */
  const rest = 100 / count
  const grown = rest * 1.35
  const width = `${hovered === null ? rest : active ? grown : (100 - grown) / (count - 1)}%`

  /*
   * Two layers on purpose. Chrome folds an element's own `clip-path` into its
   * IntersectionObserver ratio, so a plate clipped to 0% would never reach the
   * `amount` threshold. The outer flex item is what gets observed (unclipped);
   * the inner plate inherits the variant and does the wipe.
   */
  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
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
      style={{ "--card-w": width } as React.CSSProperties}
      className={cn(
        "group/card relative flex min-w-0 flex-col lg:w-(--card-w) lg:shrink-0",
        "transition-[width] delay-100 duration-500 ease-[cubic-bezier(.62,.16,.13,1.01)] motion-reduce:transition-none",
        TONE[sector.tone]
      )}
      data-sector={sector.id}
      data-last={index === count - 1 || undefined}
    >
      <motion.div
        variants={{
          hidden: { clipPath: "inset(0 0 100% 0 round 32px)" },
          show: {
            clipPath: "inset(0 0 0% 0 round 32px)",
            transition: { duration: 0.8, delay: index * 0.08, ease: EASE },
          },
        }}
        className={cn(
          "@container relative flex flex-1 flex-col justify-between gap-12 overflow-hidden rounded-4xl p-8",
          "lg:min-h-[min(772px,80svh)] lg:gap-0",
          contrast ? "bg-secondary" : "bg-popover"
        )}
      >
        <div className="w-[44%] max-w-[168px]">
          <DotMatrix src={sector.silhouette} resolved={resolved} />
        </div>

        <div className="relative flex flex-col">
          <div className="flex flex-col gap-6 text-foreground">
            {/*
             * The heading runs free of the copy measure and scales with the
             * card: in a resting column, "Organisations" is wider than a resting
             * column at the card scale. 14cqw fits the longest word.
             */}
            <h3
              className={cn(
                cardHeadingText,
                "whitespace-pre-line lg:text-[clamp(1.75rem,14cqw,3.25rem)]"
              )}
            >
              {sector.title}
            </h3>
            {/* One fixed measure for every card, so line lengths match across the row. */}
            <p className={cn(bodyText, "lg:max-w-[300px]")}>
              {sector.description}
            </p>
          </div>

          {/*
           * Labels arrive with the silhouette: hover on pointer devices, in view
           * on touch. They grow from zero height (grid rows 0fr → 1fr, which
           * animates) so the heading and copy are lifted as they come in,
           * rather than fading into space that was already held for them.
           */}
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] delay-100 duration-500 ease-[cubic-bezier(.62,.16,.13,1.01)] motion-reduce:transition-none lg:max-w-[300px]",
              resolved
                ? "[grid-template-rows:1fr] opacity-100"
                : "[grid-template-rows:0fr] opacity-0"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="pt-8">
                <SectorTags tags={sector.tags} contrast={contrast} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * The sector cards as one interactive row. Owns the hover state so a
 * card's growth and its siblings' shrink are one gesture.
 */
function SectorRow({ sectors }: { sectors: Sector[] }) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const coarse = useMediaQuery("(hover: none)")

  return (
    <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:gap-0">
      {sectors.map((sector, index) => (
        <SectorCard
          key={sector.id}
          sector={sector}
          index={index}
          count={sectors.length}
          hovered={hovered}
          onHover={setHovered}
          coarse={coarse}
        />
      ))}
    </div>
  )
}

export { SectorRow }
