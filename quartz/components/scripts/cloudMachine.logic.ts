export const CLOUD_SHAPES = [
  "bulut-01.png",
  "bulut-02.png",
  "bulut-03.png",
  "bulut-04.png",
  "bulut-05.png",
  "bulut-06.png",
  "bulut-07.png",
  "bulut-08.png",
  "bulut-09.png",
  "bulut-10.png",
  "bulut-11.png",
  "bulut-12.png",
  "bulut-13.png",
  "bulut-14.png",
  "bulut-15.png",
] as const

export const AUTO_CLOUD_SHAPES = [
  CLOUD_SHAPES[0],
  CLOUD_SHAPES[2],
  CLOUD_SHAPES[3],
  CLOUD_SHAPES[4],
] as const

export const MANUAL_STATUS_MESSAGES = [
  "Şekil üzerinde uzlaşılamadı.",
  "Rüzgâra bildirilmedi.",
  "Konumu geçici.",
  "Nem hesabı yapılmadı.",
  "Gökyüzünde kaydı bulunamadı.",
  "Şekli sonradan değişebilir.",
  "Nereye gittiği bilinmiyor.",
  "Biraz fazla oldu.",
  "Bunun böyle olması planlanmamıştı.",
  "Kimse istemedi.",
  "Bulut teslim alınmadı.",
  "Gökyüzü itiraz etti.",
  "Rüzgâr henüz cevap vermedi.",
  "Bulutun kime ait olduğu belirlenemedi.",
  "Bu işlem gökyüzünde görünmüyor.",
  "Bulut yanlış yere gönderildi.",
  "Gerekli boşluk bulunamadı.",
  "Bulut geri alınamıyor.",
  "Yağmur talebi bulunamadı.",
  "Deniz bekleniyor.",
] as const

const boundedRandom = (random: () => number) => Math.min(1, Math.max(0, random()))
const between = (minimum: number, maximum: number, random: () => number) =>
  minimum + (maximum - minimum) * boundedRandom(random)

export function nextAutomaticDelay(random: () => number): number {
  return Math.round(between(10_000, 20_000, random))
}

export function nextManualDelay(random: () => number): number {
  return Math.round(between(500, 800, random))
}

export function makeCloudSpec(
  source: "automatic" | "manual",
  random: () => number,
) {
  const shapes = source === "automatic" ? AUTO_CLOUD_SHAPES : CLOUD_SHAPES
  const assetIndex = Math.min(shapes.length - 1, Math.floor(boundedRandom(random) * shapes.length))
  const scale = Number(between(0.78, 1.18, random).toFixed(2))
  const rotation = Math.round(between(-6, 6, random))
  const travelX = Math.round(between(-260, -430, random))

  return {
    asset: shapes[assetIndex],
    scale,
    startScale: Number((scale * 0.72).toFixed(2)),
    endScale: Number((scale * 1.08).toFixed(2)),
    rotation,
    midRotation: Number((rotation * -0.4).toFixed(1)),
    endRotation: Number((rotation * 0.7).toFixed(1)),
    durationMs: Math.round(between(10_000, 16_000, random)),
    startX: Math.round(between(-5, 5, random)),
    startY: Math.round(between(-6, 6, random)),
    midY: Math.round(between(-30, -12, random)),
    travelX,
    midX: Math.round(travelX * 0.28),
    endY: Math.round(between(-12, 38, random)),
  }
}

export function pickManualStatus(random: () => number): string {
  const choice = boundedRandom(random)
  if (choice >= 0.985) return MANUAL_STATUS_MESSAGES.at(-1) ?? MANUAL_STATUS_MESSAGES[0]

  const commonMessages = MANUAL_STATUS_MESSAGES.slice(0, -1)
  const index = Math.min(commonMessages.length - 1, Math.floor((choice / 0.985) * commonMessages.length))
  return commonMessages[index]
}

export function manualAttemptFails(random: () => number): boolean {
  return boundedRandom(random) < 0.02
}
