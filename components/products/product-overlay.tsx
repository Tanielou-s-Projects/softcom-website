"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DitherPanel } from "@/components/motion/dither-panel"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  bodyText,
  cardHeadingText,
  ghostPill,
  primaryPill,
} from "@/components/landing/section"
import type { Product } from "@/components/products/content"

/**
 * The expanded view of a product: the card's own layout, opened over the page,
 * with the tagline and description. It stands in for the product pages until
 * those are built, which is why the trigger reads "Explore".
 */
function ProductOverlay({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={cn(primaryPill, "absolute right-3 bottom-3")}
        >
          Explore {product.name}
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-h-[calc(100svh-3rem)] gap-2.5 overflow-y-auto bg-transparent p-0 ring-0",
          "sm:max-w-[calc(100vw-3rem)] lg:max-w-[1392px]",
          "lg:grid-cols-[56%_minmax(0,1fr)]"
        )}
      >
        <article className="flex flex-col justify-between gap-16 rounded-3xl bg-muted p-8 lg:p-[47px]">
          <div className="flex flex-col gap-8">
            <DialogTitle
              className={cn(cardHeadingText, "text-left text-foreground")}
            >
              {product.name}
            </DialogTitle>

            <div className="flex flex-col gap-8">
              <DialogDescription className={cn(bodyText, "text-brand-accent")}>
                {product.tagline}
              </DialogDescription>
              <p className={cn(bodyText, "text-foreground")}>
                {product.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg" className={primaryPill}>
              <Link href="/contact">Start a conversation</Link>
            </Button>
            <DialogClose asChild>
              <Button size="lg" variant="ghost" className={ghostPill}>
                Close
              </Button>
            </DialogClose>
          </div>
        </article>

        {product.dither !== undefined ? (
          <div className="relative min-h-[280px] overflow-clip rounded-3xl lg:min-h-0">
            <DitherPanel
              seed={product.dither}
              level={0.95}
              className="absolute inset-0"
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { ProductOverlay }
