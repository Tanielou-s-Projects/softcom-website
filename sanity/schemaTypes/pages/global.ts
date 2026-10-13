import { MenuIcon } from "@sanity/icons"

import { navigation } from "@/components/site/chrome-copy"
import type { PageDefinition } from "@/sanity/lib/page-schema"

/** Global page singletons (see sanity/schemaTypes/pages.ts). */
export const GLOBAL_PAGES: PageDefinition[] = [
  {
    name: "navigation",
    title: "Navigation & footer",
    icon: MenuIcon,
    defaults: navigation,
    notes: {
      "header.items":
        "The menu in the header pill. Add links to an item to give it a dropdown.",
      "header.menuLabel":
        "The word shown once when the pill first hints it opens.",
      "footer.columns":
        "Footer menu columns. The Products column always lists Softcom’s own products from Products, whatever links are set here.",
      "footer.legal":
        "Links in the footer’s bottom bar. A link with no address is hidden.",
      "footer.copyright": "Follows “© <year>”.",
      "closingCtas.image":
        "The photograph behind every closing call to action.",
      "closingCtas.home": "Closes the home, About, Careers and Alumni pages.",
      "closingCtas.products": "Closes Enterprise Products.",
      "closingCtas.careers": "Closes Insights and Case Studies.",
    },
  },
]
