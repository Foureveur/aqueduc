// Landing auditorium : apparitions au défilement et envoi du formulaire vers /api/contact.
document.documentElement.classList.add("js");

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
