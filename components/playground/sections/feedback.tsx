"use client"

import { toast } from "sonner"
import { CheckCircle, Info, Warning } from "@phosphor-icons/react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"

export function FeedbackSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Alert">
        <div className="flex flex-col gap-3">
          <Alert>
            <Info />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              Insight covers are placeholders until the Sanity field is wired.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <Warning />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              We couldn&apos;t send your message. Try again in a moment.
            </AlertDescription>
          </Alert>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Toast">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => toast("Message sent")}>
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Message sent", {
                description: "We'll come back to you within two working days.",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Couldn't send", {
                description: "Check the email field.",
              })
            }
          >
            Error
          </Button>
        </div>
        <TokenLabel className="mt-2 block">
          Sonner. The <code>Toaster</code> lives in the playground shell.
        </TokenLabel>
      </SpecimenGroup>

      <SpecimenGroup label="Progress">
        <div className="flex flex-col gap-3 sm:max-w-sm">
          <Progress value={28} />
          <Progress value={64} />
          <Progress value={100} />
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Skeleton">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="size-4 text-success" />
          Matches the insight card&apos;s 690 × 324 plate while loading.
        </div>
      </SpecimenGroup>
    </div>
  )
}
