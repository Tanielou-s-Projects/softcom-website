import { stats } from "@/content/home/content"
import { FullHero, HeroPhoto, HeroRail } from "@/components/site/full-hero"
import type { CaseStudiesPage } from "@/content/case-studies/page-copy"

/**
 * An engagement in the field, the claim, and the impact numbers carrying the
 * "measurable" until the case studies arrive; a featured study can take this
 * slot then.
 */
function CaseStudiesHero({ copy }: { copy: CaseStudiesPage["hero"] }) {
  return (
    <FullHero
      background={<HeroPhoto src={copy.image} position="50% 40%" />}
      badge={copy.badge}
      title={copy.title}
      lead={copy.lead}
      rail={
        <HeroRail as="dl" className="grid-cols-2">
          {stats.map((stat) => (
            // Label first in the markup, figure first on screen.
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-ink/70 lg:text-base">{stat.label}</dt>
              <dd className="font-heading text-4xl leading-[0.9] font-light text-ink lg:text-6xl">
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
