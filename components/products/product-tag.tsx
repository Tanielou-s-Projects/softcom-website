import { cn } from "@/lib/utils"

/* Whose product it is: Softcom's own in the accent, a partner's in ink. */
export function ProductTag({
  kind,
  className,
}: {
  kind: "softcom" | "partner"
  className?: string
}) {
  return (
    <span
      className={cn(
        "label inline-flex h-6 items-center rounded-full border px-2.5",
        kind === "softcom"
          ? "border-accent/40 text-accent"
          : "border-line-strong text-ink-soft",
        className
      )}
    >
      {kind === "softcom" ? "Softcom" : "Partner"}
    </span>
  )
}

/** Two-digit index, as every numbered mono label on the site. */
export const pad = (n: number) => String(n).padStart(2, "0")
