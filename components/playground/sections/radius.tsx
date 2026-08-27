"use client"

import { SpecimenGroup, TokenLabel } from "@/components/playground/section"
import { useComputedTokens } from "@/components/playground/use-tokens"

/**
 * The whole ramp is a multiple of `--radius`, so the base slider in the tweak
 * panel rescales all of it at once.
 */
const SCALE = [
  { name: "sm", cls: "rounded-sm", mult: "× 0.6" },
  { name: "md", cls: "rounded-md", mult: "× 0.8", note: "name plates" },
  { name: "lg", cls: "rounded-lg", mult: "× 1" },
  { name: "xl", cls: "rounded-xl", mult: "× 1.4" },
  {
    name: "2xl",
    cls: "rounded-2xl",
    mult: "× 1.8",
    note: "images, insight cards",
  },
  { name: "3xl", cls: "rounded-3xl", mult: "× 2.2" },
  {
    name: "4xl",
    cls: "rounded-4xl",
    mult: "× 2.6",
    note: "panels, sector cards",
  },
]

const KNOBS = [
  { token: "--button-radius", label: "Button" },
  { token: "--badge-radius", label: "Badge" },
  { token: "--card-radius", label: "Card" },
  { token: "--input-radius", label: "Input" },
]

export function RadiusSection() {
  const computed = useComputedTokens([
    "--radius",
    ...SCALE.map((s) => `--radius-${s.name}`),
    ...KNOBS.map((k) => k.token),
  ])

  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Scale">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          Base is{" "}
          <TokenLabel>--radius: {computed["--radius"] || "—"}</TokenLabel>. The
          Figma file defines no radius tokens at all, so its literal 24px and
          16px map onto the nearest steps — 4xl and 2xl — accepting ~2px of
          drift rather than bending the scale.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SCALE.map((step) => (
            <div key={step.name} className="flex flex-col items-center gap-1.5">
              <div
                className={`h-16 w-full border-2 border-brand-cyan/60 bg-muted ${step.cls}`}
              />
              <div className="flex flex-col items-center">
                <span className="text-xs font-medium">{step.name}</span>
                <TokenLabel>
                  {computed[`--radius-${step.name}`] || step.mult}
                </TokenLabel>
                {step.note && (
                  <span className="text-center text-[10px] text-muted-foreground">
                    {step.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Tier 3 · component knobs">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          Each of these is a plain CSS var the component consumes as{" "}
          <TokenLabel>rounded-(--…)</TokenLabel>, which is what makes them
          live-editable from the Component tab.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {KNOBS.map((knob) => (
            <div
              key={knob.token}
              className="flex flex-col gap-1 rounded-lg border p-2.5"
            >
              <span className="text-xs font-medium">{knob.label}</span>
              <TokenLabel className="truncate">
                {computed[knob.token] || "—"}
              </TokenLabel>
            </div>
          ))}
        </div>
      </SpecimenGroup>
    </div>
  )
}
