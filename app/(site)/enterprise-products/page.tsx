import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"

import { ClosingCta } from "@/components/landing/closing-cta"
import { HeroHeader } from "@/components/landing/hero-header"
import { productsPage } from "@/content/products/page-copy"
import { ProductGrid } from "@/components/products/product-grid"
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

      <div className="flex flex-col gap-section-tight">
        <PageHero
          mark="products"
          label={copy.hero.badge}
          heading={copy.hero.title}
          intro={copy.hero.lead}
        />
        <Section marks={false}>
          <ProductGrid
            products={products}
            partnerPlatforms={partners}
            copy={copy}
          />
        </Section>
      </div>

      <PageEnd>
        <ClosingCta variant="products" />
      </PageEnd>
    </div>
  )
}
