/**
 * About page copy.
 *
 * DRAFT — unlike every other page on this site, this one has no Figma source:
 * artboard 215:20 ("About") is an empty frame, and no copy was supplied. Every
 * string here is written to match the voice of the pages that do have a source,
 * and every factual claim is one already published elsewhere in this repo:
 *
 *   - founded in Lagos in 2007            → components/landing/mission.tsx
 *   - 20M+ / 100+ / 30+                   → components/landing/content.ts
 *   - Abayomi Adedeji, Founder            → components/landing/content.ts
 *   - the four principles                 → the Insights article's own argument
 *
 * Nothing here invents a date, a name, or a number. Treat the prose as a
 * proposal for the client to edit, not as approved copy.
 */

export const aboutHero = {
  eyebrow: "About",
  title: "We build the systems institutions depend on.",
  lead: "Softcom is a Nigerian technology company. Since 2007 we have designed and delivered the platforms, data systems and national programmes that governments, banks and enterprises rely on — and stayed accountable for what they produce.",
}

export const story = {
  heading: "Stronger organisations build a stronger society.",
  paragraphs: [
    "Softcom was founded in Lagos in 2007. We began by building software for organisations that could not afford for it to fail — and that constraint has shaped everything since.",
    "Today we work with governments, financial institutions, development agencies and growth-stage enterprises across Nigeria and the wider continent, designing the platforms, data systems and programmes their most important commitments depend on.",
  ],
  image: {
    src: "/landing/story.png",
    alt: "A Softcom team member reviewing printed reports",
  },
}

/**
 * Drawn from the position the company already publishes in "Why Digital
 * Transformation Fails in African Enterprises" — so this section restates our
 * own argument rather than inventing a set of values.
 */
export const principles = [
  {
    step: "01",
    title: "Sequence over scope",
    description:
      "We start small and move deliberately. Trying to change everything at once is how programmes end up changing nothing.",
  },
  {
    step: "02",
    title: "Redesign, not re-tooling",
    description:
      "New software laid over an analogue process produces an expensive analogue process. We redesign the work the system is meant to serve.",
  },
  {
    step: "03",
    title: "Capability alongside delivery",
    description:
      "We build internal ownership while we build the platform, so our clients' teams can run it without us.",
  },
  {
    step: "04",
    title: "Accountable after go-live",
    description:
      "Success is faster service, lower cost and better decisions months later — not a launch date met.",
  },
]

export const aboutStats = [
  { value: "20M+", label: "People Reached" },
  { value: "100+", label: "Projects Delivered" },
  { value: "30+", label: "Enterprise Clients" },
]

export type Leader = {
  name: string
  role: string
  image: string
}

/**
 * Ships with the one person the design actually names. The rest of the
 * leadership team needs names, roles and portraits from the client — inventing
 * executives, or captioning the unnamed stock portraits in `/public/landing`
 * with made-up identities, would be worse than an obviously short list.
 */
export const leaders: Leader[] = [
  {
    name: "Abayomi Adedeji",
    role: "Founder",
    image: "/landing/team-01.png",
  },
]

export const leadership = {
  eyebrow: "Leadership",
  heading: "The people accountable for it.",
  lead: "Delivery at national scale is a leadership problem before it is a technical one. Our practice leads own outcomes, not workstreams.",
}

/** Alumni and Careers are the other two pages in this category. */
export const aboutLinks = [
  {
    href: "/alumni",
    eyebrow: "Alumni",
    title: "Where Softcom people go next.",
    description:
      "The network of people who built here and went on to lead, found and build elsewhere.",
  },
  {
    href: "/careers",
    eyebrow: "Careers",
    title: "Build things that matter.",
    description:
      "We hire people who want their work to hold up under real load, in front of real users.",
  },
]
