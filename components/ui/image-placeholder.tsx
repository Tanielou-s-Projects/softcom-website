import { cn } from "@/lib/utils"

/*
 * Stands in for every image while the site is rebuilt from scratch: a
 * hairline frame with a picture icon at its centre. Fills its parent, so it
 * takes whatever size and shape the layout gives the image slot.
 */
export function ImagePlaceholder({
  label,
  className,
}: {
  /** What the image will show, for screen readers. */
  label?: string
  className?: string
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        "flex size-full items-center justify-center bg-ink/[0.04] text-ink-faint ring-1 ring-line ring-inset",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        className="size-8"
      >
        <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
        <circle cx="8.5" cy="9.5" r="1.75" />
        <path d="m3.5 17.5 5.25-5.25 3.75 3.75 2.75-2.75 5.25 5.25" />
      </svg>
    </div>
  )
}
