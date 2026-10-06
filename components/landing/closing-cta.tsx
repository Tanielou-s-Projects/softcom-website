import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  ghostPill,
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { CtaPanel } from "@/components/site/cta-panel"
import { cn } from "@/lib/utils"

type CtaAction = { label: string; href: string }

type CtaContent = {
  heading: React.ReactNode
  lead?: string
  actions: [CtaAction] | [CtaAction, CtaAction]
  accent: "blue" | "cyan"
}

/**
 * The closing call to action. Two variants share one photographic plate:
 * `default` is the landing page's signature close; `build` is the people-
 * forward version the rest of the site carries, with a cyan accent to set it
 * apart. Adding a variant is a copy-only change here.
 */
const CTAS = {
  default: {
    heading: "Proud partner of potential.",
    lead: "What can we achieve together?",
    actions: [{ label: "Start a conversation", href: "/contact" }],
    accent: "blue",
  },
  products: {
    heading: "Find the technology that fits your work.",
    lead: "Tell us what you need to achieve. We\u2019ll help you identify the relevant products, platforms and implementation support.",
    actions: [{ label: "Start a conversation", href: "/contact" }],
    accent: "cyan",
  },
  build: {
    heading: "Build with us.",
    lead: "Bring original thinking, an innovator’s mindset and a strong sense of ownership. Work alongside exceptional peers whose expertise complements yours and expands what you can achieve.",
    actions: [{ label: "Explore careers at Softcom", href: "/careers" }],
    accent: "cyan",
  },
} satisfies Record<string, CtaContent>

function ClosingCta({ variant = "default" }: { variant?: keyof typeof CTAS }) {
  const content: CtaContent = CTAS[variant]
  const { heading, lead, actions, accent } = content
  const [primary, secondary] = actions

  return (
    <CtaPanel accent={accent}>
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
          <div className="flex items-start gap-2">
            <Button asChild size="lg" className={primaryPill}>
              <Link href={primary.href}>{primary.label}</Link>
            </Button>
            {secondary ? (
              <Button asChild size="lg" variant="ghost" className={ghostPill}>
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Reveal>
    </CtaPanel>
  )
}

export { ClosingCta }
