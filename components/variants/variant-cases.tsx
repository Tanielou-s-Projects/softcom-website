"use client"

import * as React from "react"

import type { VariantId, VariantKey } from "@/components/variants/registry"
import { useVariant } from "@/components/variants/variant-context"

export function VariantCases<K extends VariantKey>({
  variant,
  cases,
}: {
  variant: K
  cases: Record<VariantId<K>, React.ReactNode>
}) {
  const active = useVariant(variant)
  return <>{cases[active]}</>
}
