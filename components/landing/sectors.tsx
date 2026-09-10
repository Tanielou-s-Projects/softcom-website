import { bodyText, Container, headingText } from "@/components/landing/section"
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
            The institutions that move Africa forward.
          </h2>
          <p className={cn(bodyText, "min-w-0 flex-1 text-foreground")}>
            We partner with the organization responsible for the systems,
            services, and infrastructure that millions depend on
          </p>
        </header>
      </Reveal>

      {/*
       * Card link targets are a pending content ask (sector → solutions /
       * case-study mapping); the cards are structured to take a Link but
       * render as plain blocks until then.
       */}
      <SectorRow sectors={sectors} />
    </Container>
  )
}

export { Sectors }
