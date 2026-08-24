"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  bodyText,
  panelHeadingText,
  primaryPill,
} from "@/components/landing/section"
import { initialContactState } from "@/components/contact/contact-state"
import { submitContact } from "@/components/contact/submit-contact"

/** The design's 48px pill fields, on the project's own field styling. */
const field = "h-12 rounded-full px-4"

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** Split out so `useFormStatus` can read the pending state of its parent form. */
function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="lg"
      disabled={pending}
      className={cn(primaryPill, "self-start")}
    >
      {pending ? "Sending…" : "Send Message"}
    </Button>
  )
}

function ContactForm() {
  const [state, formAction] = React.useActionState(
    submitContact,
    initialContactState
  )

  const errors = state.errors ?? {}
  const values = state.values ?? {}

  /* `invalid` wires the field to its message for assistive tech. */
  const invalid = (key: keyof typeof errors, id: string) =>
    errors[key]
      ? { "aria-invalid": true, "aria-describedby": `${id}-error` }
      : {}

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-start gap-6 overflow-clip rounded-3xl bg-background p-8 lg:p-[47px]">
        <CheckCircleIcon
          aria-hidden
          weight="fill"
          className="size-10 text-brand-cyan"
        />
        <h2 className={cn(panelHeadingText, "text-foreground")}>
          Thanks — that&apos;s with us.
        </h2>
        <p className={cn(bodyText, "max-w-[420px] text-muted-foreground")}>
          We read everything that comes through here and will get back to you
          shortly.
        </p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-8 overflow-clip rounded-3xl bg-background p-8 lg:p-[47px]"
    >
      <h2 className={cn(panelHeadingText, "max-w-[179px] text-foreground")}>
        Send us a Message
      </h2>

      {state.message ? (
        <p
          role="alert"
          className="flex items-start gap-2 text-sm leading-[1.6] text-destructive"
        >
          <WarningCircleIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <div className="flex flex-col gap-8 sm:flex-row">
        <Field id="contact-name" label="Name" error={errors.name}>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            defaultValue={values.name}
            placeholder="Full Name"
            className={field}
            {...invalid("name", "contact-name")}
          />
        </Field>

        <Field id="contact-email" label="Email" error={errors.email}>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            placeholder="your@email.com"
            className={field}
            {...invalid("email", "contact-email")}
          />
        </Field>
      </div>

      <Field id="contact-company" label="Company" error={errors.company}>
        <Input
          id="contact-company"
          name="company"
          autoComplete="organization"
          defaultValue={values.company}
          placeholder="Organisation Name"
          className={field}
          {...invalid("company", "contact-company")}
        />
      </Field>

      <Field id="contact-message" label="Message" error={errors.message}>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          defaultValue={values.message}
          placeholder="Your message…"
          className="h-[100px] rounded-2xl px-4 py-3"
          {...invalid("message", "contact-message")}
        />
      </Field>

      {/*
       * Honeypot. Hidden from people and from screen readers, but most bots
       * fill every field they find — a filled `website` is discarded server
       * side. `tabIndex={-1}` keeps it out of the keyboard order.
       */}
      <div aria-hidden className="hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/*
       * Added: the design draws the four fields and no submit control, which
       * would leave the form unusable.
       */}
      <SubmitButton />
    </form>
  )
}

export { ContactForm }
