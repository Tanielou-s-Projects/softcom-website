"use server"

import { contactDetails } from "@/components/contact/content"
import type { ContactState } from "@/components/contact/contact-state"

/** Deliberately loose. Anything stricter rejects real addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LIMITS = { name: 100, email: 254, company: 200, message: 5000 }

function validate(values: Record<string, string>) {
  const errors: ContactState["errors"] = {}

  if (!values.name) errors.name = "Please tell us your name."
  else if (values.name.length > LIMITS.name)
    errors.name = "That name is too long."

  if (!values.email) errors.email = "We need an email address to reply to."
  else if (!EMAIL.test(values.email))
    errors.email = "That does not look like an email address."
  else if (values.email.length > LIMITS.email)
    errors.email = "That email address is too long."

  if (values.company.length > LIMITS.company)
    errors.company = "That organisation name is too long."

  if (!values.message) errors.message = "Please tell us what you need."
  else if (values.message.length > LIMITS.message)
    errors.message = "Please keep this under 5,000 characters."

  return errors
}

/**
 * Handles a contact submission.
 *
 * Delivery is a webhook rather than a bundled email provider: `CONTACT_WEBHOOK_URL`
 * takes whatever the team already runs — a Slack incoming webhook, Zapier, an
 * internal endpoint — so nothing here has to pick a vendor or hold a secret
 * beyond that one URL.
 *
 * With the variable unset the action fails loudly rather than pretending to
 * succeed, and tells the sender where to email instead. A form that silently
 * swallows a message is worse than one that admits it is not wired up.
 */
export async function submitContact(
  _previous: ContactState,
  formData: FormData
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  }

  // Honeypot: a field hidden from people but not from most bots.
  if (String(formData.get("website") ?? "")) {
    return { status: "success" }
  }

  const errors = validate(values)
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values }
  }

  const endpoint = process.env.CONTACT_WEBHOOK_URL

  if (!endpoint) {
    console.error(
      "[contact] CONTACT_WEBHOOK_URL is not set — the submission was not delivered."
    )
    return {
      status: "error",
      values,
      message: `We could not send that just now. Please email us at ${contactDetails.email} and we will pick it up.`,
    }
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...values,
        source: "softcom.xyz/contact",
        receivedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`webhook responded ${response.status}`)
    }
  } catch (error) {
    console.error("[contact] delivery failed:", error)
    return {
      status: "error",
      values,
      message: `Something went wrong sending that. Please email us at ${contactDetails.email}.`,
    }
  }

  return { status: "success" }
}
