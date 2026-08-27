"use client"

import * as React from "react"
import { Dithering } from "@paper-design/shaders-react"

/**
 * Dev-only workshop for tuning the Paper Shaders `Dithering` effect that the nav
 * dropdown plates use. Everything is live: tweak the controls, watch both the
 * big preview and a real nav-plate-sized preview, then copy the JSX snippet.
 *
 * Shader params mirror `DitheringParams` from `@paper-design/shaders`.
 */
const SHAPES = [
  "simplex",
  "warp",
  "dots",
  "wave",
  "ripple",
  "swirl",
  "sphere",
] as const
const TYPES = ["random", "2x2", "4x4", "8x8"] as const

type Shape = (typeof SHAPES)[number]
type DType = (typeof TYPES)[number]

type Config = {
  colorBack: string
  colorFront: string
  shape: Shape
  type: DType
  size: number
  scale: number
  speed: number
  rotation: number
}

const PRESETS: { name: string; config: Config }[] = [
  {
    name: "About (blue)",
    config: {
      colorBack: "#020617",
      colorFront: "#0b3bff",
      shape: "warp",
      type: "4x4",
      size: 2,
      scale: 1,
      speed: 0.6,
      rotation: 0,
    },
  },
  {
    name: "Solutions (blue)",
    config: {
      colorBack: "#020617",
      colorFront: "#0b3bff",
      shape: "swirl",
      type: "4x4",
      size: 2,
      scale: 1.2,
      speed: 0.5,
      rotation: 0,
    },
  },
  {
    name: "Bugs",
    config: {
      colorBack: "#000000",
      colorFront: "#00e5ff",
      shape: "simplex",
      type: "random",
      size: 1.5,
      scale: 0.8,
      speed: 1,
      rotation: 0,
    },
  },
  {
    name: "Ripple",
    config: {
      colorBack: "#000814",
      colorFront: "#12b8ff",
      shape: "ripple",
      type: "8x8",
      size: 3,
      scale: 1,
      speed: 0.8,
      rotation: 0,
    },
  },
  {
    name: "Sphere",
    config: {
      colorBack: "#000000",
      colorFront: "#0b3bff",
      shape: "sphere",
      type: "2x2",
      size: 2.5,
      scale: 1,
      speed: 0.4,
      rotation: 0,
    },
  },
]

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span className="font-medium text-neutral-400">{label}</span>
      {children}
    </label>
  )
}

function Range({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 accent-brand-cyan"
      />
      <span className="w-10 shrink-0 text-right font-mono text-[11px] text-neutral-300">
        {value}
      </span>
    </div>
  )
}

const selectCls =
  "rounded-md border border-white/10 bg-neutral-900 px-2 py-1.5 text-xs text-neutral-100 outline-none focus:border-brand-cyan"

function DitherLab() {
  const [c, setC] = React.useState<Config>(PRESETS[0].config)
  const set = <K extends keyof Config>(key: K, v: Config[K]) =>
    setC((prev) => ({ ...prev, [key]: v }))

  const snippet = `<Dithering
  style={{ width: "100%", height: "100%" }}
  colorBack="${c.colorBack}"
  colorFront="${c.colorFront}"
  shape="${c.shape}"
  type="${c.type}"
  size={${c.size}}
  scale={${c.scale}}
  speed={${c.speed}}
  rotation={${c.rotation}}
/>`

  const shader = (
    <Dithering
      style={{ width: "100%", height: "100%" }}
      colorBack={c.colorBack}
      colorFront={c.colorFront}
      shape={c.shape}
      type={c.type}
      size={c.size}
      scale={c.scale}
      speed={c.speed}
      rotation={c.rotation}
      fit="cover"
    />
  )

  return (
    <div className="min-h-svh bg-neutral-950 p-6 text-neutral-100 lg:p-10">
      <header className="mb-8 flex flex-col gap-1">
        <h1 className="font-heading text-2xl">Dither Workshop</h1>
        <p className="text-sm text-neutral-400">
          Tune the Paper Shaders <code>Dithering</code> effect. Presets seed the
          two nav categories; copy the snippet into{" "}
          <code>dither-shape.tsx</code> when you like it.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          {/* Big preview */}
          <div className="relative h-[420px] w-full overflow-hidden rounded-3xl ring-1 ring-white/10">
            {shader}
          </div>

          {/* Real nav-plate preview + the black dropdown context */}
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-500">
                Nav plate (176×208)
              </span>
              <div className="flex h-52 w-44 items-stretch overflow-hidden rounded-l-3xl bg-black ring-1 ring-white/10">
                <div className="relative h-full w-full">{shader}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-neutral-500">In the dropdown</span>
              <div className="flex h-52 w-[420px] items-stretch overflow-hidden rounded-3xl bg-black ring-1 ring-white/10">
                <div className="relative h-full w-44 shrink-0">{shader}</div>
                <ul className="ml-auto flex flex-col justify-center gap-1 pr-8 text-right text-sm font-medium text-neutral-400">
                  <li>About</li>
                  <li>Leadership</li>
                  <li>Alumni</li>
                  <li>Careers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <aside className="flex flex-col gap-5 rounded-2xl bg-neutral-900/50 p-5 ring-1 ring-white/10">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-neutral-400">
              Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setC(p.config)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-200 transition-colors hover:border-brand-cyan hover:text-brand-cyan"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Background">
              <input
                type="color"
                value={c.colorBack}
                onChange={(e) => set("colorBack", e.target.value)}
                className="h-8 w-full rounded-md border border-white/10 bg-transparent"
              />
            </Field>
            <Field label="Ink">
              <input
                type="color"
                value={c.colorFront}
                onChange={(e) => set("colorFront", e.target.value)}
                className="h-8 w-full rounded-md border border-white/10 bg-transparent"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Shape">
              <select
                value={c.shape}
                onChange={(e) => set("shape", e.target.value as Shape)}
                className={selectCls}
              >
                {SHAPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Dither (Bayer)">
              <select
                value={c.type}
                onChange={(e) => set("type", e.target.value as DType)}
                className={selectCls}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Pixel size">
            <Range
              value={c.size}
              min={0.5}
              max={20}
              step={0.5}
              onChange={(v) => set("size", v)}
            />
          </Field>
          <Field label="Scale">
            <Range
              value={c.scale}
              min={0.1}
              max={4}
              step={0.1}
              onChange={(v) => set("scale", v)}
            />
          </Field>
          <Field label="Speed">
            <Range
              value={c.speed}
              min={0}
              max={3}
              step={0.1}
              onChange={(v) => set("speed", v)}
            />
          </Field>
          <Field label="Rotation">
            <Range
              value={c.rotation}
              min={0}
              max={360}
              step={1}
              onChange={(v) => set("rotation", v)}
            />
          </Field>

          <pre className="overflow-x-auto rounded-lg bg-black p-3 font-mono text-[11px] leading-relaxed text-neutral-300 ring-1 ring-white/10">
            {snippet}
          </pre>
        </aside>
      </div>
    </div>
  )
}

export { DitherLab }
