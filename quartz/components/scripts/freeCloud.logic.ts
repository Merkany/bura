import { CLOUD_SHAPES } from "./cloudMachine.logic"

const boundedRandom = (random: () => number) => Math.min(1, Math.max(0, random()))
const between = (minimum: number, maximum: number, random: () => number) =>
  minimum + (maximum - minimum) * boundedRandom(random)

export type FreeCloudDirection = "ltr" | "rtl"

export interface FreeCloudSpec {
  asset: (typeof CLOUD_SHAPES)[number]
  direction: FreeCloudDirection
  scale: number
  topVh: number
  driftVh: number
  midDriftAVh: number
  midDriftBVh: number
  durationMs: number
}

/**
 * Bulut makinesinden bağımsız, sayfanın genelinde tek başına süzülen
 * bulut için rastgele bir "reçete" üretir. Makinenin ürettiği bulutların
 * aksine (kısa, makineye yakın bir sürüklenme), bu bulut ekranın bir
 * kenarından girip diğer kenardan çıkar.
 */
export function makeFreeCloudSpec(random: () => number): FreeCloudSpec {
  const assetIndex = Math.min(
    CLOUD_SHAPES.length - 1,
    Math.floor(boundedRandom(random) * CLOUD_SHAPES.length),
  )
  const direction: FreeCloudDirection = boundedRandom(random) < 0.5 ? "ltr" : "rtl"

  return {
    asset: CLOUD_SHAPES[assetIndex],
    direction,
    scale: Number(between(0.7, 1.15, random).toFixed(2)),
    topVh: Math.round(between(8, 60, random)),
    driftVh: Math.round(between(-16, 16, random)),
    // Yolun ortasında iki farklı sapma noktası — bulut düz bir çizgide değil,
    // hafif dalgalanarak geçsin diye.
    midDriftAVh: Math.round(between(-10, 10, random)),
    midDriftBVh: Math.round(between(-10, 10, random)),
    durationMs: Math.round(between(42_000, 78_000, random)),
  }
}

/**
 * Sayfa açılır açılmaz değil, kısa bir sessizlikten sonra görünsün —
 * böylece sayfa yüklenme gürültüsüne karışmıyor, ayrı bir an gibi hissettiriyor.
 */
export function nextFreeCloudDelay(random: () => number): number {
  return Math.round(between(2_000, 9_000, random))
}
