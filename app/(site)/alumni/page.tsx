import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"

import { cn } from "@/lib/utils"
import { alumniPage } from "@/content/about/page-copy"
import { AlumniForm } from "@/components/about/alumni-form"
import { ButtonLink } from "@/components/ui/button"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Container } from "@/components/landing/section"
import { PageEnd } from "@/components/site/page-end"
import { Section } from "@/components/site/section"
import { HeroHeader } from "@/components/landing/hero-header"
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
        <PageHero
          label={copy.hero.badge}
          heading={copy.hero.title}
          intro={copy.hero.lead}
        >
          <ButtonLink href="#join" tone="ink" className="mt-8">
            {copy.hero.ctaLabel}
          </ButtonLink>
        </PageHero>

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
