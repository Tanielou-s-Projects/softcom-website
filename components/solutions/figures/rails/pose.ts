/*
 * The yard's timeline: one pure function of time, shared by the live layer
 * and the server (which renders the resting readout before hydration).
 */
import { AT } from "./geometry"

/** One run of the yard, in seconds: magazine → gate → stamp → till → tray. */
const CYCLE = 7.2

type Key = [number, number]
/** Eased (smoothstep) interpolation through keyframes [t, value]. */
function track(keys: Key[], t: number) {
  if (t <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i]
    if (t <= t1) {
      const [t0, v0] = keys[i - 1]
      const u = (t - t0) / Math.max(1e-6, t1 - t0)
      return v0 + (v1 - v0) * u * u * (3 - 2 * u)
    }
  }
  return keys[keys.length - 1][1]
}

const X: Key[] = [
  [0, AT.magazine],
  [0.5, AT.magazine],
  [1.5, AT.gate - 14],
  [1.9, AT.gate - 14],
  [3.3, AT.stamp],
  [4.2, AT.stamp],
  [5.0, AT.till],
  [5.8, AT.till],
  [6.5, AT.tray],
]
const BAR: Key[] = [
  [1.45, 0],
  [1.85, 1],
  [3.0, 1],
  [3.4, 0],
]
const DIP: Key[] = [
  [3.4, 0],
  [3.6, 1],
  [3.8, 1],
  [4.0, 0],
]
const DRAWER: Key[] = [
  [5.0, 0],
  [5.3, 1],
  [5.6, 1],
  [5.9, 0],
]
const FADE: Key[] = [
  [6.8, 1],
  [7.1, 0],
]
/** When each station counts the token, within a run. */
const VERIFY = 1.6
const RECORD = 3.6
const SETTLE = 5.15
/** The pose reduced motion holds: the stamp on the token. */
export const STILL = 3.7

export function poseOf(time: number) {
  const run = Math.floor(time / CYCLE)
  const t = time - run * CYCLE
  return {
    x: track(X, t),
    bar: track(BAR, t),
    dip: track(DIP, t),
    drawer: track(DRAWER, t),
    opacity: track(FADE, t),
    lamp: t > VERIFY && t < VERIFY + 0.7,
    verified: run + (t >= VERIFY ? 1 : 0),
    recorded: run + (t >= RECORD ? 1 : 0),
    settled: run + (t >= SETTLE ? 1 : 0),
  }
}

export const readoutOf = (v: number, r: number, s: number) =>
  `verified ${v} · recorded ${r} · settled ${s}`
export const digitsOf = (n: number) => String(n % 10000).padStart(4, "0")
export const STILL_POSE = poseOf(STILL)
