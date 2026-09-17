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
  }

  document.addEventListener("nav", applyRandomRecord);
  applyRandomRecord();
})();
