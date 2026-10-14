import {
  figuresOf,
  type ProductSection as Section,
} from "@/content/products/pages"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"
import { ProductFigure } from "@/components/products/product-figure"

/*
 * One chapter of a product page: its number and heading in the left columns,
 * its copy, cards and figures in the right ones, on a hairline that opens it.
 * The id is what the sub-nav links to.
 */
export function ProductSection({
  section,
  number,
}: {
  section: Section
  /** Two-digit chapter number, matching the sub-nav. */
  number: string
}) {
  const figures = figuresOf(section)

  return (
    <section id={section.id} className="shell mt-24 scroll-mt-24 md:mt-40">
      <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:gap-x-6 md:pt-10">
        <div className="md:col-span-5">
          <p className="label text-ink-faint">{number}</p>
          <LineReveal
            as="h2"
            className="mt-5 text-headline font-normal text-balance"
          >
            {section.heading}
          </LineReveal>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          {section.body.length > 0 && (
            <Reveal className="space-y-4 text-lg text-ink-soft md:pt-10">
              {section.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          )}
          {section.note && (
            <p className="label mt-6 text-ink-faint">{section.note}</p>
          )}
        </div>
      </div>

      {section.cards && (
        <Reveal
          as="ol"
          stagger
          className="mt-12 grid border-t border-line md:mt-16 md:grid-cols-3 md:border-t-0"
        >
          {section.cards.map((card, i) => (
            <li
              key={card.label}
              className="border-b border-line py-6 md:border-b-0 md:border-l md:px-6 md:py-0 md:first:border-l-0 md:first:pl-0"
            >
              <p className="label text-ink-faint md:border-t md:border-line md:pt-6">
                {number}.{i + 1}
              </p>
              <h3 className="mt-4 text-title">{card.label}</h3>
              <p className="mt-4 text-ink-soft">{card.description}</p>
            </li>
          ))}
        </Reveal>
      )}

      {figures.length > 0 && (
        <Reveal
          stagger
          className="mt-12 grid gap-x-6 gap-y-12 md:mt-16 md:grid-cols-2"
        >
          {figures.map((figure, i) => (
            <ProductFigure
              key={`${figure.key}-${i}`}
              figure={figure}
              number={`${number}.${i + 1}`}
              className={
                figures.length === 1 || (figures.length % 2 && i === 0)
                  ? "md:col-span-2"
                  : undefined
              }
              aspect={
                figures.length === 1 || (figures.length % 2 && i === 0)
                  ? "aspect-[4/3] md:aspect-[21/9]"
                  : undefined
              }
            />
          ))}
        </Reveal>
      )}
    </section>
  )
}
