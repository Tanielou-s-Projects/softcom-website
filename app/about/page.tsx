import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { aboutHero, principles, story } from "@/components/about/content"
import { values } from "@/components/landing/content"
import { AboutHero } from "@/components/about/about-hero"
import { JourneyTimeline } from "@/components/about/journey-timeline"
import { News } from "@/components/about/news"
import { Button } from "@/components/ui/button"
import { ClosingCta } from "@/components/landing/closing-cta"
import {
  Bleed,
  bodyText,
  Container,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { Team } from "@/components/landing/team"
import { SiteFooter } from "@/components/site/site-footer"
import { BlueprintGrid } from "@/components/site/blueprint-grid"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "About",
  description: aboutHero.lead,
}

/**
 * About. Sections sit 240px apart (the `gap-60` wrapper); the header stays tight
 * to the hero because it lives outside that wrapper, and the team's impact
 * numbers stay close to the portraits via the Team component's own internal gap.
 */
export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col">
      <BlueprintGrid />
      <SiteHeader />

      <div className="flex flex-col gap-60">
        {/* Hero — Apollo-style statement over a circular team-photo band. */}
        <AboutHero />

        {/* Our Story */}
        <Container className="flex flex-col gap-6">
          <Reveal className="flex flex-col gap-6">
            <h2 className={cn(headingText, "max-w-[24ch] text-foreground")}>
              {story.heading}
            </h2>
            <Link
              href={story.cta.href}
              className="text-sm underline underline-offset-4"
            >
              {story.cta.label}
            </Link>
            <div className="flex max-w-[75ch] flex-col gap-4">
              {story.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className={cn(bodyText, "text-muted-foreground")}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </Container>

        {/* Our Journey — the V7-style ruler timeline (renders its own header). */}
        <Container>
          <JourneyTimeline reveal="side" />
        </Container>

        {/* What guides our work — the same four values as the homepage. */}
        <Container className="flex flex-col gap-8">
          <Reveal asChild>
            <h2 className={cn(headingText, "text-foreground")}>
              {principles.heading}
            </h2>
          </Reveal>
          <RevealStagger as="ol" className="flex flex-col gap-6">
            {values.map((value, index) => (
              <RevealItem
                as="li"
                key={value.title}
                className="grid gap-2 border-t border-border pt-6 sm:grid-cols-[4rem_1fr] sm:gap-8"
              >
                <p className="font-mono text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="flex max-w-[70ch] flex-col gap-2">
                  <h3 className="font-heading text-xl text-foreground">
                    {value.title}
                  </h3>
                  <p className={cn(bodyText, "text-muted-foreground")}>
                    {value.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </Container>

        {/* The people and the impact numbers. */}
        <Team />

        {/* Build with us — careers. */}
        <Container>
          <Reveal className="flex flex-col items-start gap-6 lg:max-w-[684px]">
            <h2 className={cn(headingText, "text-foreground")}>
              Build with us.
            </h2>
            <p className={cn(bodyText, "text-muted-foreground")}>
              Bring original thinking, an innovator&rsquo;s mindset and a strong
              sense of ownership. Work alongside exceptional peers whose
              expertise complements yours and expands what you can achieve.
            </p>
            <Button asChild size="lg" className={primaryPill}>
              <Link href="/careers">Explore careers at Softcom</Link>
            </Button>
          </Reveal>
        </Container>

        {/* Latest news — V7-style list. */}
        <News />

        <Bleed className="flex flex-col gap-2.5 py-6">
          <ClosingCta />
          <SiteFooter />
        </Bleed>
      </div>
    </div>
  )
}
