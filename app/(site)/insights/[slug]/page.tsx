import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { InsightArticle } from "@/components/insights/insight-article"
import { ClosingCta } from "@/components/landing/closing-cta"
import { PageEnd } from "@/components/site/page-end"
import { HeroHeader } from "@/components/landing/hero-header"
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
      <HeroHeader />
      {/* Its own hero and body; the section gap follows it. */}
      <div>
        <InsightArticle article={article} indexLabel="All insights" />
      </div>

      <PageEnd>
        <ClosingCta variant="build" />
      </PageEnd>
    </div>
  )
}
