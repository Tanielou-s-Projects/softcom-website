import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  headingText,
  primaryPill,
} from "@/components/landing/section"

/**
 * A direct ask on brand blue — distinct from the closing CTA, which is the same
 * photographic panel on every page. This one is specific to its page, and sits
 * in the body rather than at the end.
 *
 * Scoped `dark` because the plate is brand blue in either theme.
 */
function InvitePanel({
  eyebrow,
  heading,
  body,
  action,
}: {
  eyebrow: string
  heading: string
  body: string
  action: { href: string; label: string }
}) {
  return (
    <Container className="py-6">
      <div className="dark flex flex-col items-start gap-8 overflow-clip rounded-4xl bg-brand-blue p-8 lg:p-16">
        <Badge variant="inverse">{eyebrow}</Badge>

        <h2 className={cn(headingText, "max-w-[640px] text-foreground")}>
          {heading}
        </h2>

        {/* Pinned, not tokenised: this sits on brand blue in both themes. */}
        <p className={cn(bodyText, "max-w-[560px] text-neutral-200")}>{body}</p>

        <Button asChild size="lg" className={primaryPill}>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      </div>
    </Container>
  )
}

export { InvitePanel }
