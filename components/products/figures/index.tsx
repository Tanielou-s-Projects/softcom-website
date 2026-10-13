import * as React from "react"
import Image from "next/image"

import { PLAYGROUND_ENABLED } from "@/lib/playground-access"
import type { ProductFigure } from "@/components/products/pages"
import { DiagramFrame } from "@/components/products/diagrams/frame"
import type { FigureMap } from "@/components/products/figures/types"
import { LIFT_FIGURES } from "@/components/products/figures/lift"
import { LIQUIO_FIGURES } from "@/components/products/figures/liquio"
import { RECKON_FIGURES } from "@/components/products/figures/reckon"
import { RTGS_FIGURES } from "@/components/products/figures/rtgs-global"
import { SENTINEL_FIGURES } from "@/components/products/figures/sentinel"
import { USEFORMS_FIGURES } from "@/components/products/figures/useforms"

/**
 * The line figures that stand in for the copy deck's diagrams, by product
 * slug, then by the figure's `key` in `pages.ts`. Each takes its figure number
 * so the plates count up down the page.
 */
const FIGURES: Record<string, FigureMap> = {
  sentinel: SENTINEL_FIGURES,
  reckon: RECKON_FIGURES,
  useforms: USEFORMS_FIGURES,
  lift: LIFT_FIGURES,
  liquio: LIQUIO_FIGURES,
  "rtgs-global": RTGS_FIGURES,
}

/**
 * One figure, numbered. A figure that isn't drawn yet renders nothing in
 * production, and a dashed placeholder naming it in development, so the page
 * shows where each one will land.
 */
function ProductFigureSlot({
  slug,
  figure,
  number,
}: {
  slug: string
  figure: ProductFigure
  number: number
}) {
  const fig = `Fig ${String(number).padStart(2, "0")}`
  const Figure = FIGURES[slug]?.[figure.key]

  if (figure.image) {
    // A screenshot from the deck, as-is, in the diagrams' frame.
    return (
      <DiagramFrame
        eyebrow={`${NAMES[slug] ?? slug} / ${String(number).padStart(2, "0")}`}
        title={figure.title}
        subtitle={figure.caption}
        footnote="Product screen · Illustrative data"
      >
        <div className="mx-auto max-w-[800px] overflow-clip rounded-2xl ring-1 ring-foreground/10">
          <Image
            src={figure.image.src}
            width={figure.image.width}
            height={figure.image.height}
            alt={`${figure.title} ${figure.caption ?? ""}`.trim()}
            className="block h-auto w-full"
          />
        </div>
      </DiagramFrame>
    )
  }
  if (Figure) return <Figure fig={fig} />
  if (!PLAYGROUND_ENABLED) return null

  return (
    <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-border p-6 text-center">
      <span className="font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase">
        {fig} · to draw · {figure.key}
      </span>
      <span className="font-heading text-xl text-foreground">
        {figure.title}
      </span>
      {figure.caption ? (
        <span className="max-w-[52ch] text-sm text-muted-foreground">
          {figure.caption}
        </span>
      ) : null}
    </div>
  )
}

/** The product names the deck's eyebrows use. */
const NAMES: Record<string, string> = {
  sentinel: "Sentinel",
  reckon: "Reckon",
  useforms: "Useforms",
  lift: "LIFT",
  liquio: "Liquio",
  "rtgs-global": "RTGS.global",
}

/** Whether a figure will render at all, so its section can skip the slot. */
function hasFigure(slug: string, figure: ProductFigure) {
  return (
    PLAYGROUND_ENABLED ||
    Boolean(figure.image) ||
    Boolean(FIGURES[slug]?.[figure.key])
  )
}

export { ProductFigureSlot, hasFigure }
