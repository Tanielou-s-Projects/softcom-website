/**
 * Product page copy, from the client's website copy deck (October 2026): the
 * inner pages that replace the Enterprise Products overlays.
 *
 * Each page follows the deck's order. A section is a heading over its copy,
 * optionally a row of cards, and optionally a figure; `figure` names the
 * diagram the deck draws for that section, by its caption, so the anatomy
 * figure that stands in for it can be found by key (see `figures.tsx`).
 */

export type Link = { label: string; href: string }

export type ProductCard = { label: string; description: string }

export type ProductFigure = {
  /** Looked up in the product's figure registry. */
  key: string
  /** The deck's caption title, e.g. "Declared against owed." */
  title: string
  caption?: string
  /**
   * The deck's own picture, for figures that are screenshots of the product
   * rather than diagrams: shown as-is in a frame instead of a rebuilt
   * diagram. Under `public/products/<slug>/`.
   */
  image?: { src: string; width: number; height: number }
}

export type ProductSection = {
  id: string
  heading: string
  body: string[]
  cards?: ProductCard[]
  figure?: ProductFigure
  /** Further figures after the first, in the deck's order. */
  also?: ProductFigure[]
  /** A small print line under the section (availability, illustrative data). */
  note?: string
}

export type ProductPage = {
  /** Matches `Product.id` on the index, and is the URL segment. */
  slug: string
  /** Over the title, in place of the page badge: "Partner platform · …". */
  eyebrow: string
  title: string
  /** The first paragraph sits in the hero; the rest open the body. */
  lead: string[]
  primary: Link
  /** The hero figure, under the opening paragraphs. */
  figure?: ProductFigure
  sections: ProductSection[]
  /** "Built for those with a mandate to …" */
  audience?: { heading: string; body: string[]; note?: string }
  close: { heading: string; text: string; cta: Link }
}

const demo: Link = { label: "Request a demonstration", href: "/contact" }

export const productPages: ProductPage[] = [
  {
    slug: "sentinel",
    eyebrow: "Softcom product · Applied Intelligence",
    title: "Follow the money. See the connections.",
    lead: [
      "Turn financial records into intelligence for complex investigations. Sentinel connects transactions across accounts and parties, revealing money flows, relationships and patterns that warrant closer examination.",
    ],
    primary: demo,
    figure: {
      key: "connections",
      title: "See the connections. Follow the money.",
      caption:
        "A connected view of accounts, counterparties and transaction paths.",
    },
    sections: [
      {
        id: "investigation",
        heading: "An investigation spans more than one statement.",
        body: [
          "A single investigation can involve multiple accounts, different banks and thousands of transactions. Sentinel brings those records together and automates analysis, helping investigators examine activity across the whole set.",
        ],
        figure: {
          key: "records-to-intelligence",
          title: "From financial records to intelligence.",
          caption:
            "One connected path from source documents to an investigator’s view.",
        },
      },
      {
        id: "records",
        heading: "Start with the records you have.",
        body: [
          "Examine bank statements and accounting records in PDF, Excel and CSV formats, including scanned documents processed through OCR. Connect records from multiple accounts and parties to investigate them together.",
        ],
        figure: {
          key: "records",
          title: "Bring the records together.",
          caption:
            "Different source formats. Accounts and transactions examined together.",
        },
      },
      {
        id: "money",
        heading: "Understand how the money moves.",
        body: [],
        cards: [
          {
            label: "Trace the flow",
            description:
              "Follow transfers between accounts and counterparties to understand where funds originate, how they move and where they arrive.",
          },
          {
            label: "Reveal relationships",
            description:
              "Identify shared counterparties and connections between parties through transaction analysis and network visualisation.",
          },
          {
            label: "Examine patterns",
            description:
              "Explore recurring transfers, concentrations and circular flows. Compare amounts and timing to identify activity that needs further investigation.",
          },
        ],
      },
      {
        id: "clear",
        heading: "Make the investigation clear.",
        body: [
          "Bring transaction analysis into network maps, charts and investigative reports. Show the relationships, movements and patterns behind the findings, giving teams a clearer basis for review and further enquiry.",
        ],
        figure: {
          key: "visible",
          title: "Make the investigation visible.",
          caption:
            "A financial overview alongside the transactions that warrant review.",
        },
      },
    ],
    audience: {
      heading: "Built for those with a mandate to investigate.",
      body: [
        "For financial investigators, law-enforcement teams, regulators, AML functions, public-sector oversight teams and audit firms examining financial activity.",
      ],
    },
    close: {
      heading: "See Sentinel at work.",
      text: "Tell us about the records you examine and the questions you need to answer.",
      cta: demo,
    },
  },
  {
    slug: "reckon",
    eyebrow: "Softcom product · Applied Intelligence",
    title: "What was declared vs what is owed. Spot the difference.",
    lead: [
      "A tax return says what a company declared; however, the documents filed show what is owed.",
      "Reckon reads every one of those documents, works out the tax each line should have attracted, and shows the officer where the two disagree: the figure, the document it came from and the tax rule applied.",
    ],
    primary: demo,
    figure: {
      key: "declared-owed",
      title: "Declared against owed.",
      caption:
        "One taxpayer, one tax, every line tested. Three differences surfaced for review.",
    },
    sections: [
      {
        id: "missed",
        heading: "Most of what is missed was never looked for.",
        body: [
          "A liability rarely hides in one document. It shows where the general ledger, the bank statement and the return disagree, and those three are seldom put side by side. Reckon compares every line of every document, so a check that takes an officer a week happens in seconds.",
        ],
        figure: {
          key: "three-records",
          title: "Three records, one rule, one exception.",
          caption:
            "An offshore licence in the ledger and the bank statement; no reverse-charge VAT on the return.",
        },
        note: "Illustrative.",
      },
      {
        id: "filed",
        heading: "Start with what the taxpayer already filed.",
        body: [
          "Returns, general ledgers, trial balances, financial statements, schedules and bank statements, in PDF, Excel or scanned form. Reckon reads them into one chart of accounts and maps every line to the tax areas it falls under.",
        ],
        figure: {
          key: "chart-of-accounts",
          title: "One chart of accounts.",
          caption:
            "Every line tagged to the taxes it attracts: CIT, VAT, WHT, PAYE, CGT, stamp duty, transfer pricing.",
        },
      },
      {
        id: "tested",
        heading: "Every line, tested.",
        body: [
          "For each line Reckon classifies what it is, computes what the applicable rule expects, and compares that with what was declared and what was remitted. A fee posted to the interest ledger is still a fee, and is tested as one. Differences above the materiality threshold for the industry become exceptions.",
        ],
        figure: {
          key: "exception",
          title: "An exception, as the officer sees it.",
          caption:
            "Figure, source, rule, and where AI was used to read the input.",
        },
      },
      {
        id: "patterns",
        heading: "Patterns across years, not just lines.",
        body: [
          "Reckon keeps the taxpayer’s history as one profile. A series of short agreements that together make one long borrowing, or receipts that reconcile within a year but not across years, are tested as a matter of course.",
        ],
        figure: {
          key: "years",
          title: "Three years, papered as 364 days.",
          caption: "The series is the instrument.",
        },
      },
      {
        id: "officer",
        heading: "The officer decides.",
        body: [
          "Reckon raises exceptions; it does not raise findings. Every exception is reviewed by an officer, who raises a finding or dismisses it with a reason. The rules that produce exceptions are configuration the administration maintains itself, so two teams examining the same taxpayer reach the same result. AI is used to read scanned and unstructured input, and the exception says where.",
        ],
        figure: {
          key: "judgement",
          title: "Rules, then judgement.",
          caption:
            "The administration sets the rules. Reckon applies them. The officer decides.",
        },
      },
      {
        id: "finding",
        heading: "A finding that survives objection.",
        body: [
          "Each finding keeps the document version, the line, the rule version, the officer’s review and the supervisor’s approval. The same record is produced at reconciliation or before a tribunal, and stays with the case when officers move.",
        ],
        figure: {
          key: "traced",
          title: "One finding, traced.",
          caption: "Every object in the chain is versioned.",
        },
      },
      {
        id: "engine",
        heading: "One engine. Desk review, audit, investigation.",
        body: [
          "Desk review runs on every filing as it arrives and clears or escalates it without an officer’s time. Audit takes selected cases through evidence requests, fieldwork and findings. Investigation works at transaction level for enforcement. The rules and the taxpayer record are shared; the workflow, people and depth are not.",
        ],
        figure: {
          key: "engine",
          title: "Three uses of one engine.",
          caption:
            "Each tier has its own trigger, scope, officer and output, and draws on the modules it needs.",
        },
      },
    ],
    audience: {
      heading: "Built for those with a mandate to collect.",
      body: [
        "Revenue administrations and large-taxpayer offices, state internal revenue services, tax audit and investigation units, and the audit firms acting for them. Reckon reads from existing systems of record; write-back is approved by a person and logged.",
      ],
    },
    close: {
      heading: "See Reckon on your records.",
      text: "Tell us which filings you review and what your audits need to establish. We will run Reckon on records you select, against criteria you set.",
      cta: demo,
    },
  },
  {
    slug: "useforms",
    eyebrow: "Softcom product · Digital Infrastructure",
    title: "Collect data in all its forms.",
    lead: [
      "Equip teams to collect and submit text, images, location, direction, biometric information and more. Bring observations and supporting evidence together in structured submissions that document people, places and activities.",
    ],
    primary: demo,
    // The deck has no inner-page copy for Useforms yet; this is its index
    // card, closed with the index page's own call to action.
    sections: [],
    close: {
      heading: "Find the technology that fits your work.",
      text: "Tell us what you need to achieve. We’ll help you identify the relevant products, platforms and implementation support.",
      cta: { label: "Start a conversation", href: "/contact" },
    },
  },
  {
    slug: "lift",
    eyebrow: "Softcom product · Powering Initiatives",
    title: "The platform behind entrepreneurial development initiatives.",
    lead: [
      "States, national agencies and development partners run initiatives to help small businesses start, formalise and grow. LIFT is the platform those initiatives run on.",
      "A business owner signs up once, verifies in stages, and gets learning, events, a verified marketplace, funding, government registration and a public directory in one account. The organisation running the initiative publishes, reviews and reports from the same place.",
    ],
    primary: demo,
    figure: {
      key: "home",
      title: "A member’s home.",
      caption:
        "Profile, standing, recommendations and what is new, in one view.",
      image: { src: "/products/lift/member-home.png", width: 800, height: 500 },
    },
    sections: [
      {
        id: "tiers",
        heading: "The more a member verifies, the more opens.",
        body: [
          "A new member browses. A verified individual learns, attends and buys. A verified business sells, lists, applies for funding and advertises. A business with a good record on the platform earns Trusted status, with featured placement and priority access, and keeps it only while the record holds.",
        ],
        figure: {
          key: "tiers",
          title: "Four tiers.",
          caption:
            "Each level of verification unlocks a set of tools. Trusted status is earned, and can be lost.",
        },
        also: [
          {
            key: "new-member",
            title: "Where a new member starts.",
            caption:
              "Every module is visible; locked ones say what it takes to open them.",
            image: {
              src: "/products/lift/new-member.png",
              width: 800,
              height: 500,
            },
          },
        ],
      },
      {
        id: "modules",
        heading: "Six things a business needs, one account.",
        body: [
          "Most initiatives offer training on one site, grants on another and a directory nobody updates. LIFT puts six modules behind one profile. A member who verifies for the marketplace is already verified for a grant, a directory listing and a trademark search.",
        ],
        figure: {
          key: "modules",
          title: "One member, six modules.",
          caption:
            "Learn, Connect, Trade, Finance, Register, Grow. Each reads the same profile and tier.",
        },
      },
      {
        id: "verify",
        heading: "Verify in stages, not all at once.",
        body: [
          "Sign-up asks for a name, a phone number, an email and a national identification number. Identity verification is automated. Business verification checks registration, tax identification and documents, is reviewed by people, and takes two to three working days. Nothing is asked for before it is needed, and nothing already given is asked for twice.",
        ],
        figure: {
          key: "trusted",
          title: "From sign-up to Trusted.",
          caption: "Each step unlocks the next tier.",
        },
      },
      {
        id: "funding",
        heading: "Funding that members can see, and reach.",
        body: [
          "Grant and loan programs from government agencies, development banks and financial institutions are listed in one place, with amounts, eligibility and closing dates. A verified individual can read and save a program and see whether they qualify. A verified business applies, with most of the form already filled from the profile. Trusted members enter a priority review queue.",
        ],
        figure: {
          key: "loans",
          title: "Loans and grants.",
          caption:
            "One list of programs. Eligibility, amount and deadline on every card.",
          image: {
            src: "/products/lift/loans-and-grants.png",
            width: 800,
            height: 500,
          },
        },
        also: [
          {
            key: "gate",
            title: "A soft gate on a funding program.",
            caption:
              "What a verified individual sees, and what each tier can do on the same page.",
          },
        ],
      },
      {
        id: "marketplace",
        heading: "A marketplace for entrepreneurs, from entrepreneurs.",
        body: [
          "Members buy from each other. A tailor sources fabric from a textile trader on the platform; a food processor buys packaging from a verified supplier two states away. Every seller is a verified business, every buyer is a member of the initiative, and payment is held by the platform until the buyer confirms delivery. Sellers manage products, orders and payouts from the account they use for everything else.",
        ],
        figure: {
          key: "payout",
          title: "Order to payout.",
          caption:
            "Verified member buys, verified business sells, platform in between.",
        },
      },
      {
        id: "directory",
        heading: "A directory that stays current, because members keep it.",
        body: [
          "Every verified business gets a listing, maintained by the business itself. Visitors filter by sector, state, stage and verification. Trusted members are featured at the top. For the initiative, the directory is a live register of who is in it and what they do.",
        ],
        figure: {
          key: "directory",
          title: "Business directory.",
          caption:
            "Filter by sector, location and stage. Featured section for Trusted members.",
          image: {
            src: "/products/lift/directory.png",
            width: 800,
            height: 500,
          },
        },
      },
      {
        id: "community",
        heading: "Events, courses and community in the same place.",
        body: [
          "Masterclasses, workshops and summits with RSVP and capacity. Courses with certificates, recommended from the member’s sector and record. A forum where members ask each other. Trusted members see events first.",
        ],
        figure: {
          key: "events",
          title: "Events.",
          caption: "Featured event with capacity, then everything upcoming.",
          image: { src: "/products/lift/events.png", width: 800, height: 500 },
        },
      },
      {
        id: "organisation",
        heading: "For the organisation running the initiative.",
        body: [
          "LIFT is built to be run, not just launched. The sponsoring organisation publishes programs, events and resources, reviews business verifications, sees applications as they arrive, and places sponsored content in front of the right tier. Every member action is on one record, so reporting on reach, verification rates and funding disbursed is a query, not a survey.",
        ],
        cards: [
          {
            label: "Publish",
            description:
              "Courses, events, grant and loan programs, government service guides, news and sponsored placements, each targeted by tier, sector and location.",
          },
          {
            label: "Review",
            description:
              "Business verification queue with documents attached. Grant and loan applications with eligibility already checked and profile fields prefilled.",
          },
          {
            label: "Report",
            description:
              "Members by tier, sector and state. Applications by program. Marketplace volume. Who moved from new member to verified business, and how long it took.",
          },
        ],
      },
      {
        id: "brand",
        heading: "One product. Your initiative’s name on it.",
        body: [
          "The tiers, modules and rules are shared across every deployment. The brand, colour, type and content are configuration. A state ministry, a national agency and a development partner can each run LIFT as their own initiative.",
        ],
        figure: {
          key: "initiatives",
          title: "One product, many initiatives.",
          caption: "The platform is the same. The front is yours.",
        },
      },
    ],
    audience: {
      heading: "Built for those with a mandate to grow small business.",
      body: [
        "State ministries of commerce and industry, national enterprise development agencies, development banks and MSME funds, foundations and development partners running entrepreneurship programs, and industry associations with members to serve.",
      ],
    },
    close: {
      heading: "See LIFT with your initiative on it.",
      text: "Tell us who your members are and what you want them to reach. We will show you LIFT configured for your initiative.",
      cta: demo,
    },
  },
  {
    slug: "liquio",
    eyebrow: "Partner platform · Digital Infrastructure",
    title: "Public services, built to work together.",
    lead: [
      "Design, launch and evolve digital public services on a shared low-code foundation. Softcom works with Kitsoft to implement Liquio for ministries, departments and agencies, connecting service delivery with the systems and workflows behind it.",
    ],
    primary: { label: "Explore Liquio with Softcom", href: "/contact" },
    figure: {
      key: "foundation",
      title: "One foundation. Services across departments.",
      caption:
        "Connect existing government systems and develop services on a common platform.",
    },
    sections: [
      {
        id: "beyond",
        heading: "Build beyond the online form.",
        body: [
          "A digital service needs the application, information and institutional work behind it to connect. Liquio provides tools for building services and integrating government systems, with less manual coding.",
        ],
        cards: [
          {
            label: "Design the service",
            description:
              "Use the service builder to create digital services around an institution’s requirements, reusing platform components across applications.",
          },
          {
            label: "Connect the information",
            description:
              "Bring registers, datasets and existing systems into the service through APIs. Put the information required for delivery within reach of the teams and processes that need it.",
          },
          {
            label: "Evolve the operation",
            description:
              "Update services as rules and processes change. A shared platform allows teams to develop services in parallel and build on work already done.",
          },
        ],
      },
      {
        id: "journey",
        heading: "From application to completed service.",
        body: [
          "Shape the journey around what citizens and businesses need, and what the institution must do to serve them. Connect information capture, checks, reviews and service delivery in one designed workflow.",
        ],
        figure: {
          key: "service",
          title: "Connect every stage of a public service.",
          caption:
            "Forms, records and workflows follow the service from application to outcome.",
        },
      },
      {
        id: "delivery",
        heading: "Kitsoft’s platform. Softcom’s local delivery.",
        body: [
          "Softcom brings the service context, implementation and integration expertise needed to put Liquio to work for local institutions.",
        ],
        cards: [
          {
            label: "Understand the service",
            description:
              "Work through the institution’s mandate, service requirements, existing systems and the needs of its users.",
          },
          {
            label: "Configure and connect",
            description:
              "Translate those requirements into services and workflows, integrating the records and systems the service depends on.",
          },
          {
            label: "Prepare for use",
            description:
              "Support deployment, team readiness and adoption, with responsibilities and ongoing support defined around the engagement.",
          },
        ],
      },
      {
        id: "build-on",
        heading: "A foundation your institution can build on.",
        body: [
          "Liquio’s open-source Community Edition, documentation and training options support institutions that want to retain the ability to develop and maintain their services with their chosen teams.",
        ],
      },
    ],
    audience: {
      heading: "For those building public services.",
      body: [
        "For ministries, departments, agencies and governments developing individual services or a shared digital-service platform.",
      ],
    },
    close: {
      heading: "Which public service should work better?",
      text: "Tell us what your institution needs to deliver and the systems it must work with.",
      cta: { label: "Explore Liquio with Softcom", href: "/contact" },
    },
  },
  {
    slug: "rtgs-global",
    eyebrow: "Partner platform · Digital Infrastructure",
    title: "Cross-border payments. Real-time settlement.",
    lead: [
      "Connect your institution to infrastructure for cross-border payments and foreign-exchange settlement. Softcom works with RTGS.global to support implementation for financial institutions in Nigeria and across Africa.",
    ],
    primary: { label: "Discuss an implementation", href: "/contact" },
    figure: {
      key: "network",
      title: "Connect payment operations to shared settlement infrastructure.",
      caption:
        "Participation and available services depend on the agreed implementation.",
    },
    sections: [
      {
        id: "settle",
        heading: "Connect the payment. Complete the settlement.",
        body: [
          "RTGS.global provides a real-time gross settlement network for financial institutions. It supports linked settlement across two currencies and cross-border customer payments through participating Funds Controllers.",
        ],
        cards: [
          {
            label: "Settle foreign exchange",
            description:
              "Link the two sides of an agreed FX trade for payment-versus-payment settlement. Matching instructions and sufficient funds allow the network to complete the exchange and confirm the result.",
          },
          {
            label: "Deliver cross-border payments",
            description:
              "Initiate payments to overseas beneficiaries through Funds Controllers on the network. Onward delivery is handled by the relevant Funds Controller.",
          },
          {
            label: "Keep operations informed",
            description:
              "Bring payment-status notifications, transaction information and network balances into your institution’s workflows through API integration.",
          },
        ],
      },
      {
        id: "trade",
        heading: "From agreed trade to confirmed settlement.",
        body: [
          "Counterparties agree a trade, submit their instructions and receive confirmation when settlement completes. The connection brings the settlement process into the institution’s existing operations.",
        ],
        figure: {
          key: "fx",
          title: "Two payment instructions. One linked FX settlement.",
          caption:
            "Settlement requires matching instructions and sufficient funds.",
        },
      },
      {
        id: "local",
        heading: "Global infrastructure. Local implementation.",
        body: [
          "RTGS.global provides the network. Softcom works with your institution and the platform team to connect it to the systems, processes and operating requirements that make it usable locally.",
        ],
        cards: [
          {
            label: "Define the requirement",
            description:
              "Establish the payment or settlement use case, intended counterparties and the institutional systems involved.",
          },
          {
            label: "Integrate and validate",
            description:
              "Connect the relevant workflows and support testing through the platform’s integration environments.",
          },
          {
            label: "Prepare for operation",
            description:
              "Coordinate implementation around onboarding, operating responsibilities and the requirements of the institution and its network partners.",
          },
        ],
      },
    ],
    audience: {
      heading: "For institutions moving value across borders.",
      body: [
        "For banks and other eligible regulated financial institutions seeking to develop cross-border payment and settlement capabilities.",
      ],
      note: "Available currencies, corridors and services depend on network participation, counterparties and applicable requirements.",
    },
    close: {
      heading: "Connect your institution to the opportunity.",
      text: "Tell us where you need to move value and how your institution operates today.",
      cta: { label: "Discuss an implementation", href: "/contact" },
    },
  },
]

/** A section's figures in order: its main one, then any that follow. */
export function figuresOf(section: ProductSection): ProductFigure[] {
  return [...(section.figure ? [section.figure] : []), ...(section.also ?? [])]
}

export function productPageOf(slug: string) {
  return productPages.find((page) => page.slug === slug)
}
