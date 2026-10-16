import type { Metadata } from "next"

import { ClosingCta } from "@/components/landing/closing-cta"
import { HeroHeader } from "@/components/landing/hero-header"
import { productsPage } from "@/content/products/page-copy"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductsHero } from "@/components/products/products-hero"
import { PageEnd } from "@/components/site/page-end"
import { Section } from "@/components/site/section"
import { getProducts } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("productsPage", productsPage)
  return { title: copy.hero.title, description: copy.hero.lead }
}

export default async function Page() {
  const [all, copy] = await Promise.all([
    getProducts(),
    getPageContent("productsPage", productsPage),
  ])
  const products = all.filter((product) => product.kind === "softcom")
  const partners = all.filter((product) => product.kind === "partner")

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-section">
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <ProductsHero products={all} copy={copy.hero} />
      <Section>
        <ProductGrid
          products={products}
          partnerPlatforms={partners}
          copy={copy}
        />
      </Section>

      <PageEnd>
        <ClosingCta variant="products" />
      </PageEnd>
    </div>
  )
}
