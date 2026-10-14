import { DitherReveal } from "@/components/motion/dither-reveal"
import { LineReveal } from "@/components/motion/line-reveal"
import { ButtonLink } from "@/components/ui/button"

/*
 * The products pages' last word, on the accent: a heading, the sentence
 * under it and the one ask. The blue weaves in as the block scrolls up.
 */
export function ProductsClose({
  label,
  heading,
  text,
  cta,
  secondary,
}: {
  label?: string
  heading: string
  text?: string
  cta: { label: string; href: string }
  secondary?: { label: string; href: string }
}) {
  return (
    <section className="shell mt-32 md:mt-48">
      <DitherReveal className="rounded-xl p-6 text-on-accent md:p-10">
        <div className="grid gap-10 md:min-h-[28rem] md:grid-cols-12 md:gap-x-6">
          <div className="flex flex-col md:col-span-8">
            {label && <p className="label text-signal">{label}</p>}
            <LineReveal
              as="h2"
              className="mt-4 text-display font-light text-balance md:mt-auto"
            >
              {heading}
            </LineReveal>
          </div>
          <div className="flex flex-col justify-end md:col-span-4">
            {text && <p className="text-lg text-white/80">{text}</p>}
            <div className="mt-8 flex flex-wrap gap-2">
              <ButtonLink href={cta.href} tone="light">
                {cta.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} tone="glass">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </DitherReveal>
    </section>
  )
}
