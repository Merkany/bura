(function () {
  // Explorer eklentisi, görüntülenen sayfanın kendi klasörünü (o klasörün
  // "atası" kendisi olduğu için) her zaman otomatik açık gösteriyor. Yaprak
  // (dosya) sayfalarında bu göze batmıyor çünkü genelde açılacak bir klasör
  // yok; ama "Bura'ya dair" gibi alt sayfaları olan klasör sayfalarında
  // kendi içeriği baştan dökülmüş halde görünüyor. Bunu, sadece o sayfanın
  // kendi klasörünü tekrar kapatarak, yaprak sayfalardaki temiz görünüme
  // eşitliyoruz. Diğer atalar (kullanıcı nerede olduğunu görsün diye) açık
  // kalmaya devam ediyor.
  //
  // Explorer kendi ağacını "nav"/"render" olayında ASENKRON (fetch + await)
  // kuruyor, bu yüzden sabit bir setTimeout güvenilir değil: DOM henüz
  // oluşmamışken çalışıp hiçbir şey bulamayabiliyor. Bunun yerine
  // MutationObserver ile .explorer içindeki değişiklikleri izleyip, ilgili
  // düğüm göründüğü anda kapatıyoruz.

  function collapseCurrentFolder() {
    var currentSlug = document.body && document.body.dataset ? document.body.dataset.slug : "";
    if (!currentSlug) return;

    document.querySelectorAll(".explorer .folder-container[data-folderpath]").forEach(function (container) {
      if (container.dataset.folderpath !== currentSlug) return;
      var outer = container.nextElementSibling;
      if (outer && outer.classList && outer.classList.contains("open")) {
        outer.classList.remove("open");
      }
    });
  }

  var observer = null;

  function observeExplorers() {
    if (observer) observer.disconnect();
    var explorers = document.querySelectorAll(".explorer");
    if (!explorers.length) return;
    observer = new MutationObserver(function () {
      collapseCurrentFolder();
    });
    explorers.forEach(function (exp) {
      observer.observe(exp, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    });
  }

  function onNav() {
    collapseCurrentFolder();
    observeExplorers();
    // Fetch + render is async; a few delayed passes cover slow loads too.
    [0, 50, 150, 400, 900].forEach(function (delay) {
      window.setTimeout(collapseCurrentFolder, delay);
    });
  }

  document.addEventListener("nav", onNav);
  document.addEventListener("render", onNav);
  onNav();
})();
