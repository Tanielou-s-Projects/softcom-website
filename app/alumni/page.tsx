import type { Metadata } from "next"

import {
  alumniHero,
  alumniIntro,
  alumniInvite,
  takeaways,
} from "@/components/alumni/content"
import { SpotlightGrid } from "@/components/alumni/spotlight-grid"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Container } from "@/components/landing/section"
import { InvitePanel } from "@/components/site/invite-panel"
import { PageHero } from "@/components/site/page-hero"
import { PageIntro } from "@/components/site/page-intro"
import { PointCards } from "@/components/site/point-cards"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Alumni",
  description: alumniHero.lead,
}

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <PageHero {...alumniHero} />
      <PageIntro>{alumniIntro}</PageIntro>

      <PointCards {...takeaways} />
      <SpotlightGrid />
      <InvitePanel {...alumniInvite} />

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
