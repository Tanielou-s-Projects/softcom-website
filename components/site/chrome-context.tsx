"use client"

import * as React from "react"

import { navigation, type HeaderCopy } from "@/components/site/chrome-copy"

/*
 * The header menu's copy, handed down from the root layout (which reads it
 * from Sanity) so every `SiteHeader` — a client component rendered from many
 * pages — gets the same edited menu without fetching it itself. Outside the
 * provider (the playground) it falls back to the code defaults.
 */
const HeaderCopyContext = React.createContext<HeaderCopy>(navigation.header)

function ChromeProvider({
  header,
  children,
}: {
  header: HeaderCopy
  children: React.ReactNode
}) {
  return (
    <HeaderCopyContext.Provider value={header}>
      {children}
    </HeaderCopyContext.Provider>
  )
}

const useHeaderCopy = () => React.useContext(HeaderCopyContext)

export { ChromeProvider, useHeaderCopy }
