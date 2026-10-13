import * as React from "react"

import { Dots, Line, Solid } from "@/components/iso/react/draw"
import "@/components/iso/iso.css"
import "@/components/iso/line.css"
import {
  AUDIT,
  FINANCIAL,
  HEIGHT,
  MARKET,
  REGULATORY,
  SOCIETAL,
  WIDTH,
  type Vignette,
} from "./geometry"

const VIGNETTES = {
  audit: AUDIT,
  financial: FINANCIAL,
  market: MARKET,
  regulatory: REGULATORY,
  societal: SOCIETAL,
} satisfies Record<string, Vignette>

export type VignetteId = keyof typeof VIGNETTES

/** One small line drawing for the Applied Intelligence rail. */
export function VignetteFigure({
  id,
  label,
}: {
  id: VignetteId
  label: string
}) {
  const v = VIGNETTES[id]
  return (
    <div className="iso softcom-line">
      <svg
        className="iso-svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={label}
        focusable="false"
      >
        {v.shadow.map((d, index) => (
          <path
            key={index}
            className="line-shadow"
            d={d}
            fill={`url(#ld-shadow-${index})`}
          />
        ))}
        <Solid paths={v.tile} tone="hi" crease="lo" />
        <Line d={v.ground} tone="lo" />
        <Dots points={v.dots} size={1.2} tone="hi" />
        {v.items.map((item, index) => (
          <g key={index}>
            {item.parts.map(({ paths, lit }, part) => (
              <Solid key={part} paths={paths} tone="hi" crease="lo" lit={lit} />
            ))}
            {item.lines ? <Line d={item.lines} tone="lo" /> : null}
          </g>
        ))}
      </svg>
    </div>
  )
}
