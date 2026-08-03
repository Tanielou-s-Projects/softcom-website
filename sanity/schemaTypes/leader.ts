import { UserIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

/**
 * Leadership — team members shown on the Who We Are / Leadership section.
 * Use `order` for manual sort control.
 */
export const leader = defineType({
  name: "leader",
  title: "Leader",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Short bio",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "linkedIn",
      title: "LinkedIn URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Manual sort order (lower numbers appear first).",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "photo",
    },
  },
})
