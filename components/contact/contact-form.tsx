"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { panelHeadingText, primaryPill } from "@/components/landing/section"
import type { ContactPage } from "@/components/contact/content"

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
  /*
   * TODO: no endpoint yet. Submission is intercepted so the browser can't fall
   * back to a GET against this URL, which would put the message body in the
   * query string. Replace with a server action once the destination is decided.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-8 overflow-clip rounded-3xl bg-background p-8 lg:p-[47px]"
    >
      <h2 className={cn(panelHeadingText, "max-w-[179px] text-foreground")}>
        {copy.heading}
      </h2>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Field id="contact-name" label={copy.nameLabel}>
          <Input
            id="contact-name"
            name="name"
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
      <Button type="submit" size="lg" className={cn(primaryPill, "self-start")}>
        {copy.submit}
      </Button>
    </form>
  )
}

export { ContactForm }
