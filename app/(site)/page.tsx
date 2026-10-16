import Link from "next/link"

import { Approach } from "@/components/landing/approach"
import { Capabilities } from "@/components/landing/capabilities"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Hero } from "@/components/landing/hero"
import { Insights } from "@/components/landing/insights"
import { Sectors } from "@/components/landing/sectors"
import { Stats } from "@/components/landing/stats"
import { ghostPill, primaryPill } from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { PageEnd } from "@/components/site/page-end"
import { Section } from "@/components/site/section"
import { homePage } from "@/content/home/page-copy"
import { getPageContent } from "@/sanity/lib/page-content"

export default async function Page() {
  const copy = await getPageContent("homePage", homePage)

  return (
    /* The gap is the only space between sections (globals.css, --section). */
    <div className="relative flex min-h-svh w-full flex-col gap-section">
      <Hero copy={copy.hero} />
      <Section>
        <Capabilities copy={copy.focusAreas} />
      </Section>
      <Section>
        <Sectors copy={copy.whoWeWorkWith} partners={copy.partners} />
      </Section>
      {/*
       * No heading: the 19-year tile already says it. The sectors' call to
       * action moved here, so it lands after the proof rather than the pitch.
       */}
      <Section>
        <Stats items={copy.numbers.items}>
          <Reveal className="flex flex-wrap items-center gap-2">
            <Button asChild size="lg" className={primaryPill}>
              <Link href={copy.numbers.primaryCta.href}>
                {copy.numbers.primaryCta.label}
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className={ghostPill}>
              <Link href={copy.numbers.secondaryCta.href}>
                {copy.numbers.secondaryCta.label}
              </Link>
            </Button>
          </Reveal>
        </Stats>
      </Section>
      <Section>
        <Approach copy={copy.approach} />
      </Section>
      <Section>
        <Insights copy={copy.ourThinking} />
      </Section>

      <PageEnd>
        <ClosingCta />
      </PageEnd>
    </div>
  )
}
