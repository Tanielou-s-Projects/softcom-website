import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { cardHeadingText } from "@/components/landing/section"

export type Step = {
  /** The design prints these as zero-padded ordinals: "01", "02". */
  step: string
  title: string
  description: string
}

/**
 * A numbered sequence on a brand-blue plate.
 *
 * Extracted from the Solutions page's "How We Deliver", which established the
 * shape. About's principles and the Careers hiring process are the same idea
 * with different copy, so they share the component rather than the classes
 * being retyped three times.
 *
 * Scoped `dark` because the plate is brand blue in either theme.
 */
function StepPanel({
  eyebrow,
  title,
  steps,
  titleClassName,
  className,
}: {
  eyebrow: string
  title: string
  steps: Step[]
  /** Per-use measure — each panel's heading wraps at its own width. */
  titleClassName?: string
  className?: string
}) {
  return (
    <section
      className={cn(
        "dark flex flex-col gap-8 overflow-clip rounded-3xl bg-brand-blue p-8 lg:gap-12 lg:p-12",
        className
      )}
    >
      <header className="flex flex-col items-start justify-center gap-3">
        <Badge variant="inverse">{eyebrow}</Badge>
        <h2 className={cn(cardHeadingText, "text-foreground", titleClassName)}>
          {title}
        </h2>
      </header>

      <ol className="grid gap-8 sm:grid-cols-2 sm:gap-x-11">
        {steps.map((step) => (
          <li key={step.step} className="flex items-start gap-6">
            <span className="font-heading text-5xl leading-none font-medium text-foreground">
              {step.step}
            </span>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 text-lg leading-none text-foreground">
              <h3 className="font-bold">{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export { StepPanel }
