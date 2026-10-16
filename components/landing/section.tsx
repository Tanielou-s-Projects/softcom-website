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
 * The design's pills sit on `--foreground`/`--background` rather than
 * `--primary`, which in this theme is a slightly dimmer grey. Pair with
 * `<Button size="lg">`, whose `h-10 px-4` already equals Figma's 16/8 padding
 * at 14px/24px type.
 */
export const primaryPill = "bg-ink text-paper hover:bg-ink/90"

/** The quieter sibling: transparent until hovered. */
export const ghostPill = "text-ink"

export { Bleed, Container }
