import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  bodyText,
  cardHeadingText,
  Container,
} from "@/components/landing/section"

export type LinkCard = {
  href: string
  eyebrow: string
  title: string
  description: string
}

/**
 * A row of cards pointing at sibling pages — how About reaches Alumni and
 * Careers, which are its children in the sitemap but have no other route in
 * from the body of the page.
 */
function LinkCards({ cards }: { cards: LinkCard[] }) {
  return (
    <Container className="grid gap-3 py-6 lg:grid-cols-2">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          /* `items-start` so the badge hugs its label: it is `inline-flex`, which
             a `flex-col` parent would otherwise stretch to the full card width. */
          className="group flex flex-col items-start justify-between gap-16 overflow-clip rounded-3xl bg-popover p-8 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:h-[360px] lg:p-12"
        >
          <Badge variant="brand">{card.eyebrow}</Badge>

          <div className="flex flex-col gap-3">
            <h3
              className={cn(
                cardHeadingText,
                "text-popover-foreground transition-colors group-hover:text-brand-accent"
              )}
            >
              {card.title}
            </h3>
            <p className={cn(bodyText, "max-w-[420px] text-muted-foreground")}>
              {card.description}
            </p>
          </div>
        </Link>
      ))}
    </Container>
  )
}

export { LinkCards }
