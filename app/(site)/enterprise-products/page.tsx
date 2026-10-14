import type { Metadata } from "next"

import { PartnerPlatforms } from "@/components/products/partner-platforms"
import { ProductIndex } from "@/components/products/product-index"
import { ProductsClose } from "@/components/products/products-close"
import { PageHero } from "@/components/site/page-hero"
import { productsPage } from "@/content/products/page-copy"
import { getNavigation } from "@/content/site/get-navigation"
import { getProducts, getProductSlugs } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("productsPage", productsPage)
  return { title: copy.hero.title, description: copy.hero.lead }
}

export default async function EnterpriseProductsPage() {
  const [all, slugs, copy, navigation] = await Promise.all([
    getProducts(),
    getProductSlugs(),
    getPageContent("productsPage", productsPage),
    getNavigation(),
  ])
  const pages = new Set(slugs.map(({ slug }) => slug))
  const own = all.filter((product) => product.kind === "softcom")
  const partners = all.filter((product) => product.kind === "partner")
  const close = navigation.closingCtas.products

  return (
    <>
      <PageHero
        mark="products"
        label={copy.hero.badge}
        heading={copy.hero.title}
        intro={copy.hero.lead}
      />
      <ProductIndex products={own} pages={pages} copy={copy} />
      <PartnerPlatforms partners={partners} pages={pages} copy={copy} />
      <ProductsClose
        heading={close.heading}
        text={close.lead}
        cta={{ label: close.buttonLabel, href: close.buttonHref }}
      />
    </>
  )
}
