import { LineReveal } from "@/components/motion/line-reveal"
import { DitherReveal } from "@/components/motion/dither-reveal"
import { ButtonLink } from "@/components/ui/button"
import type { SolutionsPage } from "@/content/solutions/page-copy"

/*
 * The page's last word, on the accent: for the reader who has seen all three
 * areas and still isn't sure which is theirs. The blue weaves in as it
 * arrives, as the numbers block does on Home.
 */
export function SolutionsClose({ copy }: { copy: SolutionsPage["close"] }) {
  return (
    <section className="shell mt-32 md:mt-48">
      <DitherReveal className="rounded-xl p-6 text-on-accent md:p-10">
        <div className="flex min-h-[26rem] flex-col justify-between gap-16 md:min-h-[32rem] md:flex-row md:items-end">
          <LineReveal as="h2" className="max-w-3xl text-display font-light">
            {copy.heading}
          </LineReveal>
          <div className="max-w-sm">
            <p className="text-lg">{copy.text}</p>
            <ButtonLink href={copy.ctaHref} tone="light" className="mt-8">
              {copy.ctaLabel}
            </ButtonLink>
          </div>
        </div>
      </DitherReveal>
    </section>
  )
}
