export const STORAGE_KEY = "bura-reading-place"
export const DISMISS_PREFIX = "bura-reading-place-dismissed:"

export type ReadingPlace = {
  slug: string
  title: string
  href: string
  progress: number
  updatedAt: number
}

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

export function computeProgress(scrollY: number, scrollHeight: number, viewportHeight: number): number {
  const travel = scrollHeight - viewportHeight
  if (travel <= 0) return 0
  return clampProgress(scrollY / travel)
}

export function scrollTopForProgress(
  progress: number,
  scrollHeight: number,
  viewportHeight: number,
): number {
  const travel = Math.max(0, scrollHeight - viewportHeight)
  return Math.round(clampProgress(progress) * travel)
}

export function parseReadingPlace(raw: string | null): ReadingPlace | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<ReadingPlace>
    if (typeof value.slug !== "string" || !value.slug) return null
    if (typeof value.title !== "string" || !value.title) return null
    if (typeof value.href !== "string" || !value.href) return null
    return {
      slug: value.slug,
      title: value.title,
      href: value.href,
      progress: clampProgress(Number(value.progress)),
      updatedAt: Number.isFinite(Number(value.updatedAt)) ? Number(value.updatedAt) : 0,
    }
  } catch {
    return null
  }
}

export function shouldOfferResume(progress: number): boolean {
  return progress >= 0.08 && progress <= 0.92
}

export function shouldShowHomepageCue(place: ReadingPlace | null): boolean {
  return Boolean(place && place.progress >= 0.02 && place.progress < 0.92)
}

export function homepageCueLabel(title: string, isEnglish: boolean): string {
  return isEnglish ? `Where you left off — ${title}` : `Kaldığın yer — ${title}`
}

export function dismissKey(slug: string): string {
  return `${DISMISS_PREFIX}${slug}`
}
