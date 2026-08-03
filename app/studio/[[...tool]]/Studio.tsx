"use client"

/**
 * Client boundary for the Studio. Importing `sanity.config` (and therefore
 * `@sanity/ui`) must happen in a Client Component — its top-level
 * `createContext` calls can't run in a Server Component.
 */
import { NextStudio } from "next-sanity/studio"

import config from "@/sanity.config"

export default function Studio() {
  return <NextStudio config={config} />
}
