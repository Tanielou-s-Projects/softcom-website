import Link from "next/link"

import { Arrow } from "@/components/ui/arrow"
import type { ProductWithKind } from "@/sanity/lib/data"
import { Reveal } from "@/components/motion/reveal"
import { pad, ProductTag } from "@/components/products/product-tag"

/* The rest of the catalogue, as a compact ruled index: one linked row each. */
export function MoreProducts({
  products,
  explore,
}: {
  products: ProductWithKind[]
  explore: string
}) {
  if (!products.length) return null

  return (
    <section aria-labelledby="more-products" className="shell mt-32 md:mt-48">
      <div className="flex items-baseline justify-between gap-6">
        <h2 id="more-products" className="label text-ink-soft">
          More from Enterprise Products
        </h2>
        <Link
          href="/enterprise-products"
          className="label text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          All products
        </Link>
      </div>
      <Reveal as="ul" stagger="rows" className="mt-6 border-b border-line">
        {products.map((product, i) => (
          <li key={product.id} className="border-t border-line">
            <Link
              href={`/enterprise-products/${product.id}`}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-2 py-5 md:grid-cols-12 md:gap-x-6"
            >
              <span className="label text-ink-faint md:col-span-1">
                {pad(i + 1)}
              </span>
              <span className="text-title transition-colors group-hover:text-accent md:col-span-4">
                <span className="sr-only">{explore} </span>
                {product.name}
              </span>
              <span className="col-start-2 row-start-2 text-ink-soft md:col-span-5 md:col-start-auto md:row-start-auto">
                {product.tagline}
              </span>
              <span className="col-start-3 row-span-2 row-start-1 flex items-center justify-end gap-4 md:col-span-2 md:col-start-auto md:row-span-1 md:row-start-auto">
                <ProductTag
                  kind={product.kind}
                  className="hidden md:inline-flex"
                />
                <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </Reveal>
    </section>
  )
}
