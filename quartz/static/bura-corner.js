(function () {
  var RECORDS = [
    {
      kayit: "KAYIT 001 / ZAMAN",
      title: "Bulunduğu yer: 06:17 otobüsü",
      desc: "Birinin işe gitmeden önceki on dakikası.",
    },
    {
      kayit: "KAYIT 002",
      title: "Bulunduğu yer: C-4 raf aralığı",
      desc: "8 dakikalık dalgınlık.",
    },
    {
      kayit: "KAYIT 003 / BEDEN",
      title: "Bulunduğu yer: Migros Kasası",
      desc: "Kasiyerin müşterilere söylemekten vazgeçtiği cümleler.",
    },
  ];

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
    var record = RECORDS[Math.floor(Math.random() * RECORDS.length)];
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
