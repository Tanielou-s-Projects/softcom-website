import type { Metadata } from "next"

import { CaseStudiesHero } from "@/components/case-studies/case-studies-hero"
import { CaseStudyList } from "@/components/case-studies/case-study-list"
import { ClosingCta } from "@/components/landing/closing-cta"
import { HeroHeader } from "@/components/landing/hero-header"
import { Bleed } from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"
import { getCaseStudies } from "@/sanity/lib/data"

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "A portfolio of real engagements — spanning government, financial services, consumer goods, and agriculture — each delivering measurable, lasting outcomes.",
}

export default async function Page() {
  const caseStudies = await getCaseStudies()

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      <BlueprintGrid />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <CaseStudiesHero />
      <CaseStudyList caseStudies={caseStudies} />

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
