"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { portraits, type Portrait } from "@/components/landing/content"
import { Stats } from "@/components/landing/stats"
import { cn } from "@/lib/utils"

/** A portrait; the brand-blue name plate springs up from the bottom on hover. */
function PortraitCell({ image, name, role }: Portrait) {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="relative flex aspect-[335/471] flex-col justify-end overflow-clip rounded-2xl bg-neutral-900"
    >
      <Image
        src={image}
        alt={name ? `${name}, ${role}` : ""}
        fill
        sizes="(min-width: 1024px) 420px, 50vw"
        className="object-cover object-center"
      />
      {name ? (
        <motion.div
          variants={{ rest: { y: "110%" }, hover: { y: 0 } }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 40,
            mass: 0.8,
          }}
          className="dark relative flex w-full flex-col gap-1 rounded-md bg-brand-blue p-3"
        >
          <p className="font-heading text-xl leading-none font-bold text-foreground">
            {name}
          </p>
          <p className="font-heading text-lg leading-[1.6] text-brand-cyan">
            {role}
          </p>
        </motion.div>
      ) : null}
    </motion.div>
  )
}

/**
 * The team section — leadership portraits with a blue name plate that springs up
 * on hover, kept visually separate from the impact numbers below. `id="team"` is
 * the anchor the header's "Leadership" link and the closing CTAs point at.
 */
function Team() {
  return (
    <section id="team" className="flex scroll-mt-24 flex-col gap-16">
      <Container className="flex flex-col gap-10 overflow-clip py-6 lg:gap-16">
        <header className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-[15%]">
          <h2 className={cn(headingText, "text-foreground lg:w-[50%]")}>
            Built by people who&apos;ve done this before.
          </h2>
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-4">
            <p className={cn(bodyText, "text-foreground")}>
              Eighteen years of enterprise delivery, led by a team that&apos;s
              shipped technology at national scale.
            </p>
            <Button asChild size="lg" className={primaryPill}>
              <Link href="/careers">Join the team</Link>
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-[1029px] lg:grid-cols-3">
          {portraits.map((portrait) => (
            <PortraitCell key={portrait.image} {...portrait} />
          ))}
        </div>
      </Container>

      {/* Impact numbers — separated from the portraits. */}
      <Stats />
    </section>
  )
}

export { Team }
