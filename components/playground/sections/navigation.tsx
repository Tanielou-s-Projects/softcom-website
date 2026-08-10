"use client"

import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpecimenGroup, TokenLabel } from "@/components/playground/section"
import { headerNav } from "@/components/landing/content"

export function NavigationSection() {
  return (
    <div className="flex flex-col gap-8">
      <SpecimenGroup label="Navigation menu">
        <p className="mb-3 max-w-prose text-sm text-muted-foreground">
          The header&apos;s dropdown. Its viewport morphs between panel sizes —
          move between About and Solutions to see it resize, since one has four
          entries and the other three.
        </p>
        <div className="rounded-lg border p-4">
          <NavigationMenu>
            <NavigationMenuList>
              {headerNav.map((item) =>
                item.submenu ? (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-56">
                        {item.submenu.map((sub) => (
                          <li key={sub.href}>
                            <NavigationMenuLink asChild>
                              <Link href={sub.href}>{sub.label}</Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <TokenLabel className="mt-2 block">
          The site renders this inside the collapsing header pill.
        </TokenLabel>
      </SpecimenGroup>

      <SpecimenGroup label="Tabs">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="approach">Approach</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          <TabsContent
            value="overview"
            className="pt-3 text-sm text-muted-foreground"
          >
            What the engagement set out to do.
          </TabsContent>
          <TabsContent
            value="approach"
            className="pt-3 text-sm text-muted-foreground"
          >
            How the platform was designed and delivered.
          </TabsContent>
          <TabsContent
            value="results"
            className="pt-3 text-sm text-muted-foreground"
          >
            Measured outcomes after rollout.
          </TabsContent>
        </Tabs>
      </SpecimenGroup>

      <SpecimenGroup label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/insights">Insights</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Building a Data Culture</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </SpecimenGroup>

      <SpecimenGroup label="Pagination">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </SpecimenGroup>
    </div>
  )
}
