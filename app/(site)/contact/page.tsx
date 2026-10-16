import type { Metadata } from "next"
import { PageEnd } from "@/components/site/page-end"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ContactDetails } from "@/components/contact/contact-details"
import { ContactForm } from "@/components/contact/contact-form"
import { contactPage } from "@/content/contact/content"
import { Container } from "@/components/landing/section"
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
   * The page is its own call to action, so it ends on the footer alone.
   *
   * It follows the theme like every other page. On wide screens the two
   * cards stack as the page scrolls: each pins under the header and the next
   * slides up over it.
   */
  return (
    <div className="relative flex min-h-svh w-full flex-col bg-paper text-ink">
      <SiteHeader />

      <Container className="grid flex-1 gap-16 pt-8 pb-6 lg:grid-cols-12 lg:items-start lg:gap-x-gutter">
        <div className="flex flex-col gap-16 lg:sticky lg:top-6 lg:col-span-4">
          {/*
           * The shared hero anatomy — badge, headline, lead — in its short
           * form: the form has to stay above the fold, so no full-height frame.
           * The column is sticky, so the reveal sits on its child, never the
           * column itself.
           */}
          <Reveal className="flex flex-col items-start gap-6">
            <Badge variant="brand">{copy.hero.badge}</Badge>
            <h1 className={cn("text-display", "text-ink")}>
              {copy.hero.title}
            </h1>
            <p className={cn("text-lede", "max-w-[60ch] text-ink/80")}>
              {copy.hero.intro}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="lg:sticky lg:top-24">
            <Reveal delay={0.1}>
              <ContactForm copy={copy.form} />
            </Reveal>
          </div>
          <div className="lg:sticky lg:top-28">
            <Reveal delay={0.15}>
              <ContactDetails heading={copy.details.heading} />
            </Reveal>
          </div>
        </div>
      </Container>
      <PageEnd className="mt-section" />
    </div>
  )
}
