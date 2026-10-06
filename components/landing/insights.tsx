import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  headingText,
  primaryPill,
} from "@/components/landing/section"
import { perspectives } from "@/components/landing/content"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/** "Our thinking" — the homepage's window onto Insights. */
function Insights() {
  return (
    <Container className="flex flex-col gap-10 overflow-clip lg:gap-16">
      <Reveal asChild>
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 className={cn(headingText, "text-foreground")}>Our thinking</h2>
            <p className={cn(bodyText, "max-w-[576px] text-muted-foreground")}>
              Perspectives on technology, organisations and the decisions that
              shape what comes next.
            </p>
          </div>
          <Button asChild size="lg" className={primaryPill}>
            <Link href="/insights">Explore our thinking</Link>
          </Button>
        </header>
      </Reveal>

      <RevealStagger className="grid gap-4 lg:grid-cols-2">
        {perspectives.map((perspective) => (
          <RevealItem key={perspective.title} asChild>
            <Link
              href={perspective.href}
              className="group flex flex-col items-start gap-4 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {/* Cover art is a plate until each perspective has its own. */}
              <div className="aspect-[690/324] w-full rounded-2xl bg-muted transition-opacity group-hover:opacity-80" />

              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-lg leading-[1.2] text-foreground lg:text-2xl">
                  {perspective.title}
                </h3>
                <p className={cn(bodyText, "text-muted-foreground")}>
                  {perspective.summary}
                </p>
                <span className="text-sm font-medium text-foreground underline-offset-4 group-hover:underline">
                  Read perspective
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </Container>
  )
}

export { Insights }
