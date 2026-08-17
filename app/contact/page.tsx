import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import { ContactDetails } from "@/components/contact/contact-details"
import { ContactForm } from "@/components/contact/contact-form"
import { contactIntro } from "@/components/contact/content"
import { Container, displayText, leadText } from "@/components/landing/section"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Contact",
  description: contactIntro,
}

export default function Page() {
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

      <Container className="flex flex-1 flex-col gap-16 pt-32 pb-6 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex min-w-0 flex-1 flex-col gap-16 lg:sticky lg:top-6">
          {/*
           * 68px, a shade above the 64px display size the rest of the site uses
           * — the design sets this one line larger, on its own tight leading.
           */}
          <h1
            className={cn(
              displayText,
              "leading-[0.804] text-foreground lg:text-[4.25rem]"
            )}
          >
            Let&apos;s talk.
          </h1>

          <p className={cn(leadText, "leading-[1.6] text-foreground")}>
            {contactIntro}
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:w-[899px] lg:shrink-0">
          <ContactForm />
          <ContactDetails />
        </div>
      </Container>
    </div>
  )
}
