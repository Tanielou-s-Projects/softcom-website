import { cn } from "@/lib/utils"

/*
 * A section boundary drawn as registration marks: a corner at each edge of
 * the shell and a cross at its centre, joined by nothing. Marks the start of
 * a section without boxing it in.
 */
export function Crosshairs({ className }: { className?: string }) {
  const mark = "absolute top-0 size-5 text-line-strong"
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative shell h-5", className)}
    >
      <div className="relative h-full">
        <svg viewBox="0 0 20 20" className={cn(mark, "left-0")}>
          <path d="M0.5 0v20M0 10h10" stroke="currentColor" />
        </svg>
        <svg
          viewBox="0 0 20 20"
          className={cn(mark, "left-1/2 hidden -translate-x-1/2 md:block")}
        >
          <path d="M10 0v20M0 10h20" stroke="currentColor" />
        </svg>
        <svg viewBox="0 0 20 20" className={cn(mark, "right-0")}>
          <path d="M19.5 0v20M10 10h10" stroke="currentColor" />
        </svg>
      </div>
    </div>
  )
}
