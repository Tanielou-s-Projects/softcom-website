import { CogIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType } from "sanity"

/**
 * Site settings — one document (id `siteSettings`, pinned in the Studio's
 * structure). The contact details the footer and Contact page print, and the
 * social links in the footer's bottom bar.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "organisation",
      type: "string",
      initialValue: "Softcom Limited",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "email",
      description: "Shown in the footer and on Contact.",
      type: "string",
      validation: (r) =>
        r.required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: "email" }),
    }),
    defineField({
      name: "notifyEmail",
      title: "Form notifications",
      description:
        "Where Contact form messages are emailed. Leave empty to use the email above.",
      type: "string",
      validation: (r) =>
        r.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: "email" }),
    }),
    defineField({
      name: "address",
      description: "One entry per line.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (r) =>
                r.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
})
