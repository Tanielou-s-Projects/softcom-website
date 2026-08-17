/**
 * Alumni page copy.
 *
 * DRAFT — Figma artboard 215:21 ("Alumni") is an empty frame and no copy was
 * supplied. Written to match the voice of the pages that do have a source.
 *
 * Deliberately makes no countable claim: there is no "500+ alumni" or list of
 * companies here, because nobody has given us those figures and an alumni page
 * is exactly where an invented number would be noticed. See `spotlights`.
 */

export const alumniHero = {
  eyebrow: "Alumni",
  title: "Once Softcom, always Softcom.",
  lead: "People who build here go on to lead teams, found companies and run engineering elsewhere. The relationship does not end on the last day.",
}

export const alumniIntro =
  "Softcom has been a training ground for a generation of Nigerian technologists. This is where we keep track of where they went — and stay useful to them."

export const takeaways = {
  eyebrow: "The Softcom Years",
  heading: "What you take with you.",
  points: [
    {
      title: "The standard",
      description:
        "Systems that carry millions of people do not get to be nearly right. That bar travels with you.",
    },
    {
      title: "The range",
      description:
        "Government programmes, consumer platforms, agricultural value chains. Few places let one team touch that many kinds of problem.",
    },
    {
      title: "The network",
      description:
        "Softcom people are running engineering, product and delivery across the continent. That is a door that stays open.",
    },
  ],
}

export type Spotlight = {
  name: string
  /** The role held at Softcom. */
  then: string
  /** Where they are now. */
  now: string
  image: string
}

/**
 * Empty on purpose, and the section is skipped when it is.
 *
 * A spotlight needs a real person's name, portrait and career — none of which
 * we have. The two unnamed portraits in `/public/landing` came from Figma
 * without identities, so captioning them here would be inventing people. The
 * card and grid are built and typed, so this becomes a data-only change once
 * the client supplies the list.
 */
export const spotlights: Spotlight[] = []

export const spotlightSection = {
  eyebrow: "Spotlights",
  heading: "Where they are now.",
}

export const alumniInvite = {
  eyebrow: "Stay Connected",
  heading: "Did you build here?",
  body: "We are putting the alumni network back together — for introductions, for hiring, and for the occasional favour in both directions. Tell us where you landed.",
  action: { href: "/contact", label: "Get In Touch" },
}
