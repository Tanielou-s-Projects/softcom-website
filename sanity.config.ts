/**
 * Sanity Studio configuration — mounted in the Next.js app at `/studio`.
 * The Studio route lives at `app/studio/[[...tool]]/page.tsx`.
 */
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"

import { apiVersion, dataset, projectId } from "@/sanity/env"
import { schema } from "@/sanity/schemaTypes"
import { structure } from "@/sanity/structure"

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision lets you query your content with GROQ from inside the Studio.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
