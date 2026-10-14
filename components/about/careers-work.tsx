import { Crosshairs } from "@/components/ui/crosshairs"
import type { CareersPage } from "@/content/about/page-copy"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"

/* The work on offer: the claim on the left, what it asks of you on the right. */
export function CareersWork({ copy }: { copy: CareersPage["work"] }) {
  return (
    <section className="mt-32 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-x-6">
        <LineReveal
          as="h2"
          className="text-headline font-normal text-balance md:col-span-6"
        >
          {copy.heading}
        </LineReveal>
        <Reveal stagger className="md:col-span-5 md:col-start-8">
          {copy.paragraphs.map((p, i) => (
            <p
              key={p}
              className={
                i === 0 ? "text-xl tracking-[-0.01em]" : "mt-6 text-ink-soft"
              }
            >
              {p}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
