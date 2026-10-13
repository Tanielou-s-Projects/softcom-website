"use server"

import { client } from "@/sanity/lib/client"
import { writeClient } from "@/sanity/lib/write-client"

export type ContactState = {
  status: "idle" | "success" | "error"
  /** Which field failed, when the problem is the input. */
  field?: "name" | "email" | "message"
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** A person takes longer than this to fill the form in; a bot doesn't. */
const MIN_FILL_MS = 2500

const text = (data: FormData, key: string, max: number) =>
  String(data.get(key) ?? "")
    .trim()
    .slice(0, max)

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] as string
  )

/**
 * The Contact form: saves the message to Sanity (the Studio's Inbox) and
 * emails it to the address in Site settings, replying to the sender. It
 * counts as sent if either lands; it fails only if both do.
 */
export async function sendContact(
  _previous: ContactState,
  data: FormData
): Promise<ContactState> {
  // Honeypot and fill-time checks: bots fill hidden fields and submit at once.
  // They are told it worked, so they don't retry.
  const startedAt = Number(data.get("startedAt") ?? 0)
  if (text(data, "website", 200) || Date.now() - startedAt < MIN_FILL_MS)
    return { status: "success" }

  const message = {
    name: text(data, "name", 200),
    email: text(data, "email", 320),
    phone: text(data, "phone", 50),
    company: text(data, "company", 200),
    message: text(data, "message", 5000),
  }
  if (!message.name) return { status: "error", field: "name" }
  if (!EMAIL.test(message.email)) return { status: "error", field: "email" }
  if (!message.message) return { status: "error", field: "message" }

  const submittedAt = new Date().toISOString()
  const emailed = await email(message).catch((error) => {
    console.error("Contact form email failed", error)
    return false
  })

  const saved = await (async () => {
    const sanity = writeClient()
    if (!sanity) return false
    await sanity.create({
      _type: "contactSubmission",
      status: "new",
      ...message,
      submittedAt,
      emailed,
    })
    return true
  })().catch((error) => {
    console.error("Contact form save failed", error)
    return false
  })

  return saved || emailed ? { status: "success" } : { status: "error" }
}

/** Emails the message through Resend, if it is configured. */
async function email(message: {
  name: string
  email: string
  phone: string
  company: string
  message: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false

  const settings = await client
    .withConfig({ useCdn: false })
    .fetch<{
      email?: string
      notifyEmail?: string
    } | null>(`*[_id == "siteSettings"][0]{ email, notifyEmail }`)
  const to = settings?.notifyEmail || settings?.email
  if (!to) return false

  const rows: [string, string][] = [
    ["Name", message.name],
    ["Email", message.email],
    ["Phone", message.phone],
    ["Company", message.company],
  ]
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.CONTACT_FROM_EMAIL ??
        "Softcom website <onboarding@resend.dev>",
      to: [to],
      reply_to: message.email,
      subject: `New message from ${message.name}${message.company ? ` (${message.company})` : ""}`,
      text: [
        ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
        "",
        message.message,
      ].join("\n"),
      html: `<table>${rows
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:2px 12px 2px 0;color:#737373">${k}</td><td>${escape(v)}</td></tr>`
        )
        .join(
          ""
        )}</table><p style="white-space:pre-wrap">${escape(message.message)}</p>`,
    }),
  })
  if (!response.ok)
    throw new Error(`Resend ${response.status}: ${await response.text()}`)
  return true
}
