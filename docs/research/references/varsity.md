# Varsity (varsity.vc): how it is built and animated

Researched 2026-10-14 against the live site (Webflow, last published 2026-10-09). Screenshots are in `./varsity/`. Downloaded source is in `./varsity/js/` (custom scripts, scenes module, CSS, stories component) and `./varsity/inline.js` (inline page scripts). Probe scripts are `varsity-probe.mjs`, `varsity-interact.mjs`, `varsity-stories.mjs`, `varsity-flip.mjs` and `contact.mjs`.

Most of what follows comes from reading the source. The custom code is unminified or lightly minified and has French developer comments, so the numbers (durations, eases, scroll lengths) are the real values, not estimates. Anything I did not see directly is marked "(inferred)".

---

## 0. TL;DR

- **It is a one-page site.** The sitemap has only `/` and `/legal`, and `/about`, `/portfolio`, `/team`, `/news` and `/contact` all return 404. "Pages" are anchors (`/#manifesto`, `/#portfolio`, `/#team`, `/#stories`, `/#talent`). News "detail pages" open in a modal, and portfolio "detail pages" are external links. In total there are four distinct views: Home, Legal, 404 and the story modal.
- **Stack:** Webflow (CMS plus Designer) with a large custom JS layer hosted on Cloudflare Pages (`main.varsity-cords.pages.dev`). That layer includes:
  - a self-bundled **GSAP 3.13**, kept apart from Webflow's own GSAP 3.15 (ScrollTrigger, SplitText, Flip, MotionPathPlugin, DrawSVGPlugin);
  - **Lenis 1.3.26** smooth scroll;
  - a **Three.js r160** module that renders 3D braided climbing-rope "cords" (Verlet rope physics in a custom tube shader);
  - one **Webflow Code Component**, a React "StoriesSection" in shadow DOM loaded through Module Federation.
- **The signature move:** the 3×2 photo grid hero is a single photo cut into six cells, each one a `background-position` slice of the same image. On scroll it is pinned for 5,600px and scrubbed:
  1. The photo cells fade out.
  2. Three of them flood with a flat brand colour.
  3. Those three shrink into small coloured word chips ("RISK", "CAPITAL", "GROWTH").
  4. About 20 more chips fly in.
  5. The headline "POTENTIAL NEEDS MORE THAN CAPITAL" rises line by line.
  6. The whole scene zooms out to 0.58 while the headline blurs away.
  7. Once settled, the chips drift continuously along random MotionPath curves.
- **"Flat colour blocks further down":**
  - the Pillars section is four sticky full-bleed colour cards that stack up as you scroll;
  - the Stories section starts as a tight grid of flat colour blocks, then GSAP Flip spreads them into a scattered editorial collage while the photos fade in over the colour.
- **The brand device is the 3×2 grid**, which recurs everywhere: hero cells, a hairline grid over the newsletter banner photo, the grid in the story modal, the 3-column team grid, and the Talent links in three columns.

---

## 1. Tech stack

| Layer | What | Evidence |
|---|---|---|
| Platform | **Webflow**: CMS collections (`w-dyn-list`, `w-dyn-item`), Webflow forms, jQuery 3.5.1 | `data-wf-site`, `data-wf-page`, `webflow.schunk.*.js`, `cdn.prod.website-files.com` |
| Webflow GSAP | GSAP **3.15.0** with Flip, ScrollTrigger and SplitText, enabled through Webflow's GSAP integration | `<script src=".../gsap/3.15.0/gsap.min.js">` etc., plus inline `gsap.registerPlugin(Flip,ScrollTrigger,SplitText)` |
| Custom engine | `engine-3.13.0-b3.js`, a private bundle of GSAP 3.13 + ScrollTrigger + Flip + SplitText published on `window.VARSITY.{gsap,ScrollTrigger,Flip,SplitText}`. Its first line hides Webflow's GSAP globals during init so the two copies don't mix (comment: "pin du hero perdu"). | header comment of the file; `window.VARSITY` keys = `boot, gsap, ScrollTrigger, Flip, SplitText, engine, smoothScroll, lenis` |
| Smooth scroll | **Lenis 1.3.26** (`smooth-1.0.2.js`): `lerp: 0.07`, `wheelMultiplier: 1`, `smoothWheel: true`, `syncTouch: false`, driven by `gsap.ticker` with `lagSmoothing(0)`. Lenis is turned off on touch devices, under `prefers-reduced-motion`, or with `?native` in the URL. It is skipped inside `[data-lenis-prevent], .vst-modal, .story-modal`, and it stops itself when `body`/`html` has `overflow:hidden` (watched with a MutationObserver). | source; `html.lenis` classes |
| Mobile scroll | `varsitymobilescroll-1.0.0.js` calls `ScrollTrigger.normalizeScroll({type:"touch"})` on touch devices (this stops the address bar from jumping during the pins) | source |
| GSAP plugins used | ScrollTrigger (pin + scrub), SplitText (`type:"lines,words"`, `mask:"lines"`), **MotionPathPlugin** bundled inside `hero.js`, **DrawSVGPlugin** bundled inside `principles.js`, **Flip** (Stories) | license banners at the bottom of each bundle |
| WebGL | **Three.js r160** (`REVISION "160"`) in `scenes.js`, lazy-loaded with `import()` when a section comes within 400px of the viewport. It exports `mountManifestoCords`, `mountPortfolioCord` and `mountEventsCord`. Each cord is a tube mesh whose vertex shader bends along Catmull-Rom nodes from a Verlet rope simulation; the texture is a braided rope pattern with bump mapping and an elliptical end cap; the camera is orthographic. The CSS file name `varsity-r3f-...` suggests they prototyped it in React Three Fiber (inferred). | source and shader comments |
| Code component | Webflow **Code Components** (`<code-island>`, Module Federation `mf-manifest.json`, build "varsity-webflow-components"), with `StoriesSection` written in React, server-rendered into declarative shadow DOM (`<template shadowrootmode="open">`) | HTML |
| Not used | Barba/Swup, Framer Motion, Lottie, Rive, Locomotive, Webflow IX2 (0 `data-w-id`; `data-wf-scroll-motion="none"`). There is no custom cursor and no preloader screen (the intro plays over the hero itself). | grep |
| Analytics | Plausible | script |
| Fonts | **TF Arrow Medium (500)** is the display face: a high-contrast, Trajan-like **serif used in all caps** with tight leading (0.9–0.93). **Pliant** is a light grotesk **sans** used at 300 and 400 for body text, UI, chips and labels, almost always uppercase with `letter-spacing: .04em`. Both are self-hosted woff2. Tokens: `--_typography---primary: Tfarrow`, `--_typography---secondary: Pliant`. | `@font-face` in the Webflow CSS; screenshots |

How they structured the code (worth copying): each section is a `[data-scene="hero|manifesto|pillars|portfolio-cord|team|stories|footer"]` hook, and each one gets its own versioned script (`varsity-2.3.6/hero.js`, `varsity-2.11.2/portfolio.js`, …). Every script:
- respects `prefers-reduced-motion`;
- re-runs on resize only when the width or `svh` actually changed;
- uses `invalidateOnRefresh` and function-based tween values so measurements are recomputed.

---

## 2. Global systems

### Smooth scroll
Lenis with `lerp .07`, which is fairly heavy and floaty, ticked by GSAP. `history.scrollRestoration = 'manual'`. Lenis resets on `hashchange` so the anchor nav jumps cleanly.

### Page transitions
**None.** It is one page, and the nav links are hash anchors. The Legal page is a normal full page load.

### Preloader / intro (the hero itself, `hero.js`)
- An anti-flash CSS rule (`html.wf-boot .hpx:not(:has(.item))`) keeps the stage white and hides the title and nav until the JS has built the grid. A failsafe CSS animation makes everything visible after 6s if the script never runs.
- The intro timeline starts at about 0.15s and lasts about 3.75s. If a resize rebuilds the hero mid-intro, it `seek`s to the elapsed time instead of restarting. Steps:
  1. The full photo fades in (`opacity 0→1`, 0.7s, `power1.out`) while scaling `1.28→1` over 1.9s `power2.inOut`, a slow Ken-Burns settle.
  2. The white grid hairlines draw in. Vertical lines go `scaleY 0→1` from the top and horizontal lines go `scaleX 0→1` from the left, over about 1.9s with a 0.12s stagger. The grid border fades from transparent to white.
  3. At 1.3s the hero title "WE INVEST / EARLY / AND STAY / CLOSE" (SplitText words, masked by line) rises with `yPercent 110→0`, 0.8s `power3.out`, stagger 0.07.
  4. At 2.2s the per-cell nav labels ("ABOUT →", "PORTFOLIO →", "TEAM →", "NEWS →", "CONTACT →") fade up `y:10→0`, 0.55s, stagger 0.08.
  5. At 2.95s the fixed site nav bar slides down from above (`yPercent -100→0`, 0.7s `power3.out`).
- Frames: `intro-0000.png` … `intro-4500.png`, sheet `sheet-intro.png`.

### Header / nav (`.nav-wrap`, fixed, z 100)
- Layout is a white bar, 1rem padding, 1px bottom border `#0000001a`, in three equal columns:
  - **left:** live date and time (two lines, Pliant 12px);
  - **centre:** "VARSITY" wordmark (TF Arrow 36px, `letter-spacing .05em`);
  - **right:** a lime "CONTACT" button (`mailto:`).
- **Live date/time:** `Intl.DateTimeFormat` pinned to **Europe/Paris**, date as `en-US {month:'long', day, year}` ("October 14, 2026"), time as `en-GB` 24h "HH:MM", updated by `setInterval` every 1s. The hero's internal ticker/topbar duplicate exists in the markup but is hidden.
- **Scroll behaviour:** hide on scroll down and show on scroll up. When `scrollY ≤ 40` it is always shown. A down-delta over 6px applies `translateY(-100%)`, an up-delta over 6px applies `translateY(0)`, with `transition: transform .35s` and rAF throttling. No colour change and no shrink.
- **Mobile:** a burger opens a full-screen dark-green (`#1c231a`) menu with huge TF Arrow links (`clamp(34px, 11vw, 58px)`). It animates `opacity 0→1` plus `translateY(-10px)→0` with a 0.3s transition, locks `html{overflow:hidden}` (which pauses Lenis), and closes on Esc.
- Screenshots: `nav-hidden.png`, `nav-shown-scrollup.png`.

### Cursor
There is no custom cursor. The **cursor-following elements** are:
- the 3D rope, which trails the pointer in the manifesto/principles zone;
- the portfolio "badge" (logo + "VIEW WEBSITE"), which follows the cursor with lerp 0.3, offset +20/+14px.

### Footer
- Nav links in two columns (About/Portfolio/Team/News on the left; LinkedIn/Mail right-aligned). Hover is `opacity .6`.
- Below them is a full-width "VARSITY" SVG wordmark. **Scroll reveal:** `clip-path: inset(100% 0 0 0) → inset(0)`, scrubbed (`scrub .5`) from `top 80%` to `bottom bottom`, so the wordmark wipes up from the bottom and is complete exactly at the end of the page.
- Then legal links and "All rights reserved" (Pliant 12px uppercase, 40% ink).
- Screenshot: `footer-bottom.png`.

### Colour tokens (observed)
| Role | Hex |
|---|---|
| Ink (text, dark green-black) | `#1c231a` (also `#141310`) |
| Paper | `#ffffff`, off-white sections `#f6f6f6` |
| Primary accent / CTA (lime) | `#aee76e` (hover `#9edb59`); hero chips `#B9E356`, `#9BD84A`; ticker lime `#c7ed5e` |
| Forest | `#597020`, `#18271b` |
| Red-orange | `#ef2d11` / `#F0431C` |
| Burgundy | `#890143` / `#8E1250` |
| Pink | `#ffc6ef` / `#F3A9D2` |
| Powder blue | `#a6c0da` / `#A7C3D4` |
| Khaki | `#b6b797` / `#AEAC84` |
| Brown | `#694102` |
| Cream | `#ebecda` |
| Mustard (Kog) | `#f7b519` |

Colour is **data-driven**: each portfolio company, team member and story has a hidden CMS field (`.portfolio_cordref`, `.team_accentref`, `.story-cordref`) that JS reads into `--hover-color` / `--accent` / `--tag-color`. The portfolio script picks the ink colour (white or dark) from luminance, switching below 0.55.

### Type scale
- Display: TF Arrow 500, uppercase.
  - Hero title `clamp(44px, 7.4vw, 128px)`, leading 0.9.
  - Headline `clamp(38px, 6.1vw, 104px)`.
  - Pillars word **15.55vw**, title case, leading 0.85, tracking −0.02em.
  - Team title `clamp(1.875rem, 5vw, 6rem)`.
  - Portfolio title 3.5rem.
  - Section titles about 3.9cqw.
- Body: Pliant 300/400 at `clamp(13–14px, ~1.1vw, 16–18px)`, line-height 1.4–1.5.
- Labels: Pliant 12–14px uppercase, tracking .04em.

### Grid, margins, radii
- No radii anywhere: square corners on buttons, cards, chips and inputs.
- Hairline borders are `1px #1c231a33`, or `#ffffff80` over photos.
- Gutters are small: 1rem page padding on Talent and Footer; pillars use `clamp(.75rem, 2.29vw, 2.75rem)`; the portfolio row inset is 9.375%.
- Stories uses **container query units** (`cqw`) so the collage scales as one rigid composition.

### Buttons
- **`.btn-primary`:** lime `#aee76e`, ink text, Pliant 14px uppercase, tracking .04em, `min-height 2.375rem`, padding `.25rem 1.25rem`, no radius. Hover is a colour step to `#9edb59` with `transition: background-color .2s`.
- **Newsletter submit:** a white block whose hover turns it lime.
- **Text links with an ↗ arrow:** on hover the arrow nudges `translate(3px, -3px)` over 0.25s.
- **Story-modal close (×):** rotates 90° on hover over 0.3s.
- **Talent link columns:** background goes to `#9ce050` on hover (0.2s).

---

## 3. Sitemap

| URL / view | Type | Notes |
|---|---|---|
| `/` | Home, a long one-pager (about 18,000px tall at 1440×900, most of it pinned scroll distance) | sections listed in section 4 |
| `/#manifesto`, `/#portfolio`, `/#team`, `/#stories`, `/#talent` | "About / Portfolio / Team / News / Contact" are anchors on Home | the hero cells link to these too |
| Story modal (opened from any News card) | **article detail view**: a JS-built modal, with no URL change | `story-modal*.png` |
| Portfolio "detail" | external company website (`target=_blank`); "Stealth" rows are inert | |
| `/legal` | Terms & conditions / privacy: a plain rich-text page with the global nav and footer | `page-legal.png` |
| 404 | custom: a big pale serif "404" on `#f6f6f6`, two 3D braided ropes crossing it, "The page you were looking for can't be found.", lime "BACK HOME" button | `page-404.png` |
| `mailto:hey@varsity.vc` | Contact (nav CTA) | |

There are no team-member, portfolio or news CMS template pages. Even if the brief needs more page types, Varsity offers only 4 distinct views to learn from.

---

## 4. Home, section by section (desktop 1440×900)

Scroll positions come from `ScrollTrigger.getAll()` (see `probe-1440.json`).

| # | Section | Layout / content | Animation: trigger → what moves → timing → library |
|---|---|---|---|
| 1 | **Hero `section.hpx` "grid hero"** (0 → 5,600px pinned) | Full-viewport dark stage. One photo (`--hero-img`) is sliced into a **3×2 grid** of absolutely positioned `.item` cells, each showing its part of the photo through `background-size`/`background-position`. White 1px gridlines sit between the cells. Bottom-left cell: "WE INVEST EARLY AND STAY CLOSE" (TF Arrow, white), auto-sized by JS to fit one cell. Five cells carry a small "LABEL →" row at their bottom edge and are **clickable nav** (About, Portfolio, Team, News, Contact; cell 3 has no link). | **Load:** the intro timeline in section 2. **Hover (pointer devices):** the other cells get a black overlay at 0.4 opacity (`.dim`, `transition .42s cubic-bezier(.4,0,.2,1)`), so the hovered cell stays bright; cursor is a pointer. **Scroll, pinned and scrubbed** (`pin: .stage`, `scrub: .3`, `end: +=5600` = 3,300 scrub + 1,400 zoom + 1 viewport cover). In timeline order: (a) title lines drop out `yPercent 0→120`, `power2.in`, stagger .05; gridlines and nav labels fade. (b) The **white `.final-bg` fades in** (1.2s) behind everything. (c) The three non-"morph" photo cells fade out with a 0.05 stagger. (d) **Morph cells** 1, 3 and 5 first flood with flat colour (`.fill`: burgundy `#8E1250` "RISK", lime `#B9E356` "CAPITAL", pink `#F3A9D2` "GROWTH", 0.4s), then lose the photo, then **tween `left/top/width/height` down to small pill chips** at preset % positions (0.8s `power2.inOut`, 0.08 stagger), and their word fades in. (e) Ten more chips (POTENTIAL, VALUE, VENTURES, UPSIDE, SEED, NETWORK, PATTERN, TALENT…) **fly in from off-screen left or right** (`power3.out`, 1s, 0.09 stagger). Ten "outer" chips sit just outside the frame. (f) The headline "POTENTIAL NEEDS MORE THAN CAPITAL" rises line by line (SplitText lines masked, `yPercent 120→0`, `power3.out`, stagger .05). (g) Over the last 1,400px plus one viewport, the whole `.zoom` layer scales `1→0.58` (linear) and the headline scales to 0.6, **blurs 0→8px** and fades out (`power2.in`), so the outer chips come into frame. (h) Once scroll progress reaches 75%, every chip starts an **idle drift**: random MotionPath curves within a 60px radius, `power2.inOut`, 0.18–2.2s legs, random 0.35–2.6s pauses, and sometimes a small overshoot-and-settle "correction". **Mobile:** gridlines at 0.4 opacity, no cell links, burger menu, taller cells (`mobile-*.png`). Libraries: GSAP timeline + ScrollTrigger + SplitText + MotionPathPlugin. Screens: `sheet-hero.png`, `hover-hero-cell.png`. |
| 2 | **Manifesto "WE BACK EARLY / AND STAY USEFUL"** (`.backers`, pinned 5,600 → 7,800) | Off-white `#f6f6f6`, one viewport. Left and right serif statements, with a narrow vertical **logo slider** in the middle (portfolio logos from CMS: RockFi, Bohr, C12, Quiet, Sensinov, Kalipso…). The top and bottom fade to paper with gradient masks. A sticky full-screen **WebGL canvas** (`.cords-stage`) overlays the scene with **two 3D braided ropes** twisting vertically on either side of the slider. | **Enter (scrubbed, from `top bottom` to `top top`):** logos stagger in from below (cubic ease-out, per-item delay ≤ .3s, each translating up and fading). **Pinned scroll (2,200px):** the first 900px slides the logo track vertically, one logo per 92px. Each logo's scale (`1 - |offset|×.22`, min .5) and opacity (`1 - |offset|×.42`) depend on its distance from the centre, like a vertical carousel or "slot machine"; the centre logo gets `.active`. The next 1,300px is the **exit**: the row moves `translateY(-60vh)` and fades, then the rope canvas fades. Scroll **velocity feeds an "energy" value** into the rope sim (direction ±, decay .94), so the ropes react to how fast you scroll (inferred visual; the code passes `energy` and `dir` to `frame()`). All motion is a custom rAF loop with lerps (exit .07, enter .12), not tweens. Libraries: ScrollTrigger (pin + progress) + vanilla rAF + Three.js. Screens: `s1440-05700.png`, `manifesto-cords.png`. |
| 3 | **Principles "THE PRINCIPLES BEHIND VARSITY"** (`.principles-section`, overlaps the manifesto by `margin-top:-120svh`) | White. A centred 600px column: 4-line serif heading, six short paragraphs (Pliant), and a handwritten **"Varsity" signature** SVG. The section has sticky staging (`.principles-stage` sticky; `.principles-hold` 60svh of reveal distance; `.principles-rest` 50svh pause). | **Scrubbed crossfade:** the `.backers` paper `#f6f6f6` dissolves to the white body (`opacity 1→0`, `scrub:true`) while this section rises. Then the content does `opacity 0→1` with `scale .94→1` (`scrub .5`, over the 60svh hold). **Signature:** a **DrawSVG handwriting animation**. Five stroke paths ("V", "ar", "sity", the dot, the t-bar) draw `0%→100%` in sequence under alpha masks of the real letterforms (durations .34/.30/.54/.09/.17s, starts 0/.32/.60/1.15/1.23s), triggered once when the signature passes 80% of the viewport and reversed on scroll-back. Libraries: GSAP + ScrollTrigger + DrawSVGPlugin. Screens: `s1440-07700.png`, `s1440-08100.png`, `nav-hidden.png` (signature plus a rope trailing the cursor). |
| 4 | **Pillars "Judgment / Clarity / Conviction / Ambition"** (`#pillars`) | `#f6f6f6` background. **Four full-bleed colour cards** (ratio 1374/360) with **CSS `position:sticky`**, stacking with increasing `top` offsets that JS computes so the finished stack fills the viewport. Each card has one giant serif word (15.55vw) in a contrasting colour: Judgment = blue on forest `#597020`, Clarity = cream on red `#ef2d11`, Conviction = lime on brown `#694102`, Ambition = forest on pink `#ffc6ef`. | **Stacking:** native sticky. Each card slides up over the previous one, leaving a band of the one underneath visible. **Word scrub (per card):** as the card enters, the word **rises from the card's bottom edge while scaling .75→1** (origin bottom-left) and locks at 20% of the card's height when the card sticks (`scrub:true`, linear). When the *next* card un-sticks, the word **overflows up out of the top of its card** (to −60% of card height) over 100vh of scroll. Since every card uses the same speed with offset starts, it reads as a regular wave. The last card doesn't overflow. On exit the stack keeps a 2rem gap per card instead of collapsing. Mobile: half the motion amplitude and taller cards. Libraries: CSS sticky + GSAP ScrollTrigger scrub. Screens: `s1440-09300` → `s1440-11400`. |
| 5 | **Portfolio "A PORTFOLIO BUILT ON CONVICTION"** (`#portfolio`) | White. Centred serif title. A "SECTOR ⌄" filter toggle, then a full-width **table-like list** of rows. Columns are name (TF Arrow uppercase 24px) with the sector underneath, a description, and an ↗ arrow. 1px hairline separators, about 108px per row. | **Row hover:** the row background floods with the company's own colour (`--hover-color` from CMS) and the text inverts to white on dark colours (instant, no transition). A **3D rope (WebGL) appears in the left gutter, clipped to the hovered row**. Its clip top and bottom edges are **spring-simulated** (stiffness 24 when expanding and 13 when contracting, with a 90ms delay on the trailing edge), so moving between rows makes the highlight stretch and snap like elastic. Horizontal pointer speed pushes the rope (`force`, `speed`). A **floating badge** (company logo + "VIEW WEBSITE") follows the cursor with lerp .3. **Filter:** clicking SECTOR opens chips (All 15, Fintech, SaaS, Energy & Climate, Quantum, AI, Consumer Apps, with zero-padded counts); chips enter `translateX(-.75rem)→0` with opacity over 420ms, 30ms stagger, `cubic-bezier(.2,.7,.2,1)` (WAAPI). Selecting one hides non-matching rows; the remaining rows re-enter `translateY(.75rem)→0` over 480ms with 35ms stagger (cap 10). The active chip takes the sector colour, and a reset ⊗ icon pops in with `rotate(-90deg) scale(.6)→none`. Esc or an outside click closes it. Libraries: vanilla JS + Web Animations API + Three.js. Screens: `hover-portfolio-row1.png`, `hover-portfolio-row3.png`, `portfolio-filter-open.png`. |
| 6 | **Team "THE PEOPLE BEHIND VARSITY"** (`#team`) | `#f6f6f6`. A **3-column grid** where the four partner photo cards (480/307 ratio) sit in a plus/checkerboard pattern **around a centred title cell**, with empty cells as negative space. Each card shows name (in the person's accent colour) and role bottom-left over a dark gradient shade. | **Hover (desktop) / tap (touch): circular "ink" reveal.** An accent-colour panel (`.team_panel-bg`) **scales 0→1 from the cursor's entry point** (`transform-origin: var(--ox) var(--oy)`, .58s `cubic-bezier(.62,.05,.2,1)`). If you move from one card to the next, the origin is the previous card's centre, so the colour seems to travel between cards. The panel holds founder testimonials. Its children (logo tabs, quote, progress line, footer with name and LinkedIn ↗) fade and rise `translateY(10px)→0` with **delays computed from each child's distance to the reveal origin**, so content appears as the colour wave passes it (40–620ms, same bezier). **Auto-advancing quote tabs:** every 8s (`data-tab-duration="8"`) a 2px progress bar fills (`@keyframes teamProgress`, linear) and then the next portfolio-logo tab activates. Quotes swap with `teamQuoteIn` (.4s, `y 5px→0`). A manual tab click stops auto-advance. Libraries: CSS transitions/keyframes + vanilla JS. Screens: `s1440-14264.png`, `hover-team-150ms.png`, `hover-team-950ms.png`. |
| 7 | **Other projects (lime band)** | Lime `#aee76e` full-width strip with a centred serif heading "Because we don't just stop here…" and three columns (TalentLetter, Karma Driven, Startup Mafia), each a description plus an uppercase link with ↗. | **Hover:** the column background goes to `#9ce050` (.2s) and the arrow nudges up-right. No scroll animation. Screen: `hover-talent-col.png`. |
| 8 | **Stories / News "STORIES, PERSPECTIVES AND PROGRESS FROM OUR COMMUNITY"** (`#stories`, React code component in shadow DOM) | White canvas whose height is computed in `cqw`. Centred serif title. Cards (19.4% wide) each have a media block (260/160) with a **vertical coloured tag** on its left edge ("News" / "Portfolio", `writing-mode: vertical-rl`), a caption and ↗. Card positions come from per-slot CSS with two layouts: *initial* (tight centred 3-column cluster) and *`.is-final`* (scattered asymmetrical collage across the full width). The pattern repeats in blocks of 7 slots (`--vst-blk × 120cqw`). | **Before trigger:** cards are **flat colour blocks** (`.story-visual` at opacity 0, so only `--tag-color` shows) in a tidy grid. **Trigger (once):** when the title's top passes 30% of the viewport, the host gets `.is-final` and **GSAP Flip** animates every card from its old box to the new scattered position (`scale:true`, 1.55s, custom cubic ease `vtStoriesFlip`, stagger .05 from start). At +0.55s the **photos fade in** over the colour (`opacity 0→1`, .85s `power2.out`, stagger .05 with `power2.in`). **Continuous parallax:** each card's inner layer translates by up to about 26% of its height relative to the viewport centre, with a **per-card speed from a golden-ratio sequence** (`.25 + ((φ⁻¹·i + .15) mod 1)·1.5`), lerped .12 per frame, so the collage feels layered. **Click:** opens the story modal (see below). Libraries: GSAP + Flip + rAF. Screens: `stories-0-before.png`, `sheet-flip.png` (flip-150 → flip-2600), `s1440-15500/15900.png`. |
| 8a | **Story modal** (article detail) | A scrim plus a centred frame: cover image with a **white 3×2 hairline grid overlay** (echoing the hero), coloured tag, uppercase serif title, "Learn more ↗", and rich-text body. Close × in the top-right. Scroll-locks the body (pausing Lenis) and compensates for the scrollbar width. | **Open:** scrim `opacity 0→1` .4s `power2.out`. Frame `opacity 0, scale .965, yPercent 1.5 → 1` over .62s `power3.out`. Cover image `scale 1.09→1` over 1.2s `power3.out`. Tag, title, link and body stagger in `y 14→0`, .55s `power3.out`, stagger .07, delay .1. **Close (Esc or scrim):** scrim and frame out in .26s `power2.in` (frame to `scale .98, y 8`). A card with no body text opens the external link instead. Screens: `story-modal-250ms.png`, `story-modal.png`. |
| 9 | **Newsletter "STAY CLOSE TO WHAT'S NEXT"** (`#talent`) | 1rem-inset banner (1408/500) with a full-bleed photo, a **3×2 white hairline grid overlay** (the top row has bottom borders), a bottom gradient shade, a centred serif title, and an email input plus white SUBSCRIBE button. | **Scroll parallax (rAF, not ScrollTrigger):** the image goes from `scale 1.3, translateY -12%` to `scale 1, 0`, lerped .14. It runs from the banner's top at the viewport bottom until its top reaches the viewport top, or the end of the page if that comes first. Input focus brightens the border and background. Screens: `s1440-16900.png`, `s1440-17000.png`. |
| 10 | **Footer** | See section 2. | Wordmark clip-path wipe-up, scrubbed to the page end. |

### Legal page
- Global nav (same hide/show behaviour) plus `.section_legals`: white, 13rem top padding, serif uppercase "TERMS AND CONDITIONS", serif H2s, Pliant body. Then the footer.
- No section animation beyond Lenis, the nav and the footer wordmark wipe.

### 404 page
- `#f6f6f6`, centred huge pale serif "404" with the message and a lime BACK HOME button.
- The two WebGL braided ropes (the manifesto cords scene) twist vertically across it.

---

## 5. Patterns worth borrowing (with recipes)

1. **One photo split into a nav grid.** Render N absolutely positioned cells that share one `background-image`. Set each cell's `background-size` to the full stage cover size and its `background-position` to `-(col·w), -(row·h)`, so together they look like one photo but can be animated separately. Add 1px gridlines as separate divs. Make each cell a section link with a bottom "LABEL →" row, and dim the siblings on hover (`.dim` at opacity .4, 420ms).
2. **Photo cell → colour block → chip morph.** In a pinned, scrubbed GSAP timeline: fade a solid `.fill` in over the cell, fade the photo out, then tween the cell's `left/top/width/height` down to a pill's measured size, and fade the label in. Fly in extra chips from off-screen, then zoom the parent out (`scale .58`) to bring off-frame chips into view.
3. **Idle "alive" drift.** After settling, loop each chip through random short `motionPath` curves (radius about 60px, random pauses, occasional overshoot correction). A cheap way to make a static composition feel alive.
4. **Ken-Burns intro plus gridline draw.** Fade the photo in from `scale 1.28→1` over 1.9s `power2.inOut` while gridlines `scaleX/scaleY 0→1` with a stagger. Then masked SplitText words rise (`yPercent 110→0`, stagger .07), then labels, then the nav slides down.
5. **Hide-on-scroll-down nav** with a 6px threshold and always shown under 40px; `transform .35s`. Live local date/time from `Intl.DateTimeFormat` with a fixed `timeZone` (for Softcom: Lagos).
6. **Sticky colour-card stack with overflowing giant words.** Pure CSS `position:sticky` with JS-computed `top` offsets. Each giant word scrubs up from the bottom (`scale .75→1`, origin bottom-left), locks at 20%, then rises out of its card when the next card releases. Free with ScrollTrigger scrub and `invalidateOnRefresh`.
7. **Flat colour blocks that Flip into a collage.** Lay cards out twice in CSS (an initial tight grid and an `.is-final` scattered layout), with images at opacity 0 so only the brand colour shows. On trigger: `Flip.getState` → toggle class → `Flip.from(state, {scale:true, duration:1.55, stagger:.05})`, then fade the images in. Add per-item parallax with golden-ratio speeds.
8. **Hover row floods with the entity's own colour.** Store a hex per CMS item and set `--hover-color` plus a luminance-chosen ink. For the elastic highlight, use a single absolutely positioned layer whose `clip-path: inset(top 0 bottom 0)` edges follow the hovered row through a damped spring (fast leading edge, slow trailing edge, 90ms delay). Add a cursor-following badge with lerp .3.
9. **Radial "ink" card reveal from the cursor.** On `mouseenter`, set `--ox/--oy` to the entry point; an accent panel `transform: scale(0→1)` with `transform-origin: var(--ox) var(--oy)` over .58s `cubic-bezier(.62,.05,.2,1)`. Stagger the children's `transition-delay` by their distance from the origin so content appears with the wave.
10. **Auto-advancing testimonial tabs** with a CSS keyframe progress bar (8s); `animationend` advances to the next tab, and a manual click stops the auto-advance.
11. **Handwritten signature draw.** DrawSVG strokes under an SVG mask of the real glyph outlines, sequenced with exact starts and durations and fired at 80% of the viewport. The same thing works with `stroke-dashoffset` and no plugin.
12. **Footer wordmark wipe-up** with `clip-path: inset(100% 0 0 0) → inset(0)` scrubbed to `bottom bottom`, so it completes exactly at the end of the page.
13. **Banner parallax** with `scale 1.3→1` plus `translateY -12%→0` (keep `|Y| ≤ (scale-1)/2` so the image always covers), lerped .14 in rAF, clamped to the end of the page.
14. **A recurring 3×2 hairline grid motif** over photos (hero, newsletter, modal). It is a cheap brand system device: a CSS grid of `<i>` with `border-right` / `border-bottom` in `#fff8`.
15. **Engineering hygiene:**
    - one `data-scene` hook per section;
    - lazy `import()` of heavy WebGL when within 400px of the viewport;
    - rAF loops paused by IntersectionObserver;
    - `prefers-reduced-motion` handled in every script;
    - CLS guard: reserve the pin-spacer height in CSS (`min-height: calc(200svh + 4700px)`) before the JS pins.

### Mapping to Next.js 16 + Tailwind v4 (inferred recommendations)
- GSAP (now free, including SplitText, Flip, MotionPath and DrawSVG) with `@gsap/react` `useGSAP` for scoped cleanup; `lenis/react` driven by `gsap.ticker`.
- The rope "cords" are bespoke (Three.js tube plus Verlet). A cheaper Softcom equivalent would be an SVG/canvas path following the cursor, or skipping it.
- Code the per-entity colour as a CMS field (Sanity) mapped to CSS custom properties, as Varsity does.
