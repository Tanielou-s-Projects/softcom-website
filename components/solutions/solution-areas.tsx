import Image from "next/image"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  bodyText,
  cardHeadingText,
  Container,
  leadText,
} from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import {
  deliveryPhases,
  solutions,
  type Solution,
  type SolutionFeature,
} from "@/components/solutions/content"

/**
 * A labelled point beneath a solution's body copy.
 *
 * The dot alternates cyan then blue down every block, which is the only thing
 * distinguishing the two rows — so it is derived from position rather than
 * stored per feature, and cannot drift out of step.
 */
function FeatureRow({
  feature,
  index,
}: {
  feature: SolutionFeature
  index: number
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
      <div className="flex shrink-0 items-center gap-4">
        <span
          aria-hidden
          className={cn(
            "size-3 shrink-0 rounded-full",
            index === 0 ? "bg-brand-cyan" : "bg-brand-blue"
          )}
        />
        <h3 className="font-heading text-2xl leading-none font-medium text-foreground sm:w-[137px]">
          {feature.label}
        </h3>
      </div>
      <p className={cn(bodyText, "min-w-0 flex-1 text-foreground")}>
        {feature.description}
      </p>
    </div>
  )
}

/**
 * One solution area: a full-height photo beside a plate of copy.
 *
 * The photo alternates sides down the page. `children` is how the Programs
 * block hangs the delivery panel under its plate — it shares the column, so it
 * lines up with the copy above it rather than with the page.
 */
function SolutionBlock({
  solution,
  reversed,
  children,
}: {
  solution: Solution
  reversed?: boolean
  children?: React.ReactNode
}) {
  return (
    <Container
      className={cn(
        "flex flex-col gap-2.5 py-3",
        "lg:flex-row lg:items-stretch",
        reversed && "lg:flex-row-reverse"
      )}
    >
      <div className="relative h-[min(320px,45svh)] shrink-0 overflow-clip rounded-3xl bg-background lg:h-auto lg:w-[30%]">
        <Image
          src={solution.image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <article
          className={cn(
            "flex flex-col justify-center gap-16 overflow-clip rounded-3xl bg-muted p-8",
            "lg:min-h-[min(744px,80svh)] lg:p-[47px]"
          )}
        >
          <div className="flex flex-col gap-8">
            <h2
              className={cn(
                cardHeadingText,
                "text-foreground lg:max-w-[359px]"
              )}
            >
              {solution.title}
            </h2>
            <div className="flex flex-col gap-8">
              {/*
               * The role, not the cyan the design names: cyan manages 1.25:1
               * on a light card where the blue anchor gets 6.09:1, and
               * `--brand-accent` is what already resolves per theme.
               */}
              <p className={cn(bodyText, "text-brand-accent")}>
                {solution.lead}
              </p>
              <p className={cn(bodyText, "text-foreground")}>
                {solution.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {solution.features.map((feature, index) => (
              <FeatureRow key={feature.label} feature={feature} index={index} />
            ))}
          </div>
        </article>

        {children}
      </div>
    </Container>
  )
}

/**
 * The delivery phases, on a brand-blue plate.
 *
 * Scoped `dark` because the plate is brand blue in either theme: the roles
 * inside it have to keep resolving to their dark values or the labels turn
 * near-black on blue in light mode.
 */
function DeliveryPhases() {
  return (
    <section className="dark flex flex-col gap-8 overflow-clip rounded-3xl bg-brand-blue p-8 lg:gap-12 lg:p-12">
      <header className="flex flex-col items-start justify-center gap-3">
        <Badge variant="inverse">Phases</Badge>
        <h2 className={cn(cardHeadingText, "text-foreground lg:max-w-[208px]")}>
          How We Deliver
        </h2>
      </header>

      <ol className="grid gap-8 sm:grid-cols-2 sm:gap-x-11">
        {deliveryPhases.map((phase) => (
          <li key={phase.step} className="flex items-start gap-6">
            <span className="font-heading text-5xl leading-none font-medium text-foreground">
              {phase.step}
            </span>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 text-lg leading-none text-foreground">
              <h3 className="font-bold">{phase.title}</h3>
              <p>{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/**
 * The body of the page: the framing sentence, then the three areas.
 *
 * The delivery panel belongs to Programs rather than to the page, which is why
 * it is passed in as that block's child — in the design it sits inside the same
 * column as the Programs copy, not below the whole section.
 */
function SolutionAreas() {
  return (
    <section className="flex flex-col gap-16">
      <Container className="flex flex-col items-start justify-center gap-6 pt-6">
        <Reveal className="flex flex-col items-start gap-6">
          <Badge variant="brand">Our Solutions</Badge>
          <p className={cn(leadText, "max-w-[671px] text-foreground")}>
            Three integrated solution areas that together cover the full arc of
            delivery, from the infrastructure outcomes run on, to the
            intelligence that guides decisions, to programmes that own the
            entire journey.
          </p>
        </Reveal>
      </Container>

      <div className="flex flex-col gap-16 lg:gap-32">
        {solutions.map((solution, index) => (
          <Reveal key={solution.id} amount={0.1}>
            <SolutionBlock solution={solution} reversed={index === 1}>
              {solution.id === "programs" && <DeliveryPhases />}
            </SolutionBlock>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export { SolutionAreas, DeliveryPhases }
