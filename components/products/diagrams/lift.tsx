import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Caps,
  DiagramCard,
  DiagramFrame,
} from "@/components/products/diagrams/frame"

/*
 * LIFT's diagrams from the copy deck (pages 33–41), rebuilt: the same tiers,
 * modules, steps and wording, the same layout, the site's type and colour.
 * The deck's screenshots of the product are shown as images elsewhere.
 */

const eyebrow = (fig: string) => `LIFT / ${fig.replace(/\D/g, "")}`

/** A box the deck draws in its accent: outlined, and tinted when `tint`. */
function AccentCard({
  tint,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { tint?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-surface ring-1 ring-accent-ink",
        className
      )}
      {...props}
    >
      {tint ? (
        <span aria-hidden className="absolute inset-0 bg-accent-ink/10" />
      ) : null}
      <div className="relative h-full">{children}</div>
    </div>
  )
}

/** A short line set in mono, as the deck sets its notes. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs leading-relaxed text-ink-soft lg:text-[13px]">
      {children}
    </p>
  )
}

/** A horizontal scroll wrapper, so wide diagrams stay legible on a phone. */
function Wide({ min, children }: { min: number; children: React.ReactNode }) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
      <div style={{ minWidth: min }}>{children}</div>
    </div>
  )
}

/* ── Four tiers ── */

const TIERS = [
  {
    tier: "Tier 0",
    name: "Explorer",
    needs: "name, phone, email",
    can: [
      "Browse courses, events",
      "Browse the directory",
      "Read resources, news",
      "See what tiers unlock",
    ],
  },
  {
    tier: "Tier 1",
    name: "Verified individual",
    needs: "profile + identity check",
    can: [
      "Enrol, earn certificates",
      "RSVP, join the forum",
      "Buy on the marketplace",
      "Government services",
    ],
  },
  {
    tier: "Tier 2",
    name: "Verified business",
    needs: "CAC, TIN, documents",
    can: [
      "Sell, receive payouts",
      "Live directory listing",
      "Apply for loans, grants",
      "Run ads, KYB lookups",
    ],
  },
  {
    tier: "Tier 3",
    name: "Trusted",
    needs: "earned through conduct",
    can: [
      "Early access to events",
      "Featured in directory",
      "Trusted badge",
      "Lost if standing slips",
    ],
    trusted: true,
  },
]

/** What each step up asks for, on the arrow between two tiers. */
const STEPS = ["identity", "business", "standing"]

export function LiftTiers({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="Four tiers."
      subtitle="Each level of verification unlocks a set of tools. Trusted status is earned, and can be lost."
      footnote="Concept illustration"
    >
      <div className="flex flex-col gap-8">
        <Note>
          The more a member verifies, the more opens. Each tier keeps what came
          before.
        </Note>
        <Wide min={920}>
          <ol className="grid grid-cols-4 items-end gap-14">
            {TIERS.map((tier, index) => {
              const body = (
                <div className="flex h-full flex-col">
                  <div className="flex flex-col gap-2 p-5">
                    <Caps className={tier.trusted ? "text-accent-ink" : ""}>
                      {tier.tier}
                    </Caps>
                    <span className="font-heading text-xl leading-tight text-ink">
                      {tier.name}
                    </span>
                    <span className="font-mono text-xs text-ink-soft">
                      {tier.needs}
                    </span>
                  </div>
                  <ul
                    className={cn(
                      "flex flex-col gap-2.5 border-t p-5 text-sm text-ink",
                      tier.trusted ? "border-accent-ink/30" : "border-line"
                    )}
                  >
                    {tier.can.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )
              return (
                <li
                  key={tier.tier}
                  className="relative"
                  // The staircase: each tier stands taller than the last.
                  style={{ height: 300 + index * 70 }}
                >
                  {tier.trusted ? (
                    <AccentCard tint className="h-full">
                      {body}
                    </AccentCard>
                  ) : (
                    <DiagramCard className="h-full">{body}</DiagramCard>
                  )}
                  {index < STEPS.length ? (
                    <span
                      aria-hidden
                      className="absolute top-[100px] -right-14 flex w-14 flex-col items-center gap-0.5 whitespace-nowrap text-accent-ink"
                    >
                      <span className="font-mono text-[9px] leading-none">
                        verify
                      </span>
                      <span className="text-base leading-none">→</span>
                      <span className="font-mono text-[9px] leading-none">
                        {STEPS[index]}
                      </span>
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </Wide>
      </div>
    </DiagramFrame>
  )
}

/* ── One member, six modules ── */

const MODULES = [
  { name: "Learn", what: "Courses, resources, certificates" },
  { name: "Connect", what: "Events, mentors, forum" },
  { name: "Trade", what: "Verified marketplace, escrow, payouts" },
  { name: "Grow", what: "Directory listing, ads, growth tools" },
  { name: "Register", what: "CAC, TIN, trademark, other government services" },
  { name: "Finance", what: "Loans and grants, guided applications" },
]

function ModuleCard({ module }: { module: (typeof MODULES)[number] }) {
  return (
    <DiagramCard className="flex flex-col gap-2 p-5">
      <Caps className="text-accent-ink">{module.name}</Caps>
      <span className="text-sm text-ink">{module.what}</span>
    </DiagramCard>
  )
}

export function LiftModules({ fig }: { fig: string }) {
  const [learn, connect, trade, grow, register, finance] = MODULES
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="One member, six modules."
      subtitle="Learn, Connect, Trade, Finance, Register, Grow. Each reads the same profile and tier."
      footnote="Concept illustration"
    >
      <div className="flex flex-col gap-8">
        <Wide min={720}>
          <div className="relative">
            {/* Spokes from the member to every module. */}
            <svg
              viewBox="0 0 1000 560"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              aria-hidden
            >
              {[
                "M200 100 L 500 280",
                "M500 90 L 500 280",
                "M800 100 L 500 280",
                "M200 460 L 500 280",
                "M500 470 L 500 280",
                "M800 460 L 500 280",
              ].map((d) => (
                <path
                  key={d}
                  d={d}
                  fill="none"
                  className="stroke-ink/40"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            <div className="relative grid grid-cols-3 gap-x-16">
              <div className="pt-6">
                <ModuleCard module={learn} />
              </div>
              <ModuleCard module={connect} />
              <div className="pt-6">
                <ModuleCard module={trade} />
              </div>

              <div className="col-span-3 flex justify-center py-12">
                <div className="relative grid size-[200px] place-items-center rounded-full bg-surface text-center ring-2 ring-accent-ink">
                  <div className="flex flex-col items-center gap-2 px-4">
                    <Caps>One member</Caps>
                    <span className="font-heading text-xl text-ink">
                      profile · tier
                    </span>
                    <span className="font-mono text-[11px] leading-snug text-ink-soft">
                      verified once, used everywhere
                    </span>
                  </div>
                </div>
              </div>

              <ModuleCard module={grow} />
              <div className="pt-6">
                <ModuleCard module={register} />
              </div>
              <ModuleCard module={finance} />
            </div>
          </div>
        </Wide>
        <Note>
          Every module reads the same profile and tier. What a member sees in
          the marketplace, the directory or a grant application is decided once.
        </Note>
      </div>
    </DiagramFrame>
  )
}

/* ── From sign-up to Trusted ── */

const JOURNEY = [
  {
    step: "Account",
    asks: "name, phone, email",
    takes: "under 2 minutes",
    unlocks: "Tier 0",
  },
  {
    step: "Personal profile",
    asks: "sector, location, role",
    takes: "about a minute",
  },
  {
    step: "Identity",
    asks: "ID document, selfie match",
    takes: "automated",
    unlocks: "Tier 1",
  },
  {
    step: "Business",
    asks: "CAC number, TIN, documents",
    takes: "team review, 2 to 3 days",
    unlocks: "Tier 2",
    accent: true,
  },
  {
    step: "Standing",
    asks: "conduct across modules",
    takes: "earned over time",
    unlocks: "Tier 3",
    accent: true,
    tint: true,
  },
]

export function LiftTrusted({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="From sign-up to Trusted."
      subtitle="Each step unlocks the next tier."
      footnote="Concept illustration"
    >
      <div className="flex flex-col gap-8">
        <Wide min={900}>
          <ol className="grid grid-cols-5 gap-6">
            {JOURNEY.map((step, index) => {
              const body = (
                <div className="flex h-full flex-col gap-3 p-5">
                  <span className="font-mono text-xs text-ink-soft tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-lg leading-tight text-ink">
                    {step.step}
                  </span>
                  <span className="text-sm text-ink">{step.asks}</span>
                  <span className="font-mono text-xs text-ink-soft">
                    {step.takes}
                  </span>
                </div>
              )
              return (
                <li key={step.step} className="relative flex flex-col gap-4">
                  {step.accent ? (
                    <AccentCard tint={step.tint} className="h-full">
                      {body}
                    </AccentCard>
                  ) : (
                    <DiagramCard className="h-full">{body}</DiagramCard>
                  )}
                  <span className="h-4 font-mono text-xs tracking-[0.12em] text-accent-ink uppercase">
                    {step.unlocks ? `→ ${step.unlocks}` : null}
                  </span>
                  {index < JOURNEY.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute top-[60px] -right-5 text-ink-soft"
                    >
                      →
                    </span>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </Wide>
        <Note>
          Identity is checked by the platform. Business verification is reviewed
          by people. Trusted status is decided by the platform from conduct, and
          can be withdrawn.
        </Note>
      </div>
    </DiagramFrame>
  )
}

/* ── A soft gate on a funding program ── */

const PROGRAM = [
  ["Eligibility", "Registered SME, 2+ years trading"],
  ["Documents", "CAC certificate, TIN, bank statement"],
  ["Prefilled", "7 of 9 fields from your profile"],
]

const ACCESS = [
  { tier: "Tier 0", can: "See program names and amounts" },
  { tier: "Tier 1", can: "Read full detail, save, see eligibility" },
  {
    tier: "Tier 2",
    can: "Apply, with profile and documents prefilled",
    on: true,
  },
  { tier: "Tier 3", can: "Early notice when programs open", on: true },
]

export function LiftGate({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="A soft gate on a funding program."
      subtitle="What a verified individual sees, and what each tier can do on the same page."
      footnote="Concept illustration · Fictional data"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
        <DiagramCard className="flex flex-col">
          <div className="flex flex-col gap-2 border-b border-line p-6">
            <Caps>Grant · Open</Caps>
            <span className="font-heading text-2xl text-ink">
              SME Growth Fund
            </span>
            <span className="font-mono text-xs text-ink-soft">
              SMEDAN · ₦500,000 to ₦5,000,000 · closes 30 Sep
            </span>
          </div>
          <dl className="flex flex-col gap-4 p-6">
            {PROGRAM.map(([field, value]) => (
              <div
                key={field}
                className="grid gap-1 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4"
              >
                <dt>
                  <Caps>{field}</Caps>
                </dt>
                <dd className="text-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="px-6 pb-6">
            <AccentCard tint className="p-5">
              <div className="flex flex-col gap-2">
                <Caps className="text-accent-ink">Soft gate · Tier 1</Caps>
                <p className="text-sm text-ink">
                  You can read and save this program. To apply, verify your
                  business. Takes 2 to 3 working days.
                </p>
              </div>
            </AccentCard>
          </div>
        </DiagramCard>

        <div className="flex flex-col gap-4">
          <Caps>What each tier can do here</Caps>
          <ul className="flex flex-col gap-3">
            {ACCESS.map((row) => {
              const body = (
                <div className="flex flex-col gap-1 px-5 py-4">
                  <Caps className={row.on ? "text-accent-ink" : ""}>
                    {row.tier}
                  </Caps>
                  <span className="text-sm text-ink">{row.can}</span>
                </div>
              )
              return (
                <li key={row.tier}>
                  {row.on ? (
                    <AccentCard tint>{body}</AccentCard>
                  ) : (
                    <DiagramCard>{body}</DiagramCard>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </DiagramFrame>
  )
}

/* ── Order to payout ── */

/*
 * Three swimlanes (buyer, platform, seller) and five steps placed in them,
 * on a 100 × 100 grid: x is the step's left edge, lane its row. The elbow
 * routes between them are drawn in the same space.
 */
const LANES = [
  { id: "buyer", label: "Buyer · member sourcing inputs" },
  { id: "platform", label: "Platform · holds the money", accent: true },
  { id: "seller", label: "Seller · verified business" },
]
const ORDER = [
  { n: "01", label: "Orders a product", x: 0, lane: 0 },
  { n: "02", label: "Payment held", x: 20, lane: 1, tint: true },
  { n: "03", label: "Ships the order", x: 40, lane: 2 },
  { n: "04", label: "Confirms delivery", x: 60, lane: 0 },
  {
    n: "05",
    label: "Payout released",
    x: 80,
    lane: 1,
    tint: true,
    after: "to the seller's account",
  },
]
const BOX_W = 17
/** Vertical centre of each lane's box, in % of the lanes' height. */
const LANE_Y = [16.5, 50, 83.5]

const ROUTES = [
  // 01 → 02: right, then down into the top of 02.
  {
    d: `M${BOX_W} ${LANE_Y[0]} H ${20 + BOX_W / 2} V ${LANE_Y[1] - 7}`,
    head: { x: 20 + BOX_W / 2, y: LANE_Y[1] - 7, down: true },
  },
  // 02 → 03.
  {
    d: `M${20 + BOX_W} ${LANE_Y[1]} H ${40 + BOX_W / 2} V ${LANE_Y[2] - 7}`,
    head: { x: 40 + BOX_W / 2, y: LANE_Y[2] - 7, down: true },
  },
  // 03 → 04: right, then up into the bottom of 04.
  {
    d: `M${40 + BOX_W} ${LANE_Y[2]} H ${60 + BOX_W / 2} V ${LANE_Y[0] + 7}`,
    head: { x: 60 + BOX_W / 2, y: LANE_Y[0] + 7, down: false },
  },
  // 04 → 05: the release, in the accent.
  {
    d: `M${60 + BOX_W} ${LANE_Y[0]} H ${80 + BOX_W / 2} V ${LANE_Y[1] - 7}`,
    head: { x: 80 + BOX_W / 2, y: LANE_Y[1] - 7, down: true },
    on: true,
  },
]

export function LiftPayout({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="Order to payout."
      subtitle="Verified member buys, verified business sells, platform in between."
      footnote="Concept illustration"
    >
      <div className="flex flex-col gap-8">
        <Wide min={860}>
          <div className="relative h-[420px]">
            {/* Lanes: a label and a rule under each. */}
            {LANES.map((lane, index) => (
              <div
                key={lane.id}
                className="absolute inset-x-0 border-b border-line"
                style={{ top: `${index * 33.33}%`, height: "33.33%" }}
              >
                <span
                  className={cn(
                    "absolute top-1 left-0 font-mono text-[11px] tracking-[0.12em] uppercase",
                    lane.accent ? "text-accent-ink" : "text-ink-soft"
                  )}
                >
                  {lane.label}
                </span>
              </div>
            ))}

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full overflow-visible"
              aria-hidden
            >
              {ROUTES.map((route) => (
                <path
                  key={route.d}
                  d={route.d}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  className={route.on ? "stroke-accent-ink" : "stroke-ink/70"}
                  style={{ strokeWidth: route.on ? 2 : 1.2 }}
                />
              ))}
            </svg>
            {/* Arrowheads in HTML: the lanes' SVG is stretched, these aren't. */}
            {ROUTES.map(({ head, on }) => (
              <span
                key={`${head.x}-${head.y}`}
                aria-hidden
                className={cn(
                  "absolute -translate-x-1/2 text-[10px] leading-none",
                  head.down ? "-translate-y-full" : "",
                  on ? "text-accent-ink" : "text-ink/70"
                )}
                style={{ left: `${head.x}%`, top: `${head.y}%` }}
              >
                {head.down ? "▼" : "▲"}
              </span>
            ))}

            {ORDER.map((step) => {
              const body = (
                <div className="flex flex-col gap-1 px-4 py-3">
                  <span className="font-mono text-xs text-ink-soft">
                    {step.n}
                  </span>
                  <span className="text-sm text-ink">{step.label}</span>
                </div>
              )
              return (
                <div
                  key={step.n}
                  className="absolute -translate-y-1/2"
                  style={{
                    left: `${step.x}%`,
                    top: `${LANE_Y[step.lane]}%`,
                    width: `${BOX_W}%`,
                  }}
                >
                  {step.tint ? (
                    <AccentCard tint>{body}</AccentCard>
                  ) : (
                    <DiagramCard>{body}</DiagramCard>
                  )}
                  {step.after ? (
                    <span className="absolute top-full left-0 pt-2 font-mono text-[11px] whitespace-nowrap text-ink-soft">
                      {step.after}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </Wide>
        <Note>
          If the buyer does not confirm, or the seller does not ship, either
          side raises a dispute and the platform decides before any money moves.
        </Note>
      </div>
    </DiagramFrame>
  )
}

/* ── One product, many initiatives ── */

export function LiftInitiatives({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="One product, many initiatives."
      subtitle="The platform is the same. The front is yours."
      footnote="Concept illustration"
    >
      <div className="flex flex-col gap-8">
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_40px_minmax(0,1.9fr)_40px_minmax(0,1fr)] lg:gap-3">
          <AccentCard className="p-5">
            <div className="flex flex-col gap-2">
              <Caps>Deployment</Caps>
              <span className="font-heading text-xl text-ink">
                A state initiative
              </span>
              <span className="font-mono text-xs text-ink-soft">
                ministry of commerce
              </span>
            </div>
          </AccentCard>
          <span
            aria-hidden
            className="hidden text-center text-xl text-accent-ink lg:block"
          >
            ←
          </span>
          <DiagramCard className="flex flex-col items-center gap-3 px-6 py-8 text-center">
            <Caps className="text-accent-ink">LIFT</Caps>
            <span className="font-heading text-lg text-ink lg:text-xl">
              tiers · modules · verification · payments
            </span>
            <span className="font-mono text-xs text-ink-soft">
              one codebase, one data model, one set of rules
            </span>
            <span className="font-mono text-xs text-ink-soft">
              tokens · components · motion
            </span>
          </DiagramCard>
          <span
            aria-hidden
            className="hidden text-center text-xl text-ink-soft lg:block"
          >
            →
          </span>
          <DiagramCard className="flex flex-col gap-2 p-5">
            <Caps>Deployment</Caps>
            <span className="font-heading text-xl text-ink">
              A national MDA
            </span>
            <span className="font-mono text-xs text-ink-soft">
              enterprise development agency
            </span>
          </DiagramCard>
        </div>
        <Note>
          Brand, colour, type and surface are configuration. The product
          underneath is the same.
        </Note>
      </div>
    </DiagramFrame>
  )
}
