import { Badge } from "@/components/ui/badge"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"
import { sectors } from "@/components/landing/content"

export function BadgesSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Variants">
        <p className="mb-3 max-w-prose text-sm text-muted-foreground">
          Two surface treatments, not two meanings. The default sits on{" "}
          <TokenLabel>bg-popover</TokenLabel>; <TokenLabel>contrast</TokenLabel>{" "}
          exists for the lighter <TokenLabel>bg-secondary</TokenLabel> card,
          where the default would disappear into its container.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-wrap gap-2 rounded-4xl bg-popover p-4">
            <Badge>Government MDAs</Badge>
            <Badge>Regulators</Badge>
          </div>
          <div className="flex flex-wrap gap-2 rounded-4xl bg-secondary p-4">
            <Badge variant="contrast">Financial Services</Badge>
            <Badge variant="contrast">FMCG</Badge>
          </div>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="In use">
        <div className="flex flex-col gap-3">
          {sectors.map((sector, i) => (
            <div key={sector.id} className="flex flex-wrap items-center gap-2">
              <TokenLabel className="w-24 shrink-0">{sector.id}</TokenLabel>
              {sector.tags.map((tag) => (
                <Badge key={tag} variant={i === 1 ? "contrast" : "default"}>
                  {tag}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      </SpecimenGroup>
    </div>
  )
}
