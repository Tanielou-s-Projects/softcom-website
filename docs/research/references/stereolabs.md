# Stereolabs.com: how it's built and how it moves

Researched 2026-10-14 at a 1440×900 viewport with motion enabled. Screenshots are in `research/stereolabs/`. Per-page scroll captures are `<page>-yNNNNN.png`, contact sheets are in `stereolabs/sheets/<page>-sheetN.png`, and the raw probe data is in `<page>.json`, `home-dyn.json` and `dyn2.json`. The probe scripts are in `research/sl_tools/`.

## The short version

Stereolabs is a **Next.js App Router + Sanity** site, the same stack as Softcom. It is **deliberately low-motion**. There is no GSAP, Lenis, Framer Motion, Three.js, Lottie or Rive. It has no scroll-triggered reveals, no pinned or scrubbed sections, no preloader, no page transitions and no custom cursor. Almost all of the "motion" comes from **video** (Mux-hosted, muted, looping 3D renders and perception-UI footage). A small set of **CSS transitions** covers the UI chrome: a hide-on-scroll header, a mega menu that grows in height, accordions, colour crossfades and a logo marquee. The premium feel comes from art direction rather than from animation:
- product renders sitting on rocks against muted, earthy backgrounds
- a single neon-lime accent
- a technical crosshair grid
- NB Akademie paired with NB Akademie Mono

---

## 1. Tech stack

| Layer | Finding | Evidence |
|---|---|---|
| Framework | **Next.js App Router** on Vercel | `/_next/static/chunks/app/(website)/[lang]/[[...paths]]/page-*.js`, `server: Vercel`, `x-powered-by: Next.js`. It uses a catch-all `[[...paths]]` route with a `[lang]` segment, so pages are CMS-driven. |
| CMS | **Sanity** | 536 `https://cdn.sanity.io/images/s18ewfw4/staging/...` image URLs, plus `sanity.imageCrop` and `sanity.imageHotspot` in the RSC payload. The dataset name is "staging". |
| Styling | **vanilla-extract** with `@vanilla-extract/recipes` (CSS-in-TS, zero runtime) | Hashed classes such as `_80a5p01` and `t2il382`. Variables are hashed too (`--xy86ox0` …). Bundles contain `variantClassNames` / `compoundVariants` / `defaultVariants`. |
| Video | **Mux** (`stream.mux.com/<id>/high.mp4`, `image.mux.com` posters), shown with native `<video>` in the hero and a lazily loaded Mux player elsewhere | 20 stream URLs and 69 poster URLs. The player chunk loads through `next/dynamic` with `ssr:false`. |
| In-view detection | **react-intersection-observer** (`useInView`) | Bundle signature `{threshold, delay, trackVisibility, rootMargin, triggerOnce, skip, initialInView, fallbackInView}`. It is used with `rootMargin:"-150px", triggerOnce:true` to **mount** video players and code snippets lazily, not to animate them. Video play/pause is driven by an in-view flag (`e.play().catch(...)` / `e.pause()`). |
| Carousel | Custom-built, no Swiper or Embla | Its dot buttons carry `aria-label="Go to slide N"` (class `anvm7f1`). |
| Animation libraries | **None** | `window.gsap`, `ScrollTrigger`, `lenis`, `THREE` and `lottie` are all `undefined`. The bundles have no matches for gsap, ScrollTrigger, SplitText, lenis, locomotive, framer-motion, motion/react, lottie, swiper or embla. |
| Smooth scroll | Native only | `html { scroll-behavior: smooth }` handles anchor jumps (product sub-nav). There is no scroll hijack. |
| Store | `/store` is a **separate Next.js app over headless Shopify** | It references `cdn.shopify.com` 370 times, has a different header (full-width flat bar rather than a floating card) and does not expose `window.next`. |
| Cookie consent | Cookiebot | `#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll`. It appears as a full-width cream (#EEEEDE-ish) bottom sheet with a lime "Allow all" pill. |
| Analytics | Google Tag Manager | |
| Reduced motion | Only one rule, which disables the tweet-embed skeleton shimmer | `@media (prefers-reduced-motion:reduce)` |

**Fonts:** both families are self-hosted through `next/font/local` under the aliases `fontSans` and `fontMono`. I identified them from the woff2 `name` tables.
- **NB Akademie** (Neubau, by Stefan Gandl): Regular 400, Medium 500, plus the italics. Used for every headline and all body text.
- **NB Akademie Mono**: 400 and 500. Used for eyebrows, tags, spec labels, stat labels and footer column heads. These are always UPPERCASE and small (10–12px), with wide tracking.
- Arial fallbacks use metric overrides (`size-adjust:100.93%` etc.), so swapping fonts in causes no layout shift.

## 2. Global systems

### Colour tokens (`:root`, vanilla-extract `--xy86ox*`)

| Role | Value |
|---|---|
| Accent (lime) | **#D9FF42**. The hover state is **#BBE124**. |
| Ink / near-black | #050505. Dark surfaces use #191919, cards on dark use #2D2D2D, and lines use #3C3C3C. |
| Greys | #6B6B6B (muted text, inactive sub-nav), #C2C2C2, #CCCCCC, #D8D8D8, **#F2F2F2** (footer, light cards), #FFFFFF |
| Earthy "material" backgrounds (one per product or section) | #9F968A taupe, #EEEEDE cream, #DDDDCC, #F5F5CE, #BBC7AB and #98AE95 sages, #CDECEE ice, #B8BBC3 and #6B707C slate, #A5AEAA, #C4C5B0, #DDB6B6 dusty rose, #9F93F8 lavender |
| Error | #CB3546 |
| Focus ring | rgba(0,113,227,.5) |

### Type scale (desktop ≥1000px)

All type is NB Akademie and set tight. Letter-spacing is about −3% on display sizes.

| Use | Size / weight / line-height / tracking |
|---|---|
| Big stat | 80 / 400 / 1.1 / −2.4px |
| Display H1/H2 (sections) | **62 / 500 / 1.0 / −1.86px**. Variants at 72/500/1.0 and 60/400/1.1. |
| Card title | 36 / 500 / 1.05 / −1.08px |
| H3 | 28 / 500 / 1.1 / −0.42px. Also 24 / 500 / 1.15. |
| Lead paragraph | 24 / 400 / 1.2 |
| Button label | 18 / 500 (hero) and 16 / 500 / 1.2 / −0.16px |
| Body | 16 / 400 / 1.36, plus 18 and 14 |
| Mono tags / eyebrows | 10–12 / 500 / 1.3, uppercase, wide tracking |

Breakpoints are `min-width` 430, 740, 1000, 1300 and 1900.

### Grid, spacing and radii
- **40px page gutter at 1440.** Content runs from x=40 to x=1400. Two-up cards are 670px wide with a **20px gap**, and three-up cards follow the same rhythm.
- Headlines and intros cap at about 670px, so they occupy the left half of the page.
- The spacing scale is 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24 … 480px. Sections are separated by a **121px "crosshair rule" row** (`DIV._80a5p06`): thin `+`, `⊢` and `⊣` registration marks at the left edge, the centre and the right edge. This is the signature motif. The same corner brackets frame diagrams, stat rows and spec drawings.
- **Radii:** 4px for cards, the header card and media; 8px for tags; 16 and 24px are available; 9999px for pills (all buttons). The overall feel is nearly square.
- **Shadows:** almost none. One Material-ish token exists.

### Buttons
- **Primary:** a lime #D9FF42 pill with near-black text, 46px tall, `padding:0 18px`, 18px/500 label and a → arrow icon. **Hover** changes only the background, to #BBE124, using `transition: color .2s, background .2s, border .2s, box-shadow .2s`. The arrow does not move.
- **Secondary on dark:** a #2D2D2D pill with white text ("Our Technology", "Contact us"). **Secondary on light:** a #D8D8D8 grey pill ("Learn more").
- **Small / in-card:** the same pills at 16px.
- **Text links:** hovering adds a 1px underline with `text-underline-offset:.2–.3em`.
- **Tags:** "NEW" and price chips ($599) are mono 10–12px uppercase. "NEW" is outlined with a 1px border and 8px radius. Prices are a solid black chip.

### Header / nav

The header is fixed. It is a **floating white card**: 20px inset from the top and sides, 52px tall, 4px radius, with a 1px #F2F2F2 border. On dark pages it switches to #191919 with a #2D2D2D border.

The layout is the wordmark "StereoLabs*" on the left. On the right are Products, Solutions, Ouster + Stereolabs, Developers, Company, then a **lime "Store" pill**, then search, account and cart icons.

- **Hide on scroll down, show on scroll up.** The `.t2il383` class applies `transform: translateY(-(52px+20px))` with `transition: all .2s ease-out`. I confirmed this on home and blog article pages.
- **Product pages swap header rows instead of hiding the header.** After scrolling down, the main nav row fades and slides up (`opacity 0; translateY(-10px)`). At the same moment a **product sub-nav row** fades and slides in from `translateY(10px)`: "ZED X | 01 Overview 02 Technology 03 Tech Specs 04 FAQ | [Order now]". It takes 0.2s ease-out. Scrolling up swaps the main nav back.
  - The sub-nav links are numbered mono-style anchors (`#<hash>`) in #6B6B6B that turn black on hover. Their arrow nudges `translateX(6px)` on hover.
- **Mega menu:** hovering a top item shows a grey pill highlight (`background-color .2s`, radius 9999). Clicking opens the panel.
  - The white header card **grows in height**. Its height is a CSS variable, with `transition: height .25s cubic-bezier(.4,0,.6,1)`.
  - Panels crossfade (`opacity .25s` in, `.1–.2s` out).
  - Items enter from `translateY(-4px)` with opacity 0 → 1 over 0.2s, after a 0.2s delay.
  - A page **backdrop** of `rgba(0,0,0,.4)` fades in over 375ms and out over 0.2s.
  - The Products panel is a row of six product thumbnails (ZED X One, ZED X Series, ZED Series, Digital Lidar, ZED Box, SDK). Each has a "Learn / Order" text-link pair, and a vertical divider sets SDK apart. See `home-mega-click.png`.
- There is no colour change at the top of the page, no shrinking and no scroll-progress bar.

### Other global behaviour
- **Preloader / intro:** none. The 0, 300, 800 and 1500ms frames show the page fully rendered at first paint. The only change is the hero video starting.
- **Page transitions:** none. Navigation is a standard Next client-side route change. No `view-transition` is used.
- **Custom cursor:** none.
- **Footer:** static, on #F2F2F2.
  - Six columns: Products, Store, Solutions, Company, Developers, Contact. The column heads are mono uppercase.
  - Crosshair rules sit above and below.
  - "StereoLabs*" wordmark with the offices (San Francisco, New York, Paris).
  - A bottom bar with copyright, terms, a centred black asterisk logo, privacy, cookie preferences, email and a location selector.
  - The footer has no reveal or parallax.
- **Video component:** one wrapper is used everywhere. It autoplays muted and loops, and plays or pauses when it enters or leaves the viewport. Every video card has a **circular play/pause button in its top-right corner**. The button's ring is an SVG circle whose `stroke-dashoffset` tracks playback progress (`transition: stroke-dashoffset .5s`). A spinning `rotate 360°, 1s linear infinite` loader shows while the video buffers. Off-screen videos use `preload="none"`, and the Mux player only mounts once it is 150px inside the viewport.

## 3. Sitemap

| Type | URL | Analysed |
|---|---|---|
| Home | `/` | ✔ |
| Product (family) page | `/products/zed-x` (also `zed-x-one`, `zed-2`), `/series/zed-box` | ✔ zed-x |
| Technology (AI platform) | `/our-technology` (Terra AI) | ✔ |
| Developers / SDK | `/developers`, `/developers/drivers`, `/developers/release` | ✔ developers |
| Solution (industry) | `/solutions/logistics-automation`, `physical-ai`, `offroad-autonomy`, `smart-infrastructure`, `partners` | ✔ logistics |
| Machine (use case) | `/machine/forklift`, `tractor`, `robotic-arm`, `humanoid-robot`, `autonomous-mobile-robot` | ✔ forklift |
| Vision-log apps | `/visionlog/parcel-counting`, `dimensioning`, `pallet-occupancy-monitoring` | (same template family as machine, inferred) |
| About | `/about` | ✔ |
| News index | `/blog` | ✔ |
| Article | `/blog/<slug>` | ✔ monarch-tractor |
| Store (separate app) | `/store`, `/store/collections/*`, `/store/products/*` | ✔ store (brief) |
| Utility | `/resources`, `/datasheets`, `/certificates`, `/3dmodels`, `/cart` | – |

There is no dedicated contact page. "Get in touch" and "Contact us" CTAs go to forms or modals, or out to `ouster.com/talk-to-sales` and `mailto:`.

## 4. Pages, section by section

The same rules apply on every page unless an entry says otherwise:
- **No entrance animation.** Sections render statically and there is nothing to reveal on scroll.
- In-view videos autoplay. The play/pause ring is described in §2.
- Sections are separated by the 121px crosshair row.

### 4.1 Home `/` (about 15.7k px)

| # | Section | Layout / content | Animation |
|---|---|---|---|
| 1 | Hero | A full-bleed **video** (56s Mux montage that cuts between a ZED camera close-up, a warehouse fly-through with a cyan point-cloud overlay and more), about 700px tall under the floating header. Bottom-left: lime "Order ZED now →" and dark "Our Technology →" pills. Bottom-right: the play/pause progress ring. | Video only (native `<video autoplay muted loop playsinline>`). The ring's `stroke-dashoffset` advances with playback. There is no text animation. |
| 2 | Intro statement | Top-right: a mono eyebrow chip "SPATIAL PERCEPTION" (lime-green outline). Left: H1 "Powering Perception for Physical AI" (62/500), with a 24px lead below. Crosshair marks frame it. | None |
| 3 | Logo marquee | Grey customer logos (Toyota, Honda, NASA, New Holland, Case …) in a 200px band between crosshair rows. | **CSS marquee:** `@keyframes translate3d(0)→(-100%)`, **96s linear infinite**. The track is duplicated for a seamless loop. |
| 4 | Two-up feature cards + wide card | H2 "Industry-leading vision, supercharged with AI." **ZED** card: taupe #9F968A, with cameras floating over a rock. **ZED SDK** card: black, with a video of an excavator plus point-cloud and a lime pipeline UI. Each card has a 36px title, body text and a lime pill at the bottom. Below them, a full-width #191919 card, "A leap in human-like vision", embeds a perception-UI video and a "Discover Terra AI" CTA. | Videos play in view. No card hover effect. |
| 5 | Three value props | Three columns, each with a line icon in a 1px box, a 28px title and body text. | None |
| 6 | Testimonial | A #F2F2F2 card: product image on the left. On the right: a partner logo chip (TROSSEN), a mono uppercase name and title, then a large quote. | None |
| 7 | **Product showcase accordion** | A section with a full-bleed background colour that **changes per product** (sage, taupe …) and a large product render (camera on rock or mesh) on the left. On the right is a stack of white accordion rows: ZED X Nano [NEW], ZED X, ZED X One, ZED 2i, ZED Box Mini [NEW], Ouster Digital Lidar. The open row shows a description, "Order now" and "Learn more". | **Click.** The row expands with `grid-template-rows 0fr→1fr, .4s ease-in-out`, and the title colour shifts over 0.4s. Each product image is stacked absolutely and **crossfades** at `opacity .5s ease-in-out`. The section background changes colour (`background-color .4s linear`). The chevron rotates (`rotate .3s ease-in-out`). See `home-accordion-*.png`. |
| 8 | Stats | H2 "Trusted by innovators and industry leaders". Below it, three stats (22,000+, 100,000+, 1,800+) at 80/400 with mono uppercase labels, all inside corner brackets. | **No count-up.** I sampled the text every 150ms while scrolling into view and the numbers never changed. |
| 9 | News feature | A full-width video card about the Ouster REV8 lidar. Title and summary overlay the bottom-left. | Video |
| 10 | "Helping you achieve your mission" | A dark #191919 band: intro text, then large two-column cards (text plus mono "USE CASES" list on the left, video on the right) for Autonomous Robotics and Digital Twins. | Videos |
| 11 | Case study | Eyebrow "Precision, in action", then a full-width Monarch Tractors video card with "POWERED BY" mono metadata. | Video |
| 12 | Ecosystem | Dark band: "Expanded hardware and software ecosystem", then an 8-column grid of white integration logos (ROS, ROS2, Docker, C, C#, Python, NVIDIA, Unity, Unreal, Windows, Linux …) split by crosshair lines. | None |
| 13 | Starter kits | A mono price chip "FROM $1434 PER KIT", the H2, then three #F2F2F2 kit cards: price chip and NEW tag, title, product image on a grey panel, description, a ruled spec list and "Order now". | None |
| 14 | Latest news | Mono eyebrow "LATEST NEWS", H2 "Find out what's happening", then three article cards (square image, 18px title, excerpt). | None. Card hover has no transform. |
| 15 | Footer | See §2. | None |

### 4.2 Product, `/products/zed-x` (about 19.7k px)

| # | Section | Layout / content | Animation |
|---|---|---|---|
| – | Header | **Swaps to the product sub-nav on scroll down** (see §2): ZED X · 01 Overview · 02 Technology · 03 Tech Specs · 04 FAQ · lime "Order now". The anchors use smooth scroll. | 0.2s fade with a ±10px slide |
| 1 | Hero | A taupe #9F968A full-bleed panel about 810px tall. Left: "ZED X Series" (62px), a subtitle and a lime "Order now". Right: three ZED X cameras floating over a rock (static image). | None |
| 2 | Overview | "Deploy advanced perception today" plus a paragraph. Below it, a **full-width image carousel** of product renders on coloured backgrounds, with pagination dots. | Click-driven slides. The dot indicator is active-state only. I did not see autoplay. |
| 3 | Three features | Icon, title and body: Global shutter, GMSL2, Multi-camera sync. | None |
| 4 | Form factors | "Three form factors, endless possibilities." Three cards (ZED X Nano / Mini / X), each a camera render on a grey panel with lime crosshair marks, followed by a ruled spec list and "Order now". | None |
| 5 | Technical Specifications | A dark #191919 section: tab pills (ZED X Nano / ZED X Mini / ZED X) above a white **line-drawing of the camera** framed by corner brackets. CTA: "Explore Technical Specification". | Tab click swaps the drawing (crossfade, inferred from the shared 0.5s opacity class) |
| 6–7 | Spec video cards | "Crisp vision at any speed." and "Unrivaled lens quality". Each is a full-width video card with its text overlaid at the top-left. A row of big spec numbers (1920x1200 · 3um · 60fps · 120fps / Lens · Wide · Narrow) with mono labels sits inside corner brackets at the bottom. | Videos |
| 8 | Built tough | A slate #6B707C panel showing a camera with water droplets, then 160mm · −5 to 130°F · IP67 · GMSL2 in large numbers. | Video or image |
| 9 | Software stack | A dark band, "Powered by the most advanced vision software stack", with a large depth-map video and a 2-column grid of video cards (Localization, Object detection …). | Videos. Some cards include an in-video scrubber UI. |
| 10 | Use cases | "Giving robots vision in the real world" with three image cards (Embodied AI Training, Outdoor robotics, Robotic arms), each with a "Learn More" pill. | None |
| 11 | Multi-camera | A cream #EEEEDE section: an **isometric line diagram** of a robot and an arm with **lime field-of-view cones** and labelled callout boxes, inside corner brackets. | Static illustration |
| 12–14 | Commerce cards | Recommended products, ECUs (Mini Carrier Board, ZED Box Mini, ZED Box) and starter kits. Each is a price chip with a NEW tag, a title, a render on grey and a "From $…" spec list. | None |
| 15 | FAQ | "Frequently Asked Questions": ruled rows with a "+" icon. | Click. Rows expand with `grid-template-rows .4s ease-in-out`, and the + icon rotates (inferred, same accordion primitive). |
| 16 | Final CTA | A slate card, "Get your ZED X today.", with rocks and a camera render, lime "Order now" and a dark "Contact us". | None |

### 4.3 Solution, `/solutions/logistics-automation` (about 14.8k px)

| # | Section | Layout / content | Animation |
|---|---|---|---|
| 1 | Split hero | 50/50 split. Left: a grey #B8BBC3 panel with a mono eyebrow, the H1 "Vision intelligence for logistics automation", a lead and a lime "Get in touch". At its foot runs a **small logo marquee**. Right: a full-height photo (forklift in a warehouse). | Marquee `translate3d(-100%)`, **200s linear infinite** (a separate component, `fb6xhi`) |
| 2 | Challenges | H2 plus intro, then three columns (title and body). | None |
| 3 | How we solve it | A dark band, H2 plus intro. | None |
| 4 | Capability cards | Wide dark #2D2D2D cards (`_80a5p05` variant): text on the left, perception-UI video on the right. 3–4 stacked rows. | Videos |
| 5 | Quote | A dark band with a 2-column layout: mono company name on the left, a large quote on the right. | None |
| 6 | Case study | An ID Logistics full-width video card with overlay text and "POWERED BY" metadata. | Video |
| 7 | Application tiles | "One Platform, unlimited applications.", then three image tiles (Mobility / Manipulation / Operations intelligence) on #F2F2F2. | None |
| 8 | Reference design | A cream band with the isometric lime-cone diagram, followed by product cards. | Static |
| 9 | Perception stack | A dark band with a 2-column grid of video cards. | Videos |
| 10 | Kits | Three kit cards. | None |
| 11 | CTA | "Let's work together!" | None |

### 4.4 Technology, `/our-technology` (Terra AI, about 14.8k px, mostly dark)

| # | Section | Layout / content | Animation |
|---|---|---|---|
| 1 | Hero | A dark #191919 panel about 810px tall. The background **video** shows a field of thin lime "X" glyphs with a large lime asterisk logo rotating and pulsing. Left: an icon and "TERRA AI", the lead "See in deep detail. Gain deep understanding." and "Get in contact". | Video loop. The asterisk motion is baked into the video, not code. |
| 2–5 | Narrative blocks | Dark stacked sections (`_80a5p05`): text on the left (H2 with bullet lists), then a **full-width black video panel**. The panels show the excavator point-cloud with a lime pipeline UI, an input-to-Terra-to-output node diagram, a 4-camera warehouse point cloud, and a Terra SIM tractor render. | Videos |
| 6 | Integrate | A cream band with two CTAs ("Learn about our autonomous robotics offer", "Get in touch"). Two **top-down tractor diagrams** with lime FOV cones and labelled boxes, inside corner brackets. | Static |
| 7 | Product cards | ZED X / X Mini / X One | None |
| 8 | Stats | Dark: 22,000+ · 100,000+ · 13+ · 50,000+ in a 2×2 layout at 80px. | No count-up |
| 9 | Benefits | Dark 2×2 cards, each with an **isometric lime line-art icon** (hex cube cluster, coin on platform). | Static SVG |
| 10 | Industries | "Ready to deploy": three image cards (Agriculture / Construction / …). | None |
| 11 | CTA | A #050505 card: "A new era of vision-driven precision". | None |

### 4.5 Developers, `/developers` (about 8.9k px, dark)

| # | Section | Layout / content | Animation |
|---|---|---|---|
| 1 | Hero | The same lime-asterisk "X-field" video hero as Terra AI. "ZED SDK", the lead, a lime "SDK Download 5.5" and a mono "Latest Release · Windows / Linux / Jetson". | Video |
| 2 | Features | "The most advanced vision software", then a 4+1 grid of icon features (Spatial perception, Real-time, Time-to-market, User-friendly, Support). | None |
| 3 | Capability list | A long stack of dark 2-column cards, each a title and blurb on the left with a perception video on the right: 3D Perception, Indoor Localization, Body Tracking, Global Localization, Occupancy Mapping, Object Detection … | Videos, lazily mounted with play-in-view |
| 4 | Resources | Three columns (Documentation, Code Samples, Tutorials), each with an icon, text and a grey pill button. Then Support, SDK Download and Drivers. | None |
| 5 | Integrations | An H2, a lime "Explore integrations on GitHub" and a crosshair-ruled logo grid. | None |

### 4.6 Machine, `/machine/forklift` (about 11.9k px)

| # | Section | Layout / content | Animation |
|---|---|---|---|
| 1 | Split hero | Left: a light-grey panel with a mono eyebrow "VISION SYSTEMS FOR FORKLIFTS" and the H1 "Intelligent vision for smarter forklifts". Right: a full-height **video** (forklift in an aisle) with the progress ring. | Video |
| 2 | Logo marquee | Crosshair-framed grey logos. | CSS marquee (linear infinite) |
| 3 | Platform intro | "One vision platform, unlimited operations." plus a lime pill. | None |
| 4 | Application cards | Three #F2F2F2 cards (Collision avoidance, Parcel counting, Barcode scanning), each with a perception image or video on top. | Videos or images |
| 5 | Reference design | A cream band: "Forklift perception reference design". A **forklift render with leader-line callouts** to mono-labelled boxes (ZED X: "People Detection / Collision Avoidance / Localization", ZED BOX, ZED X Mini, ZED X One 4K). | Static |
| 6 | BOM cards | Product cards (ZED X, ZED X Mini, ZED Box). | None |
| 7 | End-to-end | "End-to-end AI vision done right" plus the stack. Then the CTA. | None |

### 4.7 About, `/about` (about 10k px)

| # | Section | Layout / content | Animation |
|---|---|---|---|
| 1 | Hero | A full-bleed team photo (office), about 700px tall. | None |
| 2 | Mission | H1 "We help machines see like people do" on the left. Two paragraphs on the right column. A full-width office photo follows. | None |
| 3 | Timeline, "Our journey so far" | Era headers, each with a **lime asterisk/chevron glyph**, a 36px year range (2008–2010, 2010–2022, 2023, 2026 and beyond) and a rule. Under each is a two-column row: title and body on the left, a 4px-radius photo on the right. | None. It is a vertical list with no sticky year and no progress line. |
| 4 | Acquisition | "Ouster & Stereolabs join forces …" with an Ouster + StereoLabs lockup image. | None |
| 5 | Founders | "Meet the founders": a ruled table (name on the left, mono uppercase title on the right). | None |
| 6 | Positioning | "Leading human-like vision, since 2010", then news cards. | None |
| 7 | Careers CTA | A full-width photo card with overlay text "Join the team", "View open roles" (lime) and "Learn more about our technology" (dark). | None |

### 4.8 News index, `/blog` (about 25.8k px)

| # | Section | Layout / content | Animation |
|---|---|---|---|
| 1 | Header | H1 "The latest updates, guides and stories from Stereolabs" (three lines, left-aligned), then **filter pills**: All (solid black) / News / Success Stories / Updates / Tutorials / Other (outlined). | Pill state change (`background .2s`) |
| 2 | Grid | A 3-column grid of cards: a square 4px-radius image, a row of mono black chips (category, e.g. SUCCESS STORIES, NEWS, UPDATES) plus a mono date, an 18px title and an excerpt. It is long, with all posts rendered at once (load-more or pagination not verified). | No hover transform. No stagger. |

### 4.9 Article, `/blog/<slug>`

| # | Section | Layout / content | Animation |
|---|---|---|---|
| 1 | Split hero | Left: a #F2F2F2 panel in corner brackets holding the category chip, a mono date, the H1 (about 48px, wrapping over six lines) and a dek. Right: a full-height cover photo. | None |
| 2 | Body | A **narrow, centred reading column** (about 600px) with 16px body, 18px/500 subheads, inline images with small grey captions, an italic pull-quote and underlined inline links. | None. The header hides on scroll down. |

### 4.10 Store, `/store` (separate app)

A different header: a full-width flat white bar with the same items. The page has "Store" and "Cameras" headings and very large product tiles (image on #F2F2F2, name, price), with a "+" quick-add button and icon chips in the corners. The flat header bar stays visible in the scroll captures. I did not test hide-on-scroll on this app, and there is no motion beyond that. *(At a 1440 viewport the tiles rendered single-column and very tall. That may be the real layout or a headless rendering artefact.)*

## 5. Reusable patterns worth borrowing

1. **Floating card header that hides on scroll down and returns on scroll up.** Fixed wrapper with `padding-top:20px` around an inner card (`border-radius:4px; 1px border`). Toggle `translateY(calc(-1 * (52px + 20px)))` from a scroll-direction hook, with `transition: transform .2s ease-out`.
2. **Contextual sub-nav swap** for product and long pages. Stack two header rows in one grid cell (`grid-area:1/1`). On scroll down, row A goes to `opacity:0; translateY(-10px)` and row B comes in from `+10px`. On scroll up, reverse it. Row B holds numbered anchor links ("01 Overview") and the primary CTA.
3. **Height-morphing mega menu.** The header card's background element animates `height` (from a measured CSS variable) over 0.25s with `cubic-bezier(.4,0,.6,1)`. Panel items fade in from `translateY(-4px)` after a 0.2s delay, and a `rgba(0,0,0,.4)` backdrop fades in over 375ms.
4. **Showcase accordion that crossfades media and background.** Rows expand with `grid-template-rows: 0fr → 1fr` (0.4s ease-in-out). The left-side images are stacked and crossfade at `opacity .5s`, and the section background tweens to a per-item colour stored in the CMS (`background-color .4s`).
5. **Crosshair / registration-mark grid.** Thin `+` and `⊢ ⊣` marks at the left edge, centre and right edge between sections, plus corner brackets around stats, diagrams and drawings. In Softcom terms this is a pure-CSS or SVG "section divider" component, and it reads as "engineering" without any motion.
6. **Video-first motion budget.** Use muted autoplay loops from Mux (or similar), mount them lazily with `useInView({rootMargin:'-150px', triggerOnce:true})`, and play or pause on visibility. Add a **circular progress ring play/pause button** (SVG circle `stroke-dasharray` / `stroke-dashoffset` bound to `currentTime/duration`).
7. **Infinite logo marquee in pure CSS.** Use a duplicated track with `@keyframes {to{transform:translate3d(-100%,0,0)}}` and a very slow linear timing (96–200s) so it barely drifts.
8. **Restrained button system.** Pill buttons in a single accent colour with an arrow icon, where hover is only a darker shade of the accent over 0.2s. Use a dark pill for secondary actions on media and a grey pill on light. Add mono uppercase chips for NEW and price.
9. **Mono plus grotesk type pairing.** Display headlines at 62/500 with line-height 1.0 and −3% tracking, body at 16/1.36, and every piece of metadata (eyebrows, labels, dates, specs, footer heads) in a small uppercase mono. NB Akademie and NB Akademie Mono are the reference. Geist Sans and Geist Mono would be the free analogue *(suggestion)*.
10. **Spec-number bands.** Large 60–80px numbers with tiny mono labels, laid over or beside media inside corner brackets. They are static, with no count-up.
11. **Isometric line-art diagrams with accent FOV cones and leader-line callouts** to mono-labelled boxes. These are the product-in-context explainers. They fit the Softcom "Palantir subject art" figure style.
12. **Earthy per-product colour fields.** Each product or section gets its own muted background (taupe, sage, cream, slate), with renders placed on natural objects such as rocks. That gives warmth without adding motion.

### What they don't do (worth noting for Softcom)
- No scroll-reveal fades, no split-text, no parallax, no pinning or scrubbing, no horizontal scroll sections, no smooth-scroll library, no preloader, no route transitions, no cursor effects and no WebGL. The **lime accent, video and layout system carry the brand** on their own.
