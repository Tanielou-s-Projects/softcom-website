import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { InsightArticle } from "@/components/insights/insight-article"
import { ClosingCta } from "@/components/landing/closing-cta"
import { PageEnd } from "@/components/site/page-end"
import { SiteHeader } from "@/components/site/site-header"
import { getInsight, getInsightSlugs } from "@/sanity/lib/data"

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

export default async function Page({ params }: Props) {
  const { slug } = await params
  const article = await getInsight(slug)

  if (!article) notFound()

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-section">
      {/* The header sits in the flow here, so it stays with the article. */}
      <div className="flex flex-col gap-2.5">
        <SiteHeader />
        <InsightArticle article={article} />
      </div>

      <PageEnd>
        <ClosingCta variant="build" />
      </PageEnd>
    </div>
  )
}
