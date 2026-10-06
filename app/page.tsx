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
    /*
     * One spacing rhythm: the gap is the only space between sections — the
     * sections carry no vertical padding of their own — so every visible gap
     * is the same 80px / 112px.
     */
    <div className="relative flex min-h-svh w-full flex-col gap-20 lg:gap-28">
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
