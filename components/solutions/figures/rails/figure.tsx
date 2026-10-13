import * as React from "react"

import { Dots, Line, Plate, Solid } from "@/components/iso/react/draw"
import "@/components/iso/iso.css"
import "@/components/iso/softcom.css"
import {
  BASE_ART,
  GATE_ART,
  MAGAZINE_ART,
  STAMP_ART,
  TILL_ART,
  TOKEN_ART,
  TRACK_ART,
  TRAY_ART,
} from "./geometry"
import { RailsLive } from "./live"
import { readoutOf, STILL_POSE } from "./pose"

/*
 * Static art, built on the server and handed to the live layer as element
 * props. Every root carries a key (see the kit's React notes on large pages).
 */
const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((parts, index) => (
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
    <Solid paths={BASE_ART.slab} tone="mid" crease="faint" />
    <Line d={BASE_ART.groove} tone="lo" />
    <Line d={BASE_ART.screwRings} tone="lo" />
    <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
    <Solid paths={BASE_ART.strip} tone="lo" crease="none" />
    <Line d={BASE_ART.ticksMinor} tone="lo" />
    <Line d={BASE_ART.ticksMajor} tone="mid" />
    <Solid paths={BASE_ART.label} tone="lo" crease="none" />
    <Line d={BASE_ART.labelInset} tone="faint" />
    <Line d={BASE_ART.labelRules} tone="lo" free />
    <Dots points={BASE_ART.labelScrews} size={0.45} tone="mid" />
  </g>
)

const TRACK = (
  <g key="track">
    <Solid paths={TRACK_ART.bed} tone="lo" crease="none" />
    {TRACK_ART.ties.map((paths, index) => (
      <Solid key={index} paths={paths} tone="lo" crease="faint" />
    ))}
    <Dots points={TRACK_ART.tieSpikes} size={0.4} tone="mid" />
    {TRACK_ART.rails.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    <Line d={TRACK_ART.railJoins} tone="lo" />
  </g>
)

const TRAY = (
  <g key="tray">
    <Solid paths={TRAY_ART.floor} tone="lo" crease="faint" />
    <Line d={TRAY_ART.lip} tone="faint" />
    <Solid paths={TRAY_ART.stop} tone="mid" crease="faint" />
    <Dots points={TRAY_ART.stopScrews} size={0.45} tone="mid" />
  </g>
)

const GATE_BACK = (
  <g key="gate-back">
    {GATE_ART.back.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
  </g>
)

const STAMP_BACK = (
  <g key="stamp-back">
    <Solid paths={STAMP_ART.feet[0]} tone="lo" crease="faint" />
    <Solid paths={STAMP_ART.back} tone="mid" crease="faint" />
  </g>
)

const TOKEN = (
  <g key="token">
    <path className="iso-halo" d={TOKEN_ART.halo} />
    <Solid paths={TOKEN_ART.carriage} tone="mid" crease="faint" />
    <Dots points={TOKEN_ART.rivets} size={0.4} tone="lo" />
    <Solid paths={TOKEN_ART.puck} tone="hi" crease="lo" lit />
    <Line d={TOKEN_ART.puckRing} tone="lit" />
  </g>
)

const MAGAZINE = (
  <g key="magazine">
    <Solid
      paths={MAGAZINE_ART.block}
      tone="mid"
      crease="faint"
      inner={undefined}
    />
    <Line d={MAGAZINE_ART.seam} tone="faint" />
    <path className="iso-shade" data-shade="0" d={MAGAZINE_ART.mouth} />
    <Line d={MAGAZINE_ART.mouth} tone="lo" />
    <Dots points={MAGAZINE_ART.screws} size={0.45} tone="mid" />
    <Solid paths={MAGAZINE_ART.collar} tone="mid" crease="faint" />
    <Solid paths={MAGAZINE_ART.tube} tone="mid" crease="none" />
    <Line d={MAGAZINE_ART.tubeSeams} tone="faint" />
    <Solid paths={MAGAZINE_ART.cap} tone="mid" crease="faint" />
    <Line d={MAGAZINE_ART.capKnurl} tone="lo" />
  </g>
)

const BAR = (
  <g key="bar">
    <Solid paths={GATE_ART.bar} tone="mid" crease="faint" />
    <Line d={GATE_ART.barStripes} tone="lo" />
  </g>
)

const GATE_FRONT = (
  <g key="gate-front">
    {GATE_ART.front.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
    <Line d={GATE_ART.postSeams} tone="faint" />
    <Solid paths={GATE_ART.beam} tone="mid" crease="faint" />
    <Dots points={GATE_ART.beamScrews} size={0.5} tone="mid" />
    <Solid paths={GATE_ART.reader} tone="mid" crease="faint" />
    <Line d={GATE_ART.readerSlit} tone="lo" />
  </g>
)

const PLUNGER = (
  <g key="plunger">
    <Solid paths={STAMP_ART.rod} tone="mid" crease="none" />
    <Line d={STAMP_ART.rodMarks} tone="lo" />
    <Solid paths={STAMP_ART.head} tone="hi" crease="faint" />
    <Line d={STAMP_ART.headRing} tone="lo" />
  </g>
)

const STAMP_FRONT = (
  <g key="stamp-front">
    <Solid paths={STAMP_ART.feet[1]} tone="lo" crease="faint" />
    <Solid paths={STAMP_ART.front} tone="mid" crease="faint" />
    <Solid paths={STAMP_ART.beam} tone="mid" crease="faint" />
    <Dots points={STAMP_ART.beamScrews} size={0.5} tone="mid" />
    <Solid paths={STAMP_ART.actuator} tone="mid" crease="faint" />
    <Line d={STAMP_ART.actuatorKnurl} tone="lo" />
  </g>
)

const COUNTER = (
  <g key="counter">
    <Solid paths={STAMP_ART.counter} tone="mid" crease="faint" />
    <Line d={STAMP_ART.counterSeam} tone="faint" />
    <Dots points={STAMP_ART.counterScrews} size={0.45} tone="mid" />
  </g>
)

const TILL = (
  <g key="till">
    <Solid paths={TILL_ART.box} tone="mid" crease="faint" />
    <Line d={TILL_ART.slot} tone="lo" />
    <Dots points={TILL_ART.screws} size={0.45} tone="mid" />
  </g>
)

const DRAWER = (
  <g key="drawer">
    <Solid paths={TILL_ART.drawer} tone="mid" crease="faint" />
    <Solid paths={TILL_ART.pull} tone="mid" crease="none" />
  </g>
)

const LABEL =
  "A rail yard on a bench plate. Tokens leave a magazine and run one shared track through three stations: a gate that lifts once a reader verifies the token, a stamp that presses down to record it on a counter, and a till whose drawer opens to settle it. Every station is built on the same rails."

/** Fig 01 · Digital Infrastructure: shared rails. */
export function RailsFigure() {
  return (
    <div className="iso softcom-iso">
      <Plate
        fig="Fig 01"
        title="Shared rails"
        hint="Hover to pause"
        readout={readoutOf(
          STILL_POSE.verified,
          STILL_POSE.recorded,
          STILL_POSE.settled
        )}
      >
        <RailsLive
          label={LABEL}
          face={STAMP_ART.face}
          lamp={GATE_ART.lamp}
          base={BASE}
          track={TRACK}
          tray={TRAY}
          gateBack={GATE_BACK}
          stampBack={STAMP_BACK}
          token={TOKEN}
          magazine={MAGAZINE}
          bar={BAR}
          gateFront={GATE_FRONT}
          plunger={PLUNGER}
          stampFront={STAMP_FRONT}
          counter={COUNTER}
          till={TILL}
          drawer={DRAWER}
        />
      </Plate>
    </div>
  )
}
