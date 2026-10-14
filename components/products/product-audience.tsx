import type { ProductPage } from "@/content/products/pages"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"
import { Crosshairs } from "@/components/ui/crosshairs"

/*
 * Who the product is for, set as the page's statement: the "Built for those
 * with a mandate to …" line large, the people it means beside it.
 */
export function ProductAudience({
  audience,
  label,
}: {
  audience: NonNullable<ProductPage["audience"]>
  label: string
}) {
  return (
    <section id="audience" className="mt-32 scroll-mt-24 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 grid gap-8 md:mt-16 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-8">
          <p className="label text-ink-faint">{label}</p>
          <LineReveal
            as="h2"
            className="mt-5 text-display font-light text-balance"
          >
            {audience.heading}
          </LineReveal>
        </div>
        <Reveal className="self-end md:col-span-4">
          {audience.body.map((p) => (
            <p key={p} className="text-lg text-ink-soft">
              {p}
            </p>
          ))}
          {audience.note && (
            <p className="label mt-6 text-ink-faint">{audience.note}</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
