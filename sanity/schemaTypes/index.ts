import type { SchemaTypeDefinition } from "sanity"

import { alumnus } from "./alumnus"
import { blockContent } from "./blockContent"
import { caseStudy } from "./caseStudy"
import { contactSubmission } from "./contactSubmission"
import { insight } from "./insight"
import { leader } from "./leader"
import { PAGES } from "./pages"
import { product, productFigure, productSection } from "./product"
import { role } from "./role"
import { siteSettings } from "./siteSettings"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    insight,
    caseStudy,
    role,
    leader,
    alumnus,
    product,
    siteSettings,
    contactSubmission,
    ...PAGES,
    // Objects
    blockContent,
    productFigure,
    productSection,
  ],
}
