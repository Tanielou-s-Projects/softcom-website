# Reference sites — how they're built and how they move

Research for the from-scratch rebuild (branch `refactor/rebuild-from-scratch`),
October 2026. One report per site, each covering the stack, global systems,
every page section by section with its animation, and the patterns worth
borrowing:

| Site | Report | Stack | Motion in one line |
| --- | --- | --- | --- |
| Stereolabs | [stereolabs.md](stereolabs.md) | Next.js + Sanity, vanilla-extract, Mux | Almost none in code: video carries it; CSS transitions on the header, menu and accordion |
| Shopify Ventures | [shopifyvc.md](shopifyvc.md) | Hydrogen/Remix, Tailwind v4 | No libraries: a hand-built Canvas 2D ASCII engine, CSS keyframes, IntersectionObserver |
| Bequant | [bequant.md](bequant.md) | Webflow, GSAP + ScrollTrigger, Lenis, Lottie | Mask "typewriter" text reveals, a nav that re-docks on scroll, panels that scrub to full width |
| Daylight | [daylight.md](daylight.md) | Next.js + Sanity, Tailwind v4, GSAP (SplitText, ScrambleText), Lenis, Rive | The most engineered: intro that clips into a window, scrubbed stacks, masked line reveals |
| Varsity | [varsity.md](varsity.md) | Webflow, GSAP (ScrollTrigger, SplitText, Flip), Lenis, Three.js | A one-pager with a 5,600px pinned hero timeline, sticky colour cards, Flip collages |

The screenshots behind the reports were saved to the job's scratch folder and
are not in the repo.

## What they have in common

- **A floating, inset header.** Stereolabs and Daylight float a white card
  20px in from the edges. Stereolabs and Varsity hide it on scroll down and
  bring it back on scroll up (0.2–0.35s). Bequant re-docks its menu pill to
  the right as you scroll.
- **One light grotesk with an uppercase mono for labels.** Every site pairs a
  display face set light and tight with small uppercase mono metadata.
- **One accent colour, used sparingly**, with per-item colour where content
  has an identity: Bequant per product line, Varsity per company and person
  (from the CMS).
- **Drawn structure.** Hairline grids (Daylight, Varsity), crosshair rows and
  corner brackets (Stereolabs), dashed rules (Bequant).
- **Slow CSS logo marquees** (Stereolabs 96–200s, Daylight pauses on hover).
- **Restraint where it counts.** Stereolabs and Shopify Ventures prove a site
  can feel alive with video, hover states and one signature effect.
  Daylight's showpiece motion is on Home only; its other pages use simple
  fade-ups.

## A motion system for Softcom

Softcom already has its signature effect: the dither (`lib/dither.ts`). Shopify
Ventures shows the value of one custom canvas engine used everywhere; Softcom's
equivalent is the weave. The recommendation is to let the dither carry the
brand moments and keep everything else quiet and consistent.

1. **Signature: the dither weave.** Page transitions (done), accent blocks
   that weave in on scroll (done on Home's numbers), page-hero marks on
   Solutions, Products and Insights (to port from the old design), the dotted
   footer wordmark and the sector marks (done).
2. **Text: masked line rise** (Daylight). Headlines split by line, each line
   rising from `yPercent: 100` inside a mask, about 0.66s with a 0.15s
   stagger, once on entering view. Optionally Bequant's typewriter for mono
   labels only.
3. **Header: hide on scroll down, show on scroll up** (Stereolabs, Varsity),
   0.25s. Sub-pages with sections (products) get Stereolabs' sticky sub-nav.
4. **Sections: one reveal.** Fade and rise 16–24px on entering view, staggered
   inside grids. No section-specific choreography beyond Home.
5. **Pinned moments, sparingly.** At most one per page, CSS `position: sticky`
   first (Shopify Ventures pins its heroes with sticky, no ScrollTrigger).
   Candidates: Varsity's sticky stacked cards for focus areas; Daylight's
   stacked steps for "how we work".
6. **Hovers.** Buttons darken (Stereolabs) or flood (Daylight's rotated fill);
   list rows tint with the item's colour (Varsity); cards reveal a ticker
   (Shopify Ventures) for insights and case studies.
7. **Media.** When photography returns: Bequant's wipe-open (width 0 → full)
   and Daylight's clip-path window for the Home hero.
8. **Scroll.** Native, or Lenis if pinned moments need it (Bequant, Daylight
   and Varsity all use `lerp` 0.07–0.12). Every effect respects reduced motion.

Libraries this implies: GSAP with ScrollTrigger and SplitText (all free since
GSAP 3.13), optionally Lenis. `motion` is already installed and covers in-view
reveals if GSAP is kept to pinned and scrubbed sections.
