import { Container } from "@/components/landing/section"
import { sectors, type Sector } from "@/content/home/content"
import type { HomePage } from "@/content/home/page-copy"
import { PartnerLogos } from "@/components/landing/partner-logos"
import { SectorRow } from "@/components/landing/sector-row"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

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
    <Container className="flex flex-col gap-10 overflow-clip lg:gap-16">
      <Reveal asChild>
        <header className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
          <h2 className={cn("text-headline", "text-ink lg:w-[61%]")}>
            {copy.heading}
          </h2>
          <p className={cn("text-body", "min-w-0 flex-1 text-ink")}>
            {copy.intro}
          </p>
        </header>
      </Reveal>

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
