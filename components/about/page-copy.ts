/**
 * Every line of copy on the About, Careers and Alumni pages, as Sanity's
 * `aboutPage`, `careersPage` and `alumniPage` singletons mirror them. Edited
 * in the Studio; these are the defaults any field left empty falls back to.
 * Built from the deck copy in `content.ts` so there is one source of text.
 */
import {
  aboutHero,
  aboutHeroImages,
  alumniHero,
  careers,
  leadershipSection,
  milestones,
  news,
  principles,
  story,
} from "@/components/about/content"
import { values } from "@/components/landing/content"

export const aboutPage = {
  hero: {
    badge: aboutHero.eyebrow,
    title: aboutHero.title,
    lead: aboutHero.lead,
    /** The circles in the hero band, left to right. */
    images: aboutHeroImages,
  },
  story: {
    heading: story.heading,
    paragraphs: story.paragraphs,
  },
  journey: {
    heading: milestones.heading,
    items: milestones.items.map(({ year, headline, description }) => ({
      year,
      headline,
      description,
    })),
  },
  values: {
    heading: principles.heading,
    items: values.map(({ title, description }) => ({ title, description })),
  },
  leadership: {
    heading: leadershipSection.heading,
  },
  careers: {
    heading: "Build with us.",
    body: "Bring original thinking, an innovator’s mindset and a strong sense of ownership. Work alongside exceptional peers whose expertise complements yours and expands what you can achieve.",
    primaryLabel: "Explore careers at Softcom",
    primaryHref: "/careers",
    secondaryLabel: "Explore our alumni community",
    secondaryHref: "/alumni",
  },
  news: {
    label: "News",
    heading: news.heading,
    lead: news.lead,
    items: news.items.map(({ slug, category, date, title }) => ({
      title,
      category,
      date,
      slug,
    })),
    viewAllLabel: news.viewAll.label,
    viewAllHref: news.viewAll.href,
  },
}

export type AboutPage = typeof aboutPage

export const careersPage = {
  hero: {
    badge: careers.eyebrow,
    title: careers.title,
    lead: careers.paragraphs[0],
    ctaLabel: "See open roles",
    image: "/images/team-code-review.jpg",
  },
  intro: {
    paragraphs: careers.paragraphs.slice(1),
  },
  work: {
    heading: careers.work.heading,
    paragraphs: careers.work.paragraphs,
  },
  roles: {
    heading: careers.roles.heading,
    empty: careers.roles.empty,
    ctaLabel: careers.roles.cta.label,
    ctaHref: careers.roles.cta.href,
    applyLabel: "Apply",
  },
}

export type CareersPage = typeof careersPage

export const alumniPage = {
  hero: {
    badge: alumniHero.eyebrow,
    title: alumniHero.title,
    lead: alumniHero.paragraphs[0],
    ctaLabel: "Join the network",
    image: "/alumni/team.jpg",
    imageAlt:
      "The Softcom team gathered on a beach, waving and cheering at the camera",
  },
  intro: {
    paragraphs: alumniHero.paragraphs.slice(1),
  },
  form: {
    heading: "Join the alumni network",
    intro:
      "If you have worked at Softcom, you are welcome here. Share your details and tell us what you would like from the community.",
    nameLabel: "Full name",
    emailLabel: "Email address",
    yearsLabel: "When did you work at Softcom?",
    yearsHint: "Joining year and leaving year.",
    yearsPlaceholder: "e.g. 2016–2021",
    roleLabel: "Your team or role at Softcom",
    nowLabel: "What are you doing now?",
    hopesLabel: "What would you like this community to make possible?",
    optionalHint: "Optional.",
    consent:
      "I agree to receive communications about the Softcom Alumni Network.",
    submit: "Join the network",
  },
}

export type AlumniPage = typeof alumniPage
