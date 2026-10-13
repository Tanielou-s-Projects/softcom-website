import {
  CaseIcon,
  CogIcon,
  DocumentsIcon,
  PackageIcon,
  DocumentTextIcon,
  FolderIcon,
  UserIcon,
  UsersIcon,
} from "@sanity/icons"
import type { StructureResolver } from "sanity/structure"

import { PAGES } from "@/sanity/schemaTypes/pages"

/**
 * Desk structure — grouped into Content, People, and Careers
 * rather than a flat list of every document type.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Softcom")
    .items([
      // Every page's copy, one document each, opened directly.
      S.listItem()
        .title("Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Pages")
            .items(
              PAGES.map((page) =>
                S.listItem()
                  .title(page.title ?? page.name)
                  .id(page.name)
                  .icon(page.icon)
                  .child(
                    S.document().schemaType(page.name).documentId(page.name)
                  )
              )
            )
        ),
      S.divider(),
      S.listItem()
        .title("Content")
        .icon(FolderIcon)
        .child(
          S.list()
            .title("Content")
            .items([
              S.documentTypeListItem("insight")
                .title("Insights")
                .icon(DocumentTextIcon),
              S.documentTypeListItem("caseStudy")
                .title("Case Studies")
                .icon(CaseIcon),
              S.documentTypeListItem("product")
                .title("Products")
                .icon(PackageIcon),
            ])
        ),
      S.listItem()
        .title("People")
        .icon(UsersIcon)
        .child(
          S.list()
            .title("People")
            .items([
              S.documentTypeListItem("leader")
                .title("Leadership")
                .icon(UserIcon),
              S.documentTypeListItem("alumnus").title("Alumni").icon(UsersIcon),
            ])
        ),
      S.divider(),
      S.documentTypeListItem("role").title("Careers").icon(CaseIcon),
      S.divider(),
      // One document, opened directly rather than listed.
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
    ])
