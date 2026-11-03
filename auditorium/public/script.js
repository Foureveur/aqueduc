// Landing auditorium : preloader, parallaxe, apparitions au défilement et envoi du formulaire vers /api/contact.
document.documentElement.classList.add("js");
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Preloader : même chronologie que l'interaction Webflow du site vitrine.
// 0 s logo et cadre apparaissent ; 0,5 / 0,75 / 1 / 1,25 s les photos du dessus disparaissent ;
// 2 s le cadre s'agrandit jusqu'au plein écran (1,5 s) ; 3,5 s fondu de l'écran (0,25 s), le menu
// réapparaît et le titre glisse depuis le bas.
(function preloader() {
  var root = document.documentElement;
  var el = document.querySelector(".preloader");
  var title = document.querySelector(".hero__title");
  if (!el || !root.classList.contains("is-loading")) { if (el) el.remove(); return; }
  if (title) title.classList.add("is-pending");
  var imgs = [].slice.call(el.querySelectorAll(".preloader__img")).reverse(); // du dessus vers le dessous
  var at = function (ms, fn) { setTimeout(fn, ms); };
  requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("is-on"); }); });
  imgs.slice(0, -1).forEach(function (img, i) { at(500 + i * 250, function () { img.classList.add("is-hidden"); }); });
  at(2000, function () { el.classList.add("is-expand"); });
  at(3500, function () {
    el.classList.add("is-done");
    root.classList.remove("is-loading");
    if (title) title.classList.remove("is-pending");
  });
  at(3800, function () { el.remove(); });
})();

// Parallaxe légère : chaque image marquée data-parallax glisse un peu moins vite que la page.
(function parallax() {
  if (reduceMotion) return;
  var items = [].slice.call(document.querySelectorAll("[data-parallax]"));
  if (!items.length) return;
  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    items.forEach(function (img) {
      // Photo d'ouverture : cadrée exactement comme la dernière image du preloader, elle descend
      // simplement moins vite que la page (aucun décalage tant que la page n'a pas défilé).
      if (img.classList.contains("hero__img")) {
        var y = Math.min(window.scrollY, vh);
        img.style.transform = "translate3d(0," + (y * 0.3).toFixed(1) + "px,0)";
        return;
      }
      var box = (img.closest("figure") || img.parentElement).getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      var progress = (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2); // -1 → 1
      var range = img.closest("figure") ? 5 : 7; // en % de la hauteur de l'image
      var scale = img.closest("figure") ? " scale(1.12)" : "";
      img.style.transform = "translate3d(0," + (progress * -range).toFixed(2) + "%,0)" + scale;
    });
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();

(function reveal() {
  document.querySelectorAll("[data-stagger]").forEach(function (box) {
    [].forEach.call(box.children, function (child, i) { child.style.setProperty("--i", Math.min(i, 10)); });
  });
  var items = document.querySelectorAll(".reveal, [data-stagger]");
  if (!("IntersectionObserver" in window)) { items.forEach(function (el) { el.classList.add("is-in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { io.observe(el); });
})();

(function contactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("f-status");
  var submit = document.getElementById("f-submit");
  var required = ["f-nom", "f-societe", "f-email"];

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = "form__status" + (kind ? " is-" + kind : "");
  }

  // Un bouton « Formule » du site (cartes de prix) préremplit le choix correspondant
  document.querySelectorAll('a[href="#demande"][data-formule]').forEach(function (a) {
    a.addEventListener("click", function () {
      var r = form.querySelector('input[name="formule"][value="' + a.dataset.formule + '"]');
      if (r) { r.checked = true; document.getElementById("f-more").open = true; }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstInvalid = null;
    required.forEach(function (id) {
      var el = document.getElementById(id);
      var ok = el.value.trim() !== "" && (el.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok && !firstInvalid) firstInvalid = el;
    });
    var consent = document.getElementById("f-consent");
    if (!firstInvalid && !consent.checked) firstInvalid = consent;
    if (firstInvalid) {
      setStatus(firstInvalid === consent ? "Merci d'accepter l'utilisation de vos coordonnées pour que nous puissions vous répondre." : "Merci de renseigner votre nom, votre société et une adresse e-mail valide.", "error");
      firstInvalid.focus();
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = typeof v === "string" ? v.trim() : v; });
    data.consent = consent.checked;
    submit.disabled = true;
    setStatus("Envoi en cours…");

    fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.body.error || "Envoi impossible");
        form.classList.add("is-sent");
        setStatus("Merci, votre demande est bien envoyée. David Codazzi revient vers vous très vite.", "ok");
      })
      .catch(function (err) {
        submit.disabled = false;
        setStatus((err && err.message) + ". Vous pouvez aussi écrire à d.codazzi@polaris-op.com ou appeler le +33 6 44 26 89 04.", "error");
      });
  });
})();

// Galerie : script du slider Flickity « cards » de la bibliothèque Partiqle (osmo-flickity-slider),
// identique à celui de laqueduc.work/experience.
(function initFlickitySlider() {
  if (typeof Flickity === "undefined") return;
  document.querySelectorAll('[data-flickity-type="cards"]').forEach(function (slider, index) {
    slider.id = "flickity-type-cards-id-" + index;
    slider.setAttribute("data-flickity-count", slider.querySelectorAll("[data-flickity-item]").length);
    slider.setAttribute("data-flickity-status", "active");
    var sliderEl = slider.querySelector("[data-flickity-list]");
    if (!sliderEl) return;
    var prevButton = slider.querySelector('[data-flickity-control="prev"]');
    var nextButton = slider.querySelector('[data-flickity-control="next"]');
    var flickity = new Flickity(sliderEl, {
      watchCSS: true, contain: true, wrapAround: false, dragThreshold: 10,
      prevNextButtons: false, pageDots: false, cellAlign: "left",
      selectedAttraction: 0.015, friction: 0.25, percentPosition: true, freeScroll: false,
      on: {
        dragStart: function () { sliderEl.style.pointerEvents = "none"; },
        dragEnd: function () { sliderEl.style.pointerEvents = "auto"; },
        change: function () { updateArrows(); updateDots(); }
      }
    });
    function cols() { return parseInt(getComputedStyle(sliderEl).getPropertyValue("--flick-col"), 10) || 1; }
    function updateArrows() {
      var atStart = !flickity.cells[flickity.selectedIndex - 1];
      var atEnd = !flickity.cells[flickity.selectedIndex + cols()];
      if (prevButton) atStart ? prevButton.setAttribute("disabled", "") : prevButton.removeAttribute("disabled");
      if (nextButton) atEnd ? nextButton.setAttribute("disabled", "") : nextButton.removeAttribute("disabled");
    }
    var dots = slider.querySelectorAll("[data-flickity-dot]");
    function updateDots() {
      var maxIndex = flickity.cells.length - cols();
      var active = Math.min(flickity.selectedIndex, maxIndex);
      dots.forEach(function (dot, i) { dot.setAttribute("data-flickity-dot", i === active ? "active" : ""); });
    }
    if (prevButton) prevButton.addEventListener("click", function () { flickity.previous(); });
    if (nextButton) nextButton.addEventListener("click", function () { flickity.next(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { flickity.select(Math.min(i, flickity.cells.length - cols())); });
    });
    updateArrows();
  });
})();
