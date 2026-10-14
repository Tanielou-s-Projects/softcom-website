import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"
import { SolutionIndex } from "@/components/solutions/solution-index"
import { ArrowLink } from "@/components/ui/button"
import { Crosshairs } from "@/components/ui/crosshairs"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { solutions } from "@/content/solutions/content"
import type { SolutionsPage } from "@/content/solutions/page-copy"
import { cn } from "@/lib/utils"

/*
 * The three solution areas down the right nine columns, the side index
 * holding still in the left three. Each area opens the same way (number,
 * title, lead, image) and then sets its own content in the form that suits
 * it: a ruled list, an accordion, a run of tags.
 */
export function SolutionAreas({ copy }: { copy: SolutionsPage }) {
  const [infrastructure, intelligence, initiatives] = solutions
  const entries = [
    { id: infrastructure.id, title: copy.infrastructure.title },
    { id: intelligence.id, title: copy.intelligence.title },
    { id: initiatives.id, title: copy.initiatives.title },
  ]

  return (
    <section className="mt-32 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 grid gap-16 md:mt-16 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-3">
          <SolutionIndex entries={entries} label={copy.hero.badge} />
        </div>
        <div className="space-y-32 md:col-span-9 md:space-y-48">
          <Area
            id={infrastructure.id}
            index={0}
            title={copy.infrastructure.title}
            lead={copy.infrastructure.lead}
          >
            <Infrastructure copy={copy.infrastructure} />
          </Area>
          <Area
            id={intelligence.id}
            index={1}
            title={copy.intelligence.title}
            lead={copy.intelligence.lead}
          >
            <Intelligence copy={copy.intelligence} />
          </Area>
          <Area
            id={initiatives.id}
            index={2}
            title={copy.initiatives.title}
            lead={copy.initiatives.lead}
          >
            <Initiatives copy={copy.initiatives} />
          </Area>
        </div>
      </div>
    </section>
  )
}

/* One area's shared opening: number, title, lead and its image. */
function Area({
  id,
  index,
  title,
  lead,
  children,
}: {
  id: string
  index: number
  title: string
  lead: string
  children: React.ReactNode
}) {
  return (
    <article id={id} className="scroll-mt-28">
      <p className="label text-ink-faint">
        {String(index + 1).padStart(2, "0")}
      </p>
      <LineReveal
        as="h2"
        className="mt-5 text-headline font-normal text-balance"
      >
        {title}
      </LineReveal>
      <Reveal className="mt-8 max-w-3xl">
        <p className="text-xl tracking-[-0.01em] text-balance">{lead}</p>
      </Reveal>
      <Reveal className="relative mt-12 aspect-[16/9] overflow-hidden rounded-lg md:mt-16">
        <ImagePlaceholder label={title} />
      </Reveal>
      <div className="mt-16 md:mt-20">{children}</div>
    </article>
  )
}

/* A small heading with its intro, opening a block inside an area. */
function SubHeading({
  heading,
  intro,
  className,
}: {
  heading: string
  intro?: string
  className?: string
}) {
  return (
    <Reveal className={cn("grid gap-4 md:grid-cols-9 md:gap-x-6", className)}>
      <h3 className="text-title text-balance md:col-span-4">{heading}</h3>
      {intro && <p className="text-ink-soft md:col-span-5">{intro}</p>}
    </Reveal>
  )
}

/*
 * Digital Infrastructure: the three connected functions as a ruled,
 * numbered list, then Build and Implement as the two ways Softcom delivers
 * them, side by side on a hairline.
 */
function Infrastructure({ copy }: { copy: SolutionsPage["infrastructure"] }) {
  const modes = [
    { label: copy.buildLabel, title: copy.buildTitle, text: copy.buildText },
    {
      label: copy.implementLabel,
      title: copy.implementTitle,
      text: copy.implementText,
    },
  ]

  return (
    <>
      <SubHeading heading={copy.listHeading} intro={copy.listIntro} />
      <Reveal as="ol" stagger="rows" className="mt-10 border-t border-line">
        {copy.steps.map((step, i) => (
          <li
            key={step.label}
            className="grid gap-3 border-b border-line py-6 md:grid-cols-9 md:gap-x-6 md:py-8"
          >
            <span className="label text-ink-faint md:col-span-1 md:pt-1.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="text-xl tracking-[-0.01em] md:col-span-3">
              {step.label}
            </h4>
            <p className="text-ink-soft md:col-span-5">{step.description}</p>
          </li>
        ))}
      </Reveal>
      <Reveal className="mt-8 max-w-2xl">
        <p className="text-ink-soft">{copy.outro}</p>
      </Reveal>

      <Reveal
        stagger="cards"
        className="mt-20 grid border-t border-line md:mt-24 md:grid-cols-2"
      >
        {modes.map((mode) => (
          <div
            key={mode.label}
            className="border-b border-line py-8 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
          >
            <p className="label text-accent-ink">{mode.label}</p>
            <h3 className="mt-4 text-title">{mode.title}</h3>
            <p className="mt-6 text-ink-soft">{mode.text}</p>
          </div>
        ))}
      </Reveal>
      <ArrowLink href={copy.ctaHref} className="mt-10">
        {copy.ctaLabel}
      </ArrowLink>
    </>
  )
}

/*
 * Applied Intelligence: the five kinds as an accordion, each opening onto
 * its description, then what every system is shaped around, as three tags.
 */
function Intelligence({ copy }: { copy: SolutionsPage["intelligence"] }) {
  return (
    <>
      <SubHeading heading={copy.railLabel.replace(/\s*→$/, "")} />
      <Reveal className="mt-6 max-w-2xl">
        {copy.railIntro.map((p) => (
          <p key={p} className="text-ink-soft">
            {p}
          </p>
        ))}
      </Reveal>
      <Reveal stagger="rows" className="mt-10 border-t border-line">
        {copy.kinds.map((kind, i) => (
          <details
            key={kind.label}
            name="intelligence"
            open={i === 0}
            className="group border-b border-line"
          >
            <summary className="flex cursor-pointer list-none items-baseline gap-4 py-6 md:gap-6 [&::-webkit-details-marker]:hidden">
              <span className="label w-6 shrink-0 text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="flex-1 text-xl tracking-[-0.01em]">
                {kind.label}
              </h4>
              <span
                aria-hidden="true"
                className="relative size-3 shrink-0 self-center text-ink-soft"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:scale-y-0" />
              </span>
            </summary>
            <p className="max-w-2xl pb-8 pl-10 text-ink-soft md:pl-12">
              {kind.description}
            </p>
          </details>
        ))}
      </Reveal>

      <Reveal className="mt-20 rounded-xl bg-surface p-6 md:mt-24 md:p-10">
        <h3 className="text-title">{copy.shapedHeading}</h3>
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {copy.shapedPoints.map((point) => (
            <li
              key={point}
              className="rounded-full border border-line px-3 py-1 text-sm"
            >
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-ink-soft">{copy.shapedText}</p>
      </Reveal>
      <ArrowLink href={copy.ctaHref} className="mt-10">
        {copy.ctaLabel}
      </ArrowLink>
    </>
  )
}

/*
 * Powering Initiatives: what a client can hand over, as a numbered hairline
 * grid of the seven stages, with how Softcom's involvement flexes beneath.
 */
function Initiatives({ copy }: { copy: SolutionsPage["initiatives"] }) {
  return (
    <>
      <SubHeading heading={copy.entrustHeading} intro={copy.entrustText} />
      <Reveal
        as="ol"
        stagger="cards"
        className="mt-10 grid grid-cols-2 border-t border-l border-line md:grid-cols-4"
      >
        {copy.entrustItems.map((item, i) => (
          <li
            key={item}
            className="flex min-h-32 flex-col justify-between gap-6 border-r border-b border-line p-4 md:min-h-40 md:p-5"
          >
            <span className="label text-ink-faint">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-lg leading-snug tracking-[-0.01em]">
              {item}
            </span>
          </li>
        ))}
        {/* Seven stages leave one cell short of the grid; hatch it closed. */}
        {copy.entrustItems.length % 2 === 1 && (
          <li
            aria-hidden="true"
            className="border-r border-b border-line bg-[repeating-linear-gradient(135deg,var(--color-line)_0_1px,transparent_1px_10px)]"
          />
        )}
      </Reveal>
    </>
  )
}
