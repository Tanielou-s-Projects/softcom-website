import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-(--input-radius) border border-line-strong bg-line-strong/30 px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink placeholder:text-ink-soft focus-visible:border-accent-ink focus-visible:ring-[3px] focus-visible:ring-accent-ink/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/20 md:text-sm dark:aria-invalid:border-danger/50 dark:aria-invalid:ring-danger/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
