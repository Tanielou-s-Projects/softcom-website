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
         * The section label. Brand blue with white text in light mode, brand
         * cyan with dark text in dark mode (and inside any `dark` region) —
         * cyan is too light to carry on a light page.
         */
        brand:
          "bg-brand-blue text-white dark:bg-brand-cyan dark:text-neutral-950",
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
