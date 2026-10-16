import * as React from "react"

import { cn } from "@/lib/utils"
import { Dots, Line, Solid } from "@/components/iso/react/draw"
import "@/components/iso/iso.css"
import "@/components/iso/line.css"
import { LIT_STEPS } from "@/components/iso/line-dither"
import type { Callout, Scene } from "@/components/iso/line-kit"

const CORNER = {
  tl: "top-[3%] left-[2%]",
  tr: "top-[3%] right-[2%]",
  bl: "bottom-[3%] left-[2%]",
  br: "bottom-[3%] right-[2%]",
} as const

/** A callout as the design system's card: dot and title, then rows. */
function CalloutCard({ callout }: { callout: Callout }) {
  return (
    <div
      aria-hidden
      data-callout={callout.zone}
      className={cn(
        "pointer-events-none absolute hidden w-[232px] overflow-clip rounded-2xl bg-surface text-ink shadow-sm ring-1 ring-ink/10 sm:block",
        callout.zone && "line-callout",
        callout.at
          ? "-translate-x-1/2 -translate-y-full"
          : CORNER[callout.corner ?? "tl"]
      )}
      style={callout.at}
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <span className="size-1.5 rounded-full bg-accent-ink" />
        <span className="font-heading text-sm font-medium">
          {callout.title}
        </span>
      </div>
      <dl className="flex flex-col gap-2 border-t border-line px-4 py-3 text-xs">
        {callout.rows.map(([field, value]) => (
          <div key={field} className="flex items-center justify-between gap-3">
            <dt className="text-ink-soft">{field}</dt>
            <dd className="font-medium whitespace-nowrap tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/**
 * Renders a line scene (line-kit.ts): dithered shadow, deck, lots with their
 * dither weave, ground lines, links, things back to front, then the HTML
 * tags and callouts over the drawing. Server-only; a parent may set
 * `data-focus` to light a zone.
 */
export function LineScene({
  scene,
  className,
}: {
  scene: Scene
  className?: string
}) {
  return (
    <div className={cn("iso softcom-line", className)}>
      <div className="relative">
        <svg
          className="iso-svg"
          viewBox={`0 0 ${scene.width} ${scene.height}`}
          role="img"
          aria-label={scene.label}
          focusable="false"
        >
          <g key="base">
            {scene.base.shadow.map((d, index) => (
              <path
                key={index}
                className="line-shadow"
                d={d}
                fill={`url(#ld-shadow-${index})`}
              />
            ))}
            {scene.base.slabs.map((paths, index) => (
              <Solid key={index} paths={paths} tone="hi" crease="lo" />
            ))}
            <Line d={scene.base.lip} tone="faint" />
            <Dots points={scene.base.screws} size={0.7} tone="lo" />
          </g>
          <g key="ground">
            {scene.lots.map((lot, index) => (
              <g key={index}>
                {lot.zone || lot.on
                  ? LIT_STEPS.map((_, step) => (
                      <path
                        key={step}
                        className="line-lot-dither"
                        data-zone={lot.zone}
                        data-on={lot.on ? "" : undefined}
                        data-step={step}
                        d={lot.d}
                        fill={`url(#ld-lit-${step})`}
                      />
                    ))
                  : null}
                <path
                  className="iso-line line-lot"
                  data-tone="lo"
                  data-zone={lot.zone}
                  data-on={lot.on ? "" : undefined}
                  d={lot.d}
                />
              </g>
            ))}
            {scene.ground.map((line, index) => (
              <Line
                key={index}
                d={line.d}
                tone={line.tone}
                dashed={line.dashed}
              />
            ))}
            {scene.links.map((link, index) => (
              <path
                key={index}
                className="iso-line line-link"
                data-tone="mid"
                data-zone={link.zone}
                data-on={link.on ? "" : undefined}
                d={link.d}
              />
            ))}
            <Dots points={scene.nodes} size={1.1} tone="hi" />
          </g>
          {scene.things.map((thing, index) => (
            <g
              key={index}
              className="line-thing"
              data-zone={thing.zone}
              data-on={thing.on ? "" : undefined}
            >
              {thing.parts.map(({ paths, lit }, part) => (
                <Solid
                  key={part}
                  paths={paths}
                  tone="hi"
                  crease="lo"
                  lit={lit}
                />
              ))}
              {thing.lines ? <Line d={thing.lines} tone="lo" /> : null}
            </g>
          ))}
        </svg>

        {scene.tags.map((tag, index) => (
          <span
            key={index}
            aria-hidden
            data-zone={tag.zone}
            data-on={tag.on ? "" : undefined}
            className="line-tag pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 sm:block"
            style={tag.at}
          >
            {tag.label}
          </span>
        ))}
        {scene.callouts.map((callout, index) => (
          <CalloutCard key={index} callout={callout} />
        ))}
      </div>
    </div>
  )
}

/**
 * A line figure on its tinted panel, with the plate's corner labels: the
 * figure number top left, its title top right.
 */
export function LineFigurePanel({
  fig,
  title,
  children,
  className,
}: {
  fig?: string
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure
      className={cn(
        "line-panel relative m-0 rounded-3xl px-4 pt-12 pb-6 lg:px-10 lg:pt-14 lg:pb-10",
        className
      )}
    >
      {fig || title ? (
        <figcaption className="pointer-events-none absolute inset-x-5 top-5 flex justify-between gap-4 font-mono text-[11px] tracking-[0.1em] text-ink-soft uppercase lg:inset-x-6 lg:top-6">
          <span>{fig}</span>
          <span className="truncate text-right">{title}</span>
        </figcaption>
      ) : null}
      <div className="mx-auto max-w-[920px]">{children}</div>
    </figure>
  )
}
