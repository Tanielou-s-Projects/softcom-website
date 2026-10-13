/*
 * The delivery line's timeline: participants join every SPACING units and
 * ride the belt at SPEED; each station counts the ones that have passed it.
 * Pure, shared by the live layer and the server.
 */
import * as k from "@/components/iso/iso-kit"
import { AT, BELT_FROM, BELT_TO, DIAL, P } from "./geometry"

const SPEED = 30
const SPACING = 64
/** Enough pegs to keep the belt full. */
export const PEGS = Math.ceil((BELT_TO - BELT_FROM) / SPACING) + 1
/** One full turn of the dial. */
const TURN = 40

const clamp = (u: number) => Math.max(0, Math.min(1, u))

/** How many participants have passed a point on the belt by `time`. */
const passed = (x: number, time: number) =>
  Math.max(0, Math.floor((SPEED * time - (x - BELT_FROM)) / SPACING) + 1)

export function poseOf(time: number) {
  const offset = (SPEED * time) % SPACING
  const pegs = Array.from({ length: PEGS }, (_, i) => {
    const x = BELT_FROM + offset + (PEGS - 1 - i) * SPACING
    // Fade in out of the hopper's mouth and away into the tally's chute.
    const opacity =
      clamp((x - BELT_FROM + 4) / 8) * clamp((BELT_TO + 4 - x) / 10)
    return { x, opacity }
  })
  const near = (station: number, width: number) =>
    1 - clamp(Math.min(...pegs.map((p) => Math.abs(p.x - station))) / width)
  const reached = passed(BELT_TO, time)
  return {
    pegs,
    scan: near(AT.enrol, 7) > 0.2,
    training: near(AT.train, 26),
    drop: near(AT.pay, 10),
    needle: ((reached % TURN) / TURN) * Math.PI * 2,
    enrolled: passed(AT.enrol, time),
    trained: passed(AT.train, time),
    paid: passed(AT.pay, time),
    reached,
  }
}

/** The dial's needle at an angle (0 points to −y, clockwise from above). */
export function needleOf(angle: number) {
  const length = DIAL.r - 4
  const tip: [number, number] = [
    DIAL.x + Math.sin(angle) * length,
    DIAL.y - Math.cos(angle) * length,
  ]
  const tail: [number, number] = [
    DIAL.x - Math.sin(angle) * 3,
    DIAL.y + Math.cos(angle) * 3,
  ]
  return k.lineOnTop(tail, tip, DIAL.top + 0.2, P)
}

export const readoutOf = (pose: ReturnType<typeof poseOf>) =>
  `enrolled ${pose.enrolled} · trained ${pose.trained} · paid ${pose.paid} · reached ${pose.reached}`

/** The pose reduced motion holds: a coin landing, the line full. */
export const STILL = (SPACING * 3 + (AT.pay - BELT_FROM)) / SPEED
export const STILL_POSE = poseOf(STILL)
