/**
 * Enterprise Products copy, from the client's website copy deck (October
 * 2026), laid out on Figma `Product & Services` (node 215:22).
 *
 * Held here for the same reason as the other pages' copy: products are the
 * obvious Sanity document type, and keeping them out of the components means
 * that swap touches one file.
 */

export type Product = {
  id: string
  name: string
  /** The bold one-liner under the name. */
  tagline: string
  description: string
  /**
   * The dithered panel behind a proprietary product's card, exported from
   * Figma. Partner platforms carry none and render as text cards.
   */
  panel?: string
  /** The product's own wordmark, laid over the panel. Only Useforms has one. */
  wordmark?: { src: string; width: number; height: number }
}

export const productsIntro = {
  title: "Enterprise Products",
  lead: "Explore the proprietary products we have built and the global platforms we implement.",
}

/*
 * The panels are generic dither fields re-used from the products these
 * replaced (SIE → Sentinel, Rewards → Reckon, Koya → Lift). The SIE and
 * Rewards exports had a "Learn More" pill baked in; it has been painted out.
 */
export const products: Product[] = [
  {
    id: "sentinel",
    name: "Sentinel",
    tagline: "Financial intelligence for complex investigations.",
    description:
      "Connect and analyse financial records across accounts and parties. Trace money flows, uncover transaction patterns and reveal relationships through network analysis, visualisations and investigative reports.",
    panel: "/products/panel-sentinel.png",
  },
  {
    id: "reckon",
    name: "Reckon",
    tagline: "Audit beyond the limits of manual review.",
    description:
      "Reckon equips teams to conduct in-depth desk reviews, material audits and other investigations, with analysis shaped by the audit’s objectives and findings grounded in evidence. Examine extensive records, reconcile evidence across sources and uncover discrepancies that sampling can miss.",
    panel: "/products/panel-reckon.png",
  },
  {
    id: "useforms",
    name: "Useforms",
    tagline: "Collect data in all its forms.",
    description:
      "Equip teams to collect and submit text, images, location, direction, biometric information and more. Bring observations and supporting evidence together in structured submissions that document people, places and activities.",
    panel: "/products/panel-useforms.png",
    wordmark: {
      src: "/products/useforms-wordmark.svg",
      width: 437,
      height: 76,
    },
  },
  {
    id: "lift",
    name: "Lift",
    tagline: "An integrated platform for entrepreneurial growth.",
    description:
      "Bring knowledge, resources, business tools and services within reach of entrepreneurs. Lift connects the support they need to develop their capabilities, run their businesses and pursue opportunities.",
    panel: "/products/panel-lift.png",
  },
]

export const partnersIntro = {
  title: "Partner Platforms",
  lead: "Global technology, delivered with Softcom’s local expertise in implementation and integration.",
}

export const partnerPlatforms: Product[] = [
  {
    id: "liquio",
    name: "Liquio by Kitsoft",
    tagline: "The foundation for digital government services.",
    description:
      "Build and deploy public services through a low-code platform designed for government. Softcom works with Kitsoft to put Liquio into operation for ministries, departments and agencies, adapting delivery to local requirements and workflows.",
  },
  {
    id: "rtgs-global",
    name: "RTGS.global",
    tagline: "Infrastructure for cross-border payments and settlement.",
    description:
      "Connect regulated financial institutions through infrastructure for real-time cross-border payments and foreign-exchange settlement. Softcom works with RTGS.global to support implementation for institutions in Nigeria and across Africa.",
  },
]
