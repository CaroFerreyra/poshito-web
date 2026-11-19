(function () {
  "use strict";

  var C = window.CONTACT;
  var T = window.I18N;
  var LANGS = ["en", "es", "nl"];
  var DEFAULT = "en";
  var current = DEFAULT;

  /* ---------- helpers ---------- */
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function t(key) { return (T[current] && T[current][key]) || T[DEFAULT][key] || ""; }
  function storeGet() { try { return localStorage.getItem("poshito-lang"); } catch (e) { return null; } }
  function storeSet(v) { try { localStorage.setItem("poshito-lang", v); } catch (e) {} }

  /* ---------- contact data + links ---------- */
  function waLink() {
    return "https://wa.me/" + C.whatsappNumber + "?text=" + encodeURIComponent(t("wa.text"));
  }
  function applyContact() {
    $all('[data-contact="phone"]').forEach(function (el) { el.textContent = C.phoneDisplay; });
    $all('[data-contact="email"]').forEach(function (el) { el.textContent = C.email; });
    $all('[data-contact="ig"]').forEach(function (el) { el.textContent = "@" + C.instagram; });
    $all('[data-link="ig"]').forEach(function (el) { el.href = "https://www.instagram.com/" + C.instagram + "/"; });
    $all('[data-link="mail"]').forEach(function (el) { el.href = "mailto:" + C.email; });
    $all('[data-link="wa"]').forEach(function (el) { el.href = waLink(); });
  }

  /* ---------- i18n ---------- */
  function setLang(lang, save) {
    if (LANGS.indexOf(lang) === -1) lang = DEFAULT;
    current = lang;
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.description"));

    $all("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v) el.textContent = v;
    });
    $all("[data-i18n-ph]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-ph"));
      if (v) el.setAttribute("placeholder", v);
    });
    $all(".lang__btn").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    // WhatsApp prefilled text follows the language
    $all('[data-link="wa"]').forEach(function (el) { el.href = waLink(); });

    if (save) {
      storeSet(lang);
      var url = new URL(window.location.href);
      if (lang === DEFAULT) url.searchParams.delete("lang"); else url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url.toString());
    }
    // reset form message on language change
    var msg = document.querySelector(".form__msg");
    if (msg) { msg.textContent = ""; msg.className = "form__msg"; }
  }

  function initialLang() {
    var p = new URLSearchParams(window.location.search).get("lang");
    if (p && LANGS.indexOf(p) > -1) return p;
    var s = storeGet();
    if (s && LANGS.indexOf(s) > -1) return s;
    return DEFAULT; // English by default
  }

  $all(".lang__btn").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); });
  });

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector(".nav__burger");
  var links = document.getElementById("nav-links");
  function closeMenu() { links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $all("a", links).forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- sticky nav shadow ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- placeholder images ---------- */
  $all("img").forEach(function (img) {
    function miss() { img.classList.add("is-missing"); }
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) miss();
    img.addEventListener("error", miss);
  });

  /* ---------- quote form ----------
     De momento abre el correo del usuario con la consulta ya escrita (mailto).
     Cuando elijáis servicio (Formspree, Web3Forms…), se cambia solo esta función. */
  var form = document.getElementById("quote-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = form.querySelector(".form__msg");
    var f = form.elements;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim());
    var invalid = [];
    if (!f.name.value.trim()) invalid.push(f.name);
    if (!emailOk) invalid.push(f.email);
    if (!f.message.value.trim()) invalid.push(f.message);
    $all(".field", form).forEach(function (fl) { fl.classList.remove("is-invalid"); });
    invalid.forEach(function (el) { el.closest(".field").classList.add("is-invalid"); });

    if (invalid.length || !f.privacy.checked) {
      msg.className = "form__msg";
      msg.textContent = t("form.errors");
      (invalid[0] || f.privacy).focus();
      return;
    }

    var lines = [
      t("form.name") + ": " + f.name.value.trim(),
      t("form.email") + ": " + f.email.value.trim(),
      t("form.phone") + ": " + f.phone.value.trim(),
      t("form.type") + ": " + f.type.value.trim(),
      t("form.date") + ": " + f.date.value,
      t("form.guests") + ": " + f.guests.value,
      "",
      t("form.message") + ":",
      f.message.value.trim()
    ];
    var subject = t("form.subject") + " · " + f.name.value.trim();
    window.location.href = "mailto:" + C.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));

    msg.className = "form__msg is-ok";
    msg.textContent = t("form.sent") + " ";
    var a = document.createElement("a");
    a.href = "mailto:" + C.email;
    a.textContent = C.email;
    msg.appendChild(a);
  });

  /* ---------- init ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  applyContact();
  setLang(initialLang(), false);
})();
