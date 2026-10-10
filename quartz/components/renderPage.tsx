import { render } from "preact-render-to-string"
import { QuartzComponent, QuartzComponentProps } from "./types"
import BodyConstructor from "./Body"
import {
  CSSResource,
  JSResource,
  JSResourceToScriptElement,
  StaticResources,
} from "../util/resources"
import { FullSlug, RelativeURL, joinSegments, normalizeHastElement } from "../util/path"
import { clone } from "../util/clone"
import { Root, Element, ElementContent } from "hast"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { styleText } from "util"
import { resolveFrame } from "./frames"
import type { TreeTransform } from "../plugins/types"
import type { BuildCtx } from "../util/ctx"
import { TASMA_BACKGROUND_STARS, TASMA_CONSTELLATIONS } from "./tasmaData"

interface RenderComponents {
  head: QuartzComponent
  header: QuartzComponent[]
  beforeBody: QuartzComponent[]
  pageBody: QuartzComponent
  afterBody: QuartzComponent[]
  left: QuartzComponent[]
  right: QuartzComponent[]
  footer: QuartzComponent[]
  frame?: string
}

type LossRecord = {
  slug: string
  number: number
  category: string
  title: string
  location: string
  outcome: string
}

function getLossRecords(
  allFiles: QuartzComponentProps["allFiles"],
  prefix = "kayip-burosu/",
): LossRecord[] {
  return allFiles
    .filter((file) => file.slug?.startsWith(prefix) && file.slug !== `${prefix}index`)
    .map((file) => {
      const data = file.frontmatter as Record<string, unknown> | undefined
      return {
        slug: String(file.slug ?? ""),
        number: Number(data?.kayit ?? 0),
        category: String(data?.kategori ?? ""),
        title: String(data?.title ?? ""),
        location: String(data?.bulunduguYer ?? ""),
        outcome: String(data?.islem ?? ""),
      }
    })
    .filter((record) => record.number > 0 && record.title)
    .sort((a, b) => b.number - a.number)
}

const LossRecords: QuartzComponent = ({ allFiles, fileData }) => {
  const isEnglish = fileData.frontmatter?.lang === "en"
  const records = getLossRecords(allFiles, isEnglish ? "en/lost-property/" : "kayip-burosu/")
  const copy = isEnglish
    ? {
        record: "RECORD",
        show: "Show outcome",
        location: "Last seen",
        outcome: "OUTCOME",
        code: "LOST / FOUND REPORT",
        heading: "Leave a loss or a finding.",
        intro: "Write down as much as you remember.",
        review: "Reports are reviewed before publication.",
        kind: "What are you leaving here?",
        lost: "Something I lost",
        found: "Something I found",
        what: "What did you lose?",
        where: "Where did you last see it?",
        when: "Approximate time",
        whenPlaceholder: "Yesterday, 2019, during lunch…",
        name: "Your name",
        optional: "optional",
        anonymous: "Publish my record anonymously.",
        submit: "Leave the record",
        submitting: "Recording…",
        subject: "Bura — new lost / found report",
      }
    : {
        record: "KAYIT",
        show: "İşlem sonucunu göster",
        location: "Bulunduğu yer",
        outcome: "İŞLEM",
        code: "KAYIP / BULUNTU BİLDİRİMİ",
        heading: "Bir kayıp ya da buluntu bırakın.",
        intro: "Hatırladığınız kadarını yazın.",
        review: "Başvurular yayımlanmadan önce incelenir.",
        kind: "Buraya ne bırakıyorsunuz?",
        lost: "Kaybettiğim bir şey",
        found: "Bulduğum bir şey",
        what: "Ne kaybettiniz?",
        where: "En son nerede gördünüz?",
        when: "Yaklaşık zaman",
        whenPlaceholder: "Dün, 2019, öğle arası…",
        name: "Adınız",
        optional: "isteğe bağlı",
        anonymous: "Kaydım isimsiz yayımlansın.",
        submit: "Kaydı bırak",
        submitting: "Kaydediliyor…",
        subject: "Bura — yeni kayıp / buluntu başvurusu",
      }

  return (
    <>
      <div class="loss-records">
        {records.map((record) => {
          const recordId = `kayit-${String(record.number).padStart(3, "0")}`
          const shareTitle = `${copy.record} ${String(record.number).padStart(3, "0")} — ${record.title}`
          return (
          <section class="loss-record" id={recordId}>
            <header class="loss-record-head">
              {copy.record} {String(record.number).padStart(3, "0")}
              {record.category &&
                ` / ${record.category.toLocaleUpperCase(isEnglish ? "en-US" : "tr-TR")}`}
            </header>
            <h2 class="loss-subject">
              <a class="loss-record-permalink" href={`/${record.slug}`}>
                {record.title}
              </a>
            </h2>
            <details class="loss-details" name="kayip-kaydi">
              <summary>
                <span>{copy.show}</span>
              </summary>
              <div class="loss-details-body">
                <p class="loss-location">
                  <span>{copy.location}</span>
                  {record.location}
                </p>
                <footer class="loss-outcome">
                  <span>{copy.outcome}</span>
                  <p>{record.outcome}</p>
                </footer>
              </div>
            </details>
            <SharePanel
              title={shareTitle}
              url={`/${record.slug}`}
              isEnglish={isEnglish}
              compact
            />
          </section>
          )
        })}
      </div>

      <section class="loss-application" aria-labelledby="loss-application-title">
        <header>
          <span class="loss-application-code">{copy.code}</span>
          <h2 id="loss-application-title">{copy.heading}</h2>
          <p>{copy.intro}</p>
          <p class="loss-application-note">{copy.review}</p>
        </header>
        <form
          class="loss-application-form"
          data-form-endpoint="https://formspree.io/f/xjykvpbb"
          data-lang={isEnglish ? "en" : "tr"}
        >
          <input type="hidden" name="_subject" value={copy.subject} />
          <input type="hidden" name="dil" value={isEnglish ? "English" : "Türkçe"} />
          <label class="loss-honeypot" aria-hidden="true">
            {isEnglish ? "Leave this field empty" : "Bu alanı boş bırakın"}
            <input type="text" name="_gotcha" tabIndex={-1} autocomplete="off" />
          </label>
          <fieldset class="loss-kind loss-field-wide">
            <legend>{copy.kind}</legend>
            <label>
              <input
                type="radio"
                name="bildirimTuru"
                value={isEnglish ? "Lost" : "Kayıp"}
                checked
              />
              <span>{copy.lost}</span>
            </label>
            <label>
              <input type="radio" name="bildirimTuru" value={isEnglish ? "Found" : "Buluntu"} />
              <span>{copy.found}</span>
            </label>
          </fieldset>
          <label class="loss-field loss-field-wide">
            <span data-loss-main-label>{copy.what}</span>
            <textarea name="bildirim" rows={3} required></textarea>
          </label>
          <label class="loss-field">
            <span data-loss-place-label>{copy.where}</span>
            <input type="text" name="yer" />
          </label>
          <label class="loss-field">
            <span>{copy.when}</span>
            <input type="text" name="zaman" placeholder={copy.whenPlaceholder} />
          </label>
          <label class="loss-field loss-field-wide">
            <span>
              {copy.name} <small>({copy.optional})</small>
            </span>
            <input type="text" name="isim" />
          </label>
          <label class="loss-anonymous">
            <input type="checkbox" name="isimsiz" checked />
            <span>{copy.anonymous}</span>
          </label>
          <button class="loss-submit" type="submit">
            <span class="loss-submit-idle">{copy.submit}</span>
            <span class="loss-submit-busy">{copy.submitting}</span>
          </button>
          <p class="loss-form-status loss-field-wide" role="status" aria-live="polite"></p>
        </form>
      </section>
    </>
  )
}

type StoryLink = {
  slug: string
  title: string
  section: number
}

function getStories(
  allFiles: QuartzComponentProps["allFiles"],
  isEnglish: boolean,
): StoryLink[] {
  return allFiles
    .filter((file) => {
      const isStory = file.frontmatter?.pageType === "story"
      const fileIsEnglish = file.frontmatter?.lang === "en"
      return isStory && fileIsEnglish === isEnglish
    })
    .map((file) => {
      const title = String(file.frontmatter?.title ?? file.slug ?? "Bura")
      const sectionFromTitle = title.match(/^\s*(\d+)/)?.[1]
      return {
        slug: String(file.slug ?? ""),
        title,
        section: Number(file.frontmatter?.bolum ?? sectionFromTitle ?? Number.MAX_SAFE_INTEGER),
      }
    })
    .filter((story) => story.slug)
    .sort((a, b) => a.section - b.section || a.title.localeCompare(b.title))
}

const HomepageStories: QuartzComponent = ({ allFiles }) => {
  const stories = getStories(allFiles, false)
  return (
    <nav class="homepage-stories" aria-label="Metinler">
      <ul>
        {stories.map((story) => (
          <li>
            <a href={`/${story.slug}`}>{story.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const TasmaSky: QuartzComponent = () => {
  return (
    <main class="tasma-landing" aria-labelledby="tasma-title">
      <a class="tasma-home-link" href="/" aria-label="Bura ana sayfasına dön">← Ana sayfa</a>
      <header class="tasma-intro">
        <h1 id="tasma-title">Taşma</h1>
        <p>Bazı yazılar nereye ait olduklarını bilmiyor.</p>
        <p>Onlar için bir gökyüzü açtık. Yazılmış ve henüz yazılmamış metinlerden oluşan bir gökyüzü.</p>
        <p class="tasma-intro-instruction">Parlak bir yıldıza dokun.</p>
      </header>
      <figure class="tasma-constellation">
        <svg class="tasma-sky" viewBox="0 0 1200 1020" aria-labelledby="tasma-sky-title tasma-sky-desc">
          <title id="tasma-sky-title">Taşma gökyüzü</title>
          <desc id="tasma-sky-desc">Takımyıldızları arasındaki parlak Polaris yıldızı yayımlanmış bir metne bağlıdır.</desc>
          <g class="tasma-background-stars" aria-hidden="true">
            {TASMA_BACKGROUND_STARS.map((star) => (
              <circle cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />
            ))}
          </g>
          {TASMA_CONSTELLATIONS.map((constellation) => {
            const stars = new Map(constellation.stars.map((star) => [star.id, star]))
            return (
              <g class={`tasma-constellation-group tasma-${constellation.id}`}>
                <g class="tasma-lines" aria-hidden="true">
                  {constellation.lines.map(([from, to]) => {
                    const a = stars.get(from)!
                    const b = stars.get(to)!
                    return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                  })}
                </g>
                <g class="tasma-stars">
                  {constellation.stars.map((star) => {
                    const radius = star.radius ?? 4
                    const point = <circle cx={star.x} cy={star.y} r={radius} />
                    return star.href ? (
                      <a class="tasma-star tasma-star-published" href={star.href} aria-label={`${star.name}: metni oku`}>
                        <circle class="tasma-star-halo" cx={star.x} cy={star.y} r={radius + 15} />
                        {point}
                      </a>
                    ) : (
                      <g class="tasma-star tasma-star-dim" aria-label="Henüz yazılmadı">{point}</g>
                    )
                  })}
                </g>
                <text class="tasma-constellation-label" x={constellation.labelX} y={constellation.labelY}>{constellation.label}</text>
              </g>
            )
          })}
        </svg>
      </figure>
    </main>
  )
}
const TasmaText: QuartzComponent = ({ ctx }) => {
  const siteBasePath = ctx.argv.serve || !ctx.cfg.configuration.baseUrl
    ? ""
    : new URL(`https://${ctx.cfg.configuration.baseUrl}`).pathname.replace(/\/$/, "")
  return (
    <main class="tasma-experience" data-tasma-experience>
      <a href="#tasma-flow" class="tasma-skip" id="tasma-skip" role="button">
        Düz metin için Enter'a basın
      </a>
      <a class="tasma-back" href="/tasma/" aria-label="Taşma gökyüzüne dön">Taşma'ya dön</a>
      <div class="tasma-top">
        <div class="tasma-photo" id="tasma-photo" role="img" aria-label="Akşam ışığında, dağlarla çevrili bir göl">
          <img class="tasma-image" id="tasma-image" src={`${siteBasePath}/static/tasma/polaris-gol.jpg`} alt="" aria-hidden="true" />
        </div>
        <div class="tasma-groove" id="tasma-groove">
          <div class="tasma-ring" id="tasma-ring" tabIndex={0} role="slider" aria-label="Fotoğrafı ve metni aç" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <defs><filter id="tasma-chalk" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6"/></filter></defs>
              <g fill="none" stroke="#e6b422" stroke-linecap="round" filter="url(#tasma-chalk)"><path d="M25 5C36 4 45 13 44 24C43 36 34 45 23 44C12 43 3 35 4 23C5 12 14 6 27 5C33 5 38 8 40 12" stroke-width="3.6"/><path d="M22 7C12 9 6 17 6 25C6 35 14 42 24 42" stroke-width="1.8" opacity=".55"/></g>
            </svg>
          </div>
          <div class="tasma-countdown" id="tasma-countdown" aria-hidden="true"></div>
        </div>
      </div>
      <div class="tasma-dock"></div>
      <article class="tasma-flow" id="tasma-flow" tabIndex={-1} aria-label="Başlıksız metin"></article>
      <footer class="tasma-text-footer"><a href="/">[.] Bura</a></footer>
    </main>
  )
}

const StoryNext: QuartzComponent = ({ fileData, allFiles }) => {
  const isEnglish = fileData.frontmatter?.lang === "en"
  const order = getStories(allFiles, isEnglish)
  const index = order.findIndex((story) => story.slug === fileData.slug)
  if (index < 0) return null
  const next = order[index + 1]

  return (
    <nav class="story-next" aria-label={isEnglish ? "Continue reading" : "Okumaya devam et"}>
      <span>
        {next
          ? isEnglish
            ? "NEXT"
            : "SIRADAKİ"
          : isEnglish
            ? "BACK TO THE BEGINNING"
            : "BAŞA DÖN"}
      </span>
      <a href={next ? `/${next.slug}` : isEnglish ? "/en/" : "/"}>
        {next ? `${next.title} →` : "[.] →"}
      </a>
    </nav>
  )
}

function SharePanel({
  title,
  url,
  isEnglish,
  compact = false,
}: {
  title: string
  url?: string
  isEnglish: boolean
  compact?: boolean
}) {
  return (
    <div
      class={`hand-to-hand${compact ? " hand-to-hand-compact" : ""}`}
      data-share-title={title}
      data-share-url={url}
    >
      <button
        type="button"
        class="hand-to-hand-button"
        aria-expanded="false"
      >
        <span>{isEnglish ? "Pass it on" : "Elden ele"}</span>
        <span aria-hidden="true">↗</span>
      </button>
      <div class="hand-to-hand-menu" role="dialog" aria-modal="true" hidden>
        <header class="hand-to-hand-menu-head">
          <div>
            <strong>{isEnglish ? "Pass it on" : "Elden ele"}</strong>
            <span>{isEnglish ? "Where would you like to share it?" : "Nerede paylaşmak istersiniz?"}</span>
          </div>
          <button type="button" class="hand-to-hand-close" aria-label={isEnglish ? "Close" : "Kapat"}>×</button>
        </header>
        <div class="hand-to-hand-options">
        <a href="#" data-share-network="facebook" target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a href="#" data-share-network="x" target="_blank" rel="noopener noreferrer">
          X
        </a>
        <a href="#" data-share-network="bluesky" target="_blank" rel="noopener noreferrer">
          Bluesky
        </a>
        <a href="#" data-share-network="mastodon" target="_blank" rel="noopener noreferrer">
          Mastodon
        </a>
        <a href="#" data-share-network="whatsapp" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <button type="button" data-share-network="instagram">
          {isEnglish ? "Instagram / Stories" : "Instagram / Hikâyeler"}
        </button>
        <button type="button" data-share-network="native">
          {isEnglish ? "Other…" : "Diğer…"}
        </button>
        <button type="button" data-share-network="copy">
          {isEnglish ? "Copy link" : "Bağlantıyı kopyala"}
        </button>
        </div>
      </div>
      <span class="hand-to-hand-status" aria-live="polite"></span>
    </div>
  )
}

const HandToHand: QuartzComponent = ({ fileData }) => {
  const isEnglish = fileData.frontmatter?.lang === "en"
  const title = String(fileData.frontmatter?.title ?? "Bura")
  return <SharePanel title={title} isEnglish={isEnglish} />
}

const SingleLossRecord: QuartzComponent = ({ fileData }) => {
  const data = fileData.frontmatter as Record<string, unknown> | undefined
  const number = Number(data?.kayit ?? 0)
  if (number <= 0) return null

  const isEnglish = data?.lang === "en"
  const recordLabel = isEnglish ? "RECORD" : "KAYIT"
  const locationLabel = isEnglish ? "Last seen" : "Bulunduğu yer"
  const outcomeLabel = isEnglish ? "OUTCOME" : "İŞLEM"
  const category = String(data?.kategori ?? "")
  const title = String(data?.title ?? "Bura")
  const location = String(data?.bulunduguYer ?? "")
  const outcome = String(data?.islem ?? "")

  return (
    <section class="loss-record single-loss-record">
      <header class="loss-record-head">
        {recordLabel} {String(number).padStart(3, "0")}
        {category && ` / ${category.toLocaleUpperCase(isEnglish ? "en-US" : "tr-TR")}`}
      </header>
      <p class="loss-location">
        <span>{locationLabel}</span>
        {location}
      </p>
      <footer class="loss-outcome">
        <span>{outcomeLabel}</span>
        <p>{outcome}</p>
      </footer>
      <SharePanel
        title={`${recordLabel} ${String(number).padStart(3, "0")} — ${title}`}
        url={`/${fileData.slug}`}
        isEnglish={isEnglish}
        compact
      />
    </section>
  )
}

const headerRegex = new RegExp(/h[1-6]/)
export function pageResources(
  baseDir: FullSlug | RelativeURL,
  staticResources: StaticResources,
  ctx?: BuildCtx,
): StaticResources {
  const hashedNames = ctx?.hashedResourceNames
  const cssFile = hashedNames?.["index.css"] ?? "index.css?v=20260924-cloud-machine"
  const prescriptFile = hashedNames?.["prescript.js"] ?? "prescript.js"
  const postscriptFile = hashedNames?.["postscript.js"] ?? "postscript.js"

  const componentCssResources: CSSResource[] = []
  if (ctx?.componentCssMap) {
    const seen = new Set<string>()
    for (const filename of ctx.componentCssMap.values()) {
      if (seen.has(filename)) continue
      seen.add(filename)
      componentCssResources.push({ content: joinSegments(baseDir, filename) })
    }
  }

  const extracted = ctx?.extractedInlineResources
  const resolvedCss: CSSResource[] = staticResources.css.map((resource) => {
    if (!(resource.inline ?? false) || !extracted) return resource
    const filename = extracted.get(resource.content)
    if (!filename) return resource
    return { content: joinSegments(baseDir, filename) }
  })

  const resolvedJs: JSResource[] = staticResources.js.map((resource) => {
    if (resource.contentType !== "inline" || !extracted) return resource
    const filename = extracted.get(resource.script)
    if (!filename) return resource
    return {
      src: joinSegments(baseDir, filename),
      loadTime: resource.loadTime,
      contentType: "external" as const,
      moduleType: resource.moduleType,
      spaPreserve: resource.spaPreserve,
    }
  })

  const contentIndexPath = joinSegments(baseDir, "static/contentIndex.json")
  const contentIndexScript = `const fetchData = fetch("${contentIndexPath}").then(data => data.json())`

  const resources: StaticResources = {
    css: [
      {
        content: joinSegments(baseDir, cssFile),
      },
      ...componentCssResources,
      ...resolvedCss,
    ],
    js: [
      {
        src: joinSegments(baseDir, prescriptFile),
        loadTime: "beforeDOMReady",
        contentType: "external",
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: contentIndexScript,
      },
      ...resolvedJs,
    ],
    additionalHead: staticResources.additionalHead,
  }

  resources.js.push({
    src: joinSegments(baseDir, postscriptFile),
    loadTime: "afterDOMReady",
    moduleType: "module",
    contentType: "external",
  })

  return resources
}

/** @internal Exported for testing only. */
export function renderTranscludes(
  root: Root,
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  visited: Set<FullSlug>,
) {
  // Walk the tree manually instead of using visit() so we can track the
  // ancestor chain for cycle detection. visit() runs the callback before
  // descending into replaced children, so a Set-based guard there falsely
  // rejects sibling transclusions of the same target.
  function walk(node: Element | Root) {
    const children = (node as Root).children ?? []
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child?.type !== "element") continue
      const el = child as Element

      if (el.tagName !== "blockquote") {
        walk(el)
        continue
      }

      const classNames = (el.properties?.className ?? []) as string[]
      if (!classNames.includes("transclude")) {
        walk(el)
        continue
      }

      const inner = el.children[0] as Element
      const transcludeTarget = (inner.properties["data-slug"] ?? slug) as FullSlug
      if (visited.has(transcludeTarget)) {
        console.warn(
          styleText(
            "yellow",
            `Warning: Skipping circular transclusion: ${slug} -> ${transcludeTarget}`,
          ),
        )
        el.children = [
          {
            type: "element",
            tagName: "p",
            properties: { style: "color: var(--secondary);" },
            children: [
              {
                type: "text",
                value: `Circular transclusion detected: ${transcludeTarget}`,
              },
            ],
          },
        ]
        continue
      }

      visited.add(transcludeTarget)

      let page = componentData.allFiles.find((f) => f.slug === transcludeTarget)
      if (!page) {
        const dotIdx = transcludeTarget.lastIndexOf(".")
        const slashIdx = transcludeTarget.lastIndexOf("/")
        if (dotIdx > slashIdx + 1) {
          const stripped = transcludeTarget.slice(0, dotIdx) as FullSlug
          page = componentData.allFiles.findLast((f) => f.slug === stripped)
        }
      }
      if (!page) {
        visited.delete(transcludeTarget)
        continue
      }

      let blockRef = el.properties.dataBlock as string | undefined
      if (blockRef?.startsWith("#^")) {
        // block transclude
        blockRef = blockRef.slice("#^".length)
        let blockNode = page.blocks?.[blockRef]
        if (blockNode) {
          if (blockNode.tagName === "li") {
            blockNode = {
              type: "element",
              tagName: "ul",
              properties: {},
              children: [blockNode],
            }
          }

          el.children = [
            normalizeHastElement(blockNode, slug, transcludeTarget),
            {
              type: "element",
              tagName: "a",
              properties: {
                href: inner.properties?.href,
                class: ["internal", "internal-link", "transclude-src"],
              },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        }
      } else if (blockRef?.startsWith("#") && page.htmlAst) {
        // header transclude
        blockRef = blockRef.slice(1)
        let startIdx = undefined
        let startDepth = undefined
        let endIdx = undefined
        for (const [i, htmlEl] of page.htmlAst.children.entries()) {
          if (!(htmlEl.type === "element" && htmlEl.tagName.match(headerRegex))) continue
          const depth = Number(htmlEl.tagName.substring(1))

          if (startIdx === undefined || startDepth === undefined) {
            if (htmlEl.properties?.id === blockRef) {
              startIdx = i
              startDepth = depth
            }
          } else if (depth <= startDepth) {
            endIdx = i
            break
          }
        }

        if (startIdx === undefined) {
          visited.delete(transcludeTarget)
          continue
        }

        el.children = [
          ...(page.htmlAst.children.slice(startIdx, endIdx) as ElementContent[]).map((c) =>
            normalizeHastElement(c as Element, slug, transcludeTarget),
          ),
          {
            type: "element",
            tagName: "a",
            properties: {
              href: inner.properties?.href,
              class: ["internal", "internal-link", "transclude-src"],
            },
            children: [
              { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
            ],
          },
        ]
      } else if (page.htmlAst) {
        // page transclude
        el.children = [
          {
            type: "element",
            tagName: "h1",
            properties: {},
            children: [
              {
                type: "text",
                value:
                  page.frontmatter?.title ??
                  i18n(cfg.locale).components.transcludes.transcludeOf({
                    targetSlug: page.slug!,
                  }),
              },
            ],
          },
          ...(page.htmlAst.children as ElementContent[]).map((c) =>
            normalizeHastElement(c as Element, slug, transcludeTarget),
          ),
          {
            type: "element",
            tagName: "a",
            properties: {
              href: inner.properties?.href,
              class: ["internal", "internal-link", "transclude-src"],
            },
            children: [
              { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
            ],
          },
        ]
      }

      // Recurse into the replaced children to resolve nested transclusions,
      // then remove from visited so sibling embeds of the same target work.
      walk(el)
      visited.delete(transcludeTarget)
    }
  }

  walk(root)
}

export function renderPage(
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  components: RenderComponents,
  pageResources: StaticResources,
  treeTransforms?: TreeTransform[],
): string {
  // make a deep copy of the tree so we don't remove the transclusion references
  // for the file cached in contentMap in build.ts
  const root = clone(componentData.tree) as Root
  const visited = new Set<FullSlug>([slug])
  renderTranscludes(root, cfg, slug, componentData, visited)

  // Run plugin-provided tree transforms (e.g. resolving inline bases codeblocks)
  if (treeTransforms) {
    for (const transform of treeTransforms) {
      transform(root, slug, componentData)
    }
  }

  // set componentData.tree to the edited html that has transclusions rendered
  componentData.tree = root

  const {
    head: Head,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer,
    frame: frameName,
  } = components
  const Body = BodyConstructor()
  const frame = resolveFrame(frameName)

  const lang = componentData.fileData.frontmatter?.lang ?? cfg.locale?.split("-")[0] ?? "en"
  const direction = i18n(cfg.locale).direction ?? "ltr"
  // During local dev (--serve), the dev server serves from root without the
  // baseUrl subpath, so basePath must be empty to avoid broken links.
  const basePath =
    componentData.ctx.argv.serve || !cfg.baseUrl
      ? ""
      : new URL(`https://${cfg.baseUrl}`).pathname.replace(/\/$/, "")
  const isEnglish = componentData.fileData.frontmatter?.lang === "en"
  const lossPrefix = isEnglish ? "en/lost-property/" : "kayip-burosu/"
  const lossRecords = getLossRecords(componentData.allFiles, lossPrefix)
  const isLossOffice = componentData.fileData.frontmatter?.pageType === "loss-office"
  const isLossRecordPage = Number(componentData.fileData.frontmatter?.kayit ?? 0) > 0
  const pageType =
    componentData.fileData.frontmatter?.pageType ?? (isLossRecordPage ? "loss-record" : undefined)
  const hasHandToHand =
    componentData.fileData.frontmatter?.pageType === "story" ||
    componentData.fileData.slug === "buraya-dair/index" ||
    componentData.fileData.slug === "en/on-bura/index"
  const isHomepage = componentData.fileData.slug === "index"
  const isTasmaSky = pageType === "tasma-sky"
  const isTasmaText = pageType === "tasma-text"
  const isTasma = isTasmaSky || isTasmaText
  const PageContent = isTasmaSky ? TasmaSky : isTasmaText ? TasmaText : Content
  const resolvedBeforeBody = isHomepage
    ? [...beforeBody, HomepageStories]
    : hasHandToHand
      ? [...beforeBody, HandToHand]
      : beforeBody
  const resolvedAfterBody = isLossOffice
    ? [LossRecords, ...afterBody]
    : isLossRecordPage
      ? [SingleLossRecord, ...afterBody]
      : componentData.fileData.frontmatter?.pageType === "story"
      ? [HandToHand, StoryNext, ...afterBody]
      : hasHandToHand
        ? [HandToHand, ...afterBody]
        : afterBody
  const doc = (
    <html lang={lang} dir={direction}>
      <Head {...componentData} />
      <body
        data-slug={slug}
        data-basepath={basePath}
        data-page-type={pageType}
        data-page-lang={lang}
      >
        <div id="bura-loss-records-data" hidden>
          {lossRecords.map((record) => (
            <span
              data-number={String(record.number).padStart(3, "0")}
              data-category={record.category}
              data-title={record.title}
              data-location={record.location}
            ></span>
          ))}
        </div>
        {!isTasma && <span
          class="free-cloud-layer"
          data-free-cloud-layer
          data-cloud-asset-base={`${basePath}/static/bulutlar`}
          aria-hidden="true"
        ></span>}
        {!isTasma && <aside
          class="bura-weather"
          aria-label={isEnglish ? "Bura — fictional weather report" : "Bura — kurmaca hava raporu"}
        >
          <span class="bura-weather-label">
            {isEnglish ? "Weather in Bura:" : "Bura'nın hava durumu:"}
          </span>
          <span
            class="weather-window"
            tabIndex={0}
            aria-label={
              isEnglish ? "Class conflict in the air today." : "Bugün hava sınıf çatışmalı."
            }
          >
            <span class="weather-track" aria-hidden="true">
              {isEnglish ? "Class conflict in the air today." : "Bugün hava sınıf çatışmalı."}
            </span>
          </span>
          <span
            class="cloud-machine-layer"
            data-cloud-layer
            data-cloud-asset-base={`${basePath}/static/bulutlar`}
            aria-hidden="true"
          ></span>
          <button
            class="cloud-machine"
            type="button"
            data-cloud-machine
            data-cloud-button
            aria-label={isEnglish ? "Make a cloud" : "Bulut üret"}
          >
            <img
              class="cloud-machine-image"
              src={`${basePath}/static/bulut-yapma-makinesi.png`}
              alt=""
              aria-hidden="true"
            />
            <span class="cloud-machine-indicator" aria-hidden="true"></span>
            <span class="cloud-machine-red-button" aria-hidden="true"></span>
            <span class="cloud-machine-instruction" aria-hidden="true">
              <span>BULUT</span>
              <span>YAP</span>
            </span>
          </button>
          <span
            class="cloud-machine-status"
            data-cloud-status
            role="status"
            aria-live="polite"
          ></span>
        </aside>}
        {!isTasma && !isLossOffice && (
          <a
            class="bura-corner-stamp"
            href={`${basePath}/${isEnglish ? "en/lost-property" : "kayip-burosu"}/`}
          >
            <span class="bura-corner-stamp-tab">
              {isEnglish ? "Lost Property" : "Kayıp Bürosu"}
            </span>
            <span class="bura-corner-stamp-body">
              <span class="bura-corner-stamp-kayit" data-kayit>
                {isEnglish ? "RECORD" : "KAYIT"}
              </span>
              <span class="bura-corner-stamp-title" data-title>
                {isEnglish ? "Last seen: —" : "Bulunduğu yer: —"}
              </span>
              <span class="bura-corner-stamp-desc" data-desc></span>
              <span class="bura-corner-stamp-cta">
                {isEnglish ? "read more →" : "devamını oku →"}
              </span>
            </span>
          </a>
        )}
        {frame.css && <style dangerouslySetInnerHTML={{ __html: frame.css }} />}
        <div id="quartz-root" class="page" data-frame={frame.name}>
          <Body {...componentData}>
            {[
              frame.render({
                componentData,
                head: Head,
                header: isTasma ? [] : header,
                beforeBody: isTasma ? [] : resolvedBeforeBody,
                pageBody: PageContent,
                afterBody: isTasma ? [] : resolvedAfterBody,
                left: isTasma ? [] : left,
                right: isTasma ? [] : right,
                footer: isTasma ? [] : footer,
              }),
            ]}
          </Body>
        </div>
      </body>
      {pageResources.js
        .filter((resource) => resource.loadTime === "afterDOMReady")
        .map((res) => JSResourceToScriptElement(res, true))}
    </html>
  )

  return "<!DOCTYPE html>\n" + render(doc)
}

