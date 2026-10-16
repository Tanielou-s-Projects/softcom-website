import type { Metadata } from "next"
import { Journey } from "@/components/about/journey"
import { LineReveal } from "@/components/motion/line-reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { PageHero } from "@/components/site/page-hero"

import { cn } from "@/lib/utils"
import { aboutPage } from "@/content/about/page-copy"
import { News } from "@/components/about/news"
import { ButtonLink, ArrowLink } from "@/components/ui/button"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Container } from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { Team } from "@/components/landing/team"
import { PageEnd } from "@/components/site/page-end"
import { Section } from "@/components/site/section"
import { HeroHeader } from "@/components/landing/hero-header"
import { getLeaders } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("aboutPage", aboutPage)
  return { title: "About", description: copy.hero.lead }
}

/**
 * About. Sections sit one `gap-section` apart; the header floats over the hero
 * because it lives outside that column.
 */
export default async function Page() {
  const [leaders, copy] = await Promise.all([
    getLeaders(),
    getPageContent("aboutPage", aboutPage),
  ])

  return (
    <div className="relative flex min-h-svh w-full flex-col">
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <div className="flex flex-col gap-section">
        <div className="flex flex-col gap-section-tight">
          {/* Hero — the shared frame, over the circular team-photo band. */}
          <PageHero
            label={copy.hero.badge}
            heading={copy.hero.title}
            intro={copy.hero.lead}
          />

          <Section marks={false}>
            {/* Our Story — the headline on the left, the telling on the right. */}
            <Container className="grid-12 gap-y-10">
              <LineReveal
                as="h2"
                className="text-headline text-balance text-ink md:col-span-5"
              >
                {copy.story.heading}
              </LineReveal>
              <Reveal className="flex flex-col gap-4 md:col-span-6 md:col-start-7 md:pt-10">
                {copy.story.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className={cn("text-body", "text-ink-soft")}
                  >
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            </Container>
          </Section>
        </div>

        <Section id="journey">
          {/* Our Journey — the ruled timeline (renders its own header). */}
          <Journey copy={copy.journey} />
        </Section>

        <Section>
          {/* What guides our work — the same four values as the homepage. */}
          <Container className="flex flex-col gap-section-head">
            <SectionHeading heading={copy.values.heading} />
            <RevealStagger as="ol" className="flex flex-col gap-6">
              {copy.values.items.map((value, index) => (
                <RevealItem
                  as="li"
                  key={value.title}
                  className="grid-12 gap-y-2 border-t border-line pt-6"
                >
                  <p className="font-mono text-sm text-ink-soft md:col-span-3">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="flex flex-col gap-2 md:col-span-6">
                    <h3 className="font-heading text-xl text-ink">
                      {value.title}
                    </h3>
                    <p className={cn("text-body", "text-ink-soft")}>
                      {value.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealStagger>
          </Container>
        </Section>

        <Section>
          {/* The people and the impact numbers. */}
          <Team portraits={leaders} heading={copy.leadership.heading} />
        </Section>

        <Section>
          {/* Build with us — careers. */}
          <Container>
            <SectionHeading
              heading={copy.careers.heading}
              intro={copy.careers.body}
            >
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href={copy.careers.primaryHref} tone="ink">
                  {copy.careers.primaryLabel}
                </ButtonLink>
                <ArrowLink href={copy.careers.secondaryHref}>
                  {copy.careers.secondaryLabel}
                </ArrowLink>
              </div>
            </SectionHeading>
          </Container>
        </Section>

        <Section>
          {/* Latest news — V7-style list. */}
          <News copy={copy.news} />
        </Section>

        <PageEnd>
          <ClosingCta />
        </PageEnd>
      </div>
    </div>
  )
}
