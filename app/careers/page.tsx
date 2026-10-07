import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { careers } from "@/components/about/content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClosingCta } from "@/components/landing/closing-cta"
import {
  Bleed,
  bodyText,
  Container,
  displayText,
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Careers",
  description: careers.paragraphs[0],
}

/** Careers — the invitation, the work, and the roles (none listed yet). */
export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <Container className="flex flex-col items-start gap-6 py-12">
        <Badge variant="brand">{careers.eyebrow}</Badge>
        <h1 className={cn(displayText, "max-w-[16ch] text-foreground")}>
          {careers.title}
        </h1>
        {careers.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className={cn(leadText, "max-w-[75ch] text-muted-foreground")}
          >
            {paragraph}
          </p>
        ))}
      </Container>

      <Container className="py-12">
        <Reveal className="flex flex-col gap-6 border-t border-border pt-12 lg:flex-row lg:gap-16">
          <h2 className={cn(headingText, "text-foreground lg:w-[40%]")}>
            {careers.work.heading}
          </h2>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {careers.work.paragraphs.map((paragraph) => (
              <p key={paragraph} className={cn(bodyText, "text-foreground")}>
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container id="roles" className="scroll-mt-24 py-12">
        <Reveal className="flex flex-col items-start gap-6 rounded-3xl bg-card p-8 lg:p-[47px]">
          <h2 className={cn(headingText, "text-foreground")}>
            {careers.roles.heading}
          </h2>
          <p className={cn(bodyText, "max-w-[60ch] text-muted-foreground")}>
            {careers.roles.empty}
          </p>
          <Button asChild size="lg" className={primaryPill}>
            <Link href={careers.roles.cta.href}>{careers.roles.cta.label}</Link>
          </Button>
        </Reveal>
      </Container>

      <Bleed className="flex flex-col gap-2.5 py-6">
        <ClosingCta />
        <SiteFooter />
      </Bleed>
    </div>
  )
}
