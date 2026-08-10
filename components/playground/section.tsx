import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PlaygroundSection } from "@/components/playground/registry"

/**
 * The card frame every gallery section renders inside: an anchored heading and
 * blurb, then content. A section with no content yet shows a pill instead, so
 * the IA can list things before they exist.
 */
export function Section({
  section,
  children,
}: {
  section: PlaygroundSection
  children?: React.ReactNode
}) {
  const hasContent = children != null

  return (
    <div
      id={section.id}
      className="scroll-mt-6 rounded-(--card-radius) border bg-card p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-semibold tracking-tight">
            {section.label}
          </h3>
          {section.blurb && (
            <p className="mt-1 text-sm text-muted-foreground">
              {section.blurb}
            </p>
          )}
        </div>
        {!hasContent && (
          <Badge className="shrink-0 font-mono text-[11px]">coming soon</Badge>
        )}
      </div>
      {hasContent && <div className="mt-6">{children}</div>}
    </div>
  )
}

/** A labelled group separating specimen rows inside a section. */
export function SpecimenGroup({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <div className="mb-3 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </div>
      {children}
    </div>
  )
}

/** Monospace caption for a token name or computed value. */
export function TokenLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn("font-mono text-[11px] text-muted-foreground", className)}
    >
      {children}
    </span>
  )
}
