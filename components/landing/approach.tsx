import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"
import type { HomePage } from "@/content/home/page-copy"

/** How Softcom works: the technology, then the expertise that puts it to use. */
function Approach({ copy }: { copy: HomePage["approach"] }) {
  return (
    <Container className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      <Reveal asChild>
        <h2 className={cn("text-headline", "text-ink lg:w-[50%]")}>
          {copy.heading}
        </h2>
      </Reveal>
      <Reveal
        delay={0.1}
        className="flex min-w-0 flex-1 flex-col items-start gap-6"
      >
        <p className={cn("text-body", "text-ink")}>{copy.lead}</p>
        <p className={cn("text-body", "text-ink-soft")}>{copy.body}</p>
        <ButtonLink href={copy.cta.href} tone="ink" className="mt-2">
          {copy.cta.label}
        </ButtonLink>
      </Reveal>
    </Container>
  )
}

export { Approach }
