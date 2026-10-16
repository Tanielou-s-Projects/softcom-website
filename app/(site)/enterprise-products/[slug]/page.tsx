import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LineDitherDefs } from "@/components/iso/line-dither"
import { HeroHeader } from "@/components/landing/hero-header"
import {
  ProductBody,
  ProductCta,
  ProductHero,
} from "@/components/products/product-page"
import { PageEnd } from "@/components/site/page-end"
import { Section } from "@/components/site/section"
import { productsPage } from "@/content/products/page-copy"
import { getProductPage, getProductSlugs } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getProductSlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getProductPage(slug)
  if (!result) return {}
  return { title: result.name, description: result.page.lead[0] }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [result, copy] = await Promise.all([
    getProductPage(slug),
    getPageContent("productsPage", productsPage),
  ])
  if (!result) notFound()

  const { name, page } = result

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-section">
      <LineDitherDefs />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <div className="flex flex-col gap-section-tight">
        <ProductHero page={page} name={name} explore={copy.labels.explore} />
        <Section marks={false}>
          <ProductBody page={page} audienceLabel={copy.labels.audience} />
        </Section>
      </div>

      <PageEnd>
        <ProductCta page={page} />
      </PageEnd>
    </div>
  )
}
