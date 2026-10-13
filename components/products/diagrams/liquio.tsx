import * as React from "react"

import { cn } from "@/lib/utils"
import { DiagramCard, DiagramFrame } from "@/components/products/diagrams/frame"

/*
 * Liquio's two diagrams from the copy deck (pages 44–45), rebuilt: the same
 * boxes, wording and highlight, the site's type and colour.
 */

/* ── Digital services · One foundation. Services across departments. ── */

const AUDIENCES = ["Citizens", "Businesses", "Public-service teams"]

export function LiquioFoundation() {
  return (
    <DiagramFrame
      eyebrow="Liquio by Kitsoft / Digital services"
      title="One foundation. Services across departments."
      subtitle="Shared platform capabilities connect the public-facing service with the work behind it."
      footnote="Conceptual platform diagram. Integration and service scope are defined for each engagement."
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {AUDIENCES.map((audience) => (
              <DiagramCard key={audience} className="px-6 py-6 lg:py-8">
                <span className="font-heading text-xl text-foreground lg:text-2xl">
                  {audience}
                </span>
              </DiagramCard>
            ))}
          </div>

          {/* Each audience drops into one bus, and the bus into the platform. */}
          <svg
            viewBox="0 0 600 40"
            preserveAspectRatio="none"
            className="hidden h-10 w-full sm:block"
            aria-hidden
          >
            <path
              d="M100 0 V20 H500 V0 M300 0 V40"
              fill="none"
              className="stroke-brand-accent"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span
            aria-hidden
            className="mx-auto h-6 w-px bg-brand-accent sm:hidden"
          />

          <div className="flex flex-col gap-3 rounded-2xl bg-brand-accent/10 px-6 py-6 ring-1 ring-brand-accent/20 lg:py-8">
            <span className="font-heading text-xl text-brand-accent lg:text-2xl">
              Liquio
            </span>
            <span className="text-base text-brand-accent lg:text-xl">
              Service design / Forms and workflows / Registers and datasets /
              APIs
            </span>
          </div>
        </div>
        <p className="text-base text-muted-foreground lg:text-xl">
          Connect existing government systems and develop services on a common
          platform.
        </p>
      </div>
    </DiagramFrame>
  )
}

/* ── Service delivery · Connect every stage of a public service. ── */

/** A numbered row of stage cards with arrows between, one of them lit. */
export function StageRow({
  stages,
}: {
  stages: { title: string; body: string; on?: boolean }[]
}) {
  return (
    <ol
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:gap-0",
        stages.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
      )}
    >
      {stages.map((stage, index) => (
        <li key={stage.title} className="flex flex-col gap-4 lg:pr-10">
          <span className="font-mono text-sm text-brand-accent tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="relative flex h-full">
            <div
              className={cn(
                "flex min-h-[180px] w-full flex-col gap-3 rounded-2xl p-6 lg:min-h-[220px]",
                stage.on
                  ? "bg-brand-accent/10 ring-1 ring-brand-accent/20"
                  : "bg-card ring-1 ring-foreground/10"
              )}
            >
              <span
                className={cn(
                  "font-heading text-xl lg:text-2xl",
                  stage.on ? "text-brand-accent" : "text-foreground"
                )}
              >
                {stage.title}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                {stage.body}
              </span>
            </div>
            {index < stages.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-1/2 -right-7 hidden -translate-y-1/2 text-lg text-brand-accent lg:block"
              >
                →
              </span>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function LiquioService() {
  return (
    <DiagramFrame
      eyebrow="Liquio by Kitsoft / Service delivery"
      title="Connect every stage of a public service."
      subtitle="An illustrative application journey, configured around the institution’s requirements."
      footnote="Illustrative workflow, not a product screenshot or a claim about a specific deployed service."
    >
      <div className="flex flex-col gap-8">
        <StageRow
          stages={[
            {
              title: "Apply",
              body: "Capture information and supporting documents.",
            },
            {
              title: "Check",
              body: "Connect the records needed for assessment.",
            },
            {
              title: "Review",
              body: "Route work through the required approvals.",
              on: true,
            },
            {
              title: "Deliver",
              body: "Issue the response or service document.",
            },
          ]}
        />
        <p className="text-base text-muted-foreground lg:text-xl">
          Forms, records and workflows follow the service from application to
          outcome.
        </p>
      </div>
    </DiagramFrame>
  )
}
