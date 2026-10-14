# Bequant (bequant.com): how it's built and animated

Researched 2026-10-14 with `curl` (HTML, CSS, JS bundles), a static parse of the Webflow IX2 interaction config (302 events, 147 action lists), and headless Chrome (puppeteer-core, 1440×900, motion on). For each page I took a frame every 800 px of scroll, plus intro frames at 0/300/800/1500/2500 ms after `load`, hover frames, and live dumps of `ScrollTrigger.getAll()` and `Webflow.require('ix2')`.

Screenshots are in `bequant/` (about 250 PNGs). Names follow `<page>-sNN.png` for scroll steps, `<page>-intro-<ms>.png` for intro frames, `nav-*.png`, `btn-*.png` and `hero-video-t*.png`. Per-page JSON dumps (sections, ScrollTriggers, Lottie and video sources, fonts, tokens) are in `bequant/<page>.json`. The IX2 summaries are `bq_ix2_<page>.txt`, and the raw IX2 config is `bq_ix2.json`.

> Gotcha for anyone re-running this: Webflow's runtime throws on a user-agent without a dotted Chrome version (`/chrome\/(\d+)\./`). IX2 then never initializes and every hero stays at opacity 0. Use `Chrome/130.0.0.0`.

---

## 1. Tech stack

| Layer | What | Evidence |
|---|---|---|
| Platform | **Webflow** (site `628bd935bf709b13cada8065`, staging name "bequant-staging"), CMS-driven (news, product updates, resources, partners, docs, glossary) | `data-wf-site`/`data-wf-page` on `<html>`, `cdn.prod.website-files.com/.../webflow.*.js`, `webflow.shared.*.css`, `w-dropdown`/`w-richtext` classes |
| Interactions engine #1 | **Webflow IX2 (Interactions)**. Handles most section reveals, hovers, page-load intros, scroll-progress ("while scrolling in view") scrubs and Lottie control | `Webflow.require("ix2").init({...})` in `webflow.d2ed644e…js`: 260 `GENERAL_START_ACTION`, 190 opacity, 126 move, 119 size, **114 `PLUGIN_LOTTIE`**, 42 continuous (scroll-progress) actions |
| Interactions engine #2 | **GSAP 3.15.0 + ScrollTrigger**, Webflow-hosted build. Custom page code handles the nav, typewriter text reveal, counters, marquee, sticky-CTA index and the Lenis bridge | `cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js` and `ScrollTrigger.min.js`; `window.gsap.version === "3.15.0"`; 6–29 ScrollTriggers per page |
| GSAP plugins | **ScrollTrigger only**. No SplitText, ScrambleText, Flip or Observer. The "typewriter" effect is a hand-rolled CSS-mask technique, described below | script list; comment in code: "Typewriter v2 (CSS-mask reveal, no DOM splitting)" |
| Smooth scroll | **Lenis 1.1.16**, `lerp: 0.12`, driven from `gsap.ticker` with `lagSmoothing(0)`; `lenis.on('scroll', ScrollTrigger.update)` | `unpkg.com/lenis@1.1.16`, `lenis.css`, `html.lenis` class, `window.lenis` |
| Vector animation | **Lottie** through Webflow's Lottie integration (`data-animation-type="lottie"`, `.json` and `.lottie` files). Used for every button arrow `»`, menu icons, the burger, the feature diagrams, the footer logo and the CTA backgrounds | about 100 Lottie elements on the home page alone |
| Video | Looping muted MP4 from **Vimeo progressive** URLs (`player.vimeo.com/progressive_redirect/...`) in plain `<video autoplay loop muted playsinline>`. Hero "light streaks" are video, **not WebGL** | `.hero_video`, `.product-hero_video`, `.home-grid_item-video`, etc. |
| Carousels | Flickity 2 (home, a draggable slide list with a parallax image shift and progress bar; console-log debug code left in), Swiper 11 (coverflow testimonial slider on `/request-trial`) | script srcs |
| Tooltips | Tippy.js 6 + Popper (`theme: translucent`, `animation: shift-away`) on product pages | script srcs, inline init |
| Other | jQuery 3.5.1 (Webflow), Finsweet Attributes (cookie consent `fs-cc`, richtext, cmsfilter, cmsstatic, selectcustom), Weglot (EN/ES/PT), HubSpot (forms posted via `fetch` to the HubSpot API, plus a chat widget that auto-opens on contact, buy and trial pages), GTM, reCAPTCHA | script srcs |
| Not present | No Three.js/WebGL, Rive, Framer Motion, Barba/Swup or Locomotive. No custom cursor or preloader | globals check (`THREE`, etc. false), no canvases |
| Prototyping | A CodeSandbox file `768nnt.csb.app/src/script.js` is still loaded. Its header says the code "migrated into Webflow page code on Nov 28, 2025… use this sandbox to prototype" | script src |

**Fonts** (self-hosted on the Webflow CDN, `font-display: swap`):
- **Alliance No. 2**: 300 for all display and body copy, plus 400, 600 and italics. Italic 300 is used for emphasis words in headings, e.g. "network *quality*" and "your *free* trial".
- **GT America Mono**: 300, 400 and 700. Used for every UPPERCASE label, caption, button and nav item.
- Phosphor Light icon font (`ph-light`), plus Droid Sans loaded through WebFont.js (legacy, effectively unused).

---

## 2. Global systems

### 2.1 Smooth scroll
Lenis is attached to GSAP's ticker:
```js
window.lenis = new Lenis({ lerp: 0.12, smooth: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```
The scrollbar is restyled to 5 px wide with a red `#ff2d2d` thumb and `overflow: overlay`.

### 2.2 Page transitions
**There are none.** Every route is a normal full page load, and the illusion of continuity comes from the per-page intro:
- **Nav slide-in on every load.** The CSS starts `[bqn-element="nav"]` at `translateY(-100%)`. On `window.load` (with a 500 ms fallback) JS adds `.nav-ready`, which sets `transform 0` with `transition: transform 1.2s ease`.
- **Hero intro (IX2 `PAGE_FINISH`).** It runs only after `window.load`, so on a slow network the hero stays blank until the video and fonts load (observed: about 4.2 s on first load).

### 2.3 Preloader or intro
There's no preloader screen. The page background is `#121214` until the hero fades in.

### 2.4 Nav behaviour on scroll (desktop above 991 px)
The structure is a three-part bar floating over content with no background strip:
- **Left:** logo box (mark + "Bequant" wordmark).
- **Centre:** a pill holding PRODUCT / COMPANY / BUY / CONTACT (mono uppercase, dark translucent pill, `backdrop-filter: blur`).
- **Right:** a language switcher `EN >` and a green **GET STARTED »** button.

On scroll there are three independent behaviours, all observed:
1. **Menu pill travels to the right edge.** A GSAP tween on `[bqn-element="menu"]` sets `x` to `trackWidth - menuWidth` with `ease: power1.out` and `scrollTrigger {trigger: body, start: "top top", end: "+=300vh", scrub: 0.6}`. The resolved end is about 300 px, so the pill glides from centre to right over the first ~300 px of scroll.
2. **GET STARTED button shrinks and fades.** `scale 0.8, opacity 0, ease power1.in`, scrubbed from about 225 px to 300 px. The pill then takes its place.
3. **Logo collapses to a square.** Past `scrollY > 100`, a paused GSAP timeline plays: the logo box `width → 2.4rem`, `backgroundColor → rgba(217,217,217,.15)`, logo `left → .25rem`, `0.2s quad.out`. Only the mark stays visible, in a frosted tile. The timeline reverses at the top of the page.
4. **Logo hides over full-bleed media.** Sections tagged `logo="hide"` / `logo="show"` fade the logo box out and back in (`opacity`, 0.08–0.15 s) as they pass about 15% from the top. Most `section_box` elements carry `logo="hide"` so the mark never sits over card content (inferred purpose).

Dropdowns (IX2 `DROPDOWN_OPEN`):
- The panel (`.nav2025_dropdown-box`, frosted, radius .4rem) nudges `y .5rem → 0` over 200 ms `outQuad`.
- Each item has a 60 px square icon tile containing a Lottie that plays on hover (red QoE bars, yellow capacity lines, blue analytics line, white platform layers).
- **Hovered item:** `.nav2025_dropdown-item_background` fades in, giving an accent-tinted fill and a 1 px accent border.
- **Siblings:** filtered to `grayscale(100%)` with text at `rgba(255,255,255,.6)`, over 100 ms. See `nav-dropdown-item-hover.png`.

Mobile (991 px and below) uses a burger Lottie (`BQN_Burger.json`) that morphs on click. A full-screen menu fades in, and items move `y 1rem → 0` over 1.5 s `outExpo`. Menu text re-types via the typewriter's `typewriter-trigger="mobile-menu-text"`. Body scroll is locked with `overflow: hidden`.

### 2.5 Custom cursor
None. The only cursor change is `grab`/`grabbing` on Flickity slides.

### 2.6 Footer
- **Layout:** a 4-column grid on `#121214` with vertical hairline dividers.
- **Brand column:** "Bequant" set at h2 size, a one-line pitch, and an **autoplaying Lottie logo mark** (`BQN_logo10.json`, plays once) at the bottom left.
- **Link columns:** PRODUCT / GENERAL / SOCIAL. Links are mono uppercase captions, and hovering a link block turns its title red (`.footer_link-block:hover .footer_link-title { color: var(--red) }`).
- **Bottom row:** DOCUMENTATION and PRIVACY & COOKIE POLICY.
- There's no reveal or parallax.

### 2.7 Colour tokens (Webflow variables on `:root`)
- **Backgrounds:** `--black #121214` (page); `--neutral-80 #1c1c1e` (cards, `background-secondary`); `--neutral-70 #232325` (tertiary); `--neutral-90 #161618`.
- **Lines and text:** `--neutral-60 #3a3a3e` (border); `--neutral-50 #6b6b6e`; `--neutral-40 #929295` (secondary text); `--neutral-30 #bfbfbf`; `--neutral-20 #e6e6e6`; `--neutral-10 #efefef` (primary text).
- **Brand accents**, one per product line:
  - `--red #ff2d2d` (QoE and default accent)
  - `--yellow #ffdb3a` / `--yellow-alt #d6b521` (Capacity)
  - `--blue #2d74ff` (Analytics)
  - `--green #00bf2a` (CTA and success)
  - `--purple #ff42c3` (rare)
- **Tints:** each accent has a matching tint (`--red-tint #ff2d2d1a`, `--yellow-tint #ffdb3a26`, `--blue-tint #2d74ff26`, `--green-tint #00bf2a1a`). Accent-tinted backgrounds are used at `…0d` (5%).
- **Theme classes** (`.theme-yellow`, `.theme-blue`, `.theme-green`) re-point `--_brand---text-accent`, `--_brand---button-background`, `--_brand---button-text` and `--_brand---accent-tint`. One section component therefore recolours its eyebrow, headings' accent words, buttons, borders and Lottie arrow variant by product.
- **Light surfaces:** `--_theme---background-alt: white` with `--_theme---text-alt #232325`, used for the sticky white CTA card.
- **Selection:** background `var(--_brand---button-background)`, i.e. the red tint.

### 2.8 Type scale
Root size is fluid: `html { font-size: calc(.8438rem + .104vw) }` up to 1440 px, about 15 px at 1440. Other breakpoints use other formulas.

| Style | Size | Line-height | Weight | Tracking |
|---|---|---|---|---|
| `text-style-display` | 6rem | .9 | 300 | -.04em |
| `text-style-h1` | 3.5rem | 1 | 300 | -.04em |
| `text-style-h2` | 3rem | 1 | 300 | -.04em |
| `text-style-h3` | 2rem | 1.1 | 300 | -.03em |
| h4 / h5 / h6 | 1.625 / 1.375 / 1.15rem | | 300 | |
| `text-size-large` / regular / small | 1.15 / 1 / .875rem | 1.4 | 300 | 0 |
| `text-caption-large` / regular / small (GT America Mono, **uppercase**) | .875 / .75 / .625rem | 1.1 | 400 (small 300) | 0 |

Everything big is Light (300) with tight negative tracking. Every label is mono uppercase at 10–14 px. Accent words inside headings and quotes come from `<strong>` in rich text, restyled to the accent colour at weight 300.

### 2.9 Grid, margins and radii
- **Side gutter:** `--_responsive---padding-global: 2vw` (about 29 px at 1440).
- **Global indent:** `--_theme---global-indent: 33%`. Nearly every section uses an asymmetric two-column layout: a sticky or label column in the left third, with content starting at about 33.7% (x≈485 px at 1440). Headings, quotes, lists and FAQ items all start on that line.
- **Section boxes:** `.section_box` is a rounded `#1c1c1e` panel inset by the gutter. It has a header strip, the section title in accent colour at h3/h4 size, and a 1 px divider underneath.
- **Radius:** a single radius everywhere, `--_theme---border-radius: .4rem` (about 6 px). Pills, cards, buttons and media all share it, apart from round icon buttons.
- **Borders:** 1 px solid `#3a3a3e`, or **1 px dashed** for list separators, caption boxes and the FAQ. Dashed lines are a key motif.
- **Breakpoints:** Webflow defaults (991 / 767 / 479).

### 2.10 Buttons and the `»` detail
`.global-button` is a 2.4rem-high split button:
```
[ LABEL (mono caps, .75rem) | divider | » Lottie arrow ]
```
- **Base style:** `border 1px #3a3a3e`, `bg #1c1c1e`, radius .4rem, `padding-left .6rem`, `padding-right .3rem`, `overflow hidden`.
- **Variants:** green "is-menu" / CTA (`bg #00bf2a1a`, `border #00bf2a`, `text #00bf2a`, `backdrop-filter blur(8px)`), plus accent-tinted versions via the theme vars ("CONTACT" yellow, "PRICING" red, "TRY NOW" dark).
- **The `»`:** a Lottie (`button-arrow-green.lottie`, `-yellow`, `-blue`, red `bequant_button-arrow.json`, white `…_dark-page.json`) sitting after a vertical divider (`.global-button_divider`, 1 px border-right, 15% opacity in green).

**Hover**, which needs two systems:
1. **IX2 `🔘 Button [In]`:**
   - The divider height snaps to 100%, then animates to **75%** over 300 ms `outQuad`.
   - `.global-button_overlay` (`backdrop-filter: blur(5px)`, `#ffffff0a`) fades in.
   - The arrow Lottie plays 0 → 100 over 500 ms. The `»` chevrons slide through and out.
   - On mouse-out the divider returns to 100% and the Lottie runs back to 0.
2. **GSAP typewriter re-type:** on `mouseenter` the label is masked to invisible and re-typed glyph by glyph at **0.051 s per character** (dim 0), plus a `.hover-write` class.

See `btn-0-rest.png` → `btn-hover-200.png` (label half typed: "GET ST") → `btn-hover-900.png`.

The older `.button.dark-on-dark` uses the same structure. Its arrow container height goes 100% → 50%, and the border turns red `rgb(255,45,45)` over 300 ms `inOutQuint`.

Other recurring components:
- **Caption box:** `.caption-box`, a mono-caps label in a **dashed** 1 px border box with an icon, e.g. "◎ TRUSTED BY 600+ NETWORKS". It reveals by width (see section 4).
- **Explore links:** `.global-explore_arrow`, a square 2.4rem icon button with a `»` Lottie that plays on card hover.
- **Toggle:** green on/off switch, used in the bufferbloat and ACM demos.
- **Check list:** green circle-check rows separated by dashed lines.

### 2.11 Typewriter text reveal (the signature system)
`[typewriter="true"]` elements on every page. This is custom code, about 200 lines, with no SplitText.
- **Initial state:** CSS sets `mask-image: linear-gradient(rgba(0,0,0,.1) …)`, so text renders at **10% alpha** (only while `html.tw-js` is set, which means no-JS degrades gracefully).
- **Measuring:** a `Range` reads every glyph's right edge and groups glyphs into visual lines (handles wrapped text, without wrapping spans).
- **Painting:** each frame repaints a **3-layer mask**: full-alpha rows for finished lines, a full-alpha rectangle up to glyph *k* on the current line, and a 10% base. *k* is driven by a GSAP tween, `ease: none`, over `0.7s / typewriter-speed`.
- **Trigger:** `ScrollTrigger {start: "top bottom", toggleActions: "restart none none none"}`. It **re-types every time** the element enters, and Lenis keeps it smooth.
- **Attributes:** `typewriter-speed` (0.2–3.5), `typewriter-delay` (ms, or `page-loaded <ms>` for hero copy), `typewriter-from` (resting alpha), `typewriter-trigger` (click re-type group), `typewriter-breakpoint`.
- **Resilience:** it honours `prefers-reduced-motion` and re-measures on resize or Weglot language swaps.

The result looks like a cursor "printing" through dim pre-set text. Mid-reveal frames are visible in `home-s06.png`, `home-s12.png` and `qoe-s02.png`.

### 2.12 Section "settle" scrub (global)
IX2 `🌐 Section [In]` applies to every `.section_box`, as SCROLLING_IN_VIEW with smoothing 50:
- At progress 0: width **95%** and `translateY(5vw)`.
- At 25% progress: width **100%** and `y 0`.

Each rounded panel therefore widens and rises into place as it enters, which reads as a subtle "zoom to fit" (`transform-origin: 50% 0`). The bento grid uses the same idea, finishing at 35% progress.

### 2.13 Sticky CTA card with index (global on home, product and resources pages)
- **Card:** `.sticky-cta_layout` is a **white** card (20rem, `position: sticky; top: .8rem; z-index: 999`) in the left indent column of each section box.
- **Top row:** the logo mark plus a large accent-coloured index ("1.0", "2.0", "BQN.0") and a dark **TRY NOW »** button.
- **Bottom row:** the current section title with an underlined "Index" or "Explore" link.
- **Hover:** card `scale 1.025` over 600 ms `outExpo`. The index list (`.sticky-cta_index`) expands from height 0 → auto over 800 ms `outExpo` and lists the page's sections as mono caps links.
- **Auto-expand:** the list also opens via ScrollTrigger while a `[bqn-index="show"]` section is between `top 50%` and `bottom 20%` (GSAP `height`, 1.2 s `expo.out`).
- **Product pages:** the decimal ticks 1.0 → 1.1 → 1.2 → 1.3 as each `[bqn-element="index-title"]` section passes `top-=10% top`. The digits strip moves `y: -index*1.6rem` over 0.5 s `power2.out`, like an odometer, and the title text swaps.
- **Progress bar:** a 1 px progress line under the top row (`.sticky-cta_divider-progress`) scrubs width 0 → 100% across the section wrapper (IX2 continuous).

---

## 3. Sitemap

From the primary nav, the footer and `sitemap.xml` (156 EN URLs; ES and PT duplicates via Weglot):

- **Home** `/`
- **Product** (dropdown):
  - `/enhance-subscriber-qoe` (red theme)
  - `/maximize-network-capacity` (yellow)
  - `/advanced-network-analytics` (blue)
  - `/bqn-platform`
  - Documentation → `/docs/*` (23 pages)
  - `/product-updates` + `/product-updates/*` (13)
  - User Guide
- **Company** (dropdown):
  - `/customers`
  - `/news` + `/news/*` (62)
  - `/resources` + `/resources/*` (14; case studies, briefs, guides, videos)
  - `/careers`
  - `/about`
- **Buy** `/buy` (licence and partners, partner directory → `/partners/*`, 29 entries)
- **Contact** `/contact`
- **Get Started** → `/request-trial`
- **Footer extras:** `/faq`, `/pricing` (an older page template, wf-page `64ca…`), `/t/privacy-cookie-policy`, `/search`

Page types analysed below: Home, Product (QoE, plus Capacity and Analytics, which share its template), Platform, About, Customers, Careers, News index, News article, Resources index, Case study, Contact, Buy, Product Updates, and Request Trial.

---

## 4. Per page, section by section

Notation: **IX2** means a Webflow interaction, with durations in ms and Webflow easing names; **GSAP** means custom code. "Typewriter" means the mask reveal from section 2.11.

### 4.1 Home `/` (about 14,900 px tall)
| # | Section | Layout and content | Animation |
|---|---|---|---|
| 0 | Nav | See section 2.4 | Load: slides down 1.2 s ease. Scroll: pill scrubs to the right (0–300 px, scrub .6); GET STARTED fades and scales out (225–300 px); logo collapses at 100 px (0.2 s quad.out) |
| 1 | `section_hero` (100vh) | Full-bleed **looping light-streak video** (13 s Vimeo MP4 that cycles **red → yellow → blue streaks**, the three product colours) with a top-down black gradient (`linear-gradient(#000 25%, transparent)`). In the 33% column: a dashed caption box "◎ TRUSTED BY 600+ NETWORKS", the display heading "Maximize your network.", a lead paragraph, and a frosted **news ticker card** with 3 rows (NEWS / PRODUCT UPDATE / CASE STUDY), each with a mono date, a thumbnail and a title, separated by dashed lines | **IX2 PAGE_FINISH:** text wrapper opacity 0→1 (500 ms) and `y 2rem→0` over **3000 ms outExpo**; paragraph same; video and gradient opacity 0→1 over 1000 ms; news card **height 0→auto over 1700 ms outExpo, 500 ms delay**. **Typewriter:** heading (speed 2, `page-loaded 300`), news titles (speed 3, `page-loaded 800`), categories. The video plays continuously (`autoplay loop muted playsinline`) |
| 2 | `section_home-grid` | H2 "AI-powered optimization solving complex problems.", then a **bento grid** of `#1c1c1e` cards. Large red card: an animated Lottie grid of squares (`QoE_Large_Grid.json`, loop) beside an eyebrow, title, body and stat "-35% ↓ SUPPORT CALLS" with an attribution. Right: the "BQN PLATFORM 400 Gbps" card with a red streak video, and an ACM card with a Lottie AI icon. Below: a blue analytics card with a Lottie scatter chart (`Network_Large_Grid_V4.json`) and a yellow capacity card with a yellow streak image and a "+10% ↑" stat | **IX2 continuous:** the grid layout widens from 95% to 100% and rises 5vw → 0 over the first 35% of scroll progress. **Hover on card** (`🏡 Bento Card`): bg #1c1c1e → #1f1f20 (200 ms); media `scale 1.05` (800 ms outExpo); icon Lottie plays; stat icon slides `y -100%` (500 ms outQuad); explore arrow Lottie plays. **Typewriter** on the mono eyebrows and captions (delays 0–400 ms) |
| 3 | `section_box` Enhance Subscriber QoE (red) | Rounded panel with a red header title. Sticky white CTA "1.0 TRY NOW / Enhance Subscriber QoE · Explore" in the left column. Content: H2 "Higher speed, lower latency and less packet loss.", then a **2×2 feature card grid** ([TCPO], [AQM], [ACM], DPI) with bracketed red acronyms and an eye icon button. Each card has a looping Lottie diagram (TCP proxy box with dots, queues, ACM spike graph, app tiles). Then a pull **quote** with a big outlined quotation-mark glyph, accent-coloured `<strong>` phrase and mono attribution. Then "Transform your bufferbloat network grade." with an interactive **bufferbloat demo**: two dashed panels, toggle off vs. toggle "ACM + TCPO" on (green-tinted panel) | **Section settle** (95% → 100%, 5vw → 0). **Typewriter** on the H2 (`box_heading-text`, speed .4 means 1.75 s) and the quote (speed .4). **Bufferbloat demo** (IX2 SCROLL_INTO_VIEW, *loop*): numbers and metrics fade from 0 / 0.2; a spinner Lottie runs **6000 ms**; per-row number Lotties count (1500 ms); grade badge `y 100%→0`. **Toggle on:** dot `x → 1rem` (1000 ms outExpo, 500 ms delay), border and dot turn green, caption whitens (400 ms outQuad). **Sticky CTA:** sticky, hover scale 1.025, index expands |
| 4 | `section_logos` | Bordered card with a red-to-transparent gradient border: "BQN Platform Powers **600+ ISPs**" and a logo strip with edge fade gradients (5rem) | **GSAP marquee:** the track is duplicated, `xPercent: -50`, **40 s linear, repeat -1**, with `gsap.utils.wrap(-50, 0)` (speed attribute `bqn-marquee-speed`) |
| 5 | `section_box theme-yellow` Maximize Network Capacity | Same template, yellow. Sticky "2.0". Tab-like feature list, then stats "10% MORE USERS PER AP / PER OLT PORT" in huge light numerals with a dashed vertical divider | **Counters** (`count-up="true"`): start at 50% of the target and **tween to the target over 2000/speed ms** (speed 2.4 means about 0.83 s), `power2.out`, when the element passes `top 80%`. Optional reset on leave. Plus settle, typewriter and sticky CTA |
| 6 | `section_cta theme-yellow` | Wide dark card with an **animated gradient border** (`linear-gradient(150deg, accent, #232325 25%, accent 50%…)` masked to 1 px using `mask-composite: exclude`) and a looping **Lottie yellow line graph** behind the content (blurred glow, overflowing the edges). "Maximize your network capacity. *Start today.*" (second line in grey), with TRY NOW » and CONTACT » buttons stacked on the right | Lottie autoplay loop (`BQN_Graph-cta.json`); button hovers |
| 7 | `section_box theme-blue` Advanced Network Analytics | Sticky "3.0". H2 and lead. Two **product-UI chart cards** (scatter "Latency vs Average Speed" and heatmap "Latency over time", each with a blue "NEW" badge), a checklist of 6 capabilities, then a quote with a blue accent and a Lottie pie/segment graphic (`CTA_pie_blue-dark.lottie`) plus a pulse-ring Lottie | Settle, typewriter (quote speed 0.2 means 3.5 s), Lottie loops |
| 8 | `section_home-about` | H2 mission statement (typewriter, **speed 0.2**, a very slow 3.5 s print), then a **staggered offset grid** of two link cards: "THE BIGGER VISION / About Bequant" (red streak video, wide card on the right) and "CAREERS / Open positions" (photo, lower left), each with a `»` icon button | Card hover: media `scale 1.05` over 800 ms outExpo, explore Lottie plays |
| 9 | `section_faq` | Left: "FAQ" heading, red "/ Platform capabilities, outcomes & fit" subtitle, and a Lottie of red "?" tiles turning into ✓ tiles. Right: native `<details>` FAQ items with round ⊕ icons, separated by dashed lines | **Pure CSS accordion:** `interpolate-size: allow-keywords`; the answer wrapper goes `height 0 → auto` over 600 ms `cubic-bezier(.65,0,.35,1)` and opacity over 300 ms; `@starting-style` handles the open state; the icon rotates 45° (450 ms) and the ring turns white with a 10% white fill. Sets `bqn-index="show"`, so the sticky CTA index opens here |
| 10 | `section_box` News (latest) | "Announcements and company updates." with a `»` button. Rows: mono category/date at left, image (380 px) in the middle, title and READ » on the right, separated by dashed lines. A sticky **newsletter card** (white, "Get updates ✓ 1-2 MONTHLY EMAILS", name field with a round → button). Then "Latest product updates and new features." as an alternating-row list with ≫ buttons, and ALL UPDATES » | **Row hover** (`🏡 News`): a hover layer appears (150 ms), image `scale 1.05` (800 ms outExpo), arrow Lottie plays. **Newsletter card** (CSS): on hover or focus-within, the hidden email fields expand `height 0 → auto` (via `interpolate-size`), the round button scales to 0, and the field underline fades in (300 ms) |
| 11 | `section_cta-split` | Left card: "Bequant powers **600+** networks globally." with a **dotted world map Lottie** (red points with pulsing halos, loop) and a CUSTOMERS » button. Right card: dashed caption "5 MILLION SUBSCRIBERS POWERED", "Ready to improve your network quality?", REQUEST FREE TRIAL » (green), and **concentric arc lines** (one dashed red) bottom-right as a Lottie (`CTA_Circle3.json`) | Lottie loops |
| 12 | Footer | See section 2.6 | Footer logo Lottie autoplays once; link hover turns red |

### 4.2 Product page `/enhance-subscriber-qoe` (template shared with `/maximize-network-capacity` and `/advanced-network-analytics`; about 16,800 px)
| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | `product-hero_section` (100vh) | Full-bleed **light-streak "warp tunnel" video** (red and cyan streaks converging). Top-left of the 33% column: a dashed red icon tile with "BQN PLATFORM / Enhance Subscriber QoE" in red. H1 "Higher speed, lower latency and packet loss.", a green REQUEST FREE TRIAL » button, and a bottom row of frosted cards (testimonial with portrait and quote; stat "SUPPORT CALLS ⓘ -35% ↓" with a Tippy tooltip) | **IX2 PAGE_FINISH** (`⭐ Product Page [Load]`): video 0→1 (1000 ms); top block `y 2rem → 0` (**2000 ms outExpo**) with opacity; bottom cards **height 0 → 100% (1000 ms outExpo)** then quote, captions and stat fade in. **Scroll:** IX2 continuous `Product Hero V2` blurs the video **0 → 25 px** between 70% and 100% of hero scroll-out. Typewriter on the H1 and details |
| 2 | `section_large-list` | Sticky CTA appears with "1.0 · Benefits · Index" (here showing a logo mark and index list). H2 with a two-tone sentence (white lead phrase, grey remainder). Three wide benefit rows: 3:2 image left, title and sub right, in `#1c1c1e` panels | **IX2 Large List [In]:** each image wrapper **width 0 → auto over 2000 ms outExpo, staggered 0 / 250 / 500 ms** (a horizontal wipe-open). It resets to 0 when scrolled out, so it replays |
| 3 | `section_quote` | Big quote with an outlined quote glyph and red accent phrase | Typewriter |
| 4 | `section_box` Results | "Transform your bufferbloat network grade." demo (as on home), "QoE ensures better speed test results…" | Bufferbloat loop (see home row 3); the index ticks to **1.1** |
| 5 | `section_logos` | Marquee | GSAP marquee |
| 6 | `section_box` [TCPO] | H2, lead, two-column body copy. **Speedometer** graphic (`graphic_tcp-component`): red and grey arc gauges, MIN/MAX SPEED labels, a legend "UNUSED CAPACITY / WITH BEQUANT". A "VIDEO EXPLAINER – How BQN TCPO works" card opens a lightbox. "BEQUANT'S TCP PROXY" diagram. Page-load-time bar graph | **Speedometer** (IX2, loops while in view): BQN-on button Lottie (1000 ms, 500 ms delay), gauge Lottie to 75% over **8250 ms**, then to 100% over 2750 ms, then reset. **Bar graph:** `.graph` height 0 → auto (1200 ms **inOutExpo**, 100 ms delay), labels fade (1200 ms). **Lightbox hover:** thumbnail scale 1.05 (1000 ms outExpo), play button 1.1, Lottie ring. **Click:** modal bg fades, content `scale .9 → 1` (800 ms outExpo). **Inner panels:** `box_inner-box-background` `scaleX 0 → 1` (800 ms outExpo), a left-to-right fill. Graph bars on hover: highlight one, dim the other to .75 (500 ms outQuart). Index **1.2** |
| 7 | `section_box` [ACM] | "Reduce subscriber latency and packet loss as network demand changes.", H4 lead, two-column copy, "REAL-TIME VISUALIZATION" panel with an "ACM ON" toggle and a red spike chart, plus a retransmission graph | **Retrans graph:** Lottie draws (2000 ms, 500 ms delay); the toggle switches on at 1500 ms (dot slides 1.1rem outQuad, turns green). Index **1.3** |
| 8 | `section_cta-large theme-red` | Rounded media card (30rem tall) with a **video/photo** (gamer), overlapped at the bottom by the gradient-border CTA card "Enhance your subscriber QoE. *Start today.*" with TRY NOW » and PRICING » (red) | **Parallax:** IX2 continuous `Large CTA Paralax` moves the media `y 3rem → -3rem` across the section's scroll (smoothing 80). The media is 8em taller than its frame |
| 9 | `section_box` [AQM], DPI | Same patterns: feature graphics, queue Lottie, app-tile Lottie | Same |
| 10 | `section_faq` | `<details>` FAQ | CSS accordion |
| 11 | `section_cta-large` | Closing CTA | Parallax |

*Capacity page:* adds **Webflow tabs** (`box_tabs-link`). On activation the icon `scale 0 → 1` (800 ms outExpo), the title slides `x -2.2rem → 0` (800 ms outExpo) and the paragraph shows; each tab pane holds a looping video. It also has graph Lotties scrubbed on enter (`Graph Lottie [In]`, 0 → 100 over 2 s or 4 s, reset on leave).

### 4.3 BQN Platform `/bqn-platform` (about 9,800 px)
| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | `section_platform-hero` (511 px, no video) | Server icon tile "ALL-IN-ONE / BQN Platform", H1 "Internet optimization starts here.", green CTA, and a full-width hairline below | Typewriter (page-loaded); nav slide-in |
| 2 | `section_large-list` | Sticky CTA "BQN.0" (index list: Included functionality, Deployment, Hardware, Integration, Pricing). Two-tone H2. Three rows `01 / ENHANCE SUBSCRIBER QOE` (red), `02 / MAXIMIZE…` (yellow), `03 / ADVANCED…` (blue), each with a looping streak **video** thumbnail. CORE BENEFITS check list | Large-list wipe-open (0 / 250 / 500 ms stagger, 2 s outExpo) |
| 3 | `section_box` Deployment | "Easy to deploy in any network setup." and a full-width **network topology diagram** (Lottie) on a faint grid, with a dashed red "ISP's Central Office" box highlighting the BQN node | **IX2:** the Lottie scrubs to frame 6, then to **67% over 1200 ms easeOut** on enter and resets on exit (the diagram draws its links) |
| 4 | `section_logos` | Marquee | GSAP |
| 5 | `section_box` Hardware | Full-width **data-centre corridor video** | Video loop; index ticks to BQN.2 |
| 6 | `section_box` Integration | 5-column grid of integration partner logo tiles (`#1c1c1e`), greyscale | Settle |
| 7 | `section_box` Pricing | "Simple and flexible." pricing tiers | Settle, typewriter |
| 8–9 | FAQ, CTA-large | as above | as above |

### 4.4 About `/about` (about 4,350 px)
| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | `section_about-hero` (100vh) | Full-bleed **red data-centre light video** (glowing nodes and streaks). Bottom-left: caption box "ABOUT" and a 3-line display heading with an *italic* "quality" | Typewriter; video loop; caption-box reveal |
| 2 | `section_paragraph` | H4 "Optimizing networks" at the 33% indent, two columns of grey body text | none beyond the nav |
| 3 | `section_box` Executive team | 3-column **staggered** grid of large portrait cards on white backgrounds. Row 1 occupies columns 1–2, row 2 columns 2–3. Each has name (h5), red mono role, and bio | Section settle |
| 4 | `section_cta-large theme-green` | Image CTA with parallax | Parallax |

**Caption box reveal** (IX2 `🌐 Caption [In]`, global): the dashed box starts collapsed to **width 2.1rem** (icon only) and expands to **auto over 1000 ms outExpo after 500 ms**. The label unrolls.

### 4.5 Customers `/customers`
| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | `section_customers-hero` (100vh) | **Dotted world map** (grey dots; red dots and pulsing red halos for customer clusters, Lottie). Bottom-left: caption "CUSTOMERS" and H1 "More than **600+** networks are powered by the BQN Platform." | Lottie loop; caption reveal; typewriter |
| 2 | `section_box` Testimonials | Red eyebrow "TESTIMONIALS", two-tone H2 "Don't just take our word for it. *Explore our customer stories.*" (second line grey), 3-column cards with large greyscale customer logos, red mono country, quote text below | Settle; typewriter |
| 3–4 | FAQ, green CTA | | |

### 4.6 Careers `/careers`
- **Hero:** a red light-swirl image bleeds from the left edge. Caption "CAREERS", H1 at the indent.
- **Content:** "Building products of tomorrow" two-column text, a wide photo, then "Application process" with a red underlined email.
- **Open positions box:** has a green count badge, which JS counts from the visible `.careers_jobs-item` elements.
- **Accordion job cards** (IX2 click and second click):
  - Body `height 0 → auto` (1200 ms outQuad).
  - Chevron rotates 180° and nudges up (1200 ms outExpo).
  - Card border turns **red** (200 ms).
  - Deep-linking via `#hash` (custom jQuery that triggers the click).
- **Headquarters box:** an office Lottie map.

### 4.7 News index `/news` (also `/product-updates` and `/resources` share the "news-top" header)
| # | Section | Layout | Animation |
|---|---|---|---|
| 1 | `section_news-top` | H1 "Latest news from Bequant." with **underline tabs** (News / Product Updates / Resources, each a separate page with the active one white and underlined) on a full-width hairline. Left column: blurb, "FOLLOW US" with round social icons | Typewriter on the H1 |
| 2 | `section_news-featured` | Featured post: full-width 16:9 image card plus category/date mono line plus H3 title | none (static) |
| 3 | `section_news` | **3-column CMS grid with deliberate holes.** JS inserts `.news_list-spacer` at positions 1, 5 and 7 of every 9 items (desktop only), which produces a broken, staggered checkerboard. Each item: image, red "NEWS / date" mono line, title, dashed bottom border | No scroll animation (static) |

### 4.8 News article `/news/<slug>`
- **Header:** "↖ NEWSROOM" back link (mono) on a hairline. Meta "NEWS / SEPTEMBER 21, 2026". H1 at h2 size. Left rail of round share buttons (Facebook, LinkedIn, X, copy-URL; copy uses `navigator.clipboard`).
- **Hero image:** in a `section_box is-news` panel, which gets the section settle scrub.
- **Rich text:** at the 33% indent, with rounded figures. Weglot-aware video embeds.

### 4.9 Resources `/resources` and case study `/resources/<slug>`
- **Index:**
  - Header tabs (Resources active).
  - Sticky CTA "BQN.0" with an index (Datasheets / Case Studies / Solution Briefs / Technical Guides / Videos), driving an odometer index as on product pages.
  - Featured datasheet card (PDF mock with a red glow).
  - Section boxes per category with large-list wipe reveals.
  - A Vimeo iframe "Videos" box (with leftover debug logging code).
- **Case study:**
  - Hero: "↖ RESOURCES", "CASE STUDY / ARTICLE + PDF" meta, H1, lead, green DOWNLOAD PDF », and a 16:9 image in a settle panel.
  - **Sticky scrollspy** in the left column. JS slugifies the article's H2s, builds the link list, and marks the active link (current white, others grey) on scroll.
  - A **circular SVG scroll-progress ring** next to "OVERVIEW": `strokeDashoffset` is driven by scroll position over `[data-scroll-container]`, with a green stroke.
  - Repeated DOWNLOAD PDF button.
  - Uses a different Webflow bundle (`webflow.723405e4…js`, CMS template page).

### 4.10 Contact `/contact`
- **Layout:** H1 "Get in touch with us." in the left third; the form starts at the 33% indent.
- **Fields:** underline-only inputs with mono caps labels and light placeholders ("e.g. James Kinfolk*").
- **Selects:** custom dropdowns (Finsweet selectcustom; arrow rotates 180° on open).
- **Submit:** textarea, reCAPTCHA, green SEND MESSAGE button.
- **Below:** a contact info strip.
- **Chat:** HubSpot chat auto-opens with a red header.
- **Motion:** no motion beyond nav and typewriter.

### 4.11 Buy `/buy`
- **Hero:** H1 "Acquire our BQN product." Two large row cards: image left (red streak art; technician photo), with eyebrow (green "BQN LICENSE" / red "PARTNERS"), H4, copy and button (SEE PRICING » green, FIND PARTNER »). Large-list wipe reveal (`is-buy2025`, square images).
- **Form box:** "Request free trial or quote." (same form system).
- **Partner directory:** "Find a local partner." search input ("Search by country", underline style) plus region **filter chips** (WORLD active with a red border and red-tint fill; AFRICA, AMERICAS…). Finsweet cmsfilter gives a live count, "**29** partners found". It's a 2-column grid of partner cards (logo centred, mono name and red country, contact lines, WEBSITE » button).

### 4.12 Product Updates `/product-updates`
News-top header and tabs, a featured update with the sticky **newsletter card** (hover-expands, as on home), and an alternating-row update list (mono "NEW RELEASE" / "FEATURE" tags in accent colours, dates, titles, ≫ buttons). The caption box reveals and the sticky progress bar scrubs.

### 4.13 Request Trial `/request-trial`
A split layout:
- **Left:** H1 "Request your *free* trial now." (italic "free"), a green-check list with dashed separators, and a **Swiper coverflow testimonial slider** (`effect: coverflow, rotate 20, depth 100, speed 1100, autoplay 6500, loop`, progress-bar pagination).
- **Right:** a **white** form card (light surface, dark text) with a full-width green submit button.

---

## 5. Reusable patterns worth borrowing

1. **Typewriter mask reveal.** Pre-render text at 10% alpha, then animate a 3-layer `mask-image` (finished rows, then the current row up to glyph *k*, over a dim base) using glyph rects from `Range.getBoundingClientRect()`. Re-run on viewport enter. In Next.js this is a small hook plus a GSAP tween on `k`, with no SplitText and no span soup.
2. **Hover re-type on buttons.** On `mouseenter`, mask the label to 0 and re-type at about 50 ms per character. It pairs well with mono uppercase labels.
3. **Split button with `»` Lottie and shrinking divider.** Layout is `[LABEL | divider | »]`. On hover the divider height eases 100% → 75%, and the `»` plays a short chevron-slide (a Lottie or two stacked SVG chevrons translating 100%). Accent variants come from CSS vars.
4. **Nav that re-docks on scroll.** The centre menu pill tweens `x` to the right edge, scrubbed over the first 300 px. The primary CTA scales to 0.8 and fades. The logo collapses to a frosted square at 100 px. One ScrollTrigger with `scrub: .6` is enough, and there's no hide-on-scroll.
5. **Section "settle" scrub.** Each rounded panel goes `width 95% → 100%` and `translateY(5vw) → 0` over the first 25% of its entry progress (`transform-origin: top`). Use a ScrollTrigger with scrub, or CSS `animation-timeline: view()` with `animation-range: entry 0% entry 100%`.
6. **Sticky white CTA card with an odometer index.** A sticky card sits in the left 33% column. A decimal counter (1.0 → 1.1 → …) moves its digit strip by `-index*lineHeight` when each section passes the top, the title swaps, and a thin progress line scrubs across the section. The index list expands on hover.
7. **Product-coloured themes through CSS vars.** A single `.theme-{red|yellow|blue|green}` class re-points accent, tint and button vars, so each product page and section recolours eyebrows, accent words, borders and arrows automatically. In Tailwind v4 this maps cleanly to `@theme` vars plus a `data-theme` attribute.
8. **Wipe-open media.** Image wrappers animate `width 0 → auto` with outExpo over 2 s, staggered 250 ms, and reset when out of view. CSS `interpolate-size` or GSAP `width: auto` both work.
9. **Caption-box unroll.** A dashed mono label box starts at icon-only width (2.1rem) and expands to auto after 500 ms (1 s outExpo).
10. **CSS-only accordion and expanding forms.** Use `<details>` with `interpolate-size: allow-keywords`, `::details-content` and `@starting-style` (height 0 → auto, 600 ms `cubic-bezier(.65,0,.35,1)`, icon rotates 45°). For the newsletter card, `:hover`/`:focus-within` grows a `height: auto` region with no JS.
11. **Gradient hairline CTA border.** Use a 1 px `padding` box with `linear-gradient(150deg, accent, neutral 25%, accent 50%, …)`, masked with `mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude`, over a blurred looping line-graph Lottie or SVG.
12. **Looping "light streak" hero video.** A 13 s muted MP4 cycles through the three brand colours under a `linear-gradient(#000 25%, transparent)` top fade. On product heroes it blurs 0 → 25 px as you scroll out (filter scrub over the last 30%). This is cheaper than WebGL and could be replaced by a shader later.
13. **Large CTA parallax.** Media 8em taller than its rounded frame, translating `y 3rem → -3rem` across the section's scroll.
14. **Infinite logo marquee.** Duplicate the track and run `gsap.to(track, {xPercent: -50, duration: 40, ease: "none", repeat: -1})` with 5rem edge fade gradients. CSS `@keyframes` works just as well.
15. **Count-up stats.** Start at 50% of the target and tween to the target in about 0.8 s `power2.out` at `top 80%`. The start-at-half keeps the numbers from jumping from 0.
16. **Live "product demo" micro-graphics instead of screenshots.** Toggles switch on, spinners resolve into grades, gauges sweep, and diagram Lotties draw on enter, then reset on leave so they replay. Every feature card shows its mechanism.
17. **News grid with intentional holes.** Insert empty cells at fixed positions (1, 5, 7 of every 9) in a 3-column grid for an editorial, staggered rhythm.
18. **Article scrollspy and progress ring.** Auto-build a sticky TOC from the H2s and add an SVG circle whose `stroke-dashoffset` tracks reading progress.

### Caveats and inferences
- ScrollTrigger reported `end: 300` for `"+=300vh"`, so in practice the nav scrub runs over about 300 **px**. That is observed, and the authors probably intended 300vh (inferred).
- The `logo="hide"` purpose (avoiding overlap with cards) is inferred from attribute placement.
- Hero videos were sampled at 2.5 s intervals. The red/yellow/blue cycle was observed at load, t≈9 s and t≈4 s.
- Some IX2 durations, like the bufferbloat loop, play in sequence groups. Listed values are per group, not totals.
