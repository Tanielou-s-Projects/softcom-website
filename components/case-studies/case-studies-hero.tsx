import { PageHero } from "@/components/site/page-hero"

/**
 * The page's opening statement.
 *
 * The shape this establishes — badge, claim, standfirst, on one full-height
 * plate — now lives in `PageHero`, shared with About, Alumni and Careers.
 */
function CaseStudiesHero() {
  return (
    <PageHero
      eyebrow="Case Studies"
      title="Real engagements. Measurable outcomes."
      lead="A portfolio of real engagements — spanning government, financial services, consumer goods, and agriculture — each delivering measurable, lasting outcomes."
    />
  )
}

export { CaseStudiesHero }
