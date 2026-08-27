/**
 * Products & Services copy, transcribed from Figma `Product & Services`
 * (node 215:22) and the Useforms overlay (node 317:1634).
 *
 * Held here for the same reason as the other pages' copy: products and
 * deliverables are the obvious Sanity document types, and keeping them out of
 * the components means that swap touches one file.
 */

export type ProductDetail = {
  /** The accented one-liner above the body copy. Repeats the card's tagline. */
  lead: string
  description: string
  features: string[]
}

export type Product = {
  id: string
  name: string
  tagline: string
  /** The dithered panel behind the card, exported from Figma. */
  panel: string
  /**
   * The product's own wordmark, laid over the panel. Only Useforms has one in
   * the design; the rest carry the dither alone.
   */
  wordmark?: { src: string; width: number; height: number }
  /**
   * Present only where the design has an overlay to open. Useforms is the one
   * that was drawn, so the others' buttons stay inert until theirs exist.
   */
  detail?: ProductDetail & {
    panel: string
  }
}

export const products: Product[] = [
  {
    id: "useforms",
    name: "Useforms",
    tagline: "The smarter way to ask questions, collect data, and take action.",
    panel: "/products/panel-useforms.png",
    wordmark: {
      src: "/products/useforms-wordmark.svg",
      width: 437,
      height: 76,
    },
    detail: {
      panel: "/products/panel-useforms-overlay.png",
      lead: "The smarter way to ask questions, collect data, and take action.",
      description:
        "Useforms is Softcom's enterprise data capture and field intelligence platform — built to help individuals and organisations collect better information and act on it with confidence. From feedback and payment collection to requirements capture and beneficiary enrolment, Useforms works online, offline, and everywhere in between.",
      features: [
        "Feedback & Survey Collection",
        "Payment & Order Forms",
        "Requirements & Project Capture",
        "Offline-to-Online Field Data Sync",
        "Analytics & Reporting Dashboard",
      ],
    },
  },
  {
    id: "rewards",
    name: "Rewards",
    tagline: "From product sale to direct consumer relationship.",
    panel: "/products/panel-rewards.png",
  },
  {
    id: "koya",
    name: "Koya",
    tagline: "Impactful, connected, sustained learning.",
    panel: "/products/panel-koya.png",
  },
  {
    id: "sie",
    name: "SIE",
    tagline: "Turn financial documents into actionable intelligence.",
    panel: "/products/panel-sie.png",
  },
]

export type Deliverable = {
  id: string
  title: string
  description: string
  /** The dot-matrix mark, exported from Figma as a flat SVG. */
  mark: string
}

export const deliverables: Deliverable[] = [
  {
    id: "government",
    title: "Government & Social Infrastructure",
    description:
      "National-scale platforms for recruitment, payment, beneficiary management, and conditional cash transfers — deployed across all 36 states and hard-to-reach communities.",
    mark: "/products/deliver-government.svg",
  },
  {
    id: "custom",
    title: "Custom Solutions",
    description:
      "Bespoke digital strategy, custom software development, and end-to-end digital transformation programmes — designed for the complexity of Africa's emerging markets. From systems architecture to cloud modernisation, we engineer solutions precisely tailored to your organisation's context and ambitions.",
    mark: "/products/deliver-custom.svg",
  },
  {
    id: "market",
    title: "Market & Revenue Enablement",
    description:
      "Equipping businesses and institutions to discover and unlock new revenue streams through modern market intelligence, consumer engagement infrastructure, and digital commerce platforms — moving organisations from traditional distribution to direct consumer relationships.",
    mark: "/products/deliver-market.svg",
  },
]
