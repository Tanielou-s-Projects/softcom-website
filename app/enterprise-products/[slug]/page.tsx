import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LineDitherDefs } from "@/components/iso/line-dither"
import { HeroHeader } from "@/components/landing/hero-header"
import { Bleed } from "@/components/landing/section"
import { partnerPlatforms, products } from "@/components/products/content"
import { productPageOf, productPages } from "@/components/products/pages"
import {
  ProductBody,
  ProductCta,
  ProductHero,
} from "@/components/products/product-page"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"

type Props = { params: Promise<{ slug: string }> }

const ALL = [...products, ...partnerPlatforms]

export function generateStaticParams() {
  return productPages.map((page) => ({ slug: page.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = productPageOf(slug)
  const product = ALL.find((item) => item.id === slug)
  if (!page || !product) return {}
  return { title: product.name, description: page.lead[0] }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const page = productPageOf(slug)
  const index = ALL.findIndex((item) => item.id === slug)
  if (!page || index < 0) notFound()

  const product = ALL[index]
  // Partner platforms carry no seed of their own; carry on from the last one.
  const seed = product.dither ?? index + 1

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5">
      <BlueprintGrid />
      <LineDitherDefs />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <ProductHero page={page} name={product.name} seed={seed} />
      <ProductBody page={page} />

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
