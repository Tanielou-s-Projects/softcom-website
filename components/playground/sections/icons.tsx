"use client"

import * as React from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Bank,
  Briefcase,
  Buildings,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChartLine,
  Check,
  CheckCircle,
  Clock,
  Cloud,
  Database,
  DotsThree,
  Download,
  Envelope,
  Eye,
  File,
  Gear,
  Globe,
  Handshake,
  Info,
  LinkSimple,
  List,
  LockKey,
  MagnifyingGlass,
  MapPin,
  Newspaper,
  Phone,
  Plus,
  ShieldCheck,
  Sparkle,
  Stack,
  Target,
  TrendUp,
  User,
  Users,
  Warning,
  X,
  type Icon,
} from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"

/**
 * A curated set rather than all ~9,000 Phosphor glyphs — importing the whole
 * library into a page costs far more than it teaches. These are the ones a
 * corporate site reaches for; pull any other name straight from the package.
 */
const ICONS: [string, Icon][] = [
  ["ArrowRight", ArrowRight],
  ["ArrowUpRight", ArrowUpRight],
  ["Bank", Bank],
  ["Briefcase", Briefcase],
  ["Buildings", Buildings],
  ["CalendarBlank", CalendarBlank],
  ["CaretDown", CaretDown],
  ["CaretLeft", CaretLeft],
  ["CaretRight", CaretRight],
  ["ChartLine", ChartLine],
  ["Check", Check],
  ["CheckCircle", CheckCircle],
  ["Clock", Clock],
  ["Cloud", Cloud],
  ["Database", Database],
  ["DotsThree", DotsThree],
  ["Download", Download],
  ["Envelope", Envelope],
  ["Eye", Eye],
  ["File", File],
  ["Gear", Gear],
  ["Globe", Globe],
  ["Handshake", Handshake],
  ["Info", Info],
  ["LinkSimple", LinkSimple],
  ["List", List],
  ["LockKey", LockKey],
  ["MagnifyingGlass", MagnifyingGlass],
  ["MapPin", MapPin],
  ["Newspaper", Newspaper],
  ["Phone", Phone],
  ["Plus", Plus],
  ["ShieldCheck", ShieldCheck],
  ["Sparkle", Sparkle],
  ["Stack", Stack],
  ["Target", Target],
  ["TrendUp", TrendUp],
  ["User", User],
  ["Users", Users],
  ["Warning", Warning],
  ["X", X],
]

const SIZES = [
  { cls: "size-3", label: "size-3 · 12px", note: "nav carets" },
  { cls: "size-4", label: "size-4 · 16px", note: "button default" },
  { cls: "size-5", label: "size-5 · 20px" },
  { cls: "size-6", label: "size-6 · 24px" },
]

export function IconsSection() {
  const [query, setQuery] = React.useState("")
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? ICONS.filter(([name]) => name.toLowerCase().includes(q)) : ICONS
  }, [query])

  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Sizes">
        <div className="flex flex-wrap items-end gap-6">
          {SIZES.map((size) => (
            <div key={size.cls} className="flex flex-col items-center gap-1.5">
              <Sparkle className={size.cls} />
              <TokenLabel>{size.label}</TokenLabel>
              {size.note && (
                <span className="text-[10px] text-muted-foreground">
                  {size.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label={`Set · ${filtered.length} of ${ICONS.length}`}>
        <div className="relative mb-4">
          <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter icons…"
            aria-label="Filter icons"
            className="pl-9"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nothing matches “{query}”. Any Phosphor name works — import it
            directly.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {filtered.map(([name, Glyph]) => (
              <div
                key={name}
                title={name}
                className="flex flex-col items-center gap-1.5 rounded-lg border p-2.5"
              >
                <Glyph className="size-5" />
                <span className="w-full truncate text-center text-[10px] text-muted-foreground">
                  {name}
                </span>
              </div>
            ))}
          </div>
        )}
      </SpecimenGroup>
    </div>
  )
}
