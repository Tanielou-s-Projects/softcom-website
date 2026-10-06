import Link from "next/link"

import { Button } from "@/components/ui/button"
import { headingText, primaryPill } from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { CtaPanel } from "@/components/site/cta-panel"
import { cn } from "@/lib/utils"

/**
 * The Solutions page's closing call to action.
 *
 * Where the landing page centres a single line over two buttons, this sets the
 * question against its answer and offers one way forward.
 */
function SolutionsCta() {
  return (
    <CtaPanel accent="cyan">
      {/* Reveal stays on the inner content — the panel itself is sticky and must never gain a transform. */}
      <Reveal asChild>
        <div className="relative flex flex-col items-center gap-6 px-6">
          <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16">
            <h2
              className={cn(
                headingText,
                "text-center text-foreground lg:max-w-[394px] lg:text-left"
              )}
            >
              Not sure where to start?
            </h2>
            <p className="max-w-[339px] text-center text-lg leading-[1.4] text-foreground lg:text-left">
              Most of our engagements begin with a conversation. Tell us what
              you&rsquo;re trying to solve; we will tell you honestly whether we
              can help.
            </p>
          </div>

          <Button asChild size="lg" className={primaryPill}>
            <Link href="/contact">Start a conversation</Link>
          </Button>
        </div>
      </Reveal>
    </CtaPanel>
  )
}

export { SolutionsCta }
