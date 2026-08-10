import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  ghostPill,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { CtaPanel } from "@/components/site/cta-panel"
import { cn } from "@/lib/utils"

/** The landing page's closing call to action. */
function ClosingCta() {
  return (
    <CtaPanel>
      <div className="relative flex flex-col items-center gap-6 px-6">
        <h2
          className={cn(
            headingText,
            "max-w-[598px] text-center text-foreground"
          )}
        >
          Let&apos;s build something
          <br />
          that lasts.
        </h2>
        <div className="flex items-start gap-2">
          <Button asChild size="lg" className={primaryPill}>
            <Link href="/contact">Get In Touch</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className={ghostPill}>
            <Link href="/solutions">Our Solutions</Link>
          </Button>
        </div>
      </div>
    </CtaPanel>
  )
}

export { ClosingCta }
