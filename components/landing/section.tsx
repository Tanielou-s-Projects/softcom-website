import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * The page's content column: the 1440px shell (globals.css), with 16px edges
 * on phones and 40px from md. Full-bleed moments (the hero, the capability
 * rail, the closing CTA + footer) use `Bleed` instead, which keeps the same
 * edges without the cap.
 */
function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("shell", className)} {...props} />
}

function Bleed({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("w-full px-4 md:px-10", className)} {...props} />
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
