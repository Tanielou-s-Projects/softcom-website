import { SpecimenGroup, TokenLabel } from "@/components/playground/section"

/** Tailwind's 4px base. These are the steps the landing page actually leans on. */
const STEPS = [
  { name: "1", px: 4 },
  { name: "2", px: 8, note: "badge gaps" },
  { name: "3", px: 12, note: "grid gutters" },
  { name: "4", px: 16 },
  { name: "6", px: 24, note: "page gutter" },
  { name: "8", px: 32, note: "card padding" },
  { name: "10", px: 40 },
  { name: "16", px: 64, note: "section header gap" },
  { name: "32", px: 128, note: "section rhythm" },
]

export function SpacingSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Scale">
        <div className="flex flex-col gap-2">
          {STEPS.map((step) => (
            <div key={step.name} className="flex items-center gap-3">
              <TokenLabel className="w-8 shrink-0 text-right">
                {step.name}
              </TokenLabel>
              <div
                className="h-4 rounded-sm bg-brand-blue"
                style={{ width: step.px }}
              />
              <TokenLabel className="w-10 shrink-0">{step.px}px</TokenLabel>
              {step.note && (
                <span className="text-[11px] text-muted-foreground">
                  {step.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Layout rhythm">
        <p className="max-w-prose text-sm text-muted-foreground">
          Sections are full-bleed on a flat <TokenLabel>px-6</TokenLabel> (24px)
          gutter with no content cap — the Figma frame&apos;s 1392px inner width
          is just what 1440 minus the gutter resolves to. Vertical rhythm
          between sections is <TokenLabel>gap-32</TokenLabel> (128px), halving
          to <TokenLabel>gap-16</TokenLabel> below <TokenLabel>lg</TokenLabel>.
        </p>
      </SpecimenGroup>
    </div>
  )
}
