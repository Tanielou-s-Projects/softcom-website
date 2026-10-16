/**
 * Every line of copy and every section image on the home page, as Sanity's
 * `homePage` singleton mirrors it (see sanity/lib/page-schema.ts). Edited in
 * the Studio; these are the defaults any field left empty falls back to.
 *
 * Copy only: design values (sector tones, the focus-area chip colours, anchor
 * ids) stay in code and are matched to items by position.
 *
 * `{years}` in any text is replaced with Softcom's years of operation, which
 * is computed from the founding year so it never goes stale.
 */
import {
  capabilities,
  partners,
  perspectives,
  sectors,
  stats,
  YEARS_ACTIVE,
} from "@/content/home/content"

export const homePage = {
  hero: {
    headlineFirstLine: "Technology for",
    headlineSecondLine: "Organisations.",
    progressFirstLine: "Progress",
    progressSecondLine: "for Society.",
    progressImage: "/images/market-payment.jpg",
    progressImageAlt:
      "A market trader at her stall confirming a payment on her phone",
    portalImage: "/images/pos-agent.jpg",
    portalImageAlt:
      "A mobile-money agent handing cash to a customer under a blue umbrella",
    scrollLabel: "Scroll",
    statementBefore: "Softcom is a technology and innovation company with ",
    statementHighlight: "{years} years",
    statementAfter:
      " of experience building for public institutions, private organisations and development enablers. We help organisations think through what they want to achieve, then bring together the technology, people and processes to make it happen.",
    primaryCta: { label: "Explore our solutions", href: "/solutions" },
    secondaryCta: { label: "Start a conversation", href: "/contact" },
    /** The mission as the dissolve hero carries it, after the blue drains. */
    missionHeading: "Stronger organisations build a more prosperous society.",
    missionText:
      "We build the technology and capabilities that help them work better, decide better and serve the people who depend on them.",
    missionImage: "/images/lagos-dusk.jpg",
    missionImageAlt: "Lagos at dusk across the lagoon, a fisherman in a canoe",
    missionCta: { label: "Our story", href: "/about" },
  },
  mission: {
    heading: "We exist to create lasting impact.",
    intro:
      "We believe stronger organisations are the foundation of a more prosperous society.",
    image: "/images/lagos-dusk.jpg",
    imageAlt: "Lagos at dusk across the lagoon, a fisherman in a canoe",
    body: "We build technology and capabilities that strengthen those organisations, helping them operate better, make informed decisions and create possibilities for the people who depend on them.",
    cta: { label: "Our story", href: "/about" },
  },
  focusAreas: {
    heading: "Our focus areas",
    intro:
      "Our work focuses on building the foundations organisations depend on, the intelligence that informs their decisions, and the capabilities that power their initiatives.",
    linkPrefix: "Explore",
    areas: capabilities.map(({ title, description, image }) => ({
      title,
      paragraphs: description,
      image,
    })),
  },
  whoWeWorkWith: {
    heading: "Who we work with",
    intro:
      "Different organisations have different ambitions. Some have a precise requirement, others have a challenge to work through or a possibility to explore.",
    sectors: sectors.map(({ title, description, tags, silhouette }) => ({
      title,
      description,
      tags,
      silhouette,
    })),
  },
  partners: {
    label: "Organisations we have worked with",
    logos: partners.map(({ name, logo, width, height }) => ({
      name,
      logo,
      width,
      height,
    })),
  },
  numbers: {
    items: stats.map(({ value, label }) => ({
      value: value === String(YEARS_ACTIVE) ? "{years}" : value,
      label,
    })),
    primaryCta: { label: "Explore working with Softcom", href: "/contact" },
    secondaryCta: { label: "View case studies", href: "/case-studies" },
  },
  approach: {
    heading: "Technology to make it happen. Expertise to make it work.",
    lead: "Our engineers consider the organisation’s existing systems, operating conditions and future requirements. These inform what to build, what to integrate and how the different parts should work together.",
    body: "Putting technology to work requires clear responsibilities, prepared teams and processes that support its use. Depending on the engagement, our involvement can extend to change management, ongoing operations and impact assessment.",
    cta: { label: "Discuss what you want to achieve", href: "/contact" },
  },
  ourThinking: {
    heading: "Our thinking",
    intro:
      "Perspectives on technology, organisations and the decisions that shape what comes next.",
    cta: { label: "Explore our thinking", href: "/insights" },
    readLabel: "Read perspective",
    perspectives: perspectives.map(({ title, summary, href }) => ({
      title,
      summary,
      href,
    })),
  },
}

export type HomePage = typeof homePage

/** `{years}` → Softcom's years of operation. */
export const withYears = (text: string) =>
  text.replaceAll("{years}", String(YEARS_ACTIVE))
