import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Caps,
  DiagramCard,
  DiagramFrame,
} from "@/components/products/diagrams/frame"

/*
 * Reckon's eight diagrams from the copy deck (pages 26–30), rebuilt: the
 * same entities, lines, rules and amounts, the same layout, the site's type
 * and colour. The deck sets Reckon in mono, so the diagram bodies do too.
 */

const eyebrow = (fig: string) => `Reckon / ${fig.replace(/\D/g, "")}`

/**
 * On a phone, wide diagrams keep a readable width and scroll sideways; from
 * `lg` they fit the frame. The inner padding keeps card rings from clipping.
 */
function Scroll({ min, children }: { min: number; children: React.ReactNode }) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 py-px sm:mx-0 sm:px-px lg:overflow-visible">
      <div
        className="min-w-(--min) lg:min-w-0"
        style={{ "--min": `${min}px` } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  )
}

/** A right-pointing connector between two boxes. */
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 10"
      preserveAspectRatio="none"
      className={cn("h-2.5 w-full", className)}
      aria-hidden
    >
      <path
        d="M0 5 H36"
        className="stroke-ink/70"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M33 1.5 L40 5 L33 8.5 Z" className="fill-ink/70" />
    </svg>
  )
}

/** A boxed panel in the deck's style: a caps head, then rows. */
function Panel({
  head,
  on,
  center,
  className,
  children,
}: {
  head: string
  on?: boolean
  center?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <DiagramCard
      className={cn(
        "overflow-clip font-mono text-sm",
        on && "ring-accent-ink",
        className
      )}
    >
      <div
        className={cn(
          "border-b border-line px-4 py-3",
          center && "text-center",
          on && "border-accent-ink/40"
        )}
      >
        <Caps className={cn("text-xs", on && "text-accent-ink")}>{head}</Caps>
      </div>
      {children}
    </DiagramCard>
  )
}

/* ── 01 · Declared against owed. ── */

const LINES = [
  [
    "Account maintenance fees",
    "GL 4010",
    "VAT 7.5%",
    "16,095,000",
    "16,095,000",
    "0",
  ],
  [
    "Software licence, offshore vendor",
    "GL 6220 / Bank USD",
    "Reverse charge",
    "0",
    "3,637,500",
    "3,637,500",
  ],
  ["Professional fees", "GL 6310", "VAT 7.5%", "843,750", "843,750", "0"],
  [
    "Facility processing fee, Obi & Sons",
    "Interest ledger",
    "Fee: VAT 7.5%",
    "0",
    "4,650,000",
    "4,650,000",
  ],
  ["Rent, head office", "GL 6100", "VAT 7.5%", "3,150,000", "3,150,000", "0"],
  ["Marketing", "GL 6400", "VAT 7.5%", "735,000", "735,000", "0"],
  [
    "Facility, 3 x 364 days",
    "Facility register",
    "Stamp duty",
    "0",
    "6,250,000",
    "6,250,000",
  ],
  [
    "Customer receipts",
    "Bank NGN",
    "Output VAT",
    "318,400,000",
    "318,400,000",
    "0",
  ],
]

export function ReckonDeclaredOwed({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="Declared against owed."
      subtitle="One taxpayer, one tax, every line tested. Three differences surfaced for review."
      footnote="Concept illustration · Illustrative figures"
    >
      <Scroll min={860}>
        <DiagramCard className="overflow-clip font-mono text-sm">
          <div className="flex justify-between gap-4 border-b border-line px-6 py-4">
            <Caps>Entity 0421-77 · FY2025 · VAT</Caps>
            <Caps>1,214 lines tested</Caps>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line">
                {["Line", "Source", "Rule", "Declared", "Owed", "Diff"].map(
                  (head, index) => (
                    <th
                      key={head}
                      className={cn(
                        "px-6 py-3 font-normal",
                        index > 2 && "text-right"
                      )}
                    >
                      <Caps>{head}</Caps>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {LINES.map((row) => {
                const exception = row[5] !== "0"
                return (
                  <tr
                    key={row[0]}
                    className={cn(
                      "tabular-nums",
                      exception
                        ? "bg-accent-ink/10 text-ink shadow-[inset_4px_0_0_var(--color-accent-ink)]"
                        : "text-ink-soft"
                    )}
                  >
                    {row.map((cell, index) => (
                      <td
                        key={index}
                        className={cn(
                          "px-6 py-3",
                          index > 2 && "text-right",
                          index === 5 && exception && "text-accent-ink"
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="flex flex-col gap-3 border-t border-line px-6 py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-6">
                <Caps>Exceptions above threshold</Caps>
                <span className="text-ink">3 of 1,214 lines</span>
              </div>
              <div className="flex items-baseline gap-6">
                <Caps>Difference</Caps>
                <span className="text-xl text-accent-ink tabular-nums lg:text-2xl">
                  ₦14,537,500
                </span>
              </div>
            </div>
            <p className="text-xs text-ink-soft">
              Each exception opens to its figure, source lines and rule. The
              officer raises a finding or dismisses it. Illustrative figures.
            </p>
          </div>
        </DiagramCard>
      </Scroll>
    </DiagramFrame>
  )
}

/* ── 02 · Three records, one rule, one exception. ── */

const RECORDS: { head: string; rows: [string, string, boolean?][] }[] = [
  {
    head: "General ledger",
    rows: [
      ["Rent, head office", "42,000,000"],
      ["Software licence, offshore", "48,500,000", true],
      ["Professional fees", "11,250,000"],
    ],
  },
  {
    head: "VAT return",
    rows: [
      ["Output VAT declared", "318,400,000"],
      ["Self-charged VAT, offshore", "—", true],
      ["Input VAT claimed", "96,120,000"],
    ],
  },
  {
    head: "Bank statement · USD",
    rows: [
      ["TT, offshore software vendor", "(48,500,000)", true],
      ["FX purchase", "(50,000,000)"],
      ["Customer receipt", "31,200,000"],
    ],
  },
]

/** A row with a small marker glyph, as the deck lists provisions. */
function MarkedRow({
  mark,
  children,
}: {
  mark: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 border-t border-line px-4 py-2.5 first:border-t-0">
      <span className="w-4 text-center text-xs text-ink-soft">{mark}</span>
      <span className="text-ink">{children}</span>
    </div>
  )
}

export function ReckonThreeRecords({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="Three records, one rule, one exception."
      subtitle="An offshore licence in the ledger and the bank statement; no reverse-charge VAT on the return."
      footnote="Concept illustration · Illustrative figures"
    >
      <Scroll min={900}>
        <div className="grid grid-cols-[minmax(0,6fr)_48px_minmax(0,4.5fr)_48px_minmax(0,5.8fr)] items-center">
          <div className="flex flex-col gap-6">
            {RECORDS.map((record) => (
              <DiagramCard
                key={record.head}
                className="overflow-clip font-mono text-sm"
              >
                <div className="px-4 pt-3 pb-2">
                  <Caps className="text-xs">{record.head}</Caps>
                </div>
                {record.rows.map(([label, value, on]) => (
                  <div
                    key={label}
                    className={cn(
                      "flex justify-between gap-4 px-4 py-1.5 tabular-nums",
                      on ? "bg-accent-ink/10 text-ink" : "text-ink-soft"
                    )}
                  >
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
                <div className="h-2" />
              </DiagramCard>
            ))}
          </div>
          {/* The three records gathered onto one rule. */}
          <svg
            viewBox="0 0 48 300"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden
          >
            <path
              d="M0 32 H24 V268 H0 M0 150 H48"
              fill="none"
              className="stroke-ink/70"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <Panel head="Provision" center>
            <MarkedRow mark="▤">Offshore services</MarkedRow>
            <MarkedRow mark="fx">Reverse-charge VAT 7.5%</MarkedRow>
            <MarkedRow mark="⚑">Self-charged by recipient</MarkedRow>
          </Panel>
          <ArrowRight />
          <div className="flex flex-col gap-3">
            <Panel head="Exception" on center>
              <MarkedRow mark="▤">Expected VAT ₦3,637,500</MarkedRow>
              <MarkedRow mark="fx">Remitted nil</MarkedRow>
              <MarkedRow mark="⚑">Sources: 3 lines, 1 rule</MarkedRow>
              <MarkedRow mark="→">For officer review</MarkedRow>
            </Panel>
            <span className="font-mono text-xs text-ink-soft">
              Illustrative figures.
            </span>
          </div>
        </div>
      </Scroll>
    </DiagramFrame>
  )
}

/* ── 03 · One chart of accounts. ── */

const INTAKES = [
  ["Returns", "CIT, VAT, WHT, PAYE"],
  ["Ledgers", "GL, TB, AFS"],
  ["Schedules", "fixed assets, loans"],
  ["Bank statements", "NGN, USD"],
  ["Scans", "OCR"],
]

const ACCOUNTS: [string, string, string, string?][] = [
  ["6220", "Software licence, offshore", "VAT · RC", "WHT"],
  ["4010", "Account maintenance fees", "VAT", "CIT"],
  ["7100", "Interest, term loans", "exempt", "CIT"],
  ["7140", "Facility processing fee", "VAT", "CIT"],
  ["1500", "Facility, Obi & Sons", "stamp duty"],
  ["6100", "Rent, head office", "VAT", "WHT"],
  ["2100", "Staff costs", "PAYE", "CIT"],
]

function TaxTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-accent-ink/10 px-2 py-1 text-xs text-accent-ink ring-1 ring-accent-ink/20">
      {children}
    </span>
  )
}

export function ReckonChartOfAccounts({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="One chart of accounts."
      subtitle="Every line tagged to the taxes it attracts: CIT, VAT, WHT, PAYE, CGT, stamp duty, transfer pricing."
      footnote="Concept illustration · Illustrative figures"
    >
      <Scroll min={900}>
        <div className="grid grid-cols-[minmax(0,4.4fr)_minmax(0,3.2fr)_minmax(0,11fr)] items-center">
          <div className="flex flex-col gap-3">
            {INTAKES.map(([head, sub]) => (
              <DiagramCard
                key={head}
                className="flex flex-col gap-1 px-4 py-3 font-mono text-sm"
              >
                <Caps className="text-xs text-ink">{head}</Caps>
                <span className="text-ink-soft">{sub}</span>
              </DiagramCard>
            ))}
          </div>
          {/* Five intakes harmonised into one stream. */}
          <div className="relative h-full">
            <svg
              viewBox="0 0 100 500"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              aria-hidden
            >
              {[50, 150, 250, 350, 450].map((y) => (
                <path
                  key={y}
                  d={`M0 ${y} C 45 ${y}, 40 250, 72 250`}
                  fill="none"
                  className="stroke-ink/60"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              <path
                d="M72 250 H96"
                fill="none"
                className="stroke-ink/70"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="absolute top-1/2 left-[72%] size-3 -translate-1/2 rounded-full bg-surface ring-1 ring-ink/70" />
            <span className="absolute top-[calc(50%-28px)] left-[72%] -translate-x-1/2 font-mono text-xs text-ink-soft">
              harmonise
            </span>
          </div>
          <DiagramCard className="overflow-clip font-mono text-sm">
            <div className="border-b border-line px-6 py-4">
              <Caps>
                One chart of accounts · every line mapped to a tax area
              </Caps>
            </div>
            <div className="flex flex-col gap-2 px-6 py-4">
              {ACCOUNTS.map(([code, name, first, second]) => (
                <div
                  key={code}
                  className="grid grid-cols-[56px_minmax(0,1fr)_120px_64px] items-center gap-3"
                >
                  <span className="text-ink-soft tabular-nums">{code}</span>
                  <span className="text-ink">{name}</span>
                  <span>
                    <TaxTag>{first}</TaxTag>
                  </span>
                  <span>{second ? <TaxTag>{second}</TaxTag> : null}</span>
                </div>
              ))}
            </div>
          </DiagramCard>
        </div>
      </Scroll>
    </DiagramFrame>
  )
}

/* ── 04 · An exception, as the officer sees it. ── */

const TESTS = [
  ["Classify", "the line, by what it is", "fee, not interest"],
  ["Compute", "what the rule expects", "7.5% of 62,000,000"],
  ["Compare", "with declared and remitted", "nil declared"],
]

const FIELDS: [string, string, boolean?][] = [
  ["Figure", "Interest ledger, line 2,318 · 62,000,000"],
  ["Source", "Trial balance v2 · accepted 14 Mar"],
  ["Rule", "VAT Act, First Schedule · fees are VATable"],
  ["Read by", "AI extraction from scanned TB · confidence 0.91", true],
  ["Status", "Assigned · awaiting officer decision"],
]

export function ReckonException({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="An exception, as the officer sees it."
      subtitle="Figure, source, rule, and where AI was used to read the input."
      footnote="Concept illustration · Illustrative figures"
    >
      <Scroll min={900}>
        <div className="grid grid-cols-[minmax(0,5.6fr)_minmax(0,2.4fr)_minmax(0,10.8fr)] items-center">
          <div className="flex flex-col gap-4">
            {TESTS.map(([head, what, example]) => (
              <DiagramCard
                key={head}
                className="flex flex-col gap-1.5 px-5 py-4 font-mono text-sm"
              >
                <Caps className="text-xs text-accent-ink">{head}</Caps>
                <span className="text-ink">{what}</span>
                <span className="text-ink-soft">{example}</span>
              </DiagramCard>
            ))}
          </div>
          <svg
            viewBox="0 0 100 300"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden
          >
            {[50, 150, 250].map((y) => (
              <path
                key={y}
                d={`M0 ${y} C 45 ${y}, 40 150, 72 150`}
                fill="none"
                className="stroke-ink/60"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path
              d="M72 150 H100"
              fill="none"
              className="stroke-accent-ink"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <DiagramCard className="flex flex-col gap-5 p-6 font-mono text-sm ring-accent-ink">
            <Caps>Exception 0142 · VAT · above threshold</Caps>
            <div className="flex flex-col gap-1 border-b border-line pb-5">
              <span className="text-3xl text-accent-ink tabular-nums lg:text-4xl">
                ₦4,650,000
              </span>
              <span className="text-ink-soft">
                Output VAT expected on a ₦62,000,000 fee posted to the interest
                ledger.
              </span>
            </div>
            <dl className="flex flex-col gap-2.5">
              {FIELDS.map(([field, value, ai]) => (
                <div
                  key={field}
                  className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4"
                >
                  <dt>
                    <Caps>{field}</Caps>
                  </dt>
                  <dd
                    className={cn(
                      ai
                        ? "-mx-2 rounded-md bg-accent-ink/10 px-2 py-1 text-accent-ink"
                        : "text-ink"
                    )}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-3 pt-1">
              <span className="bg-accent-ink px-5 py-2.5 text-xs tracking-wider text-white uppercase dark:text-neutral-950">
                Raise finding
              </span>
              <span className="px-5 py-2.5 text-xs tracking-wider text-ink uppercase ring-1 ring-ink/60">
                Dismiss, with reason
              </span>
            </div>
          </DiagramCard>
        </div>
      </Scroll>
    </DiagramFrame>
  )
}

/* ── 05 · Three years, papered as 364 days. ── */

export function ReckonYears({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="Three years, papered as 364 days."
      subtitle="The series is the instrument."
      footnote="Concept illustration · Illustrative case"
    >
      <Scroll min={900}>
        <div className="flex flex-col gap-6 font-mono text-sm">
          <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-2">
            <span />
            <div className="relative grid grid-cols-3">
              {["2023", "2024", "2025"].map((year) => (
                <span
                  key={year}
                  className="border-l border-ink/20 pb-3 pl-1 text-ink-soft"
                >
                  {year}
                </span>
              ))}
              <span className="absolute top-0 right-0 pr-1 text-ink-soft">
                2026
              </span>
              <span className="absolute top-0 right-0 bottom-[-136px] w-px bg-ink/20" />
            </div>

            <Caps className="self-center">As filed</Caps>
            <div className="grid grid-cols-3 gap-2 border-l border-ink/20 pl-1">
              {["", " · renewed", " · renewed"].map((tail, index) => (
                <DiagramCard
                  key={index}
                  className="rounded-none px-3 py-2 text-ink ring-ink/70"
                >
                  364 days · ₦5,000,000,000{tail}
                </DiagramCard>
              ))}
            </div>

            <span className="h-8" />
            <span className="h-8 border-l border-ink/20" />

            <Caps className="self-center">As read</Caps>
            <div className="border-l border-ink/20 pl-1">
              <div className="bg-accent-ink px-4 py-2 text-white dark:text-neutral-950">
                one three-year borrowing, same borrower, same amount · dutiable
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 pl-[104px]">
            <p className="text-ink">
              Stamp duty on borrowings over one year. Remitted on this facility:
              nil. Expected: ₦6,250,000. Exception raised.
            </p>
            <p className="text-ink-soft">Illustrative case.</p>
          </div>
        </div>
      </Scroll>
    </DiagramFrame>
  )
}

/* ── 06 · Rules, then judgement. ── */

const STAGES: { head: string; items: string[]; on?: boolean }[] = [
  {
    head: "The administration sets",
    items: [
      "tax treatments",
      "thresholds by industry",
      "document checklist",
      "reporting lines",
    ],
  },
  {
    head: "Reckon applies",
    items: [
      "same rules, every line",
      "same result, any team",
      "AI reads scans, labelled",
    ],
  },
  {
    head: "The officer decides",
    items: [
      "reviews each exception",
      "raises or dismisses",
      "supervisor approves",
    ],
    on: true,
  },
]

export function ReckonJudgement({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="Rules, then judgement."
      subtitle="The administration sets the rules. Reckon applies them. The officer decides."
    >
      <div className="grid gap-3 font-mono text-sm lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)_64px_minmax(0,1fr)] lg:items-stretch lg:gap-0">
        {STAGES.map((stage, index) => (
          <React.Fragment key={stage.head}>
            {index > 0 ? (
              <div className="hidden items-center px-2 lg:flex">
                <ArrowRight />
              </div>
            ) : null}
            <DiagramCard
              className={cn(
                "flex min-h-[200px] flex-col gap-4 px-6 py-5",
                stage.on && "ring-accent-ink"
              )}
            >
              <Caps className={cn("text-xs", stage.on && "text-accent-ink")}>
                {stage.head}
              </Caps>
              <ul className="flex flex-col gap-3 text-ink">
                {stage.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </DiagramCard>
          </React.Fragment>
        ))}
      </div>
    </DiagramFrame>
  )
}

/* ── 07 · One finding, traced. ── */

const CHAIN: [string, string, string][] = [
  ["Document", "v3", "accepted 14 Mar"],
  ["Line", "2,318", "interest ledger"],
  ["Rule", "v2026.2", "VAT 7.5% on fees"],
  ["Review", "officer", "raised 02 Apr"],
  ["Approval", "supervisor", "03 Apr"],
  ["Finding", "₦4,650,000", "objected"],
]

export function ReckonTraced({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="One finding, traced."
      subtitle="Every object in the chain is versioned."
    >
      <div className="flex flex-col gap-8">
        <Scroll min={960}>
          <div className="grid grid-cols-[repeat(6,minmax(0,1fr))] items-stretch font-mono text-sm">
            {CHAIN.map(([head, version, note], index) => {
              const last = index === CHAIN.length - 1
              return (
                <div key={head} className="relative pr-6 last:pr-0">
                  <Panel head={head} on={last} center className="h-full">
                    <MarkedRow mark="▤">{version}</MarkedRow>
                    <MarkedRow mark="⚑">{note}</MarkedRow>
                  </Panel>
                  {last ? null : (
                    <span className="absolute top-[64%] right-0 h-px w-6 bg-ink/70" />
                  )}
                </div>
              )
            })}
          </div>
        </Scroll>
        <p className="font-mono text-sm text-ink-soft">
          Every object is versioned. The record that raised the finding is the
          record produced at objection.
        </p>
      </div>
    </DiagramFrame>
  )
}

/* ── 08 · Three uses of one engine. ── */

const TIERS = [
  {
    tier: "Tier 1",
    name: "Desk review",
    sub: "Every filing, on receipt",
    rows: [
      ["Scope", "current return v prior periods"],
      ["Officer", "none, unless escalated"],
      ["Steps", "reconcile, test threshold"],
      ["Output", "cleared, or escalated"],
    ],
    uses: "Uses 5 of 7 engine modules",
    modules: [0, 1, 2, 3, 4],
  },
  {
    tier: "Tier 2",
    name: "Audit",
    sub: "Risk-selected or escalated cases",
    rows: [
      ["Scope", "multi-year profile, all documents"],
      ["Officer", "assigned; supervisor approves"],
      ["Steps", "evidence request, fieldwork, exceptions, findings"],
      ["Output", "findings; reconciliation or tribunal"],
    ],
    uses: "Uses 6 of 7 engine modules",
    modules: [0, 1, 2, 3, 4, 5],
  },
  {
    tier: "Tier 3",
    name: "Investigation",
    sub: "Enforcement-led cases",
    rows: [
      ["Scope", "transactions, accounts, related parties"],
      ["Officer", "investigation team"],
      ["Steps", "trace flows, link parties, build record"],
      ["Output", "enforcement record"],
    ],
    uses: "Uses 4 of 7 engine modules",
    modules: [2, 4, 5, 6],
    on: true,
  },
]

const MODULES = [
  "Harmonise",
  "Map",
  "Reconcile",
  "Flag",
  "Taxpayer record",
  "Evidence record",
  "Tracing",
]

const ESCALATIONS = [
  ["above", "threshold"],
  ["enforcement", "signal"],
]

export function ReckonEngine({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={eyebrow(fig)}
      title="Three uses of one engine."
      subtitle="Each tier has its own trigger, scope, officer and output, and draws on the modules it needs."
    >
      <Scroll min={980}>
        <div className="flex flex-col font-mono text-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)_72px_minmax(0,1fr)]">
            {TIERS.map((tier, index) => (
              <React.Fragment key={tier.tier}>
                {index > 0 ? (
                  <div className="flex flex-col items-center gap-1 pt-12 text-center text-[11px] text-accent-ink">
                    <span>{ESCALATIONS[index - 1][0]}</span>
                    <svg
                      viewBox="0 0 40 10"
                      className="h-2.5 w-full"
                      aria-hidden
                    >
                      <path
                        d="M0 5 H34"
                        className="stroke-accent-ink"
                        strokeWidth="1.4"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d="M32 1 L40 5 L32 9 Z"
                        className="fill-accent-ink"
                      />
                    </svg>
                    <span>{ESCALATIONS[index - 1][1]}</span>
                  </div>
                ) : null}
                <DiagramCard
                  className={cn(
                    "flex flex-col overflow-clip",
                    tier.on && "ring-accent-ink"
                  )}
                >
                  <div className="flex flex-col gap-1.5 border-b border-line px-5 py-4">
                    <Caps>{tier.tier}</Caps>
                    <span className="text-xl text-ink">{tier.name}</span>
                    <span className="text-ink-soft">{tier.sub}</span>
                  </div>
                  {tier.rows.map(([field, value]) => (
                    <div
                      key={field}
                      className="flex flex-col gap-1 border-b border-line px-5 py-3"
                    >
                      <Caps>{field}</Caps>
                      <span className="text-ink">{value}</span>
                    </div>
                  ))}
                  <div className="px-5 py-3">
                    <Caps>{tier.uses}</Caps>
                  </div>
                </DiagramCard>
              </React.Fragment>
            ))}
          </div>

          {/* Which modules each tier draws on: tier foot to module head. */}
          <svg
            viewBox="0 0 1000 160"
            preserveAspectRatio="none"
            className="h-32 w-full lg:h-40"
            aria-hidden
          >
            {TIERS.flatMap((tier, t) => {
              // Tier centres across the 1fr/72px/1fr/72px/1fr row.
              const x0 = [
                ((1000 - 144) / 3) * 0.5,
                500,
                1000 - ((1000 - 144) / 3) * 0.5,
              ][t]
              return tier.modules.map((m) => {
                const x1 = ((m + 0.5) / MODULES.length) * 1000
                return (
                  <path
                    key={`${t}-${m}`}
                    d={`M${x0} 0 C ${x0} 70, ${x1} 80, ${x1} 160`}
                    fill="none"
                    className={tier.on ? "stroke-accent-ink" : "stroke-ink/45"}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })
            })}
          </svg>

          <DiagramCard className="flex flex-col gap-4 p-3">
            <div className="grid grid-cols-7 gap-3">
              {MODULES.map((module) => (
                <div
                  key={module}
                  className="grid min-h-20 place-items-center bg-surface-raised px-2 text-center ring-1 ring-ink/40"
                >
                  <Caps className="text-[10px] text-ink">{module}</Caps>
                </div>
              ))}
            </div>
            <Caps className="px-1">
              Reckon engine · one instance, one set of rules, one record per
              taxpayer
            </Caps>
          </DiagramCard>
        </div>
      </Scroll>
    </DiagramFrame>
  )
}
