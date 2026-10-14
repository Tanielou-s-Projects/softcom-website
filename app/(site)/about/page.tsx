import type { Metadata } from "next"

import { Journey } from "@/components/about/journey"
import { JoinBand } from "@/components/about/join-band"
import { Leadership } from "@/components/about/leadership"
import { News } from "@/components/about/news"
import { PageIndex } from "@/components/about/page-index"
import { Principles } from "@/components/about/principles"
import { Story } from "@/components/about/story"
import { ClosingCta } from "@/components/home/closing-cta"
import { PageHero } from "@/components/site/page-hero"
import { leaders as fallbackLeaders } from "@/content/about/content"
import { aboutPage } from "@/content/about/page-copy"
import { getNavigation } from "@/content/site/get-navigation"
import { getLeaders } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("aboutPage", aboutPage)
  return { title: "About", description: copy.hero.lead }
}

export default async function AboutPage() {
  const [copy, leaders, navigation] = await Promise.all([
    getPageContent("aboutPage", aboutPage),
    getLeaders(),
    getNavigation(),
  ])

  /* Sanity's leaders when there are any, the deck's names until then. */
  const people = leaders.length ? leaders : fallbackLeaders

  return (
    <>
      <PageHero
        label={copy.hero.badge}
        heading={copy.hero.title}
        intro={copy.hero.lead}
      >
        <PageIndex
          label="On this page"
          items={[
            { label: "Our story", href: "#story" },
            { label: copy.journey.heading, href: "#journey" },
            { label: "Principles", href: "#principles" },
            { label: "Leadership", href: "#team" },
            { label: copy.news.label, href: "#news" },
          ]}
        />
      </PageHero>
      <Story copy={copy.story} images={copy.hero.images} />
      <Journey copy={copy.journey} />
      <Principles copy={copy.values} />
      <Leadership copy={copy.leadership} people={people} />
      <JoinBand copy={copy.careers} />
      <News copy={copy.news} />
      <ClosingCta copy={navigation.closingCtas.home} />
    </>
  )
}
