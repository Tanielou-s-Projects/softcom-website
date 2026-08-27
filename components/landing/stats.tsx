"use client"

import { motion } from "motion/react"

import { stats } from "@/components/landing/content"
import { bodyText, Container, headingText } from "@/components/landing/section"
import { cn } from "@/lib/utils"

/**
 * Impact numbers — a clean row of big figures over short labels, after the
 * Employment Hero / Ramp pattern. Shared by the homepage and the About team
 * section; pass a `heading` for the standalone homepage block, omit it when the
 * numbers sit under another section's header.
 */
function Stats({
  heading,
  className,
}: {
  heading?: string
  className?: string
}) {
  return (
    <Container className={cn("flex flex-col gap-10 py-6 lg:gap-14", className)}>
      {heading ? (
        <h2 className={cn(headingText, "max-w-[18ch] text-foreground")}>
          {heading}
        </h2>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border pt-10 sm:grid-cols-4 sm:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col gap-2"
          >
            <dd className="font-heading text-5xl leading-[0.9] text-foreground lg:text-7xl">
              {stat.value}
            </dd>
            <dt className={cn(bodyText, "text-muted-foreground")}>
              {stat.label}
            </dt>
          </motion.div>
        ))}
      </dl>
    </Container>
  )
}

export { Stats }
