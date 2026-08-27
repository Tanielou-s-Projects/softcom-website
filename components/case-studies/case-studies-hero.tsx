import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Container, displayText, leadText } from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"

/**
 * The page's opening statement, centred on its own plate.
 *
 * The same shape as the Solutions hero — one full-height card the copy sits in
 * the middle of — but stating the claim rather than drawing a mark.
 */
function CaseStudiesHero() {
  return (
    <Container className="pt-6">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-8 overflow-clip rounded-3xl bg-popover px-6 py-24",
          "lg:h-[976px] lg:gap-16"
        )}
      >
        <Reveal className="flex flex-col items-center gap-8 lg:gap-16">
          <Badge variant="brand">Case Studies</Badge>

          <h1
            className={cn(
              displayText,
              "max-w-[725px] text-center text-popover-foreground"
            )}
          >
            Real engagements. Measurable outcomes.
          </h1>

          <p
            className={cn(
              leadText,
              "max-w-[848px] text-center leading-[1.6] text-popover-foreground"
            )}
          >
            A portfolio of real engagements — spanning government, financial
            services, consumer goods, and agriculture — each delivering
            measurable, lasting outcomes.
          </p>
        </Reveal>
      </div>
    </Container>
  )
}

export { CaseStudiesHero }
