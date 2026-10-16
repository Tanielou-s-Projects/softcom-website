import * as React from "react"

import { Container } from "@/components/landing/section"
import { sectors, type Sector } from "@/content/home/content"
import type { HomePage } from "@/content/home/page-copy"
import { PartnerLogos } from "@/components/landing/partner-logos"
import { SectorMark } from "@/components/landing/sector-mark"
import { Reveal } from "@/components/motion/reveal"
import { RiseCards } from "@/components/motion/rise-cards"
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
       * The rebuild's sector cards: title and dot-matrix mark up top, the
       * description and tags settled at the bottom, rising into place as the
       * row comes up the screen. Link targets are a pending content ask
       * (sector → solutions / case-study mapping).
       */}
      <RiseCards
        className="grid gap-2 md:grid-cols-3"
        itemClassName="flex flex-col rounded-xl bg-surface p-6 md:min-h-[26rem] md:p-8"
      >
        {cards.map((sector) => (
          <React.Fragment key={sector.id}>
            <div className="flex items-start justify-between gap-6">
              <h3 className="text-title whitespace-pre-line text-ink">
                {sector.title}
              </h3>
              <SectorMark
                src={sector.silhouette}
                tone={sector.tone}
                className="w-20 shrink-0 md:w-24"
              />
            </div>
            <p className="mt-auto pt-10 text-body text-ink-soft md:pt-16">
              {sector.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {sector.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 text-sm text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </RiseCards>

      <Reveal>
        <PartnerLogos copy={partners} className="pt-6 lg:pt-10" />
      </Reveal>
    </Container>
  )
}

export { Sectors }
