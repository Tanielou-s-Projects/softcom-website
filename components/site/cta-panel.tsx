import Image from "next/image"

import { cn } from "@/lib/utils"

/**
 * The photographic plate every page closes on: the same darkened image, the
 * same accent dot, only the copy and the dot's colour change.
 *
 * Figma pins it with `position: sticky` so the footer rides up over it as you
 * reach the bottom — which is why the panel and the footer have to stay
 * siblings inside the same wrapper on every page that uses it.
 *
 * Scoped `dark` because the backdrop is a dark photograph in either theme.
 */
function CtaPanel({
  accent = "blue",
  className,
  children,
}: {
  accent?: "blue" | "cyan"
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "dark relative flex h-[min(560px,80svh)] flex-col items-center gap-10 overflow-clip rounded-4xl pt-16",
        // Capped to the viewport so the pinned plate is always fully on screen.
        "lg:sticky lg:top-0 lg:h-[min(831px,88svh)] lg:gap-16 lg:pt-[8%]",
        className
      )}
    >
      <Image
        src="/landing/story.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-bottom"
      />
      <div aria-hidden className="absolute inset-0 bg-black/75" />

      {/*
       * A token rather than the exported SVG: the two colours are exactly the
       * brand ramp's anchors, so a circle and a class say it without shipping
       * two near-identical files.
       */}
      <span
        aria-hidden
        className={cn(
          "relative size-[26px] shrink-0 rounded-full",
          accent === "cyan" ? "bg-brand-cyan" : "bg-brand-blue"
        )}
      />

      {children}
    </div>
  )
}

export { CtaPanel }
