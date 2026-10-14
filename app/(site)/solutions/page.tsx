import type { Metadata } from "next"

import { PageHero } from "@/components/site/page-hero"
import { DeliveryPhases } from "@/components/solutions/delivery-phases"
import { SolutionAreas } from "@/components/solutions/solution-areas"
import { SolutionsClose } from "@/components/solutions/solutions-close"
import { SolutionsIntro } from "@/components/solutions/solutions-intro"
import { solutionsPage } from "@/content/solutions/page-copy"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("solutionsPage", solutionsPage)
  return { title: "Solutions", description: copy.meta.description }
}

export default async function SolutionsPage() {
  const copy = await getPageContent("solutionsPage", solutionsPage)

  return (
    <>
      <PageHero
        label={copy.hero.badge}
        heading={copy.hero.title}
        mark="conduit"
      />
      <SolutionsIntro copy={copy.intro} />
      <SolutionAreas copy={copy} />
      <DeliveryPhases copy={copy.initiatives} />
      <SolutionsClose copy={copy.close} />
    </>
  )
}
