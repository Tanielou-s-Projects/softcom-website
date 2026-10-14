import type { SiteSettings } from "@/sanity/lib/data"

/*
 * The ways in besides the form, as a ruled list of mono labels and their
 * values: email first (it is the one people copy), then the office, then
 * wherever else Softcom is.
 */
export function ContactDetails({
  heading,
  settings,
}: {
  heading: string
  settings: SiteSettings
}) {
  return (
    <div>
      <h2 className="label border-t border-ink pt-5 text-ink">{heading}</h2>
      <dl className="mt-4">
        <div className="grid gap-2 border-b border-line py-6">
          <dt className="label text-ink-faint">Email</dt>
          <dd>
            <a
              href={`mailto:${settings.email}`}
              className="text-title break-all transition-colors hover:text-accent"
            >
              {settings.email}
            </a>
          </dd>
        </div>
        {settings.address.length > 0 && (
          <div className="grid gap-2 border-b border-line py-6">
            <dt className="label text-ink-faint">Office</dt>
            <dd>
              <address className="text-lg text-ink-soft not-italic">
                <span className="block text-ink">{settings.organisation}</span>
                {settings.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </dd>
          </div>
        )}
        {settings.social.length > 0 && (
          <div className="grid gap-2 border-b border-line py-6">
            <dt className="label text-ink-faint">Elsewhere</dt>
            <dd>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-lg">
                {settings.social.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink-soft underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
