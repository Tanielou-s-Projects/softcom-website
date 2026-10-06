/**
 * About / Leadership / Alumni copy, from the client's website copy deck
 * (October 2026). Earlier copy came from the Softcom vision prototype; where
 * the two disagree on dates or figures, the deck is the client's latest word.
 */

import { TENURE_TITLE, YEARS_ACTIVE } from "@/components/landing/content"

export const aboutHero = {
  eyebrow: "About Softcom",
  title: `${TENURE_TITLE} of technology that matters.`,
  lead: `Softcom is a technology and innovation company with ${YEARS_ACTIVE} years of experience building digital products, enterprise systems and large-scale initiatives for public institutions, private organisations and development enablers.`,
}

export const story = {
  eyebrow: "Our Story",
  heading: "Built from a conviction about Africa’s potential.",
  cta: { label: "Meet the team", href: "/about#team" },
  paragraphs: [
    "Softcom was founded in 2007 with a mission to give many people a path to growth, achievement and fulfilment.",
    "When technology was largely associated with global giants, solving an everyday problem with software showed us what was possible. We took that same approach into enterprises: understand what they wanted to achieve and build the answers they needed.",
    "Today, our mission remains the same: to help organisations, our people and the communities we reach achieve more. Their progress gives purpose to ours.",
  ],
}

export type Milestone = {
  /** The ruler positions ticks by this year (a range sits at its start year). */
  year: string
  /** Short label shown on the ruler / hover preview. */
  headline: string
  /** Full copy revealed when the milestone is selected. */
  description: string
}

export const milestones = {
  eyebrow: "Milestones",
  heading: "Our journey",
  items: [
    {
      year: "2007",
      headline: "Pioneering electronic airtime purchases",
      description:
        "Founded in 2007, Softcom was among the pioneers of electronic airtime purchasing in Nigeria. ReloadNG enabled people to purchase airtime online, through a text message or with a missed call, introducing new ways to access an everyday service.",
    },
    {
      year: "2010–2015",
      headline: "Enterprise systems and industry value chains",
      description:
        "Softcom developed enterprise systems across FMCG (fast-moving consumer goods) and FSI (financial services industry). The work deepened the company’s understanding of industry value chains and how technology could support operations, distribution and service delivery.",
    },
    {
      year: "2015",
      headline: "Deepening our footprint in education",
      description:
        "The Future Ready University conference brought Softcom together with university leaders, opening relationships that led to technology engagements across the education sector.",
    },
    {
      year: "2016",
      headline: "A landmark in national development",
      description:
        "Working with the Bank of Industry (BOI), Softcom delivered technology supporting the recruitment, training, deployment, management and payment of more than 500,000 graduates. The work brought multiple stages of a national development initiative together, enabling delivery and coordination at scale.",
    },
    {
      year: "2017",
      headline: "Pioneering banking with a phone number",
      description:
        "Softcom developed Eyowo, pioneering a way for consumers to bank using their existing phone numbers. Removing the leading zero turned the remaining ten digits into an account number, making a familiar identifier the gateway to banking. The platform went on to reach more than 4.5 million users banking through their phone numbers.",
    },
    {
      year: "2018",
      headline: "A landmark in development finance",
      description:
        "Softcom’s technology enabled delivery of microloans to more than 1.2 million traders across Nigeria, most of whom were previously unbanked. It demonstrated how digital infrastructure could extend financial access to people operating beyond the reach of traditional banking.",
    },
    {
      year: "2021",
      headline: "Platforms enabling new services",
      description:
        "Softcom launched platforms enabling services across data, stateless payments, retail and banking, giving organisations digital foundations through which to serve their customers and users.",
    },
    {
      year: "2025",
      headline: "Web3, AI and machine learning",
      description:
        "Our work expanded into systems using Web3 technologies and intelligence solutions powered by artificial intelligence and machine learning, extending the company’s enterprise capabilities.",
    },
    {
      year: "2026",
      headline: "Nineteen years of technology and innovation",
      description:
        "Softcom’s work spans Digital Infrastructure, Applied Intelligence and Powering Initiatives, bringing proprietary technology, partner platforms and delivery expertise to the ambitions of public institutions, private organisations and development enablers.",
    },
  ] satisfies Milestone[],
}

export const principles = {
  eyebrow: "Principles",
  heading: "What guides our work",
}

export const leadershipSection = {
  heading: "Our leadership",
}

/**
 * "Latest news". The deck leaves the items as placeholders, so these are the
 * existing insight links until real news is supplied.
 */
export const news = {
  heading: "Latest news",
  lead: "Updates from across Softcom.",
  viewAll: { label: "View all news", href: "/insights" },
  items: [
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
      title: "Building a Data Culture: Lessons from Nigeria’s Financial Sector",
    },
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
  title: "You are part of the Softcom story.",
  paragraphs: [
    "Across teams, roles and generations, people have brought their knowledge, effort and ideas to Softcom. They helped build the company, and their contributions remain part of it.",
    "The Softcom Alumni Network invites you to reconnect with former colleagues and help shape a community that supports what comes next, for one another and for Softcom.",
    "Whether you joined at the beginning or more recently, whatever your role and wherever you are today, you are welcome.",
  ],
  cta: { label: "Explore our alumni community", href: "#join" },
}
