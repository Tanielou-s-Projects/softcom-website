"use client"

import * as React from "react"

import { IsoFigure } from "@/components/iso/react/draw"
import {
  useInView,
  useLoop,
  useReadout,
  useStillness,
} from "@/components/iso/react/live"
import { along, HEIGHT, WIDTH } from "./geometry"
import { poseOf, readoutOf, STILL, STILL_POSE } from "./pose"

/**
 * The light table's moving parts: the bridge rides the rails (x), the
 * carriage and loupe ride the bridge (x and y), and each thread fades in when
 * its match is found. Static art arrives as element props in painter's order.
 */
export function LightTableLive({
  label,
  table,
  cards,
  threads,
  back,
  front,
  bridge,
  carriage,
}: {
  label: string
  threads: React.ReactNode[]
} & Record<
  "table" | "cards" | "back" | "front" | "bridge" | "carriage",
  React.ReactNode
>) {
  const { anchor, say } = useReadout<HTMLDivElement>()
  const inView = useInView(anchor)
  const still = useStillness()
  const [paused, setPaused] = React.useState(false)

  const bridgeRef = React.useRef<SVGGElement>(null)
  const carriageRef = React.useRef<SVGGElement>(null)
  const threadRefs = React.useRef<(SVGGElement | null)[]>([])
  const clock = React.useRef(0)

  const apply = React.useCallback(
    (time: number) => {
      const pose = poseOf(time)
      bridgeRef.current?.setAttribute("transform", along([pose.x, 0, 0]))
      carriageRef.current?.setAttribute("transform", along([pose.x, pose.y, 0]))
      pose.threads.forEach((value, i) =>
        threadRefs.current[i]?.setAttribute("opacity", value.toFixed(3))
      )
      say(readoutOf(pose.examined, pose.linked))
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
        {table}
        {cards}
        {threads.map((thread, i) => (
          <g
            key={i}
            ref={(node) => {
              threadRefs.current[i] = node
            }}
            opacity={STILL_POSE.threads[i]}
          >
            {thread}
          </g>
        ))}
        {back}
        {front}
        <g ref={bridgeRef} transform={along([STILL_POSE.x, 0, 0])}>
          {bridge}
        </g>
        <g ref={carriageRef} transform={along([STILL_POSE.x, STILL_POSE.y, 0])}>
          {carriage}
        </g>
      </IsoFigure>
    </div>
  )
}
