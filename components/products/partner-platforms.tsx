import { ArrowLink } from "@/components/ui/button"
import { Crosshairs } from "@/components/ui/crosshairs"
import { SectionHeading } from "@/components/ui/section-heading"
import type { ProductsPage } from "@/content/products/page-copy"
import type { ProductWithKind } from "@/sanity/lib/data"
import { Reveal } from "@/components/motion/reveal"
import { pad, ProductTag } from "@/components/products/product-tag"

/*
 * The platforms Softcom implements for others, as columns on a hairline grid:
 * text only, since they are someone else's product and Softcom's part is the
 * delivery.
 */
export function PartnerPlatforms({
  partners,
  pages,
  copy,
}: {
  partners: ProductWithKind[]
  pages: Set<string>
  copy: ProductsPage
}) {
  if (!partners.length) return null

  return (
    <section className="mt-32 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 md:mt-16">
        <SectionHeading
          label={`${pad(partners.length)} platforms`}
          heading={copy.partners.title}
          intro={copy.partners.lead}
        />
        <Reveal
          as="ol"
          stagger
          className="mt-12 grid border-t border-line md:-mx-6 md:mt-20 md:grid-cols-2 md:border-t-0"
        >
          {partners.map((partner, i) => (
            <li
              key={partner.id}
              id={partner.id}
              className="flex scroll-mt-28 flex-col border-b border-line py-8 md:border-b-0 md:border-l md:px-6 md:pt-0 md:first:border-l-0"
            >
              <div className="flex items-center justify-between gap-4 md:border-t md:border-line md:pt-8">
                <p className="label text-ink-faint">{pad(i + 1)}</p>
                <ProductTag kind="partner" />
              </div>
              <h3 className="mt-10 text-title md:mt-16">{partner.name}</h3>
              <p className="mt-4 text-xl tracking-[-0.01em] text-balance">
                {partner.tagline}
              </p>
              <p className="mt-4 max-w-xl text-ink-soft">
                {partner.description}
              </p>
              {pages.has(partner.id) && (
                <ArrowLink
                  href={`/enterprise-products/${partner.id}`}
                  className="mt-8 md:mt-auto md:pt-8"
                >
                  {copy.labels.explore} {partner.name}
                </ArrowLink>
              )}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
