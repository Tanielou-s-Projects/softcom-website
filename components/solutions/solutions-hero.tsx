import Link from "next/link"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"
import { ConduitField } from "@/components/motion/conduit-field"
import { Reveal } from "@/components/motion/reveal"
import { FullHero } from "@/components/site/full-hero"
import { solutions } from "@/components/solutions/content"

/**
 * The page's opening: the conduit mark in dither filling the screen, the claim
 * beneath it, and the three solution areas — numbered, as the client asked —
 * as links down to their sections.
 *
 * Replaces the plate with two placeholder discs (Figma's default grey) that
 * stood in for this mark.
 */
function SolutionsHero() {
  return (
    <FullHero background={<ConduitField />}>
      <div className="flex flex-col gap-10 lg:gap-14">
        <Reveal asChild>
          <h1 className={cn(displayText, "max-w-[16ch] text-foreground")}>
            Technology and expertise for your most important work.
          </h1>
        </Reveal>

        <Reveal asChild delay={0.1}>
          <nav aria-label="Solution areas">
            <ol className="grid gap-px border-t border-border sm:grid-cols-3">
              {solutions.map((solution, index) => (
                <li key={solution.id}>
                  <Link
                    href={`#${solution.id}`}
                    className="group flex items-baseline gap-4 pt-5 text-foreground"
                  >
                    <span className="font-mono text-sm text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-heading text-xl leading-tight transition-colors group-hover:text-brand-cyan lg:text-2xl">
                      {solution.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>
      </div>
    </FullHero>
  )
}

export { SolutionsHero }
