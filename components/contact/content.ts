/**
 * Contact details, transcribed from Figma `Contact` (node 210:185).
 *
 * Separated from the markup for the same reason as the other pages' copy — and
 * because an address is the thing most likely to be edited by someone who is
 * not editing components. No phone number is published: the client asked for
 * email only, and collects visitors' numbers through the form instead.
 */

export const contactDetails = {
  organisation: "Softcom Limited",
  address: ["15B, Sasegbon Street", "GRA, Ikeja, Lagos", "Nigeria"],
  email: "contact@softcom.xyz",
}

export const contactIntro =
  "Whether you have a specific project in mind or just want to explore how Softcom can help, we are always open to a conversation."

/**
 * Every line of copy on the Contact page, as Sanity's `contactPage`
 * singleton mirrors it. Edited in the Studio; these are the defaults any
 * field left empty falls back to.
 */
export const contactPage = {
  hero: {
    badge: "Contact",
    title: "Let’s talk.",
    intro: contactIntro,
  },
  form: {
    heading: "Send us a Message",
    nameLabel: "Name",
    namePlaceholder: "Full Name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    phoneLabel: "Phone",
    phonePlaceholder: "+234 800 000 0000",
    companyLabel: "Company",
    companyPlaceholder: "Organisation Name",
    messageLabel: "Message",
    messagePlaceholder: "Your message…",
    submit: "Send Message",
  },
  details: {
    heading: "Get In Touch",
  },
}

export type ContactPage = typeof contactPage
