import { SpecimenGroup, TokenLabel } from "@/components/playground/section"

const SHADOWS = [
  { cls: "shadow-xs", label: "xs" },
  { cls: "shadow-sm", label: "sm" },
  { cls: "shadow-md", label: "md" },
  { cls: "shadow-lg", label: "lg" },
  { cls: "shadow-xl", label: "xl" },
  { cls: "shadow-2xl", label: "2xl", note: "dropdowns" },
]

const RINGS = [
  { cls: "ring-1 ring-border", label: "ring-border", note: "card edge" },
  {
    cls: "ring-1 ring-foreground/5",
    label: "ring-foreground/5",
    note: "menu panels",
  },
  {
    cls: "ring-[3px] ring-ring/50",
    label: "ring-ring/50",
    note: "focus-visible",
  },
]

export function ShadowsSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Elevation">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          The dark theme leans on rings far more than shadows — a drop shadow
          has little to say against a near-black surface, so separation comes
          from a hairline instead.
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SHADOWS.map((s) => (
            <div key={s.cls} className="flex flex-col items-center gap-1.5">
              <div className={`h-14 w-full rounded-xl bg-card ${s.cls}`} />
              <TokenLabel>{s.label}</TokenLabel>
              {s.note && (
                <span className="text-[10px] text-muted-foreground">
                  {s.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Rings">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RINGS.map((r) => (
            <div key={r.label} className="flex flex-col items-center gap-1.5">
              <div className={`h-14 w-full rounded-xl bg-card ${r.cls}`} />
              <TokenLabel>{r.label}</TokenLabel>
              <span className="text-[10px] text-muted-foreground">
                {r.note}
              </span>
            </div>
          ))}
        </div>
      </SpecimenGroup>
    </div>
  )
}
