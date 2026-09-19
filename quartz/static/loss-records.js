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
    var isEnglish = document.documentElement.lang === 'en';
    nav.setAttribute('aria-label', isEnglish ? 'Lost property record pages' : 'Kayıp kayıtları sayfaları');

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
      button.setAttribute('aria-label', (isEnglish ? 'Record page ' : 'Kayıt sayfası ') + page);
      button.addEventListener('click', function () {
        showPage(Number(this.dataset.page), true);
      });
      nav.appendChild(button);
    }

    grid.insertAdjacentElement('afterend', nav);
    showPage(1, false);
  }

  function initialiseLossApplication() {
    var form = document.querySelector('.loss-application-form');
    if (!form || form.dataset.ready === 'true') return;

    form.dataset.ready = 'true';
    var mainLabel = form.querySelector('[data-loss-main-label]');
    var placeLabel = form.querySelector('[data-loss-place-label]');
    var isEnglish = form.dataset.lang === 'en';

    function updateFormLanguage() {
      var kind = form.querySelector('input[name="bildirimTuru"]:checked');
      var isFound = kind && (kind.value === 'Buluntu' || kind.value === 'Found');
      if (mainLabel) mainLabel.textContent = isEnglish ? (isFound ? 'What did you find?' : 'What did you lose?') : (isFound ? 'Ne buldunuz?' : 'Ne kaybettiniz?');
      if (placeLabel) {
        placeLabel.textContent = isEnglish ? (isFound ? 'Where did you come across it?' : 'Where did you last see it?') : (isFound ? 'Nerede karşınıza çıktı?' : 'En son nerede gördünüz?');
      }
    }

    form.querySelectorAll('input[name="bildirimTuru"]').forEach(function (radio) {
      radio.addEventListener('change', updateFormLanguage);
    });
    updateFormLanguage();

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var status = form.querySelector('.loss-form-status');
      var button = form.querySelector('.loss-submit');
      var endpoint = form.dataset.formEndpoint;

      if (!endpoint) {
        if (status) status.textContent = isEnglish ? 'The reporting line is not open yet.' : 'Başvuru hattı henüz açılmadı.';
        return;
      }

      if (button) button.disabled = true;
      form.dataset.submitting = 'true';
      if (status) status.textContent = '';

      try {
        var response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) throw new Error('submission failed');

        form.reset();
        var anonymous = form.querySelector('input[name="isimsiz"]');
        if (anonymous) anonymous.checked = true;
        updateFormLanguage();
        if (status) {
          status.textContent = isEnglish ? 'Your record has been received. No guarantee has been made that it will reach its destination.' : 'Kaydınız alındı. Yerine ulaşacağına dair bir taahhüt verilmedi.';
        }
      } catch (error) {
        if (status) status.textContent = isEnglish ? 'The record could not be received. Please try again later.' : 'Kayıt alınamadı. Bir süre sonra yeniden deneyin.';
      } finally {
        if (button) button.disabled = false;
        delete form.dataset.submitting;
      }
    });
  }

  document.addEventListener('nav', function () {
    initialiseLossRecords();
    initialiseLossApplication();
  });
  initialiseLossRecords();
  initialiseLossApplication();
})();
