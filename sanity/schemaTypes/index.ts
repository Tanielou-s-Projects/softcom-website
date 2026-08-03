import type { SchemaTypeDefinition } from "sanity"

import { alumnus } from "./alumnus"
import { blockContent } from "./blockContent"
import { caseStudy } from "./caseStudy"
import { insight } from "./insight"
import { leader } from "./leader"
import { role } from "./role"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    insight,
    caseStudy,
    role,
    leader,
    alumnus,
    // Objects
    blockContent,
  ],
}
