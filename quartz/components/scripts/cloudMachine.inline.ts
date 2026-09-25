import {
  makeCloudSpec,
  manualAttemptFails,
  nextAutomaticDelay,
  nextManualDelay,
  pickManualStatus,
} from "./cloudMachine.logic"

function setupCloudMachine() {
  const machine = document.querySelector<HTMLElement>("[data-cloud-machine]")
  if (!machine || machine.dataset.ready === "true") return

  const button = machine.matches("[data-cloud-button]")
    ? (machine as HTMLButtonElement)
    : machine.querySelector<HTMLButtonElement>("[data-cloud-button]")
  const cloudLayer = document.querySelector<HTMLElement>("[data-cloud-layer]")
  const status = document.querySelector<HTMLElement>("[data-cloud-status]")
  if (!button || !cloudLayer || !status) return
  const assetBase = cloudLayer.dataset.cloudAssetBase
  if (!assetBase) return

  machine.dataset.ready = "true"
  let automaticTimer: number | undefined
  let statusFadeTimer: number | undefined
  let statusClearTimer: number | undefined
  let pressedTimer: number | undefined
  const manualTimers = new Set<number>()
  let pendingProductions = 0
  let disposed = false

  const createCloud = (source: "automatic" | "manual") => {
    const spec = makeCloudSpec(source, Math.random)
    const cloud = document.createElement("span")
    const image = document.createElement("img")

    cloud.className = "cloud-machine-cloud"
    cloud.style.setProperty("--cloud-scale", String(spec.scale))
    cloud.style.setProperty("--cloud-start-scale", String(spec.startScale))
    cloud.style.setProperty("--cloud-end-scale", String(spec.endScale))
    cloud.style.setProperty("--cloud-rotation", `${spec.rotation}deg`)
    cloud.style.setProperty("--cloud-mid-rotation", `${spec.midRotation}deg`)
    cloud.style.setProperty("--cloud-end-rotation", `${spec.endRotation}deg`)
    cloud.style.setProperty("--cloud-duration", `${spec.durationMs}ms`)
    cloud.style.setProperty("--cloud-start-x", `${spec.startX}px`)
    cloud.style.setProperty("--cloud-start-y", `${spec.startY}px`)
    cloud.style.setProperty("--cloud-travel-x", `${spec.travelX}px`)
    cloud.style.setProperty("--cloud-mid-x", `${spec.midX}px`)
    cloud.style.setProperty("--cloud-mid-y", `${spec.midY}px`)
    cloud.style.setProperty("--cloud-end-y", `${spec.endY}px`)
    image.src = `${assetBase}/${spec.asset}`
    image.alt = ""
    image.decoding = "async"
    image.draggable = false
    cloud.append(image)
    cloudLayer.append(cloud)
    cloud.addEventListener("animationend", () => cloud.remove(), { once: true })
    window.setTimeout(() => cloud.remove(), spec.durationMs + 500)
  }

  const showStatus = (message: string) => {
    if (status.classList.contains("is-visible")) return
    if (statusFadeTimer) window.clearTimeout(statusFadeTimer)
    if (statusClearTimer) window.clearTimeout(statusClearTimer)
    status.textContent = message
    status.classList.remove("is-fading")
    status.classList.add("is-visible")
    statusFadeTimer = window.setTimeout(() => status.classList.add("is-fading"), 2_500)
    statusClearTimer = window.setTimeout(() => {
      status.classList.remove("is-visible", "is-fading")
      status.textContent = ""
    }, 3_000)
  }

  const shakeWithoutCloud = () => {
    machine.classList.remove("is-stalled")
    void machine.offsetWidth
    machine.classList.add("is-stalled")
    window.setTimeout(() => machine.classList.remove("is-stalled"), 420)
  }

  const pressButton = () => {
    if (pressedTimer) window.clearTimeout(pressedTimer)
    machine.classList.remove("is-pressed")
    void button.offsetWidth
    machine.classList.add("is-pressed")
    pressedTimer = window.setTimeout(() => machine.classList.remove("is-pressed"), 140)
  }

  const startMachine = (delay: number) => {
    pendingProductions += 1
    machine.style.setProperty("--cloud-production-delay", `${delay}ms`)
    machine.classList.add("is-working")
  }

  const stopMachine = () => {
    pendingProductions = Math.max(0, pendingProductions - 1)
    if (pendingProductions === 0) machine.classList.remove("is-working")
  }

  const handlePress = () => {
    pressButton()
    showStatus(pickManualStatus(Math.random))
    const delay = nextManualDelay(Math.random)
    startMachine(delay)
    const timer = window.setTimeout(() => {
      manualTimers.delete(timer)
      if (disposed) {
        stopMachine()
        return
      }
      if (manualAttemptFails(Math.random)) {
        stopMachine()
        shakeWithoutCloud()
        return
      }
      createCloud("manual")
      stopMachine()
    }, delay)
    manualTimers.add(timer)
  }

  const scheduleAutomaticCloud = () => {
    automaticTimer = window.setTimeout(() => {
      if (disposed) return
      createCloud("automatic")
      scheduleAutomaticCloud()
    }, nextAutomaticDelay(Math.random))
  }

  button.addEventListener("click", handlePress)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scheduleAutomaticCloud()
  }

  window.addCleanup(() => {
    disposed = true
    button.removeEventListener("click", handlePress)
    if (automaticTimer) window.clearTimeout(automaticTimer)
    if (statusFadeTimer) window.clearTimeout(statusFadeTimer)
    if (statusClearTimer) window.clearTimeout(statusClearTimer)
    if (pressedTimer) window.clearTimeout(pressedTimer)
    for (const timer of manualTimers) window.clearTimeout(timer)
    manualTimers.clear()
    pendingProductions = 0
    machine.classList.remove("is-working")
    machine.classList.remove("is-pressed")
    cloudLayer.replaceChildren()
    status.replaceChildren()
  })
}

document.addEventListener("nav", setupCloudMachine)
document.addEventListener("render", setupCloudMachine)
