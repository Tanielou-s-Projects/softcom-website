import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Container, displayText, leadText } from "@/components/landing/section"

/**
 * The opening plate: a badge, a claim, and a standfirst, centred on a
 * full-height card.
 *
 * Extracted from the Case Studies hero, which established the shape — the
 * About, Alumni and Careers pages all open the same way, and Figma leaves their
 * artboards empty, so this is the pattern they inherit rather than three
 * near-copies of one component.
 */
function PageHero({
  eyebrow,
  title,
  lead,
  titleClassName,
}: {
  eyebrow: string
  title: React.ReactNode
  lead: string
  /** For per-page measure — the design sets a different cap on each heading. */
  titleClassName?: string
}) {
  return (
    <Container className="pt-6">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-8 overflow-clip rounded-3xl bg-popover px-6 py-24",
          "lg:h-[976px] lg:gap-16"
        )}
      >
        <Badge variant="brand">{eyebrow}</Badge>

        <h1
          className={cn(
            displayText,
            "text-center text-popover-foreground",
            titleClassName ?? "max-w-[725px]"
          )}
        >
          {title}
        </h1>

        <p
          className={cn(
            leadText,
            "max-w-[848px] text-center leading-[1.6] text-popover-foreground"
          )}
        >
          {lead}
        </p>
      </div>
    </Container>
  )
}

export { PageHero }
