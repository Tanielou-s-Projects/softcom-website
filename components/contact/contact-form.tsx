"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { panelHeadingText, primaryPill } from "@/components/landing/section"

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

function ContactForm() {
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
        Send us a Message
      </h2>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Field id="contact-name" label="Name">
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            placeholder="Full Name"
            className={field}
          />
        </Field>

        <Field id="contact-email" label="Email">
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
            className={field}
          />
        </Field>
      </div>

      <Field id="contact-company" label="Company">
        <Input
          id="contact-company"
          name="company"
          autoComplete="organization"
          placeholder="Organisation Name"
          className={field}
        />
      </Field>

      <Field id="contact-message" label="Message">
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="Your message…"
          className="h-[100px] rounded-2xl px-4 py-3"
        />
      </Field>

      {/*
       * Added: the design draws the four fields and no submit control, which
       * would leave the form unusable.
       */}
      <Button type="submit" size="lg" className={cn(primaryPill, "self-start")}>
        Send Message
      </Button>
    </form>
  )
}

export { ContactForm }
