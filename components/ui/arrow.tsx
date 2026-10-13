import { cn } from "@/lib/utils"

/** The system's one arrow: a short shaft and an open head, drawn on a 16 grid. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  )
}
