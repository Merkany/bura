export const CLOUD_SHAPES = [
  "M4 29C2 22 7 17 14 18C15 9 27 6 32 14C38 10 48 14 47 22C55 23 57 34 48 36H13C7 36 4 33 4 29Z",
  "M5 30C3 23 8 18 15 19C17 12 24 9 30 14C35 7 47 10 48 20C57 21 58 33 50 36H13C8 36 5 34 5 30Z",
  "M3 28C3 21 9 17 16 19C19 8 34 8 37 19C44 16 53 22 51 29C58 33 52 38 45 37H12C6 37 3 34 3 28Z",
  "M6 31C1 25 7 18 15 20C17 13 25 10 31 16C35 11 45 13 46 21C54 22 56 32 49 36C38 38 18 36 11 37C7 36 5 34 6 31Z",
  "M4 30C2 23 8 19 14 20C13 13 23 10 28 16C33 8 46 12 46 22C55 22 57 33 48 36H12C7 36 4 34 4 30Z",
  "M3 31C1 24 7 18 14 20C18 10 31 10 35 19C42 13 52 18 50 27C58 30 54 38 46 37H11C6 37 3 35 3 31Z",
  "M6 28C5 21 12 18 18 21C20 10 35 8 39 20C46 18 53 24 50 31C52 35 47 38 42 37H13C7 37 4 33 6 28Z",
  "M4 29C3 24 7 20 13 20C15 11 27 7 33 16C39 12 49 15 49 24C56 26 55 35 47 37H12C6 37 3 34 4 29Z",
  "M5 31C2 25 7 19 14 20C18 12 28 11 33 18C36 12 47 13 49 22C57 23 57 34 49 37H13C8 37 5 35 5 31Z",
  "M3 30C2 22 10 18 17 21C20 12 32 10 37 19C43 16 52 21 51 28C57 31 53 38 45 37H11C6 37 3 35 3 30Z",
  "M5 28C5 21 11 17 18 20C22 9 37 10 40 21C47 18 54 25 50 32C53 36 47 38 42 37H12C6 37 3 32 5 28Z",
  "M4 31C1 25 6 19 13 20C15 14 23 11 29 16C34 9 46 12 47 21C54 22 58 30 52 35C45 39 20 36 12 37C7 37 4 35 4 31Z",
  "M3 29C3 23 8 19 15 20C18 10 31 8 36 18C42 14 51 19 50 27C57 29 55 36 47 37H11C6 37 3 34 3 29Z",
  "M6 30C3 24 8 18 15 20C19 13 28 11 34 18C38 11 49 15 49 24C56 26 55 35 47 37H13C8 37 5 34 6 30Z",
  "M4 28C4 21 11 18 17 21C19 11 33 9 37 20C44 15 53 22 50 29C57 33 52 38 45 37H12C6 37 3 33 4 28Z",
] as const

export const AUTO_CLOUD_SHAPES = CLOUD_SHAPES.slice(0, 4)

export const MANUAL_STATUS_MESSAGES = [
  "Su aranıyor…",
  "Gökyüzünden izin bekleniyor",
  "Şekil konusunda anlaşmazlık çıktı…",
  "Rüzgârın gelmesi bekleniyor…",
  "Kenarlar yuvarlanıyor…",
  "Bir parça gölge ekleniyor…",
  "Hafiflik ayarlanıyor…",
  "Yükseklik ölçülüyor…",
  "Yağmur ihtimali görüşülüyor…",
  "Bulut kendini toparlıyor…",
  "Gökyüzünde yer açılıyor…",
  "Makine düşünüyor…",
  "Biraz daha beyaz gerekebilir…",
  "Yön konusunda kararsız kalındı…",
  "Deniz bekleniyor…",
] as const

const boundedRandom = (random: () => number) => Math.min(1, Math.max(0, random()))
const between = (minimum: number, maximum: number, random: () => number) =>
  minimum + (maximum - minimum) * boundedRandom(random)

export function nextAutomaticDelay(random: () => number): number {
  return Math.round(between(18_000, 35_000, random))
}

export function makeCloudSpec(source: "automatic" | "manual", random: () => number) {
  const shapes = source === "automatic" ? AUTO_CLOUD_SHAPES : CLOUD_SHAPES
  const shapeIndex = Math.min(shapes.length - 1, Math.floor(boundedRandom(random) * shapes.length))
  const scale = Number(between(0.78, 1.18, random).toFixed(2))
  const rotation = Math.round(between(-6, 6, random))
  const travelX = Math.round(between(-260, -430, random))

  return {
    shape: shapes[shapeIndex],
    scale,
    startScale: Number((scale * 0.72).toFixed(2)),
    endScale: Number((scale * 1.08).toFixed(2)),
    rotation,
    midRotation: Number((rotation * -0.4).toFixed(1)),
    endRotation: Number((rotation * 0.7).toFixed(1)),
    durationMs: Math.round(between(10_000, 16_000, random)),
    startY: Math.round(between(-6, 6, random)),
    travelX,
    midX: Math.round(travelX * 0.28),
    endY: Math.round(between(48, 115, random)),
  }
}

export function pickManualStatus(random: () => number): string | null {
  if (boundedRandom(random) >= 0.35) return null

  const choice = boundedRandom(random)
  if (choice < 0.015) return MANUAL_STATUS_MESSAGES.at(-1) ?? null

  const commonMessages = MANUAL_STATUS_MESSAGES.slice(0, -1)
  const normalized = (choice - 0.015) / 0.985
  const index = Math.min(commonMessages.length - 1, Math.floor(normalized * commonMessages.length))
  return commonMessages[index]
}

export function manualAttemptFails(random: () => number): boolean {
  return boundedRandom(random) < 0.02
}
