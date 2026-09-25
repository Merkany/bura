import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import test from "node:test"

const finalAssetHash = "0de74a4bd29d816f41e7bf14c84e777de851214cc0f74fe5ffdcd8de217bd359"

test("the weather strip uses the supplied machine image without modifying it", async () => {
  const asset = await readFile("quartz/static/bulut-yapma-makinesi.png")
  const hash = createHash("sha256").update(asset).digest("hex")
  assert.equal(hash, finalAssetHash)

  const page = await readFile("quartz/components/renderPage.tsx", "utf8")
  assert.match(page, /class="cloud-machine-image"/)
  assert.match(page, /static\/bulut-yapma-makinesi\.png/)
  assert.match(page, /data-cloud-layer/)
  assert.match(page, /data-cloud-machine/)
  assert.match(page, /data-cloud-button/)
  assert.match(page, /data-cloud-status/)
})

test("the entire machine is the accessible cloud production control", async () => {
  const page = await readFile("quartz/components/renderPage.tsx", "utf8")
  assert.match(page, /<button[\s\S]*class="cloud-machine"[\s\S]*data-cloud-machine[\s\S]*data-cloud-button/)
  assert.match(page, /class="cloud-machine-red-button"/)
  assert.doesNotMatch(page, /class="cloud-machine-button"/)
})

test("the machine has a small unboxed BULUT YAP instruction instead of a pennant", async () => {
  const page = await readFile("quartz/components/renderPage.tsx", "utf8")
  assert.doesNotMatch(page, /cloud-machine-pennant/)
  const instructions = page.match(/class="cloud-machine-instruction"/g) ?? []
  assert.equal(instructions.length, 1)
  assert.match(page, /<span>BULUT<\/span>\s*<span>YAP<\/span>/)

  const styles = await readFile("quartz/styles/custom.scss", "utf8")
  assert.match(styles, /\.cloud-machine-instruction/)
  assert.doesNotMatch(styles, /cloud-machine-pennant/)
  assert.match(styles, /\.cloud-machine-instruction\s*\{[\s\S]*?background:\s*transparent;/)
  assert.match(styles, /\.cloud-machine-instruction\s*\{[\s\S]*?top:\s*3%;/)
})

test("cloud generation is loaded for the asset prototype", async () => {
  const resources = await readFile("quartz/plugins/emitters/componentResources.ts", "utf8")
  assert.match(resources, /cloudMachineScript/)
})

test("queued clicks do not enable a separate burst motion mode", async () => {
  const script = await readFile("quartz/components/scripts/cloudMachine.inline.ts", "utf8")
  const logic = await readFile("quartz/components/scripts/cloudMachine.logic.ts", "utf8")
  assert.doesNotMatch(script, /burst|lastManualPress/)
  assert.doesNotMatch(logic, /burst/)
})

test("the homepage loss-office card sits centered below the cloud area", async () => {
  const styles = await readFile("quartz/styles/custom.scss", "utf8")
  assert.match(
    styles,
    /body\[data-slug="index"\] \.bura-corner-stamp\s*\{[\s\S]*?top:\s*180px;[\s\S]*?left:\s*50%;[\s\S]*?translate:\s*-50% 0;/,
  )
})
