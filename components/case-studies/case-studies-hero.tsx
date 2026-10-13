import { stats } from "@/components/landing/content"
import { FullHero, HeroPhoto, HeroRail } from "@/components/site/full-hero"

/**
 * An engagement in the field, the claim, and the impact numbers carrying the
 * "measurable" until the case studies arrive; a featured study can take this
 * slot then.
 */
function CaseStudiesHero() {
  return (
    <FullHero
      background={<HeroPhoto src="/images/pos-agent.jpg" position="50% 40%" />}
      badge="Case Studies"
      title="Real engagements. Measurable outcomes."
      lead="A portfolio of real engagements — spanning government, financial services, consumer goods, and agriculture — each delivering measurable, lasting outcomes."
      rail={
        <HeroRail as="dl" className="grid-cols-2">
          {stats.map((stat) => (
            // Label first in the markup, figure first on screen.
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-foreground/70 lg:text-base">
                {stat.label}
              </dt>
              <dd className="font-heading text-4xl leading-[0.9] text-foreground lg:text-6xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </HeroRail>
      }
    />
  )
}

export { CaseStudiesHero }
