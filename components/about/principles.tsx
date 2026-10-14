import { SectionHeading } from "@/components/ui/section-heading"
import type { AboutPage } from "@/content/about/page-copy"
import { principles } from "@/content/about/content"
import { Reveal } from "@/components/motion/reveal"

/* The values as a hairline grid: four numbered cells, two by two on desktop. */
export function Principles({ copy }: { copy: AboutPage["values"] }) {
  return (
    <section id="principles" className="shell mt-32 scroll-mt-24 md:mt-48">
      <SectionHeading label={principles.eyebrow} heading={copy.heading} />
      <Reveal
        as="ol"
        stagger
        className="mt-12 grid border-t border-line md:mt-20 md:grid-cols-2"
      >
        {copy.items.map((item, i) => (
          <li
            key={item.title}
            className="grid gap-4 border-b border-line py-8 md:grid-cols-6 md:gap-x-6 md:py-12 md:odd:border-r md:odd:pr-6 md:even:pl-6"
          >
            <p className="label pt-2 text-ink-faint md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </p>
            <div className="md:col-span-5">
              <h3 className="text-title">{item.title}</h3>
              <p className="mt-4 max-w-md text-ink-soft">{item.description}</p>
            </div>
          </li>
        ))}
      </Reveal>
    </section>
  )
}
