import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { alumniPage } from "@/content/about/page-copy"
import { AlumniForm } from "@/components/about/alumni-form"
import { Button } from "@/components/ui/button"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Container, primaryPill } from "@/components/landing/section"
import { PageEnd } from "@/components/site/page-end"
import { Section } from "@/components/site/section"
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
    <div className="relative flex min-h-svh w-full flex-col gap-section bg-paper">
      {/* Floats over the full-bleed hero rather than taking a band above it. */}
      <HeroHeader />

      <div className="flex flex-col gap-section-tight">
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

        <Container className="flex flex-col items-start gap-6">
          {copy.intro.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className={cn("text-lede", "max-w-[75ch] text-ink-soft")}
            >
              {paragraph}
            </p>
          ))}
        </Container>
      </div>

      <Section>
        <Container>
          <AlumniForm copy={copy.form} />
        </Container>
      </Section>

      <PageEnd>
        <ClosingCta />
      </PageEnd>
    </div>
  )
}
