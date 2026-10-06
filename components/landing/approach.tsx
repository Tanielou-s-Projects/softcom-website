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

/** How Softcom works: the technology, then the expertise that puts it to use. */
function Approach() {
  return (
    <Container className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      <Reveal asChild>
        <h2 className={cn(headingText, "text-foreground lg:w-[50%]")}>
          Technology to make it happen. Expertise to make it work.
        </h2>
      </Reveal>
      <Reveal
        delay={0.1}
        className="flex min-w-0 flex-1 flex-col items-start gap-6"
      >
        <p className={cn(bodyText, "text-foreground")}>
          Our engineers consider the organisation&rsquo;s existing systems,
          operating conditions and future requirements. These inform what to
          build, what to integrate and how the different parts should work
          together.
        </p>
        <p className={cn(bodyText, "text-muted-foreground")}>
          Putting technology to work requires clear responsibilities, prepared
          teams and processes that support its use. Depending on the engagement,
          our involvement can extend to change management, ongoing operations
          and impact assessment.
        </p>
        <Button asChild size="lg" className={cn(primaryPill, "mt-2")}>
          <Link href="/contact">Discuss what you want to achieve</Link>
        </Button>
      </Reveal>
    </Container>
  )
}

export { Approach }
