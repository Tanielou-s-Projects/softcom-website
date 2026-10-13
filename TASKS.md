# Tasks

Open work on the Softcom website. Tick items off as they land; move anything
waiting on someone else to **Waiting on**.

## Contact form email (Resend)

Messages already save to the Studio's **Inbox**; these steps turn on email.

- [ ] Create a Resend account at resend.com (free tier is enough).
- [ ] Add the sender domain in Resend (e.g. `softcom.xyz`) and add the DNS
      records it gives you; wait for it to show as verified.
- [ ] Create a Resend API key and set it on Vercel (production) and in
      `.env.local` as `RESEND_API_KEY`.
- [ ] Set `CONTACT_FROM_EMAIL` on Vercel and locally, e.g.
      `Softcom website <website@softcom.xyz>`.
- [ ] Decide who receives messages and put that address in the Studio under
      **Site settings → Form notifications** (empty = the site email,
      `contact@softcom.xyz`).
- [ ] Send a test message from the live Contact page; check it arrives by
      email and in the Inbox, then delete it.

## Website

- [ ] Alumni "Join the network" form: save to Sanity and email, like Contact
      (it currently posts nowhere).
- [ ] SEO and metadata for every page: title template ("About · Softcom"),
      canonical URLs, Open Graph/Twitter cards, generated share images
      (fonts in `assets/fonts/`), `sitemap.xml`, `robots.txt`, JSON-LD.
- [ ] Merge "Technology to make it happen / Expertise to make it work" into a
      single section on Home (The people behind the work has been removed).
- [ ] New icon for the "Development Enablers" sector card.
- [ ] Better presentation for "What guides our work" on About.

## Housekeeping

- [ ] Rotate the Sanity CLI login (`npx sanity logout`, then
      `npx sanity login`) — the old token was exposed in a session log.
- [ ] Push `main` when ready (local commits are not live until pushed).

## Waiting on

- [ ] Final copy for the merged Home section — Seindemi.
- [ ] Trimmed copy for the three "Who we work with" cards — Seindemi.
- [ ] New hero, journey and focus-area photography; replacement for the
      Third Mainland Bridge image — Toyosi & Seindemi.
- [ ] Product logos and branding for Sentinel, Reckon and LIFT.
- [ ] Higher-resolution LIFT screenshots (the current ones are 800×500 from
      the PDF).
- [ ] Case studies content and sign-off on the Case Studies layout.
- [ ] Insight papers (only one placeholder article exists).
- [ ] Confirm the "verify / identity", "verify / business",
      "verify / standing" labels on the LIFT tiers diagram.

## Done

- [x] Contact form saves messages to Sanity's Inbox (2026-10-14).
- [x] Every page's copy editable in Sanity, under Pages (2026-10-13).
- [x] The people behind the work removed from Home (2026-10-13).
- [x] Partner logo double carousel on Home (2026-10-13).
- [x] Sanity live on Vercel: content, publish webhook, CORS (2026-10-13).
