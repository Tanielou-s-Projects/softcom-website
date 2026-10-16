import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { aboutPage } from "@/content/about/page-copy"
import { AboutHero } from "@/components/about/about-hero"
import { JourneyTimeline } from "@/components/about/journey-timeline"
import { News } from "@/components/about/news"
import { Button } from "@/components/ui/button"
import { ClosingCta } from "@/components/landing/closing-cta"
import {
  bodyText,
  Container,
  ghostPill,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { Team } from "@/components/landing/team"
import { PageEnd } from "@/components/site/page-end"
import { HeroHeader } from "@/components/landing/hero-header"
import { getLeaders } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("aboutPage", aboutPage)
  return { title: "About", description: copy.hero.lead }
}

/**
 * About. Sections sit 240px apart (the `gap-60` wrapper); the header stays tight
 * to the hero because it lives outside that wrapper, and the team's impact
 * numbers stay close to the portraits via the Team component's own internal gap.
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

      <div className="flex flex-col gap-60">
        {/* Hero — the shared frame, over the circular team-photo band. */}
        <AboutHero copy={copy.hero} />

        {/* Our Story */}
        <Container className="flex flex-col gap-6">
          <Reveal className="flex flex-col gap-6">
            <h2 className={cn(headingText, "max-w-[24ch] text-ink")}>
              {copy.story.heading}
            </h2>
            <div className="flex max-w-[75ch] flex-col gap-4">
              {copy.story.paragraphs.map((paragraph) => (
                <p key={paragraph} className={cn(bodyText, "text-ink-soft")}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </Container>

        {/* Our Journey — the V7-style ruler timeline (renders its own header). */}
        <Container>
          <JourneyTimeline reveal="side" copy={copy.journey} />
        </Container>

        {/* What guides our work — the same four values as the homepage. */}
        <Container className="flex flex-col gap-8">
          <Reveal asChild>
            <h2 className={cn(headingText, "text-ink")}>
              {copy.values.heading}
            </h2>
          </Reveal>
          <RevealStagger as="ol" className="flex flex-col gap-6">
            {copy.values.items.map((value, index) => (
              <RevealItem
                as="li"
                key={value.title}
                className="grid gap-2 border-t border-line pt-6 sm:grid-cols-[4rem_1fr] sm:gap-8"
              >
                <p className="font-mono text-sm text-ink-soft">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="flex max-w-[70ch] flex-col gap-2">
                  <h3 className="font-heading text-xl text-ink">
                    {value.title}
                  </h3>
                  <p className={cn(bodyText, "text-ink-soft")}>
                    {value.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>

        {/* The people and the impact numbers. */}
        <Team portraits={leaders} heading={copy.leadership.heading} />

        {/* Build with us — careers. */}
        <Container>
          <Reveal className="flex flex-col items-start gap-6 lg:max-w-[684px]">
            <h2 className={cn(headingText, "text-ink")}>
              {copy.careers.heading}
            </h2>
            <p className={cn(bodyText, "text-ink-soft")}>{copy.careers.body}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild size="lg" className={primaryPill}>
                <Link href={copy.careers.primaryHref}>
                  {copy.careers.primaryLabel}
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className={ghostPill}>
                <Link href={copy.careers.secondaryHref}>
                  {copy.careers.secondaryLabel}
                </Link>
              </Button>
            </div>
          </Reveal>
        </Container>

        {/* Latest news — V7-style list. */}
        <News copy={copy.news} />

        <PageEnd>
          <ClosingCta />
        </PageEnd>
      </div>
    </div>
  )
}
