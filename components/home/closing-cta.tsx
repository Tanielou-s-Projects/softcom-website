import { ButtonLink } from "@/components/ui/button"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import type { Navigation } from "@/content/site/chrome-copy"
import { LineReveal } from "@/components/motion/line-reveal"

type Cta = Navigation["closingCtas"]["home"]

/* A page's last word: a full-width image panel with one question and one door. */
export function ClosingCta({ copy }: { copy: Cta }) {
  return (
    <section className="shell mt-32 md:mt-48">
      <div className="relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden rounded-xl p-6 md:min-h-[40rem] md:p-10">
        <ImagePlaceholder className="absolute inset-0 -z-10 items-start pt-24" />
        <p className="label text-ink-soft">{copy.lead}</p>
        <LineReveal as="h2" className="mt-4 max-w-4xl text-display font-light">
          {copy.heading}
        </LineReveal>
        <ButtonLink href={copy.buttonHref} className="mt-10 self-start">
          {copy.buttonLabel}
        </ButtonLink>
      </div>
    </section>
  )
}
