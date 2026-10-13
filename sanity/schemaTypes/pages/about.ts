import { CaseIcon, InfoOutlineIcon, UsersIcon } from "@sanity/icons"

import {
  aboutPage,
  alumniPage,
  careersPage,
} from "@/content/about/page-copy"
import type { PageDefinition } from "@/sanity/lib/page-schema"

/** About, Careers and Alumni page singletons (see sanity/schemaTypes/pages.ts). */
export const ABOUT_PAGES: PageDefinition[] = [
  {
    name: "aboutPage",
    title: "About",
    icon: InfoOutlineIcon,
    defaults: aboutPage,
    notes: {
      "hero.images":
        "The circles in the hero band, left to right (seven fit the row). Leave empty to keep the current photos.",
      "journey.items":
        "Each milestone sits on the ruler by its year; a range such as 2010–2015 sits at its first year.",
      "values.items":
        "What guides our work, in order; each is numbered on the page.",
      "news.items": "Slug is the insight the row links to (/insights/<slug>).",
    },
  },
  {
    name: "careersPage",
    title: "Careers",
    icon: CaseIcon,
    defaults: careersPage,
    notes: {
      "roles.empty":
        "Shown when there are no active Open Roles (Careers in the Studio).",
    },
  },
  {
    name: "alumniPage",
    title: "Alumni",
    icon: UsersIcon,
    defaults: alumniPage,
  },
]
