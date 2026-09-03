"use client"

import * as React from "react"
import { motion, useInView } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { DotMatrix } from "@/components/landing/dot-matrix"
import { bodyText, cardHeadingText } from "@/components/landing/section"
import type { Sector } from "@/components/landing/content"
import { useVariant } from "@/components/variants/variant-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

/** Sector → existing token. No new colours: cyan / blue / foreground. */
const TONE: Record<Sector["tone"], string> = {
  cyan: "text-brand-cyan",
  blue: "text-brand-blue",
  neutral: "text-foreground",
}

const EASE = [0.16, 1, 0.3, 1] as const

type TagsVariant = "pill" | "index" | "inline"

/**
 * Three treatments for the sector labels, chosen on the switcher. `pill` is
 * the shipped Badge; `index` and `inline` set them in mono caps so they read
 * as a spec sheet rather than a keyword cloud.
 */
function SectorTags({
  tags,
  variant,
  contrast,
}: {
  tags: string[]
  variant: TagsVariant
  contrast: boolean
}) {
  if (variant === "pill") {
    return (
      <div className="flex flex-wrap items-start gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant={contrast ? "contrast" : "default"}>
            {tag}
          </Badge>
        ))}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <p className="font-mono text-xs leading-6 tracking-wide text-muted-foreground uppercase">
        {tags.map((tag, i) => (
          <React.Fragment key={tag}>
            {i > 0 && <span className="mx-2 text-foreground/30">/</span>}
            {tag}
          </React.Fragment>
        ))}
      </p>
    )
  }

  return (
    <ol className="flex flex-col gap-1.5 font-mono text-xs leading-5 tracking-wide text-muted-foreground uppercase">
      {tags.map((tag, i) => (
        <li key={tag} className="flex gap-3">
          <span className="w-5 shrink-0 text-foreground/40 tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          {tag}
        </li>
      ))}
    </ol>
  )
}

function SectorCard({
  sector,
  index,
  count,
  hovered,
  onHover,
  coarse,
  tags,
}: {
  sector: Sector
  index: number
  count: number
  hovered: number | null
  onHover: (i: number | null) => void
  coarse: boolean
  tags: TagsVariant
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.45 })
  const active = hovered === index
  // Pointer devices resolve on hover; touch resolves as the card arrives.
  const resolved = coarse ? inView : active
  const contrast = index === 1

  /*
   * Accordion: the hovered card takes more of the row and its siblings give
   * it up; flex-grow is animatable so widths glide. Ratios keep the collapsed
   * inner width ≥ the copy's max-w, so paragraphs never reflow mid-transition.
   */
  const grow = hovered === null ? 3 : active ? 3.5 : 2.75

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
      style={{ flexGrow: grow }}
      className={cn(
        "group/card flex min-w-0 basis-0 flex-col",
        "transition-[flex-grow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
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
          "flex flex-1 flex-col justify-between gap-12 rounded-4xl p-8",
          "lg:min-h-[min(772px,80svh)] lg:gap-0",
          // The middle card is a step lighter, as in Figma.
          contrast ? "bg-secondary" : "bg-popover"
        )}
      >
        <div className="w-[44%] max-w-[168px]">
          <DotMatrix src={sector.silhouette} resolved={resolved} />
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 text-foreground">
            <h3 className={cn(cardHeadingText, "whitespace-pre-line")}>
              {sector.title}
            </h3>
            <p className={cn(bodyText, "max-w-[300px]")}>
              {sector.description}
            </p>
          </div>

          {/* Labels arrive with the silhouette: hover on pointer devices, in view on touch. */}
          <div
            className={cn(
              "transition-opacity duration-400 ease-out motion-reduce:transition-none",
              resolved ? "opacity-100" : "opacity-0"
            )}
          >
            <SectorTags tags={sector.tags} variant={tags} contrast={contrast} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * The three sector cards as one interactive row. Owns the hover state so a
 * card's growth and its siblings' shrink are one gesture, and reads the tag
 * treatment from the variant switcher.
 */
function SectorRow({ sectors }: { sectors: Sector[] }) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const coarse = useMediaQuery("(hover: none)")
  const tags = useVariant("tags")

  return (
    <div className="flex flex-col items-stretch gap-6 lg:flex-row">
      {sectors.map((sector, index) => (
        <SectorCard
          key={sector.id}
          sector={sector}
          index={index}
          count={sectors.length}
          hovered={hovered}
          onHover={setHovered}
          coarse={coarse}
          tags={tags}
        />
      ))}
    </div>
  )
}

export { SectorRow }
