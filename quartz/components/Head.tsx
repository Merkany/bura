import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot, simplifySlug } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"

export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const visibleTitle = fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
    const title = String(fileData.frontmatter?.seoTitle ?? visibleTitle) + titleSuffix
    const isTasmaText = fileData.frontmatter?.pageType === "tasma-text"
    const publicName = isTasmaText
      ? String(fileData.frontmatter?.seoTitle ?? "Taşma — Bura")
      : String(visibleTitle)
    const lossRecordDescription = fileData.frontmatter?.kayit
      ? [
          `Kayıp Bürosu / ${String(fileData.frontmatter.kayit).padStart(3, "0")}`,
          fileData.frontmatter.kategori,
          fileData.frontmatter.bulunduguYer,
          fileData.frontmatter.islem,
        ]
          .filter(Boolean)
          .join(" · ")
      : undefined
    const description =
      lossRecordDescription ??
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")
    const siteBasePath = ctx.argv.serve || !cfg.baseUrl ? "" : url.pathname.replace(/\/$/, "")
    const staticPath = (file: string) => `${siteBasePath}/static/${file}`

    // Url of current page
    const publicSlug = fileData.slug === "404" ? "404" : simplifySlug(fileData.slug!)
    const socialUrl = new URL(publicSlug, `${url.toString().replace(/\/$/, "")}/`).toString()
    const siteUrl = new URL("/", url).toString()
    const personId = `${siteUrl}#merkan-aksoydan`
    const websiteId = `${siteUrl}#bura`
    const person = {
      "@type": "Person",
      "@id": personId,
      name: "Merkan Aksoydan",
      url: new URL("buraya-dair/", siteUrl).toString(),
    }
    const website = {
      "@type": "WebSite",
      "@id": websiteId,
      name: "Bura",
      url: siteUrl,
      creator: { "@id": personId },
      inLanguage: ["tr", "en"],
    }
    const identitySlug = publicSlug.replace(/\/$/, "")
    const pageType =
      identitySlug === ""
        ? "WebPage"
        : identitySlug === "buraya-dair"
          ? "AboutPage"
          : fileData.frontmatter?.pageType === "story" || fileData.frontmatter?.kayit
            ? "CreativeWork"
            : "WebPage"
    const pageData = {
      "@type": pageType,
      "@id": `${socialUrl}#page`,
      url: socialUrl,
      name: publicName,
      description,
      isPartOf: { "@id": websiteId },
      ...(pageType === "CreativeWork" ? { author: { "@id": personId } } : {}),
      ...(pageType === "AboutPage" ? { about: { "@id": websiteId } } : {}),
    }
    const structuredData = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [person, website, pageData],
    }).replace(/</g, "\\u003c")

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some((e) => e.name === "CustomOgImages")
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    const coreStylesheet = css[0]?.content
    const coreScript = js.find(
      (r) => r.loadTime === "beforeDOMReady" && r.contentType === "external",
    )

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {coreStylesheet && <link rel="preload" href={coreStylesheet} as="style" />}
        {coreScript && coreScript.contentType === "external" && (
          <link rel="preload" href={coreScript.src} as="script" />
        )}
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <script defer src={staticPath("insan-misin/overlay.js")}></script>
        <script defer src={`${staticPath("bura-corner.js")}?v=20260917-records`}></script>
        <script defer src={`${staticPath("story-ui.js")}?v=20261001-canonical-share-1`}></script>
        <script defer src={`${staticPath("loss-records.js")}?v=20260917-found`}></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
            {fileData.slug !== "404" && <link rel="canonical" href={socialUrl} />}
          </>
        )}

        <link rel="icon" href={iconPath} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Bura — yeni metinler ve Kayıp Bürosu"
          href={`${siteBasePath}/bura-akis.xml`}
        />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
