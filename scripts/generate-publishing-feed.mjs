import { execFileSync } from "node:child_process"
import { readFile, readdir, writeFile } from "node:fs/promises"
import { join, relative, sep } from "node:path"
import { fileURLToPath } from "node:url"

const projectDir = fileURLToPath(new URL("..", import.meta.url))
const contentDir = join(projectDir, "content")
const outputFeed = join(projectDir, "public", "bura-akis.xml")
const siteUrl = "https://buradayok.org"
const feedUrl = `${siteUrl}/bura-akis.xml`

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(directory, entry.name)
      if (entry.isDirectory()) return markdownFiles(fullPath)
      return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : []
    }),
  )
  return nested.flat()
}

function slugFor(file) {
  const path = relative(contentDir, file).split(sep).join("/").replace(/\.md$/, "")
  return path.endsWith("/index") ? path.slice(0, -6) : path
}

function field(source, name) {
  return (
    source
      .match(new RegExp(`^${name}:\\s*["']?(.+?)["']?\\s*$`, "m"))?.[1]
      ?.replace(/["']$/, "")
      .trim() ?? ""
  )
}

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function publicationDate(file) {
  try {
    const value = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      cwd: projectDir,
      encoding: "utf8",
    }).trim()
    if (value) return new Date(value)
  } catch {}
  return new Date()
}

const entries = []
for (const file of await markdownFiles(contentDir)) {
  const source = await readFile(file, "utf8")
  const slug = slugFor(file)
  const isStory = !slug.startsWith("en/") && field(source, "pageType") === "story"
  const isTurkishLossRecord = slug.startsWith("kayip-burosu/") && slug !== "kayip-burosu/"
  const isEnglishLossRecord =
    slug.startsWith("en/lost-property/") && slug !== "en/lost-property/"
  const isLossRecord = isTurkishLossRecord || isEnglishLossRecord
  if (!isStory && !isLossRecord) continue

  const recordNumber = field(source, "kayit").padStart(3, "0")
  const originalTitle = field(source, "title") || "Bura"
  const title = isLossRecord
    ? `${isEnglishLossRecord ? "Lost Property" : "Kayıp Bürosu"} / ${recordNumber} — ${originalTitle}`
    : originalTitle
  const description = isLossRecord
    ? [field(source, "kategori"), field(source, "bulunduguYer")].filter(Boolean).join(" · ")
    : field(source, "description") || `${originalTitle}, Bura'da yeni bir metin.`
  // GitHub Pages emits these pages as extensionless files. A trailing slash
  // therefore points at a non-existent directory and returns 404.
  const url = `${siteUrl}/${slug}`
  entries.push({ title, description, url, date: publicationDate(file), isLossRecord })
}

entries.sort((a, b) => b.date.getTime() - a.date.getTime())

const items = entries
  .map(
    ({ title, description, url, date }) => `    <item>
      <title>${xml(title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <description>${xml(description)}</description>
      <pubDate>${date.toUTCString()}</pubDate>
    </item>`,
  )
  .join("\n")

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bura — yeni metinler ve Kayıp Bürosu</title>
    <link>${siteUrl}/</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Bura'da yayımlanan yeni metinler ve Kayıp Bürosu kayıtları</description>
    <language>tr</language>
    <generator>Bura</generator>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`

await writeFile(outputFeed, feed)

const sitemapPath = join(projectDir, "public", "sitemap.xml")
let sitemap = await readFile(sitemapPath, "utf8")
sitemap = sitemap.replace(
  /<url>\s*<loc>https:\/\/buradayok\.org\/tags\/?<\/loc>[\s\S]*?<\/url>/g,
  "",
)

const lossRecordUrls = entries.filter((entry) => entry.isLossRecord)
const missingLossRecords = lossRecordUrls.filter(
  ({ url }) => !sitemap.includes(`<loc>${xml(url)}</loc>`),
)
const lossRecordEntries = missingLossRecords
  .map(
    ({ url, date }) => `<url>
    <loc>${xml(url)}</loc>
    <lastmod>${date.toISOString()}</lastmod>
  </url>`,
  )
  .join("")
sitemap = sitemap.replace("</urlset>", `${lossRecordEntries}</urlset>`)
await writeFile(sitemapPath, sitemap)

const defaultFeedPath = join(projectDir, "public", "index.xml")
let defaultFeed = await readFile(defaultFeedPath, "utf8")
defaultFeed = defaultFeed.replace(
  /<item>\s*<title>[^<]*<\/title>\s*<link>https:\/\/buradayok\.org\/tags\/?<\/link>[\s\S]*?<\/item>/g,
  "",
)
await writeFile(defaultFeedPath, defaultFeed)

console.log(`Bura yayın akışı hazır: ${entries.length} içerik (public/bura-akis.xml)`)
console.log(`Sitemap'e ${missingLossRecords.length} Kayıp Bürosu kaydı eklendi; /tags/ çıkarıldı.`)
