/**
 * Curated Mobbin references for the About / Team / Company page, grouped by the
 * section they belong to. Pulled with the Mobbin MCP (`search_sections`) and
 * saved locally under `public/mobbin/<group>/<id>.webp`, so the playground board
 * is self-contained and works on a shared preview deploy without hotlinking.
 *
 * These are third-party website screenshots used purely as internal design
 * references; the playground is dev-gated (`PLAYGROUND_ENABLED`) so they never
 * ship on the public site. The `id` is the Mobbin section id — it doubles as the
 * local filename and the canonical `mobbin.com/sites/sections/<id>` link.
 */

export type MobbinReference = {
  /** Site the section is from, as Mobbin labels it. */
  site: string
  /** Mobbin section id (= local filename, and the canonical Mobbin URL slug). */
  id: string
}

export type MobbinReferenceGroup = {
  /** Registry section id — also the nav anchor. */
  id: string
  label: string
  blurb: string
  refs: MobbinReference[]
}

/** Build the local screenshot path for a reference. */
export const refSrc = (group: string, id: string) => `/mobbin/${group}/${id}.webp`

/** Build the canonical Mobbin page for a reference. */
export const refMobbinUrl = (id: string) =>
  `https://mobbin.com/sites/sections/${id}`

export const MOBBIN_REFERENCE_GROUPS: MobbinReferenceGroup[] = [
  {
    id: "hero",
    label: "Hero",
    blurb: "About-page openers — a mission-statement headline and short intro.",
    refs: [
      { site: "Speakeasy", id: "5722b15d-798d-4b8a-b49a-61bb35b737b0" },
      { site: "PayPal", id: "9eb4d86e-612b-43ac-8285-0235f7b98601" },
      { site: "Wise", id: "726c71cf-ae08-4542-b24d-18bd7191c51a" },
      { site: "Headspace", id: "aa196a75-3bb2-41ea-81ef-26168acdaf9b" },
      { site: "Reflect", id: "6b1b100c-be37-4ae3-b2ee-b445ae270680" },
      { site: "Coinbase", id: "6a7e0cd7-b860-4cea-91bb-ef16b482fc9d" },
    ],
  },
  {
    id: "story",
    label: "Story",
    blurb: "Founding story and company history — the narrative blocks.",
    refs: [
      { site: "Toggl Track", id: "4ea94e93-b215-4005-a5fc-f3b3667c64e9" },
      { site: "Ramp", id: "213cfd8a-110c-4cad-b6b2-325c21a769cf" },
      { site: "Bird", id: "904d69bb-d136-4ada-a829-70a918182ebd" },
      { site: "Mews", id: "8b7d9d81-339d-4b24-a381-476d6d1b347f" },
      { site: "Wise", id: "99805fb4-641b-47ce-be7c-30b6fe97aa79" },
      { site: "Handshake", id: "ec153601-7b86-4380-946e-655696b65bbd" },
    ],
  },
  {
    id: "values",
    label: "Values",
    blurb: "Values and operating principles — the tenets a company runs by.",
    refs: [
      { site: "Qatalog", id: "2b7f8c1d-4ecd-4279-a6e9-df856575d1a1" },
      { site: "Apollo", id: "f3342e0b-057d-4147-84de-d56ab31beca6" },
      { site: "ClassPass", id: "94da6654-9a13-49f4-ad91-0e48984fa56a" },
      { site: "Instrument", id: "f5139a36-9357-493e-b99e-9cd2b6b5cfa3" },
      { site: "Intercom", id: "c91f3d8a-715c-4df9-9cbb-a625b9b7b57d" },
      { site: "Vanta", id: "66d0da2e-a8cd-4469-9701-02e1eb0d6eb0" },
    ],
  },
  {
    id: "stats",
    label: "Stats",
    blurb: "Impact numbers — large figures with short labels.",
    refs: [
      { site: "Employment Hero", id: "6f3aacf8-eb73-49f8-9ff4-32c3d354658e" },
      { site: "MindMarket", id: "91e4a969-474e-40cf-9b6f-580fffa2128f" },
      { site: "Oyster", id: "a9043960-ae88-4be2-945d-38489e887265" },
      { site: "Deel", id: "b3a3012d-21ca-4800-8591-1c13d4743935" },
      { site: "Ramp", id: "b3c99307-fd22-4b51-8d0b-11bc1d750391" },
      { site: "YLLW", id: "0d46242a-8fae-4e37-8baf-c13ac408bd2e" },
    ],
  },
  {
    id: "team",
    label: "Team",
    blurb: "Team member grids — headshots, names and roles.",
    refs: [
      { site: "Granola", id: "5897c1c1-3b7f-493f-88b8-e986a8e01755" },
      { site: "Ragged Edge", id: "48506d87-4d32-42f0-aa0a-ad334b3fbb86" },
      { site: "Sprout Social", id: "644007e4-e899-44a3-afcb-c6455ae9adf4" },
      { site: "Airtable", id: "7f47ae78-907a-4490-8ba7-5f934fa896f5" },
      { site: "Equals", id: "455ea198-c649-4e11-8192-70d2c315f90c" },
      { site: "Passionfroot", id: "7142e4ef-7096-4260-aecc-0ea06c1763e3" },
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    blurb: "Leadership and executive sections — portraits with titles and bios.",
    refs: [
      { site: "Intercom", id: "fc292fd5-ab37-469b-b09b-dc378471521c" },
      { site: "Jasper", id: "fb7eb756-3f53-4f37-bb98-e0407fd31658" },
      { site: "Handshake", id: "9af80987-35e3-46e8-b87d-7a6b0fbd3848" },
      { site: "Sprout Social", id: "54cc4d9c-9a67-486f-a17c-c02d2c277717" },
      { site: "Hims", id: "3f410ef6-57b9-4a6b-a2b0-0729a928735f" },
      { site: "Origin", id: "60224678-45e3-48db-9c58-dc3823b680f3" },
    ],
  },
  {
    id: "culture",
    label: "Culture",
    blurb: "Life-at-the-company sections — candid team photography.",
    refs: [
      { site: "Deel", id: "77aefe76-a55c-45c4-89dd-dda819434eed" },
      { site: "Apollo", id: "387a127d-b415-4e97-82e0-22ab5c79fa82" },
      { site: "Workable", id: "f8bc9374-b023-4e0e-9e6d-f0d5c5f2481c" },
      { site: "VEED", id: "bd622097-ff28-473e-b14d-03fe8b18ac50" },
      { site: "ClickUp", id: "ad5e857f-0dc2-41e2-84d8-6f1f01b4f103" },
      { site: "Quicken", id: "f8d3f347-def5-492e-8cbc-127522bec855" },
    ],
  },
  {
    id: "timeline",
    label: "Timeline",
    blurb: "Milestones by year — the company's history as a timeline.",
    refs: [
      { site: "PayPal", id: "2644f16d-1d3f-4cc5-ae0c-4521e8a03f2b" },
      { site: "Going", id: "7d0efe17-5f06-4a2c-a570-ab767ac8934b" },
      { site: "Revolut", id: "fe2855ba-d425-4440-aae5-2309ce937cf5" },
      { site: "Wise", id: "56d6864d-7fa5-4649-85cd-a2730ff775ce" },
      { site: "V7", id: "a5b3c6c0-dd04-4ca2-b06b-4ee1c673c2a5" },
    ],
  },
]
