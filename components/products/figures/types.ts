import type * as React from "react"

/** A product's figures, by key; each takes its number, e.g. "Fig 03". */
export type FigureMap = Record<
  string,
  (props: { fig: string }) => React.ReactNode
>
