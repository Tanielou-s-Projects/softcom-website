import { EnvelopeIcon } from "@sanity/icons"

import { contactPage } from "@/components/contact/content"
import { pageSingleton } from "@/sanity/lib/page-schema"

/*
 * One singleton per page: its copy, generated from the page's defaults in
 * code. The `name` is also the document's fixed `_id` and the cache tag the
 * publish webhook revalidates. Add a page here and it appears under Pages in
 * the Studio (and `scripts/seed-pages.ts` can create it).
 */
export const PAGE_DEFINITIONS = [
  {
    name: "contactPage",
    title: "Contact",
    icon: EnvelopeIcon,
    defaults: contactPage,
  },
]

export const PAGES = PAGE_DEFINITIONS.map((page) => pageSingleton(page))

/** Every singleton: pages plus site settings. */
export const SINGLETONS = new Set<string>([
  "siteSettings",
  ...PAGES.map((page) => page.name),
])
