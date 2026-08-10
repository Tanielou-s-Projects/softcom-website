import { cn } from "@/lib/utils"
import { Container, displayText } from "@/components/landing/section"

/**
 * The pair of discs the statement sits under.
 *
 * Rebuilt from node 305:569 verbatim, including its greys. Worth knowing they
 * are Figma's default `#D9D9D9` fill rather than anything from the palette, and
 * that the connector is a flat 2px line where the landing hero's is a 346px
 * gradient conduit — this reads as a placeholder for that mark rather than a
 * second one. Inlined so swapping it later is a single-file change.
 */
function SolutionsMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("block w-full max-w-[649px]", className)}
      viewBox="0 0 649 189"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="softcom-solutions-thread"
          x1="201"
          y1="95"
          x2="448"
          y2="95"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3D3D3D" />
          <stop offset="0.5" stopColor="#A3A3A3" />
          <stop offset="1" stopColor="#3D3D3D" />
        </linearGradient>
      </defs>
      <circle cx="94.5" cy="94.5" r="94.5" fill="#D9D9D9" />
      <path
        d="M201 94.5H448"
        stroke="url(#softcom-solutions-thread)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="554.5" cy="94.5" r="94.5" fill="#D9D9D9" />
    </svg>
  )
}

/**
 * The page's opening statement: one plate, the mark, and the claim.
 *
 * The plate is a step off the page rather than the page itself, which is what
 * `--card` already means — in dark it resolves to the `#171717` the design
 * specifies, and in light it inverts with the rest of the site.
 */
function SolutionsHero() {
  return (
    <Container className="pt-6">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-16 overflow-clip rounded-2xl bg-card px-6 py-24",
          "lg:h-[1024px] lg:gap-32 lg:py-32"
        )}
      >
        <SolutionsMark />

        <h1
          className={cn(
            displayText,
            "max-w-[810px] text-center text-card-foreground"
          )}
        >
          The infrastructure behind organisations that move Africa forward.
        </h1>
      </div>
    </Container>
  )
}

export { SolutionsHero, SolutionsMark }
