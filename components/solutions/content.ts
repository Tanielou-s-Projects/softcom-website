/**
 * Solutions page copy, transcribed from Figma `Solutions` (node 215:19).
 *
 * Held here for the same reason as the landing copy: the three solution areas
 * and the delivery phases are the obvious first Sanity document types, and
 * keeping them out of the components means that swap touches one file.
 */

export type SolutionFeature = {
  label: string
  description: string
}

export type Solution = {
  id: string
  title: string
  /** The accented one-liner that sits above the body copy. */
  lead: string
  description: string
  /** Always two in the design, the first dotted cyan and the second blue. */
  features: [SolutionFeature, SolutionFeature]
  image: {
    src: string
    /** Intrinsic size of the export, for `next/image`. */
    width: number
    height: number
  }
}

export const solutions: Solution[] = [
  {
    id: "digital-infrastructure",
    title: "Digital Infrastructure",
    lead: "Africa's most important outcomes need infrastructure that doesn't exist yet. We build it.",
    description:
      "Digital infrastructure is the technology foundation that outcomes run on. Sometimes that means assembling something entirely new, combining platforms, systems, and data flows to carry a programme at scale. And where world-class infrastructure already exists globally, we are the partner that makes it land and work in local markets.",
    features: [
      {
        label: "Built Here, For Here",
        description:
          "We assemble the infrastructure when nothing sufficient exists — combining identity, payments, learning management, and data into integrated foundations that carry large-scale programmes from end to end.",
      },
      {
        label: "Global Rail, Local Context",
        description:
          "We bring world-class infrastructure into markets that need it — platforms representing the most advanced financial and operational systems in the world, implemented for local institutions, regulators, and workflows.",
      },
    ],
    image: {
      src: "/landing/solution-infrastructure.png",
      width: 780,
      height: 1488,
    },
  },
  {
    id: "intelligence",
    title: "Intelligence",
    lead: "Decisions are only as good as the understanding behind them.",
    description:
      "Intelligence is about equipping organisations to see what is actually happening — not just collecting data, but turning it into something that changes how a brand competes, how an agency fulfils its mandate, or how a partner understands the landscape they are about to enter.",
    features: [
      {
        label: "Market Intelligence",
        description:
          "We help organisations understand the markets they operate in — consumer behaviour, competitive dynamics, and emerging opportunity. Intelligence that changes how a brand competes and how commercial decisions are made.",
      },
      {
        label: "Mandate Intelligence",
        description:
          "We equip agencies and development partners with the data infrastructure and analytical capability to understand whether their interventions are working — and where to direct resources next.",
      },
    ],
    image: {
      src: "/landing/solution-intelligence.png",
      width: 784,
      height: 1512,
    },
  },
  {
    id: "programs",
    title: "Programs",
    lead: "Some outcomes are too complex for a tool or a report. They need someone to own the entire journey.",
    description:
      "Programs is where Softcom deploys its full capability. Not technology alone — but research, design, people, systems, and accountability, working together over the full arc of delivery. We don't hand over a product and step back. We stay until the outcome is real and scalable.",
    features: [
      {
        label: "Who This Is For",
        description:
          "Development partners funding systemic change. Government agencies running large mandated interventions. Organisations that need a trusted implementer — not a vendor — to carry a complex, multi-year outcome.",
      },
      {
        label: "What Makes It Different",
        description:
          "Most technology firms deliver tools. We deliver outcomes. Programs means we are accountable not for what we built, but for what changed — and we design everything from the start to be measurable and scalable.",
      },
    ],
    image: {
      src: "/landing/solution-programs.png",
      width: 784,
      height: 2442,
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
    title: "Research & Discovery",
    description: "We learn the problem deeply before designing anything.",
  },
  {
    step: "02",
    title: "Program Design",
    description:
      "We architect the intervention, people, systems, and process together.",
  },
  {
    step: "03",
    title: "Deployment",
    description:
      "We put the people and systems in place and run the programme.",
  },
  {
    step: "04",
    title: "Impact & Scale",
    description:
      "We track what changes, assess what works, and scale what does.",
  },
]
