import { ArrowLink } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { SectionHeading } from "@/components/ui/section-heading"
import type { ProductsPage } from "@/content/products/page-copy"
import type { ProductWithKind } from "@/sanity/lib/data"
import { Reveal } from "@/components/motion/reveal"
import { pad, ProductTag } from "@/components/products/product-tag"

/*
 * Softcom's own products as a ruled index: one row each, numbered, tagged,
 * the name large on the left and what it does on the right. Each row carries
 * the product's id so the footer's `#lift`-style anchors land on it.
 */
export function ProductIndex({
  products,
  pages,
  copy,
}: {
  products: ProductWithKind[]
  /** Slugs that have a product page; only those rows link through. */
  pages: Set<string>
  copy: ProductsPage
}) {
  return (
    <section className="shell mt-24 md:mt-32">
      <SectionHeading
        label={`${pad(products.length)} products`}
        heading={copy.softcom.title}
      />
      <Reveal as="ol" stagger className="mt-12 border-b border-line md:mt-20">
        {products.map((product, i) => (
          <li
            key={product.id}
            id={product.id}
            className="grid scroll-mt-28 gap-6 border-t border-line py-8 md:grid-cols-12 md:gap-x-6 md:py-12"
          >
            <div className="flex items-center gap-4 md:col-span-2 md:flex-col md:items-start">
              <p className="label text-ink-faint">{pad(i + 1)}</p>
              <ProductTag kind={product.kind} />
            </div>
            <h3 className="text-headline font-light md:col-span-4">
              {product.name}
            </h3>
            <div className="md:col-span-4">
              <p className="text-xl tracking-[-0.01em] text-balance">
                {product.tagline}
              </p>
              <p className="mt-4 text-ink-soft">{product.description}</p>
              {pages.has(product.id) && (
                <ArrowLink
                  href={`/enterprise-products/${product.id}`}
                  className="mt-6"
                >
                  {copy.labels.explore} {product.name}
                </ArrowLink>
              )}
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg md:col-span-2 md:aspect-square">
              <ImagePlaceholder />
            </div>
          </li>
        ))}
      </Reveal>
    </section>
  )
}
