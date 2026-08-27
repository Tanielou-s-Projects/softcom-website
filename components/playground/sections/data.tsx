import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"

const ROWS = [
  ["Digital Infrastructure", "Public sector", "Delivered"],
  ["Intelligence", "Financial services", "In flight"],
  ["Programs", "Development", "Delivered"],
]

export function DataSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Card">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Digital Infrastructure</CardTitle>
              <CardDescription>
                Enterprise platforms, APIs, and payment rails.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Radius comes from <TokenLabel>--card-radius</TokenLabel>, moved
              onto the 26px step to match the design&apos;s 24px panels.
            </CardContent>
          </Card>
          <Card data-size="sm">
            <CardHeader>
              <CardTitle>Compact</CardTitle>
              <CardDescription>
                <code>data-size=&quot;sm&quot;</code> tightens the spacing.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Avatar">
        <div className="flex flex-wrap items-center gap-3">
          {["AA", "TE", "SO"].map((initials) => (
            <Avatar key={initials}>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <Separator orientation="vertical" className="h-8" />
          <TokenLabel>
            Portraits on the site are next/image, not Avatar.
          </TokenLabel>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Capability</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map(([capability, sector, status]) => (
              <TableRow key={capability}>
                <TableCell className="font-medium">{capability}</TableCell>
                <TableCell className="text-muted-foreground">
                  {sector}
                </TableCell>
                <TableCell className="text-right">
                  <Badge>{status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SpecimenGroup>

      <SpecimenGroup label="Accordion">
        <Accordion type="single" collapsible>
          <AccordionItem value="one">
            <AccordionTrigger>What sectors do you work with?</AccordionTrigger>
            <AccordionContent>
              Public institutions, enterprises, and development organisations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>How do engagements start?</AccordionTrigger>
            <AccordionContent>
              With a discovery phase that scopes the outcome before the build.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <TokenLabel className="mt-2 block">
          The obvious home for an FAQ block.
        </TokenLabel>
      </SpecimenGroup>
    </div>
  )
}
