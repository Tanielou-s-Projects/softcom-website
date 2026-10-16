"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useSpring } from "motion/react"

import { Arrow } from "@/components/ui/arrow"

/**
 * An article's body with its reading column: a sticky aside holding the way
 * back to the index, the reading time and a hairline that fills with accent as
 * the body is read (scroll-linked to the body itself). The body keeps a
 * reading measure rather than the full shell width.
 */
function ReadingProgress({
  backHref,
  backLabel,
  minutes,
  children,
}: {
  backHref: string
  backLabel: string
  minutes: number
  children: React.ReactNode
}) {
  const body = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: body,
    offset: ["start 40%", "end 60%"],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-6">
      <aside className="lg:col-span-3">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 label text-ink-soft transition-colors hover:text-ink"
          >
            <Arrow className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            {backLabel}
          </Link>
          <p className="label text-ink-faint">{minutes} min read</p>
          {/* The progress line: a track, and the read share of it in accent. */}
          <div
            aria-hidden
            className="relative hidden h-48 w-px bg-line lg:block"
          >
            <motion.span
              style={{ scaleY: fill }}
              className="absolute inset-0 origin-top bg-accent-ink"
            />
          </div>
        </div>
      </aside>
      <div
        ref={body}
        className="flex max-w-[64ch] min-w-0 flex-col gap-8 lg:col-span-8 lg:col-start-5"
      >
        {children}
      </div>
    </div>
  )
}

export { ReadingProgress }
