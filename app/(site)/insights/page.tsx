import type { Metadata } from "next"

import { ClosingCta } from "@/components/home/closing-cta"
import { InsightIndex } from "@/components/insights/insight-index"
import { PageHero } from "@/components/site/page-hero"
import { insightsPage } from "@/content/insights/page-copy"
import { getNavigation } from "@/content/site/get-navigation"
import { getInsights } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("insightsPage", insightsPage)
  return { title: "Insights", description: copy.intro.text }
}

export default async function InsightsPage() {
  const [copy, insights, navigation] = await Promise.all([
    getPageContent("insightsPage", insightsPage),
    getInsights(),
    getNavigation(),
  ])

  return (
    <>
      <PageHero
        mark="insights"
        label={copy.hero.badge}
        heading={copy.hero.title}
        intro={copy.intro.text}
      />
      <InsightIndex insights={insights} copy={copy} />
      <ClosingCta copy={navigation.closingCtas.home} />
    </>
  )
}
