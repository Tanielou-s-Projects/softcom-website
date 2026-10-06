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
  displayText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

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
      <SiteHeader />

      <Container className="flex flex-col items-start gap-6 py-12">
        <p className={eyebrow}>{alumniHero.eyebrow}</p>
        <h1 className={cn(displayText, "max-w-[16ch] text-foreground")}>
          {alumniHero.title}
        </h1>
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
