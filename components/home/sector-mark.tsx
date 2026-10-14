"use client"

import * as React from "react"
import { useInView } from "motion/react"

import { DotMatrix } from "@/components/motion/dot-matrix"
import type { Sector } from "@/content/home/content"
import { cn } from "@/lib/utils"

const TONE: Record<Sector["tone"], string> = {
  cyan: "text-signal-deep dark:text-signal",
  blue: "text-accent-ink",
  neutral: "text-ink",
}

/*
 * A sector's dot-matrix mark. It resolves in the site's dither when the card
 * is well into view, and replays on hover.
 */
export function SectorMark({
  src,
  tone,
  className,
}: {
  src: string
  tone: Sector["tone"]
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.8 })
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn(TONE[tone], className)}
    >
      <DotMatrix src={src} resolved={inView || hovered} />
    </div>
  )
}
