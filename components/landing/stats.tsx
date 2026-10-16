import type { ReactNode } from "react"

import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { stats, type Stat } from "@/content/home/content"
import { withYears } from "@/content/home/page-copy"
import { Container } from "@/components/landing/section"
import { cn } from "@/lib/utils"

/**
 * Impact numbers — a clean row of big figures over short labels, after the
 * Employment Hero / Ramp pattern. Shared by the homepage and the About team
 * section; pass a `heading` when the block stands alone, omit it when the
 * numbers sit under another section's header. `children` sit beneath the row —
 * the homepage hangs its calls to action there.
 */
function Stats({
  heading,
  items = stats,
  className,
  children,
}: {
  heading?: string
  /** The numbers; `{years}` in a value becomes the years of operation. */
  items?: Stat[]
  className?: string
  children?: ReactNode
}) {
  return (
    <Container className={cn("flex flex-col gap-10 lg:gap-14", className)}>
      {heading ? (
        <Reveal asChild>
          <h2 className={cn("text-headline", "max-w-[18ch] text-ink")}>
            {heading}
          </h2>
        </Reveal>
      ) : null}

      <RevealStagger
        as="dl"
        amount={0.5}
        className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 sm:grid-cols-4 sm:gap-8"
      >
        {items.map((stat) => (
          <RevealItem key={stat.label} className="flex flex-col gap-2">
            <dd className="font-heading text-5xl leading-[0.9] font-light text-ink lg:text-7xl">
              {withYears(stat.value)}
            </dd>
            <dt className={cn("text-body", "text-ink-soft")}>{stat.label}</dt>
          </RevealItem>
        ))}
      </RevealStagger>

      {children}
    </Container>
  )
}

export { Stats }
