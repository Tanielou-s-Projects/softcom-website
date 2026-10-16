import * as React from "react"

import { DiagramCard, DiagramFrame } from "@/components/products/diagrams/frame"
import { StageRow } from "@/components/products/diagrams/liquio"

/*
 * RTGS.global's two diagrams from the copy deck (pages 47–48), rebuilt: the
 * same boxes, wording and highlight, the site's type and colour.
 */

/* ── Network · Connect payment operations to shared settlement. ── */

function Institution({ name }: { name: string }) {
  return (
    <DiagramCard className="flex min-h-[160px] flex-col gap-3 p-6 lg:min-h-[200px]">
      <span className="font-heading text-xl text-ink lg:text-2xl">{name}</span>
      <span className="text-sm leading-relaxed text-ink-soft lg:text-base">
        Payments and treasury
        <br />
        Connected internal systems
      </span>
    </DiagramCard>
  )
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 12" className={className} aria-hidden>
      <path
        d="M0 6 H56 M50 1 L56 6 L50 11"
        fill="none"
        className="stroke-accent-ink"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function FundsControllers() {
  return (
    <DiagramCard className="flex w-full flex-col gap-2 p-6">
      <span className="font-heading text-xl text-ink lg:text-2xl">
        Funds Controllers
      </span>
      <span className="text-sm text-ink-soft lg:text-base">
        Account and payment-processing services
      </span>
    </DiagramCard>
  )
}

export function RtgsNetwork() {
  return (
    <DiagramFrame
      eyebrow="RTGS.global / Network"
      title="Connect payment operations to shared settlement infrastructure."
      subtitle="A conceptual view of participating institutions, the network and Funds Controllers."
      footnote="Conceptual network diagram. Participation and available services depend on the agreed implementation."
    >
      <div className="flex flex-col">
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)_72px_minmax(0,1fr)] lg:gap-4">
          <Institution name="Institution A" />
          <Arrow className="mx-auto h-3 w-12 rotate-90 lg:w-full lg:rotate-0" />
          <div className="flex min-h-[160px] flex-col gap-3 rounded-2xl bg-accent-ink/10 p-6 ring-1 ring-accent-ink/20 lg:min-h-[200px]">
            <span className="font-heading text-xl text-accent-ink lg:text-2xl">
              RTGS.global
            </span>
            <span className="text-sm leading-relaxed text-ink-soft lg:text-base">
              Payment instructions
              <br />
              Settlement and notifications
            </span>
          </div>
          {/* On a phone, Funds Controllers sit straight under the network. */}
          <div className="flex flex-col items-center lg:hidden">
            <span aria-hidden className="h-6 w-px bg-accent-ink" />
            <FundsControllers />
          </div>
          <Arrow className="mx-auto h-3 w-12 rotate-90 lg:w-full lg:rotate-0" />
          <Institution name="Institution B" />
        </div>

        {/* On desktop they hang off the network, below the row. */}
        <div className="hidden lg:flex lg:flex-col lg:items-center">
          <span aria-hidden className="h-10 w-px bg-accent-ink" />
          <div className="w-[44%]">
            <FundsControllers />
          </div>
        </div>
      </div>
    </DiagramFrame>
  )
}

/* ── FX settlement · Two payment instructions. One linked FX settlement. ── */

export function RtgsFx() {
  return (
    <DiagramFrame
      eyebrow="RTGS.global / FX settlement"
      title="Two payment instructions. One linked FX settlement."
      subtitle="Payment-versus-payment settlement after counterparties have agreed a trade."
      footnote="Concept illustration based on the RTGS.global Link and Settle service."
    >
      <div className="flex flex-col gap-8">
        <StageRow
          stages={[
            {
              title: "Agree the trade",
              body: "Participants agree the currencies, amounts and rate.",
            },
            {
              title: "Link the instructions",
              body: "Each participant submits its settlement instruction.",
              on: true,
            },
            {
              title: "Settle and confirm",
              body: "The network links the requests; accounts and balances update.",
            },
          ]}
        />
        <p className="text-base text-ink-soft lg:text-xl">
          Settlement requires matching instructions and sufficient funds.
        </p>
      </div>
    </DiagramFrame>
  )
}
