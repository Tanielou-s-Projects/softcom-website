import type { Metadata } from "next"

import { CaseStudiesHero } from "@/components/case-studies/case-studies-hero"
import { CaseStudyList } from "@/components/case-studies/case-study-list"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Bleed } from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "A portfolio of real engagements — spanning government, financial services, consumer goods, and agriculture — each delivering measurable, lasting outcomes.",
}

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <CaseStudiesHero />
      <CaseStudyList />

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
