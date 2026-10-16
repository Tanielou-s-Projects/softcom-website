import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"
import type { HomePage } from "@/content/home/page-copy"

/** How Softcom works: the technology, then the expertise that puts it to use. */
function Approach({ copy }: { copy: HomePage["approach"] }) {
  return (
    <Container className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      <Reveal asChild>
        <h2 className={cn(headingText, "text-ink lg:w-[50%]")}>
          {copy.heading}
        </h2>
      </Reveal>
      <Reveal
        delay={0.1}
        className="flex min-w-0 flex-1 flex-col items-start gap-6"
      >
        <p className={cn(bodyText, "text-ink")}>{copy.lead}</p>
        <p className={cn(bodyText, "text-ink-soft")}>{copy.body}</p>
        <Button asChild size="lg" className={cn(primaryPill, "mt-2")}>
          <Link href={copy.cta.href}>{copy.cta.label}</Link>
        </Button>
      </Reveal>
    </Container>
  )
}

export { Approach }
