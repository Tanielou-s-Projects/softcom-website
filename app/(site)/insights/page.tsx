import type { Metadata } from "next"

import { ClosingCta } from "@/components/landing/closing-cta"
import { HeroHeader } from "@/components/landing/hero-header"
import { insightsPage } from "@/content/insights/page-copy"
import { InsightList } from "@/components/insights/insight-list"
import { InsightsHero } from "@/components/insights/insights-hero"
import { PageEnd } from "@/components/site/page-end"
import { Section } from "@/components/site/section"
import { getInsights } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("insightsPage", insightsPage)
  return { title: "Insights", description: copy.intro.text }
}

export default async function Page() {
  const [insights, copy] = await Promise.all([
    getInsights(),
    getPageContent("insightsPage", insightsPage),
  ])

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-section">
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <InsightsHero copy={copy.hero} />
      <Section>
        <InsightList insights={insights} copy={copy} />
      </Section>

      <PageEnd>
        <ClosingCta variant="build" />
      </PageEnd>
    </div>
  )
}
