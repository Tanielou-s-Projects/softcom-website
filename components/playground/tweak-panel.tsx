"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  ArrowsClockwise,
  ClipboardText,
  Sliders,
  X,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  renderHandoff,
  useOverrides,
} from "@/components/playground/override-context"
import { useComputedTokens } from "@/components/playground/use-tokens"
import { RAMPS } from "@/components/playground/palette"

/** The roles worth reaching for by hand. The rest follow from these. */
const ROLES = [
  "background",
  "foreground",
  "card",
  "popover",
  "primary",
  "secondary",
  "muted",
  "muted-foreground",
  "accent",
  "border",
  "ring",
  "brand-accent",
  "destructive",
  "success",
  "warning",
]

type Knob = { varName: string; label: string; min: number; max: number }

const COMPONENT_KNOBS: { component: string; label: string; knobs: Knob[] }[] = [
  {
    component: "button",
    label: "Button",
    knobs: [{ varName: "--button-radius", label: "Radius", min: 0, max: 40 }],
  },
  {
    component: "badge",
    label: "Badge",
    knobs: [{ varName: "--badge-radius", label: "Radius", min: 0, max: 40 }],
  },
  {
    component: "card",
    label: "Card",
    knobs: [{ varName: "--card-radius", label: "Radius", min: 0, max: 48 }],
  },
  {
    component: "input",
    label: "Input",
    knobs: [{ varName: "--input-radius", label: "Radius", min: 0, max: 40 }],
  },
]

function toPx(value: string, fallback = 10) {
  const n = parseFloat(value)
  if (Number.isNaN(n)) return fallback
  if (value.includes("rem")) return n * 16
  // 9999px and friends read as "fully round" — clamp so the slider stays usable.
  return Math.min(n, 9999)
}

export function TweakPanel({ onClose }: { onClose: () => void }) {
  const overrides = useOverrides()
  const { note, setNote, resetAll, count } = overrides
  const nothingToCopy = count === 0 && !note.trim()

  async function copy() {
    const text = renderHandoff({
      tokens: overrides.tokens,
      components: overrides.components,
      note: overrides.note,
    })
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard", {
        description: `${count} override${count === 1 ? "" : "s"} — paste it straight into chat.`,
      })
    } catch {
      toast.error("Couldn't reach the clipboard", {
        description:
          "Your browser blocked it; the page may need to be focused.",
      })
    }
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Sliders className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Tweak</span>
          {count > 0 && (
            <span className="rounded-full bg-ring/15 px-1.5 py-0.5 font-mono text-[10px] text-ring">
              {count}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Close tweak panel"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      <Tabs
        defaultValue="tokens"
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="border-b p-3">
          <TabsList className="w-full">
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="component">Component</TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="tokens" className="flex flex-col gap-6 p-4">
            <RadiusControl />
            <div className="flex flex-col gap-1">
              <PanelLabel>Colour roles</PanelLabel>
              <div className="flex flex-col">
                {ROLES.map((role) => (
                  <RoleRow key={role} role={role} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="component" className="flex flex-col gap-5 p-4">
            <ComponentTab />
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex flex-col gap-3 border-t p-4">
        <div className="flex flex-col gap-2">
          <PanelLabel>Note</PanelLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. sector cards feel too round, and the ring should be quieter…"
            className="min-h-20 resize-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex-1" disabled={nothingToCopy} onClick={copy}>
            <ClipboardText />
            Copy for chat
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reset all overrides"
            disabled={count === 0}
            onClick={resetAll}
          >
            <ArrowsClockwise />
          </Button>
        </div>
      </div>
    </aside>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  )
}

function RadiusControl() {
  const { tokens, setToken, resetToken } = useOverrides()
  const computed = useComputedTokens(["--radius"])
  const px = Math.round(
    toPx(tokens["--radius"] ?? computed["--radius"] ?? "0.625rem")
  )
  const overridden = "--radius" in tokens

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <PanelLabel>Radius base</PanelLabel>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            {px}px
          </span>
          {overridden && <ResetDot onClick={() => resetToken("--radius")} />}
        </div>
      </div>
      <Slider
        value={[px]}
        min={0}
        max={24}
        step={1}
        onValueChange={(v) =>
          setToken("--radius", `${(Array.isArray(v) ? v[0] : v) / 16}rem`)
        }
      />
      <span className="text-[11px] text-muted-foreground">
        Scales the whole sm → 4xl ramp.
      </span>
    </div>
  )
}

function RoleRow({ role }: { role: string }) {
  const { tokens, setToken, resetToken } = useOverrides()
  const active = tokens[`--${role}`]

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm">{role}</span>
      <div className="flex items-center gap-1.5">
        {active && <ResetDot onClick={() => resetToken(`--${role}`)} />}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={`Edit ${role}`}
              className={cn(
                "size-6 rounded-md border ring-offset-1 transition-shadow hover:ring-2 hover:ring-ring/50",
                active && "ring-2 ring-ring/60"
              )}
              style={{ background: `var(--${role})` }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="flex flex-col gap-3">
              {RAMPS.map((ramp) => (
                <div key={ramp.name}>
                  <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">
                    {ramp.label}
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {ramp.steps.map((step) => (
                      <button
                        key={step.token}
                        type="button"
                        title={step.token}
                        onClick={() =>
                          setToken(`--${role}`, `var(${step.token})`)
                        }
                        className={cn(
                          "aspect-square rounded-md border transition-transform hover:scale-110",
                          step.className
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

function ComponentTab() {
  const allVars = React.useMemo(
    () => COMPONENT_KNOBS.flatMap((c) => c.knobs.map((k) => k.varName)),
    []
  )
  const computed = useComputedTokens(allVars)

  return (
    <>
      {COMPONENT_KNOBS.map((c) => (
        <div key={c.component} className="flex flex-col gap-2.5">
          <PanelLabel>{c.label}</PanelLabel>
          {c.knobs.map((knob) => (
            <KnobRow
              key={knob.varName}
              component={c.component}
              knob={knob}
              computed={computed[knob.varName]}
            />
          ))}
        </div>
      ))}
      <p className="text-[11px] text-muted-foreground">
        Knobs are plain CSS vars, so these move every instance at once.
      </p>
    </>
  )
}

function KnobRow({
  component,
  knob,
  computed,
}: {
  component: string
  knob: Knob
  computed?: string
}) {
  const { components, setComponent, resetComponent } = useOverrides()
  const override = components[component]?.[knob.varName]
  const raw = override ?? computed ?? "0"
  const isFull = toPx(raw) >= knob.max
  const px = Math.round(Math.min(toPx(raw), knob.max))
  const overridden = override != null

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{knob.label}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            {isFull && !overridden ? "full" : `${px}px`}
          </span>
          {overridden && (
            <ResetDot onClick={() => resetComponent(component, knob.varName)} />
          )}
        </div>
      </div>
      <Slider
        value={[px]}
        min={knob.min}
        max={knob.max}
        step={1}
        onValueChange={(v) =>
          setComponent(
            component,
            knob.varName,
            `${Array.isArray(v) ? v[0] : v}px`
          )
        }
      />
    </div>
  )
}

function ResetDot({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Reset"
      className="flex size-5 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <ArrowsClockwise className="size-3" />
    </button>
  )
}
