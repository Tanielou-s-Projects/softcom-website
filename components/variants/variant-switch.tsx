import * as React from "react"

import {
  defaultVariant,
  type VariantId,
  type VariantKey,
} from "@/components/variants/registry"
import { VariantCases } from "@/components/variants/variant-cases"
import { PLAYGROUND_ENABLED } from "@/lib/playground-access"

type VariantSwitchProps<K extends VariantKey> = {
  variant: K
  /** One rendered branch per option id. Server components can pass these freely. */
  cases: Record<VariantId<K>, React.ReactNode>
}

/**
 * Lets a *server* component offer alternatives without becoming a client
 * component: every branch is rendered on the server, and a small client node
 * mounts only the chosen one.
 *
 * When the playground gate is closed this collapses to the default branch at
 * render time, so production never ships the alternatives' payload.
 */
export function VariantSwitch<K extends VariantKey>({
  variant,
  cases,
}: VariantSwitchProps<K>) {
  if (!PLAYGROUND_ENABLED) return <>{cases[defaultVariant(variant)]}</>
  return <VariantCases variant={variant} cases={cases} />
}
