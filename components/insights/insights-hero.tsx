import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Container, displayText } from "@/components/landing/section"

/**
 * The page's opening statement.
 *
 * Unlike the Solutions and Case Studies heroes this one sits straight on the
 * page background rather than on a plate — the design gives it 128px of top
 * space and nothing else, so the list below reads as one continuous column.
 */
function InsightsHero() {
  return (
    <Container className="flex flex-col items-center gap-16 pt-8">
      <Badge variant="brand">News &amp; Insights</Badge>

      {/*
       * 620px rather than Figma's 631px: at 631 the browser's metrics fit the
       * ampersand onto the first line, where the design breaks before it. This
       * is the widest cap that still lands the design's three lines —
       * "Research, analysis, / & perspectives from / the field."
       *
       * Deliberately no `text-balance`, which would even out that short last
       * line.
       */}
      <h1
        className={cn(displayText, "max-w-[620px] text-center text-foreground")}
      >
        Research, analysis, &amp; perspectives from the field.
      </h1>
    </Container>
  )
}

export { InsightsHero }
