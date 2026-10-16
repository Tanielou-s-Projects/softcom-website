import Link from "next/link"

import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/landing/section"
import type { HomePage } from "@/content/home/page-copy"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/** "Our thinking" — the homepage's window onto Insights. */
function Insights({ copy }: { copy: HomePage["ourThinking"] }) {
  return (
    <Container className="flex flex-col gap-10 overflow-clip lg:gap-16">
      <Reveal asChild>
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 className={cn("text-headline", "text-ink")}>{copy.heading}</h2>
            <p className={cn("text-body", "max-w-[576px] text-ink-soft")}>
              {copy.intro}
            </p>
          </div>
          <ButtonLink href={copy.cta.href} tone="ink">
            {copy.cta.label}
          </ButtonLink>
        </header>
      </Reveal>

      <RevealStagger className="grid gap-4 lg:grid-cols-2">
        {copy.perspectives.map((perspective) => (
          <RevealItem key={perspective.title} asChild>
            <Link
              href={perspective.href}
              className="group flex flex-col items-start gap-4 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ink/50"
            >
              {/* Cover art is a plate until each perspective has its own. */}
              <div className="aspect-[690/324] w-full rounded-2xl bg-surface-raised transition-opacity group-hover:opacity-80" />

              <div className="flex flex-col gap-3">
                <h3 className="font-heading text-lg leading-[1.2] text-ink lg:text-2xl">
                  {perspective.title}
                </h3>
                <p className={cn("text-body", "text-ink-soft")}>
                  {perspective.summary}
                </p>
                <span className="text-sm font-medium text-ink underline-offset-4 group-hover:underline">
                  {copy.readLabel}
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
