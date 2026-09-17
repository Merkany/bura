(function () {
  function getRecords() {
    return Array.from(document.querySelectorAll("#bura-loss-records-data > span")).map(function (item) {
      var category = item.dataset.category ? " / " + item.dataset.category.toLocaleUpperCase("tr-TR") : "";
      return {
        kayit: "KAYIT " + item.dataset.number + category,
        title: "Bulunduğu yer: " + item.dataset.location,
        desc: item.dataset.title,
      };
    });
  }

  var PULSED_KEY = "bura-corner-pulsed";

  function hasPulsedThisSession() {
    try {
      return sessionStorage.getItem(PULSED_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function markPulsed() {
    try {
      sessionStorage.setItem(PULSED_KEY, "1");
    } catch (e) {}
  }

  function applyRandomRecord() {
    var stamp = document.querySelector(".bura-corner-stamp");
    if (!stamp) return;
    var records = getRecords();
    if (!records.length) return;
    var record = records[Math.floor(Math.random() * records.length)];
    var kayitEl = stamp.querySelector("[data-kayit]");
    var titleEl = stamp.querySelector("[data-title]");
    var descEl = stamp.querySelector("[data-desc]");
    if (kayitEl) kayitEl.textContent = record.kayit;
    if (titleEl) titleEl.textContent = record.title;
    if (descEl) descEl.textContent = record.desc;

    // Damga vuruşu yalnızca oturum başına bir kez oynar: ilk görüşte
    // güçlü bir izlenim bırakır, sonraki her sayfa geçişinde tekrar
    // "vurup" reklam gibi sıradanlaşmaz — içerik yine de sessizce değişir.
    if (hasPulsedThisSession()) return;
    markPulsed();

    // Sayfa açılır açılmaz değil, kısa bir sessizlikten sonra vursun —
    // böylece kasıtlı ve fark edilir bir an gibi hissettiriyor, sayfa
    // yüklenme gürültüsüne karışmıyor.
    window.clearTimeout(stamp._buraPulseDelay);
    stamp._buraPulseDelay = window.setTimeout(function () {
      stamp.classList.remove("bura-corner-pulse");
      // reflow, animasyonu tetiklemek için
      void stamp.offsetWidth;
      stamp.classList.add("bura-corner-pulse");
      window.clearTimeout(stamp._buraPulseTimer);
      stamp._buraPulseTimer = window.setTimeout(function () {
        stamp.classList.remove("bura-corner-pulse");
      }, 1350);
    }, 2500);
  }

  document.addEventListener("nav", applyRandomRecord);
  applyRandomRecord();
})();
