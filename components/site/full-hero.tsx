import * as React from "react"

import { Container } from "@/components/landing/section"
import { cn } from "@/lib/utils"

/**
 * The full-height page opening shared by the inner pages: a screen-filling
 * background (a photograph, a canvas) with the copy anchored to the bottom of
 * the content column, so the headline lines up with everything below it.
 *
 * Always dark, as the Alumni hero is — the background decides the mood, and a
 * light page would wash it out. Pair with `HeroHeader`, which floats the nav
 * pill over the top band instead of pushing the hero down.
 */
function FullHero({
  background,
  children,
  className,
}: {
  /** Fills the section; draw any legibility film inside it. */
  background: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "dark relative isolate flex h-svh min-h-[600px] flex-col justify-end overflow-hidden bg-black text-foreground",
        className
      )}
    >
      <div className="absolute inset-0 -z-10">{background}</div>
      <Container className="pb-10 lg:pb-16">{children}</Container>
    </section>
  )
}

export { FullHero }
