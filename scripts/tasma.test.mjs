import test from "node:test"
import assert from "node:assert/strict"
import { readFile, stat } from "node:fs/promises"

const read = (path) => readFile(path, "utf8")

test("homepage replaces the retired section with Taşma", async () => {
  const homepage = await read("content/index.md")
  assert.match(homepage, /\[Taşma\]\(\.\/tasma\/index\.md\)/)
  assert.doesNotMatch(homepage, /Bunları Düşünmesem Yeriydi/)
})

test("the full sky stays visible and only Polaris is published", async () => {
  const source = await read("quartz/components/tasmaData.ts")
  assert.match(source, /label: "Küçük Ayı"/)
  for (const label of ["Büyük Ayı", "Cepheus", "Kassiopeia", "Pegasus", "Andromeda", "Perseus", "Kuğu, batıyor", "Oryon, yükseliyor", "Kartal, batıyor", "Balık \/ Kova"]) {
    assert.match(source, new RegExp(label.replace("/", "\\/")))
  }
  assert.match(source, /id: "polaris"[\s\S]*href: "\/tasma\/polaris"/)
  assert.doesNotMatch(source, /href: "\/tasma\/polaris\/"/)
  assert.equal((source.match(/href: \"/g) ?? []).length, 1)
  assert.match(source, /TASMA_BACKGROUND_STARS/)
})

test("Taşma content declares the dedicated page types and titleless public identity", async () => {
  const sky = await read("content/tasma/index.md")
  const polaris = await read("content/tasma/polaris.md")
  assert.match(sky, /pageType: tasma-sky/)
  assert.match(polaris, /pageType: tasma-text/)
  assert.match(polaris, /seoTitle: "Taşma — Bura"/)
  assert.doesNotMatch(polaris, /Metin ve Göl/)
})

test("Taşma renderer uses an SVG sky and a real Polaris anchor", async () => {
  const renderer = await read("quartz/components/renderPage.tsx")
  assert.match(renderer, /const TasmaSky/)
  assert.match(renderer, /<svg[\s\S]*class="tasma-sky"/)
  assert.doesNotMatch(renderer, /class="tasma-sky"[^>]*role="img"/)
  assert.match(renderer, /star\.href[\s\S]*<a[\s\S]*href=\{star\.href\}/)
  assert.match(renderer, /const TasmaText/)
  assert.doesNotMatch(renderer, /class="tasma-photo"[^>]*tabIndex/)
  const styles = await read("quartz/styles/custom.scss")
  assert.match(styles, /\.tasma-top \{[\s\S]*position: relative;/)
})

test("Polaris interaction is registered and has no public reset shortcut", async () => {
  const script = await read("quartz/components/scripts/tasma.inline.ts")
  const resources = await read("quartz/plugins/emitters/componentResources.ts")
  assert.match(resources, /tasmaScript/)
  assert.match(script, /data-tasma-experience/)
  assert.match(script, /ArrowRight/)
  assert.match(script, /AbortController/)
  assert.match(script, /cancelAnimationFrame/)
  assert.match(script, /prefers-reduced-motion/)
  assert.doesNotMatch(script, /var\(--rw\)/)
  assert.doesNotMatch(script, /shiftKey|#sifirla|location\.hash/)
})

test("the sky background uses fixed decorative stars", async () => {
  const styles = await read("quartz/styles/custom.scss")
  assert.doesNotMatch(styles, /radial-gradient\(circle at/)
  assert.match(styles, /body\[data-page-type\^="tasma-"\] \.page > #quartz-body \{[\s\S]*display: block;/)
})

test("Polaris uses an extracted local lake image", async () => {
  const image = await stat("quartz/static/tasma/polaris-gol.jpg")
  assert.ok(image.size > 100_000)
  const renderer = await read("quartz/components/renderPage.tsx")
  assert.match(renderer, /static\/tasma\/polaris-gol\.jpg/)
})

test("the titleless page never exposes its file slug as a public title", async () => {
  const head = await read("quartz/components/Head.tsx")
  const socialImage = await read("quartz/util/buraSocialImage.tsx")
  assert.match(head, /isTasmaText[\s\S]*publicName[\s\S]*Taşma — Bura/)
  assert.match(socialImage, /pageType === "tasma-text"[\s\S]*seoTitle/)
})






