import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  ghostPill,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { values } from "@/components/landing/content"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/**
 * The people behind the work: what guides them, and the alumni who carry it
 * on. The same four values open About's "What guides our work".
 */
function People() {
  return (
    <Container className="flex flex-col gap-10 py-6 lg:gap-16">
      <Reveal asChild>
        <header className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
          <h2 className={cn(headingText, "text-foreground lg:w-[50%]")}>
            The people behind the work
          </h2>
          <p className={cn(bodyText, "min-w-0 flex-1 text-foreground")}>
            Softcom&rsquo;s experience lives in its people: the knowledge they
            have developed, the challenges they have worked through and the
            standards they bring to each engagement.
          </p>
        </header>
      </Reveal>

      <RevealStagger
        as="dl"
        className="grid gap-x-6 gap-y-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {values.map((value) => (
          <RevealItem key={value.title} className="flex flex-col gap-3">
            <dt className="font-heading text-xl text-foreground lg:text-2xl">
              {value.title}
            </dt>
            <dd className={cn(bodyText, "text-muted-foreground")}>
              {value.description}
            </dd>
          </RevealItem>
        ))}
      </RevealStagger>

      <Reveal className="flex flex-col items-start gap-6 border-t border-border pt-10 lg:max-w-[684px]">
        <p className={cn(bodyText, "text-foreground")}>
          The experience built at Softcom travels with our people. Our alumni
          carry it into new teams, organisations and ventures while remaining
          part of a wider Softcom network.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="lg" className={primaryPill}>
            <Link href="/about">Meet Softcom</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className={ghostPill}>
            <Link href="/alumni">Explore our alumni community</Link>
          </Button>
        </div>
      </Reveal>
    </Container>
  )
}

export { People }
