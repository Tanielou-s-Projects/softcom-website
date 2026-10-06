import { Approach } from "@/components/landing/approach"
import { Capabilities } from "@/components/landing/capabilities"
import { TENURE_TITLE } from "@/components/landing/content"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Hero } from "@/components/landing/hero"
import { Insights } from "@/components/landing/insights"
import { Mission } from "@/components/landing/mission"
import { People } from "@/components/landing/people"
import { Sectors } from "@/components/landing/sectors"
import { Stats } from "@/components/landing/stats"
import { Bleed } from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-16 lg:gap-32">
      <BlueprintGrid />

      <Hero />
      <Mission />
      <Capabilities />
      <Sectors />
      <Stats heading={`${TENURE_TITLE} of delivery.`} />
      <Approach />
      <People />
      <Insights />

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Bleed className="flex flex-col gap-2.5 py-6">
        <ClosingCta />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
