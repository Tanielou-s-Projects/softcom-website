import { HomeIcon } from "@sanity/icons"

import { homePage } from "@/content/home/page-copy"
import type { PageDefinition } from "@/sanity/lib/page-schema"

/** Home page singletons (see sanity/schemaTypes/pages.ts). */
export const HOME_PAGES: PageDefinition[] = [
  {
    name: "homePage",
    title: "Home",
    icon: HomeIcon,
    defaults: homePage,
    notes: {
      "hero.statementHighlight":
        "Shown in the accent colour. {years} becomes Softcom's years of operation.",
      "numbers.items.value":
        "{years} becomes Softcom's years of operation, so it never goes stale.",
      "partners.logos.logo":
        "A one-colour logo on a transparent background (PNG or SVG); it is drawn in the site's text colour.",
      "partners.logos.width":
        "The logo file's width, with height: sets its proportions.",
      "whoWeWorkWith.sectors.title":
        "A line break splits the title over two lines.",
      "whoWeWorkWith.sectors.silhouette":
        "A solid shape on a transparent background; the card draws it in dots.",
    },
  },
]
