"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AlumniPage } from "@/content/about/page-copy"
import { Textarea } from "@/components/ui/textarea"
import { primaryPill } from "@/components/landing/section"

/** The same 48px pill fields as the contact form. */
const field = "h-12 rounded-full px-4"

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  )
}

/** "Join the alumni network" — the sign-up the Alumni page closes on. */
function AlumniForm({ copy }: { copy: AlumniPage["form"] }) {
  /*
   * TODO: no endpoint yet, as with the contact form. Submission is intercepted
   * so the browser can't fall back to a GET that puts the answers in the query
   * string. Replace with a server action once the destination is decided.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      id="join"
      onSubmit={onSubmit}
      className="flex scroll-mt-24 flex-col gap-8 overflow-clip rounded-3xl bg-surface p-8 lg:p-[47px]"
    >
      <div className="flex flex-col gap-4">
        <h2 className={cn("text-headline", "text-ink")}>{copy.heading}</h2>
        <p className={cn("text-body", "max-w-[60ch] text-ink-soft")}>
          {copy.intro}
        </p>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <Field id="alumni-name" label={copy.nameLabel}>
          <Input
            id="alumni-name"
            name="name"
            autoComplete="name"
            required
            className={field}
          />
        </Field>
        <Field id="alumni-email" label={copy.emailLabel}>
          <Input
            id="alumni-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={field}
          />
        </Field>
      </div>

      <Field id="alumni-years" label={copy.yearsLabel} hint={copy.yearsHint}>
        <Input
          id="alumni-years"
          name="years"
          required
          placeholder={copy.yearsPlaceholder}
          aria-describedby="alumni-years-hint"
          className={field}
        />
      </Field>

      <Field id="alumni-role" label={copy.roleLabel}>
        <Input id="alumni-role" name="role" required className={field} />
      </Field>

      <Field id="alumni-now" label={copy.nowLabel} hint={copy.optionalHint}>
        <Input
          id="alumni-now"
          name="now"
          aria-describedby="alumni-now-hint"
          className={field}
        />
      </Field>

      <Field id="alumni-hopes" label={copy.hopesLabel} hint={copy.optionalHint}>
        <Textarea
          id="alumni-hopes"
          name="hopes"
          rows={4}
          aria-describedby="alumni-hopes-hint"
          className="h-[100px] rounded-2xl px-4 py-3"
        />
      </Field>

      <div className="flex items-start gap-3">
        <Checkbox id="alumni-consent" name="consent" required />
        <Label htmlFor="alumni-consent" className="leading-snug font-normal">
          {copy.consent}
        </Label>
      </div>

      <Button type="submit" size="lg" className={cn(primaryPill, "self-start")}>
        {copy.submit}
      </Button>
    </form>
  )
}

export { AlumniForm }
