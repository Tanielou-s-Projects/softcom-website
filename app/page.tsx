import { Capabilities } from "@/components/landing/capabilities"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Hero } from "@/components/landing/hero"
import { Insights } from "@/components/landing/insights"
import { Mission } from "@/components/landing/mission"
import { Sectors } from "@/components/landing/sectors"
import { SubHero } from "@/components/landing/sub-hero"
import { Team } from "@/components/landing/team"
import { Container } from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-16 bg-background lg:gap-32">
      <SiteHeader />

      <Hero />
      <SubHero />
      <Mission />
      <Sectors />
      <Capabilities />
      <Team />
      <Insights />

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Container className="flex flex-col gap-2.5 py-6">
        <ClosingCta />
        <SiteFooter />
      </Container>
    </div>
  )
}
