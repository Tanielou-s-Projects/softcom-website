/*
 * The light table's timeline: one pure function of time, shared by the live
 * layer and the server (which renders the resting readout).
 */
import { CARDS, LINKS, LOUPE_OFFSET, VISITS } from "./geometry"

const MOVE = 0.9
const DWELL = 0.8
const VISIT = MOVE + DWELL
/** After the last visit, the threads hold, then clear for the next pass. */
const HOLD = 1.2
const CLEAR = 0.6
export const CYCLE = VISITS.length * VISIT + HOLD + CLEAR

const ease = (u: number) => u * u * (3 - 2 * u)
const clamp = (u: number) => Math.max(0, Math.min(1, u))

/** Carriage position that puts the lens over a record. */
const standOver = ([x, y]: [number, number]): [number, number] => [
  x - LOUPE_OFFSET,
  y,
]

export function poseOf(time: number) {
  const t = time % CYCLE
  const visit = Math.min(VISITS.length - 1, Math.floor(t / VISIT))
  const into = t - visit * VISIT
  const from = standOver(VISITS[(visit + VISITS.length - 1) % VISITS.length])
  const to = standOver(VISITS[visit])
  const u =
    visit === 0 && t < VISIT
      ? ease(clamp(into / MOVE))
      : ease(clamp(into / MOVE))
  const x = from[0] + (to[0] - from[0]) * u
  const y = from[1] + (to[1] - from[1]) * u
  const done = Math.min(VISITS.length * VISIT, t)
  // A record counts as examined once the loupe has settled over it.
  const examined = Math.min(
    VISITS.length,
    Math.floor((done - MOVE) / VISIT) + 1
  )
  const clearing = clamp((t - (VISITS.length * VISIT + HOLD)) / CLEAR)
  const threads = LINKS.map((_, i) => {
    // Link i is pinned when the loupe settles on its second record.
    const pinned = (2 * i + 1) * VISIT + MOVE
    return clamp((t - pinned) / 0.3) * (1 - clearing)
  })
  return {
    x,
    y,
    threads,
    examined: Math.max(0, examined),
    linked: threads.filter((value) => value > 0.5).length,
  }
}

export const readoutOf = (examined: number, linked: number) =>
  `records ${CARDS.length} · examined ${examined} · linked ${linked}`

/** The pose reduced motion holds: the second match just pinned. */
export const STILL = 3 * VISIT + MOVE + 0.5
export const STILL_POSE = poseOf(STILL)
