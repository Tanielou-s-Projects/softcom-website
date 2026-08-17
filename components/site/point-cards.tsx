import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { bodyText, Container, headingText } from "@/components/landing/section"

export type Point = { title: string; description: string }

/**
 * A row of unnumbered points on popover plates — the quieter sibling of
 * `StepPanel`, for sets where the order carries no meaning.
 *
 * The dot alternates cyan then blue across the row, derived from position the
 * way the Solutions feature rows do it, so it cannot drift out of step with the
 * data.
 */
function PointCards({
  eyebrow,
  heading,
  points,
}: {
  eyebrow: string
  heading: string
  points: Point[]
}) {
  return (
    <Container className="flex flex-col gap-10 py-6 lg:gap-16">
      <header className="flex flex-col items-start gap-6">
        <Badge variant="brand">{eyebrow}</Badge>
        <h2 className={cn(headingText, "max-w-[664px] text-foreground")}>
          {heading}
        </h2>
      </header>

      <div className="grid gap-3 lg:grid-cols-3">
        {points.map((point, index) => (
          <div
            key={point.title}
            className="flex flex-col gap-6 overflow-clip rounded-3xl bg-popover p-8 lg:h-[320px] lg:p-10"
          >
            <span
              aria-hidden
              className={cn(
                "size-3 shrink-0 rounded-full",
                index % 2 === 0 ? "bg-brand-cyan" : "bg-brand-blue"
              )}
            />
            <div className="flex flex-1 flex-col justify-end gap-3">
              <h3 className="font-heading text-2xl leading-none font-medium text-popover-foreground">
                {point.title}
              </h3>
              <p className={cn(bodyText, "text-muted-foreground")}>
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export { PointCards }
