import Link from "next/link"

import { DitherMark } from "@/components/motion/dither-mark"
import { FullHero, HeroRail } from "@/components/site/full-hero"
import { solutions } from "@/components/solutions/content"

/**
 * The conduit mark in dither, the claim, and the three solution areas —
 * numbered, as the client asked — as links down to their sections.
 */
function SolutionsHero() {
  return (
    <FullHero
      background={<DitherMark layout="conduit" />}
      badge="Solutions"
      title="Technology and expertise for your most important work."
      rail={
        <HeroRail as="nav" label="Solution areas">
          {solutions.map((solution, index) => (
            <Link
              key={solution.id}
              href={`#${solution.id}`}
              className="group flex items-baseline gap-4 text-foreground"
            >
              <span className="font-mono text-sm text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-xl leading-tight transition-colors group-hover:text-brand-cyan lg:text-2xl">
                {solution.title}
              </span>
            </Link>
          ))}
        </HeroRail>
      }
    />
  )
}

export { SolutionsHero }
