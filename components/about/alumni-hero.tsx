import Image from "next/image"

import { cn } from "@/lib/utils"
import { displayText } from "@/components/landing/section"

/**
 * The Alumni hero: the team photograph, uncropped in spirit — framed wide
 * enough to show the whole group and the place — under a thin dark film so
 * the headline holds while faces stay clear.
 */
function AlumniHero({
  src,
  alt,
  title,
}: {
  src: string
  alt: string
  title: string
}) {
  return (
    <section className="dark relative h-svh min-h-[560px] overflow-hidden bg-black">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_60%]"
      />
      {/* The film: light overall, deepening only behind the headline, which
          sits in the sky so the group's faces stay clear. */}
      <div aria-hidden className="absolute inset-0 bg-black/20" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-black/60 to-transparent"
      />
      <h1
        className={cn(
          displayText,
          "absolute top-28 left-6 z-10 max-w-[14ch] text-foreground md:left-[3.2vw]"
        )}
      >
        {title}
      </h1>
    </section>
  )
}

export { AlumniHero }
