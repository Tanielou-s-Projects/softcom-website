import Link from "next/link"

import { Approach } from "@/components/landing/approach"
import { Capabilities } from "@/components/landing/capabilities"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Hero } from "@/components/landing/hero"
import { Insights } from "@/components/landing/insights"
import { Mission } from "@/components/landing/mission"
import { People } from "@/components/landing/people"
import { Sectors } from "@/components/landing/sectors"
import { Stats } from "@/components/landing/stats"
import { Bleed, ghostPill, primaryPill } from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"

export default function Page() {
  return (
    /*
     * One spacing rhythm: the gap is the only space between sections — the
     * sections carry no vertical padding of their own — so every visible gap
     * is the same 144px / 256px.
     */
    <div className="relative flex min-h-svh w-full flex-col gap-36 lg:gap-64">
      <BlueprintGrid />

      <Hero />
      <Mission />
      <Capabilities />
      <Sectors />
      {/*
       * No heading: the 19-year tile already says it. The sectors' call to
       * action moved here, so it lands after the proof rather than the pitch.
       */}
      <Stats>
        <Reveal className="flex flex-wrap items-center gap-2">
          <Button asChild size="lg" className={primaryPill}>
            <Link href="/contact">Explore working with Softcom</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className={ghostPill}>
            <Link href="/case-studies">View case studies</Link>
          </Button>
        </Reveal>
      </Stats>
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
