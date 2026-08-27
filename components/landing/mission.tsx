"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import {
  Bleed,
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { cn } from "@/lib/utils"

const viewport = { once: true, amount: 0.3 } as const

/**
 * Two stacked full-bleed panels (Figma group 210:82): the blue mission
 * statement, then the same photograph as a darkened band. The second panel
 * plays a scroll sequence — the photo scales up to cover the blue, then the copy
 * fades in, then the accent dot pops in last.
 */
function Mission() {
  return (
    <Bleed className="flex flex-col gap-3 pt-6">
      {/* Panel one — mission statement on brand blue. */}
      <div className="dark relative flex flex-col items-center gap-12 overflow-clip rounded-4xl bg-brand-blue px-6 pt-20 pb-6 lg:h-[1024px] lg:gap-32 lg:pt-32">
        <h2
          className={cn(
            headingText,
            "max-w-[600px] text-center leading-[1.1] text-foreground"
          )}
        >
          We exist to create lasting impact.
        </h2>
        {/* Pinned, not semantic: this sits on brand blue in both themes. */}
        <p
          className={cn(leadText, "max-w-[684px] text-center text-neutral-200")}
        >
          Founded in Lagos in 2007, Softcom builds the systems that help
          organisations operate, grow, and better serve the people who depend on
          them. We believe stronger organisations are the foundation of a more
          prosperous society.
        </p>

        <div className="relative aspect-[701/506.668] w-full overflow-clip rounded-2xl lg:absolute lg:top-[58.01%] lg:left-[25.43%] lg:h-[49.48%] lg:w-[50.36%]">
          <Image
            src="/landing/story.png"
            alt="A Softcom team member reviewing printed reports"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-bottom"
          />
        </div>
      </div>

      {/* Panel two — the photograph scales up to cover the blue, then copy + dot. */}
      <div className="dark relative flex flex-col items-center justify-center gap-10 overflow-clip rounded-4xl bg-brand-blue px-6 py-20 lg:h-[1024px] lg:gap-16 lg:p-6">
        <motion.div
          aria-hidden
          initial={{ scale: 0.68 }}
          whileInView={{ scale: 1 }}
          viewport={viewport}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 overflow-clip rounded-4xl"
        >
          <Image
            src="/landing/story.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-bottom"
          />
          <div aria-hidden className="absolute inset-0 bg-black/64" />
        </motion.div>

        {/* Accent dot — pops in last. */}
        <motion.img
          src="/brand/accent-dot.svg"
          alt=""
          width={26}
          height={26}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewport}
          transition={{ type: "spring", stiffness: 520, damping: 15, delay: 1 }}
          className="relative size-[26px] shrink-0"
        />

        {/* Copy — fades in after the cover. */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            leadText,
            "relative max-w-[576px] text-center text-neutral-200"
          )}
        >
          For over two decades, we have partnered with governments, financial
          institutions, global development agencies, and growth-stage enterprises
          to build the platforms, data systems, and digital capabilities that
          drive their most important outcomes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <Button asChild size="lg" className={primaryPill}>
            <Link href="/about">Our Story</Link>
          </Button>
        </motion.div>
      </div>
    </Bleed>
  )
}

export { Mission }
