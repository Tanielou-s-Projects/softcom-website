"use client"

import * as React from "react"

import { Arrow } from "@/components/ui/arrow"
import { Crosshairs } from "@/components/ui/crosshairs"
import type { AlumniPage } from "@/content/about/page-copy"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

/* Fields are drawn as a hairline underline, not a box, to match the rules. */
const control =
  "mt-3 block w-full border-0 border-b border-line-strong bg-transparent px-0 py-2.5 text-lg placeholder:text-ink-faint focus:border-accent focus:outline-none focus-visible:outline-none"

function Field({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
        {hint && (
          <p id={`${id}-hint`} className="label text-ink-faint sm:shrink-0">
            {hint}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

/*
 * "Join the alumni network": the heading holds on the left while the form
 * runs down the right, one question per ruled field.
 */
export function AlumniForm({ copy }: { copy: AlumniPage["form"] }) {
  /*
   * TODO: no endpoint yet. Submission is intercepted so the browser can't
   * fall back to a GET that puts the answers in the query string. Replace
   * with a server action once the destination (CRM, inbox) is decided.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <section id="join" className="mt-32 scroll-mt-24 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <LineReveal
              as="h2"
              className="text-headline font-normal text-balance"
            >
              {copy.heading}
            </LineReveal>
            <p className="mt-6 max-w-md text-ink-soft">{copy.intro}</p>
          </div>
        </div>

        <Reveal className="md:col-span-6 md:col-start-7">
          <form onSubmit={onSubmit} className="grid gap-10 sm:grid-cols-2">
            <Field id="alumni-name" label={copy.nameLabel}>
              <input
                id="alumni-name"
                name="name"
                autoComplete="name"
                required
                className={control}
              />
            </Field>
            <Field id="alumni-email" label={copy.emailLabel}>
              <input
                id="alumni-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={control}
              />
            </Field>
            <Field
              id="alumni-years"
              label={copy.yearsLabel}
              hint={copy.yearsHint}
              className="sm:col-span-2"
            >
              <input
                id="alumni-years"
                name="years"
                required
                placeholder={copy.yearsPlaceholder}
                aria-describedby="alumni-years-hint"
                className={control}
              />
            </Field>
            <Field
              id="alumni-role"
              label={copy.roleLabel}
              className="sm:col-span-2"
            >
              <input
                id="alumni-role"
                name="role"
                required
                className={control}
              />
            </Field>
            <Field
              id="alumni-now"
              label={copy.nowLabel}
              hint={copy.optionalHint}
              className="sm:col-span-2"
            >
              <input
                id="alumni-now"
                name="now"
                aria-describedby="alumni-now-hint"
                className={control}
              />
            </Field>
            <Field
              id="alumni-hopes"
              label={copy.hopesLabel}
              hint={copy.optionalHint}
              className="sm:col-span-2"
            >
              <textarea
                id="alumni-hopes"
                name="hopes"
                rows={4}
                aria-describedby="alumni-hopes-hint"
                className={cn(control, "resize-y")}
              />
            </Field>

            <div className="flex items-start gap-3 sm:col-span-2">
              <input
                id="alumni-consent"
                name="consent"
                type="checkbox"
                required
                className="mt-1 size-4 shrink-0 accent-accent"
              />
              <label htmlFor="alumni-consent" className="text-ink-soft">
                {copy.consent}
              </label>
            </div>

            <button
              type="submit"
              className="group inline-flex h-12 items-center gap-3 justify-self-start rounded-full bg-accent pr-5 pl-6 text-[0.9375rem] font-medium tracking-[-0.01em] whitespace-nowrap text-on-accent transition-colors duration-200 hover:bg-accent-deep"
            >
              {copy.submit}
              <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
