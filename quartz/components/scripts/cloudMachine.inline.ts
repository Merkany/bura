import {
  makeCloudSpec,
  manualAttemptFails,
  nextAutomaticDelay,
  pickManualStatus,
} from "./cloudMachine.logic"

const svgNamespace = "http://www.w3.org/2000/svg"

function setupCloudMachine() {
  const machine = document.querySelector<HTMLElement>("[data-cloud-machine]")
  if (!machine || machine.dataset.ready === "true") return

  const button = machine.querySelector<HTMLButtonElement>("[data-cloud-button]")
  const cloudLayer = document.querySelector<HTMLElement>("[data-cloud-layer]")
  const status = document.querySelector<HTMLElement>("[data-cloud-status]")
  if (!button || !cloudLayer || !status) return

  machine.dataset.ready = "true"
  let automaticTimer: number | undefined
  let statusTimer: number | undefined
  let disposed = false

  const createCloud = (source: "automatic" | "manual") => {
    const spec = makeCloudSpec(source, Math.random)
    const cloud = document.createElement("span")
    const svg = document.createElementNS(svgNamespace, "svg")
    const path = document.createElementNS(svgNamespace, "path")

    cloud.className = "cloud-machine-cloud"
    cloud.style.setProperty("--cloud-scale", String(spec.scale))
    cloud.style.setProperty("--cloud-start-scale", String(spec.startScale))
    cloud.style.setProperty("--cloud-end-scale", String(spec.endScale))
    cloud.style.setProperty("--cloud-rotation", `${spec.rotation}deg`)
    cloud.style.setProperty("--cloud-mid-rotation", `${spec.midRotation}deg`)
    cloud.style.setProperty("--cloud-end-rotation", `${spec.endRotation}deg`)
    cloud.style.setProperty("--cloud-duration", `${spec.durationMs}ms`)
    cloud.style.setProperty("--cloud-start-y", `${spec.startY}px`)
    cloud.style.setProperty("--cloud-travel-x", `${spec.travelX}px`)
    cloud.style.setProperty("--cloud-mid-x", `${spec.midX}px`)
    cloud.style.setProperty("--cloud-end-y", `${spec.endY}px`)
    svg.setAttribute("viewBox", "0 0 60 42")
    svg.setAttribute("focusable", "false")
    path.setAttribute("d", spec.shape)
    svg.append(path)
    cloud.append(svg)
    cloudLayer.append(cloud)
    cloud.addEventListener("animationend", () => cloud.remove(), { once: true })
    window.setTimeout(() => cloud.remove(), spec.durationMs + 500)
  }

  const showStatus = (message: string | null) => {
    if (!message) return
    if (statusTimer) window.clearTimeout(statusTimer)
    status.textContent = message
    status.classList.add("is-visible")
    statusTimer = window.setTimeout(() => {
      status.classList.remove("is-visible")
      statusTimer = window.setTimeout(() => {
        status.textContent = ""
      }, 220)
    }, 2_200)
  }

  const shakeWithoutCloud = () => {
    machine.classList.remove("is-stalled")
    void machine.offsetWidth
    machine.classList.add("is-stalled")
    window.setTimeout(() => machine.classList.remove("is-stalled"), 420)
  }

  const handlePress = () => {
    if (manualAttemptFails(Math.random)) {
      shakeWithoutCloud()
      return
    }

    createCloud("manual")
    showStatus(pickManualStatus(Math.random))
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
    if (statusTimer) window.clearTimeout(statusTimer)
    cloudLayer.replaceChildren()
    status.replaceChildren()
  })
}

document.addEventListener("nav", setupCloudMachine)
document.addEventListener("render", setupCloudMachine)
