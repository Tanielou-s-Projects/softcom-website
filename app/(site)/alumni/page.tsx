import type { Metadata } from "next"

import { AlumniForm } from "@/components/about/alumni-form"
import { AlumniIntro } from "@/components/about/alumni-intro"
import { ButtonLink } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { alumniPage } from "@/content/about/page-copy"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("alumniPage", alumniPage)
  return { title: "Alumni", description: copy.hero.lead }
}

/* Alumni: the invitation, then the sign-up the page closes on. */
export default async function AlumniPage() {
  const copy = await getPageContent("alumniPage", alumniPage)

  return (
    <>
      <PageHero
        label={copy.hero.badge}
        heading={copy.hero.title}
        intro={copy.hero.lead}
      >
        <ButtonLink href="#join" className="mt-8">
          {copy.hero.ctaLabel}
        </ButtonLink>
      </PageHero>
      <AlumniIntro
        copy={copy.intro}
        label={copy.hero.badge}
        imageAlt={copy.hero.imageAlt}
      />
      <AlumniForm copy={copy.form} />
    </>
  )
}
