import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-(--badge-radius) px-3 py-[5px] text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        /**
         * For badges sitting on a `bg-secondary` surface, where the default
         * would have no contrast against its container.
         */
        contrast: "bg-background text-muted-foreground",
        /**
         * On brand cyan. The label is pinned dark rather than tokenised because
         * the cyan is a fixed light colour in either theme, so `--background`
         * would turn the text white and unreadable in light mode.
         */
        brand: "bg-brand-cyan text-neutral-950",
        /** The flipped plate the design uses on brand-blue panels. */
        inverse: "bg-foreground text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
