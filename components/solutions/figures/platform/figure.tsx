import * as React from "react"

import { Dots, Line, Plate, Solid } from "@/components/iso/react/draw"
import "@/components/iso/iso.css"
import "@/components/iso/line.css"
import {
  BUILDINGS,
  HEIGHT,
  HUB_DEPTH,
  PADS,
  PATHS,
  PLATFORM,
  SCREEN_ROUTES,
  WIDTH,
} from "./geometry"
import { PlatformLive, type Leg } from "./live"

/*
 * Static art, built on the server and handed to the live layer as element
 * props. Every root carries a key (see the kit's React notes on large pages).
 */
const PLATFORM_ART = (
  <g key="platform">
    <path className="iso-halo" d={PLATFORM.halo} />
    {PLATFORM.layers.map((paths, index) => (
      <Solid key={index} paths={paths} tone="hi" crease="lo" />
    ))}
    <Line d={PLATFORM.lip} tone="faint" />
    <Dots points={PLATFORM.screws} size={0.7} tone="lo" />
  </g>
)

const GROUND = (
  <g key="ground">
    {PADS.rings.map(({ id, d }) => (
      <path key={id} className="iso-line" data-tone="lo" data-plot={id} d={d} />
    ))}
    <Line d={PATHS.lines} tone="mid" />
    <Dots points={PATHS.nodes} size={1.1} tone="hi" />
  </g>
)

const buildingArt = (building: (typeof BUILDINGS)[number]) => (
  <g key={building.id}>
    {building.parts.map(({ paths, lit }, index) => (
      <Solid key={index} paths={paths} tone="hi" crease="lo" lit={lit} />
    ))}
    {building.lines ? <Line d={building.lines} tone="lo" /> : null}
  </g>
)

/* Buildings behind the hub draw under the pulse; those in front, over it. */
const BACK = [
  PLATFORM_ART,
  GROUND,
  ...BUILDINGS.filter((b) => b.depth < HUB_DEPTH).map(buildingArt),
]
const FRONT = BUILDINGS.filter((b) => b.depth >= HUB_DEPTH).map(buildingArt)

const out = (route: (typeof SCREEN_ROUTES)["bank"]) => route
const back = (route: (typeof SCREEN_ROUTES)["bank"]) => [...route].reverse()

/*
 * One participant's journey: from home to the shared record, out to each
 * function in turn and back through the record between them, so every stage
 * reads from and writes to the same place.
 */
const LEGS: Leg[] = [
  {
    route: back(SCREEN_ROUTES.homes),
    plot: "record",
    row: "record",
    chip: "records",
  },
  {
    route: out(SCREEN_ROUTES.ministry),
    plot: "ministry",
    row: "identity",
    chip: "identity",
  },
  { route: back(SCREEN_ROUTES.ministry), plot: "record" },
  {
    route: out(SCREEN_ROUTES.clinic),
    plot: "clinic",
    row: "service",
    chip: "services",
  },
  { route: back(SCREEN_ROUTES.clinic), plot: "record" },
  {
    route: out(SCREEN_ROUTES.bank),
    plot: "bank",
    row: "payment",
    chip: "services",
  },
  { route: back(SCREEN_ROUTES.bank), plot: "record" },
  { route: out(SCREEN_ROUTES.homes), plot: "homes" },
]

const CHIPS = [
  { id: "identity", label: "Identity & access" },
  { id: "records", label: "Records & operations" },
  { id: "services", label: "Services & transactions" },
]

const ROWS = [
  { id: "record", field: "Record", pending: "New", done: "Created" },
  {
    id: "identity",
    field: "Identity",
    pending: "Unverified",
    done: "Verified",
  },
  { id: "service", field: "Service", pending: "Eligible", done: "Delivered" },
  { id: "payment", field: "Payment", pending: "Pending", done: "Settled" },
]

const CHIPS_ROW = (
  <div className="flex flex-wrap justify-center gap-2 pb-4">
    {CHIPS.map((chip) => (
      <span key={chip.id} className="line-chip" data-chip={chip.id}>
        {chip.label}
      </span>
    ))}
  </div>
)

const CARD = (
  <div
    aria-hidden
    className="line-card pointer-events-none absolute top-0 left-0 hidden w-[200px] sm:block"
  >
    <div className="px-3 py-2.5 uppercase">Participant · 0412</div>
    {ROWS.map((row) => (
      <div
        key={row.id}
        data-row={row.id}
        className="line-card-row group flex items-center justify-between gap-2 px-3 py-2"
      >
        <span>{row.field}</span>
        <span className="line-card-state flex items-center gap-1.5">
          <span className="line-card-dot size-1.5 rounded-full" />
          <span className="group-data-[done]:hidden">{row.pending}</span>
          <span className="hidden group-data-[done]:inline">{row.done}</span>
        </span>
      </div>
    ))}
  </div>
)

const LABEL =
  "A platform of three layers carrying six institutions on round plots: a ministry, a clinic, a bank, a market, homes and a field agent, each joined by a path to a shared record at the centre. A participant moves from home to the record, then out to the ministry to verify identity, the clinic for a service and the bank for payment, passing back through the record each time."

/** Fig 01 · Digital Infrastructure: one platform, many institutions. */
export function PlatformFigure({ fig = "Fig 01" }: { fig?: string }) {
  return (
    <div className="iso softcom-line">
      <Plate
        fig={fig}
        title="One platform"
        hint="Shared rails"
        readout="Participant journey"
      >
        <PlatformLive
          legs={LEGS}
          width={WIDTH}
          height={HEIGHT}
          label={LABEL}
          back={BACK}
          front={FRONT}
          chips={CHIPS_ROW}
          card={CARD}
        />
      </Plate>
    </div>
  )
}
