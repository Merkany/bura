import test from "node:test"
import assert from "node:assert/strict"
import { readFile, stat } from "node:fs/promises"

const read = (path) => readFile(path, "utf8")

test("Yildun is the second published star and opens the packaged experience", async () => {
  const data = await read("quartz/components/tasmaData.ts")
  assert.match(data, /id: "polaris"[\s\S]*href: "\/tasma\/polaris"/)
  assert.match(data, /id: "umi-2", name: "Yildun"[\s\S]*href: "\/static\/tasma\/yildun\/"/)
  assert.equal((data.match(/href: "/g) ?? []).length, 2)
})

test("the packaged Yildun page includes its local scene and media", async () => {
  const page = await read("quartz/static/tasma/yildun/index.html")
  const audio = await read("quartz/static/tasma/yildun/audio-controller.js")
  assert.match(page, /<title>Bir deniz işçisinden istediğim denizler<\/title>/)
  assert.match(page, /const PHOTOS=/)
  assert.match(page, /assets\/sea\.mp4/)
  assert.match(page, /audio-controller\.js/)
  assert.match(page, /class="tasma-home"[^>]*href="\/tasma\/"[^>]*>← Taşma gökyüzü<\/a>/)
  assert.match(audio, /assets\/audio\/deep-sea-ambience\.mp3/)
  assert.ok((await stat("quartz/static/tasma/yildun/assets/sea.mp4")).size > 1_000_000)
  assert.ok((await stat("quartz/static/tasma/yildun/assets/audio/deep-sea-ambience.mp3")).size > 1_000_000)
  for (let index = 0; index < 94; index += 1) {
    assert.ok((await stat(`quartz/static/tasma/yildun/assets/full/${index}.jpg`)).size > 1_000)
    assert.ok((await stat(`quartz/static/tasma/yildun/assets/thumbs/${index}.jpg`)).size > 1_000)
  }
})

test("water waits six seconds at the ending and leaves breathing room after the text", async () => {
  const page = await read("quartz/static/tasma/yildun/index.html")
  assert.match(page, /END_WAIT_SECONDS:6/)
  assert.match(page, /END_TAIL_EM:5\.5/)
  assert.doesNotMatch(page, /if\(passed\|\|/)
  assert.match(page, /endReached[\s\S]*clock-endReachedSince>=C\.END_WAIT_SECONDS/)
})

test("the retired Quartz Yildun prototype is absent", async () => {
  await assert.rejects(stat("content/tasma/yildun.md"), { code: "ENOENT" })
  await assert.rejects(stat("quartz/static/yildun"), { code: "ENOENT" })
  await assert.rejects(stat("quartz/components/scripts/yildun.inline.ts"), { code: "ENOENT" })
})

