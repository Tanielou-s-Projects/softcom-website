import { EnvelopeIcon } from "@sanity/icons"

import { contactPage } from "@/content/contact/content"
import { pageSingleton, type PageDefinition } from "@/sanity/lib/page-schema"
import { ABOUT_PAGES } from "./pages/about"
import { GLOBAL_PAGES } from "./pages/global"
import { HOME_PAGES } from "./pages/home"
import { SOLUTIONS_PAGES } from "./pages/solutions"

/*
 * One singleton per page: its copy, generated from the page's defaults in
 * code. The `name` is also the document's fixed `_id` and the cache tag the
 * publish webhook revalidates. Add a page here and it appears under Pages in
 * the Studio (and `scripts/seed-pages.ts` can create it).
 */
export const PAGE_DEFINITIONS: PageDefinition[] = [
  ...GLOBAL_PAGES,
  ...HOME_PAGES,
  ...ABOUT_PAGES,
  ...SOLUTIONS_PAGES,
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
