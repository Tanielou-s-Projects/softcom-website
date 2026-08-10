/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
import { HeroMark } from "@/components/landing/hero-mark"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"

const LOGOS = [
  {
    src: "/brand/softcom-logo.svg",
    label: "Default",
    note: "All six letterforms in --foreground.",
  },
  {
    src: "/brand/softcom-logo-active.svg",
    label: "Active",
    note: "Both o's take brand cyan and blue. Hover state.",
  },
]

const DOTS = [
  { src: "/brand/accent-dot.svg", label: "Cyan", note: "story band" },
  { src: "/brand/accent-dot-2.svg", label: "Blue", note: "closing CTA" },
]

export function MarksSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Logo">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          The two files are byte-identical apart from two fills, so the header
          cross-fades between them rather than swapping geometry.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {LOGOS.map((logo) => (
            <div
              key={logo.src}
              className="flex flex-col gap-2 rounded-lg border p-3"
            >
              {/* The asset carries its own near-black plate, hence no bg here. */}
              <img src={logo.src} alt="Softcom" className="h-[51px] w-auto" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{logo.label}</span>
                <span className="text-[11px] text-muted-foreground">
                  {logo.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Wordmark">
        <div className="rounded-lg border bg-neutral-900 p-4">
          <img
            src="/brand/softcom-wordmark.svg"
            alt="Softcom"
            className="h-auto w-full"
          />
        </div>
        <TokenLabel className="mt-1.5 block">
          1268 × 284 · oversized, footer only
        </TokenLabel>
      </SpecimenGroup>

      <SpecimenGroup label="Hero capsule">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          A 346px-thick gradient-stroked line with a circle at each end matching
          the stroke width. Reload to replay the entrance — the circles start
          overlapped at the midpoint and separate as the bar draws itself.
        </p>
        <div className="rounded-(--card-radius) border bg-neutral-950 p-6">
          <HeroMark className="w-full" />
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Accent dots">
        <div className="flex flex-wrap gap-4">
          {DOTS.map((dot) => (
            <div
              key={dot.src}
              className="flex items-center gap-2.5 rounded-lg border p-3"
            >
              <img
                src={dot.src}
                alt=""
                width={26}
                height={26}
                className="size-[26px]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{dot.label}</span>
                <span className="text-[11px] text-muted-foreground">
                  {dot.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SpecimenGroup>
    </div>
  )
}
