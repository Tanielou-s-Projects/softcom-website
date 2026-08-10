import { ArrowRight, Plus } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { ghostPill, primaryPill } from "@/components/landing/section"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

const SIZES = ["xs", "sm", "default", "lg"] as const

export function ButtonsSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Variants">
        <div className="flex flex-wrap items-center gap-2">
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Sizes">
        <div className="flex flex-wrap items-center gap-2">
          {SIZES.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Icon only">
        <div className="flex flex-wrap items-center gap-2">
          {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((size) => (
            <Button key={size} size={size} variant="outline" aria-label={size}>
              <Plus />
            </Button>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="With icon">
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            Start a Conversation
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            Add
          </Button>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Brand pills">
        <p className="mb-3 max-w-prose text-sm text-muted-foreground">
          Every CTA on the site. These sit on{" "}
          <TokenLabel>--foreground</TokenLabel> /{" "}
          <TokenLabel>--background</TokenLabel> rather than{" "}
          <TokenLabel>--primary</TokenLabel>, which in this theme is a dimmer
          grey — paired with <TokenLabel>size=&quot;lg&quot;</TokenLabel>, whose
          h-10 px-4 already equals Figma&apos;s padding at 14/24 type.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="lg" className={primaryPill}>
            Get In Touch
          </Button>
          <Button size="lg" variant="ghost" className={ghostPill}>
            Our Solutions
          </Button>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="States">
        <div className="flex flex-wrap items-center gap-2">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
          <Button aria-invalid>Invalid</Button>
        </div>
      </SpecimenGroup>
    </div>
  )
}
