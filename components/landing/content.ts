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
  /** Labels shown once the card resolves. Copy rewrite pending from the client. */
  tags: string[]
  /**
   * Opaque silhouette on a transparent artboard, sampled into the dot matrix
   * at runtime (see dot-matrix.tsx). Placeholders until brand supplies icons.
   */
  silhouette: string
  /** Resolved-state colour — existing brand tokens only. */
  tone: "cyan" | "blue" | "neutral"
}

export const sectors: Sector[] = [
  {
    id: "public",
    title: "Public\nSector",
    description:
      "The institutions responsible for delivering services to millions. We help them do it at scale.",
    tags: ["Government MDAs", "Regulators", "Law Enforcement Agencies"],
    silhouette: "/landing/sector-public-silhouette.svg",
    tone: "cyan",
  },
  {
    id: "private",
    title: "Private\nSector",
    description:
      "Enterprises that need technology to move faster, reach further, and operate with more precision.",
    tags: ["Financial Services", "FMCG", "Oil & Gas", "Education"],
    silhouette: "/landing/sector-private-silhouette.svg",
    tone: "blue",
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
    silhouette: "/landing/sector-enablers-silhouette.svg",
    tone: "neutral",
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

/** Impact numbers — shared by the homepage Stats block and the team section. */
export type Stat = { value: string; label: string }

export const stats: Stat[] = [
  { value: "20M+", label: "People reached" },
  { value: "100+", label: "Projects delivered" },
  { value: "30+", label: "Enterprise clients" },
  { value: "18", label: "Years of delivery" },
]

/** Team portraits for the About team section. Only confirmed names carry a plate. */
export type Portrait = { image: string; name?: string; role?: string }

export const portraits: Portrait[] = [
  { image: "/landing/team-01.png", name: "Abayomi Adedeji", role: "Founder" },
  {
    image: "/landing/team-02.png",
    name: "Omoseindemi Olobayo",
    role: "Chief Executive Officer",
  },
  {
    image: "/landing/team-03.png",
    name: "Adetoyosi Elegbede",
    role: "Chief Operating Officer",
  },
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
      { label: "Leadership", href: "/about#team" },
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
      { label: "Leadership", href: "/about#team" },
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
