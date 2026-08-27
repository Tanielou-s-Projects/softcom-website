import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import { alumniFamily, alumniHero } from "@/components/about/content"
import { ClosingCta } from "@/components/landing/closing-cta"
import {
  Bleed,
  bodyText,
  Container,
  displayText,
  headingText,
  leadText,
} from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Alumni",
  description: alumniHero.lead,
}

const eyebrow =
  "text-xs font-medium uppercase tracking-widest text-muted-foreground"

/** Alumni — bare-bones scaffold. */
export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <Container className="flex flex-col gap-6 py-12">
        <p className={eyebrow}>{alumniHero.eyebrow}</p>
        <h1 className={cn(displayText, "max-w-[16ch] text-foreground")}>
          {alumniHero.title}
        </h1>
        <p className={cn(leadText, "max-w-[75ch] text-muted-foreground")}>
          {alumniHero.lead}
        </p>
      </Container>

      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-2">
          <p className={eyebrow}>{alumniFamily.eyebrow}</p>
          <h2 className={cn(headingText, "max-w-[40ch] text-foreground")}>
            {alumniFamily.heading}
          </h2>
        </div>
        <dl className="grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
          {alumniFamily.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <dd className="font-heading text-4xl text-foreground lg:text-5xl">
                {stat.value}
              </dd>
              <dt className={cn(bodyText, "text-muted-foreground")}>
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>

      <Bleed className="flex flex-col gap-2.5 py-6">
        <ClosingCta variant="build" />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
