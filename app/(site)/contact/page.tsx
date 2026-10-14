import type { Metadata } from "next"

import { ContactDetails } from "@/components/contact/contact-details"
import { ContactForm } from "@/components/contact/contact-form"
import { Reveal } from "@/components/motion/reveal"
import { PageHero } from "@/components/site/page-hero"
import { contactPage } from "@/content/contact/content"
import { getSettings } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("contactPage", contactPage)
  return { title: "Contact", description: copy.hero.intro }
}

/*
 * The one page that is its own call to action, so it closes on the form
 * rather than the shared closing panel: details in a ruled column on the
 * left, the message form given the wider span on the right.
 */
export default async function ContactPage() {
  const [copy, settings] = await Promise.all([
    getPageContent("contactPage", contactPage),
    getSettings(),
  ])

  return (
    <>
      <PageHero
        label={copy.hero.badge}
        heading={copy.hero.title}
        intro={copy.hero.intro}
      />
      <section className="shell mt-12 grid gap-20 md:mt-16 md:grid-cols-12 md:gap-x-6">
        <Reveal className="order-2 md:order-none md:col-span-4">
          <ContactDetails heading={copy.details.heading} settings={settings} />
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-7 md:col-start-6">
          <ContactForm copy={copy.form} />
        </Reveal>
      </section>
    </>
  )
}
