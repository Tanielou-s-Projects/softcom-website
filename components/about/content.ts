/**
 * About / Leadership / Alumni copy.
 *
 * Taken from the Softcom vision prototype (softcom-vision.replit.app) — the
 * real, specific history (ReloadNG, Eyowo, NPower, TraderMoni, the two
 * divisions) and the named leadership team. This is a bare-bones scaffold: the
 * structure and copy are here, the visual design comes later.
 *
 * TODO: principle descriptions 02–05 are behind a scroll-pinned panel on the
 * reference and still need to be pulled; only 01 is captured so far.
 */

export const aboutHero = {
  eyebrow: "About Softcom",
  title: "Two decades of technology that matters.",
  lead: "Softcom Limited is one of Africa's most established technology companies, delivering systems, platforms, and transformation programs that power the continent's most important institutions.",
}

export const story = {
  eyebrow: "Our Story",
  heading: "Built from a conviction about Africa's potential.",
  cta: { label: "Meet the team", href: "/about#team" },
  paragraphs: [
    "Softcom was founded in Lagos in 2007. The founding conviction was clear: technology is a means, not an end — a tool to expand access and unlock opportunity for people and institutions. It began with ReloadNG, one of Nigeria's first online airtime recharge platforms, at a time when digital payments were unfamiliar to most Nigerians.",
    "Over the years that followed, we built products and infrastructure for inclusion: a mobile-first payment platform that turned phone numbers into bank accounts, field data systems for agricultural value chains, and consumer engagement infrastructure deployed by global FMCG brands at national scale. We powered the Federal Government's NPower programme — building a digital platform that reached 500,000 young Nigerians across all 36 states.",
    "Today Softcom operates as two focused divisions — Softcom Enterprise and Softcom Labs — serving clients across government, financial services, and international development in five countries.",
  ],
}

export type Milestone = {
  /** The ruler positions ticks by this year across the 2007–2025 span. */
  year: string
  /** Short label shown on the ruler / hover preview. */
  headline: string
  /** Full copy revealed when the milestone is selected. */
  description: string
}

export const milestones = {
  eyebrow: "Milestones",
  heading: "Our Journey",
  items: [
    {
      year: "2007",
      headline: "Founded in Lagos, launched ReloadNG",
      description:
        "Founded in Lagos. Launched ReloadNG — one of Nigeria's first online airtime recharge platforms, proving that digital payments had a place in Nigeria's mass market.",
    },
    {
      year: "2013",
      headline: "Pivoted to enterprise technology",
      description:
        "Pivoted to enterprise technology — building field data capture systems, digital operations platforms, and learning management systems for government and private sector clients.",
    },
    {
      year: "2017",
      headline: "Launched Eyowo",
      description:
        "Launched Eyowo — transforming any Nigerian mobile number into a functional bank account. The platform became the payment backbone for national government disbursement programmes.",
    },
    {
      year: "2019",
      headline: "Powered TraderMoni",
      description:
        "Powered the Bank of Industry's TraderMoni programme — disbursing digital micro-loans to 1.2 million traders across hundreds of open markets in Nigeria.",
    },
    {
      year: "2020",
      headline: "Built Nigeria's NPower platform",
      description:
        "Built and operated Nigeria's NPower digital platform for the Federal Government — recruiting, training, and paying 500,000 young Nigerians across all 36 states.",
    },
    {
      year: "2021",
      headline: "Split into Enterprise & Labs",
      description:
        "Restructured into two focused divisions: Softcom Enterprise (corporate and government digital transformation) and Softcom Labs (human-centred products in education, health, and financial inclusion).",
    },
    {
      year: "2025",
      headline: "AI-powered intelligence & delivery",
      description:
        "Serving clients across multiple industries, while operating at the forefront of AI-powered intelligence, digital infrastructure, and programme delivery.",
    },
  ] satisfies Milestone[],
}

export const principles = {
  eyebrow: "Principles",
  heading: "What we believe",
  items: [
    {
      num: "01",
      title: "Depth over speed",
      description:
        "We take time to understand problems fully before we engineer solutions. Lasting systems are not rushed.",
    },
    { num: "02", title: "African context, global standards", description: "" },
    { num: "03", title: "Radical ownership", description: "" },
    { num: "04", title: "Knowledge transfer", description: "" },
    { num: "05", title: "Long-termism", description: "" },
  ],
}

/** Teasers at the foot of the About page, each linking to its own page. */
export const aboutLinks = [
  {
    eyebrow: "Leadership",
    title: "Meet the team steering Softcom's mission.",
    href: "/leadership",
  },
  {
    eyebrow: "Alumni",
    title: "Where Softcom people go on to build and lead.",
    href: "/alumni",
  },
]

export const leadershipHero = {
  eyebrow: "Leadership",
  title: "The people steering the mission.",
  lead: "A team of operators and builders with decades of combined experience across technology, finance, government, and enterprise transformation in Africa.",
}

export type Leader = { name: string; role: string }

export const leaders: Leader[] = [
  { name: "Abayomi Adedeji", role: "Founder" },
  { name: "Omoseindemi Olobayo", role: "Chief Executive Officer" },
  { name: "Adetoyosi Elegbede", role: "Chief Operating Officer" },
]

export const alumniHero = {
  eyebrow: "Alumni",
  title: "People who shaped Africa.",
  lead: "For 18+ years, Softcom has been a home for exceptional people. Many of them have gone on to lead some of Africa's most consequential technology companies, financial institutions, government agencies, and development organisations — carrying with them the discipline, ambition, and values they built here.",
}

export const alumniFamily = {
  eyebrow: "The Softcom Family",
  heading:
    "A team that has grown together, delivered together, and gone on to shape organisations and industries across Africa and beyond.",
  stats: [
    { value: "18+", label: "Years" },
    { value: "5", label: "Countries" },
    { value: "85%", label: "Nigeria Reach" },
  ],
}
