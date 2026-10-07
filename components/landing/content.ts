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
    title: "Public\nInstitutions",
    description:
      "We work with public institutions on the technology and systems needed to serve people, support oversight and coordinate delivery. Our approach considers the mandate, the operating environment and the people the solution must reach.",
    tags: ["Government MDAs", "Regulators", "Law Enforcement Agencies"],
    silhouette: "/landing/sector-public-silhouette.svg",
    tone: "cyan",
  },
  {
    id: "private",
    title: "Private\nOrganisations",
    description:
      "We help businesses apply technology to the priorities that shape their performance. From enterprise systems to intelligence and digital services, we connect technical capability with the organisation’s commercial ambitions.",
    tags: ["Financial Services", "FMCG", "Oil & Gas", "Education"],
    silhouette: "/landing/sector-private-silhouette.svg",
    tone: "blue",
  },
  {
    id: "enablers",
    title: "Development\nEnablers",
    description:
      "Local understanding, coordinated implementation and visibility into results are essential to development work. Our technology and delivery expertise help development organisations reach intended beneficiaries, follow progress and respond to what they learn.",
    tags: [
      "Multilateral Organisations",
      "Cooperatives",
      "Non-Profit Foundations",
    ],
    silhouette: "/landing/sector-enablers-silhouette.svg",
    tone: "neutral",
  },
  {
    id: "partners",
    title: "Technology\nPartners",
    description:
      "We collaborate with technology companies whose platforms and solutions can serve organisations in our markets. Together, we explore opportunities and bring the technical expertise, local understanding and implementation capability needed to put those solutions to work.",
    // The two partner platforms the deck names; extend as partnerships are confirmed.
    tags: ["Kitsoft", "RTGS.global"],
    silhouette: "/landing/sector-partners-silhouette.svg",
    tone: "cyan",
  },
]

export type Capability = {
  number: string
  /** Anchor on /solutions, so each slide's link lands on its own area. */
  id: string
  title: string
  description: string[]
  image: string
  /** Tailwind classes for the number chip — the accent inverts per slide. */
  chipClassName: string
}

export const capabilities: Capability[] = [
  {
    number: "01",
    id: "digital-infrastructure",
    title: "Digital Infrastructure",
    description: [
      "We build the digital rails that enable people and organisations to access services, connect and transact. These systems provide a common foundation through which many participants can operate, repeatedly and at scale.",
      "We do this with our own technology, partner platforms and custom-built systems. Where the infrastructure already exists globally, we are the partner that makes it work locally.",
    ],
    image: "/landing/capability-01.png",
    chipClassName: "bg-brand-blue text-brand-cyan",
  },
  {
    number: "02",
    id: "applied-intelligence",
    title: "Applied Intelligence",
    description: [
      "Our intelligence systems connect fragmented information and help organisations examine it in depth. Across documents, records and datasets, including market data, our technology helps people investigate activity, understand relationships, track changes and identify what needs attention.",
      "We shape the intelligence around the questions people need to answer and the decisions they need to make.",
    ],
    image: "/images/intelligence-ops-room.jpg",
    chipClassName: "bg-brand-cyan text-brand-blue",
  },
  {
    number: "03",
    id: "powering-initiatives",
    title: "Powering Initiatives",
    description: [
      "We bring technology, people and processes together to deliver complex initiatives. We design how an initiative will operate, put the required systems in place and coordinate the activities needed to reach its intended beneficiaries.",
      "We stay accountable for what the initiative achieves, not only for what we build.",
    ],
    image: "/landing/capability-03.png",
    chipClassName: "bg-background text-foreground",
  },
]

/**
 * What guides the work — shared by the homepage people section and About.
 * The deck repeats them verbatim in both places.
 */
export type Value = { title: string; description: string }

export const values: Value[] = [
  {
    title: "Depth of thought",
    description:
      "Our teams question assumptions, examine the context and consider the implications before settling on an answer.",
  },
  {
    title: "Technical competence",
    description:
      "Thoughtful design, disciplined engineering and attention to detail shape how our solutions are built and put into use.",
  },
  {
    title: "Ownership",
    description:
      "We make commitments carefully, raise issues openly and follow through on the work entrusted to us.",
  },
  {
    title: "Collective strength",
    description:
      "We bring different expertise and perspectives together. Sharing knowledge and working across disciplines makes us more capable as a team.",
  },
]

/** Impact numbers — shared by the homepage Stats block and the team section. */
/*
 * Company tenure, in one place. The site had "over two decades", "nearly two
 * decades", "Two decades of…" and a stat tile reading "18" all at once; the
 * client asked for one phrasing. Founded 2007 — the number is computed so it
 * never goes stale, and the prose stays honest until the 20th year.
 * Wording is the client's call; change it here and it changes everywhere.
 */
export const FOUNDED = 2007
export const YEARS_ACTIVE = new Date().getFullYear() - FOUNDED
export const TENURE = "nearly two decades"
export const TENURE_TITLE = "Nearly two decades"

export type Stat = { value: string; label: string }

export const stats: Stat[] = [
  { value: "20M+", label: "People reached" },
  { value: "100+", label: "Projects delivered" },
  { value: "30+", label: "Organisations served" },
  { value: String(YEARS_ACTIVE), label: "Years of delivery" },
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

/**
 * "Our thinking" on the homepage. Perspectives, not dated news: the deck gives
 * each a title and a one-line summary. They link to the Insights index until
 * the articles themselves are written.
 */
export type Perspective = { title: string; summary: string; href: string }

export const perspectives: Perspective[] = [
  {
    title: "Start with the service, then design the system",
    summary:
      "Useful technology begins with a clear understanding of the work it needs to support. A perspective on connecting systems, responsibilities and the experience of the people using them.",
    href: "/insights",
  },
  {
    title: "A useful dashboard starts with a decision",
    summary:
      "Information becomes valuable when someone can act on it. Why the purpose of a dashboard should shape its measures, its design and its place in an organisation’s work.",
    href: "/insights",
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
      { label: "Enterprise Products", href: "/enterprise-products" },
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
      { label: "Careers", href: "/careers" },
      { label: "Alumni", href: "/alumni" },
      { label: "Join the alumni network", href: "/alumni#join" },
    ],
  },
  {
    heading: "What We Do",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Enterprise Products", href: "/enterprise-products" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    // The footer is the site's full menu, so the products are listed by name.
    heading: "Products",
    links: [
      { label: "Sentinel", href: "/enterprise-products#sentinel" },
      { label: "Reckon", href: "/enterprise-products#reckon" },
      { label: "Useforms", href: "/enterprise-products#useforms" },
      { label: "Lift", href: "/enterprise-products#lift" },
      { label: "Liquio", href: "/enterprise-products#liquio" },
      { label: "RTGS.global", href: "/enterprise-products#rtgs-global" },
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

/*
 * TODO(client): Privacy and Terms pages don't exist yet, and the social
 * profile URLs haven't been supplied. Entries without an href are left out of
 * the footer's bottom bar until they are filled in.
 */
export const footerLegal: { label: string; href?: string }[] = [
  { label: "Privacy" },
  { label: "Terms" },
]
export const footerSocial: { label: string; href?: string }[] = [
  { label: "LinkedIn" },
]
