import type { Metadata } from "next"

import { ClosingCta } from "@/components/landing/closing-cta"
import { TENURE } from "@/components/landing/content"
import { Bleed } from "@/components/landing/section"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductsHero } from "@/components/products/products-hero"
import { WhatWeDeliver } from "@/components/products/what-we-deliver"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Products & Services",
  description: `Proprietary platforms and focused service lines, crafted to the highest standard through ${TENURE} of experience in Africa's most complex and demanding environments.`,
}

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-32">
      <BlueprintGrid />
      <SiteHeader />

      <ProductsHero />
      <ProductGrid />
      <WhatWeDeliver />

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
