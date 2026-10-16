import type { Metadata } from "next"

import { HeroHeader } from "@/components/landing/hero-header"
import { Bleed } from "@/components/landing/section"
import { LineDitherDefs } from "@/components/iso/line-dither"
import { SolutionsStory } from "@/components/solutions/solutions-story"
import { SolutionsCta } from "@/components/solutions/solutions-cta"
import { SolutionsHero } from "@/components/solutions/solutions-hero"
import { SiteFooter } from "@/components/site/site-footer"
import { solutionsPage } from "@/components/solutions/page-copy"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("solutionsPage", solutionsPage)
  return { title: "Solutions", description: copy.meta.description }
}

export default async function Page() {
  const copy = await getPageContent("solutionsPage", solutionsPage)

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      <LineDitherDefs />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <SolutionsHero copy={copy} />
      <SolutionsStory copy={copy} />

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Bleed className="mt-40 flex flex-col gap-2.5 py-6 lg:mt-64">
        <SolutionsCta copy={copy.close} />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
