;(function () {
  function initialiseStoryPage() {
    if (!document.body) return

    document.querySelectorAll(".hand-to-hand-button").forEach(function (button) {
      if (button.dataset.shareReady === "true") return
      button.dataset.shareReady = "true"
      button.addEventListener("click", async function () {
        var wrapper = button.closest(".hand-to-hand")
        var status = wrapper && wrapper.querySelector(".hand-to-hand-status")
        var title = (wrapper && wrapper.dataset.shareTitle) || document.title
        var url = window.location.href.split("#")[0]
        try {
          if (navigator.share) {
            await navigator.share({ title: title, url: url })
            if (status) status.textContent = ""
          } else {
            await navigator.clipboard.writeText(url)
            if (status)
              status.textContent =
                document.documentElement.lang === "en" ? "Link copied." : "Bağlantı kopyalandı."
          }
        } catch (error) {
          if (error && error.name === "AbortError") return
          if (status)
            status.textContent =
              document.documentElement.lang === "en"
                ? "The link could not be copied."
                : "Bağlantı kopyalanamadı."
        }
      })
    })

    if (document.body.dataset.pageType !== "story") return

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
