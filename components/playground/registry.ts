import { Palette, SquaresFour, Layout, type Icon } from "@phosphor-icons/react"

export type SectionStatus = "ready" | "pending"

export interface PlaygroundSection {
  /** Stable id — used as the scroll anchor and the nav key. */
  id: string
  label: string
  /** Short one-liner shown under the section heading. */
  blurb?: string
  status: SectionStatus
}

export interface PlaygroundCategory {
  id: string
  label: string
  icon: Icon
  sections: PlaygroundSection[]
}

/**
 * The design-system information architecture. Drives both the left nav and the
 * centre gallery, so adding a section is a one-line change here plus an entry
 * in `content.tsx`.
 */
export const PLAYGROUND_CATEGORIES: PlaygroundCategory[] = [
  {
    id: "foundations",
    label: "Foundations",
    icon: Palette,
    sections: [
      {
        id: "colors",
        label: "Colour",
        blurb: "Tier 1 primitives and the Tier 2 semantic roles they feed.",
        status: "ready",
      },
      {
        id: "typography",
        label: "Typography",
        blurb: "The two families and the landing page's type scale.",
        status: "ready",
      },
      {
        id: "radius",
        label: "Radius",
        blurb: "The sm → 4xl scale and the Tier 3 component knobs.",
        status: "ready",
      },
      {
        id: "spacing",
        label: "Spacing",
        blurb: "The rhythm the layout is built on.",
        status: "ready",
      },
      {
        id: "shadows",
        label: "Elevation",
        blurb: "Shadows and ring treatments.",
        status: "ready",
      },
      {
        id: "icons",
        label: "Icons",
        blurb: "Phosphor, at our sizes.",
        status: "ready",
      },
    ],
  },
  {
    id: "brand",
    label: "Brand",
    icon: Layout,
    sections: [
      {
        id: "marks",
        label: "Marks",
        blurb: "Logo states, the hero capsule, and the accent dots.",
        status: "ready",
      },
      {
        id: "dither",
        label: "Dither",
        blurb: "Ordered-dither shaders, against the design's static export.",
        status: "ready",
      },
      {
        id: "landing",
        label: "Landing patterns",
        blurb: "Sector card, capability chip, stat plate, insight card.",
        status: "ready",
      },
    ],
  },
  {
    id: "components",
    label: "Components",
    icon: SquaresFour,
    sections: [
      {
        id: "buttons",
        label: "Buttons",
        blurb: "Variants, sizes, and the brand pills.",
        status: "ready",
      },
      {
        id: "badges",
        label: "Badges",
        blurb: "Both surface treatments.",
        status: "ready",
      },
      {
        id: "navigation",
        label: "Navigation",
        blurb: "Menu, tabs, breadcrumb, pagination.",
        status: "ready",
      },
      {
        id: "inputs",
        label: "Inputs & forms",
        blurb: "Everything a contact form needs.",
        status: "ready",
      },
      {
        id: "overlays",
        label: "Overlays",
        blurb: "Dialog, sheet, dropdown, popover, tooltip.",
        status: "ready",
      },
      {
        id: "feedback",
        label: "Feedback",
        blurb: "Alert, toast, progress, skeleton.",
        status: "ready",
      },
      {
        id: "data",
        label: "Data display",
        blurb: "Card, table, avatar, separator.",
        status: "ready",
      },
    ],
  },
]

export const ALL_SECTIONS: PlaygroundSection[] = PLAYGROUND_CATEGORIES.flatMap(
  (category) => category.sections
)
