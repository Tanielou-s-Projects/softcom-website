import { readFileSync, writeFileSync } from "node:fs"

const topo = JSON.parse(readFileSync("/tmp/wa.json", "utf8"))
const { scale: [sx, sy], translate: [tx, ty] } = topo.transform

// Decode quantised delta-encoded arcs into absolute lon/lat.
const arcs = topo.arcs.map((arc) => {
  let x = 0, y = 0
  return arc.map(([dx, dy]) => {
    x += dx; y += dy
    return [x * sx + tx, y * sy + ty]
  })
})

const ring = (idxs) => {
  const pts = []
  for (const i of idxs) {
    const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]
    pts.push(...(pts.length ? a.slice(1) : a))
  }
  return pts
}

// Africa's bbox, generously: everything whose polygons fall inside it.
const BOX = { w: -18, e: 52, s: -36, n: 38 }
const inBox = ([lon, lat]) =>
  lon >= BOX.w - 2 && lon <= BOX.e + 2 && lat >= BOX.s - 2 && lat <= BOX.n + 2

const polys = []
for (const g of topo.objects.countries.geometries) {
  const parts = g.type === "Polygon" ? [g.arcs] : g.arcs
  for (const p of parts) {
    const outer = ring(p[0])
    // Keep a polygon only if its centroid-ish sample sits in the Africa box,
    // which also drops Europe/Arabia landmasses that clip the bbox edges.
    const inside = outer.filter(inBox).length
    if (inside / outer.length > 0.9) polys.push(outer)
  }
}

const COLS = 44, ROWS = 46
const lonAt = (c) => BOX.w + ((c + 0.5) / COLS) * (BOX.e - BOX.w)
const latAt = (r) => BOX.n - ((r + 0.5) / ROWS) * (BOX.n - BOX.s)

function hit(lon, lat) {
  for (const poly of polys) {
    let inside = false
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j]
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)
        inside = !inside
    }
    if (inside) return true
  }
  return false
}

const rows = []
for (let r = 0; r < ROWS; r++) {
  let s = ""
  for (let c = 0; c < COLS; c++) s += hit(lonAt(c), latAt(r)) ? "#" : "."
  rows.push(s)
}
console.log(rows.join("\n"))
console.log("polys:", polys.length, "land cells:", rows.join("").split("#").length - 1)
writeFileSync("/tmp/africa-grid.txt", rows.join("\n"))
