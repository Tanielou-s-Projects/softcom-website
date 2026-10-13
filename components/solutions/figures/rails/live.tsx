"use client"

import * as React from "react"

import { IsoFigure } from "@/components/iso/react/draw"
import {
  useInView,
  useLoop,
  useReadout,
  useStillness,
} from "@/components/iso/react/live"
import { digitsOf, poseOf, readoutOf, STILL, STILL_POSE } from "./pose"
import {
  along,
  BAR_LIFT,
  DRAWER_OUT,
  HEIGHT,
  STAMP_DIP,
  WIDTH,
} from "./geometry"

/**
 * The yard's moving parts. Static art arrives as element props, already in
 * painter's order; this component slots the moving groups between them and
 * writes their transforms each frame, without re-rendering.
 */
export function RailsLive({
  label,
  face,
  lamp,
  base,
  track: trackArt,
  tray,
  gateBack,
  stampBack,
  token,
  magazine,
  bar,
  gateFront,
  plunger,
  stampFront,
  counter,
  till,
  drawer,
}: {
  label: string
  /** The counter face's transform, for the digit window. */
  face: string
  /** Screen point of the gate reader's lamp. */
  lamp: [number, number]
} & Record<
  | "base"
  | "track"
  | "tray"
  | "gateBack"
  | "stampBack"
  | "token"
  | "magazine"
  | "bar"
  | "gateFront"
  | "plunger"
  | "stampFront"
  | "counter"
  | "till"
  | "drawer",
  React.ReactNode
>) {
  const { anchor, say } = useReadout<HTMLDivElement>()
  const inView = useInView(anchor)
  const still = useStillness()
  const [paused, setPaused] = React.useState(false)

  const tokenRef = React.useRef<SVGGElement>(null)
  const barRef = React.useRef<SVGGElement>(null)
  const plungerRef = React.useRef<SVGGElement>(null)
  const drawerRef = React.useRef<SVGGElement>(null)
  const lampRef = React.useRef<SVGCircleElement>(null)
  const digitsRef = React.useRef<SVGTextElement>(null)
  const clock = React.useRef(0)

  const apply = React.useCallback(
    (time: number) => {
      const pose = poseOf(time)
      tokenRef.current?.setAttribute("transform", along([pose.x, 0, 0]))
      tokenRef.current?.setAttribute("opacity", String(pose.opacity))
      barRef.current?.setAttribute(
        "transform",
        along([0, 0, pose.bar * BAR_LIFT])
      )
      plungerRef.current?.setAttribute(
        "transform",
        along([0, 0, -pose.dip * STAMP_DIP])
      )
      drawerRef.current?.setAttribute(
        "transform",
        along([0, pose.drawer * DRAWER_OUT, 0])
      )
      if (lampRef.current) lampRef.current.toggleAttribute("data-on", pose.lamp)
      if (digitsRef.current)
        digitsRef.current.textContent = digitsOf(pose.recorded)
      say(readoutOf(pose.verified, pose.recorded, pose.settled))
    },
    [say]
  )

  // Reduced motion: one still frame, the stamp on the token.
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
        {trackArt}
        {tray}
        {gateBack}
        {stampBack}
        <g ref={tokenRef} transform={along([STILL_POSE.x, 0, 0])}>
          {token}
        </g>
        {magazine}
        <g ref={barRef} transform={along([0, 0, STILL_POSE.bar * BAR_LIFT])}>
          {bar}
        </g>
        {gateFront}
        <circle
          ref={lampRef}
          className="iso-lamp"
          cx={lamp[0]}
          cy={lamp[1]}
          r={1.1}
        />
        <g
          ref={plungerRef}
          transform={along([0, 0, -STILL_POSE.dip * STAMP_DIP])}
        >
          {plunger}
        </g>
        {stampFront}
        {counter}
        <g transform={face}>
          <rect
            className="iso-window"
            x={-10}
            y={-12}
            width={20}
            height={8}
            rx={1.2}
          />
          <text
            ref={digitsRef}
            className="iso-digits"
            x={0}
            y={-6}
            fontSize={5.2}
            textAnchor="middle"
          >
            {digitsOf(STILL_POSE.recorded)}
          </text>
        </g>
        {till}
        <g
          ref={drawerRef}
          transform={along([0, STILL_POSE.drawer * DRAWER_OUT, 0])}
        >
          {drawer}
        </g>
      </IsoFigure>
    </div>
  )
}
