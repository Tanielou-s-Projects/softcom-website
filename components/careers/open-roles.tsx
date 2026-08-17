import Link from "next/link"
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  bodyText,
  Container,
  headingText,
  leadText,
  primaryPill,
} from "@/components/landing/section"
import { openRoles, roles, type Role } from "@/components/careers/content"

/** One vacancy: title on the left, its facts on the right. */
function RoleRow({ role }: { role: Role }) {
  return (
    <li>
      <Link
        href={`/contact?role=${encodeURIComponent(role.title)}`}
        className="group flex flex-col gap-4 border-t border-border py-8 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
      >
        <h3 className="font-heading text-2xl leading-none font-medium text-foreground transition-colors group-hover:text-brand-accent lg:min-w-0 lg:flex-1">
          {role.title}
        </h3>

        <div
          className={cn(
            bodyText,
            "flex flex-wrap items-center gap-x-8 gap-y-2 text-muted-foreground lg:shrink-0"
          )}
        >
          <span>{role.team}</span>
          <span>{role.location}</span>
          <span>{role.type}</span>
          <ArrowUpRightIcon
            aria-hidden
            className="size-5 text-foreground transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </Link>
    </li>
  )
}

/**
 * The vacancies list, or — when there are none — the speculative application.
 *
 * The empty branch is a designed state rather than a hidden section: an empty
 * careers page is an ordinary thing for a company to have, and the useful move
 * is to invite the introduction anyway.
 */
function OpenRoles() {
  return (
    <Container className="flex flex-col gap-10 py-6 lg:gap-16">
      <header className="flex flex-col items-start gap-6">
        <Badge variant="brand">{openRoles.eyebrow}</Badge>
        <h2 className={cn(headingText, "max-w-[664px] text-foreground")}>
          {openRoles.heading}
        </h2>
      </header>

      {roles.length > 0 ? (
        <ul className="flex flex-col border-b border-border">
          {roles.map((role) => (
            <RoleRow key={role.id} role={role} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-8 overflow-clip rounded-3xl bg-popover p-8 lg:p-12">
          <p
            className={cn(
              leadText,
              "max-w-[640px] leading-[1.6] text-popover-foreground"
            )}
          >
            {openRoles.empty}
          </p>
          <Button asChild size="lg" className={primaryPill}>
            <Link href={openRoles.emptyAction.href}>
              {openRoles.emptyAction.label}
            </Link>
          </Button>
        </div>
      )}
    </Container>
  )
}

export { OpenRoles }
