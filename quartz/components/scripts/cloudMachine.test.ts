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
  pickManualStatus,
} = cloudMachineModule

function sequence(...values: number[]) {
  let index = 0
  return () => values[index++] ?? values.at(-1) ?? 0
}

test("automatic production waits between 18 and 35 seconds", () => {
  assert.equal(
    nextAutomaticDelay(() => 0),
    18_000,
  )
  assert.equal(
    nextAutomaticDelay(() => 1),
    35_000,
  )
})

test("manual clouds use fifteen shapes while automatic clouds use a smaller subset", () => {
  assert.equal(CLOUD_SHAPES.length, 15)
  assert.ok(AUTO_CLOUD_SHAPES.length >= 3)
  assert.ok(AUTO_CLOUD_SHAPES.length < CLOUD_SHAPES.length)
  assert.ok(AUTO_CLOUD_SHAPES.every((shape) => CLOUD_SHAPES.includes(shape)))

  const automatic = makeCloudSpec("automatic", sequence(0.999, 0.5, 0.5, 0.5, 0.5, 0.5))
  const manual = makeCloudSpec("manual", sequence(0.999, 0.5, 0.5, 0.5, 0.5, 0.5))
  assert.equal(automatic.shape, AUTO_CLOUD_SHAPES.at(-1))
  assert.equal(manual.shape, CLOUD_SHAPES.at(-1))
})

test("cloud motion varies within deliberately small bounds", () => {
  const low = makeCloudSpec("manual", sequence(0, 0, 0, 0, 0, 0))
  const high = makeCloudSpec("manual", sequence(0.999, 1, 1, 1, 1, 1))

  assert.deepEqual(
    {
      scale: low.scale,
      startScale: low.startScale,
      endScale: low.endScale,
      rotation: low.rotation,
      midRotation: low.midRotation,
      durationMs: low.durationMs,
      startY: low.startY,
    },
    {
      scale: 0.78,
      startScale: 0.56,
      endScale: 0.84,
      rotation: -6,
      midRotation: 2.4,
      durationMs: 10_000,
      startY: -6,
    },
  )
  assert.deepEqual(
    {
      scale: high.scale,
      rotation: high.rotation,
      durationMs: high.durationMs,
      startY: high.startY,
    },
    { scale: 1.18, rotation: 6, durationMs: 16_000, startY: 6 },
  )
})

test("manual status is absent on most presses and contains fifteen possible messages", () => {
  assert.equal(MANUAL_STATUS_MESSAGES.length, 15)
  assert.equal(pickManualStatus(sequence(0.9)), null)
  assert.notEqual(pickManualStatus(sequence(0.1, 0.5)), null)
})

test("Deniz bekleniyor is much rarer than ordinary status messages", () => {
  assert.equal(pickManualStatus(sequence(0.1, 0.005)), "Deniz bekleniyor…")
  assert.notEqual(pickManualStatus(sequence(0.1, 0.5)), "Deniz bekleniyor…")
})

test("a manual attempt very rarely fails to produce a cloud", () => {
  assert.equal(
    manualAttemptFails(() => 0.005),
    true,
  )
  assert.equal(
    manualAttemptFails(() => 0.5),
    false,
  )
})
