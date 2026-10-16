import Link from "next/link"

import { DitherMark } from "@/components/motion/dither-mark"
import { FullHero, HeroRail } from "@/components/site/full-hero"
import { solutions } from "@/content/solutions/content"
import type { SolutionsPage } from "@/content/solutions/page-copy"

/** The three areas' titles, as the page's copy names them. */
const AREA_TITLES = (copy: SolutionsPage) => [
  copy.infrastructure.title,
  copy.intelligence.title,
  copy.initiatives.title,
]

/**
 * The conduit mark in dither, the claim, and the three solution areas —
 * numbered, as the client asked — as links down to their sections.
 */
function SolutionsHero({ copy }: { copy: SolutionsPage }) {
  return (
    <FullHero
      background={<DitherMark layout="conduit" />}
      badge={copy.hero.badge}
      title={copy.hero.title}
      rail={
        <HeroRail as="nav" label="Solution areas">
          {solutions.map((solution, index) => (
            <Link
              key={solution.id}
              href={`#${solution.id}`}
              className="group flex items-baseline gap-4 text-ink"
            >
              <span className="font-mono text-sm text-ink-soft tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-xl leading-tight transition-colors group-hover:text-signal lg:text-2xl">
                {AREA_TITLES(copy)[index] ?? solution.title}
              </span>
            </Link>
          ))}
        </HeroRail>
      }
    />
  )
}

export { SolutionsHero }
