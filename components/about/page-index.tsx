/*
 * A page's contents as a row of mono links under its hero, each one a jump
 * to a section anchor. Plain links, so it works before any script loads.
 */
export function PageIndex({
  label,
  items,
}: {
  label: string
  items: { label: string; href: string }[]
}) {
  return (
    <nav aria-label={label} className="mt-8">
      <ol className="border-t border-line">
        {items.map((item, i) => (
          <li key={item.href} className="border-b border-line">
            <a
              href={item.href}
              className="group flex items-baseline gap-4 py-2.5 transition-colors hover:text-accent-ink"
            >
              <span className="label text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="label">{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
