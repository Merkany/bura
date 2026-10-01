import assert from "node:assert/strict"
import { readFile, stat } from "node:fs/promises"
import test from "node:test"

const output = new URL("../public/", import.meta.url)

async function text(file) {
  return readFile(new URL(file, output), "utf8")
}

function attribute(html, selectorPattern, name) {
  const tag = html.match(selectorPattern)?.[0]
  return tag?.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1]
}

test("sitemap contains every loss record and excludes the tags utility page", async () => {
  const sitemap = await text("sitemap.xml")
  assert.match(sitemap, /https:\/\/buradayok\.org\/kayip-burosu\/001-on-dakika/)
  assert.match(sitemap, /https:\/\/buradayok\.org\/kayip-burosu\/016-is-tanimim/)
  assert.match(sitemap, /https:\/\/buradayok\.org\/en\/lost-property\/001-ten-minutes/)
  assert.match(sitemap, /https:\/\/buradayok\.org\/en\/lost-property\/015-small-wish/)
  assert.doesNotMatch(sitemap, /https:\/\/buradayok\.org\/tags\/?</)
})

test("loss office listings contain crawlable links to record permalinks", async () => {
  const turkish = await text("kayip-burosu/index.html")
  const english = await text("en/lost-property/index.html")
  assert.match(turkish, /<a[^>]+href=["']\/kayip-burosu\/015-kucuk-bir-istek["']/)
  assert.match(english, /<a[^>]+href=["']\/en\/lost-property\/015-small-wish["']/)
})

test("canonical and social URLs use public URLs rather than index slugs", async () => {
  const cases = [
    ["index.html", "https://buradayok.org/"],
    ["buraya-dair/index.html", "https://buradayok.org/buraya-dair/"],
    ["86-dakika.html", "https://buradayok.org/86-dakika"],
  ]

  for (const [file, expected] of cases) {
    const html = await text(file)
    assert.equal(attribute(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, "href"), expected)
    assert.equal(attribute(html, /<meta[^>]+property=["']og:url["'][^>]*>/i, "content"), expected)
  }
})

test("the advertised publishing feed exists, carries stories and loss records, and excludes tags", async () => {
  const home = await text("index.html")
  const feed = await text("bura-akis.xml")
  const defaultFeed = await text("index.xml")
  assert.match(home, /<link[^>]+rel=["']alternate["'][^>]+href=["']\/bura-akis\.xml["']/)
  assert.match(feed, /https:\/\/buradayok\.org\/86-dakika/)
  assert.match(feed, /https:\/\/buradayok\.org\/kayip-burosu\/016-is-tanimim/)
  assert.doesNotMatch(feed, /https:\/\/buradayok\.org\/tags\/?/)
  assert.doesNotMatch(defaultFeed, /https:\/\/buradayok\.org\/tags\/?/)
})

test("the eighth story has a clean permalink, legacy redirect, and generated social image", async () => {
  const story = await text("zamaninda-gelme-olasiligi.html")
  const legacy = await text("zamanında-gelme-olasılığı.html")
  const image = await stat(new URL("zamaninda-gelme-olasiligi-og-image.webp", output))

  assert.match(
    story,
    /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/buradayok\.org\/zamaninda-gelme-olasiligi["']/,
  )
  assert.match(
    story,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']https:\/\/buradayok\.org\/zamaninda-gelme-olasiligi-og-image\.webp["']/,
  )
  assert.match(legacy, /<meta[^>]+http-equiv=["']refresh["'][^>]+zamaninda-gelme-olasiligi/i)
  assert.ok(image.size > 10_000)
})

test("share controls prefer the canonical public URL over the browser address", async () => {
  const story = await text("zamaninda-gelme-olasiligi.html")
  const shareScript = await text("static/story-ui.js")
  assert.match(story, /story-ui\.js\?v=20261001-canonical-share-1/)
  assert.match(shareScript, /link\[rel=["']canonical["']\]/)
  assert.match(shareScript, /canonical[^\n]+href/)
})
