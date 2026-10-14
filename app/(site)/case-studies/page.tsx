import type { Metadata } from "next"

import { CaseStudyIndex } from "@/components/case-studies/case-study-index"
import { CaseStudiesClose } from "@/components/case-studies/case-studies-close"
import { PageHero } from "@/components/site/page-hero"
import { caseStudiesPage } from "@/content/case-studies/page-copy"
import { getNavigation } from "@/content/site/get-navigation"
import { getCaseStudies } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("caseStudiesPage", caseStudiesPage)
  return { title: "Case Studies", description: copy.meta.description }
}

export default async function CaseStudiesPage() {
  const [caseStudies, copy, navigation] = await Promise.all([
    getCaseStudies(),
    getPageContent("caseStudiesPage", caseStudiesPage),
    getNavigation(),
  ])

  return (
    <>
      <PageHero
        label={copy.hero.badge}
        heading={copy.hero.title}
        intro={copy.hero.lead}
      />
      <CaseStudyIndex caseStudies={caseStudies} copy={copy} />
      <CaseStudiesClose copy={navigation.closingCtas.careers} />
    </>
  )
}
