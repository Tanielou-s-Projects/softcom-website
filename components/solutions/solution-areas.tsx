import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  bodyText,
  cardHeadingText,
  Container,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import {
  deliveryClose,
  deliveryPhases,
  solutions,
  solutionsIntro,
  type Solution,
  type SolutionFeature,
  type SolutionList,
} from "@/components/solutions/content"
import { ColorReveal } from "@/components/motion/color-reveal"

/**
 * A labelled point beneath a solution's body copy.
 *
 * The dot alternates cyan then blue down every block — derived from position
 * rather than stored per feature, so it cannot drift out of step.
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
            index % 2 === 0 ? "bg-brand-cyan" : "bg-brand-blue"
          )}
        />
        <h3 className="font-heading text-2xl leading-[1.1] font-medium text-foreground sm:w-[180px]">
          {feature.label}
        </h3>
      </div>
      <p className={cn(bodyText, "min-w-0 flex-1 text-foreground")}>
        {feature.description}
      </p>
    </div>
  )
}

/** A subheaded list inside a solution's plate, e.g. the parts of an operation. */
function ListBlock({ list }: { list: SolutionList }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-heading text-2xl leading-[1.1] font-medium text-foreground">
        {list.heading}
      </h3>
      <p className={cn(bodyText, "text-foreground")}>{list.intro}</p>
      <ul className="flex flex-col gap-3 border-l border-border pl-5">
        {list.items.map((item) => (
          <li key={item.label} className={cn(bodyText, "text-foreground")}>
            <strong className="font-semibold">{item.label}:</strong>{" "}
            {item.description}
          </li>
        ))}
      </ul>
      <p className={cn(bodyText, "text-muted-foreground")}>{list.outro}</p>
    </div>
  )
}

/**
 * One solution area: a full-height photo beside a plate of copy.
 *
 * The photo alternates sides down the page. `children` is how Powering Initiatives
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
      id={solution.id}
      className={cn(
        "flex scroll-mt-24 flex-col gap-2.5 py-3",
        "lg:flex-row lg:items-stretch",
        reversed && "lg:flex-row-reverse"
      )}
    >
      <div className="relative h-[min(320px,45svh)] shrink-0 overflow-clip rounded-3xl bg-background lg:h-auto lg:w-[30%]">
        <ColorReveal>
          <Image
            src={solution.image.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover"
          />
        </ColorReveal>
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
              {solution.description.map((paragraph) => (
                <p key={paragraph} className={cn(bodyText, "text-foreground")}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {solution.list ? <ListBlock list={solution.list} /> : null}

          <div className="flex flex-col gap-8">
            {solution.features.map((feature, index) => (
              <FeatureRow key={feature.label} feature={feature} index={index} />
            ))}
          </div>

          {solution.cta ? (
            <Button asChild size="lg" className={cn(primaryPill, "self-start")}>
              <Link href={solution.cta.href}>{solution.cta.label}</Link>
            </Button>
          ) : null}
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
          How we deliver
        </h2>
      </header>

      <ol className="grid gap-8 sm:grid-cols-2 sm:gap-x-11">
        {deliveryPhases.map((phase) => (
          <li key={phase.step} className="flex items-start gap-6">
            <span className="font-heading text-5xl leading-none font-medium text-foreground">
              {phase.step}
            </span>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 text-lg leading-[1.4] text-foreground">
              <h3 className="font-bold">{phase.title}</h3>
              <p>{phase.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-start gap-6 border-t border-foreground/20 pt-8">
        <p className={cn(bodyText, "text-foreground")}>{deliveryClose.text}</p>
        <Button asChild size="lg" className={primaryPill}>
          <Link href={deliveryClose.cta.href}>{deliveryClose.cta.label}</Link>
        </Button>
      </div>
    </section>
  )
}

/**
 * The body of the page: the framing sentence, then the three areas.
 *
 * The delivery panel belongs to Powering Initiatives rather than to the page, which is why
 * it is passed in as that block's child — in the design it sits inside the same
 * column as the Powering Initiatives copy, not below the whole section.
 */
function SolutionAreas() {
  return (
    <section className="flex flex-col gap-16">
      <Container className="flex flex-col items-start justify-center gap-6 pt-6">
        <Reveal className="flex flex-col items-start gap-6">
          <Badge variant="brand">Our Solutions</Badge>
          {solutionsIntro.map((paragraph) => (
            <p
              key={paragraph}
              className={cn(leadText, "max-w-[671px] text-foreground")}
            >
              {paragraph}
            </p>
          ))}
          <nav
            aria-label="Solution areas"
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-foreground"
          >
            {solutions.map((solution, index) => (
              <span key={solution.id} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden className="text-muted-foreground">
                    ·
                  </span>
                ) : null}
                <Link
                  href={`#${solution.id}`}
                  className="underline-offset-4 hover:underline"
                >
                  {solution.title}
                </Link>
              </span>
            ))}
          </nav>
        </Reveal>
      </Container>

      <div className="flex flex-col gap-16 lg:gap-32">
        {solutions.map((solution, index) => (
          <Reveal key={solution.id} amount={0.1}>
            <SolutionBlock solution={solution} reversed={index === 1}>
              {solution.id === "powering-initiatives" && <DeliveryPhases />}
            </SolutionBlock>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export { SolutionAreas, DeliveryPhases }
