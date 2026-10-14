import type { Metadata } from "next"

import { CareersIntro } from "@/components/about/careers-intro"
import { CareersWork } from "@/components/about/careers-work"
import { Principles } from "@/components/about/principles"
import { Roles } from "@/components/about/roles"
import { ButtonLink } from "@/components/ui/button"
import { PageHero } from "@/components/site/page-hero"
import { aboutPage, careersPage } from "@/content/about/page-copy"
import { getRoles } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("careersPage", careersPage)
  return { title: "Careers", description: copy.hero.lead }
}

export default async function CareersPage() {
  const [copy, about, roles] = await Promise.all([
    getPageContent("careersPage", careersPage),
    getPageContent("aboutPage", aboutPage),
    getRoles(),
  ])

  return (
    <>
      <PageHero
        label={copy.hero.badge}
        heading={copy.hero.title}
        intro={copy.hero.lead}
      >
        <ButtonLink href="#roles" className="mt-8">
          {copy.hero.ctaLabel}
        </ButtonLink>
      </PageHero>
      <CareersIntro copy={copy.intro} label={copy.hero.badge} />
      <CareersWork copy={copy.work} />
      {/* The same principles as About: what working here asks of you. */}
      <Principles copy={about.values} />
      {/* The page closes on the roles; their empty state carries the CTA. */}
      <Roles copy={copy.roles} roles={roles} />
    </>
  )
}
