import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LineDitherDefs } from "@/components/iso/line-dither"
import { HeroHeader } from "@/components/landing/hero-header"
import { Bleed } from "@/components/landing/section"
import {
  ProductBody,
  ProductCta,
  ProductHero,
} from "@/components/products/product-page"
import { SiteFooter } from "@/components/site/site-footer"
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

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Bleed className="mt-40 flex flex-col gap-2.5 py-6 lg:mt-64">
        <ProductCta page={page} />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
