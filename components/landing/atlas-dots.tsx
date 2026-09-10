import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Africa as a dot map, rasterised from Natural Earth country geometry
 * (world-atlas countries-110m) rather than drawn by hand: each cell is a
 * point-in-polygon test at its centre, so the coastline, the Gulf of Guinea,
 * the Horn and Madagascar are all where they actually are.
 *
 * Equirectangular, 44 x 46 cells over 18°W–52°E and 38°N–36°S. Regenerate with
 * scripts/rasterise-africa.mjs if the resolution ever needs to change.
 */
const COLS = 44
const ROWS = 46
const BOX = { w: -18, e: 52, s: -36, n: 38 }

const GRID = [
  ".................#..#.................#.....",
  "..........########................######....",
  ".......###########................######....",
  ".....################...##.......########...",
  ".....##################.#################...",
  ".....#####################################..",
  "...#############################..########..",
  "..###############################.##########",
  "..################################.#########",
  ".#################################..########",
  ".##################################.########",
  ".##################################..#######",
  ".##################################...######",
  ".###################################..######",
  "#####################################.####..",
  ".#####################################.#....",
  ".#####################################....#.",
  "..#########################################.",
  "...########################################.",
  "....######################################..",
  "......##.##....###########################..",
  ".................########################...",
  ".................#######################....",
  ".................#####################......",
  ".................#####################......",
  "..................###################.......",
  "...................#################........",
  "...................#################........",
  "...................#################........",
  "...................#################........",
  "....................#################.......",
  "....................#################.....#.",
  "...................##################....##.",
  "...................##################...###.",
  "...................################....###..",
  "...................###############.....###..",
  "....................#############......###..",
  "....................##############.....##...",
  "....................##############.....##...",
  ".....................###########............",
  ".....................###########............",
  "......................##########............",
  "......................#########.............",
  ".......................#######..............",
  ".......................#####................",
  "............................................",
]

/* Grid cell for a real coordinate, in the projection above. */
function cell(lon: number, lat: number) {
  return {
    col: ((lon - BOX.w) / (BOX.e - BOX.w)) * COLS - 0.5,
    row: ((BOX.n - lat) / (BOX.n - BOX.s)) * ROWS - 0.5,
  }
}

/* Lagos: the company was founded here in 2007, and the map resolves from it. */
const HOME = { label: "Lagos — 6.5°N 3.4°E", ...cell(3.4, 6.5) }

/*
 * Route endpoints, one per compass direction. Deliberately unlabelled: the
 * content notes five countries but does not name them, so these read as
 * continental reach rather than claiming specific offices.
 */
const DESTINATIONS = [
  { id: "n", col: 20, row: 6 },
  { id: "e", col: 38, row: 18 },
  { id: "s", col: 25, row: 38 },
  { id: "w", col: 6, row: 17 },
]

/* Land cells, banded by distance from Lagos so the map resolves outward. */
const BANDS = 18
const CELLS = GRID.flatMap((line, row) =>
  [...line].flatMap((ch, col) =>
    ch === "#"
      ? [
          {
            col,
            row,
            band: Math.min(
              BANDS - 1,
              Math.round(Math.hypot(col - HOME.col, row - HOME.row) / 2.6)
            ),
          },
        ]
      : []
  )
)

/* A great-circle-ish arc: a quadratic bowed perpendicular to the chord. */
function arc(a: { col: number; row: number }, b: { col: number; row: number }) {
  const mx = (a.col + b.col) / 2
  const my = (a.row + b.row) / 2
  const dx = b.col - a.col
  const dy = b.row - a.row
  const len = Math.hypot(dx, dy)
  /* Bow left of travel, scaled to the span, so long routes arch more. */
  const bow = len * 0.16
  return `M${a.col} ${a.row} Q${mx + (-dy / len) * bow} ${
    my + (dx / len) * bow
  } ${b.col} ${b.row}`
}

/**
 * The hero's atlas: Africa drawn as a field of square dots, with Lagos lit and
 * routes running out of it to the four quarters of the continent. The map
 * resolves outward from Lagos on load, then the routes draw and the nodes land.
 *
 * Pure geometry, so this stays a server component: no canvas sampling, no
 * client hook, nothing to hydrate.
 */
function AtlasDots({
  className,
  labels = true,
}: {
  className?: string
  /* Off for the full-bleed composition: no pulsing ring behind the statement. */
  labels?: boolean
}) {
  return (
    <svg
      aria-hidden
      viewBox={`-1 -1 ${COLS + 2} ${ROWS + 2}`}
      className={cn("block w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="softcom-atlas-land"
          x1="0"
          y1={ROWS}
          x2={COLS}
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#004BFF" />
          <stop offset="1" stopColor="#00FFFF" />
        </linearGradient>
      </defs>

      {/*
       * One group per band rather than a delay per dot: 18 style attributes
       * instead of ~1100, same outward sweep.
       */}
      {Array.from({ length: BANDS }, (_, band) => (
        <g
          key={band}
          className="softcom-atlas-band"
          fill="url(#softcom-atlas-land)"
          style={{ animationDelay: `${band * 0.05}s` }}
        >
          {CELLS.filter((c) => c.band === band).map((c) => (
            <rect
              key={`${c.col}-${c.row}`}
              x={c.col - 0.19}
              y={c.row - 0.19}
              width="0.38"
              height="0.38"
            />
          ))}
        </g>
      ))}

      {/* Routes out of Lagos. Drawn after the map has resolved. */}
      <g
        fill="none"
        stroke="#00FFFF"
        strokeWidth="0.13"
        strokeLinecap="round"
        opacity="0.8"
      >
        {DESTINATIONS.map((d, i) => (
          <path
            key={d.id}
            className="softcom-atlas-route"
            d={arc(HOME, d)}
            pathLength="1"
            style={{ animationDelay: `${1.1 + i * 0.14}s` }}
          />
        ))}
      </g>

      {DESTINATIONS.map((d, i) => (
        <rect
          key={d.id}
          className="softcom-atlas-node"
          x={d.col - 0.28}
          y={d.row - 0.28}
          width="0.56"
          height="0.56"
          fill="#00FFFF"
          style={{ animationDelay: `${1.5 + i * 0.14}s` }}
        />
      ))}

      {/* The origin: a lit square with a ring that keeps breathing. */}
      <g className="softcom-atlas-node" style={{ animationDelay: "0.9s" }}>
        <rect
          className={cn("softcom-atlas-pulse", !labels && "hidden")}
          x={HOME.col - 1.1}
          y={HOME.row - 1.1}
          width="2.2"
          height="2.2"
          fill="none"
          stroke="#00FFFF"
          strokeWidth="0.11"
        />
        <rect
          x={HOME.col - 0.45}
          y={HOME.row - 0.45}
          width="0.9"
          height="0.9"
          fill="#00FFFF"
        />
        {/*
         * No label on the map: every position around Lagos is land, so any
         * setting collides with the dots. The masthead already carries
         * "Est. 2007 — Lagos, Nigeria", which is where the fact belongs.
         */}
      </g>
    </svg>
  )
}

export { AtlasDots }
