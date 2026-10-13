import * as React from "react"

import { Dots, Line, Plate, Solid, Wire } from "@/components/iso/react/draw"
import "@/components/iso/iso.css"
import "@/components/iso/softcom.css"
import { CARD_ART, GANTRY_ART, TABLE_ART, THREADS } from "./geometry"
import { LightTableLive } from "./live"
import { readoutOf, STILL_POSE } from "./pose"

const TABLE = (
  <g key="table">
    <path className="iso-halo" d={TABLE_ART.halo} />
    {TABLE_ART.feet.map((parts, index) => (
      <g key={index}>
        {parts.map((paths, part) => (
          <Solid
            key={part}
            paths={paths}
            tone={part ? "mid" : "lo"}
            crease="faint"
          />
        ))}
      </g>
    ))}
    <Solid paths={TABLE_ART.cabinet} tone="mid" crease="faint" />
    <Line d={TABLE_ART.seam} tone="faint" />
    <Solid paths={TABLE_ART.glass} tone="lo" crease="none" flat />
    <Line d={TABLE_ART.glassGrid} tone="faint" />
    <Line d={TABLE_ART.ticksMinor} tone="lo" />
    <Line d={TABLE_ART.ticksMajor} tone="mid" />
    <Dots points={TABLE_ART.screws} size={0.45} tone="mid" />
  </g>
)

const CARDS = (
  <g key="cards">
    {CARD_ART.map((card) => (
      <g key={card.index}>
        <path className="iso-halo" d={card.halo} />
        <Solid paths={card.body} tone="hi" crease="faint" />
        <Line d={card.rules} tone="lo" free />
        <Solid paths={card.pinBase} tone="mid" crease="none" />
        <Solid paths={card.pin} tone="mid" crease="none" />
      </g>
    ))}
  </g>
)

const THREAD_ART = THREADS.map((thread, index) => (
  <Wire
    key={index}
    from={thread.from}
    to={thread.to}
    tone="lit"
    ends="both"
    size={1}
  />
))

const BACK = (
  <g key="back">
    {GANTRY_ART.backPosts.map((parts, index) => (
      <g key={index}>
        {parts.map((paths, part) => (
          <Solid
            key={part}
            paths={paths}
            tone={part ? "mid" : "lo"}
            crease="faint"
          />
        ))}
      </g>
    ))}
    <Solid paths={GANTRY_ART.backRail} tone="mid" crease="faint" />
    <Line d={GANTRY_ART.backTicks} tone="lo" />
  </g>
)

const FRONT = (
  <g key="front">
    {GANTRY_ART.frontPosts.map((parts, index) => (
      <g key={index}>
        {parts.map((paths, part) => (
          <Solid
            key={part}
            paths={paths}
            tone={part ? "mid" : "lo"}
            crease="faint"
          />
        ))}
      </g>
    ))}
    <Solid paths={GANTRY_ART.frontRail} tone="mid" crease="faint" />
    <Line d={GANTRY_ART.frontTicks} tone="lo" />
    <Dots points={GANTRY_ART.railScrews} size={0.5} tone="mid" />
  </g>
)

const BRIDGE = (
  <g key="bridge">
    {GANTRY_ART.bridgeEnds.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    <Solid paths={GANTRY_ART.bridge} tone="mid" crease="faint" />
    <Line d={GANTRY_ART.bridgeTicks} tone="lo" />
  </g>
)

const CARRIAGE = (
  <g key="carriage">
    <Solid paths={GANTRY_ART.rod} tone="mid" crease="none" />
    <Solid paths={GANTRY_ART.collar} tone="mid" crease="faint" />
    <Solid paths={GANTRY_ART.lens} tone="hi" crease="lo" lit />
    <Line d={GANTRY_ART.glassRing} tone="lit" />
    <Solid paths={GANTRY_ART.carriage} tone="mid" crease="faint" />
    <Solid paths={GANTRY_ART.knob} tone="mid" crease="faint" />
    <Line d={GANTRY_ART.knobKnurl} tone="lo" />
  </g>
)

const LABEL =
  "A light table with six records on its glass: two documents, two bank statements and two datasets. A gantry runs over it, and a loupe on its carriage visits each record in turn. Each time it has seen both halves of a match, a thread is pinned between them."

/** Fig 02 · Applied Intelligence: connected evidence. */
export function LightTableFigure() {
  return (
    <div className="iso softcom-iso">
      <Plate
        fig="Fig 02"
        title="Connected evidence"
        hint="Hover to pause"
        readout={readoutOf(STILL_POSE.examined, STILL_POSE.linked)}
      >
        <LightTableLive
          label={LABEL}
          table={TABLE}
          cards={CARDS}
          threads={THREAD_ART}
          back={BACK}
          front={FRONT}
          bridge={BRIDGE}
          carriage={CARRIAGE}
        />
      </Plate>
    </div>
  )
}
