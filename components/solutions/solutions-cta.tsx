import { ButtonLink } from "@/components/ui/button"
import { Reveal } from "@/components/motion/reveal"
import { CtaPanel } from "@/components/site/cta-panel"
import { cn } from "@/lib/utils"
import type { SolutionsPage } from "@/content/solutions/page-copy"

/**
 * The Solutions page's closing call to action.
 *
 * Where the landing page centres a single line over two buttons, this sets the
 * question against its answer and offers one way forward.
 */
function SolutionsCta({ copy }: { copy: SolutionsPage["close"] }) {
  return (
    <CtaPanel accent="cyan">
      {/* Reveal stays on the inner content — the panel itself is sticky and must never gain a transform. */}
      <Reveal asChild>
        <div className="relative flex flex-col items-center gap-6 px-6">
          <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16">
            <h2
              className={cn(
                "text-headline",
                "text-center text-ink lg:max-w-[394px] lg:text-left"
              )}
            >
              {copy.heading}
            </h2>
            <p className="max-w-[339px] text-center text-lg leading-[1.4] text-ink lg:text-left">
              {copy.text}
            </p>
          </div>

          <ButtonLink href={copy.ctaHref} tone="light">
            {copy.ctaLabel}
          </ButtonLink>
        </div>
      </Reveal>
    </CtaPanel>
  )
}

export { SolutionsCta }
