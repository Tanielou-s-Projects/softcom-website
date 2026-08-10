#!/usr/bin/env node
/**
 * Screenshot a URL, for visually checking UI work.
 *
 *   node scripts/screenshot.mjs <url> <out.png> [options]
 *
 *     --width <px>        viewport width            (default 1440)
 *     --height <px>       viewport height           (default 1000)
 *     --full              capture the full page rather than the viewport
 *     --wait <ms>         settle time after load    (default 1200)
 *     --clip <selector>   crop to one element
 *     --hover <selector>  hover before capturing
 *     --click <selector>  click before capturing
 *     --theme <l|d>       force the light or dark theme via localStorage
 *     --motion            allow animations (default is reduced motion)
 *
 * Replaces the earlier shell version, which fired on the `load` event. That was
 * too early for anything client-rendered: React had not hydrated, so WebGL
 * canvases and Radix values captured blank. The settle wait is the whole point.
 *
 * The browser is not vendored. Install it once with:
 *   npx @puppeteer/browsers install chrome-headless-shell@stable
 */
import { existsSync, readdirSync } from "node:fs"
import { homedir } from "node:os"
import path from "node:path"
import puppeteer from "puppeteer-core"

function findBrowser() {
  if (process.env.CHROME_HEADLESS_SHELL)
    return process.env.CHROME_HEADLESS_SHELL
  const root = path.join(
    homedir(),
    ".cache",
    "puppeteer",
    "chrome-headless-shell"
  )
  if (!existsSync(root)) return null
  for (const build of readdirSync(root)) {
    const dir = path.join(root, build)
    for (const inner of readdirSync(dir)) {
      const bin = path.join(dir, inner, "chrome-headless-shell")
      if (existsSync(bin)) return bin
    }
  }
  return null
}

function flag(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}
const has = (name) => process.argv.includes(`--${name}`)

const [url, out] = process.argv.slice(2)
if (!url || !out) {
  console.error("usage: screenshot.mjs <url> <out.png> [options]")
  process.exit(1)
}

const executablePath = findBrowser()
if (!executablePath) {
  console.error(
    "chrome-headless-shell not found. Install it with:\n" +
      "  npx @puppeteer/browsers install chrome-headless-shell@stable"
  )
  process.exit(1)
}

const width = Number(flag("width", 1440))
const height = Number(flag("height", 1000))
const wait = Number(flag("wait", 1200))
const theme = flag("theme", null)

const browser = await puppeteer.launch({
  executablePath,
  args: [
    "--no-sandbox",
    "--hide-scrollbars",
    // Software WebGL is available without this, but be explicit about it.
    "--enable-unsafe-swiftshader",
    ...(has("motion") ? [] : ["--force-prefers-reduced-motion"]),
  ],
  defaultViewport: { width, height, deviceScaleFactor: 1 },
})

try {
  const page = await browser.newPage()

  if (theme) {
    // next-themes reads this before first paint, so seed it up front.
    const value = theme.startsWith("l") ? "light" : "dark"
    await page.evaluateOnNewDocument((v) => {
      localStorage.setItem("theme", v)
    }, value)
  }

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 })

  const hover = flag("hover", null)
  if (hover) await page.hover(hover)
  const click = flag("click", null)
  if (click) {
    await page.click(click)
  }

  // Let hydration, WebGL init and any transition settle.
  await new Promise((r) => setTimeout(r, wait))

  const clip = flag("clip", null)
  if (clip) {
    const el = await page.$(clip)
    if (!el) throw new Error(`no element matches ${clip}`)
    await el.screenshot({ path: out })
  } else {
    await page.screenshot({ path: out, fullPage: has("full") })
  }

  console.log(`ok -> ${out}`)
} finally {
  await browser.close()
}
