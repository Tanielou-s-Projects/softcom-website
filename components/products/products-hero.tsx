import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { bodyText, displayText } from "@/components/landing/section"

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
        "flex w-full flex-col justify-center gap-6 px-6 pt-36 pb-16",
        "lg:h-[1024px] lg:px-32 lg:py-0"
      )}
    >
      <Badge variant="brand" className="self-start">
        Products &amp; Services
      </Badge>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-32">
        <h1 className={cn(displayText, "text-foreground lg:w-[565px]")}>
          Proven platforms. Focused services.
        </h1>
        <p className={cn(bodyText, "text-foreground lg:w-[491px] lg:pt-6")}>
          Proprietary platforms and focused service lines, crafted to the
          highest standard through nearly two decades of experience in
          Africa&apos;s most complex and demanding environments.
        </p>
      </div>
    </section>
  )
}

export { ProductsHero }
