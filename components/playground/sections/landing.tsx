import { Badge } from "@/components/ui/badge"
import { bodyText, cardHeadingText } from "@/components/landing/section"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"
import { cn } from "@/lib/utils"

/**
 * The compositions the landing page is actually built from. These are specimens,
 * not the components themselves — each one mirrors its source so a token change
 * can be judged here before scrolling the real page.
 */
export function LandingSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Sector card">
        <p className="mb-3 max-w-prose text-sm text-muted-foreground">
          Three of these sit in a row, each pulled 64px over the last. The
          middle one steps up to <TokenLabel>bg-secondary</TokenLabel> so the
          overlap reads as a stack.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "flex min-w-0 flex-1 flex-col justify-between gap-6 overflow-clip rounded-4xl p-5",
                i === 1 ? "bg-secondary" : "bg-popover",
                i < 2 && "sm:-mr-8"
              )}
            >
              <div
                className="h-10 w-10 rounded-md bg-brand-cyan/20"
                aria-hidden
              />
              <div className="flex flex-col gap-3">
                <p className="font-heading text-xl leading-[1.1] text-foreground">
                  {["Public Sector", "Private Sector", "Development"][i]}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant={i === 1 ? "contrast" : "default"}>Tag</Badge>
                  <Badge variant={i === 1 ? "contrast" : "default"}>Tag</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Capability chip">
        <p className="mb-3 max-w-prose text-sm text-muted-foreground">
          The accent inverts down the rail: blue on cyan, cyan on blue, then
          plain.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { n: "01", cls: "bg-brand-blue text-brand-cyan" },
            { n: "02", cls: "bg-brand-cyan text-brand-blue" },
            { n: "03", cls: "bg-background text-foreground" },
          ].map((chip) => (
            <div
              key={chip.n}
              className={cn(
                "flex flex-col items-start overflow-clip rounded-4xl p-4",
                chip.cls
              )}
            >
              <p className={cn(cardHeadingText, "whitespace-nowrap")}>
                {chip.n}
              </p>
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Stat plate">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["20M+", "People Reached"],
            ["100+", "Projects Delivered"],
            ["30+", "Enterprise Clients"],
          ].map(([value, label]) => (
            <div
              key={value}
              className="flex flex-col justify-end gap-2 border-x border-secondary p-5"
            >
              <p className="font-heading text-4xl leading-[0.804] text-foreground">
                {value}
              </p>
              <p className={cn(bodyText, "text-foreground")}>{label}</p>
            </div>
          ))}
        </div>
        <TokenLabel className="mt-1.5 block">
          Framed by hairlines rather than a filled card — 0.804 leading is from
          the design.
        </TokenLabel>
      </SpecimenGroup>

      <SpecimenGroup label="Insight card">
        <div className="flex flex-col items-start gap-3">
          <div className="aspect-[690/324] w-full rounded-2xl bg-neutral-900 sm:w-2/3" />
          <div className="flex w-full items-start justify-between gap-5 font-heading leading-[1.2] sm:w-2/3">
            <div className="flex shrink-0 flex-col gap-1.5 text-xs whitespace-nowrap">
              <p className="text-neutral-200">Digital Strategy</p>
              <p className="text-neutral-500">April 26, 2026</p>
            </div>
            <p className="text-lg text-neutral-200">
              Why Digital Transformation Fails in African Enterprises
            </p>
          </div>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Team name plate">
        <div className="w-56 rounded-md bg-brand-blue p-3">
          <p className="font-heading text-xl leading-none font-bold text-foreground">
            Abayomi Adedeji
          </p>
          <p className="font-heading text-lg leading-[1.6] text-brand-cyan">
            Founder
          </p>
        </div>
      </SpecimenGroup>
    </div>
  )
}
