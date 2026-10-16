import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { Arrow } from "@/components/ui/arrow"
import { cn } from "@/lib/utils"

/*
 * Pill buttons with Daylight's rotated fill: on hover a tilted slab of the
 * fill colour swings up from below and floods the pill over a second, the
 * label lifting a pixel as its colour flips. Leaving is quick. At rest the
 * slab sits far enough below that its tilted corner clears even a wide pill.
 */
const button = cva(
  "group relative isolate inline-flex h-12 shrink-0 items-center gap-3 overflow-hidden rounded-full pr-5 pl-6 text-[0.9375rem] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 ease-expo-out outline-none focus-visible:ring-[3px] focus-visible:ring-accent-ink/50",
  {
    variants: {
      tone: {
        accent: "bg-accent text-on-accent hover:text-paper",
        ink: "bg-ink text-paper hover:text-on-accent",
        outline:
          "border border-line-strong text-ink hover:border-ink hover:text-paper",
        /* Over photography and the accent block: fixed colours, never themed. */
        light: "bg-white text-[#0c0c0d] hover:text-white",
        glass: "bg-white/15 text-white backdrop-blur-md hover:text-[#0c0c0d]",
      },
    },
    defaultVariants: { tone: "accent" },
  }
)

const FILL = {
  accent: "bg-ink",
  ink: "bg-accent",
  outline: "bg-ink",
  light: "bg-accent",
  glass: "bg-white",
} as const

type Tone = keyof typeof FILL

/** The slab and the label for any pill, link or native button. */
function ButtonInner({
  tone,
  children,
}: {
  tone: Tone
  children: React.ReactNode
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 translate-y-[350%] scale-[1.8] rotate-[15deg] rounded-lg transition-transform duration-500 ease-expo-out group-hover:translate-y-0 group-hover:rotate-[8deg] group-hover:duration-1000",
          FILL[tone]
        )}
      />
      <span className="transition-transform duration-300 ease-expo-out group-hover:-translate-y-px">
        {children}
      </span>
      <Arrow className="transition-transform duration-300 ease-expo-out group-hover:translate-x-0.5" />
    </>
  )
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
  children,
}: {
  href: string
  className?: string
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
      <Arrow className="transition-transform duration-300 ease-expo-out group-hover:translate-x-1" />
    </Link>
  )
}
