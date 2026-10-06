import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { alumniHero } from "@/components/about/content"
import { AlumniForm } from "@/components/about/alumni-form"
import { AlumniHero } from "@/components/about/alumni-hero"
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

export const metadata: Metadata = {
  title: "Alumni",
  description: alumniHero.paragraphs[0],
}

const eyebrow =
  "text-xs font-medium uppercase tracking-widest text-muted-foreground"

/** Alumni — the invitation, then the sign-up. */
export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      {/* Floats over the full-bleed hero rather than taking a band above it. */}
      <HeroHeader />

      <AlumniHero
        video="/alumni/team.mp4"
        poster="/alumni/team-poster.jpg"
        alt="The Softcom team gathered on a beach, waving and cheering at the camera"
        title={alumniHero.title}
      />

      <Container className="flex flex-col items-start gap-6 py-16">
        <p className={eyebrow}>{alumniHero.eyebrow}</p>
        {alumniHero.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className={cn(leadText, "max-w-[75ch] text-muted-foreground")}
          >
            {paragraph}
          </p>
        ))}
        <Button asChild size="lg" className={primaryPill}>
          <Link href={alumniHero.cta.href}>{alumniHero.cta.label}</Link>
        </Button>
      </Container>

      <Container className="py-12">
        <AlumniForm />
      </Container>

      <Bleed className="flex flex-col gap-2.5 py-6">
        <ClosingCta />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
