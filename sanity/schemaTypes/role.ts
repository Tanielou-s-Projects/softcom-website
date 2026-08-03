import { CaseIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

/**
 * Careers — open roles. Toggle `active` off to hide closed roles
 * without deleting them.
 */
export const role = defineType({
  name: "role",
  title: "Open Role",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Role title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "active",
      title: "Active",
      description: "Uncheck to hide a closed role without deleting it.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "type",
      title: "Employment type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Contract", value: "contract" },
          { title: "Internship", value: "internship" },
        ],
        layout: "radio",
      },
      initialValue: "full-time",
    }),
    defineField({
      name: "applyLink",
      title: "Apply link",
      description: "External application URL. Use this or the apply email.",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "applyEmail",
      title: "Apply email",
      description: "Email address for applications, if there's no apply link.",
      type: "string",
      validation: (rule) =>
        rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
          name: "email",
          invert: false,
        }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "title",
      department: "department",
      location: "location",
      active: "active",
    },
    prepare({ title, department, location, active }) {
      const parts = [department, location].filter(Boolean).join(" · ")
      return {
        title,
        subtitle: `${active ? "" : "✕ Closed · "}${parts}`,
      }
    },
  },
})
