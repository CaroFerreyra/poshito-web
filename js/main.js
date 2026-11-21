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

  /* ---------- logo: vuelve arriba ----------
     #top es el propio nav (sticky), así que el ancla sola no hace scroll */
  document.querySelector(".nav__logo").addEventListener("click", function (e) {
    e.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0 }); // respeta scroll-behavior (suave, o sin animación con reduced motion)
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname + window.location.search);
  });

  /* ---------- sticky nav shadow ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- nav height -> --nav-h (scroll-margin de las anclas) ---------- */
  function setNavH() {
    document.documentElement.style.setProperty("--nav-h", nav.offsetHeight + "px");
  }
  setNavH();
  if ("ResizeObserver" in window) new ResizeObserver(setNavH).observe(nav);
  else window.addEventListener("resize", setNavH);

  /* ---------- placeholder images ---------- */
  $all("img").forEach(function (img) {
    function miss() { img.classList.add("is-missing"); }
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) miss();
    img.addEventListener("error", miss);
  });

  /* ---------- Instagram: últimos posteos ----------
     Si CONTACT.instagramFeed tiene una URL de feed JSON (por ejemplo de Behold.so),
     se rellenan los recuadros con los 4 posteos más recientes y cada uno abre su post.
     Si no hay feed o falla, se quedan los recuadros enlazando al perfil. */
  function loadInstagram() {
    var grid = document.getElementById("ig-grid");
    if (!grid || !C.instagramFeed || !window.fetch) return;
    fetch(C.instagramFeed)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var posts = (Array.isArray(data) ? data : (data.posts || data.data || [])).slice(0, 4);
        var tiles = $all(".ig-post", grid);
        posts.forEach(function (p, i) {
          var a = tiles[i];
          var isVideo = p.mediaType === "VIDEO" || p.media_type === "VIDEO";
          var src = (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) ||
            (isVideo ? (p.thumbnailUrl || p.thumbnail_url) : (p.mediaUrl || p.media_url)) ||
            p.thumbnailUrl || p.thumbnail_url;
          if (!a || !src) return;
          if (p.permalink) a.href = p.permalink;
          var img = a.querySelector("img");
          img.classList.remove("is-missing");
          img.alt = (p.prunedCaption || p.caption || "").slice(0, 140);
          img.src = src;
        });
      })
      .catch(function () { /* sin feed: se quedan los enlaces al perfil */ });
  }

  /* ---------- quote form ----------
     Envía la consulta con Web3Forms (CONTACT.formKey) y llega a CONTACT.email.
     Las etiquetas del mail van en español para el equipo. */
  var form = document.getElementById("quote-form");
  var sendBtn = form.querySelector('button[type="submit"]');
  var sending = false;

  function showMsg(text, ok, withEmail) {
    var msg = form.querySelector(".form__msg");
    msg.className = "form__msg" + (ok ? " is-ok" : "");
    msg.textContent = text;
    if (withEmail) {
      msg.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = "mailto:" + C.email;
      a.textContent = C.email;
      msg.appendChild(a);
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    var f = form.elements;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim());
    var invalid = [];
    if (!f.name.value.trim()) invalid.push(f.name);
    if (!emailOk) invalid.push(f.email);
    if (!f.message.value.trim()) invalid.push(f.message);
    $all(".field", form).forEach(function (fl) { fl.classList.remove("is-invalid"); });
    invalid.forEach(function (el) { el.closest(".field").classList.add("is-invalid"); });

    if (invalid.length || !f.privacy.checked) {
      showMsg(t("form.errors"), false);
      (invalid[0] || f.privacy).focus();
      return;
    }

    var name = f.name.value.trim();
    var data = {
      access_key: C.formKey,
      subject: "Nueva consulta de " + name + " · Web Poshito",
      from_name: "Web Poshito",
      replyto: f.email.value.trim(),
      botcheck: f.botcheck.checked ? "1" : "",
      "Nombre": name,
      "Email": f.email.value.trim(),
      "Teléfono": f.phone.value.trim() || "-",
      "Tipo de evento": f.type.value.trim() || "-",
      "Fecha": f.date.value || "-",
      "Invitados": f.guests.value || "-",
      "Mensaje": f.message.value.trim(),
      "Idioma de la web": current.toUpperCase()
    };

    sending = true;
    sendBtn.disabled = true;
    showMsg(t("form.sending"), true);

    // FormData: envío simple, sin petición previa (preflight) del navegador
    var body = new FormData();
    Object.keys(data).forEach(function (k) { body.append(k, data[k]); });

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: body
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.success) throw new Error(res.message);
        form.reset();
        showMsg(t("form.sent"), true);
      })
      .catch(function () { showMsg(t("form.fail"), false, true); })
      .then(function () { sending = false; sendBtn.disabled = false; });
  });

  /* ---------- init ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  applyContact();
  setLang(initialLang(), false);
  loadInstagram();
})();
