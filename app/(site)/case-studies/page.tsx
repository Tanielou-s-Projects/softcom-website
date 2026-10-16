import type { Metadata } from "next"

import { CaseStudiesHero } from "@/components/case-studies/case-studies-hero"
import { CaseStudyList } from "@/components/case-studies/case-study-list"
import { ClosingCta } from "@/components/landing/closing-cta"
import { HeroHeader } from "@/components/landing/hero-header"
import { PageEnd } from "@/components/site/page-end"
import { caseStudiesPage } from "@/content/case-studies/page-copy"
import { getCaseStudies } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("caseStudiesPage", caseStudiesPage)
  return { title: "Case Studies", description: copy.meta.description }
}

export default async function Page() {
  const [caseStudies, copy] = await Promise.all([
    getCaseStudies(),
    getPageContent("caseStudiesPage", caseStudiesPage),
  ])

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <CaseStudiesHero copy={copy.hero} />
      <CaseStudyList caseStudies={caseStudies} copy={copy} />

      <PageEnd>
        <ClosingCta variant="build" />
      </PageEnd>
    </div>
  )
}
