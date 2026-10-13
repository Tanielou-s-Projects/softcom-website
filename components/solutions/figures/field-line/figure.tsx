import * as React from "react"

import { Dots, Line, Plate, Solid } from "@/components/iso/react/draw"
import "@/components/iso/iso.css"
import "@/components/iso/softcom.css"
import {
  BASE_ART,
  CONVEYOR_ART,
  ENROL_ART,
  HOPPER_ART,
  PAY_ART,
  PEG_ART,
  TALLY_ART,
  TRAIN_ART,
} from "./geometry"
import { FieldLineLive } from "./live"
import { readoutOf, STILL_POSE } from "./pose"

const solids = (
  list: Parameters<typeof Solid>[0]["paths"][],
  tone: "lo" | "mid"
) =>
  list.map((paths, index) => (
    <Solid key={index} paths={paths} tone={tone} crease="faint" />
  ))

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
    <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
    <Solid paths={BASE_ART.strip} tone="lo" crease="none" />
    <Line d={BASE_ART.ticksMinor} tone="lo" />
    <Line d={BASE_ART.ticksMajor} tone="mid" />
  </g>
)

const CONVEYOR_BACK = (
  <g key="conveyor-back">
    {solids(CONVEYOR_ART.backLegs, "lo")}
    <Solid paths={CONVEYOR_ART.bed} tone="lo" crease="faint" />
    {solids(CONVEYOR_ART.frontLegs, "lo")}
    <Solid paths={CONVEYOR_ART.belt} tone="mid" crease="faint" />
    <Line d={CONVEYOR_ART.cleats} tone="lo" />
    <Solid paths={CONVEYOR_ART.backGuard} tone="mid" crease="faint" />
  </g>
)

const STATIONS_BACK = (
  <g key="stations-back">
    <Solid paths={ENROL_ART.back} tone="mid" crease="faint" />
    <Solid paths={PAY_ART.postBase} tone="lo" crease="faint" />
    <Solid paths={PAY_ART.post} tone="mid" crease="none" />
  </g>
)

const PEG = (
  <g key="peg">
    <path className="iso-halo" d={PEG_ART.halo} />
    <Solid paths={PEG_ART.body} tone="hi" crease="faint" />
    <Line d={PEG_ART.band} tone="faint" />
    <Solid paths={PEG_ART.neck} tone="mid" crease="none" />
    <Solid paths={PEG_ART.head} tone="hi" crease="faint" />
  </g>
)

const HOPPER = (
  <g key="hopper">
    <Solid paths={HOPPER_ART.box} tone="mid" crease="faint" />
    <Line d={HOPPER_ART.seam} tone="faint" />
    <path className="iso-shade" data-shade="0" d={HOPPER_ART.mouth} />
    <Line d={HOPPER_ART.mouth} tone="lo" />
    <Solid paths={HOPPER_ART.lip} tone="mid" crease="faint" />
    <Line d={HOPPER_ART.well} tone="lo" />
    {solids(HOPPER_ART.waiting, "mid")}
    <Dots points={HOPPER_ART.screws} size={0.45} tone="mid" />
  </g>
)

const CONVEYOR_FRONT = (
  <g key="conveyor-front">
    <Solid paths={CONVEYOR_ART.frontGuard} tone="mid" crease="faint" />
  </g>
)

const COIN = (
  <g key="coin">
    <Solid paths={PAY_ART.coin} tone="hi" crease="lo" lit />
  </g>
)

const PAY_ARM = (
  <g key="pay-arm">
    <Solid paths={PAY_ART.dispenser} tone="mid" crease="faint" />
    <Line d={PAY_ART.dispenserSeams} tone="faint" />
    <Solid paths={PAY_ART.arm} tone="mid" crease="faint" />
    <Dots points={PAY_ART.armScrews} size={0.5} tone="mid" />
  </g>
)

const ENROL_FRONT = (
  <g key="enrol-front">
    <Solid paths={ENROL_ART.front} tone="mid" crease="faint" />
    <Solid paths={ENROL_ART.scanner} tone="mid" crease="faint" />
    <Line d={ENROL_ART.scanSlit} tone="lo" />
    <Solid paths={ENROL_ART.beam} tone="mid" crease="faint" />
    <Dots points={ENROL_ART.screws} size={0.5} tone="mid" />
  </g>
)

const BOOTH = (
  <g key="booth">
    <Solid paths={TRAIN_ART.booth} tone="mid" crease="faint" />
    <Line d={TRAIN_ART.seam} tone="faint" />
    <Solid paths={TRAIN_ART.cap} tone="mid" crease="faint" />
    <Line d={TRAIN_ART.vents} tone="lo" />
  </g>
)

const TALLY = (
  <g key="tally">
    <Solid paths={TALLY_ART.box} tone="mid" crease="faint" />
    <Line d={TALLY_ART.seam} tone="faint" />
    <path className="iso-shade" data-shade="0" d={TALLY_ART.chute} />
    <Line d={TALLY_ART.chute} tone="lo" />
    <Solid paths={TALLY_ART.puck} tone="mid" crease="faint" />
    <Line d={TALLY_ART.knurl} tone="faint" />
    <Line d={TALLY_ART.bezel} tone="lo" />
    <Line d={TALLY_ART.minor} tone="lo" />
    <Line d={TALLY_ART.major} tone="mid" />
    <Line d={TALLY_ART.hub} tone="hi" />
  </g>
)

const LABEL =
  "A delivery line on a bench. Participants leave a hopper on a belt and pass an enrolment arch whose lamp fires as each is scanned, a training booth whose screen fills as they pass, and a dispenser that drops a coin onto each one. The belt ends at a tally whose dial counts the people reached."

/** Fig 03 · Powering Initiatives: reaching people. */
export function FieldLineFigure() {
  return (
    <div className="iso softcom-iso">
      <Plate
        fig="Fig 03"
        title="Reaching people"
        hint="Hover to pause"
        readout={readoutOf(STILL_POSE)}
      >
        <FieldLineLive
          label={LABEL}
          face={TRAIN_ART.face}
          lamp={ENROL_ART.lamp}
          peg={PEG}
          base={BASE}
          conveyorBack={CONVEYOR_BACK}
          stationsBack={STATIONS_BACK}
          hopper={HOPPER}
          conveyorFront={CONVEYOR_FRONT}
          enrolFront={ENROL_FRONT}
          booth={BOOTH}
          payArm={PAY_ARM}
          coin={COIN}
          tally={TALLY}
        />
      </Plate>
    </div>
  )
}
