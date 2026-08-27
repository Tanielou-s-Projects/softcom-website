/**
 * The Tier 1 steps the tweak panel can assign to a role.
 *
 * Every step carries a literal `bg-*` class on purpose. Tailwind only emits a
 * `--color-*` variable when it can see the name in source, and the panel assigns
 * roles as `var(--color-…)` strings at runtime — invisible to that scan. Listing
 * the classes here is what guarantees the variables exist to be referenced, and
 * it doubles as the swatch styling for the Colour section.
 *
 * Generated to keep token and class in lockstep — edit the ramp list, not a step.
 */

export type RampStep = {
  /** The Tier 1 custom property, e.g. `--color-neutral-500`. */
  token: string
  /** Literal utility class, so Tailwind emits the variable. */
  className: string
  label: string
}

export type Ramp = { name: string; label: string; steps: RampStep[] }

export const RAMPS: Ramp[] = [
  {
    name: "neutral",
    label: "Neutral",
    steps: [
      { token: "--color-neutral-50", className: "bg-neutral-50", label: "50" },
      {
        token: "--color-neutral-100",
        className: "bg-neutral-100",
        label: "100",
      },
      {
        token: "--color-neutral-200",
        className: "bg-neutral-200",
        label: "200",
      },
      {
        token: "--color-neutral-300",
        className: "bg-neutral-300",
        label: "300",
      },
      {
        token: "--color-neutral-400",
        className: "bg-neutral-400",
        label: "400",
      },
      {
        token: "--color-neutral-500",
        className: "bg-neutral-500",
        label: "500",
      },
      {
        token: "--color-neutral-600",
        className: "bg-neutral-600",
        label: "600",
      },
      {
        token: "--color-neutral-700",
        className: "bg-neutral-700",
        label: "700",
      },
      {
        token: "--color-neutral-800",
        className: "bg-neutral-800",
        label: "800",
      },
      {
        token: "--color-neutral-900",
        className: "bg-neutral-900",
        label: "900",
      },
      {
        token: "--color-neutral-950",
        className: "bg-neutral-950",
        label: "950",
      },
    ],
  },
  {
    name: "brand-blue",
    label: "Brand blue",
    steps: [
      {
        token: "--color-brand-blue-50",
        className: "bg-brand-blue-50",
        label: "50",
      },
      {
        token: "--color-brand-blue-100",
        className: "bg-brand-blue-100",
        label: "100",
      },
      {
        token: "--color-brand-blue-200",
        className: "bg-brand-blue-200",
        label: "200",
      },
      {
        token: "--color-brand-blue-300",
        className: "bg-brand-blue-300",
        label: "300",
      },
      {
        token: "--color-brand-blue-400",
        className: "bg-brand-blue-400",
        label: "400",
      },
      {
        token: "--color-brand-blue-500",
        className: "bg-brand-blue-500",
        label: "500",
      },
      {
        token: "--color-brand-blue-600",
        className: "bg-brand-blue-600",
        label: "600",
      },
      {
        token: "--color-brand-blue-700",
        className: "bg-brand-blue-700",
        label: "700",
      },
      {
        token: "--color-brand-blue-800",
        className: "bg-brand-blue-800",
        label: "800",
      },
      {
        token: "--color-brand-blue-900",
        className: "bg-brand-blue-900",
        label: "900",
      },
      {
        token: "--color-brand-blue-950",
        className: "bg-brand-blue-950",
        label: "950",
      },
    ],
  },
  {
    name: "brand-cyan",
    label: "Brand cyan",
    steps: [
      {
        token: "--color-brand-cyan-50",
        className: "bg-brand-cyan-50",
        label: "50",
      },
      {
        token: "--color-brand-cyan-100",
        className: "bg-brand-cyan-100",
        label: "100",
      },
      {
        token: "--color-brand-cyan-200",
        className: "bg-brand-cyan-200",
        label: "200",
      },
      {
        token: "--color-brand-cyan-300",
        className: "bg-brand-cyan-300",
        label: "300",
      },
      {
        token: "--color-brand-cyan-400",
        className: "bg-brand-cyan-400",
        label: "400",
      },
      {
        token: "--color-brand-cyan-500",
        className: "bg-brand-cyan-500",
        label: "500",
      },
      {
        token: "--color-brand-cyan-600",
        className: "bg-brand-cyan-600",
        label: "600",
      },
      {
        token: "--color-brand-cyan-700",
        className: "bg-brand-cyan-700",
        label: "700",
      },
      {
        token: "--color-brand-cyan-800",
        className: "bg-brand-cyan-800",
        label: "800",
      },
      {
        token: "--color-brand-cyan-900",
        className: "bg-brand-cyan-900",
        label: "900",
      },
      {
        token: "--color-brand-cyan-950",
        className: "bg-brand-cyan-950",
        label: "950",
      },
    ],
  },
  {
    name: "red",
    label: "Red · destructive",
    steps: [
      { token: "--color-red-50", className: "bg-red-50", label: "50" },
      { token: "--color-red-100", className: "bg-red-100", label: "100" },
      { token: "--color-red-200", className: "bg-red-200", label: "200" },
      { token: "--color-red-300", className: "bg-red-300", label: "300" },
      { token: "--color-red-400", className: "bg-red-400", label: "400" },
      { token: "--color-red-500", className: "bg-red-500", label: "500" },
      { token: "--color-red-600", className: "bg-red-600", label: "600" },
      { token: "--color-red-700", className: "bg-red-700", label: "700" },
      { token: "--color-red-800", className: "bg-red-800", label: "800" },
      { token: "--color-red-900", className: "bg-red-900", label: "900" },
      { token: "--color-red-950", className: "bg-red-950", label: "950" },
    ],
  },
  {
    name: "amber",
    label: "Amber · warning",
    steps: [
      { token: "--color-amber-50", className: "bg-amber-50", label: "50" },
      { token: "--color-amber-100", className: "bg-amber-100", label: "100" },
      { token: "--color-amber-200", className: "bg-amber-200", label: "200" },
      { token: "--color-amber-300", className: "bg-amber-300", label: "300" },
      { token: "--color-amber-400", className: "bg-amber-400", label: "400" },
      { token: "--color-amber-500", className: "bg-amber-500", label: "500" },
      { token: "--color-amber-600", className: "bg-amber-600", label: "600" },
      { token: "--color-amber-700", className: "bg-amber-700", label: "700" },
      { token: "--color-amber-800", className: "bg-amber-800", label: "800" },
      { token: "--color-amber-900", className: "bg-amber-900", label: "900" },
      { token: "--color-amber-950", className: "bg-amber-950", label: "950" },
    ],
  },
  {
    name: "emerald",
    label: "Emerald · success",
    steps: [
      { token: "--color-emerald-50", className: "bg-emerald-50", label: "50" },
      {
        token: "--color-emerald-100",
        className: "bg-emerald-100",
        label: "100",
      },
      {
        token: "--color-emerald-200",
        className: "bg-emerald-200",
        label: "200",
      },
      {
        token: "--color-emerald-300",
        className: "bg-emerald-300",
        label: "300",
      },
      {
        token: "--color-emerald-400",
        className: "bg-emerald-400",
        label: "400",
      },
      {
        token: "--color-emerald-500",
        className: "bg-emerald-500",
        label: "500",
      },
      {
        token: "--color-emerald-600",
        className: "bg-emerald-600",
        label: "600",
      },
      {
        token: "--color-emerald-700",
        className: "bg-emerald-700",
        label: "700",
      },
      {
        token: "--color-emerald-800",
        className: "bg-emerald-800",
        label: "800",
      },
      {
        token: "--color-emerald-900",
        className: "bg-emerald-900",
        label: "900",
      },
      {
        token: "--color-emerald-950",
        className: "bg-emerald-950",
        label: "950",
      },
    ],
  },
]

/** Pure white and black, which the light theme's surfaces need. */
export const ABSOLUTES: RampStep[] = [
  { token: "--color-white", className: "bg-white", label: "white" },
  { token: "--color-black", className: "bg-black", label: "black" },
]
