import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/landing/section"
import type { HomePage } from "@/content/home/page-copy"
import type { Insight } from "@/content/insights/content"
import { InsightCard } from "@/components/insights/insight-card"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/** "Our thinking" — the homepage's window onto Insights. */
function Insights({
  copy,
  insights,
}: {
  copy: HomePage["ourThinking"]
  insights: Insight[]
}) {
  return (
    <Container className="flex flex-col gap-10 overflow-clip lg:gap-16">
      <Reveal asChild>
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 className={cn("text-headline", "text-ink")}>{copy.heading}</h2>
            <p className={cn("text-body", "max-w-[576px] text-ink-soft")}>
              {copy.intro}
            </p>
          </div>
          <ButtonLink href={copy.cta.href} tone="ink">
            {copy.cta.label}
          </ButtonLink>
        </header>
      </Reveal>

      {/*
       * The Insights page's own cards, in its order (featured first, then
       * newest), so what is published in the Studio shows in both places.
       */}
      {insights.length > 0 ? (
        <RevealStagger className="grid gap-4 lg:grid-cols-2">
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
