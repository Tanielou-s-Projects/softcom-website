import { UsersIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

/**
 * Alumni — former team members, with an optional rotating spotlight.
 */
export const alumnus = defineType({
  name: "alumnus",
  title: "Alumnus",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "currentRole",
      title: "Current role",
      type: "string",
    }),
    defineField({
      name: "currentOrganisation",
      title: "Current organisation",
      type: "string",
    }),
    defineField({
      name: "yearsAtSoftcom",
      title: "Years at Softcom",
      description: 'e.g. "2018–2022".',
      type: "string",
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
      name: "quote",
      title: "Spotlight quote",
      description: "Optional pull-quote for the rotating spotlight.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description: "Include in the rotating alumni spotlight.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      role: "currentRole",
      org: "currentOrganisation",
      featured: "featured",
      media: "photo",
    },
    prepare({ title, role, org, featured, media }) {
      const parts = [role, org].filter(Boolean).join(" @ ")
      return {
        title,
        subtitle: `${featured ? "★ Spotlight · " : ""}${parts}`,
        media,
      }
    },
  },
})
