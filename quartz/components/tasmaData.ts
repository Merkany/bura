export type TasmaStar = {
  id: string
  x: number
  y: number
  radius?: number
  href?: string
  name?: string
}

export type TasmaConstellation = {
  id: string
  label: string
  labelX: number
  labelY: number
  stars: TasmaStar[]
  lines: [string, string][]
}

const shape = (
  id: string,
  label: string,
  labelX: number,
  labelY: number,
  coords: Array<[string, number, number]>,
  lines: [string, string][],
): TasmaConstellation => ({
  id,
  label,
  labelX,
  labelY,
  stars: coords.map(([starId, x, y]) => ({ id: `${id}-${starId}`, x, y })),
  lines: lines.map(([a, b]) => [`${id}-${a}`, `${id}-${b}`]),
})

export const TASMA_CONSTELLATIONS: TasmaConstellation[] = [
  {
    id: "ursa-minor",
    label: "Küçük Ayı",
    labelX: 575,
    labelY: 222,
    stars: [
      { id: "polaris", name: "Polaris", x: 592, y: 204, radius: 6.5, href: "/tasma/polaris" },
      { id: "umi-2", x: 579, y: 190 },
      { id: "umi-3", x: 574, y: 164 },
      { id: "umi-4", x: 597, y: 158 },
      { id: "umi-5", x: 610, y: 181 },
      { id: "umi-6", x: 600, y: 194 },
      { id: "umi-7", x: 587, y: 194 },
    ],
    lines: [["polaris", "umi-2"], ["umi-2", "umi-3"], ["umi-3", "umi-4"], ["umi-4", "umi-5"], ["umi-5", "umi-6"], ["umi-6", "umi-7"], ["umi-7", "umi-2"]],
  },
  shape("ursa-major", "Büyük Ayı", 140, 405,
    [["1", 92, 344], ["2", 151, 314], ["3", 210, 297], ["4", 263, 317], ["5", 323, 282], ["6", 309, 382], ["7", 250, 366]],
    [["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"], ["5", "6"], ["6", "7"], ["7", "4"]]),
  shape("cepheus", "Cepheus", 652, 405,
    [["1", 650, 344], ["2", 691, 323], ["3", 733, 344], ["4", 716, 376], ["5", 670, 376]],
    [["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"], ["5", "1"]]),
  shape("cassiopeia", "Kassiopeia", 895, 386,
    [["1", 824, 320], ["2", 872, 270], ["3", 922, 320], ["4", 972, 277], ["5", 1022, 328]],
    [["1", "2"], ["2", "3"], ["3", "4"], ["4", "5"]]),
  shape("pegasus", "Pegasus", 140, 590,
    [["1", 118, 478], ["2", 205, 478], ["3", 205, 566], ["4", 118, 566], ["5", 267, 444]],
    [["1", "2"], ["2", "3"], ["3", "4"], ["4", "1"], ["2", "5"]]),
  shape("andromeda", "Andromeda", 380, 450,
    [["1", 340, 425], ["2", 386, 410], ["3", 424, 418], ["4", 462, 397]],
    [["1", "2"], ["2", "3"], ["3", "4"]]),
  shape("perseus", "Perseus", 565, 610,
    [["1", 545, 552], ["2", 574, 586], ["3", 559, 628], ["4", 616, 570]],
    [["1", "2"], ["2", "3"], ["2", "4"]]),
  shape("cygnus", "Kuğu, batıyor", 190, 802,
    [["1", 175, 720], ["2", 225, 730], ["3", 275, 741], ["4", 225, 682], ["5", 225, 780]],
    [["1", "2"], ["2", "3"], ["4", "2"], ["2", "5"]]),
  shape("orion", "Oryon, yükseliyor", 850, 780,
    [["1", 850, 690], ["2", 892, 660], ["3", 900, 744], ["4", 858, 772], ["5", 872, 725]],
    [["1", "2"], ["2", "3"], ["3", "4"], ["4", "1"], ["1", "5"], ["5", "3"]]),
  shape("aquila", "Kartal, batıyor", 460, 875,
    [["1", 450, 836], ["2", 482, 816], ["3", 515, 838]],
    [["1", "2"], ["2", "3"]]),
  shape("pisces", "Balık / Kova", 720, 920,
    [["1", 710, 882], ["2", 758, 890], ["3", 772, 870]],
    [["1", "2"], ["2", "3"]]),
]

// Sabit arka plan yıldızları: her derlemede aynı yerde kalırlar.
export const TASMA_BACKGROUND_STARS = Array.from({ length: 84 }, (_, i) => ({
  x: 18 + ((i * 137 + i * i * 19) % 1164),
  y: 18 + ((i * 211 + i * i * 7) % 984),
  radius: i % 11 === 0 ? 1.35 : i % 4 === 0 ? 0.95 : 0.65,
  opacity: 0.18 + (i % 5) * 0.055,
}))
