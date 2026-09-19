;(function () {
  function initialiseStoryPage() {
    if (!document.body) return

    document.querySelectorAll(".hand-to-hand-button").forEach(function (button) {
      if (button.dataset.shareReady === "true") return
      button.dataset.shareReady = "true"
      button.addEventListener("click", function () {
        var wrapper = button.closest(".hand-to-hand")
        var menu = wrapper && wrapper.querySelector(".hand-to-hand-menu")
        if (!menu) return
        var willOpen = menu.hidden
        menu.hidden = !willOpen
        button.setAttribute("aria-expanded", willOpen ? "true" : "false")
      })
    })

    document.querySelectorAll(".hand-to-hand").forEach(function (wrapper) {
      if (wrapper.dataset.menuReady === "true") return
      wrapper.dataset.menuReady = "true"
      var title = wrapper.dataset.shareTitle || document.title
      var url = window.location.href.split("#")[0]
      var text = title + " — Bura"
      var encodedUrl = encodeURIComponent(url)
      var encodedText = encodeURIComponent(text)
      var targets = {
        facebook: "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl,
        x: "https://twitter.com/intent/tweet?text=" + encodedText + "&url=" + encodedUrl,
        bluesky: "https://bsky.app/intent/compose?text=" + encodeURIComponent(text + " " + url),
        mastodon: "https://mastodonshare.com/?text=" + encodeURIComponent(text + " " + url),
        whatsapp: "https://wa.me/?text=" + encodeURIComponent(text + " " + url),
      }

      Object.keys(targets).forEach(function (network) {
        var link = wrapper.querySelector('[data-share-network="' + network + '"]')
        if (link) link.setAttribute("href", targets[network])
      })

      wrapper.querySelectorAll("button[data-share-network]").forEach(function (item) {
        item.addEventListener("click", async function () {
          var network = item.dataset.shareNetwork
          var status = wrapper.querySelector(".hand-to-hand-status")
          try {
            if ((network === "native" || network === "instagram") && navigator.share) {
              await navigator.share({ title: title, text: text, url: url })
              if (status) status.textContent = ""
            } else {
              await navigator.clipboard.writeText(url)
              if (status) {
                status.textContent =
                  network === "instagram"
                    ? document.documentElement.lang === "en"
                      ? "Link copied. You can add it to your story."
                      : "Bağlantı kopyalandı. Hikâyenize ekleyebilirsiniz."
                    : document.documentElement.lang === "en"
                      ? "Link copied."
                      : "Bağlantı kopyalandı."
              }
            }
          } catch (error) {
            if (error && error.name === "AbortError") return
            if (status)
              status.textContent =
                document.documentElement.lang === "en"
                  ? "The link could not be shared."
                  : "Bağlantı paylaşılamadı."
          }
        })
      })
    })

    var slug = document.body.dataset.slug || ""
    var shouldCollapseExplorer =
      document.body.dataset.pageType === "story" ||
      document.body.dataset.pageLang === "en" ||
      slug === "buraya-dair/index"

    if (!shouldCollapseExplorer) return

    document.querySelectorAll(".explorer").forEach(function (explorer) {
      explorer.classList.add("collapsed")
      explorer.setAttribute("aria-expanded", "false")
      explorer.querySelectorAll(".explorer-toggle").forEach(function (toggle) {
        toggle.setAttribute("aria-expanded", "false")
        if (toggle.dataset.storyToggleReady === "true") return
        toggle.dataset.storyToggleReady = "true"
        toggle.addEventListener("click", function () {
          var willOpen = explorer.classList.contains("collapsed")
          toggle.setAttribute("aria-expanded", willOpen ? "true" : "false")
        })
      })
    })
  }

  document.addEventListener("nav", initialiseStoryPage)
  initialiseStoryPage()
})()
