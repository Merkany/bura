import { readFile, writeFile } from "node:fs/promises"

const pluginPath = new URL("../node_modules/@quartz-community/og-image/dist/index.js", import.meta.url)
const lowQuality = 'return sharp(Buffer.from(svg)).webp({ quality: 40 });'
const highQuality = 'return sharp(Buffer.from(svg)).webp({ lossless: true, effort: 6 });'

const source = await readFile(pluginPath, "utf8")

if (source.includes(highQuality)) {
  process.exit(0)
}

if (!source.includes(lowQuality)) {
  throw new Error("OG görsel kalite ayarı bulunamadı; eklenti sürümü değişmiş olabilir.")
}

await writeFile(pluginPath, source.replace(lowQuality, highQuality))
console.log("Sosyal paylaşım görselleri kayıpsız WebP olarak ayarlandı.")
