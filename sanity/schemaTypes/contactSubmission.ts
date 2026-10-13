import { EnvelopeIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

/**
 * A message sent through the Contact form. Written by the site only (the
 * form's server action); editors read them in the Studio's Inbox and track
 * them with `status`. The same message is emailed to the address in Site
 * settings.
 */
export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact message",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Read", value: "read" },
          { title: "Replied", value: "replied" },
          { title: "Spam", value: "spam" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "new",
    }),
    defineField({ name: "name", type: "string", readOnly: true }),
    defineField({ name: "email", type: "string", readOnly: true }),
    defineField({ name: "phone", type: "string", readOnly: true }),
    defineField({ name: "company", type: "string", readOnly: true }),
    defineField({ name: "message", type: "text", rows: 8, readOnly: true }),
    defineField({
      name: "submittedAt",
      title: "Sent",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "emailed",
      title: "Email notification sent",
      type: "boolean",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      company: "company",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare: ({ name, company, status, submittedAt }) => ({
      title: `${status === "new" ? "● " : ""}${name ?? "Unknown"}`,
      subtitle: [
        company,
        submittedAt ? new Date(submittedAt).toLocaleDateString("en-GB") : "",
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
})
