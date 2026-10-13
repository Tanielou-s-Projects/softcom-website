import Image from "next/image"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { stats } from "@/components/landing/content"
import { displayText, leadText } from "@/components/landing/section"
import { Reveal, RevealItem, RevealStagger } from "@/components/motion/reveal"
import { FullHero } from "@/components/site/full-hero"

/**
 * The page's opening: an engagement in the field, full screen, with the claim
 * and the impact numbers over it. The numbers carry the "measurable" until the
 * case studies themselves arrive; once one is featured, it can take this slot.
 */
function CaseStudiesHero() {
  return (
    <FullHero
      background={
        <>
          <Image
            src="/images/pos-agent.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_40%]"
          />
          {/* Film: light at the top, deep behind the copy and numbers, and
              deeper on the left, where the copy sits over the agent. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/90"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent"
          />
        </>
      }
    >
      <div className="flex flex-col gap-10 lg:gap-14">
        <Reveal className="flex flex-col items-start gap-6">
          <Badge variant="brand">Case Studies</Badge>
          <h1 className={cn(displayText, "max-w-[22ch] text-foreground")}>
            Real engagements. Measurable outcomes.
          </h1>
          <p className={cn(leadText, "max-w-[60ch] text-foreground/80")}>
            A portfolio of real engagements — spanning government, financial
            services, consumer goods, and agriculture — each delivering
            measurable, lasting outcomes.
          </p>
        </Reveal>

        <RevealStagger
          as="dl"
          amount={0.3}
          className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/20 pt-6 sm:grid-cols-4 sm:gap-8"
        >
          {stats.map((stat) => (
            <RevealItem key={stat.label} className="flex flex-col gap-1">
              <dd className="font-heading text-4xl leading-[0.9] text-foreground lg:text-6xl">
                {stat.value}
              </dd>
              <dt className="text-sm text-foreground/70 lg:text-base">
                {stat.label}
              </dt>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </FullHero>
  )
}

export { CaseStudiesHero }
