import type { Metadata } from "next"

import { ClosingCta } from "@/components/landing/closing-cta"
import { HeroHeader } from "@/components/landing/hero-header"
import { Bleed } from "@/components/landing/section"
import { insightsIntro } from "@/components/insights/content"
import { InsightList } from "@/components/insights/insight-list"
import { InsightsHero } from "@/components/insights/insights-hero"
import { SiteFooter } from "@/components/site/site-footer"
import { getInsights } from "@/sanity/lib/data"
import { BlueprintGrid } from "@/components/site/blueprint-grid"

export const metadata: Metadata = {
  title: "Insights",
  description: insightsIntro,
}

export default async function Page() {
  const insights = await getInsights()

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      <BlueprintGrid />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <InsightsHero />
      <InsightList insights={insights} />

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
