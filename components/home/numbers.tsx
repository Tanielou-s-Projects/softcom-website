import { CountUp } from "@/components/motion/count-up"
import { DitherReveal } from "@/components/motion/dither-reveal"
import { ButtonLink } from "@/components/ui/button"
import { withYears, type HomePage } from "@/content/home/page-copy"

/*
 * The proof: four figures on the accent, the only full-colour block. The blue
 * arrives in the site's dither as the block scrolls in, and the figures count
 * up as it settles.
 */
export function Numbers({ copy }: { copy: HomePage["numbers"] }) {
  return (
    <section className="shell mt-32 md:mt-48">
      <DitherReveal className="rounded-xl p-6 text-on-accent md:p-10">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {copy.items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col-reverse gap-10 border-t border-white/25 py-6 md:gap-24 md:border-t-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
            >
              <dt className="label text-signal">{item.label}</dt>
              <dd className="text-display font-light">
                <CountUp value={withYears(item.value)} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap gap-2 md:mt-16">
          <ButtonLink href={copy.primaryCta.href} tone="light">
            {copy.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={copy.secondaryCta.href} tone="glass">
            {copy.secondaryCta.label}
          </ButtonLink>
        </div>
      </DitherReveal>
    </section>
  )
}
