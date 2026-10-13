"use client"

import * as React from "react"

import type { Flat } from "@/components/iso/iso-kit"
import {
  asksForStillness,
  useInView,
  useLoop,
} from "@/components/iso/react/live"

/** One move of the participant's journey across the platform. */
export type Leg = {
  /** Screen points, in travel order. */
  route: Flat[]
  /** The plot this leg arrives at, lit while the pulse rests there. */
  plot: string
  /** The record row this arrival completes, if any. */
  row?: string
  /** The chip (the function of the operation) this arrival belongs to. */
  chip?: string
}

const MOVE_S = 1.1
const REST_S = 0.9
const LOOP_REST_S = 2.2

const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

function pointAlong(route: Flat[], t: number): Flat {
  const lengths = route
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - route[i][0], p[1] - route[i][1]))
  const total = lengths.reduce((a, b) => a + b, 0)
  let left = t * total
  for (let i = 0; i < lengths.length; i++) {
    if (left <= lengths[i]) {
      const f = lengths[i] ? left / lengths[i] : 0
      return [
        route[i][0] + (route[i + 1][0] - route[i][0]) * f,
        route[i][1] + (route[i + 1][1] - route[i][1]) * f,
      ]
    }
    left -= lengths[i]
  }
  return route[route.length - 1]
}

/**
 * Moves a pulse leg by leg and marks the record as each stage completes. The
 * static art arrives as element props; only attributes change per frame.
 */
export function PlatformLive({
  legs,
  width,
  height,
  label,
  back,
  front,
  chips,
  card,
}: {
  legs: Leg[]
  width: number
  height: number
  label: string
  back: React.ReactNode
  front: React.ReactNode
  /** HTML over the drawing: the function chips. */
  chips: React.ReactNode
  /** HTML pinned to the drawing's corner: the record card. */
  card: React.ReactNode
}) {
  const root = React.useRef<HTMLDivElement>(null)
  const pulse = React.useRef<SVGGElement>(null)
  const inView = useInView(root)
  const state = React.useRef({ leg: 0, t: 0, phase: "move" as "move" | "rest" })

  const mark = React.useCallback(
    (upTo: number, resting: boolean) => {
      const el = root.current
      if (!el) return
      const leg = legs[upTo]
      el.querySelectorAll<SVGElement>("[data-plot]").forEach((node) => {
        node.toggleAttribute(
          "data-on",
          resting && node.dataset.plot === leg.plot
        )
      })
      const done = new Set(
        legs
          .slice(0, resting ? upTo + 1 : upTo)
          .flatMap((l) => (l.row ? [l.row] : []))
      )
      el.querySelectorAll<HTMLElement>("[data-row]").forEach((node) => {
        node.toggleAttribute("data-done", done.has(node.dataset.row ?? ""))
      })
      el.querySelectorAll<HTMLElement>("[data-chip]").forEach((node) => {
        node.toggleAttribute(
          "data-on",
          Boolean(leg.chip) && node.dataset.chip === leg.chip
        )
      })
    },
    [legs]
  )

  const place = (point: Flat | null) => {
    const g = pulse.current
    if (!g) return
    if (!point) g.setAttribute("opacity", "0")
    else {
      g.setAttribute("opacity", "1")
      g.setAttribute(
        "transform",
        `translate(${point[0].toFixed(1)} ${point[1].toFixed(1)})`
      )
    }
  }

  // Reduced motion: the finished record, no pulse.
  React.useEffect(() => {
    if (!asksForStillness()) return
    mark(legs.length - 1, true)
    root.current
      ?.querySelectorAll("[data-plot]")
      .forEach((n) => n.removeAttribute("data-on"))
    place(null)
  }, [legs, mark])

  useLoop((dt, calm) => {
    if (calm) return false
    const s = state.current
    s.t += dt
    const last = s.leg === legs.length - 1
    if (s.phase === "move") {
      const f = Math.min(1, s.t / MOVE_S)
      place(pointAlong(legs[s.leg].route, ease(f)))
      if (f === 1) {
        s.phase = "rest"
        s.t = 0
        mark(s.leg, true)
      }
    } else if (s.t >= (last ? LOOP_REST_S : REST_S)) {
      s.leg = last ? 0 : s.leg + 1
      s.phase = "move"
      s.t = 0
      mark(s.leg, false)
    }
    return true
  }, inView)

  return (
    <div ref={root} className="iso-line-stage">
      {chips}
      <div className="relative mx-auto max-w-[880px]">
        {card}
        <svg
          className="iso-svg"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={label}
          focusable="false"
        >
          {back}
          <g ref={pulse} opacity="0" className="iso-pulse">
            <circle r="6" className="iso-pulse-glow" />
            <circle r="2.6" className="iso-pulse-dot" />
          </g>
          {front}
        </svg>
      </div>
    </div>
  )
}
