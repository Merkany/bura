(function () {
  function initialiseStoryPage() {
    if (!document.body || document.body.dataset.pageType !== 'story') return;

    document.querySelectorAll('.explorer').forEach(function (explorer) {
      explorer.classList.add('collapsed');
      explorer.setAttribute('aria-expanded', 'false');
      explorer.querySelectorAll('.explorer-toggle').forEach(function (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        if (toggle.dataset.storyToggleReady === 'true') return;
        toggle.dataset.storyToggleReady = 'true';
        toggle.addEventListener('click', function () {
          var willOpen = explorer.classList.contains('collapsed');
          toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
      });
    });
  }

  document.addEventListener('nav', initialiseStoryPage);
  initialiseStoryPage();
})();
