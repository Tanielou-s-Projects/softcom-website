import { ImagePlaceholder } from "@/components/ui/image-placeholder"

import { ButtonLink } from "@/components/ui/button"
import type { HomePage } from "@/content/home/page-copy"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"

/*
 * The headline set large across the lower left of a full-height stage, under
 * a drawn four-column grid of the same hairlines the rest of the site uses.
 * The stage is an image placeholder until the new photography is chosen.
 */
export function Hero({ copy }: { copy: HomePage["hero"] }) {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden">
      <ImagePlaceholder
        reveal={false}
        label={copy.portalImageAlt}
        className="absolute inset-0 -z-10 items-start pt-[30svh] ring-0"
      />

      <div
        aria-hidden="true"
        className="shell pointer-events-none absolute inset-0 grid grid-cols-2 md:grid-cols-4"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="border-l border-line last:border-r max-md:[&:nth-child(2)]:border-r max-md:[&:nth-child(n+3)]:hidden"
          />
        ))}
      </div>

      <div className="shell relative pb-10 md:pb-14">
        <LineReveal
          as="h1"
          immediate
          delay={0.2}
          className="text-display font-light"
        >
          <span className="block">
            {copy.headlineFirstLine} {copy.headlineSecondLine}
          </span>
          <span className="block text-ink-faint">
            {copy.progressFirstLine} {copy.progressSecondLine}
          </span>
        </LineReveal>
        <Reveal
          immediate
          delay={0.7}
          className="mt-10 flex flex-wrap gap-2 md:mt-14"
        >
          <ButtonLink href={copy.primaryCta.href} tone="accent">
            {copy.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={copy.secondaryCta.href} tone="outline">
            {copy.secondaryCta.label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  )
}
