"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SpecimenGroup } from "@/components/playground/section"

export function InputsSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Text">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pg-name">Full name</Label>
            <Input id="pg-name" placeholder="Ada Lovelace" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pg-email">Work email</Label>
            <Input
              id="pg-email"
              type="email"
              placeholder="you@organisation.gov.ng"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pg-invalid">Invalid</Label>
            <Input id="pg-invalid" aria-invalid defaultValue="not-an-email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pg-disabled">Disabled</Label>
            <Input id="pg-disabled" disabled placeholder="Unavailable" />
          </div>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Textarea">
        <div className="flex flex-col gap-2">
          <Label htmlFor="pg-message">How can we help?</Label>
          <Textarea
            id="pg-message"
            placeholder="Tell us about the systems you're trying to move…"
            className="min-h-24"
          />
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Select">
        <div className="flex flex-col gap-2 sm:max-w-xs">
          <Label htmlFor="pg-sector">Sector</Label>
          <Select>
            <SelectTrigger id="pg-sector">
              <SelectValue placeholder="Choose a sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public sector</SelectItem>
              <SelectItem value="private">Private sector</SelectItem>
              <SelectItem value="development">Development enabler</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Choice">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Checkbox id="pg-terms" defaultChecked />
              <Label htmlFor="pg-terms">Subscribe to Insights</Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Checkbox id="pg-terms-2" />
              <Label htmlFor="pg-terms-2">Unchecked</Label>
            </div>
            <div className="flex items-center gap-2.5">
              <Switch id="pg-switch" defaultChecked />
              <Label htmlFor="pg-switch">Toggle</Label>
            </div>
          </div>

          <RadioGroup defaultValue="email" className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value="email" id="pg-r-email" />
              <Label htmlFor="pg-r-email">Email me</Label>
            </div>
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value="phone" id="pg-r-phone" />
              <Label htmlFor="pg-r-phone">Call me</Label>
            </div>
          </RadioGroup>
        </div>
      </SpecimenGroup>

      <SpecimenGroup label="Slider">
        <Slider
          defaultValue={[40]}
          max={100}
          step={1}
          className="sm:max-w-sm"
        />
      </SpecimenGroup>
    </div>
  )
}
