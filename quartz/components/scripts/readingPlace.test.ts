import test from "node:test"
import assert from "node:assert/strict"
// @ts-expect-error Node's native type stripping needs the explicit extension in this standalone test.
const readingPlace = await import("./readingPlace.logic.ts")
const {
  computeProgress,
  homepageCueLabel,
  parseReadingPlace,
  scrollTopForProgress,
  shouldOfferResume,
  shouldShowHomepageCue,
} = readingPlace

test("progress is the share of remaining scroll, clamped to 0–1", () => {
  assert.equal(computeProgress(0, 1000, 200), 0)
  assert.equal(computeProgress(400, 1000, 200), 0.5)
  assert.equal(computeProgress(800, 1000, 200), 1)
  assert.equal(computeProgress(900, 1000, 200), 1)
  assert.equal(computeProgress(10, 100, 200), 0)
})

test("resume is offered only after a real start and before the end", () => {
  assert.equal(shouldOfferResume(0), false)
  assert.equal(shouldOfferResume(0.07), false)
  assert.equal(shouldOfferResume(0.08), true)
  assert.equal(shouldOfferResume(0.5), true)
  assert.equal(shouldOfferResume(0.92), true)
  assert.equal(shouldOfferResume(0.93), false)
})

test("homepage cue stays quiet until someone has actually started reading", () => {
  assert.equal(shouldShowHomepageCue(null), false)
  assert.equal(
    shouldShowHomepageCue({
      slug: "iyim-iyiyim",
      title: "03. İyim, iyiyim",
      href: "/iyim-iyiyim",
      progress: 0.01,
      updatedAt: 1,
    }),
    false,
  )
  assert.equal(
    shouldShowHomepageCue({
      slug: "iyim-iyiyim",
      title: "03. İyim, iyiyim",
      href: "/iyim-iyiyim",
      progress: 0.4,
      updatedAt: 1,
    }),
    true,
  )
  assert.equal(
    shouldShowHomepageCue({
      slug: "iyim-iyiyim",
      title: "03. İyim, iyiyim",
      href: "/iyim-iyiyim",
      progress: 0.95,
      updatedAt: 1,
    }),
    false,
  )
})

test("stored JSON is ignored when it is incomplete or invalid", () => {
  assert.equal(parseReadingPlace(null), null)
  assert.equal(parseReadingPlace("{"), null)
  assert.equal(parseReadingPlace('{"title":"x"}'), null)
  assert.deepEqual(
    parseReadingPlace(
      JSON.stringify({
        slug: "pit-pit",
        title: "02. Pıt pıt",
        href: "/pit-pit",
        progress: 2,
        updatedAt: 12,
      }),
    ),
    {
      slug: "pit-pit",
      title: "02. Pıt pıt",
      href: "/pit-pit",
      progress: 1,
      updatedAt: 12,
    },
  )
})

test("scroll restoration maps progress back to a pixel offset", () => {
  assert.equal(scrollTopForProgress(0.5, 1000, 200), 400)
  assert.equal(scrollTopForProgress(1, 1000, 200), 800)
})

test("homepage copy stays literary and bilingual", () => {
  assert.equal(homepageCueLabel("03. İyim, iyiyim", false), "Kaldığın yer — 03. İyim, iyiyim")
  assert.equal(homepageCueLabel("03. I'm Fine", true), "Where you left off — 03. I'm Fine")
})
