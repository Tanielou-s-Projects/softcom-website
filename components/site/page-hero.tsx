import {
  DitherMark,
  type DitherMarkLayout,
} from "@/components/motion/dither-mark"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"
import { Crosshairs } from "@/components/ui/crosshairs"
import { cn } from "@/lib/utils"

/*
 * Every subpage opens the same way: an optional dither mark resolving in the
 * top of the stage, then the page's label, its headline rising line by line,
 * and the intro beside it — on the shell's grid, with crosshairs closing the
 * hero off from the page.
 */
export function PageHero({
  label,
  heading,
  intro,
  mark,
  children,
  className,
}: {
  label: string
  heading: string
  intro?: string
  /** The page's dither mark, drawn above the copy. */
  mark?: DitherMarkLayout
  /** Extra content under the intro (buttons, meta). */
  children?: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("relative pt-32 md:pt-44", className)}>
      {mark && (
        <div
          aria-hidden="true"
          className="shell h-[38svh] min-h-64 md:h-[46svh]"
        >
          <DitherMark layout={mark} />
        </div>
      )}
      <div
        data-hero-copy
        className="shell grid gap-8 md:grid-cols-12 md:gap-x-6"
      >
        <div className="md:col-span-8">
          <Reveal immediate>
            <p className="label text-ink-soft">{label}</p>
          </Reveal>
          <LineReveal
            as="h1"
            immediate
            delay={0.15}
            className="mt-6 text-display font-light text-balance"
          >
            {heading}
          </LineReveal>
        </div>
        {(intro || children) && (
          <Reveal delay={0.4} className="self-end md:col-span-4 md:col-start-9">
            {intro && <p className="text-lg text-ink-soft">{intro}</p>}
            {children}
          </Reveal>
        )}
      </div>
      <Crosshairs className="mt-20 md:mt-28" />
    </section>
  )
}
