import type { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { careersPage } from "@/content/about/page-copy"
import { Button } from "@/components/ui/button"
import { ClosingCta } from "@/components/landing/closing-cta"
import { Container, primaryPill } from "@/components/landing/section"
import { Reveal } from "@/components/motion/reveal"
import { HeroHeader } from "@/components/landing/hero-header"
import { FullHero, HeroPhoto, HeroRail } from "@/components/site/full-hero"
import { PageEnd } from "@/components/site/page-end"
import { getRoles } from "@/sanity/lib/data"
import { getPageContent } from "@/sanity/lib/page-content"

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getPageContent("careersPage", careersPage)
  return { title: "Careers", description: copy.hero.lead }
}

/** Careers — the invitation, the work, and the open roles from Sanity. */
export default async function Page() {
  const [roles, copy] = await Promise.all([
    getRoles(),
    getPageContent("careersPage", careersPage),
  ])

  return (
    <div className="relative flex min-h-svh w-full flex-col gap-2.5 bg-paper">
      {/* Floats over the full-height hero rather than taking a band above it. */}
      <HeroHeader />

      <FullHero
        background={<HeroPhoto src={copy.hero.image} position="50% 35%" />}
        badge={copy.hero.badge}
        title={copy.hero.title}
        lead={copy.hero.lead}
        rail={
          <HeroRail>
            <div>
              <Button asChild size="lg" className={primaryPill}>
                <Link href="#roles">{copy.hero.ctaLabel}</Link>
              </Button>
            </div>
          </HeroRail>
        }
      />

      {/* The rest of the invitation, out of the hero so it stays one line. */}
      <Container className="flex flex-col gap-4 py-12">
        {copy.intro.paragraphs.map((paragraph) => (
          <Reveal key={paragraph}>
            <p className={cn("text-lede", "max-w-[75ch] text-ink-soft")}>
              {paragraph}
            </p>
          </Reveal>
        ))}
      </Container>

      <Container className="py-12">
        <Reveal className="flex flex-col gap-6 border-t border-line pt-12 lg:flex-row lg:gap-16">
          <h2 className={cn("text-headline", "text-ink lg:w-[40%]")}>
            {copy.work.heading}
          </h2>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {copy.work.paragraphs.map((paragraph) => (
              <p key={paragraph} className={cn("text-body", "text-ink")}>
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </Container>

      <Container id="roles" className="scroll-mt-24 py-12">
        <Reveal className="flex flex-col items-start gap-6 rounded-3xl bg-surface p-8 lg:p-[47px]">
          <h2 className={cn("text-headline", "text-ink")}>
            {copy.roles.heading}
          </h2>
          {roles.length ? (
            <ul className="flex w-full flex-col">
              {roles.map((role) => (
                <li
                  key={role.id}
                  className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-heading text-2xl text-ink">
                      {role.title}
                    </span>
                    <span className="text-sm text-ink-soft">
                      {[role.department, role.location, role.type]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                  {role.apply ? (
                    <Button asChild size="lg" className={primaryPill}>
                      <a
                        href={role.apply}
                        {...(role.apply.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {copy.roles.applyLabel}
                      </a>
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className={cn("text-body", "max-w-[60ch] text-ink-soft")}>
                {copy.roles.empty}
              </p>
              <Button asChild size="lg" className={primaryPill}>
                <Link href={copy.roles.ctaHref}>{copy.roles.ctaLabel}</Link>
              </Button>
            </>
          )}
        </Reveal>
      </Container>

      <PageEnd>
        <ClosingCta />
      </PageEnd>
    </div>
  )
}
