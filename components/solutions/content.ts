/**
 * Solutions page copy, from the client's website copy deck (October 2026),
 * laid out on the structure of Figma `Solutions` (node 215:19).
 *
 * Held here for the same reason as the landing copy: the three solution areas
 * and the delivery phases are the obvious first Sanity document types, and
 * keeping them out of the components means that swap touches one file.
 */

export type SolutionFeature = {
  label: string
  description: string
}

/** A short inline list under its own subheading, with a line either side. */
export type SolutionList = {
  heading: string
  intro: string
  items: SolutionFeature[]
  outro: string
}

export type Solution = {
  id: string
  title: string
  /** The accented one-liner that sits above the body copy. */
  lead: string
  description: string[]
  list?: SolutionList
  /** Dotted rows; the dot alternates cyan then blue by position. */
  features: SolutionFeature[]
  cta?: { label: string; href: string }
  image: {
    src: string
    /** Intrinsic size of the export, for `next/image`. */
    width: number
    height: number
    /** CSS object-position, when the subject isn't central. */
    position?: string
  }
}

export const solutionsIntro = [
  "Softcom builds the systems people use to access services and transact, the intelligence organisations need to understand complex information, and the capabilities required to deliver large-scale initiatives.",
  "Whether you have a defined requirement, a challenge to work through or an opportunity to explore, we bring together the technology, people and processes needed to develop and deliver the answer.",
]

export const solutions: Solution[] = [
  {
    id: "digital-infrastructure",
    title: "Digital Infrastructure",
    lead: "We build the digital rails and connected systems that enable institutions to operate, people to access services and participants to transact at scale.",
    description: [],
    list: {
      heading: "Connecting the essential parts of an operation",
      intro:
        "An institution needs to know who it serves, what each participant can access, how activities move from one stage to the next, and when value should change hands. Our infrastructure connects those functions.",
      items: [
        {
          label: "Identity and access",
          description:
            "Register and verify people, organisations or assets, and establish their access to services.",
        },
        {
          label: "Records and operations",
          description:
            "Maintain a shared record of participants, cases and activities, so work moves between teams, systems and partner organisations without duplicate data entry or loss of information.",
        },
        {
          label: "Services and transactions",
          description:
            "Turn eligibility rules, approvals and completed activities into access, service delivery or payments.",
        },
      ],
      outro:
        "These capabilities can form the operating foundation of an entire institution or shared rails through which many organisations serve their users.",
    },
    features: [
      {
        label: "Built Here, For Here",
        description:
          "Where existing systems cannot support what an organisation needs to do, we design and build the infrastructure that can. We bring together our own technology, partner platforms and custom-built systems, shaped around the organisation’s requirements, the people who will use them and the conditions in which they must operate.",
      },
      {
        label: "Global Rails, Local Expertise",
        description:
          "Where world-class infrastructure already exists, we bring the expertise to put it to work locally. Working with our technology partners, we integrate platforms into institutions’ existing systems and adapt their implementation to local requirements, workflows and operating conditions.",
      },
    ],
    cta: {
      label: "Explore our enterprise products",
      href: "/enterprise-products",
    },
    image: {
      src: "/images/data-centre.jpg",
      width: 1152,
      height: 2048,
    },
  },
  {
    id: "applied-intelligence",
    title: "Applied Intelligence",
    lead: "We build intelligence systems around the questions organisations need to answer and the work they need to carry out.",
    description: [
      "Across documents, records and datasets, our technology makes it possible to examine information at a depth and scale that manual review cannot sustain. It helps people connect evidence, investigate activity, understand relationships and determine what requires action.",
    ],
    features: [
      {
        label: "Audit Intelligence",
        description:
          "Equip audit teams to examine evidence, test records, reconcile discrepancies and develop findings against the objectives of an audit. Across financial, operational and forensic audits, our systems connect the information and investigative capabilities needed to conduct the work thoroughly.",
      },
      {
        label: "Financial Intelligence",
        description:
          "Follow the money. Trace flows of funds, examine the relationships behind transactions and understand patterns of financial activity. Give organisations with financial oversight the capabilities to identify and investigate movements that require attention.",
      },
      {
        label: "Market Intelligence",
        description:
          "Understand consumer behaviour, competitive dynamics and emerging opportunities. Connect market signals and evidence to the decisions that shape how an organisation competes, serves its customers and grows.",
      },
      {
        label: "Regulatory Intelligence",
        description:
          "Give regulators the capabilities to examine the organisations and activities under their oversight. Bring paper records, digital submissions and information from third-party systems into a form that supports scrutiny, assessment and follow-up.",
      },
      {
        label: "Societal Intelligence",
        description:
          "Build a connected understanding of a society, state or jurisdiction: its people, institutions, resources and economic activity. Reveal local differences, opportunities and issues requiring attention to inform the work of governments, investors and development organisations.",
      },
      {
        label: "Shaped around the work",
        description:
          "Each system reflects the mandate of its users, the evidence they need and the decisions they must make. We bring together the relevant information sources, analytical capabilities and workflows, with access tailored to each user’s role and responsibilities.",
      },
    ],
    cta: {
      label: "Explore our enterprise products",
      href: "/enterprise-products",
    },
    image: {
      src: "/images/offshore-rig.jpg",
      width: 1152,
      height: 2048,
    },
  },
  {
    id: "powering-initiatives",
    title: "Powering Initiatives",
    lead: "Softcom brings its full capability to complex initiatives: research, design, technology, people and operational expertise.",
    description: [],
    features: [
      {
        label: "What you can entrust to us",
        description:
          "Initiative design, participant recruitment, technology deployment, field operations, training, payment coordination and results assessment. Our involvement follows the initiative\u2019s needs: we deliver directly, manage partners or combine both, with clear responsibility for execution and results.",
      },
    ],
    image: {
      src: "/images/graduates-training.jpg",
      width: 1152,
      height: 2048,
      position: "30% 85%",
    },
  },
]

export type DeliveryPhase = {
  /** Rendered as-is, so the leading zero is part of the copy. */
  step: string
  title: string
  description: string
}

export const deliveryPhases: DeliveryPhase[] = [
  {
    step: "01",
    title: "Discovery",
    description:
      "Understand the intended outcome, the people involved and the operating environment. Assess existing systems and establish what capabilities are needed.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Design the technology, workflows and delivery plan together. Define how participants will be reached and served, how information and payments will move, and who is responsible at each stage.",
  },
  {
    step: "03",
    title: "Deployment & Operations",
    description:
      "Deploy and connect the systems, prepare teams and run operations. Use shared information to coordinate partners and keep field activities, services and payments on schedule.",
  },
  {
    step: "04",
    title: "Impact & Scale",
    description:
      "Use delivery data and participant feedback to assess results and improve the approach. Determine what the technology and operations need to support greater reach.",
  },
]

export const deliveryClose = {
  text: "We stay accountable for what the initiative achieves, not only for what we build.",
  cta: { label: "Discuss an initiative", href: "/contact" },
}
