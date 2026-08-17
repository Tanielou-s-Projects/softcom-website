import type { Metadata } from "next"

import {
  aboutHero,
  aboutLinks,
  aboutStats,
  principles,
} from "@/components/about/content"
import { LeadershipSection } from "@/components/about/leadership-section"
import { Story } from "@/components/about/story"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Container } from "@/components/landing/section"
import { LinkCards } from "@/components/site/link-cards"
import { PageHero } from "@/components/site/page-hero"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { StatBand } from "@/components/site/stat-band"
import { StepPanel } from "@/components/site/step-panel"

export const metadata: Metadata = {
  title: "About",
  description: aboutHero.lead,
}

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <PageHero {...aboutHero} />
      <Story />

      {/* The principles panel gets the page gutter the Solutions one inherits
          from its parent column. */}
      <Container className="py-6">
        <StepPanel
          eyebrow="How We Work"
          title="Four things we hold to."
          titleClassName="lg:max-w-[420px]"
          steps={principles}
        />
      </Container>

      <StatBand stats={aboutStats} />
      <LeadershipSection />
      <LinkCards cards={aboutLinks} />

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
