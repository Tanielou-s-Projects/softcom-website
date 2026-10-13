import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { alumniHero } from "@/components/about/content"
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

export const metadata: Metadata = {
  title: "Alumni",
  description: alumniHero.paragraphs[0],
}

/** Alumni — the invitation, then the sign-up. */
export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      {/* Floats over the full-bleed hero rather than taking a band above it. */}
      <HeroHeader />

      <FullHero
        background={
          <HeroPhoto
            src="/alumni/team.jpg"
            alt="The Softcom team gathered on a beach, waving and cheering at the camera"
            position="50% 85%"
            film="top"
          />
        }
        align="top"
        badge={alumniHero.eyebrow}
        title={alumniHero.title}
        lead={alumniHero.paragraphs[0]}
        rail={
          <HeroRail>
            <div>
              <Button asChild size="lg" className={primaryPill}>
                <Link href="#join">Join the network</Link>
              </Button>
            </div>
          </HeroRail>
        }
      />

      <Container className="flex flex-col items-start gap-6 py-16">
        {alumniHero.paragraphs.slice(1).map((paragraph) => (
          <p
            key={paragraph}
            className={cn(leadText, "max-w-[75ch] text-muted-foreground")}
          >
            {paragraph}
          </p>
        ))}
      </Container>

      <Container className="py-12">
        <AlumniForm />
      </Container>

      <Bleed className="mt-40 flex flex-col gap-2.5 py-6 lg:mt-64">
        <ClosingCta />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
