import Image from "next/image"

import { ButtonLink } from "@/components/ui/button"
import type { Navigation } from "@/content/site/chrome-copy"

type Cta = Navigation["closingCtas"]["home"]

/* A page's last word: a full-width photograph with one question and one door. */
export function ClosingCta({ copy, image }: { copy: Cta; image: string }) {
  return (
    <section className="shell mt-32 md:mt-48">
      <div className="relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden rounded-xl p-6 text-white md:min-h-[40rem] md:p-10">
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(0_0_0/0.65),rgb(0_0_0/0.05)_70%)]" />
        <p className="label text-white/70">{copy.lead}</p>
        <h2 className="mt-4 max-w-4xl text-display font-light">
          {copy.heading}
        </h2>
        <ButtonLink
          href={copy.buttonHref}
          tone="light"
          className="mt-10 self-start"
        >
          {copy.buttonLabel}
        </ButtonLink>
      </div>
    </section>
  )
}
