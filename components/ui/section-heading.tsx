import { cn } from "@/lib/utils"

/*
 * A section's opening: a mono label above a light headline, with an optional
 * intro set to the right on wide screens.
 */
export function SectionHeading({
  label,
  heading,
  intro,
  className,
}: {
  label?: string
  heading: string
  intro?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid gap-6 md:grid-cols-12 md:items-end md:gap-x-6",
        className
      )}
    >
      <div className="md:col-span-7">
        {label && <p className="label mb-5 text-ink-soft">{label}</p>}
        <h2 className="text-headline font-normal text-balance">{heading}</h2>
      </div>
      {intro && (
        <p className="max-w-md text-ink-soft md:col-span-4 md:col-start-9">
          {intro}
        </p>
      )}
    </div>
  )
}
