import { ButtonLink } from "@/components/ui/button"
import { SectionHeading } from "@/components/site/section-heading"
import { Container } from "@/components/landing/section"
import type { HomePage } from "@/content/home/page-copy"
import type { Insight } from "@/content/insights/content"
import { InsightCard } from "@/components/insights/insight-card"
import { RevealItem, RevealStagger } from "@/components/motion/reveal"

/** "Our thinking" — the homepage's window onto Insights. */
function Insights({
  copy,
  insights,
}: {
  copy: HomePage["ourThinking"]
  insights: Insight[]
}) {
  return (
    <Container className="flex flex-col gap-section-head overflow-clip">
      <SectionHeading heading={copy.heading} intro={copy.intro}>
        <ButtonLink href={copy.cta.href} tone="ink">
          {copy.cta.label}
        </ButtonLink>
      </SectionHeading>

      {/*
       * The Insights page's own cards, in its order (featured first, then
       * newest), so what is published in the Studio shows in both places.
       */}
      {insights.length > 0 ? (
        <RevealStagger className="grid gap-gutter lg:grid-cols-2">
          {insights.map((insight) => (
            <RevealItem key={insight.id}>
              <InsightCard
                insight={insight}
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </RevealItem>
          ))}
        </RevealStagger>
      ) : null}
    </Container>
  )
}

export { Insights }
