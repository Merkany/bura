import {
  STORAGE_KEY,
  computeProgress,
  dismissKey,
  homepageCueLabel,
  parseReadingPlace,
  scrollTopForProgress,
  shouldOfferResume,
  shouldShowHomepageCue,
  type ReadingPlace,
} from "./readingPlace.logic"

function readPlace(): ReadingPlace | null {
  try {
    return parseReadingPlace(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

function writePlace(place: ReadingPlace) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(place))
  } catch {
    // Private mode or blocked storage should not break reading.
  }
}

function wasDismissed(slug: string): boolean {
  try {
    return window.sessionStorage.getItem(dismissKey(slug)) === "1"
  } catch {
    return false
  }
}

function dismiss(slug: string) {
  try {
    window.sessionStorage.setItem(dismissKey(slug), "1")
  } catch {
    // Same as writePlace: reading still works without this.
  }
}

function currentPlaceFromPage(): ReadingPlace | null {
  const slug = document.body.dataset.slug
  if (!slug) return null
  const title =
    document.querySelector(".article-title")?.textContent?.trim() ||
    document.querySelector("h1")?.textContent?.trim() ||
    slug
  const progress = computeProgress(
    window.scrollY,
    document.documentElement.scrollHeight,
    window.innerHeight,
  )
  return {
    slug,
    title,
    href: `${window.location.pathname}${window.location.search}`,
    progress,
    updatedAt: Date.now(),
  }
}

function setupHomepageCue() {
  const host = document.querySelector<HTMLElement>("[data-reading-place]")
  if (!host) return
  const place = readPlace()
  if (!shouldShowHomepageCue(place) || !place) {
    host.hidden = true
    host.replaceChildren()
    return
  }
  const isEnglish = document.body.dataset.pageLang === "en"
  const link = document.createElement("a")
  link.href = place.href
  link.textContent = homepageCueLabel(place.title, isEnglish)
  host.replaceChildren(link)
  host.hidden = false
}

function setupStoryResume() {
  const host = document.querySelector<HTMLElement>("[data-reading-place-resume]")
  if (!host || document.body.dataset.pageType !== "story") return

  const slug = document.body.dataset.slug ?? ""
  const place = readPlace()
  const sameStory = place?.slug === slug
  if (
    !sameStory ||
    !place ||
    !shouldOfferResume(place.progress) ||
    wasDismissed(slug)
  ) {
    host.hidden = true
    return
  }

  const continueButton = host.querySelector<HTMLButtonElement>("[data-reading-place-continue]")
  const dismissButton = host.querySelector<HTMLButtonElement>("[data-reading-place-dismiss]")
  if (!continueButton) return

  const goToPlace = () => {
    const top = scrollTopForProgress(
      place.progress,
      document.documentElement.scrollHeight,
      window.innerHeight,
    )
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" })
    host.hidden = true
    dismiss(slug)
  }
  const stayAtStart = () => {
    host.hidden = true
    dismiss(slug)
  }

  continueButton.addEventListener("click", goToPlace)
  dismissButton?.addEventListener("click", stayAtStart)
  host.hidden = false

  window.addCleanup(() => {
    continueButton.removeEventListener("click", goToPlace)
    dismissButton?.removeEventListener("click", stayAtStart)
  })
}

function setupStorySave() {
  if (document.body.dataset.pageType !== "story") return

  let timer = 0
  const save = () => {
    const place = currentPlaceFromPage()
    if (place) writePlace(place)
  }
  const onScroll = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(save, 400)
  }

  window.addEventListener("scroll", onScroll, { passive: true })
  document.addEventListener("visibilitychange", save)
  save()

  window.addCleanup(() => {
    window.clearTimeout(timer)
    window.removeEventListener("scroll", onScroll)
    document.removeEventListener("visibilitychange", save)
    save()
  })
}

function setupReadingPlace() {
  setupHomepageCue()
  setupStoryResume()
  setupStorySave()
}

document.addEventListener("nav", setupReadingPlace)
document.addEventListener("render", setupReadingPlace)
