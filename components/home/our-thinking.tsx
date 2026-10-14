import Link from "next/link"

import { Arrow } from "@/components/ui/arrow"
import { ButtonLink } from "@/components/ui/button"
import { SectionHeading } from "@/components/ui/section-heading"
import type { HomePage } from "@/content/home/page-copy"
import { Reveal } from "@/components/motion/reveal"

/* Perspectives as an index: one ruled row each, the whole row a link. */
export function OurThinking({ copy }: { copy: HomePage["ourThinking"] }) {
  return (
    <section className="shell mt-32 md:mt-48">
      <SectionHeading heading={copy.heading} intro={copy.intro} />
      <Reveal
        as="ul"
        stagger="rows"
        className="mt-12 border-b border-line md:mt-20"
      >
        {copy.perspectives.map((item, i) => (
          <li key={item.title} className="border-t border-line">
            <Link
              href={item.href}
              className="group grid gap-4 py-8 transition-colors md:grid-cols-12 md:gap-x-6 md:py-10"
            >
              <p className="label pt-2 text-ink-faint md:col-span-3">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-title transition-colors group-hover:text-accent-ink md:col-span-5">
                {item.title}
              </h3>
              <p className="text-ink-soft md:col-span-3">{item.summary}</p>
              <span className="flex items-start justify-end pt-2 md:col-span-1">
                <span className="sr-only">{copy.readLabel}</span>
                <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </Reveal>
      <ButtonLink href={copy.cta.href} tone="outline" className="mt-10">
        {copy.cta.label}
      </ButtonLink>
    </section>
  )
}
