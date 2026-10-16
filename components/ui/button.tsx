import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { Arrow } from "@/components/ui/arrow"
import { cn } from "@/lib/utils"

/*
 * Pill buttons as main had them: a solid pill that dims a touch on hover and
 * presses a pixel when clicked — no fill animation, no arrow. Tones keep the
 * rule that buttons on photographs or Softcom blue use fixed colours.
 */
const button = cva(
  "inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none select-none focus-visible:ring-[3px] focus-visible:ring-accent-ink/50 active:translate-y-px",
  {
    variants: {
      tone: {
        accent: "bg-accent text-on-accent hover:bg-accent/90",
        ink: "bg-ink text-paper hover:bg-ink/90",
        outline: "border border-line-strong text-ink hover:bg-surface-raised",
        /* Over photography and the accent block: fixed colours, never themed. */
        light: "bg-white text-[#0c0c0d] hover:bg-white/90",
        glass: "bg-white/15 text-white backdrop-blur-md hover:bg-white/25",
      },
    },
    defaultVariants: { tone: "accent" },
  }
)

type Tone = NonNullable<VariantProps<typeof button>["tone"]>

/** The label for any pill, link or native button. */
function ButtonInner({ children }: { tone: Tone; children: React.ReactNode }) {
  return <>{children}</>
}

type ButtonLinkProps = VariantProps<typeof button> &
  Omit<React.ComponentProps<typeof Link>, "children" | "className"> & {
    children: React.ReactNode
    className?: string
  }

export function ButtonLink({
  tone,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(button({ tone }), className)} {...props}>
      <ButtonInner tone={tone ?? "accent"}>{children}</ButtonInner>
    </Link>
  )
}

/** The same pill as a native button, for forms. */
export function Button({
  tone,
  className,
  children,
  ...props
}: VariantProps<typeof button> &
  Omit<React.ComponentProps<"button">, "children"> & {
    children: React.ReactNode
  }) {
  return (
    <button
      className={cn(
        button({ tone }),
        "cursor-pointer disabled:cursor-wait disabled:opacity-70",
        className
      )}
      {...props}
    >
      <ButtonInner tone={tone ?? "accent"}>{children}</ButtonInner>
    </button>
  )
}

/**
 * An inline text link with the arrow, for "Read more"-weight actions. Its
 * underline grows from the left on hover.
 */
export function ArrowLink({
  href,
  className,
  arrow = true,
  children,
}: {
  href: string
  className?: string
  /** Off beside a pill, which already carries the arrow. */
  arrow?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 font-medium",
        className
      )}
    >
      <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-expo-out group-hover:after:scale-x-100">
        {children}
      </span>
      {arrow && (
        <Arrow className="transition-transform duration-300 ease-expo-out group-hover:translate-x-1" />
      )}
    </Link>
  )
}
