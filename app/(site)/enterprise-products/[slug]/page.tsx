import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { MoreProducts } from "@/components/products/more-products"
import { ProductAudience } from "@/components/products/product-audience"
import { ProductFigure } from "@/components/products/product-figure"
import { ProductSection } from "@/components/products/product-section"
import {
  ProductSubNav,
  type SubNavItem,
} from "@/components/products/product-sub-nav"
import { ProductsClose } from "@/components/products/products-close"
import { pad } from "@/components/products/product-tag"
import { Reveal } from "@/components/motion/reveal"
import { PageHero } from "@/components/site/page-hero"
import { ButtonLink } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { productsPage } from "@/content/products/page-copy"
import { getProductPage, getProducts, getProductSlugs } from "@/sanity/lib/data"
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

/* A sub-nav title from a chapter heading, without its closing full stop. */
const shortLabel = (heading: string) => heading.replace(/\.$/, "")

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const [result, products, slugs, copy] = await Promise.all([
    getProductPage(slug),
    getProducts(),
    getProductSlugs(),
    getPageContent("productsPage", productsPage),
  ])
  if (!result) notFound()

  const { name, page } = result
  const rest = page.lead.slice(1)
  const hasOverview = rest.length > 0 || Boolean(page.figure)

  const items: SubNavItem[] = [
    ...(hasOverview ? [{ id: "overview", label: "Overview" }] : []),
    ...page.sections.map((s) => ({ id: s.id, label: shortLabel(s.heading) })),
    ...(page.audience ? [{ id: "audience", label: copy.labels.audience }] : []),
  ]
  // Chapter numbers follow the sub-nav, so "03" means the same in both.
  const numberOf = (id: string) =>
    pad(items.findIndex((item) => item.id === id) + 1)

  return (
    <>
      <PageHero label={page.eyebrow || name} heading={page.title}>
        <p className="text-lg text-ink-soft">{page.lead[0]}</p>
        <ButtonLink href={page.primary.href} className="mt-8">
          {page.primary.label}
        </ButtonLink>
      </PageHero>

      {items.length > 0 ? (
        <div className="mt-16 md:mt-24">
          <ProductSubNav name={name} items={items} cta={page.primary} />

          {hasOverview && (
            <section
              id="overview"
              aria-label="Overview"
              className="shell mt-16 scroll-mt-24 md:mt-24"
            >
              <div className="grid gap-8 md:grid-cols-12 md:gap-x-6">
                <p className="label text-ink-faint md:col-span-5">
                  {numberOf("overview")} · Overview
                </p>
                {rest.length > 0 && (
                  <Reveal className="space-y-6 md:col-span-6 md:col-start-7">
                    {rest.map((p) => (
                      <p key={p} className="text-xl tracking-[-0.01em]">
                        {p}
                      </p>
                    ))}
                  </Reveal>
                )}
              </div>
              {page.figure && (
                <Reveal className="mt-12 md:mt-16">
                  <ProductFigure
                    figure={page.figure}
                    number={`${numberOf("overview")}.1`}
                    aspect="aspect-[4/3] md:aspect-[21/9]"
                  />
                </Reveal>
              )}
            </section>
          )}

          {page.sections.map((section) => (
            <ProductSection
              key={section.id}
              section={section}
              number={numberOf(section.id)}
            />
          ))}

          {page.audience && (
            <ProductAudience
              audience={page.audience}
              label={`${numberOf("audience")} · ${copy.labels.audience}`}
            />
          )}
        </div>
      ) : (
        // A product with no chapters yet still shows itself before the ask.
        <Reveal className="shell mt-16 md:mt-24">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:aspect-[21/9]">
            <ImagePlaceholder label={name} />
          </div>
        </Reveal>
      )}

      <ProductsClose
        label={name}
        heading={page.close.heading}
        text={page.close.text}
        cta={page.close.cta}
      />
      <MoreProducts
        products={products.filter(
          (product) =>
            product.id !== slug && slugs.some((s) => s.slug === product.id)
        )}
        explore={copy.labels.explore}
      />
    </>
  )
}
