/* ============================================================
   Rick Chow — Portfolio i18n (EN / 繁體中文)
   Co-located translations: English is the inline content,
   the Traditional Chinese string lives in data-i18n / data-i18n-html.
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "rc-lang";
  var titles = {
    en: "Rick Chow — Software Engineer & Multimedia Developer",
    zh: "Rick Chow —— 軟件工程師暨多媒體開發者"
  };

  // Capture the original English content once.
  var nodes = document.querySelectorAll("[data-i18n], [data-i18n-html]");
  nodes.forEach(function (el) {
    el._enHTML = el.innerHTML;
    el._enText = el.textContent;
  });

  function apply(lang) {
    var zh = lang === "zh";
    nodes.forEach(function (el) {
      var isHtml = el.hasAttribute("data-i18n-html");
      if (zh) {
        var val = isHtml ? el.getAttribute("data-i18n-html") : el.getAttribute("data-i18n");
        if (val == null) return;
        if (isHtml) el.innerHTML = val; else el.textContent = val;
      } else {
        if (isHtml) el.innerHTML = el._enHTML; else el.textContent = el._enText;
      }
    });

    document.documentElement.lang = zh ? "zh-Hant" : "en";
    document.documentElement.classList.toggle("lang-zh", zh);
    document.title = zh ? titles.zh : titles.en;

    document.querySelectorAll(".lang-btn").forEach(function (b) {
      var active = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  // Wire up the toggle.
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { apply(b.getAttribute("data-lang")); });
  });

  // Initial language: saved preference → browser hint → English.
  var saved;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  var initial = saved || (/^zh/i.test(navigator.language || "") ? "zh" : "en");
  apply(initial);
})();
