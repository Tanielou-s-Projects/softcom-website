/**
 * Careers page copy.
 *
 * DRAFT — Figma artboard 215:25 ("Careers") is an empty frame and no copy was
 * supplied. Written to match the voice of the pages that do have a source.
 */

export const careersHero = {
  eyebrow: "Careers",
  title: "Build things that matter.",
  lead: "We hire people who want their work in front of real users, at real scale, with their name on the outcome — not on the ticket.",
}

export const careersIntro =
  "Softcom is a delivery company. The work is demanding, the systems are consequential, and the people who do well here would rather own an outcome than be handed a specification."

export const whySoftcom = {
  eyebrow: "Why Softcom",
  heading: "What the work gives you.",
  points: [
    {
      title: "Scale you can't simulate",
      description:
        "Platforms here serve millions of people. There are things only production at that size will teach you.",
    },
    {
      title: "Ownership, not tickets",
      description:
        "Teams own outcomes end to end — discovery, build, go-live, and the months afterwards when it has to hold.",
    },
    {
      title: "Range",
      description:
        "Government, financial services, FMCG, agriculture. The problems change; the standard does not.",
    },
  ],
}

export const hiringProcess = [
  {
    step: "01",
    title: "Conversation",
    description:
      "A call about what you have built, and what you want to build next.",
  },
  {
    step: "02",
    title: "Craft",
    description:
      "A practical exercise close to the real work. No brain teasers, no whiteboard algorithms.",
  },
  {
    step: "03",
    title: "Team",
    description:
      "You meet the people you would work with, and they answer your questions properly.",
  },
  {
    step: "04",
    title: "Decision",
    description:
      "We move quickly and tell you where you stand either way, with a reason.",
  },
]

export type Role = {
  id: string
  title: string
  team: string
  location: string
  /** "Full-time", "Contract", and so on. */
  type: string
}

/**
 * Empty because we have not been given a list of vacancies.
 *
 * Unlike the alumni spotlights, this section still renders when empty: "no open
 * roles" is a normal, credible state for a careers page, and the speculative
 * application is the useful action. Inventing job adverts would be worse than
 * any of the other placeholder copy on this page — a fake vacancy wastes a real
 * person's afternoon.
 */
export const roles: Role[] = []

export const openRoles = {
  eyebrow: "Open Roles",
  heading: "Where we are hiring.",
  empty:
    "We are not recruiting for named roles at the moment. We do keep talking to engineers, designers and delivery leads year-round — if the work here sounds like yours, introduce yourself.",
  emptyAction: { href: "/contact", label: "Introduce Yourself" },
}
