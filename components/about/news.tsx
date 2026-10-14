import Link from "next/link"

import { Arrow } from "@/components/ui/arrow"
import { ButtonLink } from "@/components/ui/button"
import { SectionHeading } from "@/components/ui/section-heading"
import type { AboutPage } from "@/content/about/page-copy"
import { Reveal } from "@/components/motion/reveal"

/* Latest news as a ruled index: date, title, category tag, the row a link. */
export function News({ copy }: { copy: AboutPage["news"] }) {
  return (
    <section id="news" className="shell mt-32 scroll-mt-24 md:mt-48">
      <SectionHeading
        label={copy.label}
        heading={copy.heading}
        intro={copy.lead}
      />
      <Reveal
        as="ul"
        stagger="rows"
        className="mt-12 border-b border-line md:mt-20"
      >
        {copy.items.map((item) => (
          <li key={item.slug} className="border-t border-line">
            <Link
              href={`/insights/${item.slug}`}
              className="group grid gap-4 py-8 md:grid-cols-12 md:gap-x-6 md:py-10"
            >
              <p className="label pt-2 text-ink-faint md:col-span-3">
                {item.date}
              </p>
              <h3 className="text-title text-pretty transition-colors group-hover:text-accent-ink md:col-span-6">
                {item.title}
              </h3>
              <p className="md:col-span-2 md:pt-1">
                <span className="label inline-block rounded-full border border-line-strong px-3 py-1.5 text-ink-soft">
                  {item.category}
                </span>
              </p>
              <span className="hidden items-start justify-end pt-2 md:col-span-1 md:flex">
                <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </Reveal>
      <ButtonLink href={copy.viewAllHref} tone="outline" className="mt-10">
        {copy.viewAllLabel}
      </ButtonLink>
    </section>
  )
}
