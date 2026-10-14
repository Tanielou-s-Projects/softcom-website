import { LineReveal } from "@/components/motion/line-reveal"
import { ButtonLink } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { Navigation } from "@/content/site/chrome-copy"

type Cta = Navigation["closingCtas"]["careers"]

/*
 * The people-forward close the rest of the site carries: Home's image panel,
 * but with its lead set as a paragraph under the heading, since this copy is
 * a sentence or two rather than a one-line label.
 */
export function CaseStudiesClose({ copy }: { copy: Cta }) {
  return (
    <section className="shell mt-32 md:mt-48">
      <div className="relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden rounded-xl p-6 md:min-h-[40rem] md:p-10">
        <ImagePlaceholder className="absolute inset-0 -z-10 items-start pt-24" />
        <LineReveal as="h2" className="max-w-4xl text-display font-light">
          {copy.heading}
        </LineReveal>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">{copy.lead}</p>
        <ButtonLink href={copy.buttonHref} className="mt-10 self-start">
          {copy.buttonLabel}
        </ButtonLink>
      </div>
    </section>
  )
}
