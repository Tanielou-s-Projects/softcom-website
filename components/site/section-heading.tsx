import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/*
 * A section's opening, as in the rebuild: an optional label over the headline
 * across seven columns, and the intro (plus any calls to action) in the last
 * four on wide screens, its foot on the headline's baseline. The content that
 * follows sits `gap-section-head` below.
 */
function SectionHeading({
  label,
  heading,
  intro,
  children,
  className,
  introClassName,
}: {
  label?: string
  heading: string
  intro?: string
  /** Under the intro: buttons, links, a count. */
  children?: React.ReactNode
  className?: string
  introClassName?: string
}) {
  return (
    <div className={cn("grid-12 gap-y-6 md:items-end", className)}>
      <div className="md:col-span-7">
        {label && (
          <Reveal>
            <p className="mb-5 label text-ink-soft">{label}</p>
          </Reveal>
        )}
        <LineReveal as="h2" className="text-headline text-balance text-ink">
          {heading}
        </LineReveal>
      </div>
      {(intro || children) && (
        <Reveal
          className={cn(
            "flex max-w-md flex-col items-start gap-6 md:col-span-4 md:col-start-9",
            introClassName
          )}
        >
          {intro && <p className={cn("text-body", "text-ink-soft")}>{intro}</p>}
          {children}
        </Reveal>
      )}
    </div>
  )
}

export { SectionHeading }
