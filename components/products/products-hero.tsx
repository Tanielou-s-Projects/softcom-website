import Link from "next/link"

import { DitherMark } from "@/components/motion/dither-mark"
import { productsIntro, type Product } from "@/components/products/content"
import { FullHero, HeroRail } from "@/components/site/full-hero"

/**
 * Four discs on one conduit for Softcom's own products, the claim, and every
 * product — own and partner — in the rail, each linking to its entry.
 */
function ProductsHero({ products }: { products: Product[] }) {
  return (
    <FullHero
      background={<DitherMark layout="products" />}
      badge="Products"
      title={productsIntro.title}
      lead={productsIntro.lead}
      rail={
        <HeroRail
          as="nav"
          label="Products"
          className="grid-cols-2 sm:grid-flow-row sm:grid-cols-3 lg:grid-flow-col lg:grid-cols-none"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`#${product.id}`}
              className="font-heading text-lg leading-tight text-foreground transition-colors hover:text-brand-cyan lg:text-xl"
            >
              {product.name}
            </Link>
          ))}
        </HeroRail>
      }
    />
  )
}

export { ProductsHero }
