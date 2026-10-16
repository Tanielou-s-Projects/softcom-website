import type { Metadata } from "next"

import { HeroHeader } from "@/components/landing/hero-header"
import { LineDitherDefs } from "@/components/iso/line-dither"
import { SolutionsStory } from "@/components/solutions/solutions-story"
import { SolutionsCta } from "@/components/solutions/solutions-cta"
import { SolutionsHero } from "@/components/solutions/solutions-hero"
import { PageEnd } from "@/components/site/page-end"
import { Section } from "@/components/site/section"
import { solutionsPage } from "@/content/solutions/page-copy"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("solutionsPage", solutionsPage)
  return { title: "Solutions", description: copy.meta.description }
}

export default async function Page() {
  const copy = await getPageContent("solutionsPage", solutionsPage)

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-section">
      <LineDitherDefs />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <div className="flex flex-col gap-section-tight">
        <SolutionsHero copy={copy} />
        <Section>
          <SolutionsStory copy={copy} />
        </Section>
      </div>

      <PageEnd>
        <SolutionsCta copy={copy.close} />
      </PageEnd>
    </div>
  )
}
