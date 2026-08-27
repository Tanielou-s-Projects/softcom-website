"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Container, displayText, headingText } from "@/components/landing/section"
import { SoftcomWordmark } from "@/components/site/softcom-wordmark"

export type HeaderVariant = "pills" | "capsule" | "bar" | "glass"

/* ------------------------------------------------------------------ pieces */

/** The wordmark in a dark, floating pill. */
function LogoPill() {
  return (
    <div className="inline-flex items-center rounded-full bg-neutral-950/80 px-5 py-3 ring-1 ring-white/10 backdrop-blur-md">
      <SoftcomWordmark className="h-6 w-auto text-foreground" />
    </div>
  )
}

/** The two brand dots — the collapsed menu. */
function Dots({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center", className)} aria-hidden>
      <span className="size-5 rounded-full bg-brand-cyan" />
      <span className="size-5 rounded-full bg-brand-blue" />
    </span>
  )
}

/** The dots in a dark, floating pill (the menu button). */
function MenuPill() {
  return (
    <button
      type="button"
      aria-label="Open menu"
      className="inline-flex items-center rounded-full bg-neutral-950/80 px-4 py-3 ring-1 ring-white/10 backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60"
    >
      <Dots />
    </button>
  )
}

/* -------------------------------------------------------------- variations */

function LabHeader({ variant }: { variant: HeaderVariant }) {
  if (variant === "capsule") {
    return (
      <header className="sticky top-0 z-40 flex justify-center px-6 pt-5">
        <div className="flex items-center gap-6 rounded-full bg-neutral-950/80 py-3 pr-4 pl-6 ring-1 ring-white/10 backdrop-blur-md">
          <SoftcomWordmark className="h-6 w-auto text-foreground" />
          <span className="h-6 w-px bg-white/10" />
          <button
            type="button"
            aria-label="Open menu"
            className="outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60"
          >
            <Dots />
          </button>
        </div>
      </header>
    )
  }

  if (variant === "bar") {
    return (
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
        <div className="flex items-center justify-between px-6 py-4 lg:px-7">
          <SoftcomWordmark className="h-6 w-auto text-foreground" />
          <button
            type="button"
            aria-label="Open menu"
            className="outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60"
          >
            <Dots />
          </button>
        </div>
      </header>
    )
  }

  if (variant === "glass") {
    return (
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 lg:px-7">
          <SoftcomWordmark className="h-6 w-auto text-foreground" />
          <button
            type="button"
            aria-label="Open menu"
            className="outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60"
          >
            <Dots />
          </button>
        </div>
      </header>
    )
  }

  // "pills" — two dark pills floating on a transparent sticky bar.
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 pt-5 lg:px-7">
      <LogoPill />
      <MenuPill />
    </header>
  )
}

/* --------------------------------------------------------- sample content */

/**
 * Deliberately mixed backgrounds — a dark plate, a brand-blue plate and a photo
 * band — so the header's legibility over different content is testable as you
 * scroll it past each.
 */
function SampleBody() {
  return (
    <div className="flex flex-col gap-2.5">
      <Container className="-mt-16 flex min-h-svh flex-col justify-center gap-6 pt-24">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Scroll to test the sticky header
        </p>
        <h1 className={cn(displayText, "max-w-[16ch] text-foreground")}>
          Technology for Organisations.
        </h1>
      </Container>

      <Container className="py-6">
        <div className="dark flex min-h-[70svh] flex-col justify-center gap-6 overflow-clip rounded-4xl bg-brand-blue p-8 lg:p-16">
          <h2 className={cn(headingText, "max-w-[20ch] text-foreground")}>
            The header should stay legible over a brand-blue plate too.
          </h2>
        </div>
      </Container>

      <Container className="py-6">
        <div className="relative min-h-[70svh] w-full overflow-clip rounded-4xl bg-neutral-900">
          <Image
            src="/landing/story.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </Container>

      <Container className="flex min-h-[60svh] items-center py-6">
        <p className={cn(headingText, "max-w-[24ch] text-muted-foreground")}>
          …and back over the plain background at the end.
        </p>
      </Container>
    </div>
  )
}

/* ------------------------------------------------------------------- shell */

const VARIANTS: { key: HeaderVariant; label: string; note: string }[] = [
  { key: "pills", label: "Pills", note: "Two dark pills floating on a transparent bar." },
  { key: "capsule", label: "Capsule", note: "Logo and dots in one pill." },
  { key: "bar", label: "Bar (black)", note: "Full-width solid black bar." },
  { key: "glass", label: "Bar (glass)", note: "Full-width blurred, translucent bar." },
]

export function HeaderLab({
  initialVariant = "pills",
}: {
  initialVariant?: HeaderVariant
}) {
  const [variant, setVariant] = React.useState<HeaderVariant>(initialVariant)
  const current = VARIANTS.find((v) => v.key === variant)!

  return (
    <div className="relative min-h-svh w-full bg-background">
      <LabHeader variant={variant} />
      <SampleBody />

      {/* Floating switcher. */}
      <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-fit flex-col items-center gap-2 rounded-2xl border bg-card/95 p-3 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-center gap-1 rounded-lg border bg-muted/40 p-1">
          {VARIANTS.map((v) => {
            const isActive = v.key === variant
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => setVariant(v.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v.label}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-muted-foreground">{current.note}</p>
      </div>
    </div>
  )
}
