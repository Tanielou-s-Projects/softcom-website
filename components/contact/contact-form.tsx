"use client"

import * as React from "react"

import { sendContact, type ContactState } from "@/app/contact/actions"
import { Arrow } from "@/components/ui/arrow"
import type { ContactPage } from "@/content/contact/content"
import { cn } from "@/lib/utils"

type FieldName = "name" | "email" | "message"

/** The action's own email check, so the form can answer before it sends. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/*
 * Fields drawn as ruled lines rather than boxes: a mono label above, the
 * input on a hairline that turns ink on focus. An invalid field turns its
 * rule red and carries its message under it, tied to the input with
 * `aria-describedby`.
 */
const input =
  "mt-3 block w-full border-0 border-b border-line-strong bg-transparent px-0 pb-3 text-lg text-ink transition-colors placeholder:text-ink-faint focus:border-ink focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-danger"

function Field({
  id,
  label,
  optional,
  error,
  className,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label flex justify-between text-ink-soft">
        {label}
        {optional && <span className="text-ink-faint">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

/*
 * The message form, on the existing `sendContact` action. Required fields are
 * checked here first with the same rules the action applies, so an empty or
 * malformed send is answered in place without a round trip; anything the
 * action still turns away comes back through the same messages.
 */
export function ContactForm({ copy }: { copy: ContactPage["form"] }) {
  const [state, action, pending] = React.useActionState<ContactState, FormData>(
    sendContact,
    { status: "idle" }
  )
  const [invalid, setInvalid] = React.useState<FieldName | null>(null)
  const form = React.useRef<HTMLFormElement>(null)

  // When the form was first shown: the action uses it to turn away bots that
  // submit instantly. Set after hydration so server and client agree.
  const startedAt = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now())
  }, [])

  // A client-side miss wins; otherwise whatever the action reported.
  const failed: FieldName | undefined =
    invalid ?? (state.status === "error" ? state.field : undefined)
  const messages: Record<FieldName, string> = {
    name: copy.nameError,
    email: copy.emailError,
    message: copy.messageError,
  }
  const errorFor = (field: FieldName) =>
    failed === field ? messages[field] : undefined

  function check(event: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) ?? "").trim()
    const miss: FieldName | null = !value("name")
      ? "name"
      : !EMAIL.test(value("email"))
        ? "email"
        : !value("message")
          ? "message"
          : null
    setInvalid(miss)
    if (miss) {
      event.preventDefault()
      form.current
        ?.querySelector<HTMLElement>(`[name="${miss}"]`)
        ?.focus({ preventScroll: false })
    }
  }

  if (state.status === "success") {
    return (
      <div role="status" className="border-t border-ink pt-8">
        <span aria-hidden="true" className="block size-3 bg-accent" />
        <h2 className="mt-8 text-headline font-light">{copy.successHeading}</h2>
        <p className="mt-6 max-w-md text-lg text-ink-soft">
          {copy.successText}
        </p>
      </div>
    )
  }

  const describe = (field: FieldName) =>
    failed === field ? `contact-${field}-error` : undefined

  return (
    <form
      ref={form}
      action={action}
      onSubmit={check}
      noValidate
      className="relative"
    >
      {/* Bot traps: a field people never see, and when the form appeared. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] size-px opacity-0"
      />
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="0" />

      <h2 className="label border-t border-ink pt-5 text-ink">
        {copy.heading}
      </h2>

      <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2">
        <Field
          id="contact-name"
          label={copy.nameLabel}
          error={errorFor("name")}
        >
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={failed === "name" || undefined}
            aria-describedby={describe("name")}
            placeholder={copy.namePlaceholder}
            className={input}
          />
        </Field>
        <Field
          id="contact-email"
          label={copy.emailLabel}
          error={errorFor("email")}
        >
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={failed === "email" || undefined}
            aria-describedby={describe("email")}
            placeholder={copy.emailPlaceholder}
            className={input}
          />
        </Field>
        <Field id="contact-phone" label={copy.phoneLabel} optional>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={copy.phonePlaceholder}
            className={input}
          />
        </Field>
        <Field id="contact-company" label={copy.companyLabel} optional>
          <input
            id="contact-company"
            name="company"
            autoComplete="organization"
            placeholder={copy.companyPlaceholder}
            className={input}
          />
        </Field>
        <Field
          id="contact-message"
          label={copy.messageLabel}
          error={errorFor("message")}
          className="sm:col-span-2"
        >
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            aria-invalid={failed === "message" || undefined}
            aria-describedby={describe("message")}
            placeholder={copy.messagePlaceholder}
            className={cn(input, "resize-y leading-relaxed")}
          />
        </Field>
      </div>

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-12 cursor-pointer items-center gap-3 self-start rounded-full bg-accent pr-5 pl-6 text-[0.9375rem] font-medium tracking-[-0.01em] whitespace-nowrap text-on-accent transition-colors duration-200 hover:bg-accent-deep disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? copy.sending : copy.submit}
          <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
        {/* A send that failed outright, rather than on one field. */}
        <p
          role="alert"
          className={cn(
            "max-w-sm text-sm text-danger",
            !(state.status === "error" && !state.field && !invalid) && "sr-only"
          )}
        >
          {state.status === "error" && !state.field && !invalid
            ? copy.errorText
            : failed
              ? messages[failed]
              : ""}
        </p>
      </div>
    </form>
  )
}
