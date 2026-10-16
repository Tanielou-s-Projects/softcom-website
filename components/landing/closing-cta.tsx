import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { CtaPanel } from "@/components/site/cta-panel"
import { cn } from "@/lib/utils"

import { getNavigation } from "@/content/site/get-navigation"

/*
 * The closing call to action. Three variants share one photographic plate:
 * `default` is the landing page's signature close, `products` closes
 * Enterprise Products, and `build` is the people-forward version the rest of
 * the site carries, with a cyan accent to set it apart. Their copy and the
 * photograph live in Sanity's `navigation` singleton (components/site/
 * chrome-copy.ts); the accent is design, so it stays here.
 */
const VARIANTS = {
  default: { copy: "home", accent: "blue" },
  products: { copy: "products", accent: "cyan" },
  build: { copy: "careers", accent: "cyan" },
} as const

async function ClosingCta({
  variant = "default",
}: {
  variant?: keyof typeof VARIANTS
}) {
  const { closingCtas } = await getNavigation()
  const { copy, accent } = VARIANTS[variant]
  const { heading, lead, buttonLabel, buttonHref } = closingCtas[copy]

  return (
    <CtaPanel accent={accent} image={closingCtas.image}>
      {/* Reveal stays on the inner content — the panel itself is sticky and must never gain a transform. */}
      <Reveal asChild>
        <div className="relative flex flex-col items-center gap-6 px-6">
          <h2
            className={cn(
              headingText,
              "max-w-[598px] text-center text-foreground"
            )}
          >
            {heading}
          </h2>
          {lead ? (
            <p
              className={cn(
                leadText,
                "max-w-[576px] text-center text-muted-foreground"
              )}
            >
              {lead}
            </p>
          ) : null}
          <Button asChild size="lg" className={primaryPill}>
            <Link href={buttonHref}>{buttonLabel}</Link>
          </Button>
        </div>
      </Reveal>
    </CtaPanel>
  )
}

export { ClosingCta }
