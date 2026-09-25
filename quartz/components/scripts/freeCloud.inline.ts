import { makeFreeCloudSpec, nextFreeCloudDelay } from "./freeCloud.logic"

function setupFreeCloud() {
  const layer = document.querySelector<HTMLElement>("[data-free-cloud-layer]")
  if (!layer || layer.dataset.ready === "true") return
  const assetBase = layer.dataset.cloudAssetBase
  if (!assetBase) return

  layer.dataset.ready = "true"
  let spawnTimer: number | undefined
  let disposed = false
  let activeCloud: HTMLElement | undefined
  let removeTimer: number | undefined

  const spawnCloud = () => {
    const spec = makeFreeCloudSpec(Math.random)
    const cloud = document.createElement("span")
    const image = document.createElement("img")

    cloud.className = `free-cloud free-cloud--${spec.direction}`
    cloud.style.setProperty("--free-cloud-scale", String(spec.scale))
    cloud.style.setProperty("--free-cloud-top", `${spec.topVh}vh`)
    cloud.style.setProperty("--free-cloud-drift", `${spec.driftVh}vh`)
    cloud.style.setProperty("--free-cloud-mid-a", `${spec.midDriftAVh}vh`)
    cloud.style.setProperty("--free-cloud-mid-b", `${spec.midDriftBVh}vh`)
    cloud.style.setProperty("--free-cloud-duration", `${spec.durationMs}ms`)
    image.src = `${assetBase}/${spec.asset}`
    image.alt = ""
    image.decoding = "async"
    image.draggable = false
    cloud.append(image)
    layer.append(cloud)
    activeCloud = cloud

    cloud.addEventListener("animationend", () => cloud.remove(), { once: true })
    removeTimer = window.setTimeout(() => cloud.remove(), spec.durationMs + 500)
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    spawnTimer = window.setTimeout(() => {
      if (disposed) return
      spawnCloud()
    }, nextFreeCloudDelay(Math.random))
  }

  window.addCleanup(() => {
    disposed = true
    if (spawnTimer) window.clearTimeout(spawnTimer)
    if (removeTimer) window.clearTimeout(removeTimer)
    activeCloud?.remove()
    layer.replaceChildren()
  })
}

document.addEventListener("nav", setupFreeCloud)
document.addEventListener("render", setupFreeCloud)
