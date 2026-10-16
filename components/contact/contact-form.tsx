"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { panelHeadingText, primaryPill } from "@/components/landing/section"
import type { ContactPage } from "@/content/contact/content"
import { sendContact, type ContactState } from "@/app/(site)/contact/actions"

/** The design's 48px pill fields, on the project's own field styling. */
const field = "h-12 rounded-full px-4"

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function ContactForm({ copy }: { copy: ContactPage["form"] }) {
  const [state, action, pending] = React.useActionState<ContactState, FormData>(
    sendContact,
    { status: "idle" }
  )
  // When the form was first shown: the action uses it to turn away bots that
  // submit instantly. Set after hydration so server and client agree.
  const startedAt = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now())
  }, [])

  const fieldError =
    state.status === "error" && state.field
      ? {
          name: copy.nameError,
          email: copy.emailError,
          message: copy.messageError,
        }[state.field]
      : undefined

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col gap-4 overflow-clip rounded-3xl bg-background p-8 lg:p-[47px]"
      >
        <h2 className={cn(panelHeadingText, "text-foreground")}>
          {copy.successHeading}
        </h2>
        <p className="max-w-[48ch] text-base leading-[1.6] text-foreground/80">
          {copy.successText}
        </p>
      </div>
    )
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-8 overflow-clip rounded-3xl bg-background p-8 lg:p-[47px]"
    >
      {/* Bot traps: a field people never see, and when the form appeared. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] size-px opacity-0"
      />
      <input ref={startedAt} type="hidden" name="startedAt" defaultValue="0" />

      <h2 className={cn(panelHeadingText, "max-w-[179px] text-foreground")}>
        {copy.heading}
      </h2>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Field id="contact-name" label={copy.nameLabel}>
          <Input
            id="contact-name"
            name="name"
            aria-invalid={state.field === "name" || undefined}
            autoComplete="name"
            required
            placeholder={copy.namePlaceholder}
            className={field}
          />
        </Field>

        <Field id="contact-email" label={copy.emailLabel}>
          <Input
            id="contact-email"
            name="email"
            aria-invalid={state.field === "email" || undefined}
            type="email"
            autoComplete="email"
            required
            placeholder={copy.emailPlaceholder}
            className={field}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Field id="contact-phone" label={copy.phoneLabel}>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={copy.phonePlaceholder}
            className={field}
          />
        </Field>

        <Field id="contact-company" label={copy.companyLabel}>
          <Input
            id="contact-company"
            name="company"
            autoComplete="organization"
            placeholder={copy.companyPlaceholder}
            className={field}
          />
        </Field>
      </div>

      <Field id="contact-message" label={copy.messageLabel}>
        <Textarea
          id="contact-message"
          name="message"
          aria-invalid={state.field === "message" || undefined}
          required
          rows={4}
          placeholder={copy.messagePlaceholder}
          className="h-[100px] rounded-2xl px-4 py-3"
        />
      </Field>

      {/*
       * Added: the design draws the four fields and no submit control, which
       * would leave the form unusable.
       */}
      {state.status === "error" ? (
        <p role="alert" className="text-sm text-destructive">
          {fieldError ?? copy.errorText}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className={cn(primaryPill, "self-start")}
      >
        {pending ? copy.sending : copy.submit}
      </Button>
    </form>
  )
}

export { ContactForm }
