import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { articles, getArticle } from "@/components/insights/content"
import { InsightArticle } from "@/components/insights/insight-article"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Bleed } from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"
import { SiteHeader } from "@/components/site/site-header"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)

  if (!article) return {}

  return { title: article.title, description: article.dek }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)

  if (!article) notFound()

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      <BlueprintGrid />
      <SiteHeader />

      <InsightArticle article={article} />

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Bleed className="flex flex-col gap-2.5 py-6">
        <ClosingCta variant="build" />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
