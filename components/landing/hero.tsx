import { cn } from "@/lib/utils"
import { HeroMark } from "@/components/landing/hero-mark"
import { displayText } from "@/components/landing/section"

function Hero() {
  return (
    <section
      className={cn(
        "relative flex w-full flex-col gap-10 overflow-clip px-6 pt-36 pb-16",
        "lg:block lg:h-[1024px] lg:p-0"
      )}
    >
      <h1
        className={cn(
          displayText,
          "order-1 text-foreground",
          "lg:absolute lg:top-[19.629%] lg:left-[10.069%] lg:w-[37.153%]"
        )}
      >
        Technology for Organisations.
      </h1>

      <p
        className={cn(
          displayText,
          "order-3 self-end text-right text-foreground",
          "lg:absolute lg:top-[77.637%] lg:left-[61.944%] lg:w-[28.958%] lg:text-left"
        )}
      >
        Progress for Society.
      </p>

      <HeroMark
        className={cn(
          "order-2 w-full",
          "lg:absolute lg:top-[15.527%] lg:left-[11.667%] lg:w-[75%]"
        )}
      />
    </section>
  )
}

export { Hero }
