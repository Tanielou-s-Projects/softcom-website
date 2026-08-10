"use client"

import { SpecimenGroup, TokenLabel } from "@/components/playground/section"
import { ABSOLUTES, RAMPS } from "@/components/playground/palette"
import { useComputedTokens } from "@/components/playground/use-tokens"
import { cn } from "@/lib/utils"

/** Tier 2 roles, grouped the way they're reached for. */
const ROLE_GROUPS: { label: string; roles: [string, string?][] }[] = [
  {
    label: "Surfaces",
    roles: [
      ["background", "foreground"],
      ["card", "card-foreground"],
      ["popover", "popover-foreground"],
    ],
  },
  {
    label: "Actions",
    roles: [
      ["primary", "primary-foreground"],
      ["secondary", "secondary-foreground"],
      ["accent", "accent-foreground"],
      ["muted", "muted-foreground"],
    ],
  },
  {
    label: "Status",
    roles: [["destructive"], ["success"], ["warning"]],
  },
  {
    label: "Brand",
    roles: [["brand-accent"]],
  },
  {
    label: "Lines & focus",
    roles: [["border"], ["input"], ["ring"]],
  },
  {
    label: "Charts",
    roles: [["chart-1"], ["chart-2"], ["chart-3"], ["chart-4"], ["chart-5"]],
  },
]

const ALL_ROLES = ROLE_GROUPS.flatMap((g) =>
  g.roles.flatMap(([a, b]) => (b ? [a, b] : [a]))
)

export function ColorsSection() {
  const computed = useComputedTokens(ALL_ROLES.map((r) => `--${r}`))

  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Tier 1 · primitives">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          Raw ramps. Tailwind ships neutral, red, amber and emerald; the two
          brand ramps are ours, derived in OKLCH from the Figma anchors with the
          anchor keeping its exact hex.
        </p>
        <div className="flex flex-col gap-4">
          {RAMPS.map((ramp) => (
            <div key={ramp.name}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-xs font-medium">{ramp.label}</span>
                <TokenLabel>--color-{ramp.name}-*</TokenLabel>
              </div>
              <div className="flex gap-1">
                {ramp.steps.map((step) => (
                  <div key={step.token} className="flex flex-1 flex-col gap-1">
                    <div
                      title={step.token}
                      className={cn(
                        "h-10 rounded-md border",
                        step.className,
                        /* The anchors are the values design actually specified. */
                        (step.token === "--color-brand-blue-700" ||
                          step.token === "--color-brand-cyan-200") &&
                          "ring-2 ring-foreground/40"
                      )}
                    />
                    <span className="text-center font-mono text-[9px] text-muted-foreground">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div className="mb-1.5 text-xs font-medium">Absolutes</div>
            <div className="flex gap-1">
              {ABSOLUTES.map((step) => (
                <div key={step.token} className="flex w-16 flex-col gap-1">
                  <div
                    title={step.token}
                    className={cn("h-10 rounded-md border", step.className)}
                  />
                  <span className="text-center font-mono text-[9px] text-muted-foreground">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Tier 2 · semantic roles">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          What components actually reference. Every one points at a Tier 1 step
          — swatches below show the value resolved for the current theme,
          including anything the tweak panel is overriding.
        </p>
        <div className="flex flex-col gap-5">
          {ROLE_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="mb-2 text-[11px] font-medium text-muted-foreground">
                {group.label}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {group.roles.map(([role, onRole]) => (
                  <div
                    key={role}
                    className="flex items-center gap-2.5 rounded-lg border p-2"
                  >
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold"
                      style={{
                        background: `var(--${role})`,
                        color: onRole ? `var(--${onRole})` : undefined,
                      }}
                    >
                      {onRole ? "Aa" : ""}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-xs font-medium">
                        {role}
                      </span>
                      <TokenLabel className="truncate">
                        {computed[`--${role}`] || "—"}
                      </TokenLabel>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SpecimenGroup>
    </div>
  )
}
