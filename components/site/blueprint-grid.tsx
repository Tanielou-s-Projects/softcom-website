/**
 * The drafting-grid texture in the side margins — ruled lines, ruler ticks, a
 * dashed plumb line, and '+' registration marks along the content column's
 * edges. Fixed to the viewport behind the page (see `.softcom-blueprint` in
 * globals.css): full-bleed plates cover it as they scroll past, the open
 * margins beside `Container` sections let it show. Renders nothing below
 * 1440px, where the column leaves no real margin.
 *
 * Pages that mount this must not repaint `bg-background` on their wrapper —
 * the body already paints it, and an opaque positioned wrapper would sit
 * above the grid's negative z-index and hide it.
 */
function BlueprintGrid() {
  return (
    <div aria-hidden className="softcom-blueprint">
      <div className="softcom-blueprint-rail" data-side="left" />
      <div className="softcom-blueprint-rail" data-side="right" />
    </div>
  )
}

export { BlueprintGrid }
