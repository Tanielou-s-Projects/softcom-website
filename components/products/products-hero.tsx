import { cn } from "@/lib/utils"
import { bodyText, displayText } from "@/components/landing/section"
import { productsIntro } from "@/components/products/content"
import { Reveal } from "@/components/motion/reveal"

/**
 * The page's opening claim.
 *
 * Unlike the Solutions hero there is no plate here — the copy sits directly on
 * the page, inset 128px rather than the 24px gutter the rest of the site uses.
 * That inset is the design's, and it is what makes the statement read as
 * hanging in the space rather than filling it.
 */
function ProductsHero() {
  return (
    <section
      className={cn(
        "flex w-full flex-col justify-center gap-6 px-6 pt-10 pb-16",
        "lg:px-32 lg:py-0"
      )}
    >
      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-32">
          <h1 className={cn(displayText, "text-foreground lg:w-[48%]")}>
            {productsIntro.title}
          </h1>
          <p className={cn(bodyText, "text-foreground lg:w-[41%] lg:pt-6")}>
            {productsIntro.lead}
          </p>
        </div>
      </Reveal>
    </section>
  )
}

export { ProductsHero }
