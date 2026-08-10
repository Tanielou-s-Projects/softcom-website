/* eslint-disable @next/next/no-img-element -- local SVGs, intentionally not run through next/image */
"use client"

import * as React from "react"
import { Dithering, ImageDithering } from "@paper-design/shaders-react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"
import { useComputedTokens } from "@/components/playground/use-tokens"
import { sectors } from "@/components/landing/content"

/** Ordered-dither matrices the shader supports, plus plain random. */
const TYPES = ["random", "2x2", "4x4", "8x8"] as const
type DitherType = (typeof TYPES)[number]

/** Pattern sources the procedural shader can dither. */
const SHAPES = [
  "simplex",
  "warp",
  "dots",
  "wave",
  "ripple",
  "swirl",
  "sphere",
] as const
type DitherShape = (typeof SHAPES)[number]

/**
 * Only the brand tokens are read at runtime, and only because ours are declared
 * as literal hex. Tailwind's own ramp is `oklch()`, which the shader's colour
 * parser does not accept — passing `--color-neutral-950` silently yields grey.
 *
 * The backdrop is therefore transparent, which is better anyway: the canvas
 * composites over whatever surface it sits on, so it follows the theme for free
 * instead of hardcoding a background per mode.
 */
const COLOR_TOKENS = ["--color-brand-cyan", "--color-brand-blue"] as const

/** Fully transparent, so the surface behind the canvas shows through. */
const TRANSPARENT = "#00000000"

function ControlRow({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label className="text-xs">{label}</Label>
        {hint && <TokenLabel>{hint}</TokenLabel>}
      </div>
      {children}
    </div>
  )
}

export function DitherSection() {
  const token = useComputedTokens(COLOR_TOKENS)
  // Literal fallbacks keep the first paint sane, before the effect has read.
  const cyan = token["--color-brand-cyan"] || "#00ffff"
  const blue = token["--color-brand-blue"] || "#004bff"

  const [shape, setShape] = React.useState<DitherShape>("dots")
  const [proceduralType, setProceduralType] = React.useState<DitherType>("4x4")
  const [proceduralSize, setProceduralSize] = React.useState(3)
  const [speed, setSpeed] = React.useState(0.6)

  const [imageType, setImageType] = React.useState<DitherType>("4x4")
  const [imageSize, setImageSize] = React.useState(3)
  const [colorSteps, setColorSteps] = React.useState(2)
  const [inverted, setInverted] = React.useState(false)

  const publicSector = sectors[0]

  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Against the design">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          The sector marks are a uniform grid of same-size circles where only
          brightness varies — an ordered dither, not a size-modulated halftone.
          Figma ships them as flat SVG layers, which is why they cannot yet
          carry sector-specific imagery or react to hover. The shader is the
          mechanism that would let them.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex h-[220px] items-center justify-center rounded-(--card-radius) bg-popover">
              {/* Mirrors the landing implementation: layered exports, no shader. */}
              <div
                className="relative overflow-clip"
                style={{
                  width: publicSector.illustration.width,
                  height: publicSector.illustration.height,
                }}
              >
                {publicSector.illustration.layers.map((layer) => (
                  <div
                    key={layer.src}
                    className="absolute"
                    style={{ inset: layer.inset }}
                  >
                    <img
                      src={layer.src}
                      alt=""
                      className="absolute inset-0 block size-full max-w-none"
                    />
                  </div>
                ))}
              </div>
            </div>
            <TokenLabel>Figma export · static SVG</TokenLabel>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-[220px] overflow-clip rounded-(--card-radius)">
              <Dithering
                style={{ width: "100%", height: "100%" }}
                colorBack={TRANSPARENT}
                colorFront={cyan}
                shape="dots"
                type="4x4"
                size={3}
                speed={0}
              />
            </div>
            <TokenLabel>Shader · dots, 4×4 Bayer, speed 0</TokenLabel>
          </div>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Procedural">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          Generates its own pattern, so it animates without a source image. The
          candidate for the hero.
        </p>
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="h-[300px] overflow-clip rounded-(--card-radius)">
            <Dithering
              style={{ width: "100%", height: "100%" }}
              colorBack={TRANSPARENT}
              colorFront={shape === "dots" ? cyan : blue}
              shape={shape}
              type={proceduralType}
              size={proceduralSize}
              speed={speed}
            />
          </div>

          <div className="flex flex-col gap-4">
            <ControlRow label="Shape">
              <Select
                value={shape}
                onValueChange={(v) => setShape(v as DitherShape)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHAPES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ControlRow>

            <ControlRow label="Matrix">
              <Select
                value={proceduralType}
                onValueChange={(v) => setProceduralType(v as DitherType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ControlRow>

            <ControlRow label="Grid size" hint={`${proceduralSize}px`}>
              <Slider
                value={[proceduralSize]}
                min={1}
                max={20}
                step={1}
                onValueChange={(v) =>
                  setProceduralSize(Array.isArray(v) ? v[0] : v)
                }
              />
            </ControlRow>

            <ControlRow label="Speed" hint={speed.toFixed(1)}>
              <Slider
                value={[speed * 10]}
                min={0}
                max={20}
                step={1}
                onValueChange={(v) =>
                  setSpeed((Array.isArray(v) ? v[0] : v) / 10)
                }
              />
            </ControlRow>
          </div>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="From an image">
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          Dithers a source bitmap. This is the one that matters for the sector
          marks — point it at a government building or a padlock and the grid
          renders that instead of an abstract field. Demonstrated on a photo
          because we have no sector artwork yet.
        </p>
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="h-[300px] overflow-clip rounded-(--card-radius)">
            <ImageDithering
              style={{ width: "100%", height: "100%" }}
              image="/landing/team-02.png"
              colorBack={TRANSPARENT}
              colorFront={cyan}
              colorHighlight={blue}
              type={imageType}
              size={imageSize}
              colorSteps={colorSteps}
              inverted={inverted}
              fit="cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <ControlRow label="Matrix">
              <Select
                value={imageType}
                onValueChange={(v) => setImageType(v as DitherType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ControlRow>

            <ControlRow label="Grid size" hint={`${imageSize}px`}>
              <Slider
                value={[imageSize]}
                min={1}
                max={20}
                step={1}
                onValueChange={(v) => setImageSize(Array.isArray(v) ? v[0] : v)}
              />
            </ControlRow>

            <ControlRow label="Colour steps" hint={String(colorSteps)}>
              <Slider
                value={[colorSteps]}
                min={1}
                max={7}
                step={1}
                onValueChange={(v) =>
                  setColorSteps(Array.isArray(v) ? v[0] : v)
                }
              />
            </ControlRow>

            <div className="flex items-center justify-between">
              <Label htmlFor="dither-inverted" className="text-xs">
                Inverted
              </Label>
              <Switch
                id="dither-inverted"
                checked={inverted}
                onCheckedChange={setInverted}
              />
            </div>
          </div>
        </div>
        <TokenLabel className="mt-3 block">
          Colours come from the Tier 1 brand tokens, read at runtime — the
          shader needs a real value, so the `var()`-chained roles are not usable
          here.
        </TokenLabel>
      </SpecimenGroup>
    </div>
  )
}
