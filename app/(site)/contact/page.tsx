import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ContactDetails } from "@/components/contact/contact-details"
import { ContactForm } from "@/components/contact/contact-form"
import { contactPage } from "@/content/contact/content"
import { Container, displayText, leadText } from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { SiteHeader } from "@/components/site/site-header"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("contactPage", contactPage)
  return { title: "Contact", description: copy.hero.intro }
}

export default async function Page() {
  const copy = await getPageContent("contactPage", contactPage)

  /*
   * The one page that closes on itself: the design gives it neither the shared
   * CTA panel nor the footer, because the whole page is the call to action.
   *
   * Scoped `dark` for the same reason as the CTA panel — the plate is brand blue
   * in either theme, so the copy on it has to stay light.
   *
   * `text-foreground` has to be set here alongside it: `dark` only redefines the
   * tokens, it sets no colour of its own. Anything under it that inherits its
   * colour rather than declaring one — `Label` and the fields, in this case —
   * would otherwise keep the light theme's near-black body colour and disappear
   * against these cards.
   */
  return (
    <div className="dark relative flex min-h-svh w-full flex-col bg-brand-blue text-foreground">
      <SiteHeader />

      <Container className="flex flex-1 flex-col gap-16 pt-8 pb-6 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex min-w-0 flex-1 flex-col gap-16 lg:sticky lg:top-6">
          {/*
           * The shared hero anatomy — badge, headline, lead — in its short
           * form: the form has to stay above the fold, so no full-height frame.
           * The column is sticky, so the reveal sits on its child, never the
           * column itself.
           */}
          <Reveal className="flex flex-col items-start gap-6">
            <Badge variant="brand">{copy.hero.badge}</Badge>
            <h1 className={cn(displayText, "text-foreground")}>
              {copy.hero.title}
            </h1>
            <p className={cn(leadText, "max-w-[60ch] text-foreground/80")}>
              {copy.hero.intro}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-6 lg:w-[68%] lg:shrink-0">
          <Reveal delay={0.1}>
            <ContactForm copy={copy.form} />
          </Reveal>
          <Reveal delay={0.15}>
            <ContactDetails heading={copy.details.heading} />
          </Reveal>
        </div>
      </Container>
    </div>
  )
}
