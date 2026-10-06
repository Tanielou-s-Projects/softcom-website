import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { sectors } from "@/components/landing/content"
import { SectorRow } from "@/components/landing/sector-row"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

function Sectors() {
  return (
    <Container className="flex flex-col gap-10 overflow-clip py-6 lg:gap-16">
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

      <Reveal asChild>
        <div>
          <Button asChild size="lg" className={primaryPill}>
            <Link href="/contact">Explore working with Softcom</Link>
          </Button>
        </div>
      </Reveal>
    </Container>
  )
}

export { Sectors }
