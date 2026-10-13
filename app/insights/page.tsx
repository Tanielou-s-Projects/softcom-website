import type { Metadata } from "next"

import { ClosingCta } from "@/components/landing/closing-cta"
import { HeroHeader } from "@/components/landing/hero-header"
import { Bleed } from "@/components/landing/section"
import { insightsPage } from "@/components/insights/page-copy"
import { InsightList } from "@/components/insights/insight-list"
import { InsightsHero } from "@/components/insights/insights-hero"
import { SiteFooter } from "@/components/site/site-footer"
import { getInsights } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"
import { BlueprintGrid } from "@/components/site/blueprint-grid"

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
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      <BlueprintGrid />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <InsightsHero copy={copy.hero} />
      <InsightList insights={insights} copy={copy} />

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Bleed className="mt-40 flex flex-col gap-2.5 py-6 lg:mt-64">
        <ClosingCta variant="build" />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
