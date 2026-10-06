"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"
import { sectors } from "@/components/landing/content"
import { DotMatrix } from "@/components/landing/dot-matrix"
import {
  createDitherField,
  type DitherField,
} from "@/components/motion/dither-field"
import { DitherPanel } from "@/components/motion/dither-panel"
import { PixelArrowDown } from "@/components/ui/pixel-arrow-down"
import { NavPlate } from "@/components/site/nav-plate"

/** The hero / page-transition renderer, driven by the slider instead of scroll. */
function FieldSpecimen({
  progress,
  scale,
}: {
  progress: number
  scale: number
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const fieldRef = React.useRef<DitherField | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const field = createDitherField(canvas, { scale })
    fieldRef.current = field
    const observer = new ResizeObserver(() => field?.resize())
    observer.observe(canvas)
    return () => {
      observer.disconnect()
      field?.dispose()
      fieldRef.current = null
    }
  }, [scale])

  React.useEffect(() => {
    fieldRef.current?.draw(progress)
  }, [progress, scale])

  // Keyed by scale: a disposed context can't be revived on the same canvas.
  return <canvas key={scale} ref={canvasRef} className="block size-full" />
}

/**
 * Every dot effect on the site, side by side, on the one set of rules in
 * lib/dither.ts — so the system can be judged as a whole. The scrubbed
 * specimens share one progress value; at any point they light the same cells.
 */
export function DitherSystemSection() {
  const [progress, setProgress] = React.useState(0.5)
  const [resolved, setResolved] = React.useState(false)
  const [replay, setReplay] = React.useState(0)
  const [panelKey, setPanelKey] = React.useState(0)

  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="The rules">
        <ul className="max-w-prose list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            One dot: square cells on a 6px grid; coarser effects use a multiple.
          </li>
          <li>One order: 8×8 Bayer against a field rising from the bottom.</li>
          <li>One edge: cells at the front show brand cyan, then settle.</li>
          <li>One input: progress 0 → 1. Only the driver differs.</li>
        </ul>
      </SpecimenGroup>

      <SpecimenGroup label="Scrubbed — one progress, two scales">
        <div className="mb-4 flex max-w-md items-center gap-4">
          <Slider
            value={[progress]}
            min={0}
            max={1}
            step={0.005}
            onValueChange={([value]) => setProgress(value)}
            aria-label="Dither progress"
          />
          <span className="w-12 font-mono text-xs text-muted-foreground">
            {progress.toFixed(2)}
          </span>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="h-[260px] overflow-clip rounded-(--card-radius) bg-neutral-950">
              <FieldSpecimen progress={progress} scale={1} />
            </div>
            <TokenLabel>
              Hero dissolve · WebGL · 6px · driven by scroll
            </TokenLabel>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-[260px] overflow-clip rounded-(--card-radius) bg-neutral-950">
              <FieldSpecimen progress={progress} scale={4} />
            </div>
            <TokenLabel>
              Page transition · WebGL · 24px · driven by a clock
            </TokenLabel>
          </div>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Triggered — the same move in miniature">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="flex h-[260px] items-center justify-center rounded-(--card-radius) bg-popover">
              <div className="w-[152px] text-brand-blue">
                <DotMatrix src={sectors[1].silhouette} resolved={resolved} />
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setResolved((r) => !r)}
            >
              {resolved ? "Release" : "Resolve"} sector mark
            </Button>
            <TokenLabel>Sector mark · SVG · hover</TokenLabel>
          </div>
          <div className="flex flex-col gap-2">
            <div className="relative h-[260px] overflow-clip rounded-(--card-radius) bg-popover">
              <DitherPanel
                key={panelKey}
                seed={1}
                level={0.6}
                className="absolute inset-0"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPanelKey((k) => k + 1)}
            >
              Replay panel
            </Button>
            <TokenLabel>Product panel · canvas 2D · in view</TokenLabel>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex h-[260px] items-center justify-center rounded-(--card-radius) bg-neutral-950 text-brand-cyan">
              <PixelArrowDown
                key={replay}
                cascade
                className="softcom-pixel-cascade size-24"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setReplay((r) => r + 1)}
            >
              Replay arrow
            </Button>
            <TokenLabel>Scroll arrow · SVG · on load</TokenLabel>
          </div>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Pointer-driven — the nav plate">
        <div
          data-nav-plate-root
          className="dark flex h-52 max-w-xl items-stretch overflow-clip rounded-(--card-radius) bg-black"
        >
          <NavPlate seed={3} className="w-44 shrink-0" />
          <ul className="ml-auto flex flex-col justify-center gap-1 pr-8 text-right text-sm font-medium text-foreground/70">
            {["About", "Leadership", "Alumni", "Careers"].map((item) => (
              <li
                key={item}
                className="rounded-lg px-3 py-2 hover:text-brand-accent"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <TokenLabel>
          Hover the items · canvas 2D · the margin rails use the same panel,
          driven by page scroll
        </TokenLabel>
      </SpecimenGroup>
    </div>
  )
}
