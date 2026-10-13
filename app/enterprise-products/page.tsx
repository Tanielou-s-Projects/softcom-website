import type { Metadata } from "next"

import { ClosingCta } from "@/components/landing/closing-cta"
import { HeroHeader } from "@/components/landing/hero-header"
import { Bleed } from "@/components/landing/section"
import { productsIntro } from "@/components/products/content"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductsHero } from "@/components/products/products-hero"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"

export const metadata: Metadata = {
  title: productsIntro.title,
  description: productsIntro.lead,
}

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-32">
      <BlueprintGrid />
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <ProductsHero />
      <ProductGrid />

      {/*
       * The CTA and footer share this wrapper so the CTA's `sticky` pin resolves
       * against it — the footer then scrolls up over the pinned panel.
       */}
      <Bleed className="mt-40 flex flex-col gap-2.5 py-6 lg:mt-64">
        <ClosingCta variant="products" />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
