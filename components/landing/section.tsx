import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The page's content column — v7-style: a centred `max-w` column with a flat
 * 24px gutter, so content holds a comfortable measure and gains generous side
 * margins on wide screens rather than stretching edge to edge.
 *
 * The signature full-bleed moments (the hero, the Mission plates, the capability
 * rail, the closing CTA + footer) opt out with `Bleed` instead. Per-block
 * `max-w-*` values still hold line lengths inside the column.
 */
function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1336px] px-6", className)}
      {...props}
    />
  )
}

/**
 * Full-bleed sibling of `Container`: the same 24px gutter, no `max-w` cap. For
 * the statement panels that are meant to run the full width of the viewport.
 */
function Bleed({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("w-full px-6", className)} {...props} />
}

/**
 * The design's shared type scale. Kept as constants so the upcoming token pass
 * has one place to change, and so sizes can't drift between sections.
 */

/** 64px display, hero only. Figma tracking -0.768px at 64px = -0.012em. */
export const displayText =
  "font-heading text-[2.75rem] leading-none tracking-[-0.012em] sm:text-5xl lg:text-[4rem]"

/** 52px section headings. */
export const headingText =
  "font-heading text-3xl leading-[1.026] tracking-tight sm:text-4xl lg:text-[3.25rem]"

/** 52px card headings, which use the tighter 1.1 leading. */
export const cardHeadingText =
  "font-heading text-3xl leading-[1.1] tracking-tight sm:text-4xl lg:text-[3.25rem]"

/** 32px panel headings — the Contact cards, which sit below the card scale. */
export const panelHeadingText =
  "font-heading text-2xl leading-[1.026] lg:text-[2rem]"

/** 20px lead paragraphs. */
export const leadText = "text-base leading-[1.2] sm:text-lg lg:text-xl"

/** 18px body copy. */
export const bodyText = "text-base leading-[1.6] lg:text-lg"

/**
 * The design's pills sit on `--foreground`/`--background` rather than
 * `--primary`, which in this theme is a slightly dimmer grey. Pair with
 * `<Button size="lg">`, whose `h-10 px-4` already equals Figma's 16/8 padding
 * at 14px/24px type.
 */
export const primaryPill =
  "bg-foreground text-background hover:bg-foreground/90"

/** The quieter sibling: transparent until hovered. */
export const ghostPill = "text-foreground"

export { Bleed, Container }
