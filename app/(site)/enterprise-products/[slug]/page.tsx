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
import { productsPage } from "@/components/products/page-copy"
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

  const { name, seed, page } = result

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      <LineDitherDefs />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <ProductHero
        page={page}
        name={name}
        seed={seed}
        explore={copy.labels.explore}
      />
      <ProductBody page={page} audienceLabel={copy.labels.audience} />

      <PageEnd>
        <ProductCta page={page} />
      </PageEnd>
    </div>
  )
}
