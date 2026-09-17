(function () {
  var PAGE_SIZE = 6;

  function initialiseLossRecords() {
    var grid = document.querySelector('.loss-records');
    if (!grid || grid.dataset.paginationReady === 'true') return;

    var records = Array.from(grid.querySelectorAll('.loss-record'));
    if (records.length <= PAGE_SIZE) return;

    grid.dataset.paginationReady = 'true';
    var pageCount = Math.ceil(records.length / PAGE_SIZE);
    var nav = document.createElement('nav');
    nav.className = 'loss-pagination';
    nav.setAttribute('aria-label', 'Kayıp kayıtları sayfaları');

    function showPage(page, shouldScroll) {
      records.forEach(function (record, index) {
        record.hidden = index < (page - 1) * PAGE_SIZE || index >= page * PAGE_SIZE;
        var details = record.querySelector('details[open]');
        if (details) details.open = false;
      });

      nav.querySelectorAll('button').forEach(function (button) {
        var active = Number(button.dataset.page) === page;
        button.setAttribute('aria-current', active ? 'page' : 'false');
      });

      if (shouldScroll) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    for (var page = 1; page <= pageCount; page += 1) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(page);
      button.dataset.page = String(page);
      button.setAttribute('aria-label', 'Kayıt sayfası ' + page);
      button.addEventListener('click', function () {
        showPage(Number(this.dataset.page), true);
      });
      nav.appendChild(button);
    }

    grid.insertAdjacentElement('afterend', nav);
    showPage(1, false);
  }

  document.addEventListener('nav', initialiseLossRecords);
  initialiseLossRecords();
})();
