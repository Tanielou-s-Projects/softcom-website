import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { alumniPage } from "@/components/about/page-copy"
import { AlumniForm } from "@/components/about/alumni-form"
import { Button } from "@/components/ui/button"
import { ClosingCta } from "@/components/landing/closing-cta"
import {
  Bleed,
  Container,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { HeroHeader } from "@/components/landing/hero-header"
import { FullHero, HeroPhoto, HeroRail } from "@/components/site/full-hero"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("alumniPage", alumniPage)
  return { title: "Alumni", description: copy.hero.lead }
}

/** Alumni — the invitation, then the sign-up. */
export default async function Page() {
  const copy = await getPageContent("alumniPage", alumniPage)

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      {/* Floats over the full-bleed hero rather than taking a band above it. */}
      <HeroHeader />

      <FullHero
        background={
          <HeroPhoto
            src={copy.hero.image}
            alt={copy.hero.imageAlt}
            position="50% 85%"
            film="top"
          />
        }
        align="top"
        badge={copy.hero.badge}
        title={copy.hero.title}
        lead={copy.hero.lead}
        rail={
          <HeroRail>
            <div>
              <Button asChild size="lg" className={primaryPill}>
                <Link href="#join">{copy.hero.ctaLabel}</Link>
              </Button>
            </div>
          </HeroRail>
        }
      />

      <Container className="flex flex-col items-start gap-6 py-16">
        {copy.intro.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className={cn(leadText, "max-w-[75ch] text-muted-foreground")}
          >
            {paragraph}
          </p>
        ))}
      </Container>

      <Container className="py-12">
        <AlumniForm copy={copy.form} />
      </Container>

      <Bleed className="mt-40 flex flex-col gap-2.5 py-6 lg:mt-64">
        <ClosingCta />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
