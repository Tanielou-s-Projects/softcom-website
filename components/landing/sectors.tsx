import { Container } from "@/components/landing/section"
import { SectionHeading } from "@/components/site/section-heading"
import { sectors, type Sector } from "@/content/home/content"
import type { HomePage } from "@/content/home/page-copy"
import { PartnerLogos } from "@/components/landing/partner-logos"
import { SectorRow } from "@/components/landing/sector-row"
import { Reveal } from "@/components/motion/reveal"

function Sectors({
  copy,
  partners,
}: {
  copy: HomePage["whoWeWorkWith"]
  partners: HomePage["partners"]
}) {
  // Copy from the CMS; each card's id and tone stay with the design.
  const cards: Sector[] = copy.sectors.map((sector, index) => ({
    ...sector,
    id: sectors[index]?.id ?? `sector-${index}`,
    tone: sectors[index]?.tone ?? "neutral",
  }))

  return (
    <Container className="flex flex-col gap-section-head overflow-clip">
      <SectionHeading heading={copy.heading} intro={copy.intro} />

      {/*
       * Link targets are a pending content ask (sector → solutions /
       * case-study mapping).
       */}
      <SectorRow sectors={cards} />

      <Reveal>
        <PartnerLogos copy={partners} className="pt-6 lg:pt-10" />
      </Reveal>
    </Container>
  )
}

export { Sectors }
