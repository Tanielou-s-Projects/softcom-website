import {
  CaseIcon,
  DocumentTextIcon,
  FolderIcon,
  UserIcon,
  UsersIcon,
} from "@sanity/icons"
import type { StructureResolver } from "sanity/structure"

/**
 * Desk structure — grouped into Content, People, and Careers
 * rather than a flat list of every document type.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Softcom")
    .items([
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
    ])
