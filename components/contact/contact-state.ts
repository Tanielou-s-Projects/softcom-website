/**
 * The contact action's state shape.
 *
 * Split out of `submit-contact.ts` because a `"use server"` module may only
 * export async functions — exporting the initial state object from there throws
 * at module load, taking the whole page with it.
 */

export type ContactField = "name" | "email" | "company" | "message"

export type ContactState = {
  status: "idle" | "success" | "error"
  /** Keyed by field name; rendered under the offending input. */
  errors?: Partial<Record<ContactField, string>>
  /** Form-level message, shown above the fields. */
  message?: string
  /** Echoed back so a failed submit does not empty the form. */
  values?: Partial<Record<ContactField, string>>
}

export const initialContactState: ContactState = { status: "idle" }
