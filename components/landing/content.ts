/**
 * Landing page copy, transcribed from Figma `Landing` (node 210:40).
 *
 * Held here rather than inline so each section stays presentational: the
 * sectors/capabilities lists become a Sanity document type and `team` /
 * `insights` become GROQ results without touching the components.
 */

export type Sector = {
  id: string
  title: string
  description: string
  tags: string[]
  /** Layered dot-matrix illustration exported from Figma, painted back-to-front. */
  illustration: {
    /** Intrinsic size of the artboard, in px. */
    width: number
    height: number
    layers: { src: string; inset: string }[]
  }
}

export const sectors: Sector[] = [
  {
    id: "public",
    title: "Public\nSector",
    description:
      "The institutions responsible for delivering services to millions. We help them do it at scale.",
    tags: ["Government MDAs", "Regulators", "Law Enforcement Agencies"],
    illustration: {
      width: 151.667,
      height: 179.665,
      layers: [
        { src: "/landing/sector-public-dots.svg", inset: "0.65% 0.77%" },
        { src: "/landing/sector-public-grid.svg", inset: "0" },
        {
          src: "/landing/sector-public-highlight.svg",
          inset: "62.99% 56.15% 16.23% 37.69%",
        },
      ],
    },
  },
  {
    id: "private",
    title: "Private\nSector",
    description:
      "Enterprises that need technology to move faster, reach further, and operate with more precision.",
    tags: ["Financial Services", "FMCG", "Oil & Gas", "Education"],
    illustration: {
      width: 151.665,
      height: 180.833,
      layers: [
        {
          src: "/landing/sector-private-dots.svg",
          inset: "0.64% 0 1.29% 1.54%",
        },
        { src: "/landing/sector-private-grid.svg", inset: "0" },
      ],
    },
  },
  {
    id: "enablers",
    title: "Development Enablers",
    description:
      "Organisations driving systemic change, we give them the infrastructure to measure and prove it.",
    tags: [
      "Multilateral Organisations",
      "Cooperatives",
      "Non-Profit Foundations",
    ],
    illustration: {
      width: 151.665,
      height: 179.241,
      layers: [
        {
          src: "/landing/sector-enablers-dots.svg",
          inset: "1.28% 1.51% 1.28% 1.52%",
        },
        { src: "/landing/sector-enablers-grid.svg", inset: "0" },
      ],
    },
  },
]

export type Capability = {
  number: string
  title: string
  description: string
  image: string
  /** Tailwind classes for the number chip — the accent inverts per slide. */
  chipClassName: string
}

export const capabilities: Capability[] = [
  {
    number: "01",
    title: "Digital Infrastructure",
    description:
      "We design and deploy the core systems organisations depend on enterprise platforms, APIs, payment infrastructure, and integration layers. Whether building from scratch or modernising legacy estates, we make technology perform reliably at scale across regulated, high-stakes environments.",
    image: "/landing/capability-01.png",
    chipClassName: "bg-brand-blue text-brand-cyan",
  },
  {
    number: "02",
    title: "Intelligence",
    description:
      "We turn complex data into clear decisions. Our intelligence practice builds BI platforms, anomaly detection engines, fraud monitoring systems, and custom analytics — giving organisations deep visibility into their customers, operations, and market position.",
    image: "/landing/capability-02.png",
    chipClassName: "bg-brand-cyan text-brand-blue",
  },
  {
    number: "03",
    title: "Programs",
    description:
      "End-to-end ownership of ambitious digital programmes — from discovery and design through build, deployment, and sustained impact measurement. We embed with client teams, absorb delivery risk, and stay accountable until real outcomes are achieved.",
    image: "/landing/capability-03.png",
    chipClassName: "bg-background text-foreground",
  },
]

/**
 * The team block interleaves stat plates and portraits in a four-column grid.
 * Figma order: 20M+ · portrait · portrait · 100+ · 30+ · portrait.
 */
export type TeamCell =
  | { kind: "stat"; value: string; label: string }
  | { kind: "portrait"; image: string; name?: string; role?: string }

export const teamCells: TeamCell[] = [
  { kind: "stat", value: "20M+", label: "People Reached" },
  {
    kind: "portrait",
    image: "/landing/team-01.png",
    name: "Abayomi Adedeji",
    role: "Founder",
  },
  { kind: "portrait", image: "/landing/team-02.png" },
  { kind: "stat", value: "100+", label: "Projects Delivered" },
  { kind: "stat", value: "30+", label: "Enterprise Clients" },
  { kind: "portrait", image: "/landing/team-03.png" },
]

export type Insight = {
  slug: string
  category: string
  date: string
  title: string
}

export const insights: Insight[] = [
  {
    slug: "why-digital-transformation-fails-in-african-enterprises",
    category: "Digital Strategy",
    date: "April 26, 2026",
    title:
      "Why Digital Transformation Fails in African Enterprises — And What to Do About It",
  },
  {
    slug: "building-a-data-culture-nigerian-financial-sector",
    category: "Data",
    date: "April 26, 2026",
    title: "Building a Data Culture: Lessons from Nigeria's Financial Sector",
  },
]

/**
 * The links revealed inside the header's expanding pill (Figma 278:52).
 *
 * The two caret items open dropdowns. Figma draws the carets but not the panels,
 * so their contents are grouped from the footer's IA — which lines up with the
 * Sanity document types (`leader`, `alumnus`, `role`, `caseStudy`). Each panel
 * repeats its own section as the first entry, because a menu trigger doesn't
 * navigate and the overview page would otherwise be unreachable from the header.
 */
export type HeaderNavItem = {
  label: string
  href: string
  submenu?: { label: string; href: string }[]
}

export const headerNav: HeaderNavItem[] = [
  {
    label: "About",
    href: "/about",
    submenu: [
      { label: "About", href: "/about" },
      { label: "Leadership", href: "/leadership" },
      { label: "Alumni", href: "/alumni" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    submenu: [
      { label: "Solutions", href: "/solutions" },
      { label: "Products & Services", href: "/products-and-services" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
]

export const footerNav = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Leadership", href: "/leadership" },
      { label: "Alumni", href: "/alumni" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "What We Do",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Products & Services", href: "/products-and-services" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
]
