/* eslint-disable @next/next/no-img-element -- local SVG wordmark, intentionally not run through next/image */
import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  cardHeadingText,
  Container,
  leadText,
} from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { products, type Product } from "@/components/products/content"
import { ProductOverlay } from "@/components/products/product-overlay"
import { SectionMark } from "@/components/products/section-mark"

/**
 * One product: a header strip over a dithered panel.
 *
 * The panels are Figma exports rather than a live shader. Each is a blue-to-cyan
 * radial or swept gradient run through a dither, and the export is what the
 * design actually renders — a shader would have to match four different fields
 * exactly to be worth the WebGL. This is the natural place to revisit that.
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col gap-6 overflow-clip rounded-3xl bg-muted">
      <div className="flex flex-col items-start gap-2.5 p-6 sm:flex-row sm:items-center">
        <h3 className={cn(cardHeadingText, "text-foreground sm:w-[359px]")}>
          {product.name}
        </h3>
        <p className={cn(leadText, "min-w-0 flex-1 text-foreground")}>
          {product.tagline}
        </p>
      </div>

      {/*
       * Only the top corners are rounded: the panel runs to the bottom of the
       * card, where the card's own clip takes over.
       */}
      <div className="relative min-h-[420px] flex-1 overflow-clip rounded-t-[32px] bg-popover lg:min-h-[612px]">
        <Image
          src={product.panel}
          alt=""
          fill
          sizes="(min-width: 1024px) 684px, 100vw"
          className="object-cover"
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
    </article>
  )
}

/** The proprietary products, two up. */
function ProductGrid() {
  return (
    <section className="flex flex-col gap-16 lg:gap-[68px]">
      <Reveal>
        <SectionMark accent="cyan">Proprietary Products</SectionMark>
      </Reveal>

      <RevealStagger amount={0.1}>
        <Container className="grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <RevealItem key={product.id}>
              <ProductCard product={product} />
            </RevealItem>
          ))}
        </Container>
      </RevealStagger>
    </section>
  )
}

export { ProductGrid }
