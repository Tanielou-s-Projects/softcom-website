import type { Metadata } from "next"

import { ClosingCta } from "@/components/landing/closing-cta"
import { Bleed } from "@/components/landing/section"
import { insightsIntro } from "@/components/insights/content"
import { InsightList } from "@/components/insights/insight-list"
import { InsightsHero } from "@/components/insights/insights-hero"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Insights",
  description: insightsIntro,
}

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      <BlueprintGrid />
      <SiteHeader />

      <InsightsHero />
      <InsightList />

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Bleed className="flex flex-col gap-2.5 py-6">
        <ClosingCta variant="build" />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
