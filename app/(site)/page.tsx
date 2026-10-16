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
import { homePage } from "@/components/landing/home-copy"
import { getPageContent } from "@/sanity/lib/page-content"

export default async function Page() {
  const copy = await getPageContent("homePage", homePage)

  return (
    /*
     * One spacing rhythm: the gap is the only space between sections — the
     * sections carry no vertical padding of their own — so every visible gap
     * is the same 144px / 256px.
     */
    <div className="relative flex min-h-svh w-full flex-col gap-36 lg:gap-64">
      <Hero copy={copy.hero} />
      <Capabilities copy={copy.focusAreas} />
      <Sectors copy={copy.whoWeWorkWith} partners={copy.partners} />
      {/*
       * No heading: the 19-year tile already says it. The sectors' call to
       * action moved here, so it lands after the proof rather than the pitch.
       */}
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
      <Approach copy={copy.approach} />
      <Insights copy={copy.ourThinking} />

      <PageEnd className="mt-16 lg:mt-24">
        <ClosingCta />
      </PageEnd>
    </div>
  )
}
