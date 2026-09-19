(function () {
  // Explorer eklentisi, görüntülenen sayfanın kendi klasörünü (o klasörün
  // "atası" kendisi olduğu için) her zaman otomatik açık gösteriyor. Yaprak
  // (dosya) sayfalarında bu göze batmıyor çünkü genelde açılacak bir klasör
  // yok; ama "Bura'ya dair" gibi alt sayfaları olan klasör sayfalarında
  // kendi içeriği baştan dökülmüş halde görünüyor. Bunu, sadece o sayfanın
  // kendi klasörünü tekrar kapatarak, yaprak sayfalardaki temiz görünüme
  // eşitliyoruz. Diğer atalar (kullanıcı nerede olduğunu görsün diye) açık
  // kalmaya devam ediyor.
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

  function scheduleCollapse() {
    // Explorer kendi ağacını "nav"/"render" olayında asenkron kuruyor;
    // bir sonraki tick'e bırakmak, DOM'un hazır olmasını garantiliyor.
    window.setTimeout(collapseCurrentFolder, 0);
  }

  document.addEventListener("nav", scheduleCollapse);
  document.addEventListener("render", scheduleCollapse);
  scheduleCollapse();
})();
