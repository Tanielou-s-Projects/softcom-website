import { footerLegal, footerNav, headerNav } from "@/content/home/content"

/**
 * The site's chrome as Sanity's `navigation` singleton mirrors it: the
 * header menu, the footer, and the closing call-to-action panels every page
 * ends on. Edited in the Studio under Pages; these are the defaults any
 * field left empty falls back to.
 *
 * Every header item carries `links`: empty for a plain link, filled for one
 * that opens a dropdown (the Studio form takes its shape from the first item).
 */
export const navigation = {
  header: {
    menuLabel: "Menu",
    items: headerNav.map((item) => ({
      label: item.label,
      href: item.href,
      links: item.submenu ?? [],
    })),
  },
  footer: {
    contactLabel: "Get in touch",
    columns: footerNav.map((group) => ({
      heading: group.heading,
      links: group.links,
    })),
    copyright: "Softcom Limited. All rights reserved.",
    legal: footerLegal.map((link) => ({
      label: link.label,
      href: link.href ?? "",
    })),
  },
  closingCtas: {
    image: "/images/market-aerial-2026.jpg",
    home: {
      heading: "Proud partner of potential.",
      lead: "What can we achieve together?",
      buttonLabel: "Start a conversation",
      buttonHref: "/contact",
    },
    products: {
      heading: "Find the technology that fits your work.",
      lead: "Tell us what you need to achieve. We’ll help you identify the relevant products, platforms and implementation support.",
      buttonLabel: "Start a conversation",
      buttonHref: "/contact",
    },
    careers: {
      heading: "Build with us.",
      lead: "Bring original thinking, an innovator’s mindset and a strong sense of ownership. Work alongside exceptional peers whose expertise complements yours and expands what you can achieve.",
      buttonLabel: "Explore careers at Softcom",
      buttonHref: "/careers",
    },
  },
}

export type Navigation = typeof navigation
export type HeaderCopy = Navigation["header"]
