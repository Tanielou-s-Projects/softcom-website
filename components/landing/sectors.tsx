/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
import { Badge } from "@/components/ui/badge"
import {
  bodyText,
  cardHeadingText,
  Container,
  headingText,
} from "@/components/landing/section"
import { sectors, type Sector } from "@/components/landing/content"
import { cn } from "@/lib/utils"

/**
 * Each sector's dot-matrix mark is several exported SVG layers stacked at the
 * insets Figma gave them, so the cyan highlight lands on the right dots.
 */
function SectorIllustration({ illustration }: Pick<Sector, "illustration">) {
  const { width, height, layers } = illustration

  return (
    <div
      aria-hidden
      className="relative shrink-0 overflow-clip"
      style={{ width, height }}
    >
      {/*
       * Each layer needs its own positioned wrapper: putting the inset and
       * `size-full` on one element would let width/height win over the right and
       * bottom offsets, dragging the highlight layer out of place.
       */}
      {layers.map((layer) => (
        <div
          key={layer.src}
          className="absolute"
          style={{ inset: layer.inset }}
        >
          <img
            src={layer.src}
            alt=""
            className="absolute inset-0 block size-full max-w-none"
          />
        </div>
      ))}
    </div>
  )
}

function SectorCard({ sector, index }: { sector: Sector; index: number }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col justify-between gap-12 overflow-clip rounded-4xl p-8",
        "lg:h-[772px] lg:gap-0",
        /* The middle card is a step lighter and overlaps its neighbours. */
        index === 1 ? "bg-secondary" : "bg-popover",
        /*
         * Figma pulls each card 64px over the previous one. The overlapped
         * strip is covered by the next card, so these need matching right
         * padding (32px base + 64px overlap) or their last badge is clipped.
         */
        index < sectors.length - 1 && "lg:-mr-16 lg:pr-24"
      )}
    >
      <SectorIllustration illustration={sector.illustration} />

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 text-foreground">
          <h3 className={cn(cardHeadingText, "whitespace-pre-line")}>
            {sector.title}
          </h3>
          <p className={cn(bodyText, "max-w-[340px]")}>{sector.description}</p>
        </div>

        <div className="flex flex-wrap items-start gap-2">
          {sector.tags.map((tag) => (
            <Badge key={tag} variant={index === 1 ? "contrast" : "default"}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

function Sectors() {
  return (
    <Container className="flex flex-col gap-10 overflow-clip py-6 lg:gap-16">
      <header className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-16">
        <h2 className={cn(headingText, "text-foreground lg:w-[814px]")}>
          The institutions that move Africa forward.
        </h2>
        <p className={cn(bodyText, "min-w-0 flex-1 text-foreground")}>
          We partner with the organization responsible for the systems,
          services, and infrastructure that millions depend on
        </p>
      </header>

      <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:gap-0">
        {sectors.map((sector, index) => (
          <SectorCard key={sector.id} sector={sector} index={index} />
        ))}
      </div>
    </Container>
  )
}

export { Sectors }
