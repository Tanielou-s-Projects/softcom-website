/**
 * Sanity Studio configuration — mounted in the Next.js app at `/studio`.
 * The Studio route lives at `app/studio/[[...tool]]/page.tsx`.
 */
import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"

import { apiVersion, dataset, projectId } from "@/sanity/env"
import { schema } from "@/sanity/schemaTypes"
import { SINGLETONS } from "@/sanity/schemaTypes/pages"
import { structure } from "@/sanity/structure"
import { SoftcomIcon, theme } from "@/sanity/theme"

export default defineConfig({
  basePath: "/studio",
  title: "Softcom",
  icon: SoftcomIcon,
  theme,
  projectId,
  dataset,
  schema: {
    ...schema,
    // Pages and site settings are singletons: no "new document" for them.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action)
          )
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    // Vision lets you query your content with GROQ from inside the Studio.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
