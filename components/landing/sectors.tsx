import { bodyText, Container, headingText } from "@/components/landing/section"
import { sectors } from "@/components/landing/content"
import { PartnerLogos } from "@/components/landing/partner-logos"
import { SectorRow } from "@/components/landing/sector-row"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

function Sectors() {
  return (
    <Container className="flex flex-col gap-10 overflow-clip lg:gap-16">
      <Reveal asChild>
        <header className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
          <h2 className={cn(headingText, "text-foreground lg:w-[61%]")}>
            Who we work with
          </h2>
          <p className={cn(bodyText, "min-w-0 flex-1 text-foreground")}>
            Different organisations have different ambitions. Some have a
            precise requirement, others have a challenge to work through or a
            possibility to explore.
          </p>
        </header>
      </Reveal>

      {/*
       * Card link targets are a pending content ask (sector → solutions /
       * case-study mapping); the cards are structured to take a Link but
       * render as plain blocks until then.
       */}
      <SectorRow sectors={sectors} />

      <Reveal>
        <PartnerLogos className="pt-6 lg:pt-10" />
      </Reveal>
    </Container>
  )
}

export { Sectors }
