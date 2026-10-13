import {
  deliveryClose,
  deliveryPhases,
  entrust,
  solutions,
  solutionsIntro,
} from "@/content/solutions/content"

/*
 * Every line of copy on the Solutions page, as Sanity's `solutionsPage`
 * singleton mirrors it. Edited in the Studio; these are the defaults any
 * field left empty falls back to. The figures stay in code.
 */

const [infrastructure, intelligence, initiatives] = solutions
const list = infrastructure.list!
const [built, global] = infrastructure.features
const shaped = intelligence.features[intelligence.features.length - 1]

export const solutionsPage = {
  meta: {
    description:
      "Digital Infrastructure, Applied Intelligence and Powering Initiatives: technology and expertise for your most important work.",
  },
  hero: {
    badge: "Solutions",
    title: "Technology and expertise for your most important work.",
  },
  intro: {
    badge: "Our Solutions",
    paragraphs: solutionsIntro,
  },
  infrastructure: {
    title: infrastructure.title,
    lead: infrastructure.lead,
    listHeading: list.heading,
    listIntro: list.intro,
    /** The pinned story's three steps, in the city figure's order. */
    steps: list.items.map(({ label, description }) => ({ label, description })),
    outro: list.outro,
    buildLabel: "Build",
    buildTitle: built.label,
    buildText: built.description,
    implementLabel: "Implement",
    implementTitle: global.label,
    implementText: global.description,
    ctaLabel: infrastructure.cta!.label,
    ctaHref: infrastructure.cta!.href,
  },
  intelligence: {
    title: intelligence.title,
    lead: intelligence.lead,
    railLabel: "Five kinds of intelligence →",
    railIntro: intelligence.description,
    /** The rail's cards, each over its drawing, in the drawings' order. */
    kinds: intelligence.features
      .slice(0, -1)
      .map(({ label, description }) => ({ label, description })),
    shapedHeading: shaped.label,
    shapedPoints: [
      "The mandate of its users",
      "The evidence they need",
      "The decisions they must make",
    ],
    shapedText: shaped.description.split(". ").slice(1).join(". "),
    ctaLabel: intelligence.cta!.label,
    ctaHref: intelligence.cta!.href,
  },
  initiatives: {
    title: initiatives.title,
    lead: initiatives.lead,
    entrustHeading: entrust.heading,
    entrustText: entrust.outro,
    entrustItems: entrust.items,
    phasesBadge: "Phases",
    phasesHeading: "How we deliver",
    phases: deliveryPhases.map(({ step, title, description }) => ({
      step,
      title,
      description,
    })),
    closeText: deliveryClose.text,
    closeCtaLabel: deliveryClose.cta.label,
    closeCtaHref: deliveryClose.cta.href,
  },
  close: {
    heading: "Not sure where to start?",
    text: "Most of our engagements begin with a conversation. Tell us what you’re trying to solve; we will tell you honestly whether we can help.",
    ctaLabel: "Start a conversation",
    ctaHref: "/contact",
  },
}

export type SolutionsPage = typeof solutionsPage
