"use client"

import * as React from "react"
import Link from "next/link"

import { gsap, prefersReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** The dither's data glyphs (lib/dither.ts), so the scramble reads as ours. */
const CHARS = "0x4BFf1010ACKSYNC"

/*
 * A link whose label scrambles through the dither's data glyphs and resolves
 * back to itself on hover (Daylight's footer links, ScrambleTextPlugin).
 */
export function ScrambleLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: string
}) {
  const label = React.useRef<HTMLSpanElement>(null)

  const scramble = () => {
    if (!label.current || prefersReducedMotion()) return
    gsap.to(label.current, {
      duration: 0.5,
      scrambleText: { text: children, chars: CHARS, speed: 0.6 },
      overwrite: true,
    })
  }

  return (
    // The visible text scrambles; the accessible name stays the label.
    <Link
      href={href}
      aria-label={children}
      onPointerEnter={scramble}
      className={cn(className)}
    >
      <span ref={label}>{children}</span>
    </Link>
  )
}
