(function () {
  var NEXT_KEY = "insan-misin-next";
  var FIRST_MIN_DELAY = 5000;
  var FIRST_MAX_DELAY = 10000;
  var REPEAT_DELAY = 30 * 60 * 1000; // 30 dakika
  var pendingTimer = null;

  function getNext() {
    try {
      var stored = sessionStorage.getItem(NEXT_KEY);
      if (stored) return parseInt(stored, 10);
      var next = Date.now() + FIRST_MIN_DELAY + Math.random() * (FIRST_MAX_DELAY - FIRST_MIN_DELAY);
      sessionStorage.setItem(NEXT_KEY, String(next));
      return next;
    } catch (e) {
      return Date.now() + FIRST_MIN_DELAY;
    }
  }

  function setNext(delayMs) {
    try {
      sessionStorage.setItem(NEXT_KEY, String(Date.now() + delayMs));
    } catch (e) {}
  }

  function showOverlay() {
    if (document.getElementById("insan-misin-overlay")) return;

    var basePath = (document.body.dataset.basepath || "").replace(/\/$/, "");

    var overlay = document.createElement("div");
    overlay.id = "insan-misin-overlay";
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:9999;background:rgba(16,17,31,.88);" +
      "backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);" +
      "display:flex;align-items:center;justify-content:center;padding:16px;";

    var frame = document.createElement("iframe");
    frame.src = basePath + "/static/insan-misin/?embed=1";
    frame.title = "İnsan olduğunu doğrula";
    frame.style.cssText =
      "width:min(92vw,440px);height:min(90vh,560px);border:0;" +
      "background:#faf9f5;box-shadow:0 20px 60px rgba(0,0,0,.5);";

    overlay.appendChild(frame);
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = "hidden";
  }

  function removeOverlay() {
    var overlay = document.getElementById("insan-misin-overlay");
    if (overlay) overlay.remove();
    document.documentElement.style.overflow = "";
  }

  function scheduleOverlay() {
    if (pendingTimer) clearTimeout(pendingTimer);
    if (document.getElementById("insan-misin-overlay")) return;
    var remaining = getNext() - Date.now();
    if (remaining <= 0) {
      showOverlay();
      return;
    }
    pendingTimer = setTimeout(showOverlay, remaining);
  }

  window.addEventListener("message", function (event) {
    if (event.data === "insan-misin-verified") {
      setNext(REPEAT_DELAY);
      setTimeout(function () {
        removeOverlay();
        scheduleOverlay();
      }, 3200);
    }
  });

  // enableSPA keeps this script's timers alive across client-side navigation,
  // but re-check on "nav" too in case the deadline passed while content loaded.
  document.addEventListener("nav", scheduleOverlay);

  scheduleOverlay();
})();
