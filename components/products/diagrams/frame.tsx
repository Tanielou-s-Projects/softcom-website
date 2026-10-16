import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The copy deck's diagrams, rebuilt in code. Each keeps the deck's frame —
 * a mono eyebrow ("SENTINEL / 01"), the title, a one-line standfirst, the
 * diagram, and a footer with the wordmark and the deck's own disclaimer —
 * and the deck's data and wording exactly. Only the type and colour are the
 * site's: the deck's purple is `brand-accent` (blue on light, cyan on dark),
 * its lavender fills are that accent at low alpha.
 */

/** The deck's accent, as Tailwind classes, so every diagram uses one set. */
export const accent = {
  text: "text-accent-ink",
  fill: "bg-accent-ink",
  soft: "bg-accent-ink/10",
  ring: "ring-accent-ink",
  stroke: "stroke-accent-ink",
}

export function DiagramFrame({
  eyebrow,
  title,
  subtitle,
  footnote = "Concept illustration · Fictional data",
  children,
  className,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  footnote?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <figure
      className={cn(
        "m-0 flex flex-col gap-8 rounded-3xl bg-surface-raised p-6 ring-1 ring-ink/10 sm:p-8 lg:gap-12 lg:p-12",
        className
      )}
    >
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs tracking-[0.14em] text-ink-soft uppercase">
          {eyebrow}
        </span>
        <h3 className="font-heading text-2xl leading-[1.15] font-light tracking-tight text-ink lg:text-[2rem]">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-base leading-normal text-ink-soft lg:text-lg">
            {subtitle}
          </p>
        ) : null}
      </header>
      <div className="min-w-0">{children}</div>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 font-mono text-[11px] tracking-[0.14em] text-ink-soft uppercase">
        <span className="text-ink">Softcom</span>
        <span>{footnote}</span>
      </footer>
    </figure>
  )
}

/** A white sub-card inside a diagram, as the deck draws its boxes. */
export function DiagramCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-2xl bg-surface ring-1 ring-ink/10", className)}
      {...props}
    />
  )
}

/** A small mono caption, as the deck sets its table heads and labels. */
export function Caps({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase",
        className
      )}
      {...props}
    />
  )
}

/** The deck's node: a lettered disc, tinted when it is on the path. */
export function Node({
  label,
  on,
  tint,
  className,
}: {
  label: string
  on?: boolean
  /** Tinted without being on the path (the deck's plain connections). */
  tint?: boolean
  className?: string
}) {
  return (
    // Solid underneath, so a line passing behind never shows through.
    <span
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full bg-surface font-heading text-base ring-1 lg:size-12 lg:text-lg",
        on ? "text-accent-ink ring-accent-ink" : "text-ink ring-ink/20",
        className
      )}
    >
      {on || tint ? (
        <span aria-hidden className="absolute inset-0 bg-accent-ink/12" />
      ) : null}
      <span className="relative">{label}</span>
    </span>
  )
}
