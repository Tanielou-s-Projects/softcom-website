import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ClosingCta } from "@/components/home/closing-cta"
import {
  InsightArticle,
  KeepReading,
} from "@/components/insights/insight-article"
import { insightsPage } from "@/content/insights/page-copy"
import { getNavigation } from "@/content/site/get-navigation"
import { getInsight, getInsights, getInsightSlugs } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getInsightSlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getInsight(slug)
  if (!article) return {}
  return { title: article.title, description: article.dek }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params
  const [article, insights, copy, navigation] = await Promise.all([
    getInsight(slug),
    getInsights(),
    getPageContent("insightsPage", insightsPage),
    getNavigation(),
  ])

  if (!article) notFound()

  return (
    <>
      <InsightArticle article={article} indexLabel={copy.hero.badge} />
      <KeepReading
        current={article}
        insights={insights}
        heading={copy.headings.latest.replace(/\n/g, " ")}
        indexLabel={copy.hero.badge}
      />
      <ClosingCta
        copy={navigation.closingCtas.home}
        image={navigation.closingCtas.image}
      />
    </>
  )
}
