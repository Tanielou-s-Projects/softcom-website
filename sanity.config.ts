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
    // Site settings is a singleton: no "new document" for it anywhere.
    templates: (templates) =>
      templates.filter(({ schemaType }) => schemaType !== "siteSettings"),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === "siteSettings"
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
