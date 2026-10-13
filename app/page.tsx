import Link from "next/link"

import { homePage, withYears } from "@/content/home/page-copy"
import { getPageContent } from "@/sanity/lib/page-content"

/*
 * Placeholder while the new design system is built: the home page's Sanity
 * content as a plain document, in browser defaults — no layout, no design.
 */
export default async function Page() {
  const copy = await getPageContent("homePage", homePage)
  const { hero, mission, focusAreas, whoWeWorkWith, partners, numbers } = copy
  const { approach, ourThinking } = copy

  return (
    <main className="mx-auto max-w-2xl space-y-12 p-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold">
          {hero.headlineFirstLine} {hero.headlineSecondLine}{" "}
          {hero.progressFirstLine} {hero.progressSecondLine}
        </h1>
        <p>
          {hero.statementBefore}
          {withYears(hero.statementHighlight)}
          {hero.statementAfter}
        </p>
        <p className="space-x-4 underline">
          <Link href={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
          <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">{mission.heading}</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mission.image} alt={mission.imageAlt} />
        <p>{mission.intro}</p>
        <p>{mission.body}</p>
        <Link className="underline" href={mission.cta.href}>
          {mission.cta.label}
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">{focusAreas.heading}</h2>
        <p>{focusAreas.intro}</p>
        {focusAreas.areas.map((area) => (
          <div key={area.title} className="space-y-2">
            <h3 className="text-xl font-semibold">{area.title}</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={area.image} alt="" />
            {area.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">{whoWeWorkWith.heading}</h2>
        <p>{whoWeWorkWith.intro}</p>
        {whoWeWorkWith.sectors.map((sector) => (
          <div key={sector.title} className="space-y-2">
            <h3 className="text-xl font-semibold">{sector.title}</h3>
            <p>{sector.description}</p>
            <ul className="list-disc pl-6">
              {sector.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">{partners.label}</h2>
        <ul className="list-disc pl-6">
          {partners.logos.map((logo) => (
            <li key={logo.name}>{logo.name}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <ul className="list-disc pl-6">
          {numbers.items.map((item) => (
            <li key={item.label}>
              <strong>{withYears(item.value)}</strong> {item.label}
            </li>
          ))}
        </ul>
        <p className="space-x-4 underline">
          <Link href={numbers.primaryCta.href}>{numbers.primaryCta.label}</Link>
          <Link href={numbers.secondaryCta.href}>
            {numbers.secondaryCta.label}
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">{approach.heading}</h2>
        <p>{approach.lead}</p>
        <p>{approach.body}</p>
        <Link className="underline" href={approach.cta.href}>
          {approach.cta.label}
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">{ourThinking.heading}</h2>
        <p>{ourThinking.intro}</p>
        {ourThinking.perspectives.map((item) => (
          <div key={item.title} className="space-y-1">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p>{item.summary}</p>
            <Link className="underline" href={item.href}>
              {ourThinking.readLabel}
            </Link>
          </div>
        ))}
        <Link className="underline" href={ourThinking.cta.href}>
          {ourThinking.cta.label}
        </Link>
      </section>
    </main>
  )
}
