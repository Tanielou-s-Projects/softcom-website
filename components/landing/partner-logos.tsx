import { partners, type Partner } from "@/components/landing/content"
import { cn } from "@/lib/utils"

/** Area every logo is given, so wide and square marks weigh the same. */
const AREA = 5200
const MAX_HEIGHT = 68

/** Width and height for a logo, by area rather than by height alone. */
function sizeOf({ width, height }: Partner) {
  const ratio = width / height
  const h = Math.min(MAX_HEIGHT, Math.sqrt(AREA / ratio))
  return { width: Math.round(h * ratio), height: Math.round(h) }
}

/**
 * One logo as a silhouette in the current text colour: the file is used as a
 * mask, so the row follows the theme and every partner sits in one ink.
 */
function Logo({ partner }: { partner: Partner }) {
  const { width, height } = sizeOf(partner)
  return (
    <span
      role="img"
      aria-label={partner.name}
      title={partner.name}
      className="block shrink-0 bg-current transition-colors duration-300"
      style={{
        width,
        height,
        maskImage: `url(${partner.logo})`,
        WebkitMaskImage: `url(${partner.logo})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  )
}

/**
 * The partner strip under "Who we work with": the logos run past in one
 * slow loop that pauses under the pointer. With reduced motion it is a still,
 * wrapped row. The list is rendered twice for a seamless loop; the copy is
 * hidden from assistive tech.
 */
function PartnerLogos({ className }: { className?: string }) {
  return (
    <section
      aria-label="Organisations we have worked with"
      className={cn("flex flex-col gap-6", className)}
    >
      <div
        className={cn(
          "group relative overflow-hidden py-3 text-foreground/55",
          // Fade the ends so logos arrive and leave rather than clip.
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
          "motion-reduce:[mask-image:none]"
        )}
      >
        <div className="flex w-max animate-[partner-marquee_60s_linear_infinite] items-center group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-8">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className={cn(
                "flex shrink-0 items-center gap-16 pr-16 lg:gap-24 lg:pr-24",
                copy === 1 && "motion-reduce:hidden",
                "motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0"
              )}
            >
              {partners.map((partner) => (
                <li key={partner.name} className="hover:text-foreground">
                  <Logo partner={partner} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}

export { PartnerLogos }
