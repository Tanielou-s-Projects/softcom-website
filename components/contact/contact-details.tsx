import {
  BuildingOfficeIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
} from "@phosphor-icons/react/dist/ssr"

import { cn } from "@/lib/utils"
import { panelHeadingText } from "@/components/landing/section"
import { contactDetails, phoneHref } from "@/components/contact/content"

/** Icon and text, on the design's 24px / 16px gutter. */
function DetailRow({
  icon: Icon,
  children,
}: {
  icon: typeof BuildingOfficeIcon
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon aria-hidden className="size-6 shrink-0 text-foreground" />
      <div className="w-[167px] text-sm leading-[1.6] text-foreground">
        {children}
      </div>
    </div>
  )
}

/** The address, email and phone, beside a "Get In Touch" heading. */
function ContactDetails() {
  return (
    <div className="flex flex-col gap-8 overflow-clip rounded-3xl bg-background p-8 lg:flex-row lg:items-start lg:justify-between lg:p-[47px]">
      <h2 className={cn(panelHeadingText, "max-w-[142px] text-foreground")}>
        Get In Touch
      </h2>

      <div className="flex flex-col gap-8 sm:flex-row">
        <DetailRow icon={BuildingOfficeIcon}>
          <address className="not-italic">
            <span className="font-bold">{contactDetails.organisation}</span>
            {contactDetails.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </DetailRow>

        <div className="flex flex-col justify-center gap-8">
          <DetailRow icon={EnvelopeSimpleIcon}>
            <a
              href={`mailto:${contactDetails.email}`}
              className="hover:text-brand-cyan"
            >
              {contactDetails.email}
            </a>
          </DetailRow>

          <DetailRow icon={PhoneIcon}>
            <a href={phoneHref} className="hover:text-brand-cyan">
              {contactDetails.phone}
            </a>
          </DetailRow>
        </div>
      </div>
    </div>
  )
}

export { ContactDetails }
