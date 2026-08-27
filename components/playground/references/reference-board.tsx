/* eslint-disable @next/next/no-img-element -- local reference screenshots, not app imagery */
import type { ComponentType } from "react"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import {
  MOBBIN_REFERENCE_GROUPS,
  refMobbinUrl,
  refSrc,
  type MobbinReferenceGroup,
} from "@/components/playground/references/mobbin-references"

/**
 * A board of Mobbin references for one section type — each a real About/Team/
 * Company page section, linked back to its Mobbin page so it can be opened full
 * size. This is the surface for cherry-picking a direction per section before
 * anything gets built.
 */
function ReferenceBoard({ group }: { group: MobbinReferenceGroup }) {
  return (
    // Masonry via CSS columns — the sections vary wildly in height (a short
    // hero vs. a full team roster), so a fixed grid leaves big gaps; columns
    // pack them tight.
    <div className="gap-4 [column-fill:balance] sm:columns-2">
      {group.refs.map((ref) => (
        <a
          key={ref.id}
          href={refMobbinUrl(ref.id)}
          target="_blank"
          rel="noreferrer"
          className="group mb-4 block break-inside-avoid overflow-clip rounded-xl border bg-background transition-colors hover:border-ring/60"
        >
          <div className="border-b bg-muted/30">
            <img
              src={refSrc(group.id, ref.id)}
              alt={`${ref.site} — ${group.label} section`}
              loading="lazy"
              className="block h-auto w-full"
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="text-sm font-medium text-foreground">
              {ref.site}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground">
              Mobbin
              <ArrowUpRight className="size-3.5" weight="bold" />
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}

/**
 * Maps each reference group's id to a gallery component, so the playground's
 * `SECTION_CONTENT` can spread these in with one line — the registry entry and
 * this data are the only two places a section is declared.
 */
export const REFERENCE_SECTION_CONTENT: Record<string, ComponentType> =
  Object.fromEntries(
    MOBBIN_REFERENCE_GROUPS.map((group) => {
      const ReferenceSection = () => <ReferenceBoard group={group} />
      ReferenceSection.displayName = `ReferenceSection(${group.id})`
      return [group.id, ReferenceSection]
    })
  ) as Record<string, ComponentType>
