/* eslint-disable @next/next/no-img-element -- local SVG wordmark, intentionally not run through next/image */

import { cn } from "@/lib/utils"
import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/landing/section"
import { RevealItem, RevealStagger } from "@/components/motion/reveal"
import type { Product } from "@/content/products/content"
import type { ProductsPage } from "@/content/products/page-copy"
import { DitherPanel } from "@/components/motion/dither-panel"
import { SectionHeading } from "@/components/site/section-heading"

/** The way into a product's own page. */
function ExploreLink({
  product,
  explore,
  className,
}: {
  product: Product
  /** The word before the name: "Explore". */
  explore: string
  className?: string
}) {
  return (
    <ButtonLink
      href={`/enterprise-products/${product.id}`}
      tone="ink"
      className={className}
    >
      {explore} {product.name}
    </ButtonLink>
  )
}

/**
 * One product: a header strip over a dithered panel, or — for a partner
 * platform, which has no panel — over its description.
 *
 * The panel is the site's dither (`DitherPanel`), risen most of the way and
 * resolving as the card scrolls in — the same weave as the hero and the page
 * transition, with a per-product seed so no two fronts match.
 */
function ProductCard({
  product,
  explore,
}: {
  product: Product
  explore: string
}) {
  return (
    <article
      id={product.id}
      className="flex h-full scroll-mt-24 flex-col gap-6 overflow-clip rounded-3xl bg-surface-raised"
    >
      <div className="flex flex-col items-start gap-2.5 p-6 sm:flex-row sm:items-center">
        <h3
          className={cn("text-headline leading-[1.1]", "text-ink sm:w-[56%]")}
        >
          {product.name}
        </h3>
        <p className={cn("text-lede", "min-w-0 flex-1 text-ink")}>
          {product.tagline}
        </p>
      </div>

      {product.dither !== undefined ? (
        /*
         * Only the top corners are rounded: the panel runs to the bottom of the
         * card, where the card's own clip takes over.
         */
        <div className="relative min-h-[min(420px,55svh)] flex-1 overflow-clip rounded-t-[32px] bg-surface lg:min-h-[min(612px,65svh)]">
          {/* Risen less where nothing sits on it, so more of the weave shows;
              a wordmark needs solid blue behind it to stay legible. */}
          <DitherPanel
            seed={product.dither}
            level={product.wordmark ? 0.8 : 0.6}
            className="absolute inset-0"
          />

          {product.wordmark && (
            <img
              src={product.wordmark.src}
              alt={`${product.name} logo`}
              width={product.wordmark.width}
              height={product.wordmark.height}
              className="absolute top-1/2 left-1/2 w-[64%] max-w-[437px] -translate-x-1/2 -translate-y-1/2"
            />
          )}

          <ExploreLink
            product={product}
            explore={explore}
            className="absolute right-3 bottom-3"
          />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-6 px-6 pb-6">
          <p className={cn("text-body", "text-ink lg:max-w-[600px]")}>
            {product.description}
          </p>
          <ExploreLink product={product} explore={explore} />
        </div>
      )}
    </article>
  )
}

function ProductSection({
  title,
  lead,
  items,
  explore,
}: {
  title: string
  lead?: string
  items: Product[]
  explore: string
}) {
  return (
    <section className="flex flex-col gap-section-head">
      <Container>
        <SectionHeading heading={title} intro={lead} />
      </Container>

      <RevealStagger amount={0.1}>
        <Container className="grid gap-gutter lg:grid-cols-2">
          {items.map((product) => (
            <RevealItem key={product.id}>
              <ProductCard product={product} explore={explore} />
            </RevealItem>
          ))}
        </Container>
      </RevealStagger>
    </section>
  )
}

/** Softcom's own products, then the partner platforms it implements. */
function ProductGrid({
  products,
  partnerPlatforms,
  copy,
}: {
  products: Product[]
  partnerPlatforms: Product[]
  copy: ProductsPage
}) {
  return (
    <div className="flex flex-col gap-section">
      <ProductSection
        title={copy.softcom.title}
        items={products}
        explore={copy.labels.explore}
      />
      <ProductSection
        title={copy.partners.title}
        lead={copy.partners.lead}
        items={partnerPlatforms}
        explore={copy.labels.explore}
      />
    </div>
  )
}

export { ProductGrid }
