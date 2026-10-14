import { Arrow } from "@/components/ui/arrow"
import { ButtonLink } from "@/components/ui/button"
import { Crosshairs } from "@/components/ui/crosshairs"
import type { CareersPage } from "@/content/about/page-copy"
import type { Role } from "@/sanity/lib/data"
import { LineReveal } from "@/components/motion/line-reveal"
import { Reveal } from "@/components/motion/reveal"

/* A small outlined pill for a role's location and type. */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="label inline-block rounded-full border border-line-strong px-3 py-1.5 text-ink-soft">
      {children}
    </span>
  )
}

/*
 * Open roles as a ruled index: one row per role, title and department on the
 * left, location and type as tags, the whole row the way to apply. The apply
 * target may be an outside link or a mailto, so rows are plain anchors.
 */
export function Roles({
  copy,
  roles,
}: {
  copy: CareersPage["roles"]
  roles: Role[]
}) {
  return (
    <section id="roles" className="mt-32 scroll-mt-24 md:mt-48">
      <Crosshairs />
      <div className="shell mt-10 md:mt-16">
        <div className="flex items-end justify-between gap-6">
          <LineReveal as="h2" className="text-headline font-normal">
            {copy.heading}
          </LineReveal>
          {roles.length > 0 && (
            <p className="label pb-2 text-ink-faint">
              ({String(roles.length).padStart(2, "0")})
            </p>
          )}
        </div>

        {roles.length ? (
          <Reveal
            as="ul"
            stagger="rows"
            className="mt-12 border-b border-line md:mt-20"
          >
            {roles.map((role) => {
              const row = (
                <>
                  <div className="md:col-span-6">
                    <h3 className="text-title transition-colors group-hover:text-accent">
                      {role.title}
                    </h3>
                    {role.department && (
                      <p className="label mt-3 text-ink-faint">
                        {role.department}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-start gap-2 md:col-span-4 md:pt-1">
                    {role.location && <Tag>{role.location}</Tag>}
                    {role.type && <Tag>{role.type}</Tag>}
                  </div>
                  {role.apply && (
                    <span className="flex items-center gap-2 font-medium md:col-span-2 md:justify-end md:pt-1">
                      {copy.applyLabel}
                      <span className="sr-only">: {role.title}</span>
                      <Arrow className="size-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </>
              )
              const rowClass =
                "group grid gap-4 py-8 md:grid-cols-12 md:gap-x-6 md:py-10"
              return (
                <li key={role.id} className="border-t border-line">
                  {role.apply ? (
                    <a
                      href={role.apply}
                      className={rowClass}
                      {...(role.apply.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {row}
                    </a>
                  ) : (
                    <div className={rowClass}>{row}</div>
                  )}
                </li>
              )
            })}
          </Reveal>
        ) : (
          <Reveal className="mt-12 grid gap-8 border-y border-line py-10 md:mt-20 md:grid-cols-12 md:gap-x-6 md:py-14">
            <p className="text-xl tracking-[-0.01em] text-pretty md:col-span-6">
              {copy.empty}
            </p>
            <div className="md:col-span-4 md:col-start-9 md:justify-self-end">
              <ButtonLink href={copy.ctaHref}>{copy.ctaLabel}</ButtonLink>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
