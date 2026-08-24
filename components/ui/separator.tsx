"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        /*
         * `data-[orientation=…]`, not `data-horizontal` / `data-vertical`:
         * shadcn ships these written for Base UI, but the primitive here is
         * Radix, which emits `data-orientation="horizontal" | "vertical"`. With
         * neither spelling matching, the separator had no height *and* no width
         * — it rendered as nothing at all.
         */
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
