import { Approach } from "@/components/home/approach"
import { ClosingCta } from "@/components/home/closing-cta"
import { FocusAreas } from "@/components/home/focus-areas"
import { Hero } from "@/components/home/hero"
import { Mission } from "@/components/home/mission"
import { Numbers } from "@/components/home/numbers"
import { OurThinking } from "@/components/home/our-thinking"
import { Sectors } from "@/components/home/sectors"
import { Statement } from "@/components/home/statement"
import { homePage } from "@/content/home/page-copy"
import { getNavigation } from "@/content/site/get-navigation"
import { getPageContent } from "@/sanity/lib/page-content"

export default async function HomePage() {
  const [copy, navigation] = await Promise.all([
    getPageContent("homePage", homePage),
    getNavigation(),
  ])

  return (
    <>
      <Hero
        copy={copy.hero}
        chips={[copy.numbers.items[0], copy.numbers.items[3]].filter(Boolean)}
      />
      <Statement copy={copy.hero} />
      <Mission copy={copy.mission} />
      <FocusAreas copy={copy.focusAreas} />
      <Sectors copy={copy.whoWeWorkWith} partners={copy.partners} />
      <Numbers copy={copy.numbers} />
      <Approach copy={copy.approach} />
      <OurThinking copy={copy.ourThinking} />
      <ClosingCta copy={navigation.closingCtas.home} />
    </>
  )
}
