import { defineCliConfig } from "sanity/cli"

import { dataset, projectId } from "@/sanity/env"

export default defineCliConfig({
  api: { projectId, dataset },
  /**
   * Enable auto-updates for studios. Learn more at
   * https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
