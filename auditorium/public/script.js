// Landing auditorium : preloader, parallaxe, apparitions au défilement et envoi du formulaire vers /api/contact.
document.documentElement.classList.add("js");
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Preloader : le logo et la pile de photos apparaissent, les photos du dessus s'effacent
// une à une, puis l'écran vert se retire (même rythme que le site vitrine, environ 2,5 s).
(function preloader() {
  var root = document.documentElement;
  var el = document.querySelector(".preloader");
  if (!el || !root.classList.contains("is-loading")) return;
  var imgs = [].slice.call(el.querySelectorAll(".preloader__img")).reverse(); // du dessus vers le dessous
  var heroReady = new Promise(function (resolve) {
    var hero = document.querySelector(".hero__img");
    if (!hero || hero.complete) return resolve();
    hero.addEventListener("load", resolve); hero.addEventListener("error", resolve);
    setTimeout(resolve, 3500);
  });
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  requestAnimationFrame(function () { el.classList.add("is-on"); });
  wait(500)
    .then(function () {
      return imgs.slice(0, -1).reduce(function (p, img) {
        return p.then(function () { img.classList.add("is-hidden"); return wait(280); });
      }, wait(250));
    })
    .then(function () { return Promise.all([heroReady, wait(450)]); })
    .then(function () { el.classList.add("is-out"); return wait(300); })
    .then(function () {
      el.classList.add("is-done");
      root.classList.remove("is-loading");
      return wait(400);
    })
    .then(function () { el.remove(); });
  // Filet de sécurité : la page ne reste jamais bloquée derrière le preloader
  setTimeout(function () { root.classList.remove("is-loading"); if (el.parentNode) el.remove(); }, 6000);
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
  var items = document.querySelectorAll(".reveal");
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
