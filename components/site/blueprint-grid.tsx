"use client"

import { Dithering } from "@paper-design/shaders-react"

import { useVariant } from "@/components/variants/variant-context"

/**
 * What lives in the side margins on wide viewports (≥ 1440px, where the
 * 1336px column leaves real space). Fixed behind the page: full-bleed plates
 * cover it as they scroll past, `Container` sections let it show.
 *
 * The client read the first pass (faint drafting rails) as "incomplete", so
 * the default is now nothing, with two alternatives on the variant switcher:
 * `labelled` — the rails, heavier, with a running mono label so they read as
 * an editorial device; `dither` — no lines, a soft shader grain so the margin
 * has material rather than structure.
 *
 * Pages that mount this must not repaint `bg-background` on their wrapper —
 * the body already paints it, and an opaque positioned wrapper would sit
 * above the grid's negative z-index and hide it.
 */
function BlueprintGrid() {
  const variant = useVariant("margins")

  if (variant === "none") return null

  if (variant === "dither") {
    return (
      <div aria-hidden className="softcom-blueprint" data-style="dither">
        {(["left", "right"] as const).map((side) => (
          <div key={side} className="softcom-blueprint-rail" data-side={side}>
            {/* A mid grey reads on both themes; the rail's CSS opacity sets the weight. */}
            <Dithering
              style={{ width: "100%", height: "100%" }}
              colorBack="#00000000"
              colorFront="#8c8c8c"
              shape="simplex"
              type="4x4"
              size={2}
              scale={0.6}
              speed={0}
              fit="cover"
            />
          </div>
        ))}
      </div>
    )
  }

  const label = "SOFTCOM — LAGOS — EST. 2007 — TECHNOLOGY FOR ORGANISATIONS"
  return (
    <div aria-hidden className="softcom-blueprint" data-style="labelled">
      <div
        className="softcom-blueprint-rail"
        data-side="left"
        data-label={label}
      />
      <div
        className="softcom-blueprint-rail"
        data-side="right"
        data-label={label}
      />
    </div>
  )
}

export { BlueprintGrid }
