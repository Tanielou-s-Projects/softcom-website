import { DitherReveal } from "@/components/motion/dither-reveal"
import { LineReveal } from "@/components/motion/line-reveal"
import { ButtonLink } from "@/components/ui/button"
import type { AboutPage } from "@/content/about/page-copy"

/*
 * "Build with us": the About page's one full-colour block, pointing on to
 * Careers and Alumni. The blue weaves in on scroll, as Home's numbers do.
 */
export function JoinBand({ copy }: { copy: AboutPage["careers"] }) {
  return (
    <section className="shell mt-32 md:mt-48">
      <DitherReveal className="rounded-xl p-6 text-on-accent md:p-10">
        <div className="grid gap-10 md:grid-cols-12 md:gap-x-6">
          <LineReveal
            as="h2"
            className="text-display font-light text-balance md:col-span-7"
          >
            {copy.heading}
          </LineReveal>
          <p className="self-end text-lg md:col-span-4 md:col-start-9">
            {copy.body}
          </p>
        </div>
        <div className="mt-16 flex flex-wrap gap-2 border-t border-white/25 pt-6 md:mt-24">
          <ButtonLink href={copy.primaryHref} tone="light">
            {copy.primaryLabel}
          </ButtonLink>
          <ButtonLink href={copy.secondaryHref} tone="glass">
            {copy.secondaryLabel}
          </ButtonLink>
        </div>
      </DitherReveal>
    </section>
  )
}
