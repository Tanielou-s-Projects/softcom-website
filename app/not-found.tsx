import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Container,
  displayText,
  ghostPill,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

/**
 * The 404, which until now was Next's bare default — no header, no footer, no
 * theme. `/insights/[slug]` calls `notFound()` for any unknown slug, and the
 * playground 404s in production, so this page is reachable by design and not
 * only by mistyped URLs.
 *
 * No closing CTA panel: the two buttons here are already the call to action,
 * and the sticky panel needs a tall page to pin against.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-background">
      <SiteHeader />

      <Container className="flex flex-1 pt-6">
        <div className="flex w-full flex-col items-center justify-center gap-8 overflow-clip rounded-3xl bg-popover px-6 py-24 lg:gap-16">
          <Badge variant="brand">404</Badge>

          <h1
            className={cn(
              displayText,
              "max-w-[725px] text-center text-popover-foreground"
            )}
          >
            This page has moved on.
          </h1>

          <p
            className={cn(
              leadText,
              "max-w-[560px] text-center leading-[1.6] text-popover-foreground"
            )}
          >
            The link is broken or the page no longer exists. The work is still
            here — start from the homepage, or tell us what you were looking
            for.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="lg" className={primaryPill}>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className={ghostPill}>
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </Container>

      <Container className="py-6">
        <SiteFooter />
      </Container>
    </div>
  )
}
