(function () {
  var NEXT_KEY = "insan-misin-next";
  var SEEN_KEY = "insan-misin-seen";
  var FIRST_MIN_DELAY = 60000;
  var FIRST_MAX_DELAY = 120000;
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

  function hasBeenSeen() {
    try { return sessionStorage.getItem(SEEN_KEY) === "1"; } catch (e) { return false; }
  }

  function markSeen() {
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch (e) {}
  }

  // iOS Safari'de fixed-position bir overlay açıkken gövdeyi
  // overflow:hidden ile kilitleyip sonra açmak, tarayıcının
  // görünüm/yakınlaştırma senkronunu bozup sayfayı birkaç saniye
  // küçük/uzaklaştırılmış gösterebiliyor. Bunun yerine gövdeyi
  // fixed konuma alıp kaydırma konumunu saklayan daha güvenilir
  // bir kilitleme yöntemi kullanıyoruz.
  function lockScroll() {
    var scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.dataset.buraScrollY = String(scrollY);
    document.body.style.position = "fixed";
    document.body.style.top = "-" + scrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockScroll() {
    var scrollY = parseInt(document.body.dataset.buraScrollY || "0", 10);
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    delete document.body.dataset.buraScrollY;
    window.scrollTo(0, scrollY);
    refreshViewport();
  }

  // Overlay kapandıktan sonra bazı mobil tarayıcılarda görünüm alanı
  // bir süre yanlış ölçekte kalabiliyor; viewport meta etiketini
  // anlık olarak güncelleyip geri almak tarayıcıyı yeniden hesaplamaya
  // zorluyor ve sayfa hemen doğru boyuta dönüyor.
  function refreshViewport() {
    var vp = document.querySelector('meta[name="viewport"]');
    if (!vp) return;
    var content = vp.getAttribute("content");
    if (!content) return;
    vp.setAttribute("content", content + ", maximum-scale=1");
    void document.body.offsetHeight;
    vp.setAttribute("content", content);
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

    var close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Doğrulamayı kapat");
    close.style.cssText =
      "position:absolute;top:18px;right:22px;border:1px solid rgba(255,255,255,.4);" +
      "background:rgba(16,17,31,.7);color:#efe7d8;width:40px;height:40px;" +
      "font:26px/1 sans-serif;cursor:pointer;";
    close.addEventListener("click", dismissOverlay);

    overlay.appendChild(frame);
    overlay.appendChild(close);
    document.body.appendChild(overlay);
    lockScroll();
  }

  function removeOverlay() {
    var overlay = document.getElementById("insan-misin-overlay");
    if (overlay) overlay.remove();
    unlockScroll();
  }

  function dismissOverlay() {
    markSeen();
    removeOverlay();
  }

  function scheduleOverlay() {
    if (pendingTimer) clearTimeout(pendingTimer);
    if (hasBeenSeen()) return;
    if (document.getElementById("insan-misin-overlay")) return;
    var remaining = getNext() - Date.now();
    if (remaining <= 0) {
      showOverlay();
      return;
    }
    pendingTimer = setTimeout(showOverlay, remaining);
  }

  var autoCloseTimer = null;

  window.addEventListener("message", function (event) {
    if (event.data === "insan-misin-verified") {
      markSeen();
      autoCloseTimer = setTimeout(function () {
        autoCloseTimer = null;
        removeOverlay();
      }, 3200);
    } else if (event.data === "insan-misin-close") {
      // Kullanıcı "Bura'ya dön"e tıkladı: beklemeden hemen kapat.
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
      }
      dismissOverlay();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.getElementById("insan-misin-overlay")) {
      dismissOverlay();
    }
  });

  // enableSPA keeps this script's timers alive across client-side navigation,
  // but re-check on "nav" too in case the deadline passed while content loaded.
  document.addEventListener("nav", scheduleOverlay);

  scheduleOverlay();
})();
