import { Reveal } from "@/components/motion/reveal"
import { ArrowLink } from "@/components/ui/button"
import { Crosshairs } from "@/components/ui/crosshairs"
import { SectionHeading } from "@/components/ui/section-heading"
import type { SolutionsPage } from "@/content/solutions/page-copy"
import { cn } from "@/lib/utils"

/* How far each phase sits below the one before it on wide screens. */
const STEP_DROP = ["md:mt-0", "md:mt-16", "md:mt-32", "md:mt-48"]

/*
 * How an initiative is delivered: four phases as a staircase. Each column
 * steps down from the last, so the sequence reads left to right and forward
 * in time; the accountability line closes it at the foot of the last step.
 */
export function DeliveryPhases({
  copy,
}: {
  copy: SolutionsPage["initiatives"]
}) {
  return (
    <section className="mt-32 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 md:mt-16">
        <SectionHeading label={copy.phasesBadge} heading={copy.phasesHeading} />
        <Reveal
          as="ol"
          stagger
          className="mt-12 grid gap-2 md:mt-20 md:grid-cols-4 md:items-start"
        >
          {copy.phases.map((phase, i) => (
            <li
              key={phase.step}
              className={cn(
                "flex flex-col rounded-xl bg-surface p-6 md:min-h-[22rem]",
                STEP_DROP[i % STEP_DROP.length]
              )}
            >
              <div className="flex items-center justify-between">
                <span className="label text-accent">{phase.step}</span>
                <span aria-hidden="true" className="flex gap-1">
                  {copy.phases.map((_, j) => (
                    <span
                      key={j}
                      className={cn(
                        "size-1.5 rounded-full",
                        j <= i ? "bg-accent" : "bg-line-strong"
                      )}
                    />
                  ))}
                </span>
              </div>
              <h3 className="mt-16 text-title md:mt-auto md:pt-16">
                {phase.title}
              </h3>
              <p className="mt-4 text-ink-soft">{phase.description}</p>
            </li>
          ))}
        </Reveal>
        <Reveal className="mt-12 grid gap-6 md:mt-16 md:grid-cols-12 md:gap-x-6">
          <p className="text-xl tracking-[-0.01em] text-balance md:col-span-6 md:col-start-7">
            {copy.closeText}
          </p>
          <ArrowLink
            href={copy.closeCtaHref}
            className="md:col-span-6 md:col-start-7"
          >
            {copy.closeCtaLabel}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  )
}
