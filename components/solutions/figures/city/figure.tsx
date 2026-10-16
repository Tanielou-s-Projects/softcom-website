import * as React from "react"

import { Dots, Line, Solid } from "@/components/iso/react/draw"
import "@/components/iso/iso.css"
import "@/components/iso/line.css"
import { LIT_STEPS } from "@/components/iso/line-dither"
import {
  DECK_ART,
  HEIGHT,
  LINK_ART,
  LINK_NODES,
  LOT_ART,
  ROAD_ART,
  THINGS,
  WIDTH,
  type Zone,
} from "./geometry"

/** The record a stage writes, shown beside its district while it is lit. */
const CALLOUTS: Record<Zone, { title: string; rows: [string, string][] }> = {
  identity: {
    title: "Person",
    rows: [
      ["Registered", "Desk 3"],
      ["Identity", "Verified"],
      ["Access", "3 services"],
    ],
  },
  records: {
    title: "Record 0412",
    rows: [
      ["Cases", "2 open"],
      ["Updates", "14 today"],
      ["Shared with", "5 agencies"],
    ],
  },
  services: {
    title: "Payment",
    rows: [
      ["Approved", "Eligibility met"],
      ["Amount", "₦25,000"],
      ["Status", "Settled"],
    ],
  },
}

const LABEL =
  "A city block on a two-layer platform. A registration office with a queue and a self-service kiosk, a data hall beside a stack of record platters and document stacks, and a bank, a clinic, market stalls, a pharmacy and a delivery truck, with housing in front. A road and data links join every district to the shared record."

/**
 * Digital Infrastructure as a city block. Static art; a parent sets
 * `data-focus` on the wrapper to light one stage (see `line.css`).
 */
export function CityFigure({ focus }: { focus?: Zone }) {
  return (
    <div className="iso softcom-line" data-focus={focus}>
      <div className="relative">
        <svg
          className="iso-svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={LABEL}
          focusable="false"
        >
          <g key="deck">
            {DECK_ART.shadow.map((d, index) => (
              <path
                key={index}
                className="line-shadow"
                d={d}
                fill={`url(#ld-shadow-${index})`}
              />
            ))}
            <Solid paths={DECK_ART.under} tone="hi" crease="lo" />
            <Solid paths={DECK_ART.deck} tone="hi" crease="lo" />
            <Line d={DECK_ART.lip} tone="faint" />
            <Dots points={DECK_ART.screws} size={0.7} tone="lo" />
          </g>
          <g key="ground">
            {LOT_ART.map((lot) => (
              <g key={lot.key}>
                {/* The lit weave, resolving step by step when focused. */}
                {lot.zone
                  ? LIT_STEPS.map((_, step) => (
                      <path
                        key={step}
                        className="line-lot-dither"
                        data-zone={lot.zone}
                        data-step={step}
                        d={lot.d}
                        fill={`url(#ld-lit-${step})`}
                      />
                    ))
                  : null}
                <path
                  className="iso-line line-lot"
                  data-tone="lo"
                  data-zone={lot.zone}
                  d={lot.d}
                />
              </g>
            ))}
            <Line d={ROAD_ART.kerbs} tone="lo" />
            <Line d={ROAD_ART.centre} tone="faint" dashed />
            {LINK_ART.map((link, index) => (
              <path
                key={index}
                className="iso-line line-link"
                data-tone="mid"
                data-zone={link.zone}
                d={link.d}
              />
            ))}
            <Dots points={LINK_NODES} size={1.1} tone="hi" />
          </g>
          {THINGS.map((thing, index) => (
            <g key={index} className="line-thing" data-zone={thing.zone}>
              {thing.parts.map(({ paths, lit }, part) => (
                <Solid
                  key={part}
                  paths={paths}
                  tone="hi"
                  crease="lo"
                  lit={lit}
                />
              ))}
              {thing.lines ? <Line d={thing.lines} tone="lo" /> : null}
            </g>
          ))}
        </svg>

        {(Object.keys(CALLOUTS) as Zone[]).map((zone) => (
          <div
            key={zone}
            aria-hidden
            data-callout={zone}
            className="line-callout pointer-events-none absolute top-[3%] left-[2%] hidden w-[200px] overflow-clip rounded-2xl bg-surface text-ink shadow-sm ring-1 ring-ink/10 sm:block"
          >
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <span className="size-1.5 rounded-full bg-accent-ink" />
              <span className="font-heading text-sm font-medium">
                {CALLOUTS[zone].title}
              </span>
            </div>
            <dl className="flex flex-col gap-2 border-t border-line px-4 py-3 text-xs">
              {CALLOUTS[zone].rows.map(([field, value]) => (
                <div
                  key={field}
                  className="flex items-center justify-between gap-3"
                >
                  <dt className="text-ink-soft">{field}</dt>
                  <dd className="font-medium tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
