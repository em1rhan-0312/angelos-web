/* Angel OS site: language, theme, copy buttons. Turkish is the markup default; English comes from i18n.js. */
(function () {
  var root = document.documentElement;
  var dict = (window.ANGEL_I18N && window.ANGEL_I18N.en) || {};

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- theme ---------- */
  var savedTheme = get("angel-theme");
  if (savedTheme === "dark" || savedTheme === "light") root.setAttribute("data-theme", savedTheme);
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  var themeBtn = document.getElementById("theme-btn");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next); set("angel-theme", next);
  });

  /* ---------- language ---------- */
  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n], [data-i18n-html]"));
  nodes.forEach(function (n) { n.__tr = n.hasAttribute("data-i18n-html") ? n.innerHTML : n.textContent; });
  var titleTr = document.title;
  var langBtn = document.getElementById("lang-btn");

  function apply(lang) {
    nodes.forEach(function (n) {
      var html = n.hasAttribute("data-i18n-html");
      var key = n.getAttribute(html ? "data-i18n-html" : "data-i18n");
      var val = lang === "en" && dict[key] != null ? dict[key] : n.__tr;
      if (html) n.innerHTML = val; else n.textContent = val;
    });
    root.setAttribute("lang", lang);
    if (langBtn) { langBtn.textContent = lang === "en" ? "TR" : "EN"; langBtn.setAttribute("aria-label", lang === "en" ? "Türkçe'ye geç" : "Switch to English"); }
    var titleEn = dict["title." + (document.body.getAttribute("data-page") || "")];
    document.title = lang === "en" && titleEn ? titleEn : titleTr;
    set("angel-lang", lang);
  }
  var saved = get("angel-lang");
  var initial = saved || "en";
  if (initial === "en") apply("en"); else if (langBtn) langBtn.textContent = "EN";
  if (langBtn) langBtn.addEventListener("click", function () { apply(root.getAttribute("lang") === "en" ? "tr" : "en"); });

  /* ---------- copy buttons ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (b) {
    b.addEventListener("click", function () {
      var text = b.getAttribute("data-copy");
      var done = function () {
        var en = root.getAttribute("lang") === "en";
        var old = b.textContent; b.textContent = en ? "Copied" : "Kopyalandı";
        setTimeout(function () { b.textContent = old; }, 1600);
      };
      var fallback = function () {
        var t = b.closest(".contact-row"); var h = t && t.querySelector(".handle");
        if (h && window.getSelection) { var r = document.createRange(); r.selectNodeContents(h); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    });
  });
})();
