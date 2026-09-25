import test from "node:test"
import assert from "node:assert/strict"
// @ts-expect-error Node's native type stripping needs the explicit extension in this standalone test.
const cloudMachineModule = await import("./cloudMachine.logic.ts")
const {
  AUTO_CLOUD_SHAPES,
  CLOUD_SHAPES,
  MANUAL_STATUS_MESSAGES,
  makeCloudSpec,
  manualAttemptFails,
  nextAutomaticDelay,
  nextManualDelay,
  pickManualStatus,
} = cloudMachineModule

function sequence(...values: number[]) {
  let index = 0
  return () => values[index++] ?? values.at(-1) ?? 0
}

test("automatic production waits between 10 and 20 seconds", () => {
  assert.equal(nextAutomaticDelay(() => 0), 10_000)
  assert.equal(nextAutomaticDelay(() => 1), 20_000)
})

test("manual production waits between 0.5 and 0.8 seconds", () => {
  assert.equal(nextManualDelay(() => 0), 500)
  assert.equal(nextManualDelay(() => 1), 800)
})

test("manual clouds use all fifteen supplied assets while automatic clouds use four normal ones", () => {
  assert.equal(CLOUD_SHAPES.length, 15)
  assert.equal(AUTO_CLOUD_SHAPES.length, 4)
  assert.ok(AUTO_CLOUD_SHAPES.every((asset) => CLOUD_SHAPES.includes(asset)))
  assert.deepEqual(AUTO_CLOUD_SHAPES, [
    "bulut-01.png",
    "bulut-03.png",
    "bulut-04.png",
    "bulut-05.png",
  ])

  const automatic = makeCloudSpec("automatic", sequence(0.999, 0.5, 0.5, 0.5, 0.5, 0.5))
  const manual = makeCloudSpec("manual", sequence(0.999, 0.5, 0.5, 0.5, 0.5, 0.5))
  assert.equal(automatic.asset, AUTO_CLOUD_SHAPES.at(-1))
  assert.equal(manual.asset, CLOUD_SHAPES.at(-1))
})

test("cloud motion varies within deliberately small bounds", () => {
  const low = makeCloudSpec("manual", sequence(0, 0, 0, 0, 0, 0, 0, 0, 0))
  const high = makeCloudSpec("manual", sequence(0.999, 1, 1, 1, 1, 1, 1, 1, 1))

  assert.deepEqual(
    {
      scale: low.scale,
      startScale: low.startScale,
      endScale: low.endScale,
      rotation: low.rotation,
      midRotation: low.midRotation,
      durationMs: low.durationMs,
      startX: low.startX,
      startY: low.startY,
      midY: low.midY,
      endY: low.endY,
    },
    {
      scale: 0.78,
      startScale: 0.56,
      endScale: 0.84,
      rotation: -6,
      midRotation: 2.4,
      durationMs: 10_000,
      startX: -5,
      startY: -6,
      midY: -30,
      endY: -12,
    },
  )
  assert.deepEqual(
    {
      scale: high.scale,
      rotation: high.rotation,
      durationMs: high.durationMs,
      startX: high.startX,
      startY: high.startY,
      midY: high.midY,
      endY: high.endY,
    },
    {
      scale: 1.18,
      rotation: 6,
      durationMs: 16_000,
      startX: 5,
      startY: 6,
      midY: -12,
      endY: 38,
    },
  )
})

test("compressed manual production uses the same motion range as a single press", () => {
  const values = [0.4, 0.65, 0.25, 0.55, 0.7, 0.45, 0.6, 0.35, 0.8]
  const first = makeCloudSpec("manual", sequence(...values))
  const queued = makeCloudSpec("manual", sequence(...values))
  assert.deepEqual(queued, first)
})

test("every manual press gets one of the twenty status messages", () => {
  assert.equal(MANUAL_STATUS_MESSAGES.length, 20)
  assert.equal(pickManualStatus(sequence(0)), "Şekil üzerinde uzlaşılamadı.")
  assert.notEqual(pickManualStatus(sequence(0.9)), null)
})

test("Deniz bekleniyor is much rarer than ordinary status messages", () => {
  assert.equal(pickManualStatus(sequence(0.995)), "Deniz bekleniyor.")
  assert.notEqual(pickManualStatus(sequence(0.5)), "Deniz bekleniyor.")
})

test("status selection does not affect the independently selected cloud asset", () => {
  const cloud = makeCloudSpec("manual", sequence(0.5, 0.5, 0.5, 0.5, 0.5, 0.5))
  const status = pickManualStatus(sequence(0.995))
  assert.equal(status, "Deniz bekleniyor.")
  assert.equal(cloud.asset, CLOUD_SHAPES[7])
})

test("a manual attempt very rarely fails to produce a cloud", () => {
  assert.equal(manualAttemptFails(() => 0.005), true)
  assert.equal(manualAttemptFails(() => 0.5), false)
})
