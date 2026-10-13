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
 *   headline, an optional one-line lead, an optional rail.
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
  className,
}: {
  /** Fills the section. */
  background: React.ReactNode
  /** The page's name, as a brand badge. */
  badge: string
  title: string
  lead?: string
  /** A ruled row under the copy — wrap its items in `HeroRail`. */
  rail?: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        "dark relative isolate flex h-svh min-h-[640px] flex-col justify-end overflow-hidden bg-black text-foreground",
        className
      )}
    >
      <div className="absolute inset-0 -z-10">{background}</div>
      <Container className="flex flex-col gap-10 pb-10 lg:gap-14 lg:pb-16">
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
 * A hero photograph under the standard film: light at the top so the picture
 * reads, deepening behind the copy at the bottom and toward the left, where
 * the copy sits. One film for every photo hero, so the type always lands the
 * same way.
 */
function HeroPhoto({
  src,
  alt = "",
  position = "50% 50%",
  raised = false,
}: {
  src: string
  alt?: string
  /** CSS object-position, to keep faces clear of the copy. */
  position?: string
  /**
   * For a photo whose subject stands at the bottom of the frame (a group
   * shot): the picture fills only the upper part of the hero and fades out
   * above the copy, so the copy never sits on faces.
   */
  raised?: boolean
}) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-0",
        raised ? "bottom-[50%] lg:bottom-[40%]" : "bottom-0"
      )}
    >
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
          "absolute inset-0 bg-linear-to-b",
          raised
            ? "from-black/20 via-transparent via-70% to-black"
            : "from-black/20 via-black/40 to-black/90"
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent"
      />
    </div>
  )
}

export { FullHero, HeroPhoto, HeroRail }
