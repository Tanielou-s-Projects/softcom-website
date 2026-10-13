"use client"

import * as React from "react"

import { IsoFigure } from "@/components/iso/react/draw"
import {
  useInView,
  useLoop,
  useReadout,
  useStillness,
} from "@/components/iso/react/live"
import { along, COIN_DROP, HEIGHT, WIDTH } from "./geometry"
import { needleOf, PEGS, poseOf, readoutOf, STILL, STILL_POSE } from "./pose"

/**
 * The line's moving parts: the pegs ride the belt, the scanner lamp fires,
 * the booth's screen fills, the coin drops and the dial's needle turns.
 * Static art arrives as element props, already in painter's order.
 */
export function FieldLineLive({
  label,
  face,
  lamp,
  peg,
  base,
  conveyorBack,
  stationsBack,
  hopper,
  conveyorFront,
  enrolFront,
  booth,
  payArm,
  coin,
  tally,
}: {
  label: string
  /** The booth face's transform, for the screen. */
  face: string
  lamp: [number, number]
} & Record<
  | "peg"
  | "base"
  | "conveyorBack"
  | "stationsBack"
  | "hopper"
  | "conveyorFront"
  | "enrolFront"
  | "booth"
  | "payArm"
  | "coin"
  | "tally",
  React.ReactNode
>) {
  const { anchor, say } = useReadout<HTMLDivElement>()
  const inView = useInView(anchor)
  const still = useStillness()
  const [paused, setPaused] = React.useState(false)

  const pegRefs = React.useRef<(SVGGElement | null)[]>([])
  const lampRef = React.useRef<SVGCircleElement>(null)
  const barRef = React.useRef<SVGRectElement>(null)
  const coinRef = React.useRef<SVGGElement>(null)
  const needleRef = React.useRef<SVGPathElement>(null)
  const clock = React.useRef(STILL)

  const apply = React.useCallback(
    (time: number) => {
      const pose = poseOf(time)
      pose.pegs.forEach((peg, i) => {
        const node = pegRefs.current[i]
        if (!node) return
        node.setAttribute("transform", along([peg.x, 0, 0]))
        node.setAttribute("opacity", peg.opacity.toFixed(3))
      })
      lampRef.current?.toggleAttribute("data-on", pose.scan)
      barRef.current?.setAttribute("width", (16 * pose.training).toFixed(2))
      coinRef.current?.setAttribute(
        "transform",
        along([0, 0, -COIN_DROP * pose.drop])
      )
      coinRef.current?.setAttribute("opacity", pose.drop > 0.96 ? "0" : "1")
      needleRef.current?.setAttribute("d", needleOf(pose.needle))
      say(readoutOf(pose))
    },
    [say]
  )

  React.useEffect(() => {
    if (still) apply(STILL)
  }, [still, apply])

  useLoop(
    (dt) => {
      clock.current += dt
      apply(clock.current)
      return true
    },
    inView && !still && !paused
  )

  return (
    <div
      ref={anchor}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label={label}>
        {base}
        {conveyorBack}
        {stationsBack}
        {Array.from({ length: PEGS }, (_, i) => (
          <g
            key={i}
            ref={(node) => {
              pegRefs.current[i] = node
            }}
            transform={along([STILL_POSE.pegs[i].x, 0, 0])}
            opacity={STILL_POSE.pegs[i].opacity}
          >
            {peg}
          </g>
        ))}
        {hopper}
        {conveyorFront}
        <g
          ref={coinRef}
          transform={along([0, 0, -COIN_DROP * STILL_POSE.drop])}
        >
          {coin}
        </g>
        {payArm}
        {enrolFront}
        <circle
          ref={lampRef}
          className="iso-lamp"
          cx={lamp[0]}
          cy={lamp[1]}
          r={1.1}
        />
        {booth}
        <g transform={face}>
          <rect
            className="iso-window"
            x={-12}
            y={-24}
            width={24}
            height={13}
            rx={1.4}
          />
          <rect
            className="iso-track"
            x={-8}
            y={-16}
            width={16}
            height={2}
            rx={1}
          />
          <rect
            ref={barRef}
            className="iso-progress"
            x={-8}
            y={-16}
            width={16 * STILL_POSE.training}
            height={2}
            rx={1}
          />
        </g>
        {tally}
        <path
          ref={needleRef}
          className="iso-line"
          data-tone="lit"
          style={{ strokeWidth: 1.1 }}
          d={needleOf(STILL_POSE.needle)}
        />
      </IsoFigure>
    </div>
  )
}
