import {
  bodyText,
  cardHeadingText,
  displayText,
  headingText,
  leadText,
} from "@/components/landing/section"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"
import { cn } from "@/lib/utils"

/**
 * Two families, not three. Space Grotesk carries every heading; Montserrat
 * carries everything else — prose and UI alike.
 *
 * The Figma file specifies Inter on button labels, but that is the shadcn
 * library's own default showing through rather than a deliberate third face, so
 * it is not reproduced. Montserrat is `--font-sans`, inherited from `<html>`,
 * which is why body copy needs no font class at all.
 */
const FAMILIES = [
  {
    token: "--font-heading",
    utility: "font-heading",
    name: "Space Grotesk",
    role: "Headings and display",
    className: "font-heading",
  },
  {
    token: "--font-sans",
    utility: "font-sans",
    name: "Montserrat",
    role: "Body copy and UI — inherited, so rarely written",
    className: "font-sans",
  },
]

/** The landing page's scale, exported from `components/landing/section.tsx`. */
const SCALE = [
  {
    name: "display",
    figma: "64px",
    className: displayText,
    sample: "Technology for Organisations.",
  },
  {
    name: "heading",
    figma: "52px",
    className: headingText,
    sample: "The institutions that move Africa forward.",
  },
  {
    name: "cardHeading",
    figma: "52px · 1.1",
    className: cardHeadingText,
    sample: "Digital Infrastructure",
  },
  {
    name: "lead",
    figma: "20px",
    className: leadText,
    sample: "We exist to create lasting impact.",
  },
  {
    name: "body",
    figma: "18px",
    className: bodyText,
    sample:
      "Founded in Lagos in 2007, Softcom builds the systems organisations depend on.",
  },
]

export function TypographySection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Families">
        <div className="flex flex-col gap-3">
          {FAMILIES.map((family) => (
            <div
              key={family.token}
              className="flex flex-col gap-1 rounded-lg border p-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xs font-medium">{family.name}</span>
                <TokenLabel>
                  {family.token} · .{family.utility}
                </TokenLabel>
              </div>
              <p className={cn(family.className, "text-xl")}>
                Progress for Society — 0123456789
              </p>
              <span className="text-[11px] text-muted-foreground">
                {family.role}
              </span>
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Scale">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          Exported as constants rather than repeated per section, so a size can
          only change in one place. Each is responsive — the Figma value is the
          desktop end of the ramp.
        </p>
        <div className="flex flex-col gap-5">
          {SCALE.map((step) => (
            <div key={step.name} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <TokenLabel>{step.name}</TokenLabel>
                <TokenLabel>Figma {step.figma}</TokenLabel>
              </div>
              <p className={cn(step.className, "text-foreground")}>
                {step.sample}
              </p>
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Weights">
        <div className="flex flex-wrap gap-4">
          {[
            ["font-normal", "Regular 400"],
            ["font-medium", "Medium 500"],
            ["font-semibold", "Semibold 600"],
            ["font-bold", "Bold 700"],
          ].map(([cls, label]) => (
            <div key={cls} className="flex flex-col gap-0.5">
              <span className={cn("font-heading text-lg", cls)}>Softcom</span>
              <TokenLabel>{label}</TokenLabel>
            </div>
          ))}
        </div>
      </SpecimenGroup>
    </div>
  )
}
