import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Container,
  ghostPill,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { cn } from "@/lib/utils"

/** The positioning statement directly beneath the hero, paired with the CTAs. */
function SubHero() {
  return (
    <Container className="flex flex-col items-start justify-between gap-8 py-6 lg:h-64 lg:flex-row lg:items-center">
      <p className={cn(leadText, "max-w-[684px] text-neutral-200")}>
        For over <span className="text-brand-cyan">two decades</span>, we have
        pioneered the technology that organisations rely on to expand access to
        digital services, reach underserved communities, bridge infrastructure
        gaps, and unlock opportunities across Nigeria and Africa.
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <Button asChild size="lg" variant="ghost" className={ghostPill}>
          <Link href="/solutions">View Solutions</Link>
        </Button>
        <Button asChild size="lg" className={primaryPill}>
          <Link href="/contact">Start a Conversation</Link>
        </Button>
      </div>
    </Container>
  )
}

export { SubHero }
