import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  ghostPill,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { CtaPanel } from "@/components/site/cta-panel"
import { cn } from "@/lib/utils"

type CtaAction = { label: string; href: string }

type CtaContent = {
  heading: React.ReactNode
  actions: [CtaAction, CtaAction]
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
    heading: (
      <>
        Let&apos;s build something
        <br />
        that lasts.
      </>
    ),
    actions: [
      { label: "Get In Touch", href: "/contact" },
      { label: "Our Solutions", href: "/solutions" },
    ],
    accent: "blue",
  },
  build: {
    heading: (
      <>
        Come build
        <br />
        what matters.
      </>
    ),
    actions: [
      { label: "See open roles", href: "/careers" },
      { label: "Meet the team", href: "/about#team" },
    ],
    accent: "cyan",
  },
} satisfies Record<string, CtaContent>

function ClosingCta({ variant = "default" }: { variant?: keyof typeof CTAS }) {
  const { heading, actions, accent } = CTAS[variant]
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
          <div className="flex items-start gap-2">
            <Button asChild size="lg" className={primaryPill}>
              <Link href={primary.href}>{primary.label}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className={ghostPill}>
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </CtaPanel>
  )
}

export { ClosingCta }
