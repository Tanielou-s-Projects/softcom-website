"use client"

/* eslint-disable @next/next/no-img-element -- local SVG wordmark, intentionally not run through next/image */
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
  primaryPill,
} from "@/components/landing/section"
import type { Product } from "@/components/products/content"

/**
 * The expanded view of a product: the card's own layout, opened over the page.
 *
 * Only Useforms has one drawn, so the trigger is disabled for the rest rather
 * than opening an empty sheet — the design puts a Learn More on all four cards,
 * and a button that visibly does nothing is worse than one that says it can't.
 */
function ProductOverlay({ product }: { product: Product }) {
  const detail = product.detail

  if (!detail) {
    return (
      <Button
        size="lg"
        disabled
        className={cn(primaryPill, "absolute right-3 bottom-3")}
      >
        Learn More
      </Button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={cn(primaryPill, "absolute right-3 bottom-3")}
        >
          Learn More
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-h-[calc(100svh-3rem)] gap-2.5 overflow-y-auto bg-transparent p-0 ring-0",
          "sm:max-w-[calc(100vw-3rem)] lg:max-w-[1392px]",
          "lg:grid-cols-[779px_minmax(0,1fr)]"
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
                {detail.lead}
              </DialogDescription>
              <p className={cn(bodyText, "text-foreground")}>
                {detail.description}
              </p>
              <ul
                className={cn(
                  bodyText,
                  "list-disc pl-5 text-foreground marker:text-muted-foreground"
                )}
              >
                {detail.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          {/*
           * The design gives this button no destination, and the overlay is
           * already the "more". It dismisses until there is a product page to
           * send people to, rather than sitting there inert.
           */}
          <DialogClose asChild>
            <Button size="lg" className={cn(primaryPill, "self-start")}>
              Learn More
            </Button>
          </DialogClose>
        </article>

        <div className="relative min-h-[280px] overflow-clip rounded-3xl lg:min-h-0">
          <Image
            src={detail.panel}
            alt=""
            fill
            sizes="(min-width: 1024px) 603px, 100vw"
            className="object-cover"
          />
          {product.wordmark && (
            <img
              src={product.wordmark.src}
              alt={`${product.name} logo`}
              width={product.wordmark.width}
              height={product.wordmark.height}
              className="absolute top-1/2 left-1/2 w-[72%] max-w-[437px] -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ProductOverlay }
