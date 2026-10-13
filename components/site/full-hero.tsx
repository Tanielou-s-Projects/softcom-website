import * as React from "react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Container, displayText, leadText } from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/**
 * The one opening every page after the landing page shares. The frame and the
 * anatomy are fixed so the pages read as a family; only the background and
 * what the rail holds change.
 *
 * - **Frame.** Full height, always dark, the nav pill floating over the top
 *   band (pair with `HeroHeader`).
 * - **Anatomy.** Bottom-left on the content column, in this order: page badge,
 *   headline, an optional one-line lead, an optional rail. The artwork has
 *   its own band above the copy (below it with `align="top"`), never behind.
 * - **Background.** Dither for the pages about what Softcom does (Solutions,
 *   Products, Insights); a photograph, under `HeroPhoto`'s standard film, for
 *   the pages about people and proof (About, Careers, Alumni, Case Studies).
 */
function FullHero({
  background,
  badge,
  title,
  lead,
  rail,
  align = "bottom",
  className,
}: {
  /** Fills the artwork's band. */
  background: React.ReactNode
  /** The page's name, as a brand badge. */
  badge: string
  title: string
  lead?: string
  /** A ruled row under the copy — wrap its items in `HeroRail`. */
  rail?: React.ReactNode
  /**
   * Where the copy sits. `top` puts it above the artwork, for a photo whose
   * subject fills the foot of the frame (a group shot). Pair it with
   * `HeroPhoto film="top"`.
   */
  align?: "bottom" | "top"
  className?: string
}) {
  const art = (
    // The artwork's own band: it takes whatever height the copy leaves, so
    // the text never sits on a photo or a dither mark, at any screen height.
    <div className="relative min-h-[45svh] flex-1 overflow-hidden">
      <div className="absolute inset-0">{background}</div>
    </div>
  )

  return (
    <section
      className={cn(
        "dark relative isolate flex min-h-svh flex-col bg-black text-foreground",
        className
      )}
    >
      {align === "bottom" ? art : null}
      <Container
        className={cn(
          "flex flex-col gap-10 lg:gap-14",
          align === "top" ? "pt-32 pb-10 lg:pt-36" : "pt-8 pb-10 lg:pb-16"
        )}
      >
        <Reveal className="flex flex-col items-start gap-6">
          <Badge variant="brand">{badge}</Badge>
          <h1 className={cn(displayText, "max-w-[20ch] text-foreground")}>
            {title}
          </h1>
          {lead ? (
            <p className={cn(leadText, "max-w-[60ch] text-foreground/80")}>
              {lead}
            </p>
          ) : null}
        </Reveal>
        {rail ? <Reveal delay={0.1}>{rail}</Reveal> : null}
      </Container>
      {align === "top" ? art : null}
      {/*
       * The blend into the page: black at the hero's foot easing to the
       * page's own background, so the next section doesn't start on a hard
       * edge. `--page-bg` resolves outside this `dark` scope (globals.css).
       */}
      <div
        aria-hidden
        className="h-24 shrink-0 bg-linear-to-b from-black to-(--page-bg) lg:h-40"
      />
    </section>
  )
}

/**
 * The rail: one ruled row, the same on every page whatever it holds — links,
 * numbers, names or buttons. `as` lets a row of links be a `nav`.
 */
function HeroRail({
  as: Tag = "div",
  label,
  className,
  children,
}: {
  as?: "div" | "nav" | "dl"
  label?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag
      aria-label={label}
      className={cn(
        "grid gap-x-8 gap-y-5 border-t border-white/20 pt-5 sm:auto-cols-fr sm:grid-flow-col",
        className
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * A hero photograph, filling the artwork's band. The film only softens the
 * edges: the top under the floating nav, and whichever edge meets the copy,
 * which fades to the hero's black so the band ends without a seam.
 */
function HeroPhoto({
  src,
  alt = "",
  position = "50% 50%",
  film = "bottom",
}: {
  src: string
  alt?: string
  /** CSS object-position, to keep the subject in the band. */
  position?: string
  /** Which edge meets the copy: the bottom (default) or, with `top`, both. */
  film?: "bottom" | "top"
}) {
  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 bg-linear-to-b to-transparent",
          film === "top" ? "h-1/4 from-black" : "h-1/4 from-black/50"
        )}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-black to-transparent"
      />
    </div>
  )
}

export { FullHero, HeroPhoto, HeroRail }
