import { Crosshairs } from "@/components/ui/crosshairs"
import { cn } from "@/lib/utils"

/**
 * One section of a page. Pages stack these in a `gap-section` column, so the
 * space between sections is set once, there, rather than by each section.
 * The crosshairs mark where a section starts; leave them off for a section
 * that continues the one before it.
 */
function Section({
  marks = true,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { marks?: boolean }) {
  return (
    <section
      className={cn("flex scroll-mt-24 flex-col gap-10 md:gap-16", className)}
      {...props}
    >
      {marks && <Crosshairs />}
      {children}
    </section>
  )
}

export { Section }
