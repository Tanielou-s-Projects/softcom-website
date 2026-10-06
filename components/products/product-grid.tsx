/* eslint-disable @next/next/no-img-element -- local SVG wordmark, intentionally not run through next/image */

import { cn } from "@/lib/utils"
import {
  bodyText,
  cardHeadingText,
  Container,
  leadText,
} from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import {
  partnerPlatforms,
  partnersIntro,
  products,
  type Product,
} from "@/components/products/content"
import { DitherPanel } from "@/components/motion/dither-panel"
import { ProductOverlay } from "@/components/products/product-overlay"
import { SectionMark } from "@/components/products/section-mark"

/**
 * One product: a header strip over a dithered panel, or — for a partner
 * platform, which has no panel — over its description.
 *
 * The panel is the site's dither (`DitherPanel`), risen most of the way and
 * resolving as the card scrolls in — the same weave as the hero and the page
 * transition, with a per-product seed so no two fronts match.
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col gap-6 overflow-clip rounded-3xl bg-muted">
      <div className="flex flex-col items-start gap-2.5 p-6 sm:flex-row sm:items-center">
        <h3 className={cn(cardHeadingText, "text-foreground sm:w-[56%]")}>
          {product.name}
        </h3>
        <p className={cn(leadText, "min-w-0 flex-1 text-foreground")}>
          {product.tagline}
        </p>
      </div>

      {product.dither !== undefined ? (
        /*
         * Only the top corners are rounded: the panel runs to the bottom of the
         * card, where the card's own clip takes over.
         */
        <div className="relative min-h-[min(420px,55svh)] flex-1 overflow-clip rounded-t-[32px] bg-popover lg:min-h-[min(612px,65svh)]">
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

          <ProductOverlay product={product} />
        </div>
      ) : (
        <p
          className={cn(bodyText, "px-6 pb-8 text-foreground lg:max-w-[600px]")}
        >
          {product.description}
        </p>
      )}
    </article>
  )
}

function ProductSection({
  title,
  lead,
  accent,
  items,
}: {
  title: string
  lead?: string
  accent: "cyan" | "blue"
  items: Product[]
}) {
  return (
    <section className="flex flex-col gap-16 lg:gap-[68px]">
      <Reveal className="flex flex-col items-center gap-6">
        <SectionMark accent={accent}>{title}</SectionMark>
        {lead ? (
          <p
            className={cn(
              leadText,
              "max-w-[576px] px-6 text-center text-muted-foreground"
            )}
          >
            {lead}
          </p>
        ) : null}
      </Reveal>

      <RevealStagger amount={0.1}>
        <Container className="grid gap-6 lg:grid-cols-2">
          {items.map((product) => (
            <RevealItem key={product.id}>
              <ProductCard product={product} />
            </RevealItem>
          ))}
        </Container>
      </RevealStagger>
    </section>
  )
}

/** Softcom's own products, then the partner platforms it implements. */
function ProductGrid() {
  return (
    <>
      <ProductSection title="Softcom Products" accent="cyan" items={products} />
      <ProductSection
        title={partnersIntro.title}
        lead={partnersIntro.lead}
        accent="blue"
        items={partnerPlatforms}
      />
    </>
  )
}

export { ProductGrid }
