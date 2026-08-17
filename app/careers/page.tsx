import type { Metadata } from "next"

import {
  careersHero,
  careersIntro,
  hiringProcess,
  whySoftcom,
} from "@/components/careers/content"
import { OpenRoles } from "@/components/careers/open-roles"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Container } from "@/components/landing/section"
import { PageHero } from "@/components/site/page-hero"
import { PageIntro } from "@/components/site/page-intro"
import { PointCards } from "@/components/site/point-cards"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { StepPanel } from "@/components/site/step-panel"

export const metadata: Metadata = {
  title: "Careers",
  description: careersHero.lead,
}

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <PageHero {...careersHero} />
      <PageIntro>{careersIntro}</PageIntro>

      <PointCards {...whySoftcom} />

      <Container className="py-6">
        <StepPanel
          eyebrow="Process"
          title="How we hire."
          titleClassName="lg:max-w-[420px]"
          steps={hiringProcess}
        />
      </Container>

      <OpenRoles />

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
