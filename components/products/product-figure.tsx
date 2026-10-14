import type { ProductFigure as Figure } from "@/content/products/pages"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { cn } from "@/lib/utils"

/*
 * A figure slot on a product page. The deck's diagrams and screenshots are
 * not drawn yet, so each one is a placeholder carrying its caption: a mono
 * figure number, the deck's caption title and its line of explanation.
 */
export function ProductFigure({
  figure,
  number,
  className,
  aspect = "aspect-[16/10]",
}: {
  figure: Figure
  /** "02.1" — the section, then the figure within it. */
  number: string
  className?: string
  aspect?: string
}) {
  return (
    <figure className={className}>
      <div className={cn("relative overflow-hidden rounded-lg", aspect)}>
        <ImagePlaceholder label={figure.title} />
      </div>
      <figcaption className="mt-4 grid gap-1 md:grid-cols-[6rem_1fr] md:gap-x-4">
        <span className="label pt-1 text-ink-faint">Fig. {number}</span>
        <span>
          <span className="font-medium">{figure.title}</span>
          {figure.caption && (
            <span className="text-ink-soft"> {figure.caption}</span>
          )}
        </span>
      </figcaption>
    </figure>
  )
}
