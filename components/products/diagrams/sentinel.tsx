import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Caps,
  DiagramCard,
  DiagramFrame,
  Node,
} from "@/components/products/diagrams/frame"

/*
 * Sentinel's four diagrams from the copy deck (pages 22–25), rebuilt: the
 * same accounts, dates and amounts, the same layout, the site's type and
 * colour.
 */

/* ── Shared: a graph whose edges are SVG and whose labels are HTML ── */

const W = 1250
const H = 700
const pos = (x: number, y: number): React.CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
})

function Arrowheads() {
  return (
    <defs>
      {(["on", "off"] as const).map((kind) => (
        <marker
          key={kind}
          id={`sentinel-arrow-${kind}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path
            d="M1 1 L8 5 L1 9"
            fill="none"
            strokeWidth="1.6"
            className={kind === "on" ? "stroke-accent-ink" : "stroke-ink-soft"}
          />
        </marker>
      ))}
    </defs>
  )
}

/* ── 01 · See the connections. Follow the money. ── */

const NODES = [
  { id: "A", x: 236, y: 200, account: "Account A01", on: true },
  { id: "B", x: 860, y: 200, account: "Account B01", on: true },
  { id: "C", x: 603, y: 517, account: "Account C01", on: true },
  { id: "D", x: 80, y: 473, account: "Account D01" },
  { id: "E", x: 1175, y: 212, account: "Account E01" },
]

const EDGES = [
  // The selected path, A → B → C → A.
  { d: "M286 168 C 450 70, 680 70, 818 168", on: true },
  { d: "M902 228 C 1040 320, 1000 470, 652 512", on: true },
  { d: "M585 470 C 540 330, 420 220, 290 205", on: true },
  // Elsewhere: E → A and A → D.
  { d: "M1140 170 C 920 30, 500 20, 274 158", on: false },
  { d: "M212 244 L 108 428", on: false },
]

const AMOUNTS = [
  { x: 552, y: 72, date: "01 May", amount: "₦12.0M", on: true },
  { x: 990, y: 420, date: "02 May", amount: "₦11.8M", on: true },
  { x: 470, y: 356, date: "03 May", amount: "₦11.6M", on: true },
  { x: 900, y: 34, amount: "₦2.5M" },
  { x: 60, y: 330, amount: "₦4.2M" },
]

export function SentinelConnections({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={`Sentinel / ${fig.replace(/\D/g, "")}`}
      title="See the connections. Follow the money."
      subtitle="A connected view of accounts, counterparties and transaction paths."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
        {/* On a phone the graph keeps a readable width and scrolls. */}
        <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <div
            className="relative w-full min-w-[560px]"
            style={{ aspectRatio: `${W} / ${H}` }}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="absolute inset-0 size-full overflow-visible"
              aria-hidden
            >
              <Arrowheads />
              {EDGES.map((edge, index) => (
                <path
                  key={index}
                  d={edge.d}
                  fill="none"
                  strokeWidth={edge.on ? 4 : 2}
                  vectorEffect="non-scaling-stroke"
                  markerEnd={`url(#sentinel-arrow-${edge.on ? "on" : "off"})`}
                  className={edge.on ? "stroke-accent-ink" : "stroke-ink-soft"}
                  style={{ strokeWidth: edge.on ? 2.2 : 1.2 }}
                />
              ))}
            </svg>
            {AMOUNTS.map((label) => (
              <span
                key={label.amount}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center bg-surface-raised px-1.5 text-center"
                style={pos(label.x, label.y)}
              >
                {label.date ? (
                  <span className="font-mono text-[9px] tracking-wider text-ink-soft uppercase sm:text-[10px]">
                    {label.date}
                  </span>
                ) : null}
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums sm:text-base lg:text-lg",
                    label.on ? "text-accent-ink" : "text-ink-soft"
                  )}
                >
                  {label.amount}
                </span>
              </span>
            ))}
            {NODES.map((node) => (
              <span
                key={node.id}
                className="absolute flex -translate-x-1/2 -translate-y-[24px] flex-col items-center gap-1 text-center lg:-translate-y-[28px]"
                style={pos(node.x, node.y)}
              >
                <Node label={node.id} on={node.on} />
                <span className="text-xs whitespace-nowrap text-ink sm:text-sm lg:text-base">
                  Entity {node.id}
                </span>
                <span className="hidden text-xs whitespace-nowrap text-ink-soft sm:block">
                  {node.account}
                </span>
              </span>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-6 border-line lg:border-l lg:pl-10">
          <div className="flex flex-col gap-4">
            <Caps>Selected path</Caps>
            <p className="font-heading text-2xl text-ink">A → B → C → A</p>
            <p className="text-base text-ink">
              Three linked transfers over two days.
            </p>
          </div>
          <div className="flex flex-col gap-1 border-t border-line pt-6">
            <p className="font-heading text-4xl text-accent-ink tabular-nums lg:text-5xl">
              ₦11.6M
            </p>
            <p className="text-sm text-ink-soft">returned to account A01</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-heading text-xl text-ink">Circular flow</p>
            <p className="text-sm text-ink-soft">For further examination.</p>
          </div>
        </aside>
      </div>
    </DiagramFrame>
  )
}

/* ── 02 · From financial records to intelligence. ── */

function Triangle({ analysed }: { analysed?: boolean }) {
  const points = analysed
    ? { A: [50, 14], C: [16, 82], B: [84, 82] }
    : { A: [50, 14], B: [16, 82], C: [84, 82] }
  const [a, b, c] = analysed
    ? [points.A, points.C, points.B]
    : [points.A, points.B, points.C]
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[200px]">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <path
          d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]} Z`}
          fill="none"
          className={analysed ? "stroke-accent-ink" : "stroke-ink/25"}
          strokeWidth={analysed ? 1.6 : 1}
          vectorEffect="non-scaling-stroke"
        />
        {analysed ? (
          <path
            d="M44 52 A 7 7 0 1 0 51 45"
            fill="none"
            className="stroke-accent-ink"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            markerEnd="url(#sentinel-arrow-on)"
          />
        ) : null}
      </svg>
      {Object.entries(points).map(([id, [x, y]]) => (
        <span
          key={id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          <Node label={id} on={analysed} tint />
        </span>
      ))}
    </div>
  )
}

const STAGES = [
  {
    title: "Records",
    sub: "Statements and accounts",
    art: (
      <div className="relative mx-auto h-[150px] w-[200px]">
        {["PDF", "XLS", "SCAN"].map((format, index) => (
          <div
            key={format}
            className="absolute flex h-[96px] w-[140px] flex-col gap-2 rounded-md bg-surface p-3 ring-1 ring-ink/15"
            style={{ left: index * 22, top: index * 26 }}
          >
            <span className="font-mono text-xs text-ink-soft">{format}</span>
            {index === 2 ? (
              <span className="mt-2 flex flex-col gap-1.5">
                <span className="h-px w-3/4 bg-ink/20" />
                <span className="h-px w-1/2 bg-ink/20" />
                <span className="h-px w-2/3 bg-ink/20" />
              </span>
            ) : null}
          </div>
        ))}
      </div>
    ),
  },
  { title: "Connections", sub: "Accounts and parties", art: <Triangle /> },
  {
    title: "Analysis",
    sub: "Patterns and money flows",
    art: <Triangle analysed />,
  },
  {
    title: "Reporting",
    sub: "Maps, charts and reports",
    art: (
      <div className="mx-auto flex h-[150px] w-[190px] flex-col gap-3 rounded-md bg-surface-raised/50 p-3 ring-1 ring-ink/15">
        <span className="font-mono text-[10px] tracking-wider text-ink-soft uppercase">
          Investigation
        </span>
        <div className="flex flex-1 items-end gap-3 border-b border-ink/20 px-1">
          {[48, 100, 30, 68].map((h, i) => (
            <span
              key={i}
              className="flex-1 bg-accent-ink/15"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <span className="h-px w-full bg-ink/15" />
        <span className="h-px w-1/2 bg-ink/15" />
      </div>
    ),
  },
]

export function SentinelRecordsToIntelligence({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={`Sentinel / ${fig.replace(/\D/g, "")}`}
      title="From financial records to intelligence."
      subtitle="One connected path from source documents to an investigator’s view."
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <Arrowheads />
      </svg>
      <div className="flex flex-col gap-10">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STAGES.map((stage, index) => (
            <li key={stage.title} className="relative">
              <DiagramCard className="flex h-full flex-col gap-6 p-6">
                <span className="font-mono text-sm text-accent-ink tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex min-h-[170px] items-center">
                  {stage.art}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-xl text-ink lg:text-2xl">
                    {stage.title}
                  </span>
                  <span className="text-sm text-ink-soft">{stage.sub}</span>
                </div>
              </DiagramCard>
              {index < STAGES.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-1/2 -right-6 hidden -translate-y-1/2 text-ink-soft lg:block"
                >
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="text-center font-heading text-lg text-ink lg:text-xl">
          Different formats. Connected records. A clearer picture.
        </p>
      </div>
    </DiagramFrame>
  )
}

/* ── 03 · Bring the records together. ── */

const SOURCES = [
  { format: "PDF", what: "Bank statements" },
  { format: "XLS / CSV", what: "Transaction records" },
  { format: "SCAN", what: "Scanned statements" },
]

const TRANSACTIONS = [
  { date: "01 May", from: "E01", to: "A01", amount: "₦2,500,000" },
  { date: "01 May", from: "A01", to: "B01", amount: "₦12,000,000", on: true },
  { date: "01 May", from: "A01", to: "D01", amount: "₦4,200,000" },
  { date: "02 May", from: "B01", to: "C01", amount: "₦11,800,000", on: true },
  { date: "03 May", from: "C01", to: "A01", amount: "₦11,600,000", on: true },
]

export function SentinelRecords({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={`Sentinel / ${fig.replace(/\D/g, "")}`}
      title="Bring the records together."
      subtitle="Different source formats. Accounts and transactions examined together."
    >
      <div className="flex flex-col gap-8">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,5fr)_120px_minmax(0,11fr)] lg:gap-0">
          <div className="flex flex-col gap-4">
            {SOURCES.map((source) => (
              <DiagramCard
                key={source.format}
                className="flex flex-col gap-1 p-5"
              >
                <span className="font-heading text-xl text-accent-ink">
                  {source.format}
                </span>
                <span className="text-sm text-ink-soft">{source.what}</span>
              </DiagramCard>
            ))}
          </div>

          {/* Three sources gathered into one stream. */}
          <svg
            viewBox="0 0 120 300"
            preserveAspectRatio="none"
            className="hidden h-full w-full lg:block"
            aria-hidden
          >
            <path
              d="M0 50 C 60 50, 50 150, 80 150 M0 150 L 80 150 M0 250 C 60 250, 50 150, 80 150"
              fill="none"
              className="stroke-ink-soft"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M80 150 L 116 150"
              fill="none"
              className="stroke-accent-ink"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <DiagramCard className="overflow-x-auto">
            <div className="border-b border-line px-6 py-4">
              <Caps>Connected transaction records</Caps>
            </div>
            <table className="w-full min-w-[420px] border-separate border-spacing-y-1 px-3 pb-4 text-left text-sm lg:text-base">
              <thead>
                <tr>
                  {["Date", "From", "To", "Amount"].map((head) => (
                    <th key={head} className="px-3 pt-3 pb-1 font-normal">
                      <Caps>{head}</Caps>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((row) => (
                  <tr
                    key={`${row.from}-${row.to}`}
                    className={cn(
                      "text-ink tabular-nums",
                      row.on && "bg-accent-ink/10"
                    )}
                  >
                    <td className="rounded-l-md px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2">{row.from}</td>
                    <td className="px-3 py-2">{row.to}</td>
                    <td className="rounded-r-md px-3 py-2">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DiagramCard>
        </div>
        <p className="text-base text-ink-soft">
          Accounting records can be examined alongside statements.
        </p>
      </div>
    </DiagramFrame>
  )
}

/* ── 04 · Make the investigation visible. ── */

const DAYS = [
  { day: "01 May", into: 2.5, out: 16.2 },
  { day: "02 May", into: 0, out: 0 },
  { day: "03 May", into: 11.6, out: 0 },
]
const MAX = 20

function Bar({ value, on }: { value: number; on?: boolean }) {
  if (!value) return null
  return (
    <span
      className="relative flex w-7 flex-col justify-end lg:w-10"
      style={{ height: `${(value / MAX) * 100}%` }}
    >
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-ink tabular-nums lg:text-sm">
        {value}
      </span>
      <span className={cn("size-full", on ? "bg-accent-ink" : "bg-ink/25")} />
    </span>
  )
}

export function SentinelVisible({ fig }: { fig: string }) {
  return (
    <DiagramFrame
      eyebrow={`Sentinel / ${fig.replace(/\D/g, "")}`}
      title="Make the investigation visible."
      subtitle="A financial overview alongside the transactions that warrant examination."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,13fr)_minmax(0,8fr)] lg:gap-6">
        <DiagramCard className="flex flex-col gap-6 p-6 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Caps>Account A01</Caps>
              <span className="font-heading text-2xl text-ink">
                Money in and out
              </span>
            </div>
            <div className="flex gap-5 text-sm text-ink">
              <span className="flex items-center gap-2">
                <span className="size-3 bg-accent-ink" /> In
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3 bg-ink/25" /> Out
              </span>
            </div>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
            <div className="flex h-[220px] flex-col justify-between text-right text-xs text-ink-soft tabular-nums lg:h-[260px]">
              <span>₦M 20</span>
              <span>10</span>
              <span>0</span>
            </div>
            <div className="relative h-[220px] lg:h-[260px]">
              {[0, 50, 100].map((top) => (
                <span
                  key={top}
                  className="absolute inset-x-0 h-px bg-ink/15"
                  style={{ top: `${top}%` }}
                />
              ))}
              <div className="absolute inset-0 grid grid-cols-3">
                {DAYS.map((d) => (
                  <div
                    key={d.day}
                    className="flex items-end justify-center gap-2"
                  >
                    {d.into || d.out ? (
                      <>
                        <Bar value={d.into} on />
                        <Bar value={d.out} />
                      </>
                    ) : (
                      <span className="pb-6 text-sm text-ink-soft">0</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <span />
            <div className="grid grid-cols-3 pt-3 text-center text-sm text-ink-soft">
              {DAYS.map((d) => (
                <span key={d.day}>{d.day}</span>
              ))}
            </div>
            <span />
            <span className="pt-2 text-center text-xs text-ink-soft">
              Transaction date
            </span>
          </div>
        </DiagramCard>

        <div className="flex flex-col gap-6 rounded-2xl bg-accent-ink/10 p-6 lg:p-10">
          <div className="flex flex-col gap-3">
            <Caps className="text-accent-ink">Pattern for review</Caps>
            <span className="font-heading text-3xl text-ink">
              Circular flow
            </span>
            <span className="font-heading text-lg text-ink">
              A01 → B01 → C01 → A01
            </span>
          </div>
          <dl className="flex flex-col gap-4 border-t border-ink/15 pt-6 text-sm lg:text-base">
            {[
              ["01 May", "A01 → B01", "₦12.0M"],
              ["02 May", "B01 → C01", "₦11.8M"],
              ["03 May", "C01 → A01", "₦11.6M"],
            ].map(([day, path, amount]) => (
              <div
                key={day}
                className="grid grid-cols-[auto_1fr_auto] gap-6 tabular-nums"
              >
                <dt className="text-ink-soft">{day}</dt>
                <dd className="text-ink">{path}</dd>
                <dd className="text-ink">{amount}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex flex-col gap-1">
            <p className="text-base text-ink">
              ₦11.6M returns within two days.
            </p>
            <p className="text-sm text-ink-soft">
              Context and purpose require review.
            </p>
          </div>
        </div>
      </div>
    </DiagramFrame>
  )
}
