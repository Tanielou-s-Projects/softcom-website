/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
import { cn } from "@/lib/utils"
import {
  bodyText,
  cardHeadingText,
  Container,
} from "@/components/landing/section"
import { deliverables, type Deliverable } from "@/components/products/content"
import { SectionMark } from "@/components/products/section-mark"

/**
 * One service line: its dot-matrix mark beside the copy.
 *
 * The copy sits low against the mark rather than centred on it — in the design
 * the heading starts around two thirds down the 630px row, which is what lets
 * the grid read as the dominant element and the text as its caption.
 */
function DeliverableRow({ deliverable }: { deliverable: Deliverable }) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
      <img
        src={deliverable.mark}
        alt=""
        width={631}
        height={631}
        className="w-full max-w-[631px] shrink-0"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-8 lg:pb-0">
        <h3 className={cn(cardHeadingText, "text-foreground lg:w-[557px]")}>
          {deliverable.title}
        </h3>
        <p className={cn(bodyText, "text-foreground")}>
          {deliverable.description}
        </p>
      </div>
    </div>
  )
}

/** The service lines, under their own mark. */
function WhatWeDeliver() {
  return (
    <section className="flex flex-col gap-16 lg:gap-[68px]">
      <SectionMark accent="blue">What We Deliver</SectionMark>

      <Container className="flex flex-col gap-16">
        {deliverables.map((deliverable) => (
          <DeliverableRow key={deliverable.id} deliverable={deliverable} />
        ))}
      </Container>
    </section>
  )
}

export { WhatWeDeliver }
